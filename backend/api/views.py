import math
import random
import os
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
import cloudinary
import cloudinary.uploader

from .models import (
    UserProfile,
    Farm,
    Crop,
    Field,
    Sensor,
    Measurement,
    VRAPrescription,
    VRAZone,
    YieldForecast,
    PhenologicalStage,
    WeatherScenario,
)
from .serializers import (
    UserProfileSerializer,
    FarmSerializer,
    CropSerializer,
    FieldSerializer,
    SensorSerializer,
    MeasurementSerializer,
    VRAPrescriptionSerializer,
    VRAZoneSerializer,
    YieldForecastSerializer,
)


class MultiLookupMixin:
    """Allows looking up by slug first, then fallback to id."""
    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs[lookup_url_kwarg]
        
        # Try slug
        obj = queryset.filter(slug=val).first()
        if obj:
            self.check_object_permissions(self.request, obj)
            return obj
        
        # Try id if numeric
        if val.isdigit():
            obj = queryset.filter(pk=int(val)).first()
            if obj:
                self.check_object_permissions(self.request, obj)
                return obj
                
        # Try code if starts with #
        obj = queryset.filter(code=val).first()
        if obj:
            self.check_object_permissions(self.request, obj)
            return obj

        return get_object_or_404(queryset, slug=val)


class FarmViewSet(viewsets.ModelViewSet):
    queryset = Farm.objects.all().order_by('id')
    serializer_class = FarmSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Farm.objects.filter(owner=self.request.user).order_by('id')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all().order_by('id')
    serializer_class = CropSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Crop.objects.filter(owner=self.request.user).order_by('id')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FieldViewSet(MultiLookupMixin, viewsets.ModelViewSet):
    queryset = Field.objects.all().order_by('-created_at')
    serializer_class = FieldSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_authenticated:
            return qs.none()
        qs = qs.filter(owner=self.request.user)
        region = self.request.query_params.get('region')
        crop = self.request.query_params.get('crop')
        status_filter = self.request.query_params.get('status')
        if region:
            qs = qs.filter(region__iexact=region)
        if crop:
            qs = qs.filter(crop_type__icontains=crop)
        if status_filter:
            qs = qs.filter(status__iexact=status_filter)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @staticmethod
    def _normalize_geometry(data):
        """Accept existing [lat, lng] coordinates or a GeoJSON Polygon."""
        data = data.copy()
        boundary = data.get('boundaryGeojson') or data.get('boundary_geojson')
        if boundary and 'coordinates' not in data:
            geometry = boundary.get('geometry', boundary) if isinstance(boundary, dict) else {}
            if geometry.get('type') != 'Polygon':
                raise ValidationError({'boundaryGeojson': 'Only GeoJSON Polygon geometry is supported.'})
            rings = geometry.get('coordinates') or []
            if not rings or not isinstance(rings[0], list):
                raise ValidationError({'boundaryGeojson': 'Polygon must contain an outer ring.'})
            data['coordinates'] = [[point[1], point[0]] for point in rings[0] if len(point) >= 2]
        if 'coordinates' in data:
            coordinates = data['coordinates']
            if not isinstance(coordinates, list) or len(coordinates) < 3:
                raise ValidationError({'coordinates': 'At least three coordinate pairs are required.'})
            try:
                data['coordinates'] = [[float(point[0]), float(point[1])] for point in coordinates]
            except (TypeError, ValueError, IndexError):
                raise ValidationError({'coordinates': 'Coordinates must be numeric [lat, lng] pairs.'})
            if any(abs(point[0]) > 90 or abs(point[1]) > 180 for point in data['coordinates']):
                raise ValidationError({'coordinates': 'Latitude/longitude values are out of range.'})
        return data

    @staticmethod
    def _normalize_payload(data):
        """Accept both the API's camelCase fields and model-style snake_case aliases."""
        data = data.copy()
        aliases = {
            'crop_type': 'crop',
            'area_ha': 'areaHa',
            'sown_date': 'sownDate',
            'soil_type': 'soilType',
            'irrigation_type': 'irrigationType',
            'ndvi_trend': 'ndviTrend',
            'moisture_pct': 'moisturePct',
            'target_yield_t_ha': 'targetYieldTha',
            'est_yield_t_ha': 'estYieldTha',
            'health_alert': 'healthAlert',
            'health_alert_detail': 'healthAlertDetail',
            'urgent_action': 'urgentAction',
            'fill_color': 'fillColor',
            'boundary_geojson': 'boundaryGeojson',
        }
        for source, target in aliases.items():
            if source in data and target not in data:
                data[target] = data[source]
        return data

    @classmethod
    def _geometry_metadata(cls, coordinates):
        area_ha = cls._area_ha(coordinates)
        center = [
            round(sum(point[0] for point in coordinates) / len(coordinates), 5),
            round(sum(point[1] for point in coordinates) / len(coordinates), 5),
        ]
        ring = [[point[1], point[0]] for point in coordinates]
        if ring and ring[0] != ring[-1]:
            ring.append(ring[0])
        return area_ha, center, {
            'type': 'Polygon',
            'coordinates': [ring],
        }

    @staticmethod
    def _area_ha(coordinates):
        ring = coordinates[:-1] if coordinates and coordinates[0] == coordinates[-1] else coordinates
        R = 6378137.0
        area = 0.0
        for i in range(len(ring)):
            j = (i + 1) % len(ring)
            lat1, lat2 = math.radians(ring[i][0]), math.radians(ring[j][0])
            lon1, lon2 = math.radians(ring[i][1]), math.radians(ring[j][1])
            area += (lon2 - lon1) * (2.0 + math.sin(lat1) + math.sin(lat2))
        return round(abs((area * R * R) / 2.0) / 10000.0, 1)

    def create(self, request, *args, **kwargs):
        # Support payload with camelCase or snake_case
        data = self._normalize_payload(self._normalize_geometry(request.data))
        
        coords = data.get('coordinates', [])
        if coords:
            area_ha, center, boundary = self._geometry_metadata(coords)
            data['areaHa'] = area_ha
            data['center'] = center
            data['boundaryGeojson'] = boundary

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        data = self._normalize_payload(self._normalize_geometry(request.data))
        if 'coordinates' in data:
            area_ha, center, boundary = self._geometry_metadata(data['coordinates'])
            data['areaHa'] = area_ha
            data['center'] = center
            data['boundaryGeojson'] = boundary
        serializer = self.get_serializer(self.get_object(), data=data, partial=kwargs.pop('partial', False))
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def geojson(self, request, slug=None):
        """Returns single field as GeoJSON Feature."""
        field = self.get_object()
        # GeoJSON expects coordinates as [longitude, latitude]
        lng_lat_coords = [[c[1], c[0]] for c in field.coordinates if len(c) >= 2]
        if lng_lat_coords and lng_lat_coords[0] != lng_lat_coords[-1]:
            lng_lat_coords.append(lng_lat_coords[0])

        feature = {
            "type": "Feature",
            "properties": {
                "id": field.slug,
                "code": field.code,
                "name": field.name,
                "region": field.region,
                "crop": field.crop_type,
                "variety": field.variety,
                "area_ha": field.area_ha,
                "status": field.status,
                "ndvi": field.ndvi,
                "soil_type": field.soil_type,
                "irrigation_type": field.irrigation_type,
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [lng_lat_coords] if lng_lat_coords else []
            }
        }
        return Response(feature)

    @action(detail=False, methods=['get'])
    def geojson_collection(self, request):
        """Returns all fields as GeoJSON FeatureCollection."""
        features = []
        for field in self.get_queryset():
            lng_lat_coords = [[c[1], c[0]] for c in field.coordinates if len(c) >= 2]
            if lng_lat_coords and lng_lat_coords[0] != lng_lat_coords[-1]:
                lng_lat_coords.append(lng_lat_coords[0])

            features.append({
                "type": "Feature",
                "properties": {
                    "id": field.slug,
                    "code": field.code,
                    "name": field.name,
                    "region": field.region,
                    "crop": field.crop_type,
                    "variety": field.variety,
                    "area_ha": field.area_ha,
                    "status": field.status,
                    "ndvi": field.ndvi,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [lng_lat_coords] if lng_lat_coords else []
                }
            })

        return Response({
            "type": "FeatureCollection",
            "features": features
        })

    @action(detail=True, methods=['get'])
    def kml(self, request, slug=None):
        """Export parcel boundary as KML file."""
        field = self.get_object()
        # Format KML coordinates: lon,lat,alt
        coord_strings = []
        for c in field.coordinates:
            if len(c) >= 2:
                coord_strings.append(f"{c[1]},{c[0]},0")
        if coord_strings and coord_strings[0] != coord_strings[-1]:
            coord_strings.append(coord_strings[0])
        coords_joined = " ".join(coord_strings)

        kml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>{field.name}</name>
    <description>AROVOLY - Precision Agriculture Parcel {field.code}</description>
    <Style id="agriPoly">
      <LineStyle>
        <color>ff009605</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>7f10b981</color>
      </PolyStyle>
    </Style>
    <Placemark>
      <name>{field.name}</name>
      <styleUrl>#agriPoly</styleUrl>
      <ExtendedData>
        <Data name="Crop"><value>{field.crop_type} ({field.variety})</value></Data>
        <Data name="AreaHa"><value>{field.area_ha}</value></Data>
        <Data name="Status"><value>{field.status}</value></Data>
        <Data name="NDVI"><value>{field.ndvi}</value></Data>
      </ExtendedData>
      <Polygon>
        <extrude>1</extrude>
        <altitudeMode>clampToGround</altitudeMode>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>{coords_joined}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>"""
        response = HttpResponse(kml_content, content_type='application/vnd.google-earth.kml+xml')
        response['Content-Disposition'] = f'attachment; filename="{field.slug}.kml"'
        return response


class SensorViewSet(MultiLookupMixin, viewsets.ModelViewSet):
    queryset = Sensor.objects.all().order_by('-last_synced')
    serializer_class = SensorSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Sensor.objects.filter(field__owner=self.request.user).order_by('-last_synced')

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Link parcel
        parcel_id = data.get('parcelId') or data.get('parcel_id')
        if parcel_id:
            field = Field.objects.filter(slug=parcel_id, owner=request.user).first()
            if not field and str(parcel_id).isdigit():
                field = Field.objects.filter(pk=int(parcel_id), owner=request.user).first()
            if field:
                data['field_id'] = field.id
            else:
                raise ValidationError({'parcelId': 'Parcelle introuvable ou inaccessible.'})

        if 'stationCode' in data:
            data['station_code'] = data['stationCode']
        if 'batteryPct' in data:
            data['battery_pct'] = data['batteryPct']
        if 'signalDbm' in data:
            data['signal_dbm'] = data['signalDbm']
        if 'irrigationThreshold' in data:
            data['irrigation_threshold'] = data['irrigationThreshold']

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        sensor = serializer.save()

        # Create initial baseline measurement
        Measurement.objects.create(
            sensor=sensor,
            moisture_10cm=data.get('moisture10cm', 38.0),
            moisture_30cm=data.get('moisture30cm', 41.0),
            moisture_60cm=data.get('moisture60cm', 45.0),
            temperature_c=data.get('temperatureC', 24.5),
            matric_potential_kpa=data.get('matricPotentialKPa', -28.0),
            salinity_ec=data.get('salinityEC', 0.40),
        )

        return Response(self.get_serializer(sensor).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def telemetry(self, request, slug=None):
        """Ingest real-time LoRaWAN/IoT measurement packet."""
        sensor = self.get_object()
        data = request.data

        measurement = Measurement.objects.create(
            sensor=sensor,
            moisture_10cm=float(data.get('moisture_10cm', data.get('moisture10cm', 38.0))),
            moisture_30cm=float(data.get('moisture_30cm', data.get('moisture30cm', 41.0))),
            moisture_60cm=float(data.get('moisture_60cm', data.get('moisture60cm', 45.0))),
            temperature_c=float(data.get('temperature_c', data.get('temperatureC', 24.0))),
            matric_potential_kpa=float(data.get('matric_potential_kpa', data.get('matricPotentialKPa', -28.0))),
            salinity_ec=float(data.get('salinity_ec', data.get('salinityEC', 0.40))),
        )

        if 'battery_pct' in data or 'batteryPct' in data:
            sensor.battery_pct = int(data.get('battery_pct', data.get('batteryPct', sensor.battery_pct)))
        if 'signal_dbm' in data or 'signalDbm' in data:
            sensor.signal_dbm = int(data.get('signal_dbm', data.get('signalDbm', sensor.signal_dbm)))
        sensor.save()

        return Response({
            "status": "success",
            "message": f"Telemetry ingested for {sensor.station_code}",
            "measurement": MeasurementSerializer(measurement).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def simulate(self, request):
        """Simulate realistic sensor fluctuations for all online probes."""
        updated = 0
        for sensor in self.get_queryset():
            latest = sensor.measurements.first()
            base_m10 = latest.moisture_10cm if latest else 38.0
            base_temp = latest.temperature_c if latest else 24.0

            # Realistic small jitter
            m10 = max(15.0, min(50.0, round(base_m10 + random.uniform(-0.8, 0.8), 1)))
            temp = max(18.0, min(35.0, round(base_temp + random.uniform(-0.4, 0.4), 1)))

            Measurement.objects.create(
                sensor=sensor,
                moisture_10cm=m10,
                moisture_30cm=round(m10 + 2.5, 1),
                moisture_60cm=round(m10 + 6.0, 1),
                temperature_c=temp,
                matric_potential_kpa=round(-25.0 - (50 - m10) * 0.8, 1),
                salinity_ec=round(0.38 + random.uniform(-0.02, 0.02), 2),
            )
            # Battery drain simulation
            if random.random() < 0.1 and sensor.battery_pct > 10:
                sensor.battery_pct -= 1
                sensor.save()
            updated += 1

        return Response({
            "status": "simulated",
            "probes_updated": updated,
            "sensors": SensorSerializer(Sensor.objects.all(), many=True).data
        })


class MeasurementViewSet(viewsets.ModelViewSet):
    queryset = Measurement.objects.all().order_by('-recorded_at')
    serializer_class = MeasurementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Measurement.objects.filter(sensor__field__owner=self.request.user).order_by('-recorded_at')
        sensor_id = self.request.query_params.get('sensor')
        if sensor_id:
            qs = qs.filter(sensor__slug=sensor_id) | qs.filter(sensor_id=sensor_id)
        return qs


class VRAPrescriptionViewSet(viewsets.ModelViewSet):
    queryset = VRAPrescription.objects.all().order_by('-date_prescribed')
    serializer_class = VRAPrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VRAPrescription.objects.filter(field__owner=self.request.user).order_by('-date_prescribed')

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get the active prescription for a given parcel."""
        parcel_id = request.query_params.get('parcel_id')
        if not parcel_id:
            prescription = self.get_queryset().first()
        else:
            prescription = self.get_queryset().filter(field__slug=parcel_id).first()
        if not prescription:
            return Response({"error": "No prescription found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(self.get_serializer(prescription).data)

    @action(detail=False, methods=['post'])
    def calculate(self, request):
        """Recalculate VRA modulation and savings based on base fertilizer rate."""
        parcel_id = request.data.get('parcel_id')
        base_rate = float(request.data.get('base_rate_kg_ha', 180.0))
        cost_per_kg = float(request.data.get('cost_per_kg', 0.68))

        field = Field.objects.filter(slug=parcel_id, owner=request.user).first()
        if not field:
            return Response({'detail': 'Parcelle introuvable ou inaccessible.'}, status=status.HTTP_404_NOT_FOUND)

        prescription = VRAPrescription.objects.filter(field=field).first()
        if not prescription:
            prescription = VRAPrescription.objects.create(
                field=field,
                base_rate_kg_ha=base_rate,
                fertilizer_type='Urée 46% (N) & NPK',
            )

        zones = prescription.zones.all()
        total_area = field.area_ha if field else 485.0
        standard_kg = total_area * base_rate
        optimized_kg = 0.0

        updated_zones = []
        for zone in zones:
            rec_rate = round(base_rate * (1 + (zone.delta_pct / 100.0)), 1)
            zone.target_rate_kg_ha = base_rate
            zone.recommended_rate_kg_ha = rec_rate
            zone.save()
            zone_fraction = zone.area_ha / total_area if total_area > 0 else 0.25
            optimized_kg += zone_fraction * total_area * rec_rate
            updated_zones.append(VRAZoneSerializer(zone).data)

        saved_kg = max(0.0, round(standard_kg - optimized_kg, 1))
        savings_usd = round(saved_kg * cost_per_kg, 2)

        prescription.base_rate_kg_ha = base_rate
        prescription.fertilizer_saved_kg = saved_kg
        prescription.projected_savings_usd = savings_usd
        prescription.save()

        return Response({
            "prescriptionId": prescription.id,
            "parcelId": field.slug if field else "",
            "baseRateKgHa": base_rate,
            "standardFertilizerKg": round(standard_kg, 1),
            "optimizedFertilizerKg": round(optimized_kg, 1),
            "fertilizerSavedKg": saved_kg,
            "projectedSavingsUsd": savings_usd,
            "zones": updated_zones
        })


class YieldForecastViewSet(viewsets.ModelViewSet):
    queryset = YieldForecast.objects.all().order_by('-created_at')
    serializer_class = YieldForecastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return YieldForecast.objects.filter(field__owner=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get yield forecast for a given parcel."""
        parcel_id = request.query_params.get('parcel_id')
        if not parcel_id:
            forecast = self.get_queryset().first()
        else:
            forecast = self.get_queryset().filter(field__slug=parcel_id).first()
        if not forecast:
            return Response({"error": "No forecast found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(self.get_serializer(forecast).data)

    @action(detail=False, methods=['post'])
    def simulate_scenario(self, request):
        """Simulate weather or climatic impact on yield & valuation."""
        parcel_id = request.data.get('parcel_id')
        scenario_key = request.data.get('scenario', 'baseline')
        
        forecast = self.get_queryset().filter(field__slug=parcel_id).first()
        if not forecast:
            return Response({"error": "No forecast found"}, status=status.HTTP_404_NOT_FOUND)

        scenario = forecast.weather_scenarios.filter(scenario_id=scenario_key).first()
        if not scenario:
            return Response({"error": f"Scenario {scenario_key} not found"}, status=status.HTTP_404_NOT_FOUND)

        base_tonnes = forecast.projected_tonnes
        impact_pct = scenario.yield_impact_pct
        adjusted_tonnes = round(base_tonnes * (1.0 + impact_pct / 100.0), 1)
        base_val_usd = forecast.gross_valuation_usd
        price_per_tonne = (base_val_usd / base_tonnes) if base_tonnes > 0 else 350.0
        adjusted_val_usd = round(adjusted_tonnes * price_per_tonne, 2)
        adjusted_val_mga = round(adjusted_val_usd * 4600.0, 0) # 1 USD ~ 4600 MGA

        return Response({
            "scenario": scenario_key,
            "name": scenario.name,
            "yieldImpactPct": impact_pct,
            "baselineTonnes": base_tonnes,
            "projectedTonnes": adjusted_tonnes,
            "grossValuationUsd": adjusted_val_usd,
            "grossValuationMga": adjusted_val_mga,
            "valuationChangeUsd": round(adjusted_val_usd - base_val_usd, 2),
            "valuationChangeMga": round(adjusted_val_mga - forecast.gross_valuation_mga, 0)
        })


@api_view(['POST'])
def auth_login(request):
    """Authenticate and return UserProfile and token."""
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '').strip()

    if not email or not password:
        return Response(
            {'detail': 'Email et mot de passe requis.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    account = User.objects.filter(email__iexact=email).first() or User.objects.filter(username=email).first()
    user = authenticate(
        request=request,
        username=account.username if account else email,
        password=password,
    )
    if user is None:
        return Response(
            {'detail': 'Identifiants invalides.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    token, _ = Token.objects.get_or_create(user=user)
    profile = getattr(user, 'profile', None)

    return Response({
        "token": token.key,
        "user": {
            "name": profile.name if profile else user.get_full_name() or user.username,
            "email": user.email,
            "role": profile.role if profile else "Agronome",
            "terminalUnit": profile.terminal_unit if profile else "Secteur 04 • Alaotra-Mangoro",
            "avatarUrl": profile.avatar_url if profile else "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
        }
    })


@api_view(['POST'])
def auth_register(request):
    """Create a user account and return an authenticated session."""
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')
    name = request.data.get('name', '').strip()
    if not email or not password or not name:
        return Response({'detail': 'Nom, email et mot de passe requis.'}, status=status.HTTP_400_BAD_REQUEST)
    if len(password) < 8:
        return Response({'detail': 'Le mot de passe doit contenir au moins 8 caractères.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email__iexact=email).exists() or User.objects.filter(username=email).exists():
        return Response({'detail': 'Un compte existe déjà avec cet email.'}, status=status.HTTP_409_CONFLICT)

    user = User.objects.create_user(username=email, email=email, password=password)
    profile = UserProfile.objects.create(
        user=user,
        name=name,
        role=request.data.get('role', 'Agronome'),
        terminal_unit=request.data.get('region') or 'Madagascar',
    )
    region = request.data.get('region') or 'Madagascar'
    Farm.objects.create(
        owner=user,
        name=f"Exploitation de {name}",
        sector_code='Secteur initial',
        region=region,
        total_area_ha=0.0,
    )
    token = Token.objects.create(user=user)
    return Response({
        'token': token.key,
        'user': {
            'name': profile.name,
            'email': user.email,
            'role': profile.role,
            'terminalUnit': profile.terminal_unit,
            'avatarUrl': profile.avatar_url,
        },
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def auth_profile(request):
    """Get profile of current user."""
    user = request.user
    profile = getattr(user, 'profile', None)
    if profile:
        return Response(UserProfileSerializer(profile).data)
    return Response({
        "name": user.get_full_name() or user.username,
        "email": user.email,
        "role": "Agronome",
        "terminalUnit": "Secteur 04 • Alaotra-Mangoro",
        "avatarUrl": ""
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def auth_logout(request):
    """Invalidate the current authentication token."""
    Token.objects.filter(user=request.user).delete()
    return Response({'status': 'logged_out'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def auth_avatar(request):
    """Upload and attach a profile photo in Cloudinary."""
    image = request.FILES.get('image')
    if not image:
        return Response({'detail': 'Photo requise.'}, status=status.HTTP_400_BAD_REQUEST)
    if not os.getenv('CLOUDINARY_URL'):
        return Response({'detail': 'Cloudinary n’est pas configuré.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    if not image.content_type or not image.content_type.startswith('image/'):
        return Response({'detail': 'Le fichier doit être une image.'}, status=status.HTTP_400_BAD_REQUEST)
    if image.size > 5 * 1024 * 1024:
        return Response({'detail': 'La photo ne doit pas dépasser 5 Mo.'}, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)

    result = cloudinary.uploader.upload(
        image,
        folder='arovoly/avatars',
        public_id=f"user-{request.user.id}",
        overwrite=True,
        invalidate=True,
        resource_type='image',
        transformation=[
            {'width': 512, 'height': 512, 'crop': 'fill', 'gravity': 'face'},
            {'quality': 'auto', 'fetch_format': 'auto'},
        ],
    )
    profile = getattr(request.user, 'profile', None)
    if not profile:
        profile = UserProfile.objects.create(
            user=request.user,
            name=request.user.get_full_name() or request.user.username,
        )
    profile.avatar_url = result['secure_url']
    profile.save(update_fields=['avatar_url'])
    return Response({'avatarUrl': profile.avatar_url}, status=status.HTTP_200_OK)


@api_view(['GET'])
def health_check(request):
    """System health check & diagnostics."""
    from django.db import connection

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")

        counts = {
            "farms": Farm.objects.count(),
            "fields": Field.objects.count(),
            "sensors": Sensor.objects.count(),
            "measurements": Measurement.objects.count(),
        }
        return Response({
            "status": "healthy",
            "service": "AROVOLY Precision Ag API",
            "version": "v3.4.0",
            "region": "Madagascar (Alaotra-Mangoro / Vakinankaratra / Itasy)",
            "imagery_provider": "Esri World Imagery (Maxar ready)",
            "sentinel2_sync": "active",
            "database": {
                "status": "connected",
                "engine": connection.vendor,
                "counts": counts,
            }
        })
    except Exception as error:
        return Response({
            "status": "unhealthy",
            "service": "AROVOLY Precision Ag API",
            "database": {
                "status": "disconnected",
                "engine": connection.vendor,
            },
            "detail": str(error),
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

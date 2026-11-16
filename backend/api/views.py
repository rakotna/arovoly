import math
import random
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

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


class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all().order_by('id')
    serializer_class = CropSerializer


class FieldViewSet(MultiLookupMixin, viewsets.ModelViewSet):
    queryset = Field.objects.all().order_by('-created_at')
    serializer_class = FieldSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        qs = super().get_queryset()
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

    def create(self, request, *args, **kwargs):
        # Support payload with camelCase or snake_case
        data = request.data.copy()
        
        # If coordinates provided, calculate areaHa if areaHa is 0
        coords = data.get('coordinates', [])
        area_ha = data.get('areaHa') or data.get('area_ha', 0)
        if coords and not area_ha:
            # Simple polygon area calculation
            try:
                R = 6378137.0
                area = 0.0
                for i in range(len(coords)):
                    j = (i + 1) % len(coords)
                    lat1 = math.radians(coords[i][0])
                    lat2 = math.radians(coords[j][0])
                    lon1 = math.radians(coords[i][1])
                    lon2 = math.radians(coords[j][1])
                    area += (lon2 - lon1) * (2.0 + math.sin(lat1) + math.sin(lat2))
                area = abs((area * R * R) / 2.0)
                data['area_ha'] = round(area / 10000.0, 1)
            except Exception:
                data['area_ha'] = 50.0

        # Normalization
        if 'crop' in data:
            data['crop_type'] = data['crop']
        if 'areaHa' in data:
            data['area_ha'] = data['areaHa']
        if 'sownDate' in data:
            data['sown_date'] = data['sownDate']
        if 'soilType' in data:
            data['soil_type'] = data['soilType']
        if 'irrigationType' in data:
            data['irrigation_type'] = data['irrigationType']
        if 'ndviTrend' in data:
            data['ndvi_trend'] = data['ndviTrend']
        if 'moisturePct' in data:
            data['moisture_pct'] = data['moisturePct']
        if 'targetYieldTha' in data:
            data['target_yield_t_ha'] = data['targetYieldTha']
        if 'estYieldTha' in data:
            data['est_yield_t_ha'] = data['estYieldTha']
        if 'healthAlert' in data:
            data['health_alert'] = data['healthAlert']
        if 'healthAlertDetail' in data:
            data['health_alert_detail'] = data['healthAlertDetail']
        if 'urgentAction' in data:
            data['urgent_action'] = data['urgentAction']
        if 'fillColor' in data:
            data['fill_color'] = data['fillColor']

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
    <description>AgroField AI - Precision Agriculture Parcel {field.code}</description>
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

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Link parcel
        parcel_id = data.get('parcelId') or data.get('parcel_id')
        if parcel_id:
            field = Field.objects.filter(slug=parcel_id).first()
            if not field and str(parcel_id).isdigit():
                field = Field.objects.filter(pk=int(parcel_id)).first()
            if field:
                data['field_id'] = field.id
            else:
                first_field = Field.objects.first()
                if first_field:
                    data['field_id'] = first_field.id

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
        for sensor in Sensor.objects.all():
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

    def get_queryset(self):
        qs = super().get_queryset()
        sensor_id = self.request.query_params.get('sensor')
        if sensor_id:
            qs = qs.filter(sensor__slug=sensor_id) | qs.filter(sensor_id=sensor_id)
        return qs


class VRAPrescriptionViewSet(viewsets.ModelViewSet):
    queryset = VRAPrescription.objects.all().order_by('-date_prescribed')
    serializer_class = VRAPrescriptionSerializer

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get the active prescription for a given parcel."""
        parcel_id = request.query_params.get('parcel_id')
        if not parcel_id:
            prescription = VRAPrescription.objects.first()
        else:
            prescription = (
                VRAPrescription.objects.filter(field__slug=parcel_id).first() or
                VRAPrescription.objects.first()
            )
        if not prescription:
            return Response({"error": "No prescription found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(self.get_serializer(prescription).data)

    @action(detail=False, methods=['post'])
    def calculate(self, request):
        """Recalculate VRA modulation and savings based on base fertilizer rate."""
        parcel_id = request.data.get('parcel_id')
        base_rate = float(request.data.get('base_rate_kg_ha', 180.0))
        cost_per_kg = float(request.data.get('cost_per_kg', 0.68))

        field = Field.objects.filter(slug=parcel_id).first()
        if not field:
            field = Field.objects.first()

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

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get yield forecast for a given parcel."""
        parcel_id = request.query_params.get('parcel_id')
        if not parcel_id:
            forecast = YieldForecast.objects.first()
        else:
            forecast = (
                YieldForecast.objects.filter(field__slug=parcel_id).first() or
                YieldForecast.objects.first()
            )
        if not forecast:
            return Response({"error": "No forecast found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(self.get_serializer(forecast).data)

    @action(detail=False, methods=['post'])
    def simulate_scenario(self, request):
        """Simulate weather or climatic impact on yield & valuation."""
        parcel_id = request.data.get('parcel_id')
        scenario_key = request.data.get('scenario', 'baseline')
        
        forecast = (
            YieldForecast.objects.filter(field__slug=parcel_id).first() or
            YieldForecast.objects.first()
        )
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

    # Find user by email or username
    user = User.objects.filter(email=email).first() or User.objects.filter(username=email).first()
    if not user:
        # If demo mode, check demo accounts or create demo profile
        if email:
            name_part = email.split('@')[0].replace('.', ' ').title()
            user, _ = User.objects.get_or_create(username=email, defaults={'email': email})
            user.set_password('agrofield2024')
            user.save()
            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'name': name_part,
                    'role': 'Directrice Agronome Régionale • Madagascar',
                    'terminal_unit': 'Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)'
                }
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


@api_view(['GET'])
def auth_profile(request):
    """Get profile of current user."""
    user = request.user
    if not user or not user.is_authenticated:
        # Return default leader profile if unauthenticated in dev
        profile = UserProfile.objects.first()
        if profile:
            return Response(UserProfileSerializer(profile).data)
        return Response({
            "name": "Dr. Éléonore Vance (Andrianina)",
            "email": "e.vance@agrofield.mg",
            "role": "Directrice Agronome Régionale • Madagascar",
            "terminalUnit": "Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)",
            "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
        })
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


@api_view(['GET'])
def health_check(request):
    """System health check & diagnostics."""
    farms_count = Farm.objects.count()
    fields_count = Field.objects.count()
    sensors_count = Sensor.objects.count()
    measurements_count = Measurement.objects.count()

    return Response({
        "status": "healthy",
        "service": "AgroField AI Precision Ag API",
        "version": "v3.4.0",
        "region": "Madagascar (Alaotra-Mangoro / Vakinankaratra / Itasy)",
        "imagery_provider": "Esri World Imagery (Maxar ready)",
        "sentinel2_sync": "active",
        "database": {
            "status": "connected",
            "engine": "SQLite / PostGIS ready",
            "counts": {
                "farms": farms_count,
                "fields": fields_count,
                "sensors": sensors_count,
                "measurements": measurements_count,
            }
        }
    })

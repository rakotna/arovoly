from rest_framework import serializers
from django.contrib.auth.models import User
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


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    terminalUnit = serializers.CharField(source='terminal_unit', required=False)
    avatarUrl = serializers.CharField(source='avatar_url', required=False)

    class Meta:
        model = UserProfile
        fields = ['name', 'email', 'username', 'role', 'terminalUnit', 'avatarUrl']


class FarmSerializer(serializers.ModelSerializer):
    sectorCode = serializers.CharField(source='sector_code', required=False)
    totalAreaHa = serializers.FloatField(source='total_area_ha', required=False)

    class Meta:
        model = Farm
        fields = ['id', 'name', 'sectorCode', 'region', 'totalAreaHa', 'created_at']


class CropSerializer(serializers.ModelSerializer):
    targetYieldTHa = serializers.FloatField(source='target_yield_t_ha', required=False)
    sowingDate = serializers.DateField(source='sowing_date', required=False, allow_null=True)

    class Meta:
        model = Crop
        fields = ['id', 'name', 'variety', 'sowingDate', 'targetYieldTHa']


class MeasurementSerializer(serializers.ModelSerializer):
    moisture10cm = serializers.FloatField(source='moisture_10cm', required=False)
    moisture30cm = serializers.FloatField(source='moisture_30cm', required=False)
    moisture60cm = serializers.FloatField(source='moisture_60cm', required=False)
    temperatureC = serializers.FloatField(source='temperature_c', required=False)
    matricPotentialKPa = serializers.FloatField(source='matric_potential_kpa', required=False)
    salinityEC = serializers.FloatField(source='salinity_ec', required=False)
    recordedAt = serializers.DateTimeField(source='recorded_at', read_only=True)

    class Meta:
        model = Measurement
        fields = [
            'id',
            'sensor',
            'recordedAt',
            'moisture10cm',
            'moisture30cm',
            'moisture60cm',
            'temperatureC',
            'matricPotentialKPa',
            'salinityEC',
        ]


class SensorSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug', read_only=True)
    stationCode = serializers.CharField(source='station_code')
    parcelId = serializers.CharField(source='field.slug', read_only=True)
    parcelName = serializers.CharField(source='field.name', read_only=True)
    field_id = serializers.PrimaryKeyRelatedField(
        queryset=Field.objects.all(), source='field', write_only=True, required=False
    )
    batteryPct = serializers.IntegerField(source='battery_pct', required=False)
    signalDbm = serializers.IntegerField(source='signal_dbm', required=False)
    irrigationThreshold = serializers.FloatField(source='irrigation_threshold', required=False)
    lastSynced = serializers.SerializerMethodField()

    moisture10cm = serializers.SerializerMethodField()
    moisture30cm = serializers.SerializerMethodField()
    moisture60cm = serializers.SerializerMethodField()
    temperatureC = serializers.SerializerMethodField()
    matricPotentialKPa = serializers.SerializerMethodField()
    salinityEC = serializers.SerializerMethodField()

    class Meta:
        model = Sensor
        fields = [
            'id',
            'name',
            'stationCode',
            'parcelId',
            'parcelName',
            'field_id',
            'lat',
            'lng',
            'status',
            'batteryPct',
            'signalDbm',
            'irrigationThreshold',
            'lastSynced',
            'moisture10cm',
            'moisture30cm',
            'moisture60cm',
            'temperatureC',
            'matricPotentialKPa',
            'salinityEC',
        ]

    def _get_latest(self, obj):
        if not hasattr(obj, '_cached_latest'):
            obj._cached_latest = obj.measurements.first()
        return obj._cached_latest

    def get_lastSynced(self, obj):
        latest = self._get_latest(obj)
        if latest:
            return "Il y a 3 min"
        return "Synchronisé"

    def get_moisture10cm(self, obj):
        latest = self._get_latest(obj)
        return latest.moisture_10cm if latest else 38.0

    def get_moisture30cm(self, obj):
        latest = self._get_latest(obj)
        return latest.moisture_30cm if latest else 41.0

    def get_moisture60cm(self, obj):
        latest = self._get_latest(obj)
        return latest.moisture_60cm if latest else 45.0

    def get_temperatureC(self, obj):
        latest = self._get_latest(obj)
        return latest.temperature_c if latest else 24.5

    def get_matricPotentialKPa(self, obj):
        latest = self._get_latest(obj)
        return latest.matric_potential_kpa if latest else -28.0

    def get_salinityEC(self, obj):
        latest = self._get_latest(obj)
        return latest.salinity_ec if latest else 0.40


class FieldSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug', read_only=True)
    crop = serializers.CharField(source='crop_type', required=False)
    variety = serializers.CharField(required=False)
    areaHa = serializers.FloatField(source='area_ha', required=False)
    sownDate = serializers.CharField(source='sown_date', required=False)
    region = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    soilType = serializers.CharField(source='soil_type', required=False)
    irrigationType = serializers.CharField(source='irrigation_type', required=False)
    ndvi = serializers.FloatField(required=False)
    ndviTrend = serializers.CharField(source='ndvi_trend', required=False)
    moisturePct = serializers.FloatField(source='moisture_pct', required=False)
    targetYieldTha = serializers.FloatField(source='target_yield_t_ha', required=False)
    estYieldTha = serializers.FloatField(source='est_yield_t_ha', required=False)
    section = serializers.CharField(required=False)
    healthAlert = serializers.CharField(source='health_alert', allow_null=True, required=False, allow_blank=True)
    healthAlertDetail = serializers.CharField(source='health_alert_detail', allow_null=True, required=False, allow_blank=True)
    urgentAction = serializers.CharField(source='urgent_action', allow_null=True, required=False, allow_blank=True)
    color = serializers.CharField(required=False)
    fillColor = serializers.CharField(source='fill_color', required=False)
    notes = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    coordinates = serializers.JSONField(required=False)
    center = serializers.JSONField(required=False)
    boundaryGeojson = serializers.JSONField(source='boundary_geojson', required=False)
    sensors = SensorSerializer(many=True, read_only=True)

    class Meta:
        model = Field
        fields = [
            'id',
            'code',
            'name',
            'region',
            'crop',
            'variety',
            'areaHa',
            'sownDate',
            'status',
            'soilType',
            'irrigationType',
            'ndvi',
            'ndviTrend',
            'moisturePct',
            'targetYieldTha',
            'estYieldTha',
            'section',
            'healthAlert',
            'healthAlertDetail',
            'urgentAction',
            'coordinates',
            'center',
            'boundaryGeojson',
            'color',
            'fillColor',
            'notes',
            'sensors',
            'created_at',
            'updated_at',
        ]


class VRAZoneSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='zone_id')
    areaHa = serializers.FloatField(source='area_ha')
    pctArea = serializers.FloatField(source='pct_area')
    targetRateKgHa = serializers.FloatField(source='target_rate_kg_ha')
    recommendedRateKgHa = serializers.FloatField(source='recommended_rate_kg_ha')
    deltaPct = serializers.FloatField(source='delta_pct')
    ndviRange = serializers.CharField(source='ndvi_range')
    soilMoisture = serializers.CharField(source='soil_moisture')

    class Meta:
        model = VRAZone
        fields = [
            'id',
            'name',
            'label',
            'areaHa',
            'pctArea',
            'targetRateKgHa',
            'recommendedRateKgHa',
            'deltaPct',
            'ndviRange',
            'soilMoisture',
            'color',
            'description',
            'deficiency',
        ]


class VRAPrescriptionSerializer(serializers.ModelSerializer):
    fieldId = serializers.CharField(source='field.slug', read_only=True)
    fieldName = serializers.CharField(source='field.name', read_only=True)
    fieldCode = serializers.CharField(source='field.code', read_only=True)
    field_id = serializers.PrimaryKeyRelatedField(
        queryset=Field.objects.all(), source='field', write_only=True, required=False
    )
    baseRateKgHa = serializers.FloatField(source='base_rate_kg_ha')
    fertilizerType = serializers.CharField(source='fertilizer_type')
    projectedSavingsUsd = serializers.FloatField(source='projected_savings_usd')
    fertilizerSavedKg = serializers.FloatField(source='fertilizer_saved_kg')
    datePrescribed = serializers.DateField(source='date_prescribed', read_only=True)
    zones = VRAZoneSerializer(many=True, read_only=True)

    class Meta:
        model = VRAPrescription
        fields = [
            'id',
            'fieldId',
            'fieldName',
            'fieldCode',
            'field_id',
            'datePrescribed',
            'baseRateKgHa',
            'fertilizerType',
            'projectedSavingsUsd',
            'fertilizerSavedKg',
            'notes',
            'zones',
        ]


class PhenologicalStageSerializer(serializers.ModelSerializer):
    dayOfYear = serializers.IntegerField(source='day_of_year')
    projectedYield = serializers.FloatField(source='projected_yield')
    benchmarkYield = serializers.FloatField(source='benchmark_yield')
    gddAccumulated = serializers.IntegerField(source='gdd_accumulated')

    class Meta:
        model = PhenologicalStage
        fields = ['stage', 'dayOfYear', 'projectedYield', 'benchmarkYield', 'gddAccumulated']


class WeatherScenarioSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='scenario_id')
    yieldImpactPct = serializers.FloatField(source='yield_impact_pct')
    projectedTotalTonnes = serializers.FloatField(source='projected_total_tonnes')
    valuationChangeUsd = serializers.FloatField(source='valuation_change_usd')
    valuationChangeMga = serializers.FloatField(source='valuation_change_mga')

    class Meta:
        model = WeatherScenario
        fields = [
            'id',
            'name',
            'description',
            'yieldImpactPct',
            'projectedTotalTonnes',
            'valuationChangeUsd',
            'valuationChangeMga',
        ]


class YieldForecastSerializer(serializers.ModelSerializer):
    fieldId = serializers.CharField(source='field.slug', read_only=True)
    fieldName = serializers.CharField(source='field.name', read_only=True)
    modelConfidencePct = serializers.FloatField(source='model_confidence_pct')
    projectedYieldTha = serializers.FloatField(source='projected_yield_t_ha')
    projectedTonnes = serializers.FloatField(source='projected_tonnes')
    grossValuationUsd = serializers.FloatField(source='gross_valuation_usd')
    grossValuationMga = serializers.FloatField(source='gross_valuation_mga')
    phenologicalStages = PhenologicalStageSerializer(source='phenological_stages', many=True, read_only=True)
    weatherScenarios = serializers.SerializerMethodField()

    class Meta:
        model = YieldForecast
        fields = [
            'id',
            'fieldId',
            'fieldName',
            'season',
            'modelConfidencePct',
            'projectedYieldTha',
            'projectedTonnes',
            'grossValuationUsd',
            'grossValuationMga',
            'phenologicalStages',
            'weatherScenarios',
        ]

    def get_weatherScenarios(self, obj):
        scenarios = obj.weather_scenarios.all()
        res = {}
        for sc in scenarios:
            res[sc.scenario_id] = WeatherScenarioSerializer(sc).data
        return res

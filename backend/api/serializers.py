from rest_framework import serializers
from .models import Farm, Crop, Field, Sensor, Measurement, VRAPrescription, YieldForecast

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'

class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = '__all__'

class SensorSerializer(serializers.ModelSerializer):
    latest_measurement = serializers.SerializerMethodField()

    class Meta:
        model = Sensor
        fields = '__all__'

    def get_latest_measurement(self, obj):
        m = obj.measurements.order_by('-recorded_at').first()
        return MeasurementSerializer(m).data if m else None

class FieldSerializer(serializers.ModelSerializer):
    crop_details = CropSerializer(source='crop', read_only=True)
    sensors = SensorSerializer(many=True, read_only=True)

    class Meta:
        model = Field
        fields = '__all__'

class FarmSerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True, read_only=True)

    class Meta:
        model = Farm
        fields = '__all__'

class VRAPrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VRAPrescription
        fields = '__all__'

class YieldForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = YieldForecast
        fields = '__all__'

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Farm, Crop, Field, Sensor, Measurement, VRAPrescription, YieldForecast
from .serializers import (
    FarmSerializer,
    CropSerializer,
    FieldSerializer,
    SensorSerializer,
    MeasurementSerializer,
    VRAPrescriptionSerializer,
    YieldForecastSerializer,
)

class FarmViewSet(viewsets.ModelViewSet):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer

class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all()
    serializer_class = FieldSerializer

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

class MeasurementViewSet(viewsets.ModelViewSet):
    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer

class VRAPrescriptionViewSet(viewsets.ModelViewSet):
    queryset = VRAPrescription.objects.all()
    serializer_class = VRAPrescriptionSerializer

class YieldForecastViewSet(viewsets.ModelViewSet):
    queryset = YieldForecast.objects.all()
    serializer_class = YieldForecastSerializer

@api_view(['GET'])
def health_check(request):
    return Response({
        "status": "healthy",
        "service": "AgroField AI Precision Ag API",
        "version": "v3.4",
        "sentinel2_sync": "active",
        "postgis_status": "ready"
    })

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmViewSet,
    FieldViewSet,
    SensorViewSet,
    MeasurementViewSet,
    VRAPrescriptionViewSet,
    YieldForecastViewSet,
    health_check,
)

router = DefaultRouter()
router.register(r'farms', FarmViewSet)
router.register(r'fields', FieldViewSet)
router.register(r'sensors', SensorViewSet)
router.register(r'measurements', MeasurementViewSet)
router.register(r'prescriptions', VRAPrescriptionViewSet)
router.register(r'forecasts', YieldForecastViewSet)

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('', include(router.urls)),
]

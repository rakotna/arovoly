from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmViewSet,
    CropViewSet,
    FieldViewSet,
    SensorViewSet,
    MeasurementViewSet,
    VRAPrescriptionViewSet,
    YieldForecastViewSet,
    health_check,
    auth_login,
    auth_register,
    auth_profile,
)

router = DefaultRouter()
router.register(r'farms', FarmViewSet, basename='farm')
router.register(r'crops', CropViewSet, basename='crop')
router.register(r'fields', FieldViewSet, basename='field')
router.register(r'parcels', FieldViewSet, basename='parcel')
router.register(r'sensors', SensorViewSet, basename='sensor')
router.register(r'measurements', MeasurementViewSet, basename='measurement')
router.register(r'prescriptions', VRAPrescriptionViewSet, basename='prescription')
router.register(r'forecasts', YieldForecastViewSet, basename='forecast')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('auth/login/', auth_login, name='auth-login'),
    path('auth/register/', auth_register, name='auth-register'),
    path('auth/profile/', auth_profile, name='auth-profile'),
    path('', include(router.urls)),
]

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
    auth_profile_update,
    auth_account_delete,
    auth_logout,
    auth_avatar,
    auth_magic_request,
    auth_magic_login,
    auth_password_reset_request,
    auth_password_reset_confirm,
    cassava_prediction_ingest,
    cassava_prediction_latest,
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
    path('auth/profile/update/', auth_profile_update, name='auth-profile-update'),
    path('auth/account/', auth_account_delete, name='auth-account-delete'),
    path('auth/logout/', auth_logout, name='auth-logout'),
    path('auth/avatar/', auth_avatar, name='auth-avatar'),
    path('auth/magic-request/', auth_magic_request, name='auth-magic-request'),
    path('auth/magic-login/', auth_magic_login, name='auth-magic-login'),
    path('auth/password-reset/request/', auth_password_reset_request, name='auth-password-reset-request'),
    path('auth/password-reset/confirm/', auth_password_reset_confirm, name='auth-password-reset-confirm'),
    path('cassava/predict/', cassava_prediction_ingest, name='cassava-prediction-ingest'),
    path('cassava/predictions/latest/', cassava_prediction_latest, name='cassava-prediction-latest'),
    path('', include(router.urls)),
]

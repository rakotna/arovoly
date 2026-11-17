from django.test import TestCase
from django.urls import reverse
from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Field, Sensor, Measurement, VRAPrescription, YieldForecast


class ArovolyApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        call_command('seed_data', verbosity=0)

    def test_health_check(self):
        url = reverse('health-check')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')
        self.assertIn('counts', response.data['database'])

    def test_list_parcels(self):
        url = reverse('parcel-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 4)
        first_parcel = response.data[0]
        self.assertIn('areaHa', first_parcel)
        self.assertIn('ndvi', first_parcel)
        self.assertIn('coordinates', first_parcel)

    def test_get_single_parcel(self):
        url = reverse('parcel-detail', kwargs={'slug': '402-alaotra'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], '#402')
        self.assertEqual(response.data['region'], 'Alaotra-Mangoro')

    def test_create_parcel(self):
        url = reverse('parcel-list')
        payload = {
            'code': '#505',
            'name': 'Parcelle Test Morondava',
            'region': 'Menabe',
            'crop': 'Canne à sucre',
            'variety': 'R570',
            'areaHa': 120.0,
            'status': 'Good',
            'coordinates': [
                [-20.28, 44.30],
                [-20.27, 44.32],
                [-20.29, 44.33],
                [-20.30, 44.31]
            ]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['code'], '#505')
        self.assertTrue(Field.objects.filter(code='#505').exists())

    def test_parcel_geojson(self):
        url = reverse('parcel-geojson', kwargs={'slug': '402-alaotra'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['type'], 'Feature')
        self.assertEqual(response.data['geometry']['type'], 'Polygon')

    def test_parcel_kml(self):
        url = reverse('parcel-kml', kwargs={'slug': '402-alaotra'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('application/vnd.google-earth.kml+xml', response['Content-Type'])
        self.assertIn('<kml', response.content.decode('utf-8'))

    def test_list_sensors(self):
        url = reverse('sensor-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 5)
        probe = response.data[0]
        self.assertIn('stationCode', probe)
        self.assertIn('moisture10cm', probe)
        self.assertIn('temperatureC', probe)

    def test_sensor_telemetry_ingest(self):
        url = reverse('sensor-telemetry', kwargs={'slug': 'probe-alpha-01'})
        telemetry_payload = {
            'moisture10cm': 39.5,
            'moisture30cm': 42.1,
            'moisture60cm': 47.0,
            'temperatureC': 25.2,
            'matricPotentialKPa': -27.0,
            'salinityEC': 0.41,
            'batteryPct': 97,
            'signalDbm': -70
        }
        response = self.client.post(url, telemetry_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')

        # Check latest measurement updated
        sensor = Sensor.objects.get(slug='probe-alpha-01')
        latest = sensor.measurements.first()
        self.assertEqual(latest.moisture_10cm, 39.5)
        self.assertEqual(sensor.battery_pct, 97)

    def test_sensors_simulate(self):
        url = reverse('sensor-simulate')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'simulated')
        self.assertGreater(response.data['probes_updated'], 0)

    def test_vra_recalculate(self):
        url = reverse('prescription-calculate')
        payload = {
            'parcel_id': '402-alaotra',
            'base_rate_kg_ha': 200.0,
            'cost_per_kg': 0.70
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['baseRateKgHa'], 200.0)
        self.assertGreater(response.data['projectedSavingsUsd'], 0)

    def test_yield_forecast_simulation(self):
        url = reverse('forecast-simulate-scenario')
        payload = {
            'parcel_id': '402-alaotra',
            'scenario': 'favorable'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['scenario'], 'favorable')
        self.assertGreater(response.data['projectedTonnes'], response.data['baselineTonnes'])

    def test_auth_login(self):
        url = reverse('auth-login')
        payload = {
            'email': 'e.vance@arovoly.mg',
            'password': 'arovoly2024'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['name'], 'Dr. Éléonore Vance (Andrianina)')

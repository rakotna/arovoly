from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=150, default='Directrice Agronome Régionale • Madagascar')
    terminal_unit = models.CharField(max_length=255, default='Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)')
    avatar_url = models.CharField(
        max_length=500,
        blank=True,
        default='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.role})"


class Farm(models.Model):
    name = models.CharField(max_length=200)
    sector_code = models.CharField(max_length=100, default='Secteur 04')
    region = models.CharField(max_length=100, default='Alaotra-Mangoro')
    total_area_ha = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} [{self.sector_code}]"


class Crop(models.Model):
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=150)
    sowing_date = models.DateField(null=True, blank=True)
    target_yield_t_ha = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.name} ({self.variety})"


class Field(models.Model):
    STATUS_CHOICES = [
        ('Optimal', 'Optimal'),
        ('Good', 'Good'),
        ('Needs Action', 'Needs Action'),
        ('Critical', 'Critical'),
    ]

    slug = models.SlugField(max_length=100, unique=True, blank=True)
    code = models.CharField(max_length=50) # e.g. #402
    name = models.CharField(max_length=255)
    farm = models.ForeignKey(Farm, related_name='fields', on_delete=models.SET_NULL, null=True, blank=True)
    region = models.CharField(max_length=100, default='Alaotra-Mangoro')
    crop_type = models.CharField(max_length=100, default='Riz Paddy')
    variety = models.CharField(max_length=150, default='Vary Makalioka 34 (Riz de Luxe)')
    area_ha = models.FloatField(default=0.0)
    sown_date = models.CharField(max_length=100, default='15 nov. 2024')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Optimal')
    soil_type = models.CharField(max_length=100, default='Hydromorphe (Rizière)')
    irrigation_type = models.CharField(max_length=100, default='Système de Riziculture Intensive (SRI)')
    ndvi = models.FloatField(default=0.75)
    ndvi_trend = models.CharField(max_length=255, default='+0.02 nominal')
    moisture_pct = models.FloatField(default=35.0)
    target_yield_t_ha = models.FloatField(default=6.0)
    est_yield_t_ha = models.FloatField(default=6.5)
    section = models.CharField(max_length=150, default='Zone Ambatondrazaka PC15')
    health_alert = models.CharField(max_length=255, blank=True, null=True)
    health_alert_detail = models.TextField(blank=True, null=True)
    urgent_action = models.CharField(max_length=255, blank=True, null=True)
    coordinates = models.JSONField(default=list, blank=True) # list of [lat, lng]
    center = models.JSONField(default=list, blank=True) # [lat, lng]
    color = models.CharField(max_length=50, default='#059669')
    fill_color = models.CharField(max_length=50, default='#10b981')
    notes = models.TextField(blank=True, null=True)
    boundary_geojson = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            clean_code = self.code.replace('#', '').strip()
            clean_region = self.region.lower().replace(' ', '-').replace("'", '')
            self.slug = f"{clean_code}-{clean_region}" if clean_code else f"field-{self.id or 'new'}"
        if self.coordinates and not self.center:
            lats = [c[0] for c in self.coordinates if len(c) >= 2]
            lngs = [c[1] for c in self.coordinates if len(c) >= 2]
            if lats and lngs:
                self.center = [round(sum(lats) / len(lats), 5), round(sum(lngs) / len(lngs), 5)]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} - {self.name}"


class Sensor(models.Model):
    STATUS_CHOICES = [
        ('Online', 'Online'),
        ('Warning', 'Warning'),
        ('Offline', 'Offline'),
    ]

    slug = models.SlugField(max_length=100, unique=True, blank=True)
    field = models.ForeignKey(Field, related_name='sensors', on_delete=models.CASCADE)
    station_code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=150)
    lat = models.FloatField()
    lng = models.FloatField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Online')
    battery_pct = models.IntegerField(default=100)
    signal_dbm = models.IntegerField(default=-70)
    irrigation_threshold = models.FloatField(default=32.0)
    last_synced = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            clean_station = self.station_code.lower().replace(' ', '-').replace('(', '').replace(')', '')
            self.slug = f"probe-{clean_station}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.station_code} - {self.name}"


class Measurement(models.Model):
    sensor = models.ForeignKey(Sensor, related_name='measurements', on_delete=models.CASCADE)
    recorded_at = models.DateTimeField(auto_now_add=True)
    moisture_10cm = models.FloatField(default=35.0)
    moisture_30cm = models.FloatField(default=38.0)
    moisture_60cm = models.FloatField(default=42.0)
    temperature_c = models.FloatField(default=24.0)
    matric_potential_kpa = models.FloatField(default=-30.0)
    salinity_ec = models.FloatField(default=0.4)

    class Meta:
        ordering = ['-recorded_at']

    def __str__(self):
        return f"{self.sensor.station_code} @ {self.recorded_at.strftime('%Y-%m-%d %H:%M')}"


class VRAPrescription(models.Model):
    field = models.ForeignKey(Field, related_name='prescriptions', on_delete=models.CASCADE)
    date_prescribed = models.DateField(auto_now_add=True)
    base_rate_kg_ha = models.FloatField(default=180.0)
    fertilizer_type = models.CharField(max_length=100, default='Urée 46% (N) & NPK')
    projected_savings_usd = models.FloatField(default=0.0)
    fertilizer_saved_kg = models.FloatField(default=0.0)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"VRA Prescription for {self.field.name} on {self.date_prescribed}"


class VRAZone(models.Model):
    prescription = models.ForeignKey(VRAPrescription, related_name='zones', on_delete=models.CASCADE)
    zone_id = models.CharField(max_length=50) # e.g. 'zone-1'
    name = models.CharField(max_length=150)
    label = models.CharField(max_length=150)
    area_ha = models.FloatField(default=0.0)
    pct_area = models.FloatField(default=0.0)
    target_rate_kg_ha = models.FloatField(default=180.0)
    recommended_rate_kg_ha = models.FloatField(default=150.0)
    delta_pct = models.FloatField(default=0.0)
    ndvi_range = models.CharField(max_length=100, default='0.80 – 0.85')
    soil_moisture = models.CharField(max_length=100, default='40.0% vol')
    color = models.CharField(max_length=50, default='#059669')
    description = models.TextField(blank=True, default='')
    deficiency = models.CharField(max_length=255, default='Équilibré')

    class Meta:
        ordering = ['zone_id']

    def __str__(self):
        return f"{self.zone_id}: {self.name} ({self.recommended_rate_kg_ha} kg/ha)"


class YieldForecast(models.Model):
    field = models.ForeignKey(Field, related_name='yield_forecasts', on_delete=models.CASCADE)
    season = models.CharField(max_length=50, default='2024')
    model_confidence_pct = models.FloatField(default=94.2)
    projected_yield_t_ha = models.FloatField(default=6.8)
    projected_tonnes = models.FloatField(default=3298.0)
    gross_valuation_usd = models.FloatField(default=1154300.0)
    gross_valuation_mga = models.FloatField(default=5310000000.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Yield Forecast {self.season} - {self.field.name}"


class PhenologicalStage(models.Model):
    forecast = models.ForeignKey(YieldForecast, related_name='phenological_stages', on_delete=models.CASCADE)
    stage = models.CharField(max_length=150)
    day_of_year = models.IntegerField(default=1)
    projected_yield = models.FloatField(default=0.0)
    benchmark_yield = models.FloatField(default=0.0)
    gdd_accumulated = models.IntegerField(default=0)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'day_of_year']

    def __str__(self):
        return f"{self.stage} (Day {self.day_of_year})"


class WeatherScenario(models.Model):
    forecast = models.ForeignKey(YieldForecast, related_name='weather_scenarios', on_delete=models.CASCADE)
    scenario_id = models.CharField(max_length=50) # 'baseline' | 'dry' | 'favorable'
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    yield_impact_pct = models.FloatField(default=0.0)
    projected_total_tonnes = models.FloatField(default=0.0)
    valuation_change_usd = models.FloatField(default=0.0)
    valuation_change_mga = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.scenario_id}: {self.name} ({self.yield_impact_pct:+0.1f}%)"

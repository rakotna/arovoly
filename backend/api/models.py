from django.db import models

class Farm(models.Model):
    name = models.CharField(max_length=200)
    sector_code = models.CharField(max_length=50, default='Sector 04')
    total_area_ha = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.sector_code})"

class Crop(models.Model):
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100)
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

    farm = models.ForeignKey(Farm, related_name='fields', on_delete=models.CASCADE)
    crop = models.ForeignKey(Crop, related_name='fields', on_delete=models.SET_NULL, null=True, blank=True)
    code = models.CharField(max_length=50) # e.g. #402
    name = models.CharField(max_length=200)
    area_ha = models.FloatField()
    section = models.CharField(max_length=100, default='Section 02-B')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Optimal')
    mean_ndvi = models.FloatField(default=0.75)
    mean_moisture_pct = models.FloatField(default=35.0)
    est_yield_t_ha = models.FloatField(default=0.0)
    health_alert = models.CharField(max_length=255, blank=True, null=True)
    urgent_action = models.CharField(max_length=255, blank=True, null=True)
    # GeoJSON boundary
    boundary_geojson = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Sensor(models.Model):
    STATUS_CHOICES = [
        ('Online', 'Online'),
        ('Warning', 'Warning'),
        ('Offline', 'Offline'),
    ]

    field = models.ForeignKey(Field, related_name='sensors', on_delete=models.CASCADE)
    station_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    lat = models.FloatField()
    lng = models.FloatField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Online')
    battery_pct = models.IntegerField(default=100)
    signal_dbm = models.IntegerField(default=-70)
    last_synced = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.station_code} - {self.name}"

class Measurement(models.Model):
    sensor = models.ForeignKey(Sensor, related_name='measurements', on_delete=models.CASCADE)
    recorded_at = models.DateTimeField(auto_now_add=True)
    moisture_10cm = models.FloatField()
    moisture_30cm = models.FloatField()
    moisture_60cm = models.FloatField()
    temperature_c = models.FloatField()
    matric_potential_kpa = models.FloatField(default=-30.0)
    salinity_ec = models.FloatField(default=0.4)

    def __str__(self):
        return f"{self.sensor.station_code} @ {self.recorded_at}"

class VRAPrescription(models.Model):
    field = models.ForeignKey(Field, related_name='prescriptions', on_delete=models.CASCADE)
    date_prescribed = models.DateField(auto_now_add=True)
    base_rate_kg_ha = models.FloatField(default=180.0)
    zones_geojson = models.JSONField(default=list)
    projected_savings_usd = models.FloatField(default=0.0)
    fertilizer_saved_kg = models.FloatField(default=0.0)

    def __str__(self):
        return f"VRA Rx for {self.field.name} on {self.date_prescribed}"

class YieldForecast(models.Model):
    field = models.ForeignKey(Field, related_name='yield_forecasts', on_delete=models.CASCADE)
    season = models.CharField(max_length=50, default='2024')
    model_confidence_pct = models.FloatField(default=94.2)
    projected_yield_t_ha = models.FloatField()
    projected_tonnes = models.FloatField()
    gross_valuation_usd = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Yield Forecast {self.season} - {self.field.name}"

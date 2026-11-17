from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import (
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


class Command(BaseCommand):
    help = 'Seeds initial precision agriculture data for Madagascar (Alaotra-Mangoro, Vakinankaratra, Itasy)'

    def handle(self, *args, **options):
        verbose = options.get('verbosity', 1) > 0
        def log(msg, style=None):
            if verbose:
                self.stdout.write(style(msg) if style else msg)

        log("Initializing AROVOLY database seed...", self.style.NOTICE)

        # 1. Users & Profiles
        users_data = [
            {
                'username': 'e.vance@arovoly.mg',
                'email': 'e.vance@arovoly.mg',
                'first_name': 'Éléonore',
                'last_name': 'Vance',
                'name': 'Dr. Éléonore Vance (Andrianina)',
                'role': 'Directrice Agronome Régionale • Madagascar',
                'terminal_unit': 'Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)',
                'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
            },
            {
                'username': 'analyst.satellite@arovoly.mg',
                'email': 'analyst.satellite@arovoly.mg',
                'first_name': 'Rado',
                'last_name': 'Rakotomalala',
                'name': 'Rado Rakotomalala (Télédétection)',
                'role': 'Spécialiste Données Satellitaires & Indices NDVI',
                'terminal_unit': 'Secteur 02 • Vakinankaratra (Antsirabe)',
                'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
            },
            {
                'username': 'direction.exploitation@arovoly.mg',
                'email': 'direction.exploitation@arovoly.mg',
                'first_name': 'Mamy',
                'last_name': 'Razafindrakoto',
                'name': 'Mamy Razafindrakoto (Directeur)',
                'role': 'Gestionnaire Général des Exploitations',
                'terminal_unit': 'Secteur 09 • Itasy (Miarinarivo / Ampefy)',
                'avatar_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'
            }
        ]

        for u in users_data:
            user, created = User.objects.get_or_create(
                username=u['username'],
                defaults={
                    'email': u['email'],
                    'first_name': u['first_name'],
                    'last_name': u['last_name'],
                }
            )
            user.set_password('arovoly2024')
            user.save()

            UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    'name': u['name'],
                    'role': u['role'],
                    'terminal_unit': u['terminal_unit'],
                    'avatar_url': u['avatar_url'],
                }
            )

        log("✓ Users & UserProfiles configured.", self.style.SUCCESS)

        # 2. Farms
        farm_alaotra, _ = Farm.objects.update_or_create(
            name="Exploitation Rizicole d'Ambatondrazaka (PC15)",
            defaults={
                'sector_code': 'Secteur 04',
                'region': 'Alaotra-Mangoro',
                'total_area_ha': 725.0
            }
        )
        farm_vakinankaratra, _ = Farm.objects.update_or_create(
            name="Domaine Agro-Sylvo-Pastoral des Tanety (Betafo)",
            defaults={
                'sector_code': 'Secteur 02',
                'region': 'Vakinankaratra',
                'total_area_ha': 310.0
            }
        )
        farm_itasy, _ = Farm.objects.update_or_create(
            name="Terroirs Volcaniques d'Ampefy",
            defaults={
                'sector_code': 'Secteur 09',
                'region': 'Itasy',
                'total_area_ha': 195.0
            }
        )

        # 3. Crops
        crop_rice, _ = Crop.objects.update_or_create(
            name='Riz Paddy',
            variety='Vary Makalioka 34 (Riz de Luxe)',
            defaults={'target_yield_t_ha': 6.2}
        )
        crop_corn, _ = Crop.objects.update_or_create(
            name='Maïs',
            variety='IRAT 200 (Hybride Jaune)',
            defaults={'target_yield_t_ha': 4.8}
        )
        crop_soy, _ = Crop.objects.update_or_create(
            name='Soja',
            variety='UFV-1 (Grain haute teneur protéique)',
            defaults={'target_yield_t_ha': 2.2}
        )
        crop_cassava, _ = Crop.objects.update_or_create(
            name='Manioc',
            variety='Ampasimbe (Haute fécule)',
            defaults={'target_yield_t_ha': 18.0}
        )

        # 4. Fields (Parcels)
        parcels_data = [
            {
                'slug': '402-alaotra',
                'code': '#402',
                'name': 'Parcelle #402 • Casier Rizicole Nord (Ambatondrazaka)',
                'farm': farm_alaotra,
                'region': 'Alaotra-Mangoro',
                'crop_type': 'Riz Paddy',
                'variety': 'Vary Makalioka 34 (Riz de Luxe)',
                'area_ha': 485.0,
                'sown_date': '15 nov. 2024',
                'status': 'Optimal',
                'soil_type': 'Hydromorphe (Rizière)',
                'irrigation_type': 'Système de Riziculture Intensive (SRI)',
                'ndvi': 0.81,
                'ndvi_trend': '+0.04 vs 10j (Tallage optimal)',
                'moisture_pct': 41.0,
                'target_yield_t_ha': 6.2,
                'est_yield_t_ha': 6.8,
                'section': 'Zone Ambatondrazaka PC15',
                'urgent_action': 'Modulation NPK Urée 46% & Phosphate prête (Zone Map 92%)',
                'coordinates': [
                    [-17.822, 48.410],
                    [-17.815, 48.438],
                    [-17.830, 48.452],
                    [-17.842, 48.425],
                ],
                'center': [-17.828, 48.431],
                'color': '#059669',
                'fill_color': '#10b981',
                'notes': 'Rizière de plaine alluviale avec régulation par vanne du canal PC15.',
            },
            {
                'slug': '208-vakinankaratra',
                'code': '#208',
                'name': 'Parcelle #208 • Tanety Sud (Antsirabe / Betafo)',
                'farm': farm_vakinankaratra,
                'region': 'Vakinankaratra',
                'crop_type': 'Maïs',
                'variety': 'IRAT 200 (Hybride Jaune)',
                'area_ha': 310.0,
                'sown_date': '22 oct. 2024',
                'status': 'Needs Action',
                'soil_type': 'Latéritique / Ferrallitique (Tanety)',
                'irrigation_type': 'Pluvial strict',
                'ndvi': 0.62,
                'ndvi_trend': '-0.08 (Chlorose sur sol filtrant)',
                'moisture_pct': 29.0,
                'target_yield_t_ha': 4.8,
                'est_yield_t_ha': 3.9,
                'section': 'Coteau Betafo Plateau',
                'health_alert': 'Carence azotée & acidité ferrallitique détectée',
                'health_alert_detail': 'Décoloration foliaire Zone 2 (45 ha). Recommandé +35 kg/ha urée + amendement dolomitique.',
                'urgent_action': 'Survol drone multispectral planifié dans 3h',
                'coordinates': [
                    [-17.848, 48.395],
                    [-17.838, 48.412],
                    [-17.852, 48.428],
                    [-17.865, 48.405],
                ],
                'center': [-17.851, 48.410],
                'color': '#ea580c',
                'fill_color': '#fd651e',
                'notes': 'Sol de tanety sensible au lessivage des nutriments en début de saison des pluies.',
            },
            {
                'slug': '104-baiboho',
                'code': '#104',
                'name': 'Parcelle #104 • Bas-fond Alluvial Baiboho',
                'farm': farm_alaotra,
                'region': 'Alaotra-Mangoro',
                'crop_type': 'Soja',
                'variety': 'UFV-1 (Grain haute teneur protéique)',
                'area_ha': 240.0,
                'sown_date': '02 déc. 2024',
                'status': 'Good',
                'soil_type': 'Alluvial (Baiboho)',
                'irrigation_type': 'Gravitaire (Rizière inondée)',
                'ndvi': 0.74,
                'ndvi_trend': '+0.02 nominal',
                'moisture_pct': 38.0,
                'target_yield_t_ha': 2.2,
                'est_yield_t_ha': 2.5,
                'section': 'Plaine d’Anororo',
                'urgent_action': 'Tracteur John Deere 8RX en pulvérisation foliaire bio-stimulante',
                'coordinates': [
                    [-17.860, 48.425],
                    [-17.850, 48.448],
                    [-17.865, 48.462],
                    [-17.878, 48.435],
                ],
                'center': [-17.863, 48.442],
                'color': '#00855d',
                'fill_color': '#68dba9',
                'notes': 'Terre baiboho riche en matière organique, excellente rétention hydrique.',
            },
            {
                'slug': '305-itasy',
                'code': '#305',
                'name': 'Parcelle #305 • Terres Volcaniques (Lac Itasy)',
                'farm': farm_itasy,
                'region': 'Itasy',
                'crop_type': 'Manioc',
                'variety': 'Ampasimbe (Haute fécule)',
                'area_ha': 195.0,
                'sown_date': '18 sept. 2024',
                'status': 'Optimal',
                'soil_type': 'Volcanique',
                'irrigation_type': 'Pluvial strict',
                'ndvi': 0.84,
                'ndvi_trend': '+0.06 nominal',
                'moisture_pct': 44.0,
                'target_yield_t_ha': 18.0,
                'est_yield_t_ha': 21.4,
                'section': 'Secteur Ampefy Nord',
                'urgent_action': 'Tubérisation avancée • Zéro stress hydrique',
                'coordinates': [
                    [-17.835, 48.455],
                    [-17.825, 48.478],
                    [-17.840, 48.490],
                    [-17.852, 48.468],
                ],
                'center': [-17.838, 48.473],
                'color': '#16a34a',
                'fill_color': '#4ade80',
                'notes': 'Terroir volcanique exceptionnel sur les rives du lac, riche en minéraux naturels.',
            },
        ]

        fields_dict = {}
        for p in parcels_data:
            field, _ = Field.objects.update_or_create(
                slug=p['slug'],
                defaults=p
            )
            fields_dict[p['slug']] = field

        log(f"✓ {len(parcels_data)} Parcels seeded.", self.style.SUCCESS)

        # 5. Sensors & Probes
        sensors_data = [
            {
                'slug': 'probe-alpha-01',
                'field': fields_dict['402-alaotra'],
                'name': 'Sonde Alaotra 01',
                'station_code': 'Station MDG-01',
                'lat': -17.828,
                'lng': 48.431,
                'status': 'Online',
                'battery_pct': 98,
                'signal_dbm': -72,
                'irrigation_threshold': 32.0,
                'moisture_10cm': 38.2,
                'moisture_30cm': 41.5,
                'moisture_60cm': 46.8,
                'temperature_c': 24.4,
                'matric_potential_kpa': -28.5,
                'salinity_ec': 0.42,
            },
            {
                'slug': 'probe-alpha-02',
                'field': fields_dict['402-alaotra'],
                'name': 'Sonde Alaotra 02 (Canal PC15)',
                'station_code': 'Station MDG-02',
                'lat': -17.824,
                'lng': 48.435,
                'status': 'Online',
                'battery_pct': 92,
                'signal_dbm': -68,
                'irrigation_threshold': 32.0,
                'moisture_10cm': 36.4,
                'moisture_30cm': 39.8,
                'moisture_60cm': 44.1,
                'temperature_c': 25.1,
                'matric_potential_kpa': -32.0,
                'salinity_ec': 0.38,
            },
            {
                'slug': 'probe-alpha-03',
                'field': fields_dict['208-vakinankaratra'],
                'name': 'Sonde Tanety 03 (Betafo)',
                'station_code': 'Station MDG-03 (Highlands)',
                'lat': -17.851,
                'lng': 48.410,
                'status': 'Warning',
                'battery_pct': 78,
                'signal_dbm': -84,
                'irrigation_threshold': 30.0,
                'moisture_10cm': 26.5,
                'moisture_30cm': 29.2,
                'moisture_60cm': 34.0,
                'temperature_c': 22.8,
                'matric_potential_kpa': -55.0,
                'salinity_ec': 0.61,
            },
            {
                'slug': 'probe-alpha-04',
                'field': fields_dict['104-baiboho'],
                'name': 'Sonde Baiboho 04 (Anororo)',
                'station_code': 'Station MDG-04',
                'lat': -17.863,
                'lng': 48.442,
                'status': 'Online',
                'battery_pct': 95,
                'signal_dbm': -65,
                'irrigation_threshold': 32.0,
                'moisture_10cm': 39.1,
                'moisture_30cm': 42.4,
                'moisture_60cm': 48.2,
                'temperature_c': 23.9,
                'matric_potential_kpa': -22.1,
                'salinity_ec': 0.35,
            },
            {
                'slug': 'probe-alpha-05',
                'field': fields_dict['305-itasy'],
                'name': 'Sonde Itasy 05 (Ampefy)',
                'station_code': 'Station MDG-05',
                'lat': -17.838,
                'lng': 48.473,
                'status': 'Online',
                'battery_pct': 88,
                'signal_dbm': -76,
                'irrigation_threshold': 32.0,
                'moisture_10cm': 41.2,
                'moisture_30cm': 44.0,
                'moisture_60cm': 49.3,
                'temperature_c': 23.8,
                'matric_potential_kpa': -24.8,
                'salinity_ec': 0.40,
            },
        ]

        for s in sensors_data:
            m10 = s.pop('moisture_10cm')
            m30 = s.pop('moisture_30cm')
            m60 = s.pop('moisture_60cm')
            temp = s.pop('temperature_c')
            pot = s.pop('matric_potential_kpa')
            ec = s.pop('salinity_ec')

            sensor, _ = Sensor.objects.update_or_create(
                slug=s['slug'],
                defaults=s
            )

            Measurement.objects.create(
                sensor=sensor,
                moisture_10cm=m10,
                moisture_30cm=m30,
                moisture_60cm=m60,
                temperature_c=temp,
                matric_potential_kpa=pot,
                salinity_ec=ec,
            )

        log(f"✓ {len(sensors_data)} IoT Sensor Probes and initial telemetry created.", self.style.SUCCESS)

        # 6. VRA Prescription & Zones
        field_402 = fields_dict['402-alaotra']
        rx, _ = VRAPrescription.objects.update_or_create(
            field=field_402,
            defaults={
                'base_rate_kg_ha': 180.0,
                'fertilizer_type': 'Urée 46% (N) & NPK 11-22-16',
                'projected_savings_usd': 5850.0,
                'fertilizer_saved_kg': 8600.0,
                'notes': 'Modulation de fertilisation azotée basée sur l’imagerie multispectrale Sentinel-2.'
            }
        )

        zones_data = [
            {
                'zone_id': 'zone-1',
                'name': 'Zone 1 — Casier Central Alluvial',
                'label': 'Zone Haute Productivité (Rizière SRI)',
                'area_ha': 142.0,
                'pct_area': 29.3,
                'target_rate_kg_ha': 180.0,
                'recommended_rate_kg_ha': 153.0,
                'delta_pct': -15.0,
                'ndvi_range': '0.82 – 0.88',
                'soil_moisture': '42.5% vol',
                'color': '#059669',
                'description': 'Sol alluvionnaire lourd et riche en matière organique. Réduction de l’apport d’urée pour éviter la verse du riz.',
                'deficiency': 'Aucune • Forte efficience nutritive',
            },
            {
                'zone_id': 'zone-2',
                'name': 'Zone 2 — Crête Sableuse Tanety',
                'label': 'Zone Critique Lessivée',
                'area_ha': 45.0,
                'pct_area': 9.3,
                'target_rate_kg_ha': 180.0,
                'recommended_rate_kg_ha': 245.0,
                'delta_pct': 35.0,
                'ndvi_range': '0.58 – 0.64',
                'soil_moisture': '28.1% vol',
                'color': '#ea580c',
                'description': 'Crête filtrante exposée au ravinement. Majoration de dose d’urée 46% et apport fractionné préconisé.',
                'deficiency': 'Déficit sévère N & S, acidité pH 5.4',
            },
            {
                'zone_id': 'zone-3',
                'name': 'Zone 3 — Plaine Baiboho Médiane',
                'label': 'Zone Croissance Nominale',
                'area_ha': 185.0,
                'pct_area': 38.1,
                'target_rate_kg_ha': 180.0,
                'recommended_rate_kg_ha': 185.0,
                'delta_pct': 2.7,
                'ndvi_range': '0.72 – 0.78',
                'soil_moisture': '37.8% vol',
                'color': '#22c55e',
                'description': 'Bon équilibre hydrique, alimentation régulière par canal tertiaire. Dose d’entretien standard.',
                'deficiency': 'Équilibré',
            },
            {
                'zone_id': 'zone-4',
                'name': 'Zone 4 — Bordure Drainage Fluviale',
                'label': 'Zone Rétention Modérée',
                'area_ha': 113.0,
                'pct_area': 23.3,
                'target_rate_kg_ha': 180.0,
                'recommended_rate_kg_ha': 144.0,
                'delta_pct': -20.0,
                'ndvi_range': '0.66 – 0.71',
                'soil_moisture': '33.2% vol',
                'color': '#f59e0b',
                'description': 'Bordure en pente douce vers les canaux d’évacuation. Plafond d’application pour optimiser la marge brute.',
                'deficiency': 'Fixation modérée du phosphore',
            },
        ]

        for z in zones_data:
            VRAZone.objects.update_or_create(
                prescription=rx,
                zone_id=z['zone_id'],
                defaults=z
            )

        log("✓ VRA Prescription and 4 modulation zones created.", self.style.SUCCESS)

        # 7. Yield Forecast
        forecast, _ = YieldForecast.objects.update_or_create(
            field=field_402,
            season='2024',
            defaults={
                'model_confidence_pct': 94.2,
                'projected_yield_t_ha': 6.8,
                'projected_tonnes': 3298.0,
                'gross_valuation_usd': 1154300.0,
                'gross_valuation_mga': 5310000000.0,
            }
        )

        stages_data = [
            {'stage': 'Pépinière / Semis', 'day_of_year': 10, 'projected_yield': 1.2, 'benchmark_yield': 1.0, 'gdd_accumulated': 180, 'order': 1},
            {'stage': 'Repiquage (SRI)', 'day_of_year': 28, 'projected_yield': 2.6, 'benchmark_yield': 2.3, 'gdd_accumulated': 420, 'order': 2},
            {'stage': 'Tallage Actif', 'day_of_year': 55, 'projected_yield': 4.5, 'benchmark_yield': 4.1, 'gdd_accumulated': 850, 'order': 3},
            {'stage': 'Initiation Paniculaire', 'day_of_year': 80, 'projected_yield': 5.8, 'benchmark_yield': 5.2, 'gdd_accumulated': 1280, 'order': 4},
            {'stage': 'Épiaison / Floraison', 'day_of_year': 105, 'projected_yield': 6.4, 'benchmark_yield': 5.8, 'gdd_accumulated': 1650, 'order': 5},
            {'stage': 'Maturation du Grain', 'day_of_year': 135, 'projected_yield': 6.8, 'benchmark_yield': 6.0, 'gdd_accumulated': 2050, 'order': 6},
        ]

        for st in stages_data:
            PhenologicalStage.objects.update_or_create(
                forecast=forecast,
                stage=st['stage'],
                defaults=st
            )

        scenarios_data = [
            {
                'scenario_id': 'baseline',
                'name': 'Saison des Pluies Régulière (Asara)',
                'description': 'Mousson d’été bien établie sur les Hautes Terres et le bassin d’Alaotra (650 mm cumulés).',
                'yield_impact_pct': 0.0,
                'projected_total_tonnes': 3298.0,
                'valuation_change_usd': 0.0,
                'valuation_change_mga': 0.0,
            },
            {
                'scenario_id': 'dry',
                'name': 'Retard de Mousson / Pause Pluviométrique',
                'description': 'Stress hydrique temporaire sur les rizières pluviales et les cultures de tanety.',
                'yield_impact_pct': -8.5,
                'projected_total_tonnes': 3018.0,
                'valuation_change_usd': -95000.0,
                'valuation_change_mga': -437000000.0,
            },
            {
                'scenario_id': 'favorable',
                'name': 'Hydrologie Optimale & Ensoleillement',
                'description': 'Remplissage maximal des canaux d’irrigation et rayonnement solaire abondant.',
                'yield_impact_pct': 6.2,
                'projected_total_tonnes': 3502.0,
                'valuation_change_usd': 72000.0,
                'valuation_change_mga': 331200000.0,
            },
        ]

        for sc in scenarios_data:
            WeatherScenario.objects.update_or_create(
                forecast=forecast,
                scenario_id=sc['scenario_id'],
                defaults=sc
            )

        log("✓ Yield Forecast, Phenological Stages, and Weather Scenarios seeded.", self.style.SUCCESS)
        log("=== AROVOLY Backend Database successfully initialized! ===", self.style.SUCCESS)

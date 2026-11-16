# AgroField AI — Crop Monitoring

AgroField AI est une plateforme web de **precision agriculture** destinée aux agronomes,
gestionnaires d’exploitations et opérateurs de terrain. Elle centralise les données
géospatiales, satellitaires, météorologiques et IoT afin d'aider à prendre de meilleures
décisions sur les parcelles, l'irrigation, la fertilisation et la récolte.

Le dossier [`stitch_precision_agriculture_saas_dashboard/`](./stitch_precision_agriculture_saas_dashboard/)
contient les maquettes fonctionnelles et le design system de référence. L'application
finale est envisagée avec un frontend React et une API Django.

## Objectifs

- Visualiser les parcelles sur une carte interactive.
- Suivre la vigueur des cultures avec les indices multispectraux, notamment le NDVI.
- Identifier les zones de stress hydrique, de carence ou d'anomalie.
- Exploiter les données de capteurs de sol et de stations IoT.
- Préparer des cartes de modulation à taux variable (VRA) pour la fertilisation.
- Estimer le rendement, la production et la valeur prévisionnelle des récoltes.
- Donner une vision opérationnelle des machines, drones et passerelles de télémétrie.

## Fonctionnalités prévues

### Tableau de bord de précision agricole

- Vue satellite avec limites de parcelles, zones d'analyse et grille multispectrale.
- Superposition NDVI, hydrologie et modèle numérique d'élévation.
- Indicateurs de santé végétative, alertes et état des équipements.
- Filtres par culture, parcelle, période et niveau de risque.
- Export des données géographiques au format KML/SHP.

### Gestion des parcelles

- Registre des parcelles et de leurs cultures.
- Surface, rendement, historique et état sanitaire.
- Création et modification des limites de parcelles.
- Comparaison entre parcelles et cycles de production.

### Sols et capteurs IoT

- Suivi de l'humidité à plusieurs profondeurs.
- Température du sol, potentiel matriciel et état de la batterie.
- Localisation des sondes sur la carte.
- État de connexion, latence et synchronisation des passerelles LoRaWAN.
- Alertes lorsque les seuils d'irrigation ou de santé sont dépassés.

### Prévision de rendement

- Projection de production et de rendement par hectare.
- Estimation de la valeur de récolte.
- Suivi des tendances NDVI, degrés-jours de croissance et humidité du sol.
- Indice de confiance du modèle et estimation du risque climatique.
- Export d'un rapport de prévision.

### Authentification et espaces agricoles

- Connexion sécurisée.
- Gestion de plusieurs exploitations ou espaces de travail.
- Rôles prévus : administrateur, agronome, gestionnaire et opérateur terrain.

## Maquettes Stitch

Les prototypes disponibles dans le dépôt couvrent les écrans suivants :

| Écran | Description |
| --- | --- |
| `sign_in_agrofield_ai_precision_agriculture` | Connexion à l'espace agricole |
| `my_fields_farm_parcels_operational_overview` | Inventaire des parcelles et vue opérationnelle |
| `precision_agriculture_vra_crop_monitoring_dashboard` | Carte NDVI, VRA et suivi de la santé des cultures |
| `soil_sensors_iot_hardware_root_zone_diagnostics` | Télémétrie des sols et diagnostic des capteurs |
| `yield_forecast_ai_harvest_production_analytics` | Prévisions de rendement et analyses économiques |

Chaque écran contient un `code.html` de référence et une capture `screen.png`.
Le document [`DESIGN.md`](./stitch_precision_agriculture_saas_dashboard/agrofield_ai/DESIGN.md)
définit les couleurs, la typographie, les espacements et les composants visuels.

### Direction artistique

- Style moderne, scientifique et orienté données.
- Cartes et panneaux en glassmorphism.
- Vert émeraude pour la croissance et les états optimaux.
- Orange pour les actions prioritaires et les alertes.
- Ambre pour les risques modérés.
- `Plus Jakarta Sans` pour les titres et `Inter` pour les données.
- Interface responsive desktop, tablette et mobile.

## Stack technique envisagée

### Frontend

- **React** avec TypeScript.
- **Vite** pour le développement et le build.
- **React Router** pour la navigation.
- **Tailwind CSS** pour le design system issu de Stitch.
- **TanStack Query** pour les appels et le cache API.
- **Recharts** ou une bibliothèque équivalente pour les graphiques.
- **MapLibre GL** ou **Leaflet** pour les cartes et couches géospatiales.

### Backend

- **Django** et **Django REST Framework**.
- **PostgreSQL** avec **PostGIS** pour les parcelles et géométries.
- **JWT** ou sessions sécurisées pour l'authentification.
- **Celery** et **Redis** pour les synchronisations et calculs asynchrones.
- Stockage objet compatible S3 pour les images, exports et fichiers géospatiaux.

### Données et intégrations à étudier

- Imagerie satellite **Esri World Imagery** pour la visualisation cartographique.
- Imagerie **Maxar** en option pour les besoins de très haute résolution et les
  usages soumis à licence.
- Imagerie d'analyse Sentinel-2 pour les indices multispectraux et le NDVI.
- Données météorologiques et prévisions locales.
- Capteurs de sol et passerelles LoRaWAN.
- Télématique des tracteurs et drones.
- Import/export GeoJSON, KML et SHP.

### Imagerie cartographique

Le fond satellite recommandé pour l'application est **Esri World Imagery**. Il
convient à la visualisation des parcelles dans le tableau de bord et permet de
conserver une source cartographique cohérente pendant le développement. **Maxar**
peut être ajouté comme source premium lorsque le niveau de résolution, la zone
couverte et la licence commerciale le justifient.

L'imagerie ne doit pas être codée en dur dans les composants. La future
implémentation React devra sélectionner la source via configuration :

```env
VITE_IMAGERY_PROVIDER=esri
VITE_ESRI_IMAGERY_URL=https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer
# Optionnel, selon le contrat et l'API Maxar retenus
VITE_MAXAR_IMAGERY_URL=
VITE_MAXAR_API_KEY=
```

Les tuiles Esri/Maxar doivent être utilisées conformément à leurs conditions
d'utilisation. L'attribution visible doit être conservée dans la carte, et les
clés d'API doivent rester côté serveur ou dans les variables d'environnement :

- Esri : `© Esri, Maxar, Earthstar Geographics, and the GIS User Community`
- Maxar : attribution et licence à confirmer selon le produit souscrit

Les images `screen.png` et les URLs d'images présentes dans les prototypes Stitch
sont uniquement des références visuelles. Elles ne constituent pas encore une
intégration cartographique en production. La carte réelle devra être implémentée
avec MapLibre GL ou Leaflet afin de gérer les tuiles, le zoom, les couches NDVI,
les limites de parcelles et l'attribution.

## Architecture cible

```text
Navigateur
    │
    ▼
React + TypeScript
    │ REST/JSON
    ▼
Django + Django REST Framework
    ├── Authentification et utilisateurs
    ├── Exploitations, parcelles et cultures
    ├── Capteurs, mesures et alertes
    ├── Analyses NDVI et prescriptions VRA
    └── Prévisions de rendement
    │
    ├── PostgreSQL + PostGIS
    ├── Redis + Celery
    └── Stockage objet / fournisseurs de données externes
```

Le frontend ne doit pas contenir de logique métier ou de données sensibles : les
permissions, calculs agronomiques, imports et traitements doivent être validés par
l'API Django.

## Organisation cible du dépôt

```text
.
├── frontend/                         # Application React
├── backend/                          # Projet Django et API REST
├── stitch_precision_agriculture_saas_dashboard/
│   ├── agrofield_ai/DESIGN.md        # Design system
│   └── */                            # Prototypes d'écrans Stitch
└── README.md
```

Cette structure pourra évoluer lorsque l'implémentation React/Django commencera.

## Démarrage du projet

Les maquettes Stitch sont actuellement des prototypes statiques. Aucun démarrage
React ou Django n'est encore fourni dans le dépôt.

Lorsque les applications seront initialisées, le démarrage local suivra ce principe :

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Les variables sensibles devront être placées dans un fichier `.env` local et ne
devront jamais être commitées.

## Feuille de route

1. Initialiser les applications React et Django.
2. Mettre en place l'authentification et les espaces agricoles.
3. Créer les modèles `Farm`, `Field`, `Crop`, `Sensor` et `Measurement`.
4. Construire le tableau de bord et la gestion des parcelles.
5. Ajouter PostGIS et la cartographie interactive.
6. Intégrer Esri World Imagery, puis évaluer Maxar selon les besoins de résolution
   et de licence.
7. Connecter les données Sentinel-2, météo et capteurs IoT.
8. Implémenter les alertes, les prescriptions VRA et les exports.
9. Ajouter les modèles de prévision de rendement et les tests.
10. Préparer le déploiement, l'observabilité et la documentation API.

## Statut

**Phase actuelle : conception UI et cadrage fonctionnel.**

Les fichiers Stitch servent de référence visuelle et fonctionnelle. Les chiffres,
coordonnées, mesures et noms présents dans les maquettes sont des données de
démonstration et ne représentent pas encore des données agricoles réelles.

## Contribution

Les contributions sont les bienvenues. Avant toute contribution importante :

1. Décrire le besoin ou le cas d'usage.
2. Vérifier la cohérence avec le design system.
3. Ajouter les tests correspondants lorsque la fonctionnalité sera implémentée.
4. Ne jamais ajouter de clé API, mot de passe ou donnée sensible au dépôt.

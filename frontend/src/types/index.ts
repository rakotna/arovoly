export type ViewType = 'my_fields' | 'vra_dashboard' | 'soil_sensors' | 'yield_forecast' | 'sign_in';

export type CropType = 'Corn' | 'Winter Wheat' | 'Soybeans' | 'Canola' | 'Sunflower' | 'Barley';

export type ParcelStatus = 'Optimal' | 'Good' | 'Needs Action' | 'Critical';

export interface Parcel {
  id: string;
  code: string;
  name: string;
  crop: CropType;
  variety: string;
  areaHa: number;
  sownDate: string;
  status: ParcelStatus;
  ndvi: number;
  ndviTrend: string;
  moisturePct: number;
  targetYieldTha: number;
  estYieldTha: number;
  section: string;
  healthAlert?: string;
  healthAlertDetail?: string;
  urgentAction?: string;
  coordinates: [number, number][]; // LatLng polygon
  center: [number, number];
  color: string;
  fillColor: string;
}

export interface SensorProbe {
  id: string;
  name: string;
  stationCode: string;
  parcelId: string;
  parcelName: string;
  lat: number;
  lng: number;
  status: 'Online' | 'Warning' | 'Offline';
  batteryPct: number;
  signalDbm: number; // e.g. -74 dBm (LoRaWAN)
  lastSynced: string;
  moisture10cm: number; // %
  moisture30cm: number; // %
  moisture60cm: number; // %
  temperatureC: number;
  matricPotentialKPa: number; // e.g. -32 kPa
  salinityEC: number; // dS/m
  irrigationThreshold: number; // %
}

export interface VRAZone {
  id: string;
  name: string;
  label: string;
  areaHa: number;
  pctArea: number;
  targetRateKgHa: number;
  recommendedRateKgHa: number;
  deltaPct: number;
  ndviRange: string;
  soilMoisture: string;
  color: string;
  description: string;
  deficiency: string;
}

export interface PhenologicalStage {
  stage: string;
  dayOfYear: number;
  projectedYield: number;
  benchmarkYield: number;
  gddAccumulated: number;
}

export interface WeatherScenario {
  id: 'baseline' | 'dry' | 'favorable';
  name: string;
  description: string;
  yieldImpactPct: number;
  projectedTotalTonnes: number;
  valuationChangeUsd: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  terminalUnit: string;
  avatarUrl: string;
}

import { Parcel, SensorProbe, VRAZone, UserProfile } from '../types';
import { MOCK_PARCELS, MOCK_SENSORS, MOCK_VRA_ZONES } from '../data/mockData';

const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) ||
  'https://silver-barnacle-7vvrg74vx65vfqqv-8000.app.github.dev/api';

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('arovoly_token');
  return token ? { Authorization: `Token ${token}` } : {};
};

/**
 * AROVOLY - Precision Agriculture & Crop Protection API Client
 * Seamlessly connects React to Django REST Framework with intelligent offline fallback.
 */
export const api = {
  // --- PARCELS / FIELDS ---
  async getParcels(): Promise<Parcel[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/parcels/`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : MOCK_PARCELS;
    } catch (err) {
      console.warn('[AROVOLY API] Backend unavailable, using local parcels data:', err);
      return MOCK_PARCELS;
    }
  },

  async createParcel(parcel: Partial<Parcel>): Promise<Parcel> {
    try {
      const res = await fetch(`${API_BASE_URL}/parcels/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(parcel),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[AROVOLY API] Fallback to local parcel save:', err);
      return parcel as Parcel;
    }
  },

  async updateParcel(parcelId: string, parcel: Partial<Parcel>): Promise<Parcel | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/parcels/${parcelId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(parcel),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[AROVOLY API] Parcel update unavailable, keeping local changes:', err);
      return null;
    }
  },

  async deleteParcel(parcelId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/parcels/${parcelId}/`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      return res.ok || res.status === 204;
    } catch (err) {
      console.warn('[AROVOLY API] Fallback to local parcel delete:', err);
      return true;
    }
  },

  // --- SENSORS & TELEMETRY ---
  async getSensors(): Promise<SensorProbe[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/sensors/`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : MOCK_SENSORS;
    } catch (err) {
      console.warn('[AROVOLY API] Backend unavailable, using local sensors data:', err);
      return MOCK_SENSORS;
    }
  },

  async deploySensor(sensor: Partial<SensorProbe>): Promise<SensorProbe> {
    try {
      const res = await fetch(`${API_BASE_URL}/sensors/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sensor),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[AROVOLY API] Fallback to local sensor deploy:', err);
      return sensor as SensorProbe;
    }
  },

  async simulateTelemetry(): Promise<SensorProbe[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/sensors/simulate/`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.sensors || null;
    } catch (err) {
      console.warn('[AROVOLY API] Telemetry simulation offline:', err);
      return null;
    }
  },

  // --- VRA PRESCRIPTIONS ---
  async getPrescription(parcelId?: string): Promise<any> {
    try {
      const url = parcelId
        ? `${API_BASE_URL}/prescriptions/current/?parcel_id=${parcelId}`
        : `${API_BASE_URL}/prescriptions/current/`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[AROVOLY API] Fallback to mock VRA zones:', err);
      return { zones: MOCK_VRA_ZONES, baseRateKgHa: 180 };
    }
  },

  async calculateVRA(parcelId: string, baseRateKgHa: number, costPerKg: number = 0.68): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/prescriptions/calculate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parcel_id: parcelId,
          base_rate_kg_ha: baseRateKgHa,
          cost_per_kg: costPerKg,
        }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[AROVOLY API] Fallback to client VRA calculation:', err);
      return null;
    }
  },

  // --- YIELD FORECASTS ---
  async getYieldForecast(parcelId?: string): Promise<any> {
    try {
      const url = parcelId
        ? `${API_BASE_URL}/forecasts/current/?parcel_id=${parcelId}`
        : `${API_BASE_URL}/forecasts/current/`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[AROVOLY API] Fallback to client yield forecast:', err);
      return null;
    }
  },

  async simulateWeatherScenario(parcelId: string, scenario: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/forecasts/simulate_scenario/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parcel_id: parcelId, scenario }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[AROVOLY API] Fallback to local scenario simulation:', err);
      return null;
    }
  },

  // --- AUTHENTICATION ---
  async login(email: string, password: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      let detail = `Échec de connexion (${res.status})`;
      try {
        const data = await res.json();
        if (typeof data.detail === 'string') detail = data.detail;
      } catch {
        // Keep the HTTP status message when the server does not return JSON.
      }
      throw new Error(detail);
    }
    const data = await res.json();
    if (!data.token || !data.user) throw new Error('Réponse de connexion invalide.');
    localStorage.setItem('arovoly_token', data.token);
    return data.user as UserProfile;
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    region: string;
  }): Promise<UserProfile> {
    const res = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || `Échec de l'inscription (${res.status})`);
    if (!data.token || !data.user) throw new Error("Réponse d'inscription invalide.");
    localStorage.setItem('arovoly_token', data.token);
    return data.user as UserProfile;
  },

  // --- EXPORT DOWNLOAD URLs ---
  getParcelGeoJsonUrl(parcelSlug: string): string {
    return `${API_BASE_URL}/parcels/${parcelSlug}/geojson/`;
  },

  getParcelKmlUrl(parcelSlug: string): string {
    return `${API_BASE_URL}/parcels/${parcelSlug}/kml/`;
  },
};

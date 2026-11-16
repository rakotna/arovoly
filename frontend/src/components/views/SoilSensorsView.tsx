import React, { useState } from 'react';
import { SensorProbe, Parcel } from '../../types';
import {
  Cpu,
  BatteryCharging,
  Radio,
  Thermometer,
  Layers,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface SoilSensorsViewProps {
  sensors: SensorProbe[];
  parcels: Parcel[];
  onDeploySensor: (newSensor: SensorProbe) => void;
  onShowToast: (msg: string) => void;
}

export const SoilSensorsView: React.FC<SoilSensorsViewProps> = ({
  sensors,
  parcels,
  onDeploySensor,
  onShowToast,
}) => {
  const [selectedProbeId, setSelectedProbeId] = useState<string>(sensors[0]?.id || 'probe-alpha-01');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [newStationCode, setNewStationCode] = useState('Station Alpha-06');
  const [newParcelId, setNewParcelId] = useState(parcels[0]?.id || '402-north');

  const activeProbe = sensors.find((s) => s.id === selectedProbeId) || sensors[0];

  const handleCreateSensor = (e: React.FormEvent) => {
    e.preventDefault();
    const targetParcel = parcels.find((p) => p.id === newParcelId) || parcels[0];
    const newProbe: SensorProbe = {
      id: `probe-${Date.now()}`,
      name: newStationCode,
      stationCode: newStationCode,
      parcelId: targetParcel.id,
      parcelName: targetParcel.name,
      lat: targetParcel.center[0] + 0.002,
      lng: targetParcel.center[1] + 0.002,
      status: 'Online',
      batteryPct: 100,
      signalDbm: -64,
      lastSynced: "À l'instant",
      moisture10cm: 37.0,
      moisture30cm: 40.5,
      moisture60cm: 45.0,
      temperatureC: 19.5,
      matricPotentialKPa: -26.0,
      salinityEC: 0.39,
      irrigationThreshold: 32.0,
    };
    onDeploySensor(newProbe);
    setIsDeployModalOpen(false);
    onShowToast(`Nouvelle sonde ${newStationCode} enregistrée et appairée sur ${targetParcel.name}.`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#faf8ff] p-4 sm:p-6 lg:p-8 gap-6">
      {/* Top Command Sub-bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Réseau Télémétrie IoT & Sondes Capacitives
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {sensors.filter((s) => s.status === 'Online').length} / {sensors.length} En Ligne
            </span>
            <span className="text-xs text-slate-400">• LoRaWAN 868 MHz</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 font-heading">
            Multi-Depth Stratum Diagnostics & Soil Telemetry
          </h1>
          <p className="text-xs text-slate-500">
            Analyse continue de la permittivité diélectrique, du potentiel matriciel et de l'humidité aux strates racinaires (10, 30 et 60 cm).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onShowToast('Diagnostic de santé de flotte : Toutes les sondes répondent avec un taux de paquets reçus de 99.4%.')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Diagnostic Flotte</span>
          </button>
          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Déployer Nouvelle Sonde</span>
          </button>
        </div>
      </div>

      {/* Active Probe Station Snapshot Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 font-heading">{activeProbe.name}</h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeProbe.status === 'Warning'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {activeProbe.status === 'Warning' ? 'Stress hydrique' : 'Opérationnel'}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Affectée à : <b>{activeProbe.parcelName}</b> • Synchronisée {activeProbe.lastSynced}
            </span>
          </div>
        </div>

        {/* Telemetry Metrics Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-emerald-600" /> Batterie Solaire
            </span>
            <span className="text-base font-extrabold text-slate-900">{activeProbe.batteryPct}%</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Tension 3.65V</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Radio className="w-3 h-3 text-blue-600" /> Signal LoRaWAN
            </span>
            <span className="text-base font-extrabold text-slate-900">{activeProbe.signalDbm} dBm</span>
            <span className="text-[10px] text-blue-600 font-semibold">SNR +8.5 dB</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-orange-500" /> Température Sol
            </span>
            <span className="text-base font-extrabold text-slate-900">{activeProbe.temperatureC}°C</span>
            <span className="text-[10px] text-slate-500 font-semibold">Optimal germination</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Layers className="w-3 h-3 text-purple-600" /> Potentiel Matriciel
            </span>
            <span className="text-base font-extrabold text-slate-900">{activeProbe.matricPotentialKPa} kPa</span>
            <span className="text-[10px] text-purple-600 font-semibold">Réserve utile 82%</span>
          </div>
        </div>
      </div>

      {/* Multi-Depth Root Stratum Diagnostics (The 3 Depths) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stratum 1: 10cm */}
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center">
                10
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900">Strate Horizon Supérieur</span>
                <span className="block text-[10px] text-slate-400">Profondeur 0 - 15 cm (Semis)</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 font-heading">
              {activeProbe.moisture10cm}% vol.
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, activeProbe.moisture10cm * 2)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Seuil flétrissement : 18%</span>
            <span className="text-emerald-700 font-semibold">Capacité au champ : 42%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Humidité de surface nominale. Évaporation modérée, aucune irrigation d'urgence requise.
          </p>
        </div>

        {/* Stratum 2: 30cm */}
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                30
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900">Strate Racine Active</span>
                <span className="block text-[10px] text-slate-400">Profondeur 20 - 40 cm (Pivot)</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-blue-700 font-heading">
              {activeProbe.moisture30cm}% vol.
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, activeProbe.moisture30cm * 2)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Seuil confort : 32%</span>
            <span className="text-blue-700 font-semibold">Absorption maximale</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Zone principale de puisement racinaire du maïs et du blé. Disponibilité hydrique optimale.
          </p>
        </div>

        {/* Stratum 3: 60cm */}
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 font-extrabold text-xs flex items-center justify-center">
                60
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900">Strate Réserve Profonde</span>
                <span className="block text-[10px] text-slate-400">Profondeur 50 - 75 cm (Sous-sol)</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-purple-700 font-heading">
              {activeProbe.moisture60cm}% vol.
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, activeProbe.moisture60cm * 2)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Réserve utile : 94%</span>
            <span className="text-purple-700 font-semibold">Nappe drainante</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Niveau de réapprovisionnement hivernal conservé. Aucune contrainte hydrique profonde attendue.
          </p>
        </div>
      </div>

      {/* Sensor Fleet • Hardware Registry Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Flotte de Capteurs Connectés & Stations Sol
            </h3>
            <span className="text-xs text-slate-500">
              Sélectionnez une station pour charger ses mesures détaillées dans le panneau supérieur.
            </span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {sensors.length} Stations Déployées
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-3 px-3">Station & Code</th>
                <th className="py-3 px-3">Parcelle Assignée</th>
                <th className="py-3 px-3">Humidité 10 / 30 / 60 cm</th>
                <th className="py-3 px-3">Temp. Sol</th>
                <th className="py-3 px-3">Batterie</th>
                <th className="py-3 px-3">Signal LoRa</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sensors.map((probe) => {
                const isSelected = probe.id === activeProbe.id;
                return (
                  <tr
                    key={probe.id}
                    onClick={() => setSelectedProbeId(probe.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/50' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{probe.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{probe.parcelName}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">
                        {probe.moisture10cm}% / {probe.moisture30cm}% / {probe.moisture60cm}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-semibold">{probe.temperatureC}°C</td>
                    <td className="py-3 px-3 text-slate-700">
                      <span className="font-bold">{probe.batteryPct}%</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{probe.signalDbm} dBm</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          probe.status === 'Warning'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {probe.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowToast(`Ping envoyé à ${probe.stationCode} : Réponse ACK reçue en 38ms.`);
                        }}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all"
                      >
                        Ping Test
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Deploy Sensor */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Déployer une Nouvelle Station IoT
              </h3>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSensor} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Nom / Identifiant Station</label>
                <input
                  type="text"
                  required
                  value={newStationCode}
                  onChange={(e) => setNewStationCode(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Parcelle d'implantation</label>
                <select
                  value={newParcelId}
                  onChange={(e) => setNewParcelId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500"
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.crop})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex flex-col gap-1">
                <span className="font-bold text-slate-800">Paramètres Sonde Capacitive :</span>
                <span>• Profondeurs configurées : 10 cm, 30 cm, 60 cm</span>
                <span>• Protocole : LoRaWAN EU868 OTAA classe A</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeployModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  Confirmer le Déploiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

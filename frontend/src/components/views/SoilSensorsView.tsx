import React, { useState } from 'react';
import { SensorProbe, Parcel } from '../../types';
import {
  Cpu,
  BatteryCharging,
  Radio,
  Thermometer,
  Layers,
  PlusCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

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
  const { language, t } = useTranslation();
  const [selectedProbeId, setSelectedProbeId] = useState<string>(sensors[0]?.id || 'probe-alpha-01');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [newStationCode, setNewStationCode] = useState('Station MDG-06 (Ambatondrazaka)');
  const [newParcelId, setNewParcelId] = useState(parcels[0]?.id || '402-alaotra');

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
      lastSynced: language === 'fr' ? "À l'instant" : "Just now",
      moisture10cm: 37.0,
      moisture30cm: 40.5,
      moisture60cm: 45.0,
      temperatureC: 24.5,
      matricPotentialKPa: -26.0,
      salinityEC: 0.39,
      irrigationThreshold: 32.0,
    };
    onDeploySensor(newProbe);
    setIsDeployModalOpen(false);
    onShowToast(
      language === 'fr'
        ? `Nouvelle sonde ${newStationCode} enregistrée et appairée sur ${targetParcel.name}.`
        : `New sensor ${newStationCode} registered and paired to ${targetParcel.name}.`
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#fcf9f3] p-3.5 sm:p-5 lg:p-6 gap-4 sm:gap-5 max-w-[1600px] mx-auto w-full">
      {/* Top Command Sub-bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t.soilSensors.badge}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] sm:text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {sensors.filter((s) => s.status === 'Online').length} / {sensors.length} {t.soilSensors.onlineCount}
            </span>
            <span className="text-xs text-slate-400">• LoRaWAN 868 MHz</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 sm:mt-1 font-heading">
            {t.soilSensors.title}
          </h1>
          <p className="text-xs text-slate-500">
            {t.soilSensors.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onShowToast(language === 'fr' ? 'Diagnostic de santé de flotte : Toutes les sondes répondent avec un taux de paquets reçus de 99.4%.' : 'Fleet health diagnostic: All ground probes responding at 99.4% packet delivery rate.')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>{t.soilSensors.fleetDiag}</span>
          </button>
          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-700/20"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t.soilSensors.deployBtn}</span>
          </button>
        </div>
      </div>

      {/* Active Probe Station Snapshot Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">{activeProbe.name}</h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeProbe.status === 'Warning'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {activeProbe.status === 'Warning' ? t.common.needsAction : t.common.optimal}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {language === 'fr' ? 'Affectée à :' : 'Assigned to:'} <b>{activeProbe.parcelName}</b> • {activeProbe.lastSynced}
            </span>
          </div>
        </div>

        {/* Telemetry Metrics Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-emerald-600" /> {t.soilSensors.solarBattery}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900">{activeProbe.batteryPct}%</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Tension 3.65V</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Radio className="w-3 h-3 text-blue-600" /> {t.soilSensors.loraSignal}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900">{activeProbe.signalDbm} dBm</span>
            <span className="text-[10px] text-blue-600 font-semibold">SNR +8.5 dB</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-orange-500" /> {t.soilSensors.soilTemp}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900">{activeProbe.temperatureC}°C</span>
            <span className="text-[10px] text-slate-500 font-semibold">{t.common.optimal}</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Layers className="w-3 h-3 text-purple-600" /> {t.soilSensors.matricPotential}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900">{activeProbe.matricPotentialKPa} kPa</span>
            <span className="text-[10px] text-purple-600 font-semibold">Réserve 82%</span>
          </div>
        </div>
      </div>

      {/* Multi-Depth Root Stratum Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Stratum 1: 10cm */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center">
                10
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900">{t.soilSensors.stratum10Title}</span>
                <span className="block text-[10px] text-slate-400">{t.soilSensors.stratum10Sub}</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 font-heading">
              {activeProbe.moisture10cm}% vol.
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 sm:h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, activeProbe.moisture10cm * 2)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500">
            <span>Seuil : 18%</span>
            <span className="text-emerald-700 font-semibold">Capacité champ : 42%</span>
          </div>
        </div>

        {/* Stratum 2: 30cm */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                30
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900">{t.soilSensors.stratum30Title}</span>
                <span className="block text-[10px] text-slate-400">{t.soilSensors.stratum30Sub}</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-blue-700 font-heading">
              {activeProbe.moisture30cm}% vol.
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 sm:h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, activeProbe.moisture30cm * 2)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500">
            <span>Seuil : 32%</span>
            <span className="text-blue-700 font-semibold">Absorption maximale</span>
          </div>
        </div>

        {/* Stratum 3: 60cm */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-50 text-purple-700 font-extrabold text-xs flex items-center justify-center">
                60
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900">{t.soilSensors.stratum60Title}</span>
                <span className="block text-[10px] text-slate-400">{t.soilSensors.stratum60Sub}</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-purple-700 font-heading">
              {activeProbe.moisture60cm}% vol.
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 sm:h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, activeProbe.moisture60cm * 2)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500">
            <span>Réserve : 94%</span>
            <span className="text-purple-700 font-semibold">Nappe drainante</span>
          </div>
        </div>
      </div>

      {/* Sensor Fleet Table */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
              {t.soilSensors.fleetTableTitle}
            </h3>
            <span className="text-xs text-slate-500">
              {t.soilSensors.fleetTableSub}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {sensors.length} {language === 'fr' ? 'Stations Déployées' : 'Stations Deployed'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-3 px-3">Station & Code</th>
                <th className="py-3 px-3">{language === 'fr' ? 'Parcelle Assignée' : 'Assigned Parcel'}</th>
                <th className="py-3 px-3">10 / 30 / 60 cm</th>
                <th className="py-3 px-3">{t.soilSensors.soilTemp}</th>
                <th className="py-3 px-3">{t.soilSensors.solarBattery}</th>
                <th className="py-3 px-3">LoRa</th>
                <th className="py-3 px-3">{t.common.status}</th>
                <th className="py-3 px-3 text-right">{t.common.actions}</th>
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
                        {probe.status === 'Warning' ? t.common.needsAction : t.common.optimal}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowToast(language === 'fr' ? `Ping envoyé à ${probe.stationCode} : Réponse ACK reçue en 38ms.` : `Ping sent to ${probe.stationCode}: ACK reply received in 38ms.`);
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
                {t.soilSensors.deployModalTitle}
              </h3>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSensor} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">{t.soilSensors.stationId}</label>
                <input
                  type="text"
                  required
                  value={newStationCode}
                  onChange={(e) => setNewStationCode(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">{t.soilSensors.assignedParcel}</label>
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
                <span className="font-bold text-slate-800">{language === 'fr' ? 'Configuration Sonde Capacitive :' : 'Capacitive Probe Setup:'}</span>
                <span>• {language === 'fr' ? 'Profondeurs configurées : 10 cm, 30 cm, 60 cm' : 'Configured depths: 10 cm, 30 cm, 60 cm'}</span>
                <span>• {language === 'fr' ? 'Protocole : LoRaWAN EU868 OTAA classe A' : 'Protocol: LoRaWAN EU868 OTAA class A'}</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeployModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  {t.soilSensors.confirmDeploy}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

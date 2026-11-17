import React, { useState } from 'react';
import { Parcel, VRAZone, SensorProbe } from '../../types';
import { MOCK_VRA_ZONES } from '../../data/mockData';
import { AgriMap } from '../map/AgriMap';
import {
  Sparkles,
  Download,
  AlertTriangle,
  Send,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface VraDashboardViewProps {
  parcels: Parcel[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  sensors: SensorProbe[];
  onOpenExportModal: () => void;
  onShowToast: (msg: string) => void;
}

export const VraDashboardView: React.FC<VraDashboardViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  sensors,
  onOpenExportModal,
  onShowToast,
}) => {
  const { language, t } = useTranslation();
  const [baseFertilizerRate, setBaseFertilizerRate] = useState<number>(180); // kg/ha
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-2');
  const [selectedDate, setSelectedDate] = useState<string>('2024-05-18');

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Dynamic calculations based on base rate
  const totalStandardFertilizerKg = selectedParcel.areaHa * baseFertilizerRate;
  const optimizedFertilizerKg = Math.round(
    MOCK_VRA_ZONES.reduce(
      (acc, z) => acc + (z.areaHa / selectedParcel.areaHa) * selectedParcel.areaHa * (baseFertilizerRate * (1 + z.deltaPct / 100)),
      0
    )
  );
  const savedFertilizerKg = totalStandardFertilizerKg - optimizedFertilizerKg;
  const costPerKg = 0.68; // USD / kg urea
  const totalSavingsUsd = Math.max(0, Math.round(savedFertilizerKg * costPerKg));

  const handleApplyToTractor = () => {
    onShowToast(
      language === 'fr'
        ? `Prescription VRA transmise via ISOBUS Task Controller au tracteur sur ${selectedParcel.name}.`
        : `VRA Prescription uploaded via ISOBUS Task Controller to tractor on ${selectedParcel.name}.`
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#fcf9f3] p-3.5 sm:p-5 lg:p-6 gap-4 sm:gap-5 max-w-[1600px] mx-auto w-full">
      {/* Top Header Deck */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t.vraDashboard.badge}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              {selectedParcel.name} ({selectedParcel.areaHa} ha)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 sm:mt-1 font-heading">
            {t.vraDashboard.title}
          </h1>
          <p className="text-xs text-slate-500">
            {t.vraDashboard.subtitle}
          </p>
        </div>

        {/* Parcel selector & Date & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedParcelId}
            onChange={(e) => onSelectParcel(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full px-3 py-1.5 sm:py-2 shadow-sm focus:ring-1 focus:ring-emerald-500"
          >
            {parcels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.crop})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-700 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-0 outline-none text-xs font-semibold"
            />
          </div>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.vraDashboard.exportShp}</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Adaptive Grid (1 col on mobile, 12 cols on desktop/xl) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-5 flex-1 min-h-0">
        {/* Left Column: ROI Engine & Soil Metrics */}
        <div className="xl:col-span-4 2xl:col-span-3 flex flex-col gap-3 sm:gap-4">
          {/* ROI Engine Card */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t.vraDashboard.roiEngine}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {t.vraDashboard.aiActive}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase">{t.vraDashboard.estSavings}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading">
                  ${totalSavingsUsd.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600">{t.vraDashboard.intakeCut}</span>
              </div>
              <span className="text-[11px] text-slate-500">
                ~{(totalSavingsUsd * 4600).toLocaleString()} Ar • {savedFertilizerKg > 0 ? savedFertilizerKg.toLocaleString() : '14,800'} kg {language === 'fr' ? 'd’urée économisés' : 'urea saved'}
              </span>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 flex flex-col gap-0.5">
              <div className="flex items-center justify-between font-bold">
                <span>{t.vraDashboard.carbonCut}</span>
                <span className="text-emerald-700">-12.4 t CO2e</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-emerald-700">
                {t.vraDashboard.carbonCutSub}
              </span>
            </div>

            {/* Dose Slider */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{t.vraDashboard.baseDose}</span>
                <span className="font-bold text-emerald-700">{baseFertilizerRate} kg/ha</span>
              </div>
              <input
                type="range"
                min="120"
                max="260"
                value={baseFertilizerRate}
                onChange={(e) => setBaseFertilizerRate(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>120 kg/ha</span>
                <span>180 kg (Standard)</span>
                <span>260 kg/ha</span>
              </div>
            </div>
          </div>

          {/* Real-time soil metrics card */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-2.5">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.vraDashboard.nutrientDiag}
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400">{t.vraDashboard.availableN}</span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">12.5 mg/kg</p>
                <span className="text-[10px] text-orange-600 font-semibold">{t.common.needsAction}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400">{t.vraDashboard.phosphorus}</span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">8.5 mg/kg</p>
                <span className="text-[10px] text-emerald-600 font-semibold">{t.common.optimal}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400">{t.vraDashboard.potassium}</span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">5.2 mg/kg</p>
                <span className="text-[10px] text-emerald-600 font-semibold">{t.vraDashboard.wellSupplied}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400">{t.vraDashboard.soilPh}</span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">7.0 pH</p>
                <span className="text-[10px] text-slate-500 font-semibold">{t.vraDashboard.neutral}</span>
              </div>
            </div>
          </div>

          {/* Sandy Ridge / Tanety Callout */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="text-xs font-bold text-orange-900">
                {language === 'fr' ? 'Alerte Crête Tanety Lessivée (Zone 2)' : 'Leached Tanety Knoll Alert (Zone 2)'}
              </span>
            </div>
            <p className="text-[11px] text-orange-800 leading-relaxed">
              {language === 'fr'
                ? 'Sol ferrallitique sensible au ravinement : majoration de dose prescrite (+35% soit 245 kg/ha) avec apport fractionné pour limiter le lessivage lors des averses d’Asara.'
                : 'Ferrallitic soil prone to leaching: split nitrogen application prescribed (+35% or 245 kg/ha) to prevent nutrient runoff during heavy tropical rains.'}
            </p>
          </div>
        </div>

        {/* Center Column: Satellite Map Canvas with VRA Overlay */}
        <div className="xl:col-span-8 2xl:col-span-5 flex flex-col gap-3 sm:gap-4">
          <div className="relative w-full h-[380px] sm:h-[440px] xl:h-[500px] rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <AgriMap
              parcels={parcels}
              selectedParcelId={selectedParcelId}
              onSelectParcel={onSelectParcel}
              sensors={sensors}
              activeLayer="vra"
              className="w-full h-full"
            />

            {/* Overlay Banner */}
            <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{language === 'fr' ? 'Visualisation Grille Modulation VRA Active' : 'Active VRA Prescription Grid'}</span>
            </div>

            {/* Quick Action bar bottom */}
            <div className="absolute bottom-4 left-4 right-16 z-[400] p-2.5 sm:p-3 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-white/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{t.vraDashboard.isobusReady}</span>
              </div>
              <button
                onClick={handleApplyToTractor}
                className="px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.vraDashboard.injectConsole}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Prescription Breakdown Zones */}
        <div className="xl:col-span-12 2xl:col-span-4 flex flex-col gap-3 sm:gap-4">
          <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t.vraDashboard.zonesBreakdown}
              </h3>
              <span className="text-[11px] text-slate-400 font-semibold">Total : {selectedParcel.areaHa} ha</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-1 gap-2.5 sm:gap-3">
              {MOCK_VRA_ZONES.map((zone) => {
                const isSelected = selectedZoneId === zone.id;
                const dynamicRate = Math.round(baseFertilizerRate * (1 + zone.deltaPct / 100));

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`p-3 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: zone.color }}
                        ></span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{zone.name}</div>
                          <span className="text-[10px] text-slate-500">{zone.label}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-slate-900">{dynamicRate} kg/ha</span>
                        <span
                          className={`block text-[10px] font-bold ${
                            zone.deltaPct > 0 ? 'text-orange-600' : 'text-emerald-700'
                          }`}
                        >
                          {zone.deltaPct > 0 ? `+${zone.deltaPct}%` : `${zone.deltaPct}%`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                      <span>{t.common.surface} : <b>{zone.areaHa} ha</b> ({zone.pctArea}%)</span>
                      <span>NDVI : <b>{zone.ndviRange}</b></span>
                    </div>

                    {isSelected && (
                      <p className="mt-2 text-[10px] sm:text-[11px] text-slate-600 leading-tight bg-white p-2 rounded-lg border border-slate-100">
                        {zone.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 sm:pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={handleApplyToTractor}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.vraDashboard.applyToTractor}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

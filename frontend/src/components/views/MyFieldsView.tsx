import React, { useState } from 'react';
import { Parcel, SensorProbe, ViewType } from '../../types';
import { AgriMap } from '../map/AgriMap';
import {
  DollarSign,
  Leaf,
  AlertTriangle,
  Tractor,
  Search,
  ArrowRight,
  Send,
  Radio,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface MyFieldsViewProps {
  parcels: Parcel[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  onNavigate: (view: ViewType) => void;
  sensors: SensorProbe[];
  onOpenExportModal: () => void;
  onShowToast: (msg: string) => void;
}

export const MyFieldsView: React.FC<MyFieldsViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onNavigate,
  sensors,
  onOpenExportModal,
  onShowToast,
}) => {
  const { language, t } = useTranslation();
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'hydrology' | 'elevation'>('ndvi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');

  const filteredParcels = parcels.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variety.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCropFilter === 'all' || p.crop === selectedCropFilter;
    return matchesQuery && matchesCrop;
  });

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  const handleDroneDispatch = (parcelName: string) => {
    onShowToast(
      language === 'fr'
        ? `Mission lancée : Drone multispectral DJI Matrice 350 RTK envoyé vers ${parcelName}.`
        : `Mission dispatched: DJI Matrice 350 RTK drone sent to ${parcelName}.`
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#faf8ff] p-3.5 sm:p-5 lg:p-6 gap-4 sm:gap-5 max-w-[1600px] mx-auto w-full">
      {/* Top Header Deck */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t.myFields.badge}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">{t.myFields.surfaceUnderSurveillance}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 sm:mt-1 font-heading">
            {t.myFields.title}
          </h1>
          <p className="text-xs text-slate-500">
            {t.myFields.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('crop_tracing')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-emerald-700 hover:bg-emerald-600 text-xs font-bold text-white shadow-md transition-all"
          >
            <span>{t.myFields.drawBtn}</span>
          </button>
          <button
            onClick={onOpenExportModal}
            className="px-3.5 py-1.5 sm:py-2 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 shadow-sm transition-all"
          >
            {t.myFields.exportBtn}
          </button>
          <button
            onClick={() => onNavigate('vra_dashboard')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-700/20 transition-all"
          >
            <span>{t.myFields.openVra}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI 4 Cards Grid - Adaptive 1 -> 2 -> 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.myFields.estValuation}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">$1,842,500</span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">~8.47 Mds Ar</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span>↑</span> +12.4% {t.myFields.vsAverage}
            </span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.myFields.meanNdvi}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">0.76</span>
              <span className="text-[11px] text-slate-400">/ 1.0 NDVI</span>
            </div>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span>↑</span> +0.05 {t.myFields.aboveSector}
            </span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.myFields.soilPestHealth}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-orange-600 font-heading">{t.myFields.activeAlert}</span>
            <span className="text-xs text-orange-600 font-semibold flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Tanety 208 : Carence N
            </span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.myFields.telemetryMachinery}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">{t.myFields.deployedUnits}</span>
            <span className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t.myFields.tractorsDrone}
            </span>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Tractor className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Workspace Split: Map on Left, Field List on Right */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 flex-1 min-h-0">
        {/* Left Side: Map Centerpiece */}
        <div className="xl:w-7/12 flex flex-col gap-3 sm:gap-4">
          <div className="relative w-full h-[380px] sm:h-[440px] xl:h-[500px] rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <AgriMap
              parcels={parcels}
              selectedParcelId={selectedParcelId}
              onSelectParcel={onSelectParcel}
              sensors={sensors}
              activeLayer={activeLayer}
              className="w-full h-full"
            />

            {/* Floating Layer Switcher (Top Left) */}
            <div className="absolute top-4 left-4 z-[400] flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-md p-1 border border-white/60">
              <button
                onClick={() => setActiveLayer('ndvi')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeLayer === 'ndvi'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satellite + NDVI
              </button>
              <button
                onClick={() => setActiveLayer('hydrology')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeLayer === 'hydrology'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.common.hydrology}
              </button>
              <button
                onClick={() => setActiveLayer('elevation')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeLayer === 'elevation'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.common.elevation}
              </button>
            </div>

            {/* Floating NDVI Legend (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-[400] w-72 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800">{t.myFields.ndviScaleTitle}</span>
                <span className="text-xs font-bold text-emerald-700">0.81 (V. Élevé)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-lime-500 to-emerald-600"></div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                <span>{t.myFields.bareSoil}</span>
                <span>{t.myFields.stress}</span>
                <span>{t.myFields.nominal}</span>
                <span>{t.myFields.dense}</span>
              </div>
            </div>
          </div>

          {/* Sub-Cartography Action Ribbon */}
          <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">{t.myFields.sprayPreview}</span>
              </div>
              <span className="hidden sm:inline-block text-xs text-slate-500">
                {t.myFields.spraySub}
              </span>
            </div>
            <button
              onClick={() => onShowToast(language === 'fr' ? 'Flux télématique John Deere 8RX : Vitesse 14 km/h, rampe 36m, débit 150 L/ha.' : 'John Deere 8RX telemetry: Speed 14 km/h, boom 36m, rate 150 L/ha.')}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center gap-1"
            >
              <span>{t.myFields.telemetryStream}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Field Cards Portfolio & Details */}
        <div className="xl:w-5/12 flex flex-col gap-4">
          {/* Search & Filter Bar */}
          <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 flex-1">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t.common.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-xs text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-1">
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-slate-100 rounded-full px-3 py-1.5 border-0 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">{t.common.allCrops}</option>
                <option value="Riz Paddy">Riz Paddy (Vary)</option>
                <option value="Maïs">Maïs</option>
                <option value="Soja">Soja</option>
                <option value="Manioc">Manioc</option>
              </select>
            </div>
          </div>

          {/* Parcel Cards List */}
          <div className="flex flex-col gap-3 max-h-[540px] xl:max-h-[600px] overflow-y-auto pr-1">
            {filteredParcels.map((parcel) => {
              const isSelected = parcel.id === selectedParcelId;
              const isAlert = parcel.status === 'Needs Action';

              return (
                <div
                  key={parcel.id}
                  onClick={() => onSelectParcel(parcel.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl bg-white transition-all cursor-pointer relative overflow-hidden border ${
                    isSelected
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  {/* Left colored border strip */}
                  <div
                    className={`absolute top-0 left-0 bottom-0 w-2 ${
                      isAlert ? 'bg-orange-500' : isSelected ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  ></div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 font-heading">
                            {parcel.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isAlert
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {parcel.status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {parcel.crop} • {parcel.variety} • {t.myFields.sownLabel} {parcel.sownDate}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 font-heading">
                          {parcel.areaHa} ha
                        </span>
                        <span className="block text-[10px] text-slate-400 font-semibold">{parcel.section}</span>
                      </div>
                    </div>

                    {/* Alert Banner if present */}
                    {parcel.healthAlert && (
                      <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-start gap-2.5 text-orange-800">
                        <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{parcel.healthAlert}</span>
                          <span className="text-[11px] text-orange-700 mt-0.5">{parcel.healthAlertDetail}</span>
                        </div>
                      </div>
                    )}

                    {/* Mini Telemetry Strip */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-medium">{t.myFields.ndviIndex}</span>
                        <span
                          className={`font-bold ${
                            parcel.ndvi > 0.75 ? 'text-emerald-700' : 'text-orange-600'
                          }`}
                        >
                          {parcel.ndvi} ({parcel.ndvi > 0.75 ? t.common.optimal : t.common.needsAction})
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-medium">{t.myFields.soilMoisture}</span>
                        <span className="font-bold text-slate-800">{parcel.moisturePct}% vol.</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-medium">{t.myFields.estYield}</span>
                        <span className="font-bold text-slate-800">{parcel.estYieldTha} t/ha</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                        <span className="text-emerald-600">⚡</span>
                        <span>{parcel.urgentAction}</span>
                      </div>

                      {isAlert ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDroneDispatch(parcel.name);
                          }}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm transition-all"
                        >
                          <span>{t.myFields.dispatchDrone}</span>
                          <Send className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectParcel(parcel.id);
                            onNavigate('vra_dashboard');
                          }}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
                        >
                          <span>{t.myFields.openVraBtn}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

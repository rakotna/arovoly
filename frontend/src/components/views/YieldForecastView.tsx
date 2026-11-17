import React, { useState } from 'react';
import { Parcel } from '../../types';
import { MOCK_PHENOLOGICAL_STAGES, MOCK_WEATHER_SCENARIOS } from '../../data/mockData';
import {
  CloudSun,
  Download,
  Flame,
  CloudRain,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface YieldForecastViewProps {
  parcels: Parcel[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  onOpenExportModal: () => void;
  onShowToast: (msg: string) => void;
}

export const YieldForecastView: React.FC<YieldForecastViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onOpenExportModal,
  onShowToast,
}) => {
  const { language, t } = useTranslation();
  const [activeScenarioId, setActiveScenarioId] = useState<string>('baseline');
  const scenario = MOCK_WEATHER_SCENARIOS[activeScenarioId] || MOCK_WEATHER_SCENARIOS.baseline;

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Adjust yield according to weather scenario
  const adjustedYieldTha = (selectedParcel.estYieldTha * (1 + scenario.yieldImpactPct / 100)).toFixed(1);
  const totalProductionTonnes = Math.round(selectedParcel.areaHa * Number(adjustedYieldTha));
  const futuresPricePerTonne = 245; // USD/t
  const totalValuationUsd = totalProductionTonnes * futuresPricePerTonne;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#fcf9f3] p-3.5 sm:p-5 lg:p-6 gap-4 sm:gap-5 max-w-[1600px] mx-auto w-full">
      {/* Top Analytical Header Deck */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t.yieldForecast.badge}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              {t.yieldForecast.seasonLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] sm:text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              {t.yieldForecast.confidence}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 sm:mt-1 font-heading">
            {t.yieldForecast.title}
          </h1>
          <p className="text-xs text-slate-500">
            {t.yieldForecast.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.yieldForecast.pdfReport}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Banner Strip - Adaptive 1 -> 2 -> 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Mean Yield */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.yieldForecast.meanEstYield}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {adjustedYieldTha} t/ha
            </span>
            <span
              className={`text-xs font-bold ${
                scenario.yieldImpactPct >= 0 ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {scenario.yieldImpactPct >= 0 ? `+${scenario.yieldImpactPct}%` : `${scenario.yieldImpactPct}%`} vs base
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5">
            {t.yieldForecast.initialTarget} {selectedParcel.targetYieldTha} t/ha • {selectedParcel.variety}
          </span>
        </div>

        {/* Metric 2: Total Production */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.yieldForecast.totalProduction}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {totalProductionTonnes.toLocaleString()} t
            </span>
            <span className="text-xs font-bold text-emerald-600">Sur {selectedParcel.areaHa} ha</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5">
            Capacité de stockage silo validée
          </span>
        </div>

        {/* Metric 3: Economic Valuation */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.yieldForecast.economicValuation}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading">
              ${totalValuationUsd.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-slate-500">~{((totalValuationUsd * 4600) / 1000000000).toFixed(2)} Mds Ar</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5">
            Cours de gros région Alaotra • ~4 600 Ar / USD
          </span>
        </div>

        {/* Metric 4: Risk Index */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.yieldForecast.climateRisk}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading">14% ({language === 'fr' ? 'Faible' : 'Low'})</span>
            <span className="text-xs font-bold text-emerald-600">Sécurité hydrique</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5">
            Risque de verse : faible • ETP compensée
          </span>
        </div>
      </div>

      {/* Middle Grid: Yield Trajectory Chart & Scenario Engine */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-5">
        {/* Left: Phenological Yield Curve */}
        <div className="xl:col-span-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                {t.yieldForecast.phenologicalCurveTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.yieldForecast.phenologicalCurveSub}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {language === 'fr' ? 'Année 2024 (IA)' : 'Year 2024 (AI)'}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 font-medium ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> {language === 'fr' ? 'Médiane 5 ans' : '5-yr Median'}
              </span>
            </div>
          </div>

          {/* Visual Custom Chart Bars/Curves */}
          <div className="grid grid-cols-6 gap-2 pt-4 pb-2 border-b border-slate-100">
            {MOCK_PHENOLOGICAL_STAGES.map((item, idx) => {
              const maxVal = 13.0;
              const heightPct = (item.projectedYield / maxVal) * 100;
              const benchmarkPct = (item.benchmarkYield / maxVal) * 100;
              const isCurrent = idx === 4;

              return (
                <div key={item.stage} className="flex flex-col items-center gap-1.5">
                  <div className="h-36 sm:h-40 w-full flex items-end justify-center gap-1 sm:gap-1.5 px-1 sm:px-2">
                    {/* Benchmark bar */}
                    <div
                      className="w-2.5 sm:w-3 bg-slate-200 rounded-t-lg transition-all"
                      style={{ height: `${benchmarkPct}%` }}
                      title={`Benchmark : ${item.benchmarkYield} t/ha`}
                    ></div>
                    {/* Current Projected bar */}
                    <div
                      className={`w-3.5 sm:w-5 rounded-t-lg transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 ring-2 ring-emerald-500/30'
                          : 'bg-emerald-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`Forecast : ${item.projectedYield} t/ha`}
                    ></div>
                  </div>

                  <div className="text-center">
                    <span
                      className={`block text-[10px] sm:text-[11px] font-bold ${
                        isCurrent ? 'text-emerald-700 font-extrabold' : 'text-slate-700'
                      }`}
                    >
                      {item.stage}
                    </span>
                    <span className="block text-[9px] sm:text-[10px] text-slate-400">{item.gddAccumulated} GDD</span>
                    <span className="block text-[10px] sm:text-[11px] font-extrabold text-slate-900 mt-0.5">
                      {item.projectedYield} t/ha
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1 sm:gap-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Stade Actuel : <b>Floraison / Épiaison</b> — Remplissage +12% au-dessus de la normale.
            </span>
            <span className="text-emerald-700 font-bold">Maturation en Avril</span>
          </div>
        </div>

        {/* Right: Weather Scenario Engine */}
        <div className="xl:col-span-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3.5">
          <div>
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t.yieldForecast.weatherSimulatorTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.yieldForecast.weatherSimulatorSub}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {[
              {
                id: 'baseline',
                label: language === 'fr' ? 'Saison des Pluies Régulière (Asara)' : 'Normal Rainy Season (Asara)',
                icon: CloudSun,
                desc: language === 'fr' ? 'Mousson d’été bien établie sur les Hautes Terres (650 mm).' : 'Summer monsoon established over Highlands (650 mm).',
                delta: '±0.0 t/ha',
                color: 'text-slate-800',
              },
              {
                id: 'dry',
                label: language === 'fr' ? 'Retard de Mousson / Pause Pluie' : 'Monsoon Delay / Drought Pause',
                icon: Flame,
                desc: language === 'fr' ? 'Stress hydrique temporaire sur rizières pluviales et tanety.' : 'Temporary moisture stress on rainfed paddies and tanety hills.',
                delta: '-8.5% (-0.6 t/ha)',
                color: 'text-orange-600',
              },
              {
                id: 'favorable',
                label: language === 'fr' ? 'Hydrologie Optimale & Ensoleillement' : 'Optimal Hydrology & Sunshine',
                icon: CloudRain,
                desc: language === 'fr' ? 'Remplissage maximal des canaux d’irrigation et fort rayonnement.' : 'Full irrigation canals and abundant solar radiation.',
                delta: '+6.2% (+0.4 t/ha)',
                color: 'text-emerald-700',
              },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = activeScenarioId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScenarioId(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    </div>
                    <span className={`text-xs font-extrabold ${item.color}`}>{item.delta}</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">{item.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex flex-col gap-1">
            <span className="font-bold text-slate-800">{language === 'fr' ? 'Impact Économique Net :' : 'Net Economic Impact:'}</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{language === 'fr' ? 'Variation valeur récolte :' : 'Harvest valuation shift:'}</span>
              <span
                className={`font-bold ${
                  scenario.valuationChangeUsd >= 0 ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {scenario.valuationChangeUsd >= 0
                  ? `+$${scenario.valuationChangeUsd.toLocaleString()}`
                  : `-$${Math.abs(scenario.valuationChangeUsd).toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Field-by-Field Harvest Readiness Matrix */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
              {t.yieldForecast.readinessMatrixTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.yieldForecast.readinessMatrixSub}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{parcels.length} {t.cropTracing.parcelsBtn}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-3 px-3">{t.common.crop}</th>
                <th className="py-3 px-3">{t.common.surface}</th>
                <th className="py-3 px-3">{t.yieldForecast.phenoMaturity}</th>
                <th className="py-3 px-3">{t.yieldForecast.grainMoisture}</th>
                <th className="py-3 px-3">{t.yieldForecast.targetVsEst}</th>
                <th className="py-3 px-3">{t.yieldForecast.harvestWindow}</th>
                <th className="py-3 px-3 text-right">{t.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parcels.map((parcel) => (
                <tr
                  key={parcel.id}
                  onClick={() => onSelectParcel(parcel.id)}
                  className={`cursor-pointer transition-colors ${
                    parcel.id === selectedParcel.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <div>
                      <span>{parcel.name}</span>
                      <span className="block text-[10px] text-slate-400">{parcel.crop} • {parcel.variety}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-semibold">{parcel.areaHa} ha</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{
                            width:
                              parcel.id.includes('itasy')
                                ? '95%'
                                : parcel.id.includes('vakinankaratra')
                                ? '82%'
                                : '74%',
                          }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-800">
                        {parcel.id.includes('itasy') ? '95%' : parcel.id.includes('vakinankaratra') ? '82%' : '74%'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-semibold">
                    {parcel.id.includes('itasy') ? '9.5% (Sec)' : parcel.id.includes('vakinankaratra') ? '14.2%' : '24.5%'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {parcel.targetYieldTha} t/ha → <span className="text-emerald-700">{parcel.estYieldTha} t/ha</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {parcel.id.includes('itasy')
                      ? '15 - 20 Mars'
                      : parcel.id.includes('vakinankaratra')
                      ? '25 Mars - 05 Avril'
                      : '15 - 28 Avril'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        parcel.status === 'Needs Action'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {parcel.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

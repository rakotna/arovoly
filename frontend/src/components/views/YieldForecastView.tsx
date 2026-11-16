import React, { useState } from 'react';
import { Parcel, PhenologicalStage, WeatherScenario } from '../../types';
import { MOCK_PHENOLOGICAL_STAGES, MOCK_WEATHER_SCENARIOS } from '../../data/mockData';
import {
  TrendingUp,
  DollarSign,
  CloudSun,
  ShieldAlert,
  Download,
  Calendar,
  Sparkles,
  BarChart3,
  Sun,
  CloudRain,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';

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
  const [activeScenarioId, setActiveScenarioId] = useState<string>('baseline');
  const scenario = MOCK_WEATHER_SCENARIOS[activeScenarioId] || MOCK_WEATHER_SCENARIOS.baseline;

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Adjust yield according to weather scenario
  const adjustedYieldTha = (selectedParcel.estYieldTha * (1 + scenario.yieldImpactPct / 100)).toFixed(1);
  const totalProductionTonnes = Math.round(selectedParcel.areaHa * Number(adjustedYieldTha));
  const futuresPricePerTonne = 245; // USD/t
  const totalValuationUsd = totalProductionTonnes * futuresPricePerTonne;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#faf8ff] p-4 sm:p-6 lg:p-8 gap-6">
      {/* Top Analytical Header Deck */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Modélisation Prédictive IA & Météo GFS
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Saison 2024 • Remplissage & Maturation
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Confiance Modèle : 94.2%
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 font-heading">
            Yield Forecast & Harvest Production Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Projections de tonnage, valorisation économique des récoltes et simulations d'aléas climatiques.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedParcelId}
            onChange={(e) => onSelectParcel(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full px-3.5 py-2 shadow-sm focus:ring-1 focus:ring-emerald-500"
          >
            {parcels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.crop})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white shadow-md transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Rapport Récolte (PDF)</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Banner Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Mean Yield */}
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Rendement Estimé Moyen
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-heading">
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
          <span className="text-xs text-slate-500 mt-1">
            Cible initiale : {selectedParcel.targetYieldTha} t/ha • Hybride {selectedParcel.variety}
          </span>
        </div>

        {/* Metric 2: Total Production */}
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Production Totale Estimée
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-heading">
              {totalProductionTonnes.toLocaleString()} t
            </span>
            <span className="text-xs font-bold text-emerald-600">Sur {selectedParcel.areaHa} ha</span>
          </div>
          <span className="text-xs text-slate-500 mt-1">
            Capacité de stockage silo validée à 100%
          </span>
        </div>

        {/* Metric 3: Economic Valuation */}
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Valorisation Économique Récolte
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-heading">
              ${totalValuationUsd.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">@ 245$/t</span>
          </div>
          <span className="text-xs text-slate-500 mt-1">
            Cours Euronext / MATIF à terme Novembre 2024
          </span>
        </div>

        {/* Metric 4: Risk Index */}
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Indice de Risque Climatique
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-heading">14% (Faible)</span>
            <span className="text-xs font-bold text-emerald-600">Sécurité hydrique</span>
          </div>
          <span className="text-xs text-slate-500 mt-1">
            Risque de verse : faible • ETP compensée
          </span>
        </div>
      </div>

      {/* Middle Grid: Yield Trajectory Chart & Scenario Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Phenological Yield Curve (lg:col-span-8) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Trajectoire d'Accumulation du Rendement vs Stades Phénologiques
              </h3>
              <p className="text-xs text-slate-500">
                Suivi des degrés-jours de croissance (GDD) cumulés et corrélation biomasse NDVI Sentinel-2.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Année 2024 (IA)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 font-medium ml-2">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span> Médiane 5 ans
              </span>
            </div>
          </div>

          {/* Visual Custom Chart Bars/Curves */}
          <div className="grid grid-cols-6 gap-2 pt-6 pb-2 border-b border-slate-100">
            {MOCK_PHENOLOGICAL_STAGES.map((item, idx) => {
              const maxVal = 13.0;
              const heightPct = (item.projectedYield / maxVal) * 100;
              const benchmarkPct = (item.benchmarkYield / maxVal) * 100;
              const isCurrent = idx === 4; // R2 stage

              return (
                <div key={item.stage} className="flex flex-col items-center gap-2">
                  <div className="h-44 w-full flex items-end justify-center gap-1.5 px-2">
                    {/* Benchmark bar */}
                    <div
                      className="w-3 bg-slate-200 rounded-t-lg transition-all"
                      style={{ height: `${benchmarkPct}%` }}
                      title={`Médiane 5 ans : ${item.benchmarkYield} t/ha`}
                    ></div>
                    {/* Current Projected bar */}
                    <div
                      className={`w-5 rounded-t-lg transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 ring-2 ring-emerald-500/30'
                          : 'bg-emerald-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`Prévision : ${item.projectedYield} t/ha`}
                    ></div>
                  </div>

                  <div className="text-center">
                    <span
                      className={`block text-[11px] font-bold ${
                        isCurrent ? 'text-emerald-700 font-extrabold' : 'text-slate-700'
                      }`}
                    >
                      {item.stage}
                    </span>
                    <span className="block text-[10px] text-slate-400">{item.gddAccumulated} GDD</span>
                    <span className="block text-[11px] font-extrabold text-slate-900 mt-0.5">
                      {item.projectedYield} t/ha
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Stade Actuel : <b>R2 (Blister/Grain laiteux)</b> — Vitesse de remplissage +12% au-dessus de la normale.
            </span>
            <span className="text-emerald-700 font-bold">Maturation physiologique prévue le 15 Septembre</span>
          </div>
        </div>

        {/* Right: Weather Scenario Engine (lg:col-span-4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Simulateur Météo Pré-Récolte
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Testez l'impact des aléas climatiques sur les 30 prochains jours avant battage.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              {
                id: 'baseline',
                label: 'Scénario Médian GFS (Normal)',
                icon: CloudSun,
                desc: 'Températures conformes, pluviométrie moyenne (35mm).',
                delta: '±0.0 t/ha',
                color: 'text-slate-800',
              },
              {
                id: 'dry',
                label: 'Sécheresse & Chaleur (+3°C)',
                icon: Flame,
                desc: 'Échaudage partiel du grain sur sols filtrants.',
                delta: '-7.5% (-0.9 t/ha)',
                color: 'text-orange-600',
              },
              {
                id: 'favorable',
                label: 'Climat Idéal & Averses',
                icon: CloudRain,
                desc: 'Remplissage maximal sans stress thermique.',
                delta: '+5.8% (+0.7 t/ha)',
                color: 'text-emerald-700',
              },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = activeScenarioId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScenarioId(item.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    </div>
                    <span className={`text-xs font-extrabold ${item.color}`}>{item.delta}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex flex-col gap-1">
            <span className="font-bold text-slate-800">Impact Économique Net :</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Variation de valeur récolte :</span>
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
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Matrice de Préparation & Maturité Parcelle par Parcelle
            </h3>
            <p className="text-xs text-slate-500">
              Calendrier prévisionnel d'entrée des moissonneuses-batteuses et humidité du grain estimée.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">4 Parcelles Analysées</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-3 px-3">Parcelle & Culture</th>
                <th className="py-3 px-3">Surface</th>
                <th className="py-3 px-3">Maturité Phénologique</th>
                <th className="py-3 px-3">Humidité Grain</th>
                <th className="py-3 px-3">Rdt Cible vs Prévu</th>
                <th className="py-3 px-3">Fenêtre Récolte Estimée</th>
                <th className="py-3 px-3 text-right">Statut</th>
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
                              parcel.id === '305-sunny'
                                ? '95%'
                                : parcel.id === '208-highland'
                                ? '82%'
                                : '74%',
                          }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-800">
                        {parcel.id === '305-sunny' ? '95%' : parcel.id === '208-highland' ? '82%' : '74%'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-semibold">
                    {parcel.id === '305-sunny' ? '9.5% (Sec)' : parcel.id === '208-highland' ? '14.2%' : '24.5%'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {parcel.targetYieldTha} t/ha → <span className="text-emerald-700">{parcel.estYieldTha} t/ha</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {parcel.id === '305-sunny'
                      ? '25 - 30 Juillet'
                      : parcel.id === '208-highland'
                      ? '10 - 15 Août'
                      : '20 - 28 Septembre'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        parcel.id === '208-highland'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {parcel.id === '208-highland' ? 'Action Requise' : 'Nominal'}
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

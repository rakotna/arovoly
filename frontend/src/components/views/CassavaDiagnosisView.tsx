import React, { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock3, Leaf, RefreshCw, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { api, CassavaPrediction } from '../../services/api';

const CLASS_LABELS: Record<string, { en: string; fr: string }> = {
  cbb: { en: 'Cassava bacterial blight', fr: 'Bactériose du manioc' },
  cbsd: { en: 'Cassava brown streak disease', fr: 'Maladie des stries brunes' },
  cgm: { en: 'Cassava green mite damage', fr: 'Dégâts d’acariens verts' },
  cmd: { en: 'Cassava mosaic disease', fr: 'Mosaïque du manioc' },
  healthy: { en: 'Healthy', fr: 'Sain' },
};

export const CassavaDiagnosisView: React.FC = () => {
  const { language } = useTranslation();
  const [prediction, setPrediction] = useState<CassavaPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFrench = language === 'fr';

  const loadPrediction = useCallback(async () => {
    try {
      setError(null);
      const latest = await api.getLatestCassavaPrediction();
      setPrediction(latest);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load the latest diagnosis.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPrediction();
    const intervalId = window.setInterval(() => void loadPrediction(), 30000);
    return () => window.clearInterval(intervalId);
  }, [loadPrediction]);

  const confidencePercent = prediction ? Math.round(prediction.confidence * 100) : 0;
  const isHealthy = prediction?.predicted_class === 'healthy';
  const recommendedActions = prediction
    ? (isFrench ? prediction.recommended_actions_fr : prediction.recommended_actions) ?? prediction.recommended_actions
    : [];

  return (
    <div className="flex-1 overflow-y-auto bg-[#fcf9f3] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#d6e8cd] bg-[#edf6e8] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#316b00]">
              <Activity className="h-3.5 w-3.5" />
              {isFrench ? 'Analyse IA • Capteurs' : 'AI analysis • Sensors'}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1c1c18] sm:text-3xl">
              {isFrench ? 'Diagnostic du manioc' : 'Cassava health diagnosis'}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[#717a68]">
              {isFrench
                ? 'Résultats de classification des images reçues automatiquement depuis vos capteurs de terrain.'
                : 'Classification results from crop images received automatically from your field sensors.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              void loadPrediction();
            }}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#e5e2dc] bg-white px-4 py-2.5 text-xs font-bold text-[#414939] shadow-sm transition hover:border-[#c3ecd2] hover:text-[#316b00] disabled:cursor-wait disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isFrench ? 'Actualiser' : 'Refresh'}
          </button>
        </header>

        <section className="rounded-2xl border border-[#e5e2dc] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf6e8] text-[#316b00]">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-[#1c1c18]">
                {isFrench ? 'Flux d’images capteur' : 'Sensor image feed'}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#717a68]">
                {isFrench
                  ? 'Aucune sélection ni aucun téléversement manuel. Les capteurs envoient les images directement au service d’inférence.'
                  : 'No manual selection or file upload. Sensors send images directly to the inference service.'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-[#52634a]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#76c043]" />
                  {isFrench ? 'En attente des capteurs' : 'Listening for sensor results'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {isFrench ? 'Actualisation automatique : 30 s' : 'Auto-refresh: 30 sec'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {isFrench ? 'Impossible de charger le diagnostic :' : 'Could not load the diagnosis:'} {error}
          </div>
        )}

        {isLoading && !prediction ? (
          <section className="rounded-2xl border border-[#e5e2dc] bg-white p-8 text-center text-sm text-[#717a68] shadow-sm">
            {isFrench ? 'Chargement des derniers résultats…' : 'Loading the latest results…'}
          </section>
        ) : !prediction ? (
          <section className="rounded-2xl border border-dashed border-[#d7d4cb] bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0eee8] text-[#717a68]">
              <Activity className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-bold text-[#1c1c18]">
              {isFrench ? 'Aucun résultat pour le moment' : 'No diagnosis results yet'}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-[#717a68]">
              {isFrench
                ? 'Lorsqu’un capteur enverra une image de feuille de manioc, le résultat et les recommandations apparaîtront ici.'
                : 'When a sensor sends a cassava leaf image, its classification and recommendations will appear here.'}
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
              <div className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${isHealthy ? 'border-[#cfe6c3] bg-[#f4faef]' : 'border-[#f2d8b8] bg-[#fff9f0]'}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#717a68]">
                      {isFrench ? 'Dernière classification' : 'Latest classification'}
                    </span>
                    <h2 className="mt-1 text-xl font-extrabold text-[#1c1c18]">
                      {CLASS_LABELS[prediction.predicted_class]?.[isFrench ? 'fr' : 'en'] ?? prediction.class_name}
                    </h2>
                    <p className="mt-1 text-xs text-[#717a68]">
                      {isFrench ? 'Capteur' : 'Sensor'}: {prediction.sensor_id}
                      <span className="mx-2">•</span>
                      {new Date(prediction.created_at).toLocaleString(isFrench ? 'fr-FR' : 'en-US')}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${isHealthy ? 'bg-[#dff0d6] text-[#316b00]' : 'bg-[#fff0d9] text-[#995100]'}`}>
                    {isHealthy ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                    {isHealthy ? (isFrench ? 'Sain' : 'Healthy') : (isFrench ? 'À vérifier' : 'Needs review')}
                  </span>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/80 bg-white/80 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#717a68]">
                      {isFrench ? 'Confiance du modèle' : 'Model confidence'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <strong className="text-3xl font-extrabold text-[#316b00]">{confidencePercent}%</strong>
                      <span className="text-xs text-[#717a68]">{isFrench ? 'probabilité' : 'probability'}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8e7df]">
                      <div className="h-full rounded-full bg-[#76c043]" style={{ width: `${confidencePercent}%` }} />
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/80 bg-white/80 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#717a68]">
                      {isFrench ? 'Niveau de risque' : 'Risk level'}
                    </span>
                    <div className="mt-2 flex items-center gap-2 text-lg font-bold capitalize text-[#1c1c18]">
                      <ShieldCheck className="h-5 w-5 text-[#316b00]" />
                      {isFrench
                        ? ({ low: 'Faible', moderate: 'Modéré', high: 'Élevé' }[prediction.risk_level])
                        : prediction.risk_level}
                    </div>
                    <p className="mt-1 text-[11px] text-[#717a68]">
                      {prediction.requires_human_review
                        ? (isFrench ? 'Confirmation par un agronome recommandée' : 'Agronomist confirmation recommended')
                        : (isFrench ? 'Surveillance de routine' : 'Routine monitoring')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e5e2dc] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-bold text-[#1c1c18]">
                  {isFrench ? 'Probabilités par classe' : 'Class probabilities'}
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  {Object.entries(prediction.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([className, probability]) => (
                      <div key={className}>
                        <div className="mb-1 flex justify-between gap-3 text-[11px]">
                          <span className="font-semibold text-[#414939]">
                            {CLASS_LABELS[className]?.[isFrench ? 'fr' : 'en'] ?? className}
                          </span>
                          <span className="shrink-0 font-bold text-[#316b00]">{Math.round(probability * 100)}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#f0eee8]">
                          <div className="h-full rounded-full bg-[#76c043]" style={{ width: `${Math.min(100, Math.max(0, probability * 100))}%` }} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e2dc] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf6e8] text-[#316b00]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h2 className="font-bold text-[#1c1c18]">
                  {isFrench ? 'Actions recommandées' : 'Recommended actions'}
                </h2>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {recommendedActions.map((action) => (
                  <li key={action} className="flex gap-2 rounded-xl bg-[#f7f6f1] p-3 text-xs leading-relaxed text-[#414939]">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#76c043]" />
                    {action}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-[#f0eee8] pt-3 text-[10px] leading-relaxed text-[#717a68]">
                {isFrench
                  ? 'La classification est une aide à la décision, pas un diagnostic définitif. Confirmez les résultats incertains sur le terrain.'
                  : 'This classification supports decisions; it is not a definitive diagnosis. Confirm uncertain results in the field.'}
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

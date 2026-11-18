import React, { useState } from 'react';
import { ArrowLeft, CloudSun, Leaf, LogIn, Satellite, Sparkles, Waves } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { MOCK_PARCELS, MOCK_SENSORS } from '../../data/mockData';
import { BrandLogo } from '../common/BrandLogo';
import { AgriMap } from '../map/AgriMap';

interface DemoViewProps {
  onGoToLanding: () => void;
  onGoToSignIn: () => void;
}

export const DemoView: React.FC<DemoViewProps> = ({
  onGoToLanding,
  onGoToSignIn,
}) => {
  const { language, toggleLanguage } = useTranslation();
  const [selectedParcelId, setSelectedParcelId] = useState(MOCK_PARCELS[0]?.id || '');
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'hydrology' | 'elevation'>('ndvi');
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#fcf9f3] text-[#1c1c18]">
      <header className="absolute inset-x-3 top-3 z-[500] flex h-14 items-center justify-between rounded-2xl border border-white/60 bg-[#fcf9f3]/90 px-3 shadow-xl backdrop-blur-xl sm:inset-x-6 sm:top-5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo compact onClick={onGoToLanding} />
          <span className="hidden items-center gap-1.5 rounded-full bg-[#c3ecd2] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#316b00] sm:flex">
            <Sparkles className="h-3.5 w-3.5" />
            {language === 'fr' ? 'Mode Démo' : 'Demo Mode'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-[#717a68] md:inline">
            {language === 'fr' ? 'Données fictives • aucune connexion requise' : 'Mock data • no sign-in required'}
          </span>
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-[#e5e2dc] bg-white px-3 py-2 text-xs font-bold uppercase shadow-sm"
          >
            {language}
          </button>
          <button
            type="button"
            onClick={onGoToSignIn}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1b4332] px-3 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#143225]"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{language === 'fr' ? 'Se connecter' : 'Sign in'}</span>
          </button>
          <button
            type="button"
            onClick={onGoToLanding}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e2dc] bg-white text-[#52634a] shadow-sm transition hover:text-[#316b00]"
            aria-label={language === 'fr' ? 'Retour à l’accueil' : 'Back to home'}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="absolute inset-0 overflow-hidden">
        <AgriMap
          parcels={MOCK_PARCELS}
          selectedParcelId={selectedParcelId}
          onSelectParcel={setSelectedParcelId}
          sensors={MOCK_SENSORS}
          activeLayer={activeLayer}
          controlsClassName="bottom-24 right-3 sm:bottom-28 sm:right-6"
          className="h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#031309]/35 via-transparent to-[#031309]/55" />

        <div className="absolute left-3 top-24 z-[400] max-w-[172px] sm:left-6 sm:top-28 sm:max-w-[calc(100%-3rem)]">
          <div className="pointer-events-auto rounded-2xl border border-white/50 bg-[#fcf9f3]/90 p-2.5 shadow-2xl backdrop-blur-xl sm:p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#c3ecd2] text-[#316b00]">
                <Satellite className="h-4 w-4" />
              </span>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#316b00]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#20bb55]" />
                  {language === 'fr' ? 'Démo en direct' : 'Live demo'}
                </div>
                <h1 className="text-sm font-extrabold text-[#1c1c18] sm:text-base">
                  {language === 'fr' ? 'Intelligence des terroirs' : 'Field intelligence'}
                </h1>
              </div>
            </div>
            <p className="mt-2 hidden max-w-xs text-[11px] leading-relaxed text-[#414939] sm:block">
              {language === 'fr'
                ? 'Explorez une console AgTech conçue pour décider plus vite, du satellite à la racine.'
                : 'Explore an AgTech console built to turn satellite and root-zone signals into action.'}
            </p>
          </div>
        </div>

        <div className="absolute right-4 top-24 z-[400] flex max-w-[calc(100%-2rem)] flex-col items-end gap-2 sm:right-6 sm:top-28">
          <div className="pointer-events-auto flex items-center rounded-full border border-white/50 bg-[#fcf9f3]/90 p-1 shadow-xl backdrop-blur-xl">
            {([
              ['ndvi', 'NDVI'],
              ['hydrology', language === 'fr' ? 'Eau' : 'Water'],
              ['elevation', language === 'fr' ? 'Relief' : 'Terrain'],
            ] as const).map(([layer, label]) => (
              <button
                key={layer}
                type="button"
                onClick={() => setActiveLayer(layer)}
                className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold transition sm:px-3 ${
                  activeLayer === layer ? 'bg-[#316b00] text-white shadow-sm' : 'text-[#52634a] hover:bg-[#f0eee8]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="pointer-events-auto hidden items-center gap-1.5 rounded-full border border-white/50 bg-[#0c1f15]/85 px-3 py-2 text-[10px] font-bold text-[#a9f773] shadow-xl backdrop-blur-xl sm:flex">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#8eda5a]" />
            {language === 'fr' ? 'Télémétrie active' : 'Telemetry online'}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-[400] grid grid-cols-3 divide-x divide-[#e5e2dc] rounded-2xl border border-white/60 bg-[#fcf9f3]/95 px-1 py-2 shadow-2xl backdrop-blur-xl sm:hidden">
          <div className="px-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wide text-[#717a68]">
              <Leaf className="h-3 w-3 text-[#316b00]" />
              NDVI
            </div>
            <strong className="mt-0.5 block text-base leading-tight text-[#1c1c18]">0.81</strong>
          </div>
          <div className="px-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wide text-[#717a68]">
              <Waves className="h-3 w-3 text-[#2563eb]" />
              {language === 'fr' ? 'Eau' : 'Water'}
            </div>
            <strong className="mt-0.5 block text-base leading-tight text-[#1c1c18]">42.8%</strong>
          </div>
          <div className="px-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wide text-[#717a68]">
              <CloudSun className="h-3 w-3 text-[#d97706]" />
              {language === 'fr' ? 'Terrain' : 'Field'}
            </div>
            <strong className="mt-0.5 block text-base leading-tight text-[#1c1c18]">24°C</strong>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-[400] hidden grid-cols-3 gap-3 sm:grid">
          <div className="agri-card-entry rounded-2xl border border-white/50 bg-[#fcf9f3]/90 p-3 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#717a68]">
              <span className="flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-[#316b00]" /> NDVI régional</span>
              <span className="text-[#316b00]">+4.2%</span>
            </div>
            <div className="mt-1 flex items-end justify-between">
              <strong className="text-2xl text-[#1c1c18]">0.81</strong>
              <span className="text-[10px] font-semibold text-[#316b00]">{language === 'fr' ? 'Vigueur optimale' : 'Optimal vigor'}</span>
            </div>
          </div>
          <div className="agri-card-entry rounded-2xl border border-white/50 bg-[#fcf9f3]/90 p-3 shadow-2xl backdrop-blur-xl transition-transform delay-75 duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#717a68]">
              <span className="flex items-center gap-1.5"><Waves className="h-3.5 w-3.5 text-[#2563eb]" /> {language === 'fr' ? 'Sondes racinaires' : 'Root probes'}</span>
              <span className="text-[#316b00]">5/5</span>
            </div>
            <div className="mt-1 flex items-end justify-between">
              <strong className="text-2xl text-[#1c1c18]">42.8%</strong>
              <span className="text-[10px] font-semibold text-[#316b00]">{language === 'fr' ? 'Humidité idéale' : 'Ideal moisture'}</span>
            </div>
          </div>
          <div className="agri-card-entry rounded-2xl border border-white/50 bg-[#fcf9f3]/90 p-3 shadow-2xl backdrop-blur-xl transition-transform delay-150 duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#717a68]">
              <span className="flex items-center gap-1.5"><CloudSun className="h-3.5 w-3.5 text-[#d97706]" /> {language === 'fr' ? 'Contexte terrain' : 'Field context'}</span>
              <span className="text-[#316b00]">24°C</span>
            </div>
            <div className="mt-1 flex items-end justify-between">
              <strong className="text-2xl text-[#1c1c18]">98.4%</strong>
              <span className="text-[10px] font-semibold text-[#316b00]">{language === 'fr' ? 'Confiance IA' : 'AI confidence'}</span>
            </div>
          </div>
        </div>
      </main>

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#0c1f15] px-4 py-3 text-center text-xs font-semibold text-white shadow-2xl">
          {notice}
        </div>
      )}
    </div>
  );
};

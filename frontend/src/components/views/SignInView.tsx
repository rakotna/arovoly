import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { BrandLogo } from '../common/BrandLogo';
import {
  ArrowLeft,
  ArrowRight,
  Badge,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Satellite,
  Sparkles,
  Waves,
  ShieldCheck,
} from 'lucide-react';

interface SignInViewProps {
  onSignInSuccess: (user: UserProfile) => void;
  onGoToLanding?: () => void;
  onGoToSignUp?: () => void;
  isSignOutNotice?: boolean;
}

const aerialImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDMcgQtF2IHVxbjGGL9gyJvgjzeCOMP3wL5EvRrI9PVHP_ydRSlScv5ZXfgfRk7nS7M3hFiqE_wS-Dq9CIDFfHewmY1OCIjeuS0s4mI04SYK4fb9qPGlY84I8u0V_pX0ddEEBi-DVXK5fxHLgR4VQmb7Nao0lqthA5hwBVdwVqkRIc5CLcrjUVYXWPdcxJyevzAu93OhwfQrIydtGC0m8';

export const SignInView: React.FC<SignInViewProps> = ({
  onSignInSuccess,
  onGoToLanding,
  onGoToSignUp,
  isSignOutNotice = false,
}) => {
  const { language, toggleLanguage, t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terminalUnit, setTerminalUnit] = useState('');
  const [activeRoleTab, setActiveRoleTab] = useState<'agronomist' | 'analyst' | 'manager'>('agronomist');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [magicMessage, setMagicMessage] = useState<string | null>(null);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);

  const handleMagicLink = async () => {
    setMagicMessage(null);
    if (!email) {
      setMagicMessage('Saisissez votre adresse email.');
      return;
    }
    setIsMagicLinkLoading(true);
    try {
      const message = await api.requestMagicLink(email);
      setMagicMessage(message);
    } catch (error) {
      setMagicMessage(error instanceof Error ? error.message : 'Impossible d’envoyer le lien.');
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    try {
      const backendUser = await api.login(email, password);
      onSignInSuccess(backendUser);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Identifiants invalides.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRolePreset = (role: 'agronomist' | 'analyst' | 'manager') => {
    setActiveRoleTab(role);
  };

  const panelClass =
    'bg-[#fcf9f3]/90 backdrop-blur-xl shadow-[0_16px_36px_-8px_rgba(10,36,18,0.25)]';

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-[#fcf9f3] p-3 pt-20 font-sans text-[#1c1c18] sm:p-6 sm:pt-20 lg:p-10">
      <div className="absolute inset-0 scale-105 bg-cover bg-center" style={{ backgroundImage: `url("${aerialImage}")` }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1c11]/95 via-[#0e2417]/80 to-[#07130b]/70 backdrop-blur-[2px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(circle, #76c043 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="absolute left-4 top-4 z-20">
        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            className="group flex items-center gap-2 rounded-full border border-[#e5e2dc]/40 bg-[#fcf9f3]/90 px-4 py-2 text-xs font-bold text-[#1c1c18] shadow-lg backdrop-blur-xl transition hover:text-[#316b00]"
          >
            <ArrowLeft className="h-4 w-4 text-[#316b00] transition group-hover:-translate-x-0.5" />
            <span>Accueil</span>
            <span className="text-[#717a68]">•</span>
            <BrandLogo compact />
          </button>
        )}
      </div>

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-[#e5e2dc]/40 bg-[#fcf9f3]/90 px-4 py-2 font-mono text-[10px] font-semibold tracking-wider backdrop-blur-xl sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#76c043]" />
          <LockKeyhole className="h-4 w-4 text-[#316b00]" />
          TELEMETRY GUARD
        </div>
        <button
          onClick={toggleLanguage}
          className="rounded-full border border-[#e5e2dc]/40 bg-[#fcf9f3]/90 px-3 py-2 text-xs font-bold uppercase shadow-lg backdrop-blur-xl"
        >
          {language} <ChevronDown className="ml-1 inline h-3 w-3" />
        </button>
      </div>

      <div className="signin-content relative z-10 flex w-full max-w-7xl flex-col items-center justify-center gap-4 pb-8 lg:flex-row lg:gap-8">
        <section className={`${panelClass} relative w-full max-w-xl overflow-hidden rounded-2xl p-4 sm:p-7 lg:p-8`}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#76c043]/20 blur-3xl" />
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f0eee8] px-3 py-1 font-mono text-[10px] font-semibold tracking-wider">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#76c043]" />
              TERMINAL v3.4 <span className="opacity-40">•</span> <span className="text-[#416652]">SECURE GATEWAY</span>
            </div>
            <div className="hidden items-center gap-1 font-mono text-[10px] text-[#52634a] sm:flex">
              <LockKeyhole className="h-4 w-4 text-[#316b00]" /> E2EE 256-BIT
            </div>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Accéder au Terminal AROVOLY</h1>
            <p className="mt-1 text-sm leading-5 text-[#414939]">
              Connectez-vous pour monitorer vos parcelles, le flux multispectral Sentinel-2 et vos sondes IoT LoRaWAN.
            </p>
          </div>

          {isSignOutNotice && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#c3ecd2] p-3 text-xs text-[#2a4e3b]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {language === 'fr' ? 'Session fermée. Vous pouvez vous reconnecter ci-dessous.' : 'Session closed. Sign back in below.'}
            </div>
          )}
          {authError && (
            <div className="mb-4 rounded-xl border border-[#f0aaa5] bg-[#ffe1df] p-3 text-xs font-semibold text-[#ba1a1a]" role="alert">
              {authError}
            </div>
          )}

          <div className="mb-3 grid grid-cols-3 gap-1 rounded-full bg-[#f0eee8] p-1 text-xs">
            {([
              ['agronomist', t.signIn.roleAgronomist],
              ['analyst', t.signIn.roleAnalyst],
              ['manager', t.signIn.roleManager],
            ] as const).map(([role, label]) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRolePreset(role)}
                className={`rounded-full py-2 font-bold transition ${activeRoleTab === role ? 'bg-[#76c043] text-white shadow-sm' : 'text-[#717a68] hover:text-[#1c1c18]'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-sm font-semibold">
              {t.signIn.emailLabel}
              <span className="relative mt-1 block">
                <Badge className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#52634a]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom.agronome@coop-centrale.mg"
                  className="w-full rounded-full bg-[#f0eee8] py-3 pl-12 pr-4 text-sm font-normal outline-none transition focus:bg-white focus:ring-2 focus:ring-[#76c043]"
                />
              </span>
            </label>

            <label className="block text-sm font-semibold">
              <span className="flex items-center justify-between">
                {t.signIn.passwordLabel}
                <a href="#forgot" className="text-xs font-bold text-[#316b00] hover:underline">{t.signIn.forgotToken}</a>
              </span>
              <span className="relative mt-1 block">
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#52634a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full rounded-full bg-[#f0eee8] py-3 pl-12 pr-12 text-sm font-normal outline-none transition focus:bg-white focus:ring-2 focus:ring-[#76c043]"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52634a]" aria-label="Afficher ou masquer le mot de passe">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </span>
            </label>

            <label className="block text-sm font-semibold">
              {t.signIn.terminalLabel}
              <select value={terminalUnit} onChange={(e) => setTerminalUnit(e.target.value)} className="mt-1 w-full appearance-none rounded-full bg-[#f0eee8] px-4 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#76c043]">
                <option value="">Sélectionner un secteur</option>
                <option>Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)</option>
                <option>Secteur 02 • Vakinankaratra (Antsirabe)</option>
                <option>Secteur 09 • Itasy (Miarinarivo / Ampefy)</option>
              </select>
            </label>

            <div className="flex items-center justify-between gap-3 text-xs text-[#414939]">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#316b00]" />
                {t.signIn.rememberMe}
              </label>
              <span className="hidden font-mono text-[10px] text-[#52634a] sm:inline">TTL: 30 JOURS</span>
            </div>

            <button type="submit" disabled={isLoading} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#76c043] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(118,192,67,0.45)] transition hover:bg-[#316b00] disabled:opacity-70">
              <span>{isLoading ? t.signIn.authenticating : t.signIn.submitBtn}</span>
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-center font-mono text-[10px] uppercase text-[#717a68]">
            <span className="h-px flex-1 bg-[#e5e2dc]" /> ou protocoles tiers <span className="h-px flex-1 bg-[#e5e2dc]" />
          </div>
          <button type="button" onClick={() => { setEmail('e.vance@arovoly.mg'); setPassword('arovoly2024'); setAuthError(null); }} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f0eee8] px-4 py-2.5 text-xs font-bold text-[#416652] transition hover:bg-[#e5e2dc]">
            <Sparkles className="h-4 w-4" /> {t.signIn.demoBtn}
          </button>
          <button
            type="button"
            onClick={handleMagicLink}
            disabled={isMagicLinkLoading}
            className="mt-3 w-full rounded-full border border-[#76c043] px-4 py-2.5 text-xs font-bold text-[#316b00] transition hover:bg-[#c3ecd2] disabled:opacity-70"
          >
            {isMagicLinkLoading ? 'Envoi du lien...' : 'Recevoir un lien magique par email'}
          </button>
          {magicMessage && (
            <p className="mt-3 text-center text-xs text-[#416652]" role="status">
              {magicMessage}
            </p>
          )}
          {onGoToSignUp && <p className="mt-5 text-center text-xs text-[#414939]">Vous n'avez pas encore d'accès parcellaire ? <button onClick={onGoToSignUp} className="font-bold text-[#316b00] hover:underline">S'inscrire gratuitement</button></p>}
        </section>

        <aside className="hidden w-full max-w-lg flex-col gap-4 lg:flex">
          <div className={`${panelClass} rounded-2xl p-6`}>
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] font-semibold text-[#316b00]">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#76c043]" /> ORBITAL REVISIT: J-2</span>
              <span className="text-[#717a68]">MSI BANDS B04/B08</span>
            </div>
            <h2 className="text-lg font-extrabold">Station Spatiale Sentinel-2 ESA</h2>
            <p className="mt-1 text-xs leading-5 text-[#414939]">Couverture optique 10m haute résolution calibrée sur le couloir agronomique central de Madagascar.</p>
            <div className="mt-4 flex items-end justify-between rounded-xl bg-[#f0eee8] p-3">
              <div><span className="block font-mono text-[10px] text-[#717a68]">NDVI MOYEN RÉGIONAL</span><strong className="text-3xl text-[#316b00]">0.74</strong><span className="ml-2 text-xs font-bold text-[#416652]">Vigoureux (+3.1%)</span></div>
              <Waves className="h-10 w-20 text-[#76c043]" />
            </div>
          </div>
          <div className={`${panelClass} rounded-2xl p-6`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#416652]"><span>Réseau Terrain LoRaWAN</span><span className="flex items-center gap-1 font-mono text-[10px] text-[#316b00]"><Satellite className="h-4 w-4" /> 1,420 SONDES ACTIVES</span></div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#f0eee8] p-3"><span className="block font-mono text-[10px] text-[#717a68]">Humidité du Sol</span><strong className="text-xl">62.8%</strong><span className="block text-xs font-bold text-[#316b00]">Zone Optimale</span></div>
              <div className="rounded-xl bg-[#f0eee8] p-3"><span className="block font-mono text-[10px] text-[#717a68]">Précision Modèle</span><strong className="text-xl">98.4%</strong><span className="block text-xs font-bold text-[#416652]">IA Calibrée</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#c3ecd2]/90 p-4 text-[#2a4e3b]"><CheckCircle2 className="h-6 w-6" /><div><p className="text-xs font-bold">Synchronisation Télédétection OK</p><p className="text-xs opacity-80">Dernier passage orbital il y a 38 min</p></div></div>
        </aside>
      </div>

      <div className="absolute bottom-3 left-4 hidden items-center gap-2 rounded-full bg-[#fcf9f3]/75 px-4 py-2 font-mono text-[10px] text-[#414939] backdrop-blur-xl md:flex"><ShieldCheck className="h-4 w-4 text-[#316b00]" /> ISO 27001 &amp; RGPD <span className="opacity-30">•</span> SERVEURS SOUVERAINS</div>
      <div className="absolute bottom-3 right-4 hidden items-center gap-2 rounded-full bg-[#fcf9f3]/85 px-4 py-2 text-xs backdrop-blur-xl sm:flex"><Satellite className="h-4 w-4 text-[#316b00]" /> <strong>Sentinel S2-B</strong> <span className="opacity-30">•</span> Sécurité / Support</div>
    </main>
  );
};

import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { Globe, ArrowLeft, ArrowRight, Lock, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

interface SignInViewProps {
  onSignInSuccess: (user: UserProfile) => void;
  onGoToLanding?: () => void;
  isSignOutNotice?: boolean;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onSignInSuccess,
  onGoToLanding,
  isSignOutNotice = false,
}) => {
  const { language, toggleLanguage, t } = useTranslation();
  const [email, setEmail] = useState('e.vance@arovoly.mg');
  const [password, setPassword] = useState('arovoly2024');
  const [terminalUnit, setTerminalUnit] = useState('Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)');
  const [activeRoleTab, setActiveRoleTab] = useState<'agronomist' | 'analyst' | 'manager'>('agronomist');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const backendUser = await api.login(email, password);
      if (backendUser) {
        onSignInSuccess(backendUser);
      } else {
        onSignInSuccess({
          name:
            activeRoleTab === 'agronomist'
              ? 'Dr. Éléonore Vance (Andrianina)'
              : activeRoleTab === 'analyst'
              ? 'Rado Rakotomalala (Télédétection)'
              : 'Mamy Razafindrakoto (Directeur)',
          email,
          role:
            activeRoleTab === 'agronomist'
              ? language === 'fr' ? 'Directrice Agronome Régionale' : 'Regional Lead Agronomist'
              : activeRoleTab === 'analyst'
              ? language === 'fr' ? 'Spécialiste Données Satellitaires' : 'Satellite Data Specialist'
              : language === 'fr' ? 'Gestionnaire Exploitation' : 'Farm General Manager',
          terminalUnit,
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRolePreset = (role: 'agronomist' | 'analyst' | 'manager') => {
    setActiveRoleTab(role);
    if (role === 'agronomist') {
      setEmail('e.vance@arovoly.mg');
      setTerminalUnit('Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)');
    } else if (role === 'analyst') {
      setEmail('analyst.satellite@arovoly.mg');
      setTerminalUnit('Secteur 02 • Vakinankaratra (Antsirabe)');
    } else {
      setEmail('direction.exploitation@arovoly.mg');
      setTerminalUnit('Secteur 09 • Itasy (Miarinarivo / Ampefy)');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 font-sans text-white relative flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white select-none">
      {/* Background High-Resolution Aerial Canvas */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdEHkw-7swFm4ksAAIHwFQVOFQet9TpONRcnl0Za8KL-OVg0EURbQjqSlx3uefkC1C5Hytg7KQK86eoVLG6U1HEnAbCO4srByqXD1ooOffEh4Z-ht6DJs4opnZT-kovkCJDYe4pBNlzAtqzVmVSn_JQTwF-cWs_F3KKq4OgW34i5EBGVsDwLlHziwpZdjeunoCF-KVxbb-0wPoL6s9lr_0E890vKl97ICqh9P5I9kk")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/85"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/80"></div>
      </div>

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between max-w-5xl mx-auto w-full">
        {onGoToLanding ? (
          <button
            onClick={onGoToLanding}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md transition-all hover:border-emerald-400 hover:text-white shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'fr' ? '← Page d’accueil (À propos & Infos)' : '← Home Page (About & Info)'}</span>
          </button>
        ) : (
          <div></div>
        )}

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 border border-white/15 text-slate-200 text-xs font-semibold backdrop-blur-md transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language.toUpperCase()}</span>
        </button>
      </div>

      {/* Main Glassmorphic Sign-In Card (Strictly Fits in Viewport, No Vertical Scroll) */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/85 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-6 shadow-2xl text-white">
        {/* Subtle Ambient Card Glow */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Card Header: Brand & Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-glow-emerald shrink-0">
              <span className="text-lg">🌱</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-white text-base tracking-tight leading-none">
                  ARO<span className="text-emerald-400">VOLY</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  v3.4 • Madagascar
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {language === 'fr' ? 'Portail Sécurisé d’Agriculture de Précision' : 'Secure Precision Ag Terminal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sentinel-2</span>
          </div>
        </div>

        {/* Sign-Out Notice */}
        {isSignOutNotice && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] leading-tight">
              {language === 'fr' ? 'Session fermée. Vous pouvez vous reconnecter ci-dessous.' : 'Session closed. Sign back in below.'}
            </span>
          </div>
        )}

        {/* Role Presets */}
        <div className="flex items-center gap-1.5 mb-3.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => handleRolePreset('agronomist')}
            className={`flex-1 py-1 rounded-lg text-center font-bold text-xs transition-all ${
              activeRoleTab === 'agronomist'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.signIn.roleAgronomist}
          </button>
          <button
            type="button"
            onClick={() => handleRolePreset('analyst')}
            className={`flex-1 py-1 rounded-lg text-center font-bold text-xs transition-all ${
              activeRoleTab === 'analyst'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.signIn.roleAnalyst}
          </button>
          <button
            type="button"
            onClick={() => handleRolePreset('manager')}
            className={`flex-1 py-1 rounded-lg text-center font-bold text-xs transition-all ${
              activeRoleTab === 'manager'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.signIn.roleManager}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              {t.signIn.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="agronome@arovoly.mg"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                {t.signIn.passwordLabel}
              </label>
              <a href="#forgot" className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">
                {t.signIn.forgotToken}
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/15 rounded-xl pl-3.5 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Terminal select */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              {t.signIn.terminalLabel}
            </label>
            <select
              value={terminalUnit}
              onChange={(e) => setTerminalUnit(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)">
                Secteur 04 • Alaotra-Mangoro (Ambatondrazaka - 4 850 ha)
              </option>
              <option value="Secteur 02 • Vakinankaratra (Antsirabe / Betafo)">
                Secteur 02 • Vakinankaratra (Antsirabe / Betafo - 2 400 ha)
              </option>
              <option value="Secteur 09 • Itasy (Miarinarivo / Ampefy)">
                Secteur 09 • Itasy (Miarinarivo / Ampefy - 1 650 ha)
              </option>
              <option value="Secteur 06 • Menabe (Morondava / Baiboho)">
                Secteur 06 • Menabe (Morondava / Baiboho - 3 100 ha)
              </option>
              <option value="Secteur 11 • Boeny (Marovoay Riziculture)">
                Secteur 11 • Boeny (Marovoay Riziculture - 2 800 ha)
              </option>
            </select>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center text-xs text-slate-400 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-800 border-white/20 text-emerald-500 focus:ring-emerald-500"
              />
              <span>{t.signIn.rememberMe}</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>{t.signIn.authenticating}</span>
            ) : (
              <>
                <span>{t.signIn.submitBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Instant Demo Button */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onSignInSuccess({
                name: 'Dr. Éléonore Vance (Andrianina)',
                email: 'e.vance@arovoly.mg',
                role: language === 'fr' ? 'Directrice Agronome Régionale' : 'Regional Lead Agronomist',
                terminalUnit: 'Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)',
                avatarUrl:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
              });
            }}
            className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-emerald-300 border border-white/15 flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.signIn.demoBtn}</span>
          </button>
        </div>

        {/* Link to Landing / About & Help */}
        {onGoToLanding && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={onGoToLanding}
              className="text-[11px] text-slate-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>{language === 'fr' ? 'Découvrir AROVOLY (À propos, Aide & Guide)' : 'Discover AROVOLY (About, Help & Guide)'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

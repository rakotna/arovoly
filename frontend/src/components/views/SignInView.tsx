import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';

interface SignInViewProps {
  onSignInSuccess: (user: UserProfile) => void;
  isSignOutNotice?: boolean;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onSignInSuccess,
  isSignOutNotice = false,
}) => {
  const { language, toggleLanguage, t } = useTranslation();
  const [email, setEmail] = useState('e.vance@agrofield.mg');
  const [password, setPassword] = useState('••••••••••••');
  const [terminalUnit, setTerminalUnit] = useState('Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)');
  const [activeRoleTab, setActiveRoleTab] = useState<'agronomist' | 'analyst' | 'manager'>('agronomist');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
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
    }, 600);
  };

  const handleRolePreset = (role: 'agronomist' | 'analyst' | 'manager') => {
    setActiveRoleTab(role);
    if (role === 'agronomist') {
      setEmail('e.vance@agrofield.mg');
      setTerminalUnit('Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)');
    } else if (role === 'analyst') {
      setEmail('analyst.satellite@agrofield.mg');
      setTerminalUnit('Secteur 02 • Vakinankaratra (Antsirabe)');
    } else {
      setEmail('direction.exploitation@agrofield.mg');
      setTerminalUnit('Secteur 09 • Itasy (Miarinarivo / Ampefy)');
    }
  };

  return (
    <div className="bg-slate-950 font-sans text-slate-800 antialiased min-h-screen relative flex flex-col selection:bg-emerald-500 selection:text-white select-none">
      {/* Full-bleed Aerial High-Resolution Geospatial Background Canvas */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-100"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdEHkw-7swFm4ksAAIHwFQVOFQet9TpONRcnl0Za8KL-OVg0EURbQjqSlx3uefkC1C5Hytg7KQK86eoVLG6U1HEnAbCO4srByqXD1ooOffEh4Z-ht6DJs4opnZT-kovkCJDYe4pBNlzAtqzVmVSn_JQTwF-cWs_F3KKq4OgW34i5EBGVsDwLlHziwpZdjeunoCF-KVxbb-0wPoL6s9lr_0E890vKl97ICqh9P5I9kk")',
        }}
      >
        {/* Sophisticated Deep Geospatial Tint & Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-slate-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/50"></div>

        {/* Vector Geospatial Topography & Survey Grid Vectors */}
        <svg
          className="absolute inset-0 w-full h-full text-emerald-400/20 pointer-events-none mix-blend-screen"
          fill="none"
          viewBox="0 0 1440 900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100,280 C320,180 580,450 920,320 C1160,220 1340,360 1520,340"
            stroke="currentColor"
            strokeDasharray="8 8"
            strokeWidth="1.5"
          ></path>
          <path
            d="M-50,480 C360,400 680,620 1020,490 C1240,410 1380,560 1560,510"
            stroke="currentColor"
            strokeDasharray="4 4"
            strokeWidth="1"
          ></path>
          <polygon
            fill="currentColor"
            fillOpacity="0.08"
            points="820,240 1080,190 1200,460 880,540"
            stroke="currentColor"
            strokeWidth="1.5"
          ></polygon>
          <circle cx="820" cy="240" fill="currentColor" r="4"></circle>
          <circle cx="1080" cy="190" fill="currentColor" r="4"></circle>
          <circle cx="1200" cy="460" fill="currentColor" r="4"></circle>
          <circle cx="880" cy="540" fill="currentColor" r="4"></circle>
        </svg>
      </div>

      {/* Global Application Bar */}
      <header className="relative z-50 w-full bg-slate-900/40 backdrop-blur-xl border-b border-white/10 px-6 sm:px-10 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-glow-emerald">
            <span className="material-symbols-outlined text-[20px]">agriculture</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-white text-[17px] tracking-tight leading-none">
                AgroField AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Enterprise v3.4 • Madagascar
              </span>
            </div>
            <span className="text-xs text-slate-300 font-medium tracking-tight mt-1">
              {t.header.systemSubtitle}
            </span>
          </div>
        </div>

        {/* Status & Quick Telemetry Header Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide">{t.header.orbitalActive}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">satellite_alt</span>
            <span>Sentinel-2 Synced 18m ago</span>
          </div>

          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-semibold transition-all"
            title="Changer de langue (Switch language)"
          >
            <span className="material-symbols-outlined text-[16px]">language</span>
            <span>{language.toUpperCase()} ({language === 'fr' ? 'EN' : 'FR'})</span>
          </button>
        </div>
      </header>

      {/* Main Content Arena: 2-Column Responsive Layout */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Authentic AgroField Sign In Card (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-6 w-full">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-10 shadow-glass relative overflow-hidden text-white">
              {/* Subtle ambient card glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Notice if signed out */}
              {isSignOutNotice && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
                  <span>{language === 'fr' ? 'Session fermée avec succès. Vous pouvez vous reconnecter ci-dessous.' : 'Session signed out successfully. You can sign back in below.'}</span>
                </div>
              )}

              {/* Title & Description */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold uppercase tracking-wider">
                    {t.signIn.secureBadge}
                  </span>
                  <span className="text-slate-400 text-xs">• SSL 256-Bit</span>
                </div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  {t.signIn.title}
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">
                  {t.signIn.subtitle}
                </p>
              </div>

              {/* Quick Role Preset Pills */}
              <div className="flex items-center gap-2 mb-5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => handleRolePreset('agronomist')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center font-bold transition-all ${
                    activeRoleTab === 'agronomist'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {t.signIn.roleAgronomist}
                </button>
                <button
                  type="button"
                  onClick={() => handleRolePreset('analyst')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center font-bold transition-all ${
                    activeRoleTab === 'analyst'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {t.signIn.roleAnalyst}
                </button>
                <button
                  type="button"
                  onClick={() => handleRolePreset('manager')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center font-bold transition-all ${
                    activeRoleTab === 'manager'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {t.signIn.roleManager}
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    {t.signIn.emailLabel}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      placeholder="agronome@exploitation.mg"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    {t.signIn.passwordLabel}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Terminal selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    {t.signIn.terminalLabel}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      domain
                    </span>
                    <select
                      value={terminalUnit}
                      onChange={(e) => setTerminalUnit(e.target.value)}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none"
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
                    <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Remember & Forgot options */}
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-800 border-white/20 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>{t.signIn.rememberMe}</span>
                  </label>
                  <a href="#forgot" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    {t.signIn.forgotToken}
                  </a>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-glow-emerald transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {t.signIn.authenticating}
                    </span>
                  ) : (
                    <>
                      <span>{t.signIn.submitBtn}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Access Instant Trigger */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSignInSuccess({
                      name: 'Dr. Éléonore Vance (Andrianina)',
                      email: 'e.vance@agrofield.mg',
                      role: language === 'fr' ? 'Directrice Agronome Régionale' : 'Regional Lead Agronomist',
                      terminalUnit: 'Secteur 04 • Alaotra-Mangoro (Ambatondrazaka)',
                      avatarUrl:
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
                    });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-emerald-300 border border-white/15 flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">lock_open</span>
                  <span>{t.signIn.demoBtn}</span>
                </button>
              </div>

              {/* Bottom Request Terminal Access link */}
              <div className="mt-4 text-center">
                <a
                  href="#request-access"
                  className="text-xs text-slate-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
                >
                  <span>{t.signIn.requestAccess}</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Hologram Agronomic Telemetry Card (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-6 hidden lg:flex flex-col items-end w-full space-y-4">
            {/* Optimal Growth Zone Hologram Card */}
            <div className="w-full max-w-md bg-slate-900/85 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-5 shadow-2xl text-white transform transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-400">
                    {t.signIn.hologramZone}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                  {t.signIn.hologramCasier}
                </span>
              </div>

              {/* Target VRA Applied Metric */}
              <div className="py-3.5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">
                    {t.signIn.hologramVra}
                  </span>
                  <span className="font-heading text-2xl font-extrabold text-white">
                    85 <span className="text-sm font-medium text-slate-300">kg/ha (Urée 46%)</span>
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                  {t.signIn.hologramApplied}
                </span>
              </div>

              {/* Spectral Index Data Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                  <span className="block text-[11px] font-medium text-slate-400 uppercase">NDVI Index</span>
                  <span className="block font-heading text-base font-bold text-emerald-400 mt-0.5">0.82</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                  <span className="block text-[11px] font-medium text-slate-400 uppercase">{t.signIn.hologramSoilMoist}</span>
                  <span className="block font-heading text-base font-bold text-blue-400 mt-0.5">41%</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                  <span className="block text-[11px] font-medium text-slate-400 uppercase">{t.signIn.hologramAcidity}</span>
                  <span className="block font-heading text-base font-bold text-amber-300 mt-0.5">6.8</span>
                </div>
              </div>

              {/* Efficiency & Cost Savings Bar */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">eco</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-200">{t.signIn.hologramOptimization}</span>
                    <span className="block text-[11px] text-slate-400">{t.signIn.hologramFertilizerReduced}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-heading font-extrabold text-emerald-400 text-sm">-38.5%</span>
                  <span className="block text-[10px] text-slate-400 uppercase">{t.signIn.hologramCostIndex}</span>
                </div>
              </div>
            </div>

            {/* Bottom Geospatial Navigation Tool Cluster */}
            <div className="flex items-center justify-between lg:justify-end gap-3 w-full pt-4">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/20 text-white rounded-full px-4 py-2 shadow-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">explore</span>
                <span className="text-xs font-semibold font-mono tracking-wide text-slate-200">
                  17°49'S, 48°25'E • Ambatondrazaka (Madagascar)
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="relative z-20 w-full py-4 px-6 sm:px-10 bg-slate-950/70 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>{t.signIn.footerCopyright}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {t.signIn.footerLorawan} <strong className="text-white font-semibold">99.98%</strong>
            </span>
            <span className="text-slate-600">•</span>
            <a className="text-slate-400 hover:text-emerald-400 transition-colors" href="#system-protocol">
              {t.signIn.footerProtocol}
            </a>
            <span className="text-slate-600">•</span>
            <a className="text-slate-400 hover:text-emerald-400 transition-colors" href="#privacy">
              {t.signIn.footerNodes}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

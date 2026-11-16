import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Satellite, Radio, Shield, KeyRound, Mail, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SignInViewProps {
  onSignInSuccess: (user: UserProfile) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSignInSuccess }) => {
  const [email, setEmail] = useState('e.vance@agrofield.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [terminalUnit, setTerminalUnit] = useState('Sector 04 • Mid-Valley Agronomics');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess({
        name: 'Dr. Éléonore Vance',
        email,
        role: 'Lead Agronomist & Sector Director',
        terminalUnit,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      });
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-950 font-sans">
      {/* High-Resolution Geospatial Satellite Background Canvas */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000")',
        }}
      >
        {/* Deep Geospatial Tint & Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60"></div>

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
        </svg>
      </div>

      {/* Global Application Bar */}
      <header className="relative z-20 w-full bg-slate-900/60 backdrop-blur-xl border-b border-white/10 px-6 sm:px-10 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-glow-emerald">
            <span className="text-xl">🌱</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-white text-lg tracking-tight leading-none">
                AgroField <span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Enterprise v3.4
              </span>
            </div>
            <span className="text-xs text-slate-300 font-medium tracking-tight mt-0.5">
              Precision Analytics & Variable Rate Application Engine
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Satellite className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide">Orbital Feeds Active</span>
          </div>
        </div>
      </header>

      {/* Central Interactive Login Terminal */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/15 p-8 shadow-2xl shadow-black/80 flex flex-col gap-6 text-white">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Portail Sécurisé ISOBUS / Cloud
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Shield className="w-3 h-3 text-emerald-400" /> AES-256
              </span>
            </div>
            <h1 className="text-2xl font-extrabold font-heading text-white tracking-tight">
              Sign In to Farm Operations
            </h1>
            <p className="text-xs text-slate-300">
              Console d'intelligence agronomique & gestion de la modulation variable.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                AgroField ID / Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                placeholder="agronome@exploitation.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                Jeton de Sécurité / Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                placeholder="••••••••••••"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                Terminal Agricole / Unité Opérationnelle
              </label>
              <select
                value={terminalUnit}
                onChange={(e) => setTerminalUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/90 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="Sector 04 • Mid-Valley Agronomics">Sector 04 • Mid-Valley Agronomics (1 230 ha)</option>
                <option value="Sector 02 • North Delta">Sector 02 • North Delta (2 400 ha)</option>
                <option value="Sector 09 • Prairie Highlands">Sector 09 • Prairie Highlands (1 220 ha)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-400"
                />
                <span>Mémoriser le poste (30j)</span>
              </label>
              <a href="#" className="text-emerald-400 hover:underline">
                Code oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 font-bold text-sm text-white shadow-lg shadow-emerald-700/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Connexion sécurisée...
                </span>
              ) : (
                <>
                  <span>Authentifier & Lancer la Console Ag</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Trigger */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <span className="text-[11px] text-slate-400 text-center">Accès démonstration instantané</span>
            <button
              type="button"
              onClick={() => {
                onSignInSuccess({
                  name: 'Dr. Éléonore Vance',
                  email: 'e.vance@agrofield.ai',
                  role: 'Lead Agronomist & Sector Director',
                  terminalUnit: 'Sector 04 • Mid-Valley Agronomics',
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
                });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-300 border border-white/15 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ouvrir en mode Agronome Démo</span>
            </button>
          </div>
        </div>
      </main>

      {/* Protocol Status Bar Bottom */}
      <footer className="relative z-10 w-full bg-slate-950/70 backdrop-blur-md border-t border-white/10 px-6 py-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Sentinel-2 Constellation: Synced 18m ago (99.8% Tile Integrity)
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            Telemetry Latency: 42ms to Field Gateway 07
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Active Monitored Surface: 4,850 Hectares (18 Parcels)</span>
          <span className="text-emerald-400 font-bold">ESRI World Imagery Tile Service</span>
        </div>
      </footer>
    </div>
  );
};

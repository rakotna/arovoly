import React from 'react';
import { UserProfile, ViewType } from '../../types';
import { Radio, Satellite, ShieldCheck, User, LogOut, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  user: UserProfile | null;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentView,
  onNavigate,
  onSignOut,
}) => {
  return (
    <header className="relative z-40 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between text-white shadow-lg">
      {/* Brand & System Tag */}
      <div className="flex items-center gap-3.5">
        <div
          onClick={() => onNavigate('my_fields')}
          className="cursor-pointer w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] transition-transform hover:scale-105"
        >
          <span className="text-xl">🌱</span>
        </div>
        <div className="flex flex-col cursor-pointer" onClick={() => onNavigate('my_fields')}>
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-white text-[17px] tracking-tight leading-none">
              AgroField <span className="text-emerald-400">AI</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Enterprise v3.4
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium tracking-tight mt-0.5">
            Precision Agronomy & Crop Telemetry OS
          </span>
        </div>
      </div>

      {/* Center Orbital Telemetry Live Badges */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <Satellite className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-xs font-semibold tracking-wide">Sentinel-2 Sync: 18m ago</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>42ms • Field Gateway 07</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>PostGIS • Esri World Imagery</span>
        </div>
      </div>

      {/* User & Actions */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white tracking-tight">{user.name}</span>
              <span className="text-[11px] text-emerald-400 font-medium">{user.role}</span>
            </div>
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full ring-2 ring-emerald-500/40 object-cover"
            />
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-slate-300 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('sign_in')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Connexion Terminal</span>
          </button>
        )}
      </div>
    </header>
  );
};

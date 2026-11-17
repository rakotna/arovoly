import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ViewType } from '../../types';
import {
  Radio,
  Satellite,
  ShieldCheck,
  User,
  LogOut,
  Globe,
  Bell,
  Maximize2,
  Minimize2,
  CloudSun,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { BrandLogo } from './BrandLogo';

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
  const { language, toggleLanguage, t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Track Fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="relative z-40 w-full h-16 bg-[#fcf9f3]/95 backdrop-blur-xl border-b border-[#e5e2dc] px-3 sm:px-6 flex items-center justify-between text-[#1c1c18] shadow-sm select-none shrink-0">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <BrandLogo compact onClick={() => onNavigate('my_fields')} />
          </div>
          <span className="hidden sm:inline-block text-[10px] text-[#717a68] font-medium tracking-tight mt-0.5 truncate max-w-[280px]">
            {t.header.systemSubtitle}
          </span>
        </div>
      </div>

      {/* Center: Real-time Telemetry & Satellite Badges (Responsive) */}
      <div className="hidden md:flex items-center gap-2">
        {/* Orbital Feed */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0eee8] border border-[#e5e2dc] text-xs text-[#414939]">
          <span className="w-2 h-2 rounded-full bg-[#76c043] animate-pulse"></span>
          <Satellite className="w-3.5 h-3.5 text-[#316b00]" />
          <span className="text-[11px] font-semibold">{t.header.sentinelSync}</span>
        </div>

        {/* LoRa Gateway */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0eee8] border border-[#e5e2dc] text-[11px] text-[#717a68]">
          <Radio className="w-3.5 h-3.5 text-[#316b00]" />
          <span>{t.header.gatewayLatency}</span>
        </div>

        {/* Weather Snippet Madagascar */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0eee8] border border-[#e5e2dc] text-[11px] text-[#717a68]">
          <CloudSun className="w-3.5 h-3.5 text-[#52634a]" />
          <span>Ambatondrazaka : 24°C • Ensoleillé</span>
        </div>
      </div>

      {/* Right Controls: Fullscreen, Language, Notifications & Profile */}
      <div className="flex items-center gap-2">
        {/* Fullscreen Button (One-click F11 solution) */}
        <button
          onClick={handleToggleFullscreen}
          className="p-1.5 rounded-xl bg-[#f0eee8] hover:bg-[#e5e2dc] border border-[#e5e2dc] text-[#52634a] hover:text-[#1c1c18] transition-all shadow-sm"
          title={isFullscreen ? 'Quitter le mode plein écran (Esc)' : 'Activer le mode plein écran (F11)'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#316b00]" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Language Switcher Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#f0eee8] hover:bg-[#e5e2dc] border border-[#e5e2dc] text-xs font-bold text-[#1c1c18] transition-all shadow-sm"
          title={language === 'fr' ? 'Passer en anglais (Switch to English)' : 'Passer en français (Switch to French)'}
        >
          <Globe className="w-3.5 h-3.5 text-[#316b00]" />
          <span className="tracking-wider">{language.toUpperCase()}</span>
        </button>

        {/* About & Home Navigation */}
        <button
          onClick={() => onNavigate('landing')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#f0eee8] hover:bg-[#c3ecd2] border border-[#e5e2dc] hover:border-[#a8d0b7] text-xs font-semibold text-[#414939] hover:text-[#316b00] transition-all"
          title="Page d'accueil, présentation et aide AROVOLY"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#316b00]" />
          <span className="hidden md:inline">{language === 'fr' ? 'Accueil & À Propos' : 'Home & About'}</span>
        </button>

        {/* Notifications Bell Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-1.5 rounded-xl bg-[#f0eee8] hover:bg-[#e5e2dc] border border-[#e5e2dc] text-[#52634a] hover:text-[#1c1c18] transition-all relative"
            title="Notifications & Alertes agricoles"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-[#fcf9f3] animate-pulse"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-11 w-80 rounded-2xl bg-[#fcf9f3]/95 backdrop-blur-2xl border border-[#e5e2dc] p-4 shadow-2xl text-[#1c1c18] flex flex-col gap-3 animate-fade-in z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#e5e2dc]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#316b00]">
                  Alertes & Télémétrie (3)
                </span>
                <span className="text-[10px] text-[#717a68]">En direct</span>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                {/* Alert 1 */}
                <div className="p-2.5 rounded-xl bg-orange-950/60 border border-orange-500/40 flex items-start gap-2.5 text-orange-200">
                  <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-orange-300">Carence N • Parcelle #208 Tanety</div>
                    <div className="text-[11px] text-orange-200/80 mt-0.5">
                      Chlorose détectée sur 45 ha. Apport d'urée fractionné recommandé.
                    </div>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="p-2.5 rounded-xl bg-[#f0eee8] border border-[#e5e2dc] flex items-start gap-2.5 text-[#414939]">
                  <Satellite className="w-4 h-4 text-[#316b00] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#1c1c18]">Nouvelle Scène Sentinel-2</div>
                    <div className="text-[11px] text-[#717a68] mt-0.5">
                      Bassin d'Ambatondrazaka synchronisé avec 99.8% d'intégrité de tuiles.
                    </div>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="p-2.5 rounded-xl bg-[#f0eee8] border border-[#e5e2dc] flex items-start gap-2.5 text-[#414939]">
                  <CheckCircle2 className="w-4 h-4 text-[#316b00] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#1c1c18]">Flotte LoRaWAN Connectée</div>
                    <div className="text-[11px] text-[#717a68] mt-0.5">
                      5 sondes sur 5 en ligne. Réserve utile hydrique à 82%.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {user ? (
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-full bg-[#f0eee8] hover:bg-[#e5e2dc] border border-[#e5e2dc] transition-all"
            >
              <div className="hidden sm:flex flex-col text-right leading-none">
                <span className="text-xs font-bold text-[#1c1c18] tracking-tight">{user.name.split(' ')[0]}</span>
                <span className="text-[9px] text-[#316b00] font-semibold mt-0.5">Agronome MDG</span>
              </div>
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full ring-2 ring-emerald-500/50 object-cover"
              />
              <ChevronDown className={`w-3 h-3 text-[#717a68] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-11 w-64 rounded-2xl bg-[#fcf9f3]/95 backdrop-blur-2xl border border-[#e5e2dc] p-4 shadow-2xl text-[#1c1c18] flex flex-col gap-3 animate-fade-in z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-[#e5e2dc]">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full ring-2 ring-emerald-500 object-cover"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-[#1c1c18] truncate">{user.name}</span>
                    <span className="text-[10px] text-[#316b00] truncate">{user.role}</span>
                    <span className="text-[10px] text-[#717a68] truncate mt-0.5">{user.email}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#414939] flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#717a68]">
                    <MapPin className="w-3.5 h-3.5 text-[#316b00] shrink-0" />
                    <span className="truncate">{user.terminalUnit}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e5e2dc]">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.header.signOut}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onNavigate('sign_in')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.header.terminalLogin}</span>
          </button>
        )}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { ViewType } from '../../types';
import {
  LayoutGrid,
  PenTool,
  Layers,
  Cpu,
  TrendingUp,
  Tractor,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Home,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenReportModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenReportModal,
}) => {
  const { t, language } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      id: 'landing' as ViewType,
      label: language === 'fr' ? 'Accueil & À Propos' : 'Home & About',
      sublabel: language === 'fr' ? 'Présentation de la plateforme' : 'Platform Overview',
      icon: Home,
    },
    {
      id: 'my_fields' as ViewType,
      label: t.sidebar.myFields,
      sublabel: t.sidebar.myFieldsSub,
      icon: LayoutGrid,
    },
    {
      id: 'crop_tracing' as ViewType,
      label: t.sidebar.cropTracing,
      sublabel: t.sidebar.cropTracingSub,
      icon: PenTool,
    },
    {
      id: 'vra_dashboard' as ViewType,
      label: t.sidebar.vra,
      sublabel: t.sidebar.vraSub,
      icon: Layers,
    },
    {
      id: 'soil_sensors' as ViewType,
      label: t.sidebar.soilSensors,
      sublabel: t.sidebar.soilSensorsSub,
      icon: Cpu,
    },
    {
      id: 'yield_forecast' as ViewType,
      label: t.sidebar.yieldForecast,
      sublabel: t.sidebar.yieldForecastSub,
      icon: TrendingUp,
    },
  ];

  return (
    <aside
      className={`h-full bg-[#f0eee8] border-r border-[#e5e2dc] flex flex-col justify-between shrink-0 select-none transition-all duration-300 ease-in-out z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Section with Sector Badge & Collapse Button */}
      <div className={`relative p-3 border-b border-[#e5e2dc] flex items-center gap-2 shrink-0 ${isCollapsed ? 'justify-end' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#316b00] truncate">
              {t.sidebar.sectorBadge}
            </span>
            <span className="text-xs font-bold text-[#1c1c18] truncate">
              Alaotra-Mangoro (4 850 ha)
            </span>
          </div>
        ) : (
          <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-[#c3ecd2] text-xs font-bold text-[#316b00]">
            MDG
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-[#717a68] hover:text-[#1c1c18] hover:bg-[#e5e2dc] transition-colors shrink-0"
          title={isCollapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Middle Scrollable Section (Always accessible on any screen height without F11!) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 py-3 px-2.5 flex flex-col gap-4">
        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-[#717a68] px-2.5 uppercase tracking-wider mb-1">
              {t.sidebar.fieldOperations}
            </span>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left group ${
                  isActive
                    ? 'bg-[#316b00] text-white shadow-lg shadow-[#316b00]/20 font-bold'
                    : 'text-[#414939] hover:bg-[#e5e2dc] hover:text-[#1c1c18]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-[#717a68] group-hover:text-[#316b00]'
                  }`}
                />
                {!isCollapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate leading-tight">{item.label}</span>
                    <span
                      className={`text-[10px] font-normal truncate mt-0.5 ${
                        isActive ? 'text-[#d5e8c9]' : 'text-[#717a68]'
                      }`}
                    >
                      {item.sublabel}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="flex flex-col gap-1 pt-2 border-t border-[#e5e2dc]">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-[#717a68] px-2.5 uppercase tracking-wider mb-1">
              Matériel & Outils
            </span>
          )}

          <button
            onClick={() => {
              alert(
                'Télématique Machines Madagascar : 3 tracteurs autonomes connectés sur la plaine d’Ambatondrazaka. Débit CAN-bus actif.'
              );
            }}
            title={isCollapsed ? t.sidebar.machineryTelematics : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs text-[#717a68] hover:text-[#1c1c18] hover:bg-[#e5e2dc] transition-colors text-left ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Tractor className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="truncate">{t.sidebar.machineryTelematics}</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[#c3ecd2] text-[#316b00] font-bold shrink-0">
                  {t.sidebar.activeUnits}
                </span>
              </>
            )}
          </button>

          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              title={isCollapsed ? t.sidebar.generateReport : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs text-[#717a68] hover:text-[#1c1c18] hover:bg-[#e5e2dc] transition-colors text-left ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-[#316b00] shrink-0" />
              {!isCollapsed && <span className="truncate">{t.sidebar.generateReport}</span>}
            </button>
          )}
        </div>
      </div>

      {/* Footer Section (Pinned cleanly at the bottom without overflow clipping) */}
      <div className="p-2.5 border-t border-[#e5e2dc] bg-[#f0eee8] shrink-0">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-[#fcf9f3] border border-[#e5e2dc] text-[11px] text-[#717a68] flex flex-col gap-1">
            <div className="flex items-center justify-between font-bold text-[#414939]">
              <span className="truncate">{t.sidebar.systemVersion}</span>
              <span className="text-[#316b00] shrink-0">{t.sidebar.syncStatus}</span>
            </div>
            <span className="text-[10px] text-[#717a68] truncate">
              {t.sidebar.imageryCredit}
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title={`${t.sidebar.systemVersion} • ${t.sidebar.syncStatus}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#76c043] animate-pulse"></span>
          </div>
        )}
      </div>
    </aside>
  );
};

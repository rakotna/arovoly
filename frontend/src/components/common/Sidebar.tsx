import React from 'react';
import { ViewType } from '../../types';
import {
  LayoutGrid,
  Layers,
  Cpu,
  TrendingUp,
  Tractor,
  Settings,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';

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
  const navItems = [
    {
      id: 'my_fields' as ViewType,
      label: 'My Fields',
      sublabel: 'Inventaire & Santé',
      icon: LayoutGrid,
    },
    {
      id: 'vra_dashboard' as ViewType,
      label: 'VRA Fertilizer Map',
      sublabel: 'Modulation & NDVI',
      icon: Layers,
    },
    {
      id: 'soil_sensors' as ViewType,
      label: 'Soil & Sensors',
      sublabel: 'Télémétrie Racine IoT',
      icon: Cpu,
    },
    {
      id: 'yield_forecast' as ViewType,
      label: 'Yield Forecast',
      sublabel: 'Analyses IA Récolte',
      icon: TrendingUp,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 select-none">
      <div className="flex flex-col gap-6">
        {/* Sector Badge / Switcher */}
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Espace Agricole</span>
            <span className="text-xs font-bold text-white truncate max-w-[150px]">Secteur 04 • Mid-Valley</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-1">
            Opérations Terrain
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all text-left ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  <span className={`text-[10px] font-normal ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {item.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="flex flex-col gap-1 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-1">
            Matériel & Outils
          </span>

          <button
            onClick={() => {
              alert('Télématique Machines: 3 tracteurs autonomes John Deere 8RX connectés. Débit CAN-bus actif.');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
          >
            <Tractor className="w-4 h-4" />
            <span>Télématique Machines</span>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
              3 Actifs
            </span>
          </button>

          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Générer Rapport KML/SHP</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-[11px] text-slate-400 flex flex-col gap-1">
          <div className="flex items-center justify-between font-bold text-slate-300">
            <span>Agronomie IA v3.4</span>
            <span className="text-emerald-400">99.8% Sync</span>
          </div>
          <span>Imagerie: Esri World Imagery (Maxar Ready)</span>
        </div>
      </div>
    </aside>
  );
};

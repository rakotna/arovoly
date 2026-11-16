import React, { useState } from 'react';
import { X, Download, CheckCircle2, Layers } from 'lucide-react';
import { Parcel } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParcel: Parcel;
  onSuccess: (message: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  selectedParcel,
  onSuccess,
}) => {
  const { language, t } = useTranslation();
  const [format, setFormat] = useState<'shp' | 'kml' | 'geojson' | 'pdf'>('shp');
  const [includeVra, setIncludeVra] = useState(true);
  const [includeSensors, setIncludeSensors] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
      onSuccess(
        language === 'fr'
          ? `Export réussi : ${selectedParcel.name} au format .${format.toUpperCase()} téléchargé.`
          : `Export successful: ${selectedParcel.name} downloaded in .${format.toUpperCase()} format.`
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.exportModal.title}</h3>
              <p className="text-xs text-slate-500">{selectedParcel.name} • {selectedParcel.areaHa} ha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.exportModal.formatLabel}</label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'shp', label: 'Shapefile (ESRI .SHP)', desc: t.exportModal.shpDesc },
              { id: 'kml', label: 'Google Earth (.KML)', desc: t.exportModal.kmlDesc },
              { id: 'geojson', label: 'GeoJSON (.JSON)', desc: t.exportModal.geojsonDesc },
              { id: 'pdf', label: 'Rapport (.PDF)', desc: t.exportModal.pdfDesc },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormat(item.id as any)}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  format === item.id
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.label}</span>
                  {format === item.id && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-[10px] text-slate-500">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2 pt-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.exportModal.layersLabel}</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeVra}
                onChange={(e) => setIncludeVra(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>{t.exportModal.vraLayer}</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSensors}
                onChange={(e) => setIncludeSensors(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>{t.exportModal.sensorsLayer}</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            {t.common.cancel}
          </button>
          <button
            disabled={isExporting}
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {t.exportModal.exporting}
              </span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t.exportModal.downloadBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Parcel,
  CropType,
  MadagascarRegion,
  SoilType,
  IrrigationType,
} from '../../types';
import {
  PenTool,
  RotateCcw,
  Trash2,
  Save,
  MapPin,
  X,
  ChevronDown,
  Download,
  Info,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface CropTracingViewProps {
  parcels: Parcel[];
  onSaveParcel: (parcel: Parcel) => void;
  onUpdateParcel: (parcel: Parcel) => void;
  onDeleteParcel: (parcelId: string) => void;
  onShowToast: (msg: string) => void;
  onOpenExportModal: () => void;
}

// Function to calculate polygon area in hectares on the WGS84 ellipsoid
function calculatePolygonAreaHa(coords: [number, number][]): number {
  if (coords.length < 3) return 0;
  const R = 6378137; // Earth radius in meters
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const lat1 = (coords[i][0] * Math.PI) / 180;
    const lat2 = (coords[j][0] * Math.PI) / 180;
    const lon1 = (coords[i][1] * Math.PI) / 180;
    const lon2 = (coords[j][1] * Math.PI) / 180;
    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  area = Math.abs((area * R * R) / 2.0);
  return parseFloat((area / 10000).toFixed(1));
}

// Key agricultural regions in Madagascar with their center coordinates
const MADAGASCAR_REGIONS: Record<MadagascarRegion, { center: [number, number]; zoom: number; description: string }> = {
  'Alaotra-Mangoro': {
    center: [-17.832, 48.425],
    zoom: 13,
    description: "Bassin d'Ambatondrazaka • Premier grenier à riz de Madagascar",
  },
  'Vakinankaratra': {
    center: [-19.865, 47.033],
    zoom: 13,
    description: "Hauts Plateaux d'Antsirabe / Betafo • Maïs, blé, riz pluvial et maraîchage",
  },
  'Itasy': {
    center: [-19.050, 46.750],
    zoom: 13,
    description: "Plaine volcanique du Lac Itasy • Terroirs riches, manioc et haricots",
  },
  'Menabe': {
    center: [-20.290, 44.280],
    zoom: 12,
    description: "Delta du Menabe / Morondava • Sols alluviaux baiboho et canne à sucre",
  },
  'Boeny': {
    center: [-15.930, 46.620],
    zoom: 12,
    description: "Périmètre irrigué de Marovoay • Riziculture de bas-fond",
  },
  'Atsinanana': {
    center: [-18.150, 49.400],
    zoom: 12,
    description: "Bande côtière Est • Vanille, girofle, café et canne",
  },
};

export const CropTracingView: React.FC<CropTracingViewProps> = ({
  parcels,
  onSaveParcel,
  onUpdateParcel,
  onDeleteParcel,
  onShowToast,
  onOpenExportModal,
}) => {
  const { language, t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const parcelLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const drawingLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // States
  const [selectedRegion, setSelectedRegion] = useState<MadagascarRegion>('Alaotra-Mangoro');
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'ndvi' | 'hydrology' | 'elevation'>('satellite');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isParcelsListOpen, setIsParcelsListOpen] = useState(false);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(parcels[0]?.id || null);

  // Form states for creating / editing parcel
  const [formName, setFormName] = useState('');
  const [formCrop, setFormCrop] = useState<CropType>('Riz Paddy');
  const [formVariety, setFormVariety] = useState('Vary Makalioka 34');
  const [formRegion, setFormRegion] = useState<MadagascarRegion>('Alaotra-Mangoro');
  const [formSoil, setFormSoil] = useState<SoilType>('Hydromorphe (Rizière)');
  const [formIrrigation, setFormIrrigation] = useState<IrrigationType>('Système de Riziculture Intensive (SRI)');
  const [formSownDate, setFormSownDate] = useState('2024-11-20');
  const [formTargetYield, setFormTargetYield] = useState<number>(6.5);
  const [formNotes, setFormNotes] = useState('');

  // Live calculated area of the drawn polygon
  const currentAreaHa = calculatePolygonAreaHa(drawnPoints);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialRegion = MADAGASCAR_REGIONS['Alaotra-Mangoro'];
    const map = L.map(mapContainerRef.current, {
      center: initialRegion.center,
      zoom: initialRegion.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    const esriLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        attribution: '© Esri, Maxar, Earthstar Geographics, and the GIS User Community (Madagascar)',
      }
    );
    esriLayer.addTo(map);

    parcelLayerGroupRef.current = L.layerGroup().addTo(map);
    drawingLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle map click when in Drawing Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawingMode || isEditingExisting) return;
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
      setDrawnPoints((prev) => [...prev, newPoint]);
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawingMode, isEditingExisting]);

  // Render Drawn Polygon & Vertices in real time
  useEffect(() => {
    const group = drawingLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    if (drawnPoints.length === 0) return;

    // Draw markers on vertices
    drawnPoints.forEach((pt, idx) => {
      const isFirst = idx === 0;
      const markerHtml = `
        <div class="w-4 h-4 rounded-full ${isFirst ? 'bg-amber-400 ring-4 ring-amber-300/50' : 'bg-emerald-500 ring-2 ring-white'} shadow-md flex items-center justify-center text-[9px] font-bold text-slate-900 cursor-pointer">
          ${idx + 1}
        </div>
      `;
      const icon = L.divIcon({
        html: markerHtml,
        className: 'vertex-pin',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const marker = L.marker(pt, { icon, draggable: isEditingExisting });
      if (isEditingExisting) {
        marker.on('dragend', (event) => {
          const position = event.target.getLatLng();
          setDrawnPoints((previous) => previous.map((point, pointIndex) =>
            pointIndex === idx ? [position.lat, position.lng] : point
          ));
        });
      }
      group.addLayer(marker);
    });

    // Draw line or polygon preview
    if (drawnPoints.length >= 3) {
      const poly = L.polygon(drawnPoints, {
        color: '#10b981',
        weight: 3,
        dashArray: '4, 4',
        fillColor: '#34d399',
        fillOpacity: 0.35,
      });
      group.addLayer(poly);
    } else if (drawnPoints.length === 2) {
      const line = L.polyline(drawnPoints, {
        color: '#10b981',
        weight: 3,
        dashArray: '4, 4',
      });
      group.addLayer(line);
    }
  }, [drawnPoints, isEditingExisting]);

  // Render Saved Parcels
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = parcelLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    parcels.forEach((p) => {
      const isSelected = p.id === selectedParcelId;

      let strokeColor = p.color;
      let fillColor = p.fillColor;
      let fillOpacity = isSelected ? 0.45 : 0.25;

      if (activeLayer === 'ndvi') {
        strokeColor = p.ndvi > 0.75 ? '#10b981' : p.ndvi > 0.65 ? '#f59e0b' : '#ea580c';
        fillColor = strokeColor;
        fillOpacity = isSelected ? 0.5 : 0.32;
      } else if (activeLayer === 'hydrology') {
        strokeColor = '#0284c7';
        fillColor = '#38bdf8';
        fillOpacity = (p.moisturePct / 100) * 0.55;
      } else if (activeLayer === 'elevation') {
        strokeColor = '#d97706';
        fillColor = '#fde68a';
        fillOpacity = 0.35;
      }

      const polygon = L.polygon(p.coordinates, {
        color: strokeColor,
        weight: isSelected ? 3.5 : 2,
        dashArray: isSelected ? undefined : '5, 5',
        fillColor: fillColor,
        fillOpacity: fillOpacity,
      });

      polygon.bindTooltip(
        `<div class="font-sans px-2.5 py-1 text-xs">
          <div class="font-bold text-slate-900">${p.name}</div>
          <div class="text-slate-600">${p.crop} (${p.variety}) • <b>${p.areaHa} ha</b></div>
          <div class="text-emerald-700 font-semibold mt-0.5">${p.soilType || 'Sol alluvial'} • SRI</div>
        </div>`,
        { sticky: true, className: 'rounded-xl shadow-lg border border-slate-200' }
      );

      polygon.on('click', () => {
        setSelectedParcelId(p.id);
        setIsPanelOpen(true);
      });

      group.addLayer(polygon);
    });
  }, [parcels, selectedParcelId, activeLayer]);

  // Fly to region when region selector changes
  const handleRegionChange = (region: MadagascarRegion) => {
    setSelectedRegion(region);
    setFormRegion(region);
    const target = MADAGASCAR_REGIONS[region];
    mapInstanceRef.current?.flyTo(target.center, target.zoom, { duration: 1.5 });
    onShowToast(language === 'fr' ? `Centrage sur la région agricole : ${region}` : `Centered on region: ${region}`);
  };

  const handleStartDrawing = () => {
    setIsDrawingMode(true);
    setIsEditingExisting(false);
    setDrawnPoints([]);
    setSelectedParcelId(null);
    setIsPanelOpen(true);
    setFormName(language === 'fr' ? `Parcelle #${Math.floor(100 + Math.random() * 900)} • ${selectedRegion}` : `Parcel #${Math.floor(100 + Math.random() * 900)} • ${selectedRegion}`);
    onShowToast(language === 'fr' ? 'Mode Tracé activé : Cliquez sur la carte satellite pour placer les sommets de la parcelle.' : 'Tracing mode active: Click on satellite map to place parcel vertices.');
  };

  const handleStartEditing = () => {
    if (!selectedParcel) return;
    setIsEditingExisting(true);
    setIsDrawingMode(true);
    setDrawnPoints(selectedParcel.coordinates);
    setFormName(selectedParcel.name);
    setFormCrop(selectedParcel.crop);
    setFormVariety(selectedParcel.variety);
    setFormRegion(selectedParcel.region);
    setFormSoil(selectedParcel.soilType || 'Hydromorphe (Rizière)');
    setFormIrrigation(selectedParcel.irrigationType || 'Système de Riziculture Intensive (SRI)');
    setFormSownDate(selectedParcel.sownDate);
    setFormTargetYield(selectedParcel.targetYieldTha);
    setFormNotes(selectedParcel.notes || '');
    setIsPanelOpen(true);
    onShowToast(language === 'fr' ? 'Mode édition activé : déplacez les sommets de la parcelle.' : 'Edit mode active: drag the parcel vertices.');
  };

  const handleUndoPoint = () => {
    setDrawnPoints((prev) => prev.slice(0, -1));
  };

  const handleClearDrawing = () => {
    setDrawnPoints([]);
    onShowToast(language === 'fr' ? 'Tracé réinitialisé.' : 'Tracing reset.');
  };

  const handleCancelDrawing = () => {
    setIsDrawingMode(false);
    setIsEditingExisting(false);
    setDrawnPoints([]);
    onShowToast(language === 'fr' ? 'Mode Tracé annulé.' : 'Tracing canceled.');
  };

  const handleSaveDrawnParcel = (e: React.FormEvent) => {
    e.preventDefault();

    if (drawnPoints.length < 3) {
      alert(language === 'fr' ? 'Veuillez tracer au moins 3 points sur la carte pour former un polygone de parcelle.' : 'Please trace at least 3 points on the map to create a parcel polygon.');
      return;
    }

    // Compute center
    const avgLat = drawnPoints.reduce((acc, p) => acc + p[0], 0) / drawnPoints.length;
    const avgLng = drawnPoints.reduce((acc, p) => acc + p[1], 0) / drawnPoints.length;

    if (isEditingExisting && selectedParcel) {
      onUpdateParcel({
        ...selectedParcel,
        name: formName || selectedParcel.name,
        crop: formCrop,
        variety: formVariety,
        region: formRegion,
        soilType: formSoil,
        irrigationType: formIrrigation,
        sownDate: formSownDate,
        targetYieldTha: formTargetYield,
        estYieldTha: formTargetYield,
        areaHa: currentAreaHa,
        coordinates: drawnPoints,
        center: [avgLat, avgLng],
        notes: formNotes,
      });
      setIsDrawingMode(false);
      setIsEditingExisting(false);
      setDrawnPoints([]);
      onShowToast(language === 'fr' ? `Parcelle ${formName} mise à jour.` : `Parcel ${formName} updated.`);
      return;
    }

    const newParcel: Parcel = {
      id: `parcel-mg-${Date.now()}`,
      code: `#${Math.floor(100 + Math.random() * 900)}`,
      name: formName || `Parcelle ${formCrop} ${selectedRegion}`,
      region: formRegion,
      crop: formCrop,
      variety: formVariety,
      areaHa: currentAreaHa > 0 ? currentAreaHa : 15.0,
      sownDate: formSownDate,
      status: 'Optimal',
      soilType: formSoil,
      irrigationType: formIrrigation,
      ndvi: 0.78,
      ndviTrend: '+0.03 (Nouveau tracé)',
      moisturePct: 39,
      targetYieldTha: formTargetYield,
      estYieldTha: formTargetYield,
      section: `Secteur ${formRegion} - Casier ${Math.floor(1 + Math.random() * 20)}`,
      urgentAction: language === 'fr' ? 'Parcelle tracée • Relevé multispectral Sentinel-2 synchronisé' : 'Parcel traced • Sentinel-2 multispectral sync active',
      coordinates: drawnPoints,
      center: [avgLat, avgLng],
      color: '#059669',
      fillColor: '#10b981',
      notes: formNotes,
    };

    onSaveParcel(newParcel);
    setSelectedParcelId(newParcel.id);
    setIsDrawingMode(false);
    setDrawnPoints([]);
    onShowToast(language === 'fr' ? `Parcelle ${newParcel.name} (${newParcel.areaHa} ha) enregistrée avec succès dans le registre !` : `Parcel ${newParcel.name} (${newParcel.areaHa} ha) successfully saved to registry!`);
  };

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#fcf9f3] select-none">
      {/* Fullscreen Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Command Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Brand Badge & Region Switcher */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#fcf9f3]/95 backdrop-blur-xl border border-[#e5e2dc] p-2 rounded-2xl shadow-2xl text-[#1c1c18]">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#c3ecd2] border border-[#a8d0b7] rounded-xl text-[#316b00] font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-[#76c043] animate-pulse"></span>
            <span>{t.cropTracing.badge}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2">
            <MapPin className="w-3.5 h-3.5 text-[#316b00]" />
            <select
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value as MadagascarRegion)}
              className="bg-[#f0eee8] text-[#1c1c18] font-bold text-xs rounded-xl px-2.5 py-1.5 border border-[#e5e2dc] focus:ring-1 focus:ring-[#76c043] outline-none"
            >
              {Object.keys(MADAGASCAR_REGIONS).map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Drawing Mode Trigger */}
        <div className="pointer-events-auto flex items-center gap-2">
          {!isDrawingMode ? (
            <button
              onClick={handleStartDrawing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#76c043] hover:bg-[#316b00] text-white font-bold text-xs shadow-xl shadow-[#316b00]/20 transition-transform hover:scale-105"
            >
              <PenTool className="w-4 h-4" />
              <span>{t.cropTracing.startDrawing}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#fcf9f3]/95 backdrop-blur-xl border border-[#a8d0b7] p-1.5 rounded-full shadow-2xl">
              <span className="px-3 py-1 text-xs font-bold text-[#316b00] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#76c043] animate-ping"></span>
                {drawnPoints.length} {t.cropTracing.verticesLabel} • {currentAreaHa} ha
              </span>

              <button
                onClick={handleUndoPoint}
                disabled={drawnPoints.length === 0}
                className="p-2 rounded-full bg-[#f0eee8] hover:bg-[#e5e2dc] text-[#414939] disabled:opacity-40 transition-colors"
                title={t.cropTracing.undo}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClearDrawing}
                disabled={drawnPoints.length === 0}
                className="p-2 rounded-full bg-[#f0eee8] hover:bg-[#e5e2dc] text-[#ba1a1a] disabled:opacity-40 transition-colors"
                title={t.cropTracing.clear}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCancelDrawing}
                className="px-3 py-1.5 rounded-full bg-[#f0eee8] hover:bg-[#e5e2dc] text-xs font-semibold text-[#414939] transition-colors"
              >
                {t.cropTracing.quit}
              </button>
            </div>
          )}
        </div>

        {/* Right: Layer Switcher & Parcel List Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center bg-[#fcf9f3]/95 backdrop-blur-xl border border-[#e5e2dc] p-1 rounded-full shadow-2xl text-[#1c1c18]">
            <button
              onClick={() => setActiveLayer('satellite')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeLayer === 'satellite' ? 'bg-[#316b00] text-white shadow-sm' : 'text-[#717a68] hover:text-[#1c1c18]'
              }`}
            >
              {t.common.satellite}
            </button>
            <button
              onClick={() => setActiveLayer('ndvi')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeLayer === 'ndvi' ? 'bg-[#316b00] text-white shadow-sm' : 'text-[#717a68] hover:text-[#1c1c18]'
              }`}
            >
              NDVI
            </button>
            <button
              onClick={() => setActiveLayer('hydrology')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeLayer === 'hydrology' ? 'bg-[#316b00] text-white shadow-sm' : 'text-[#717a68] hover:text-[#1c1c18]'
              }`}
            >
              {t.cropTracing.waterNetwork}
            </button>
            <button
              onClick={() => setActiveLayer('elevation')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeLayer === 'elevation' ? 'bg-[#316b00] text-white shadow-sm' : 'text-[#717a68] hover:text-[#1c1c18]'
              }`}
            >
              {t.cropTracing.relief}
            </button>
          </div>

          <button
            onClick={() => setIsParcelsListOpen(!isParcelsListOpen)}
            className="px-3.5 py-2 rounded-full bg-[#fcf9f3]/95 backdrop-blur-xl border border-[#e5e2dc] text-xs font-bold text-[#316b00] shadow-2xl hover:bg-[#f0eee8] flex items-center gap-1.5"
          >
            <span>{t.cropTracing.parcelsBtn} ({parcels.length})</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isParcelsListOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Floating Parcels Portfolio Drawer */}
      {isParcelsListOpen && (
        <div className="absolute top-20 right-4 z-[400] w-80 max-h-[500px] overflow-y-auto rounded-3xl bg-[#fcf9f3]/95 backdrop-blur-2xl border border-[#e5e2dc] p-4 shadow-2xl text-[#1c1c18] flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#e5e2dc]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#316b00]">
              {t.cropTracing.registryTitle} ({parcels.length})
            </span>
            <button
              onClick={() => setIsParcelsListOpen(false)}
              className="text-[#717a68] hover:text-[#1c1c18] text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {parcels.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedParcelId(p.id);
                  mapInstanceRef.current?.flyTo(p.center, 14);
                  setIsPanelOpen(true);
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  p.id === selectedParcelId
                    ? 'border-[#a8d0b7] bg-[#c3ecd2]'
                    : 'border-[#e5e2dc] bg-[#f0eee8] hover:bg-[#e5e2dc]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1c1c18]">{p.name}</span>
                  <span className="text-xs font-extrabold text-[#316b00]">{p.areaHa} ha</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#717a68] mt-1">
                  <span>{p.crop} ({p.variety})</span>
                  <span>NDVI : <b>{p.ndvi}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Info Cluster (GPS Madagascar) */}
      <div className="absolute bottom-4 right-4 z-[400] flex items-center gap-3">
        <div className="bg-[#fcf9f3]/95 backdrop-blur-xl border border-[#e5e2dc] text-[#1c1c18] rounded-full px-4 py-2 shadow-2xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[#316b00] text-[18px]">explore</span>
          <span className="text-xs font-semibold font-mono tracking-wide text-[#414939]">
            17°49'S, 48°25'E • Ambatondrazaka (Madagascar)
          </span>
        </div>

        <div className="flex items-center bg-[#fcf9f3]/95 backdrop-blur-xl border border-[#e5e2dc] rounded-full shadow-2xl p-1 text-[#316b00]">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#c3ecd2] rounded-full transition-colors font-bold"
            title="Zoom in"
          >
            +
          </button>
          <div className="w-px h-4 bg-[#e5e2dc]"></div>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#c3ecd2] rounded-full transition-colors font-bold"
            title="Zoom out"
          >
            −
          </button>
        </div>
      </div>

      {/* Floating Left Panel: Drawing / Selected Parcel Inspector */}
      {isPanelOpen && (
        <div className="absolute top-20 left-4 z-[400] w-96 max-h-[calc(100vh-110px)] overflow-y-auto rounded-3xl bg-[#fcf9f3]/95 backdrop-blur-2xl border border-[#e5e2dc] p-5 shadow-2xl text-[#1c1c18] flex flex-col gap-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e2dc]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#c3ecd2] text-[#316b00] flex items-center justify-center">
                <PenTool className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#316b00]">
                {isDrawingMode
                  ? isEditingExisting
                    ? (language === 'fr' ? 'Modifier la géométrie' : 'Edit geometry')
                    : t.cropTracing.drawingHeader
                  : t.cropTracing.inspectorHeader}
              </h3>
            </div>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="p-1 rounded-lg text-[#717a68] hover:text-[#1c1c18] hover:bg-[#e5e2dc]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form for Drawing Mode or View Mode */}
          {isDrawingMode ? (
            <form onSubmit={handleSaveDrawnParcel} className="flex flex-col gap-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-[#c3ecd2] border border-[#a8d0b7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#316b00] font-bold uppercase block">{t.cropTracing.calculatedArea}</span>
                  <span className="text-2xl font-extrabold text-[#1c1c18] font-heading">{currentAreaHa} ha</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#fcf9f3] text-[#316b00] border border-[#a8d0b7]">
                  {drawnPoints.length} {t.cropTracing.verticesLabel}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#414939]">{t.cropTracing.parcelName}</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-[#d9d6ce] text-[#1c1c18] placeholder-[#9a9d92] focus:outline-none focus:ring-1 focus:ring-[#76c043]"
                  placeholder={t.cropTracing.parcelPlaceholder}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#414939]">{t.cropTracing.targetCrop}</label>
                  <select
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value as CropType)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-[#d9d6ce] text-[#1c1c18]"
                  >
                    <option value="Riz Paddy">Riz Paddy (Vary)</option>
                    <option value="Maïs">Maïs Grain</option>
                    <option value="Manioc">Manioc</option>
                    <option value="Soja">Soja</option>
                    <option value="Canne à sucre">Canne à sucre</option>
                    <option value="Haricot">Haricot (Lingot)</option>
                    <option value="Vanille">Vanille</option>
                    <option value="Café">Café</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#414939]">{t.cropTracing.variety}</label>
                  <input
                    type="text"
                    value={formVariety}
                    onChange={(e) => setFormVariety(e.target.value)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-[#d9d6ce] text-[#1c1c18]"
                    placeholder={t.cropTracing.varietyPlaceholder}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#414939]">{t.cropTracing.soilType}</label>
                  <select
                    value={formSoil}
                    onChange={(e) => setFormSoil(e.target.value as SoilType)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-[#d9d6ce] text-[#1c1c18] text-[11px]"
                  >
                    <option value="Hydromorphe (Rizière)">Hydromorphe (Rizière)</option>
                    <option value="Alluvial (Baiboho)">Alluvial (Baiboho)</option>
                    <option value="Latéritique / Ferrallitique (Tanety)">Latéritique (Tanety)</option>
                    <option value="Volcanique">Volcanique</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#414939]">{t.cropTracing.irrigation}</label>
                  <select
                    value={formIrrigation}
                    onChange={(e) => setFormIrrigation(e.target.value as IrrigationType)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-[#d9d6ce] text-[#1c1c18] text-[11px]"
                  >
                    <option value="Système de Riziculture Intensive (SRI)">SRI (Intensif)</option>
                    <option value="Gravitaire (Rizière inondée)">Gravitaire inondé</option>
                    <option value="Pluvial strict">Pluvial strict</option>
                    <option value="Goutte-à-goutte">Goutte-à-goutte</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#414939]">{t.cropTracing.sownDate}</label>
                <input
                  type="date"
                  value={formSownDate}
                  onChange={(e) => setFormSownDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-[#d9d6ce] text-[#1c1c18]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#414939]">{t.cropTracing.targetYield}</label>
                <input
                  type="number"
                  step="0.1"
                  value={formTargetYield}
                  onChange={(e) => setFormTargetYield(parseFloat(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-white border border-[#d9d6ce] text-[#1c1c18]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#414939]">{t.cropTracing.notes}</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-[#d9d6ce] text-[#1c1c18] placeholder-[#9a9d92]"
                  placeholder={t.cropTracing.notesPlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={drawnPoints.length < 3}
                className="mt-2 w-full py-3 px-4 rounded-2xl bg-[#316b00] hover:bg-[#244f00] font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{t.cropTracing.saveParcel}</span>
              </button>
            </form>
          ) : selectedParcel ? (
            /* Selected Parcel Inspector */
            <div className="flex flex-col gap-3.5 text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-[#1c1c18] font-heading">{selectedParcel.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c3ecd2] text-[#316b00] border border-[#a8d0b7] text-[10px] font-bold">
                    {selectedParcel.status}
                  </span>
                </div>
                <span className="text-[11px] text-[#717a68] mt-0.5 block">
                  {selectedParcel.region} • {selectedParcel.section}
                </span>
              </div>

              {/* Surface & Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-2xl bg-[#f0eee8] border border-[#e5e2dc] text-center">
                  <span className="text-[10px] text-[#717a68] uppercase block">{t.common.surface}</span>
                  <span className="text-base font-extrabold text-[#1c1c18]">{selectedParcel.areaHa} ha</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#f0eee8] border border-[#e5e2dc] text-center">
                  <span className="text-[10px] text-[#717a68] uppercase block">NDVI</span>
                  <span className="text-base font-extrabold text-[#316b00]">{selectedParcel.ndvi}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#f0eee8] border border-[#e5e2dc] text-center">
                  <span className="text-[10px] text-[#717a68] uppercase block">{t.myFields.estYield}</span>
                  <span className="text-base font-extrabold text-[#9a6500]">{selectedParcel.estYieldTha} t/ha</span>
                </div>
              </div>

              {/* Agronomic Details */}
              <div className="p-3 rounded-2xl bg-[#f0eee8] border border-[#e5e2dc] flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-[#717a68]">{t.common.crop} & {t.common.variety} :</span>
                  <span className="font-bold text-[#1c1c18]">{selectedParcel.crop} ({selectedParcel.variety})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717a68]">{t.cropTracing.soilType} :</span>
                  <span className="text-[#1c1c18]">{selectedParcel.soilType || 'Alluvial Baiboho'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717a68]">{t.cropTracing.irrigation} :</span>
                  <span className="text-[#1c1c18]">{selectedParcel.irrigationType || 'SRI'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717a68]">{t.cropTracing.sownDate} :</span>
                  <span className="text-[#1c1c18]">{selectedParcel.sownDate}</span>
                </div>
              </div>

              {/* Status or Alert */}
              {selectedParcel.healthAlert && (
                <div className="p-3 rounded-2xl bg-[#fff1d6] border border-[#e5b567] text-[#7a4b00] flex flex-col gap-1">
                  <span className="font-bold">{selectedParcel.healthAlert}</span>
                  <p className="text-[11px] text-[#9a6500] leading-relaxed">{selectedParcel.healthAlertDetail}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleStartEditing}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#c3ecd2] hover:bg-[#a8d0b7] text-[#245100] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Éditer' : 'Edit'}</span>
                </button>
                <button
                  onClick={onOpenExportModal}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#f0eee8] hover:bg-[#e5e2dc] text-[#414939] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#316b00]" />
                  <span>{t.cropTracing.exportGis}</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(language === 'fr' ? `Supprimer la parcelle ${selectedParcel.name} ?` : `Delete parcel ${selectedParcel.name}?`)) {
                      onDeleteParcel(selectedParcel.id);
                      setSelectedParcelId(null);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-[#ffe1df] hover:bg-[#ffc9c5] text-[#ba1a1a] border border-[#f0aaa5] transition-colors"
                  title={t.cropTracing.deleteParcel}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <Info className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-80" />
              <p className="text-xs">{t.cropTracing.clickInstruction}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

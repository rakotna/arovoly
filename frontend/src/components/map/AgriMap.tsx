import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Parcel, SensorProbe } from '../../types';

interface AgriMapProps {
  parcels: Parcel[];
  selectedParcelId: string;
  onSelectParcel: (parcelId: string) => void;
  sensors?: SensorProbe[];
  activeLayer?: 'satellite' | 'ndvi' | 'hydrology' | 'elevation' | 'vra';
  showSensors?: boolean;
  className?: string;
}

export const AgriMap: React.FC<AgriMapProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  sensors = [],
  activeLayer = 'ndvi',
  showSensors = true,
  className = 'w-full h-full min-h-[500px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsGroupRef = useRef<L.LayerGroup | null>(null);
  const sensorsGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center on agricultural zone in Madagascar (Ambatondrazaka / Lac Alaotra)
    const map = L.map(mapContainerRef.current, {
      center: [-17.832, 48.425],
      zoom: 13,
      zoomControl: false, // We render custom glassmorphic zoom buttons
      attributionControl: true,
    });

    // Esri World Imagery (Standard satellite tiles)
    const esriTileLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        attribution: '© Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      }
    );

    esriTileLayer.addTo(map);

    polygonsGroupRef.current = L.layerGroup().addTo(map);
    sensorsGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Parcels and polygons when selection or layer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = polygonsGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    parcels.forEach((p) => {
      const isSelected = p.id === selectedParcelId;

      // Color scheme based on active layer
      let strokeColor = p.color;
      let fillColor = p.fillColor;
      let fillOpacity = isSelected ? 0.45 : 0.25;

      if (activeLayer === 'ndvi') {
        // High NDVI = deep green, Low = amber/red
        strokeColor = p.ndvi > 0.75 ? '#10b981' : p.ndvi > 0.65 ? '#f59e0b' : '#ea580c';
        fillColor = strokeColor;
        fillOpacity = isSelected ? 0.5 : 0.32;
      } else if (activeLayer === 'hydrology') {
        strokeColor = '#0284c7';
        fillColor = '#38bdf8';
        fillOpacity = (p.moisturePct / 100) * 0.6;
      } else if (activeLayer === 'elevation') {
        strokeColor = '#d97706';
        fillColor = '#fde68a';
        fillOpacity = 0.35;
      } else if (activeLayer === 'vra') {
        strokeColor = p.id === '208-highland' ? '#ea580c' : '#059669';
        fillColor = p.id === '208-highland' ? '#fd651e' : '#10b981';
        fillOpacity = 0.4;
      }

      const polygon = L.polygon(p.coordinates, {
        color: strokeColor,
        weight: isSelected ? 3.5 : 2,
        dashArray: isSelected ? undefined : '6, 6',
        fillColor: fillColor,
        fillOpacity: fillOpacity,
      });

      // Custom HTML Tooltip
      polygon.bindTooltip(
        `<div class="font-sans px-2 py-1 text-xs font-semibold">
          <div class="font-bold text-slate-900">${p.name}</div>
          <div class="text-slate-600">${p.crop} • ${p.areaHa} ha • NDVI: <span class="font-bold text-emerald-700">${p.ndvi}</span></div>
        </div>`,
        { sticky: true, opacity: 0.95, className: 'rounded-xl shadow-md border border-slate-200' }
      );

      polygon.on('click', () => {
        onSelectParcel(p.id);
      });

      group.addLayer(polygon);
    });

    // If selected parcel exists, pan smoothly to it
    const selected = parcels.find((p) => p.id === selectedParcelId);
    if (selected) {
      map.flyTo(selected.center, 13.5, { duration: 1.2 });
    }
  }, [parcels, selectedParcelId, activeLayer, onSelectParcel]);

  // Update Sensors markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const sGroup = sensorsGroupRef.current;
    if (!map || !sGroup) return;

    sGroup.clearLayers();

    if (!showSensors) return;

    sensors.forEach((s) => {
      const isWarning = s.status === 'Warning';
      const markerHtml = `
        <div class="relative group cursor-pointer">
          <div class="w-7 h-7 rounded-full ${isWarning ? 'bg-amber-500' : 'bg-emerald-600'} border-2 border-white shadow-lg flex items-center justify-center text-white text-[11px] font-bold">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isWarning ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75"></span>
            ${s.stationCode.slice(-2)}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-sensor-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([s.lat, s.lng], { icon: customIcon });

      marker.bindPopup(`
        <div class="p-2 min-w-[200px] text-xs font-sans">
          <div class="font-bold text-slate-900 text-sm mb-1">${s.name} (${s.stationCode})</div>
          <div class="text-slate-500 mb-2">${s.parcelName}</div>
          <div class="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200 mb-2">
            <div><span class="text-slate-400">10cm :</span> <b>${s.moisture10cm}%</b></div>
            <div><span class="text-slate-400">30cm :</span> <b>${s.moisture30cm}%</b></div>
            <div><span class="text-slate-400">60cm :</span> <b>${s.moisture60cm}%</b></div>
            <div><span class="text-slate-400">Temp :</span> <b>${s.temperatureC}°C</b></div>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-500">
            <span>Batterie: <b>${s.batteryPct}%</b></span>
            <span>Signal: <b>${s.signalDbm} dBm</b></span>
          </div>
        </div>
      `);

      sGroup.addLayer(marker);
    });
  }, [sensors, showSensors]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([-17.832, 48.425], 13);
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 ${className}`}>
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Floating Zoom & Controls */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        <div className="flex flex-col rounded-2xl bg-[#fcf9f3]/95 backdrop-blur-md shadow-lg border border-[#e5e2dc] overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center text-[#316b00] hover:bg-[#c3ecd2] transition-colors font-bold text-lg"
            title="Zoom avant"
          >
            +
          </button>
          <div className="h-[1px] bg-[#e5e2dc]"></div>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center text-[#316b00] hover:bg-[#c3ecd2] transition-colors font-bold text-lg"
            title="Zoom arrière"
          >
            −
          </button>
        </div>

        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-2xl bg-[#fcf9f3]/95 backdrop-blur-md shadow-lg border border-[#e5e2dc] flex items-center justify-center text-[#316b00] hover:bg-[#c3ecd2] transition-colors"
          title="Recentrer le secteur"
        >
          <svg className="w-5 h-5 text-[#316b00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
};

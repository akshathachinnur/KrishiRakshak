import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Locate,
  Cloud,
  Store,
  AlertTriangle,
  Sprout,
  Info,
} from 'lucide-react';

interface FarmMapProps {
  farmProfile?: { latitude: number; longitude: number; farmName?: string } | null;
}

// Sample marker data for demonstration
const SAMPLE_MARKERS = {
  mandis: [
    { lat: 15.3647, lng: 75.1240, name: 'Dharwad APMC Mandi', info: 'Soybean ₹4,200/qtl' },
    { lat: 15.4389, lng: 75.0210, name: 'Hubli Market Yard', info: 'Jowar ₹2,850/qtl' },
    { lat: 15.2832, lng: 75.2100, name: 'Kundgol Mandi', info: 'Groundnut ₹5,100/qtl' },
  ],
  weather: [
    { lat: 15.3900, lng: 75.0500, name: 'Dharwad AWS', info: '28°C, Partly Cloudy' },
    { lat: 15.3200, lng: 75.1800, name: 'Navalgund Station', info: '31°C, Clear Sky' },
  ],
  diseaseAlerts: [
    { lat: 15.3500, lng: 75.1000, name: 'Fall Armyworm Alert', info: 'Maize fields affected — 2km radius' },
    { lat: 15.4100, lng: 75.1500, name: 'Leaf Blight Alert', info: 'Soybean plots — moderate severity' },
  ],
};

type MarkerLayer = 'mandis' | 'weather' | 'diseaseAlerts';

export const FarmMap: React.FC<FarmMapProps> = ({ farmProfile }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeLayers, setActiveLayers] = useState<Set<MarkerLayer>>(new Set(['mandis', 'weather', 'diseaseAlerts']));
  const [selectedMarker, setSelectedMarker] = useState<{ name: string; info: string; type: string } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: farmProfile?.latitude || 15.3647, lng: farmProfile?.longitude || 75.1240 });
  const [zoom, setZoom] = useState(12);
  const [isLocating, setIsLocating] = useState(false);

  // Get user's current location
  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
          setZoom(14);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
          alert('Location access denied. Please enable location permissions.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const toggleLayer = (layer: MarkerLayer) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'mandis': return 'bg-amber-500 border-amber-300';
      case 'weather': return 'bg-emerald-500 border-emerald-300';
      case 'diseaseAlerts': return 'bg-red-500 border-red-300';
      case 'farm': return 'bg-blue-500 border-blue-300';
      default: return 'bg-slate-500 border-slate-300';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'mandis': return <Store className="w-3 h-3 text-white" />;
      case 'weather': return <Cloud className="w-3 h-3 text-white" />;
      case 'diseaseAlerts': return <AlertTriangle className="w-3 h-3 text-white" />;
      case 'farm': return <Sprout className="w-3 h-3 text-white" />;
      default: return <MapPin className="w-3 h-3 text-white" />;
    }
  };

  // Convert lat/lng to pixel position on the static map view
  const getPixelPos = (lat: number, lng: number, containerWidth: number, containerHeight: number) => {
    const latRange = 0.2 / Math.pow(2, zoom - 12);
    const lngRange = 0.3 / Math.pow(2, zoom - 12);
    const x = ((lng - mapCenter.lng + lngRange) / (2 * lngRange)) * containerWidth;
    const y = ((mapCenter.lat + latRange - lat) / (2 * latRange)) * containerHeight;
    return { x: Math.max(0, Math.min(containerWidth, x)), y: Math.max(0, Math.min(containerHeight, y)) };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Farm Map
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Interactive map with mandis, weather stations & disease alerts near you
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white dark:bg-[#0c1611] rounded-3xl border border-slate-200 dark:border-[#1b3d26] shadow-xl overflow-hidden">
        {/* Map Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-50 dark:bg-[#0a180f] border-b border-slate-200 dark:border-[#1b3d26]">
          {/* Layer Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Layers:
            </span>
            {([
              { key: 'mandis' as MarkerLayer, label: 'Mandis', color: 'amber', icon: Store },
              { key: 'weather' as MarkerLayer, label: 'Weather', color: 'emerald', icon: Cloud },
              { key: 'diseaseAlerts' as MarkerLayer, label: 'Disease Alerts', color: 'red', icon: AlertTriangle },
            ]).map(({ key, label, color, icon: Icon }) => (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  activeLayers.has(key)
                    ? `bg-${color}-100 dark:bg-${color}-950 text-${color}-800 dark:text-${color}-300 border-${color}-300 dark:border-${color}-700 shadow-sm`
                    : 'bg-slate-100 dark:bg-[#14201a] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-[#1b3d26]'
                }`}
                style={activeLayers.has(key) ? {
                  backgroundColor: color === 'amber' ? '#fef3c7' : color === 'emerald' ? '#d1fae5' : '#fee2e2',
                  color: color === 'amber' ? '#92400e' : color === 'emerald' ? '#065f46' : '#991b1b',
                  borderColor: color === 'amber' ? '#fcd34d' : color === 'emerald' ? '#6ee7b7' : '#fca5a5',
                } : {}}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Locating...' : 'My Location'}
            </button>
            <div className="flex items-center rounded-lg overflow-hidden border border-slate-200 dark:border-[#1b3d26]">
              <button
                onClick={() => setZoom((z) => Math.max(8, z - 1))}
                className="p-1.5 bg-white dark:bg-[#14201a] hover:bg-slate-100 dark:hover:bg-[#1c2e22] transition cursor-pointer"
              >
                <ZoomOut className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
              <span className="px-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#14201a] select-none">{zoom}x</span>
              <button
                onClick={() => setZoom((z) => Math.min(18, z + 1))}
                className="p-1.5 bg-white dark:bg-[#14201a] hover:bg-slate-100 dark:hover:bg-[#1c2e22] transition cursor-pointer"
              >
                <ZoomIn className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Map View — Using OpenStreetMap tiles via iframe */}
        <div ref={mapRef} className="relative w-full" style={{ height: '520px' }}>
          {/* OSM Tile Background */}
          <iframe
            title="Farm Map"
            className="absolute inset-0 w-full h-full border-0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.15 / Math.pow(2, zoom - 12)}%2C${mapCenter.lat - 0.1 / Math.pow(2, zoom - 12)}%2C${mapCenter.lng + 0.15 / Math.pow(2, zoom - 12)}%2C${mapCenter.lat + 0.1 / Math.pow(2, zoom - 12)}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`}
          />

          {/* Overlay Markers */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Farm Location Marker */}
            {farmProfile && (
              <div
                className="absolute pointer-events-auto cursor-pointer z-10 group"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -100%)' }}
                onClick={() => setSelectedMarker({ name: farmProfile.farmName || 'My Farm', info: `${farmProfile.latitude.toFixed(4)}°N, ${farmProfile.longitude.toFixed(4)}°E`, type: 'farm' })}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                    <Sprout className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rotate-45"></div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {farmProfile.farmName || 'My Farm'}
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-[#0c1611]/95 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-[#1b3d26] p-3 shadow-lg z-20">
            <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Legend</div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><Sprout className="w-2.5 h-2.5 text-white" /></div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Your Farm</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center"><Store className="w-2.5 h-2.5 text-white" /></div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Mandi / Market</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Cloud className="w-2.5 h-2.5 text-white" /></div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Weather Station</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><AlertTriangle className="w-2.5 h-2.5 text-white" /></div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Disease Alert</span>
              </div>
            </div>
          </div>

          {/* Zoom info */}
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-[#0c1611]/95 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-[#1b3d26] px-3 py-2 shadow-lg z-20">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              {mapCenter.lat.toFixed(4)}°N, {mapCenter.lng.toFixed(4)}°E
            </div>
          </div>
        </div>

        {/* Selected Marker Info Panel */}
        {selectedMarker && (
          <div className="px-4 py-3 bg-emerald-50 dark:bg-[#0f1f16] border-t border-emerald-200 dark:border-[#1b3d26] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${getMarkerColor(selectedMarker.type)} flex items-center justify-center shadow`}>
                {getMarkerIcon(selectedMarker.type)}
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{selectedMarker.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedMarker.info}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        )}

        {/* Nearby Points Quick Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-slate-200 dark:border-[#1b3d26]">
          <div className="flex items-center gap-3 px-5 py-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-[#1b3d26]">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <Store className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Nearby Mandis</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{SAMPLE_MARKERS.mandis.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-[#1b3d26]">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Weather Stations</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{SAMPLE_MARKERS.weather.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-700 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Disease Alerts</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{SAMPLE_MARKERS.diseaseAlerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Places Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_MARKERS.mandis.map((m, i) => (
          <div key={`mandi-${i}`} className="bg-white dark:bg-[#0c1611] rounded-2xl border border-slate-200 dark:border-[#1b3d26] p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                <Store className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{m.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{m.info}</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">{m.lat.toFixed(4)}°N, {m.lng.toFixed(4)}°E</div>
          </div>
        ))}
        {SAMPLE_MARKERS.weather.map((w, i) => (
          <div key={`weather-${i}`} className="bg-white dark:bg-[#0c1611] rounded-2xl border border-slate-200 dark:border-[#1b3d26] p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{w.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{w.info}</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">{w.lat.toFixed(4)}°N, {w.lng.toFixed(4)}°E</div>
          </div>
        ))}
        {SAMPLE_MARKERS.diseaseAlerts.map((d, i) => (
          <div key={`alert-${i}`} className="bg-white dark:bg-[#0c1611] rounded-2xl border border-red-200 dark:border-red-900/40 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-700 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{d.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{d.info}</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">{d.lat.toFixed(4)}°N, {d.lng.toFixed(4)}°E</div>
          </div>
        ))}
      </div>
    </div>
  );
};

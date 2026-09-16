import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Filter,
  PlusCircle,
  Locate,
  Info,
  Calendar,
  Layers,
  Sparkles,
  Search,
  ChevronRight,
  X,
  Compass,
  Maximize2,
  Globe2,
  Eye,
  Crosshair
} from 'lucide-react';
import { DiseaseReport, FarmProfile } from '../types';
import {
  calculateHaversineDistance,
  DISEASE_ALERT_RADIUS_KM,
  DEFAULT_TEST_FARM,
  POPULAR_INDIAN_AGRO_HUBS,
  isValidCoordinate
} from '../lib/geoUtils';
import { saveDiseaseReportToCloud, saveFarmProfileToCloud } from '../lib/firebase';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface DiseaseHotspotMapProps {
  currentUser: any;
  farmProfile: FarmProfile | null;
  diseaseReports: DiseaseReport[];
  onOpenAuth: () => void;
  onUpdateFarmProfile: (profile: FarmProfile) => void;
  onNavigateToScanner?: () => void;
}

type MapLayerType = 'osm' | 'satellite' | 'terrain';

export const DiseaseHotspotMap: React.FC<DiseaseHotspotMapProps> = ({
  currentUser,
  farmProfile,
  diseaseReports,
  onOpenAuth,
  onUpdateFarmProfile,
  onNavigateToScanner,
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Active farm coordinates (falls back to DEFAULT_TEST_FARM if not yet configured)
  const activeFarm: FarmProfile = useMemo(() => {
    return farmProfile || DEFAULT_TEST_FARM;
  }, [farmProfile]);

  // Selected disease for detailed precaution view
  const [selectedReport, setSelectedReport] = useState<DiseaseReport | null>(null);

  // Filter states: 'all' = full national/regional map, 'nearby' = 5km radar, 'regional' = district 5-50km, 'critical' = high/critical
  const [filterMode, setFilterMode] = useState<'all' | 'nearby' | 'regional' | 'critical'>('all');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapLayerType, setMapLayerType] = useState<MapLayerType>('osm');

  // Modals
  const [isRegisterFarmOpen, setIsRegisterFarmOpen] = useState<boolean>(false);
  const [isReportDiseaseOpen, setIsReportDiseaseOpen] = useState<boolean>(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);
  const [reportSuccessMessage, setReportSuccessMessage] = useState<string | null>(null);

  // New report form state
  const [newReportCrop, setNewReportCrop] = useState<string>('Tomato');
  const [newReportDisease, setNewReportDisease] = useState<string>('Leaf Blight');
  const [newReportSeverity, setNewReportSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [newReportLocationName, setNewReportLocationName] = useState<string>('');
  const [newReportLat, setNewReportLat] = useState<number>(activeFarm.latitude);
  const [newReportLng, setNewReportLng] = useState<number>(activeFarm.longitude);

  // Farm registration form state
  const [tempFarmName, setTempFarmName] = useState<string>(activeFarm.farmName);
  const [tempFarmCrop, setTempFarmCrop] = useState<string>(activeFarm.crop);
  const [tempFarmLat, setTempFarmLat] = useState<number>(activeFarm.latitude);
  const [tempFarmLng, setTempFarmLng] = useState<number>(activeFarm.longitude);
  const [tempFarmAddress, setTempFarmAddress] = useState<string>(activeFarm.address || '');
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);

  // Map DOM reference
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const circleRadiusRef = useRef<L.Circle | null>(null);

  // Compute distance for every report relative to activeFarm
  const reportsWithDistance: DiseaseReport[] = useMemo(() => {
    return diseaseReports
      .filter(r => isValidCoordinate(r.latitude, r.longitude))
      .map(report => {
        const distanceKm = calculateHaversineDistance(
          activeFarm.latitude,
          activeFarm.longitude,
          report.latitude,
          report.longitude
        );
        return {
          ...report,
          distanceKm
        };
      })
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }, [diseaseReports, activeFarm.latitude, activeFarm.longitude]);

  // Reports within 5 km alert radius
  const nearbyAlertReports = useMemo(() => {
    return reportsWithDistance.filter(
      r => (r.distanceKm ?? 999) <= DISEASE_ALERT_RADIUS_KM
    );
  }, [reportsWithDistance]);

  // Reports in regional zone (5 km to 50 km)
  const regionalReports = useMemo(() => {
    return reportsWithDistance.filter(
      r => (r.distanceKm ?? 999) > DISEASE_ALERT_RADIUS_KM && (r.distanceKm ?? 999) <= 50.0
    );
  }, [reportsWithDistance]);

  // Filtered reports based on active UI filters
  const filteredReports = useMemo(() => {
    return reportsWithDistance.filter(report => {
      const dist = report.distanceKm ?? 999;
      // Proximity & severity mode
      if (filterMode === 'nearby' && dist > DISEASE_ALERT_RADIUS_KM) {
        return false;
      }
      if (filterMode === 'regional' && (dist <= DISEASE_ALERT_RADIUS_KM || dist > 50.0)) {
        return false;
      }
      if (filterMode === 'critical' && report.severity !== 'high' && report.severity !== 'critical') {
        return false;
      }

      // Crop filter
      if (selectedCropFilter !== 'all' && !report.crop.toLowerCase().includes(selectedCropFilter.toLowerCase())) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchDisease = report.disease.toLowerCase().includes(query);
        const matchCrop = report.crop.toLowerCase().includes(query);
        const matchLocation = report.locationName?.toLowerCase().includes(query) ?? false;
        if (!matchDisease && !matchCrop && !matchLocation) return false;
      }

      return true;
    });
  }, [reportsWithDistance, filterMode, selectedCropFilter, searchQuery]);

  // Unique crops for filter dropdown
  const uniqueCrops = useMemo(() => {
    const crops = new Set<string>();
    diseaseReports.forEach(r => {
      if (r.crop) crops.add(r.crop);
    });
    return Array.from(crops);
  }, [diseaseReports]);

  // =========================================================================
  // Initialize Leaflet Map (Using 100% Free OpenStreetMap & Esri Satellite Layers)
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up if existing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create Leaflet map centered at farmer's farm
    const map = L.map(mapContainerRef.current, {
      center: [activeFarm.latitude, activeFarm.longitude],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Pick unrestricted tile URL based on active layer type
    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (mapLayerType === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye';
    } else if (mapLayerType === 'terrain') {
      tileUrl = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors, Humanitarian OpenStreetMap Team';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create LayerGroup for markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;

    // Handle map clicks when registering a farm or reporting a disease
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setTempFarmLat(Math.round(lat * 10000) / 10000);
      setTempFarmLng(Math.round(lng * 10000) / 10000);
      setNewReportLat(Math.round(lat * 10000) / 10000);
      setNewReportLng(Math.round(lng * 10000) / 10000);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapLayerType]);

  // =========================================================================
  // Update Markers, 5 KM Radius Circle, and Popups whenever data changes
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    // Clear previous markers & radius circle
    markersGroup.clearLayers();
    if (circleRadiusRef.current) {
      map.removeLayer(circleRadiusRef.current);
      circleRadiusRef.current = null;
    }

    // 1. Draw 5 KM Radius Circle around Registered Farm
    const fiveKmCircle = L.circle([activeFarm.latitude, activeFarm.longitude], {
      radius: 5000, // 5000 meters = 5 km
      color: '#eab308', // Amber / Yellow warning border
      weight: 2,
      dashArray: '8, 8',
      fillColor: '#eab308',
      fillOpacity: 0.12,
    }).addTo(map);

    fiveKmCircle.bindTooltip(
      `<div style="font-family: inherit; font-size: 11px; font-weight: bold; color: #ca8a04;">
        🛡️ 5 KM Farm High-Alert Zone (${activeFarm.farmName})
      </div>`,
      { permanent: false, direction: 'top' }
    );
    circleRadiusRef.current = fiveKmCircle;

    // 2. Add Farmer's Registered Farm Marker (Green pulsating badge)
    const farmIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping"></div>
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-500 border-2 border-white shadow-2xl flex items-center justify-center text-white text-lg font-bold">
          🚜
        </div>
        <div class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
          Your Farm
        </div>
      </div>
    `;

    const farmIcon = L.divIcon({
      html: farmIconHtml,
      className: 'custom-farm-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });

    const farmMarker = L.marker([activeFarm.latitude, activeFarm.longitude], { icon: farmIcon })
      .bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 210px; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="font-size: 18px;">🌱</span>
            <strong style="color: #065f46; font-size: 14px;">${activeFarm.farmName}</strong>
          </div>
          <div style="font-size: 12px; color: #475569; line-height: 1.4;">
            <div><strong>Cultivated Crop:</strong> ${activeFarm.crop}</div>
            <div><strong>GPS:</strong> ${activeFarm.latitude.toFixed(4)}° N, ${activeFarm.longitude.toFixed(4)}° E</div>
            ${activeFarm.address ? `<div style="margin-top: 4px; color: #64748b;">${activeFarm.address}</div>` : ''}
          </div>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #059669; font-weight: bold;">
            ✓ Active Surveillance Center (5 km Radar Zone)
          </div>
        </div>
      `);

    markersGroup.addLayer(farmMarker);

    // 3. Add Disease Report Markers for All Outbreaks
    filteredReports.forEach(report => {
      const dist = report.distanceKm ?? 999;
      const isNearby = dist <= DISEASE_ALERT_RADIUS_KM;
      const isRegional = dist > DISEASE_ALERT_RADIUS_KM && dist <= 50.0;
      const isCritical = report.severity === 'critical' || report.severity === 'high';

      // Distinguish markers by proximity and severity
      let markerBg = 'from-indigo-600 to-purple-800 border-indigo-300';
      let tagBg = 'bg-indigo-950 text-indigo-200 border-indigo-500/50';

      if (isNearby) {
        markerBg = isCritical
          ? 'from-red-600 to-rose-700 border-yellow-300'
          : 'from-amber-600 to-orange-700 border-white';
        tagBg = 'bg-red-950 text-red-200 border-red-500/60';
      } else if (isRegional) {
        markerBg = isCritical
          ? 'from-amber-600 to-orange-700 border-amber-300'
          : 'from-blue-600 to-cyan-800 border-cyan-300';
        tagBg = 'bg-amber-950 text-amber-200 border-amber-500/50';
      }

      const pingHtml = isNearby
        ? `<div class="absolute -inset-2 rounded-full ${isCritical ? 'bg-red-500/50' : 'bg-amber-500/40'} animate-ping"></div>`
        : '';

      const diseaseIconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${pingHtml}
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr ${markerBg} border-2 shadow-2xl flex items-center justify-center text-white text-sm font-black transition-transform group-hover:scale-125">
            ${isCritical ? '☣️' : '⚠️'}
          </div>
          <div class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap ${tagBg} border text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
            ${dist < 100 ? `${dist} km` : `${Math.round(dist)} km`}
          </div>
        </div>
      `;

      const diseaseIcon = L.divIcon({
        html: diseaseIconHtml,
        className: 'custom-disease-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: diseaseIcon });

      marker.on('click', () => {
        setSelectedReport(report);
      });

      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 220px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: bold; color: ${isNearby ? '#b91c1c' : isRegional ? '#c2410c' : '#4338ca'}; text-transform: uppercase;">
              ${isNearby ? '🚨 Within 5 km Zone' : isRegional ? '📍 Regional Outbreak' : '🌐 Nationwide Surveillance'}
            </span>
            <span style="font-size: 11px; font-weight: bold; background: #fee2e2; color: #991b1b; padding: 1px 6px; border-radius: 4px;">
              ${dist} km away
            </span>
          </div>
          <strong style="color: #0f172a; font-size: 14px; display: block;">${report.disease}</strong>
          <div style="font-size: 12px; color: #475569; margin-top: 4px; line-height: 1.4;">
            <div><strong>Affected Crop:</strong> ${report.crop}</div>
            ${report.scientificName ? `<div><strong>Pathogen:</strong> <i>${report.scientificName}</i></div>` : ''}
            <div><strong>Severity:</strong> <span style="text-transform: uppercase; font-weight: bold; color: ${isCritical ? '#dc2626' : '#d97706'}">${report.severity}</span> (${report.confidence}% Conf.)</div>
            <div><strong>Location:</strong> ${report.locationName || 'Agricultural Field'}</div>
            <div><strong>Source:</strong> ${report.source === 'leaf_scan' ? 'AI Leaf Doctor' : 'ICAR / Field Observer'}</div>
          </div>
          <div style="margin-top: 8px; font-size: 11px; color: #2563eb; font-weight: bold; cursor: pointer;">
            👉 Click below to view ICAR precautionary dossier
          </div>
        </div>
      `);

      markersGroup.addLayer(marker);
    });
  }, [filteredReports, activeFarm]);

  // Center map on farm
  const handleRecenterFarm = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([activeFarm.latitude, activeFarm.longitude], 12, {
        duration: 1.2,
      });
    }
  };

  // Fit all outbreaks across India and regions
  const handleFitAllOutbreaks = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const coords: [number, number][] = [
      [activeFarm.latitude, activeFarm.longitude],
      ...reportsWithDistance.map(r => [r.latitude, r.longitude] as [number, number])
    ];

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  };

  // Center map on specific report
  const handleFocusReport = (report: DiseaseReport) => {
    setSelectedReport(report);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([report.latitude, report.longitude], 13, {
        duration: 1.2,
      });
    }
  };

  // GPS Location fetcher for farm registration
  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocatingGPS(false);
        const lat = Math.round(pos.coords.latitude * 10000) / 10000;
        const lon = Math.round(pos.coords.longitude * 10000) / 10000;
        setTempFarmLat(lat);
        setTempFarmLng(lon);
        setNewReportLat(lat);
        setNewReportLng(lon);
      },
      err => {
        setIsLocatingGPS(false);
        console.warn('Geolocation error:', err);
        alert('Could not obtain GPS coordinates. Please select your region from the agro hub list or click on the map.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Save new farm location
  const handleSaveFarmProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCoordinate(tempFarmLat, tempFarmLng)) {
      alert('Please provide valid geographic coordinates.');
      return;
    }

    const updatedProfile: FarmProfile = {
      farmName: tempFarmName.trim() || 'My Registered Farm',
      crop: tempFarmCrop.trim() || 'Mixed Crops',
      latitude: tempFarmLat,
      longitude: tempFarmLng,
      address: tempFarmAddress.trim() || undefined,
      updatedAt: Date.now(),
    };

    onUpdateFarmProfile(updatedProfile);
    if (currentUser) {
      await saveFarmProfileToCloud(currentUser.uid, updatedProfile);
    }
    setIsRegisterFarmOpen(false);

    // Pan map to new farm coordinates
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([tempFarmLat, tempFarmLng], 12);
    }
  };

  // Submit manual disease report
  const handleSubmitManualReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCoordinate(newReportLat, newReportLng)) {
      alert('Please provide valid report coordinates.');
      return;
    }

    setIsSubmittingReport(true);
    try {
      const reportData: Omit<DiseaseReport, 'id'> = {
        farmerId: currentUser ? currentUser.uid : 'anonymous-kisan',
        farmerName: currentUser?.displayName || 'Farmer Observer',
        crop: newReportCrop,
        disease: newReportDisease,
        confidence: 85,
        severity: newReportSeverity,
        latitude: newReportLat,
        longitude: newReportLng,
        locationName: newReportLocationName || `Field near ${activeFarm.farmName}`,
        reportedAt: Date.now(),
        source: 'farmer_report',
        status: 'needs_verification',
        precautions: [
          `Monitor neighboring ${newReportCrop} fields closely for early foliar spotting or wilt symptoms.`,
          'Avoid movement of infected seedlings and sanitize farming tools after use.',
          'Consult local Krishi Vigyan Kendra (KVK) or extension officer for confirmation.',
        ],
        warning: 'Community farmer report under review by agronomy moderators.',
      };

      await saveDiseaseReportToCloud(reportData);
      setReportSuccessMessage('Disease report submitted successfully! Marked for ICAR verification.');
      setTimeout(() => {
        setReportSuccessMessage(null);
        setIsReportDiseaseOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Submit report error:', err);
      alert('Could not submit report. Please check your connection.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/90 via-[#0e2417] to-emerald-950/90 border border-emerald-800/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>National & Regional Geo-Spatial Crop Health Radar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-space text-white tracking-tight flex items-center gap-2 flex-wrap">
            <span>Disease Hotspot & Surveillance Map</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
              5 KM Farm Radar + Nationwide
            </span>
          </h1>
          <p className="text-sm text-emerald-100/70 mt-1 max-w-2xl">
            Live interactive satellite tracking of airborne pathogens, fungal blights, and viral vectors across India and your farm perimeter.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleFitAllOutbreaks}
            className="px-4 py-2.5 rounded-2xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 font-bold text-xs flex items-center gap-2 border border-indigo-500/40 transition shadow cursor-pointer active:scale-95"
            title="Fit Map to View All Nationwide Outbreaks"
          >
            <Globe2 className="w-4 h-4 text-indigo-300" />
            <span>View Full Map (All Outbreaks)</span>
          </button>

          <button
            onClick={() => setIsRegisterFarmOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-800/60 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 border border-emerald-500/30 transition shadow cursor-pointer active:scale-95"
          >
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span>Change Farm Location</span>
          </button>

          <button
            onClick={() => setIsReportDiseaseOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs flex items-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Outbreak</span>
          </button>
        </div>
      </div>

      {/* 5 KM PROXIMITY ALERT BANNER */}
      {nearbyAlertReports.length > 0 ? (
        <div className="bg-gradient-to-r from-red-950/90 via-amber-950/80 to-red-950/90 border-2 border-red-500/60 rounded-3xl p-5 shadow-2xl animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0 text-red-300 shadow-inner">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-xs font-black uppercase tracking-wider">
                    High Risk Farm Perimeter Alert
                  </span>
                  <span className="text-xs font-mono text-red-300 font-bold">
                    {nearbyAlertReports.length} Outbreak{nearbyAlertReports.length > 1 ? 's' : ''} within 5 KM Zone
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                  Nearest Threat:{' '}
                  <span className="text-yellow-300 font-black">{nearbyAlertReports[0].disease}</span> ({nearbyAlertReports[0].crop}) —{' '}
                  <span className="text-red-400 font-black">{nearbyAlertReports[0].distanceKm} km away</span>
                </h2>
                <p className="text-xs text-red-200/80 mt-0.5">
                  Early preventive bio-fungicide or copper spray recommended before airborne spore propagation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleFocusReport(nearbyAlertReports[0])}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Nearest Threat</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-3xl p-4 flex items-center justify-between gap-3 text-emerald-200 text-xs flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-sm">Farm Perimeter All-Clear</strong>
              <p className="text-emerald-300/80 text-xs">
                No active disease outbreaks reported within 5 km of <strong>{activeFarm.farmName}</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRecenterFarm}
              className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-emerald-700/50"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Center on My Farm</span>
            </button>
            <button
              onClick={handleFitAllOutbreaks}
              className="px-3 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-indigo-700/50"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Show All Outbreaks</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Map & Surveillance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leaflet Map Container */}
        <div className="lg:col-span-2 flex flex-col space-y-3">
          {/* Map Controls & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#121f17] p-3.5 rounded-2xl border border-slate-200 dark:border-emerald-900/40 shadow-sm text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="font-bold text-slate-500 dark:text-emerald-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Scope:
              </span>
              <button
                onClick={() => {
                  setFilterMode('all');
                  handleFitAllOutbreaks();
                }}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  filterMode === 'all'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-[#1a2d21] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>All India ({reportsWithDistance.length})</span>
              </button>
              <button
                onClick={() => {
                  setFilterMode('nearby');
                  handleRecenterFarm();
                }}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  filterMode === 'nearby'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-[#1a2d21] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>5 KM Zone</span>
                <span className="px-1.5 py-0.2 rounded-full bg-red-900 text-red-100 text-[10px]">
                  {nearbyAlertReports.length}
                </span>
              </button>
              <button
                onClick={() => setFilterMode('regional')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  filterMode === 'regional'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-[#1a2d21] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>Regional ({regionalReports.length})</span>
              </button>
              <button
                onClick={() => setFilterMode('critical')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterMode === 'critical'
                    ? 'bg-rose-700 text-white shadow'
                    : 'bg-slate-100 dark:bg-[#1a2d21] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                High/Critical
              </button>
            </div>

            {/* Map Layers & Fit Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Map Layer Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-[#1a2d21] p-0.5 rounded-lg border border-slate-200 dark:border-emerald-800/40">
                <button
                  onClick={() => setMapLayerType('osm')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                    mapLayerType === 'osm' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-emerald-300'
                  }`}
                  title="OpenStreetMap Standard (Free, Zero Key)"
                >
                  Agro Map
                </button>
                <button
                  onClick={() => setMapLayerType('satellite')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                    mapLayerType === 'satellite' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-emerald-300'
                  }`}
                  title="Esri Real Satellite Imagery (Free, Zero Key)"
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapLayerType('terrain')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                    mapLayerType === 'terrain' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-emerald-300'
                  }`}
                  title="Humanitarian Agro Topo (Free, Zero Key)"
                >
                  Terrain
                </button>
              </div>

              <select
                value={selectedCropFilter}
                onChange={e => setSelectedCropFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1a2d21] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-emerald-200 font-semibold cursor-pointer outline-none text-xs"
              >
                <option value="all">🌾 All Crops</option>
                {uniqueCrops.map(crop => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>

              <button
                onClick={handleRecenterFarm}
                title="Center on Farm"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1a2d21] hover:bg-slate-200 text-slate-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800/40 cursor-pointer"
              >
                <Locate className="w-4 h-4" />
              </button>

              <button
                onClick={handleFitAllOutbreaks}
                title="Fit All Outbreak Markers on Map"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1a2d21] hover:bg-slate-200 text-slate-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800/40 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Leaflet Map Box */}
          <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-emerald-900/50 shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 dark:bg-[#0c1811]/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-emerald-800/60 shadow-xl text-[11px] space-y-1.5 pointer-events-auto max-w-[220px]">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" /> Outbreak Legend
                </span>
                <span className="text-[10px] text-emerald-500 font-mono">100% Free OSM</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-emerald-200">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white inline-block shadow"></span>
                <span>Your Registered Farm</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-emerald-200">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 inline-block"></span>
                <span>5 KM Radar Perimeter</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-emerald-200">
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white inline-block"></span>
                <span>High Alert (&le; 5 km)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-emerald-200">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white inline-block"></span>
                <span>Regional (5 - 50 km)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-emerald-200">
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 border border-white inline-block"></span>
                <span>Nationwide (&gt; 50 km)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Disease Threats List & Selected Precaution Card */}
        <div className="flex flex-col space-y-4">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-emerald-400" />
            <input
              type="text"
              placeholder="Search disease, crop, or district..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#121f17] border border-slate-200 dark:border-emerald-900/40 text-slate-800 dark:text-emerald-100 placeholder-slate-400 text-xs focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            />
          </div>

          {/* Active List of Reports */}
          <div className="bg-white dark:bg-[#121f17] rounded-3xl border border-slate-200 dark:border-emerald-900/40 p-4 shadow-lg flex-1 flex flex-col max-h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-900/30 mb-3">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Surveillance Feed</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
                  {filteredReports.length} Active
                </span>
              </h2>
              <span className="text-[11px] text-slate-400 dark:text-emerald-400/60">Sorted by proximity</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-emerald-400/60 text-xs">
                  No disease reports match your current filter.
                </div>
              ) : (
                filteredReports.map(report => {
                  const dist = report.distanceKm ?? 999;
                  const isNearby = dist <= DISEASE_ALERT_RADIUS_KM;
                  const isRegional = dist > DISEASE_ALERT_RADIUS_KM && dist <= 50.0;
                  const isSelected = selectedReport?.id === report.id;

                  let badgeColor = 'bg-indigo-950 text-indigo-300 border-indigo-800';
                  if (isNearby) {
                    badgeColor = 'bg-red-600 text-white shadow animate-pulse';
                  } else if (isRegional) {
                    badgeColor = 'bg-amber-600 text-white shadow';
                  }

                  return (
                    <div
                      key={report.id || `${report.disease}-${report.latitude}`}
                      onClick={() => handleFocusReport(report)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-md scale-[1.01]'
                          : isNearby
                          ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 hover:border-red-400'
                          : isRegional
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 hover:border-amber-400'
                          : 'bg-slate-50 dark:bg-[#16251c] border-slate-200 dark:border-emerald-900/30 hover:border-emerald-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                                report.severity === 'critical' || report.severity === 'high'
                                  ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {report.severity}
                            </span>
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {report.crop}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-xs text-slate-800 dark:text-emerald-100 mt-1">
                            {report.disease}
                          </h3>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-black font-mono ${badgeColor}`}
                          >
                            {dist < 100 ? `${dist} km` : `${Math.round(dist)} km`}
                          </span>
                          <span className="block text-[10px] text-slate-400 dark:text-emerald-400/60 mt-0.5 max-w-[120px] truncate">
                            {report.locationName || 'Field Cluster'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-emerald-400/80 mt-2 pt-2 border-t border-slate-100 dark:border-emerald-900/30">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.reportedAt).toLocaleDateString()}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                          <span>View dossier</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SELECTED DISEASE PRECAUTION & DOSSIER MODAL / CARD */}
      {selectedReport && (
        <div className="bg-white dark:bg-[#121f17] rounded-3xl border-2 border-emerald-500/40 p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-emerald-900/30 pb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 text-2xl">
                🔬
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                    {selectedReport.crop} Pathology
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-black uppercase ${
                      selectedReport.severity === 'critical' || selectedReport.severity === 'high'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-amber-500/20 text-amber-500'
                    }`}
                  >
                    Severity: {selectedReport.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-emerald-900/50 text-slate-700 dark:text-emerald-300 text-xs font-mono font-bold">
                    Distance: {selectedReport.distanceKm} km from your farm
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-emerald-900/50 text-slate-700 dark:text-emerald-300 text-xs">
                    Location: <strong>{selectedReport.locationName || 'Field'}</strong>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-space text-slate-900 dark:text-white mt-1">
                  {selectedReport.disease}
                </h2>
                {selectedReport.scientificName && (
                  <p className="text-xs text-slate-500 dark:text-emerald-400 italic">
                    Causal Pathogen: {selectedReport.scientificName} • Diagnostic Confidence: {selectedReport.confidence}%
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-emerald-900/40 text-slate-500 dark:text-emerald-300 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actionable ICAR Precautions */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-emerald-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Farm Precautions & Bio-Defense Protocols:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedReport.precautions && selectedReport.precautions.length > 0 ? (
                selectedReport.precautions.map((precaution, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-emerald-100 flex items-start gap-2.5 leading-relaxed"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <span>{precaution}</span>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16251c] text-xs text-slate-600 dark:text-emerald-200 col-span-2">
                  1. Inspect your crops for early foliar spotting or wilt. 2. Remove and safely dispose of infected leaves. 3. Avoid overhead wet foliage irrigation.
                </div>
              )}
            </div>

            {selectedReport.warning && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{selectedReport.warning}</span>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-emerald-900/30">
            <div className="text-xs text-slate-500 dark:text-emerald-400/80">
              Reported on {new Date(selectedReport.reportedAt).toLocaleString()} • Source:{' '}
              <strong>{selectedReport.source === 'leaf_scan' ? 'AI Leaf Doctor' : 'Farmer Field Report / ICAR'}</strong>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateToScanner && (
                <button
                  onClick={onNavigateToScanner}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <span>Scan Your Crop Leaves</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTER / UPDATE FARM LOCATION */}
      {/* ========================================================================= */}
      {isRegisterFarmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0c1811] text-slate-900 dark:text-white rounded-3xl border border-emerald-800/60 shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-900/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Configure Farm Location</h3>
                  <p className="text-xs text-slate-500 dark:text-emerald-400">
                    Sets the anchor point for your 5 km disease proximity radar.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterFarmOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-emerald-900/40 hover:bg-slate-200 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFarmProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                    Farm / Plot Name
                  </label>
                  <input
                    type="text"
                    required
                    value={tempFarmName}
                    onChange={e => setTempFarmName(e.target.value)}
                    placeholder="e.g. Kisan Seva Model Farm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                    Primary Crop Cultivated
                  </label>
                  <input
                    type="text"
                    required
                    value={tempFarmCrop}
                    onChange={e => setTempFarmCrop(e.target.value)}
                    placeholder="e.g. Tomato, Sugarcane, Wheat"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* GPS Geolocation Button */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div>
                  <strong className="block text-emerald-400">Automatic GPS Geolocation</strong>
                  <span className="text-[11px] text-slate-500 dark:text-emerald-300/80">
                    Use your phone/laptop GPS sensor for precise field positioning.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleFetchCurrentLocation}
                  disabled={isLocatingGPS}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shrink-0 shadow cursor-pointer"
                >
                  <Locate className={`w-4 h-4 ${isLocatingGPS ? 'animate-spin' : ''}`} />
                  <span>{isLocatingGPS ? 'Locating...' : 'Get GPS'}</span>
                </button>
              </div>

              {/* Fast Preset Hub Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  Or Pick a Major Agricultural District:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                  {POPULAR_INDIAN_AGRO_HUBS.map(hub => (
                    <button
                      type="button"
                      key={hub.name}
                      onClick={() => {
                        setTempFarmLat(hub.lat);
                        setTempFarmLng(hub.lon);
                        setTempFarmAddress(`${hub.name}, India`);
                      }}
                      className={`p-2 rounded-xl text-left border transition text-[11px] cursor-pointer ${
                        Math.abs(tempFarmLat - hub.lat) < 0.01 && Math.abs(tempFarmLng - hub.lon) < 0.01
                          ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                          : 'bg-slate-50 dark:bg-[#16251c] text-slate-700 dark:text-emerald-300 border-slate-200 dark:border-emerald-900/40 hover:bg-emerald-900/30'
                      }`}
                    >
                      <div className="font-bold truncate">{hub.name}</div>
                      <div className="text-[10px] opacity-75">{hub.primaryCrop}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coordinates Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                    Latitude (° N)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={tempFarmLat}
                    onChange={e => setTempFarmLat(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                    Longitude (° E)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={tempFarmLng}
                    onChange={e => setTempFarmLng(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                  Village / District Address (Optional)
                </label>
                <input
                  type="text"
                  value={tempFarmAddress}
                  onChange={e => setTempFarmAddress(e.target.value)}
                  placeholder="e.g. Karveer Taluk, Kolhapur, Maharashtra"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-white font-medium"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-emerald-900/40">
                <button
                  type="button"
                  onClick={() => setIsRegisterFarmOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-emerald-900/40 text-slate-600 dark:text-emerald-300 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black shadow-lg cursor-pointer"
                >
                  Save Farm Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REPORT CROP DISEASE / OUTBREAK */}
      {/* ========================================================================= */}
      {isReportDiseaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0c1811] text-slate-900 dark:text-white rounded-3xl border border-amber-500/50 shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-900/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Broadcast Crop Outbreak</h3>
                  <p className="text-xs text-slate-500 dark:text-emerald-400">
                    Alert neighboring farmers about sudden pest attacks or disease spread.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReportDiseaseOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-emerald-900/40 hover:bg-slate-200 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccessMessage ? (
              <div className="p-6 text-center space-y-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/40">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-emerald-300 text-sm">{reportSuccessMessage}</h4>
              </div>
            ) : (
              <form onSubmit={handleSubmitManualReport} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                      Affected Crop
                    </label>
                    <input
                      type="text"
                      required
                      value={newReportCrop}
                      onChange={e => setNewReportCrop(e.target.value)}
                      placeholder="e.g. Tomato, Chili, Wheat, Cotton"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                      Observed Disease / Symptom
                    </label>
                    <input
                      type="text"
                      required
                      value={newReportDisease}
                      onChange={e => setNewReportDisease(e.target.value)}
                      placeholder="e.g. Leaf Blight, Yellow Rust, Wilt"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                      Visual Severity
                    </label>
                    <select
                      value={newReportSeverity}
                      onChange={e => setNewReportSeverity(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-white font-bold cursor-pointer"
                    >
                      <option value="low">Low (Early Spotting / Few Leaves)</option>
                      <option value="medium">Medium (Moderate Foliage Loss)</option>
                      <option value="high">High (Rapid Spread Across Plot)</option>
                      <option value="critical">Critical (Severe Defoliation / Dieback)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-emerald-200 mb-1">
                      Village / Location Name
                    </label>
                    <input
                      type="text"
                      value={newReportLocationName}
                      onChange={e => setNewReportLocationName(e.target.value)}
                      placeholder="e.g. Uchgaon Sector 3"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#16251c] border border-slate-200 dark:border-emerald-800/40 space-y-2">
                  <span className="font-bold text-slate-700 dark:text-emerald-200 block">
                    Report Geographic Coordinates
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={newReportLat}
                      onChange={e => setNewReportLat(parseFloat(e.target.value) || 0)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0c1811] border border-slate-200 dark:border-emerald-900/60 font-mono text-xs"
                      placeholder="Latitude"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={newReportLng}
                      onChange={e => setNewReportLng(parseFloat(e.target.value) || 0)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0c1811] border border-slate-200 dark:border-emerald-900/60 font-mono text-xs"
                      placeholder="Longitude"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-emerald-400/80">
                    Defaulted to your registered farm. Click anywhere on the map behind to adjust position.
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-emerald-900/40">
                  <button
                    type="button"
                    onClick={() => setIsReportDiseaseOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-emerald-900/40 text-slate-600 dark:text-emerald-300 font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black shadow-lg cursor-pointer"
                  >
                    {isSubmittingReport ? 'Broadcasting...' : 'Publish to Hotspot Radar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

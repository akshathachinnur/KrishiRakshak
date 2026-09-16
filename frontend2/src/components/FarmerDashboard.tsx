import React, { useState } from 'react';
import {
  Camera,
  Sprout,
  FlaskConical,
  Store,
  Sun,
  MessageSquare,
  PhoneCall,
  Users,
  BookOpen,
  Landmark,
  FolderLock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Pause,
  Play,
  X,
  Bot,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { AppLanguage, DiseaseReport, FarmProfile } from '../types';
import { calculateHaversineDistance, DISEASE_ALERT_RADIUS_KM, DEFAULT_TEST_FARM } from '../lib/geoUtils';

interface FarmerDashboardProps {
  selectedDialect: AppLanguage;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  currentUser: any;
  farmProfile?: FarmProfile | null;
  diseaseReports?: DiseaseReport[];
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  selectedDialect,
  onNavigate,
  onOpenAuth,
  currentUser,
  farmProfile,
  diseaseReports = [],
}) => {

  const [activeDot, setActiveDot] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const [showRakshakBubble, setShowRakshakBubble] = useState(true);

  // Bilingual greetings and labels tailored for farmers
  const getGreeting = () => {
    switch (selectedDialect) {
      case 'hi':
        return {
          title: 'नमस्ते किसान भाई! 🙏',
          sub: 'आज आप अपने खेत के लिए क्या जांचना चाहते हैं?',
          helplineText: 'निःशुल्क किसान कॉल सेंटर (24x7)',
        };
      case 'mr':
        return {
          title: 'नमस्कार शेतकरी बंधू! 🙏',
          sub: 'आज तुम्हाला तुमच्या शेतीसाठी काय मदत हवी आहे?',
          helplineText: 'मोफत शेतकरी हेल्पलाइन (24x7)',
        };
      case 'kn':
        return {
          title: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! 🙏',
          sub: 'ಇಂದು ನಿಮ್ಮ ಕೃಷಿಗೆ ಯಾವ ಮಾಹಿತಿ ಬೇಕು?',
          helplineText: 'ಉಚಿತ ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ (24x7)',
        };
      case 'te':
        return {
          title: 'నమస్కారం రైతు సోదరులారా! 🙏',
          sub: 'ఈరోజు మీ వ్యవసాయానికి ఏ సమాచారం కావాలి?',
          helplineText: 'ఉచిత కిసాన్ కాల్ సెంటర్ (24x7)',
        };
      case 'gu':
        return {
          title: 'નમસ્તે ખેડૂત મિત્રો! 🙏',
          sub: 'આજે તમારી ખેતી માટે શું માહિતી જોઈએ છે?',
          helplineText: 'મફત કિસાન કોલ સેન્ટર (24x7)',
        };
      default:
        return {
          title: 'Welcome to KrishiRakshak! 🙏',
          sub: 'What would you like to check for your farm today?',
          helplineText: 'Toll-Free Kisan Call Center (24x7)',
        };
    }
  };

  const greeting = getGreeting();

  // 6 PMFBY & Krishi Rakshak Portal Signature Action Cards (Dark Palette)
  const actionCards = [
    {
      id: 'scanner',
      title: selectedDialect === 'hi' ? 'पौधे का रोग पहचानें' : selectedDialect === 'mr' ? 'वनस्पतीवरील रोग ओळखा' : 'Check Plant Disease',
      subtitle: selectedDialect === 'hi' ? 'फोटो खींचें • फसल नुकसान से पहले देसी व दवा उपचार पाएं' : selectedDialect === 'mr' ? 'फोटो काढा • पीक नुकसानीपूर्वी खात्रीशीर उपाय मिळवा' : 'Know your diagnosis & organic cure before crop loss',
      icon: Camera,
      badgeColor: 'bg-amber-950/70 text-amber-300 border-amber-600/50',
      iconColor: 'text-amber-300',
      btnText: selectedDialect === 'hi' ? 'रोग जांचें' : 'Check Now',
      isSpecialBlue: false,
    },
    {
      id: 'crop-fertilizer-crop',
      targetTab: 'crop-fertilizer',
      title: selectedDialect === 'hi' ? 'फसल की उपयुक्तता' : selectedDialect === 'mr' ? 'कोणते पीक घ्यावे?' : 'Best Crop to Sow',
      subtitle: selectedDialect === 'hi' ? 'मिट्टी के प्रकार व मौसम अनुसार सर्वाधिक मुनाफे की फसल' : selectedDialect === 'mr' ? 'मातीनुसार सर्वाधिक नफा मिळवून देणारे पीक' : 'Know your soil texture & highest profit crop for season',
      icon: Sprout,
      badgeColor: 'bg-emerald-950/70 text-emerald-300 border-emerald-600/50',
      iconColor: 'text-emerald-300',
      btnText: selectedDialect === 'hi' ? 'फसल चुनें' : 'Check Now',
      isSpecialBlue: false,
    },
    {
      id: 'schemes',
      targetTab: 'schemes',
      title: 'Krishi Rakshak Portal & Helpline (KRPH)',
      subtitle: selectedDialect === 'hi' ? 'फसल शिकायत दर्ज करें, बीमा क्लेम व कृषि सहायता पाएं' : selectedDialect === 'mr' ? 'पीक तक्रार नोंदवा व थेट मदत मिळवा' : 'Tell us about your Grievances & Report loss of Crop.',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-950/70 text-purple-300 border-purple-600/50',
      iconColor: 'text-purple-300',
      btnText: selectedDialect === 'hi' ? 'सहायता देखें' : 'Explore Now',
      isSpecialBlue: false,
    },
    {
      id: 'crop-fertilizer-fert',
      targetTab: 'crop-fertilizer',
      title: selectedDialect === 'hi' ? 'खाद की सही खुराक' : selectedDialect === 'mr' ? 'खताची योग्य मात्रा' : 'Right Fertilizer Dose',
      subtitle: selectedDialect === 'hi' ? 'यूरिया, डीएपी, एनपीके की वैज्ञानिक संतुलित मात्रा' : selectedDialect === 'mr' ? 'युरिया, डीएपी खतांचे अचूक प्रमाण' : 'Your Gateway to Smarter Farming & NPK Soil Health.',
      icon: FlaskConical,
      badgeColor: 'bg-rose-950/70 text-rose-300 border-rose-600/50',
      iconColor: 'text-rose-300',
      btnText: selectedDialect === 'hi' ? 'मात्रा निकालें' : 'Calculate Now',
      isSpecialBlue: false,
    },
    {
      id: 'mandi-weather-mandi',
      targetTab: 'mandi-weather',
      title: selectedDialect === 'hi' ? 'आज का मंडी भाव' : selectedDialect === 'mr' ? 'आजचे बाजार भाव' : 'Live Mandi Rates',
      subtitle: selectedDialect === 'hi' ? 'देशभर की 500+ मंडियों के लाइव थोक एपीएमसी भाव' : selectedDialect === 'mr' ? 'थेट बाजार भाव व पीक निरीक्षण' : 'Live crop observations & APMC wholesale auction rates.',
      icon: Store,
      badgeColor: 'bg-pink-950/70 text-pink-300 border-pink-600/50',
      iconColor: 'text-pink-300',
      btnText: selectedDialect === 'hi' ? 'भाव देखें' : 'Explore Now',
      isSpecialBlue: false,
    },
    {
      id: 'mandi-weather-weather',
      targetTab: 'mandi-weather',
      title: 'Weather & Radar (WINDS)',
      subtitle: selectedDialect === 'hi' ? 'मौसम पूर्वानुमान, वर्षा रडार व स्प्रे करने की सही सलाह' : selectedDialect === 'mr' ? 'हवामान माहिती व फवारणी रडार' : "Know your Area's Weather Updates & spray window radar.",
      icon: Sun,
      badgeColor: 'bg-sky-950/70 text-sky-300 border-sky-600/50',
      iconColor: 'text-sky-300',
      btnText: selectedDialect === 'hi' ? 'मौसम देखें' : 'Explore Now',
      isSpecialBlue: true, // Dark Midnight Sapphire Card
    },
  ];

  return (
    <div className="w-full">
      {/* 1. LUSH AGRICULTURAL GREEN HERO (Matches Reference Background) */}
      <section className="relative w-full bg-gradient-to-r from-[#24733b] via-[#338d49] to-[#256d36] text-white py-10 px-4 sm:px-6 lg:px-12 overflow-hidden shadow-inner">
        {/* Decorative Ornamental Watermark SVG Mandalas on Edges (From Reference) */}
        <div className="absolute -left-20 -top-20 w-96 h-96 opacity-10 pointer-events-none select-none text-white">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full animate-spin-slow">
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="60" />
            <circle cx="100" cy="100" r="40" />
            <path d="M100 20 C110 60, 110 60, 100 100 C90 60, 90 60, 100 20" />
            <path d="M100 180 C110 140, 110 140, 100 100 C90 140, 90 140, 100 180" />
            <path d="M20 100 C60 110, 60 110, 100 100 C60 90, 60 90, 20 100" />
            <path d="M180 100 C140 110, 140 110, 100 100 C140 90, 140 90, 180 100" />
            <path d="M43 43 C75 65, 75 65, 100 100 C65 75, 65 75, 43 43" />
            <path d="M157 157 C125 135, 125 135, 100 100 C135 125, 135 125, 157 157" />
            <path d="M157 43 C135 75, 135 75, 100 100 C125 65, 125 65, 157 43" />
            <path d="M43 157 C65 125, 65 125, 100 100 C75 135, 75 135, 43 157" />
          </svg>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none select-none text-white">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="50" />
            <path d="M100 20 C120 60, 120 60, 100 100 C80 60, 80 60, 100 20" />
            <path d="M100 180 C120 140, 120 140, 100 100 C80 140, 80 140, 100 180" />
            <path d="M20 100 C60 120, 60 120, 100 100 C60 80, 60 80, 20 100" />
            <path d="M180 100 C140 120, 140 120, 100 100 C140 80, 140 80, 180 100" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Welcome Header & Kisan Call Center Box */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold backdrop-blur-md mb-2 border border-white/20">
                <Sprout className="w-4 h-4 text-emerald-300" />
                <span>{selectedDialect === 'hi' ? 'सरल व आसान किसान पोर्टल' : 'Simple & Farmer-Friendly Portal'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-xs">
                {greeting.title}
              </h1>
              <p className="mt-1.5 text-base sm:text-lg text-emerald-100/90 font-medium max-w-xl">
                {greeting.sub}
              </p>
            </div>

            {/* Toll-Free 24x7 Call Center Card (Dark Style) */}
            <div className="flex items-center gap-4 bg-[#0a180f]/95 text-white p-4 sm:p-5 rounded-2xl shadow-2xl shrink-0 border border-[#1b3d26] backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-[#143d22] text-[#5bf06c] border border-[#2b643a] flex items-center justify-center shrink-0 shadow-md">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-emerald-200/80 uppercase tracking-wider block">
                  {greeting.helplineText}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#5bf06c] tracking-tight drop-shadow-xs">
                  1800-180-1551
                </span>
                <span className="text-[10px] text-amber-300 font-bold">
                  KRPH Direct: 14447
                </span>
              </div>
            </div>
          </div>

          {/* 5 KM PROXIMITY CROP HEALTH ALERT BANNER */}
          {(() => {
            const currentFarm = farmProfile || DEFAULT_TEST_FARM;
            const nearbyAlerts = diseaseReports
              .filter(r => typeof r.latitude === 'number' && typeof r.longitude === 'number')
              .map(r => ({
                ...r,
                distanceKm: calculateHaversineDistance(
                  currentFarm.latitude,
                  currentFarm.longitude,
                  r.latitude,
                  r.longitude
                ),
              }))
              .filter(r => (r.distanceKm ?? 999) <= DISEASE_ALERT_RADIUS_KM)
              .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

            if (nearbyAlerts.length > 0) {
              const nearest = nearbyAlerts[0];
              return (
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-950/95 via-amber-950/90 to-red-950/95 border-2 border-red-500/70 p-4 sm:p-5 shadow-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0 text-red-300">
                      <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-black uppercase tracking-wider">
                          ⚠️ Nearby Disease Alert
                        </span>
                        <span className="text-xs font-mono text-red-300 font-bold">
                          {nearbyAlerts.length} case{nearbyAlerts.length > 1 ? 's' : ''} detected within 5 km of your farm
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        Nearest: <span className="text-yellow-300 font-black">{nearest.disease}</span> ({nearest.crop}) —{' '}
                        <span className="text-red-400 font-black">{nearest.distanceKm} km away</span>
                      </h3>
                      <p className="text-xs text-red-200/80 mt-0.5">
                        Airborne / vector risk active. Inspect foliage and check bio-security precautions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onNavigate('hotspot-map')}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Disease Hotspot Map</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div className="mb-6 rounded-2xl bg-[#0a180f]/90 border border-emerald-800/60 p-3.5 sm:p-4 text-emerald-200 flex items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Crop Health Radar: All Clear</span>
                    <span className="text-emerald-300/80 text-xs">
                      No active disease outbreaks detected within 5 km of {currentFarm.farmName}.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('hotspot-map')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-700/50 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Radar Map</span>
                </button>
              </div>
            );
          })()}

          {/* 6 Elevated Action Cards / Tabs (Dark Color Theme) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 mb-8">

            {actionCards.map((card) => {
              const Icon = card.icon;
              const target = card.targetTab || card.id;

              // Card 6: Weather & WINDS Dark Midnight Sapphire Card
              if (card.isSpecialBlue) {
                return (
                  <div
                    key={card.id}
                    onClick={() => onNavigate(target)}
                    className="relative rounded-2xl p-5 shadow-xl flex flex-col justify-between cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br from-[#081827] via-[#0d2842] to-[#0a1c2d] text-white border border-sky-600/40 hover:border-sky-400/80 group backdrop-blur-md"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-sky-950/80 border border-sky-500/50 flex items-center justify-center mb-4 text-sky-300 shadow-inner group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-yellow-300" />
                      </div>
                      <h3 className="text-sm font-black tracking-tight leading-snug mb-2 text-white">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-sky-200/70 leading-relaxed mb-4 line-clamp-3">
                        {card.subtitle}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#113353] hover:bg-[#184672] text-sky-200 hover:text-white font-bold text-xs shadow-md border border-sky-500/40 transition-all">
                        <span>{card.btnText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              }

              // Cards 1-5: Dark Theme Action Tabs
              return (
                <div
                  key={card.id}
                  onClick={() => onNavigate(target)}
                  className="rounded-2xl p-5 bg-[#0a180f]/95 hover:bg-[#0f2417] text-white shadow-xl border border-[#1b3d26] hover:border-[#39d353]/70 flex flex-col justify-between cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-2xl backdrop-blur-md group"
                >
                  <div>
                    {/* Top Circular Badge Icon */}
                    <div className={`w-12 h-12 rounded-xl ${card.badgeColor} border flex items-center justify-center mb-4 ${card.iconColor} shadow-inner group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-sm font-black text-white tracking-tight leading-snug mb-2">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-emerald-100/70 leading-relaxed mb-4 line-clamp-3">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Dark Green Pill Button */}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#143d22] hover:bg-[#1d5730] text-[#5bf06c] hover:text-white border border-[#2b643a] font-bold text-xs shadow-sm transition-all">
                      <span>{card.btnText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slider Pagination Controls (Matching Reference: ○ ○ ● ○ ○ [Pause]) */}
          <div className="flex items-center justify-center gap-2.5 pt-2">
            {[0, 1, 2, 3, 4].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveDot(idx)}
                className={`transition-all ${
                  activeDot === idx
                    ? 'w-6 h-3 rounded-full bg-[#1b5e20] border-2 border-white'
                    : 'w-3 h-3 rounded-full bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="ml-2 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 border border-white/20"
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{isPaused ? 'Play' : 'Pause'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. OFFICIAL WHAT'S NEW TICKER & PMFBY ALERT BULLETIN (Below Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Digital Suite Advisory Overview */}
          <div className="lg:col-span-7 bg-white dark:bg-[#121c16] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#222c26] shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-[#1b5e20] dark:text-[#5bf06c] text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Official Digital Suite for PMFBY &amp; Kisan Applications</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Krishi Rakshak Portal &amp; Precision Field Diagnostics
              </h2>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A complete suite of digital tools designed to simplify crop insurance field operations, plant disease monitoring, Mandi wholesale discovery, and grievance management for Indian farmers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-lg font-black text-[#1b5e20] dark:text-[#5bf06c]">24x7</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Toll-Free KRPH</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[#1b5e20] dark:text-[#5bf06c]">3 Sec</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Plant Vision AI</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[#1b5e20] dark:text-[#5bf06c]">500+</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Live Mandis</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[#1b5e20] dark:text-[#5bf06c]">100%</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Free for Farmers</span>
              </div>
            </div>
          </div>

          {/* Right Column: "What's New? Stay updated" (Matches Right Box in Screenshot) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-[#121c16] dark:to-[#16241b] rounded-3xl p-6 sm:p-7 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">What's New?</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Stay updated
                </span>
              </div>

              <div className="space-y-3">
                <div 
                  onClick={() => onNavigate('schemes')}
                  className="p-3 bg-white dark:bg-[#18241d] rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 transition cursor-pointer flex items-start gap-2.5 group"
                >
                  <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    2026 Operational Guidelines of Pradhan Mantri Fasal Bima Yojana (PMFBY)
                  </p>
                </div>

                <div 
                  onClick={() => onNavigate('scanner')}
                  className="p-3 bg-white dark:bg-[#18241d] rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 transition cursor-pointer flex items-start gap-2.5 group"
                >
                  <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    Krishi Rakshak Portal &amp; Helpline (KRPH) now integrated with AI Plant Doctor
                  </p>
                </div>

                <div 
                  onClick={() => onNavigate('mandi-weather')}
                  className="p-3 bg-white dark:bg-[#18241d] rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 transition cursor-pointer flex items-start gap-2.5 group"
                >
                  <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    Kharif 2026 Mandi Minimum Support Price (MSP) updates released
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <button
                onClick={() => onNavigate('schemes')}
                className="text-xs font-bold text-[#18542c] dark:text-[#5bf06c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all official notifications &amp; portals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECONDARY USEFUL TOOLS GRID: Chaupal, Blogs, Schemes, Farm Vault */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-slate-50 dark:bg-[#121c16] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#222c26]">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🌾</span>
            {selectedDialect === 'hi' ? 'अन्य उपयोगी सुविधाएं' : 'More Helpful Tools & Support'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => onNavigate('community')}
              className="bg-white dark:bg-[#18241d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 text-left transition hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {selectedDialect === 'hi' ? 'किसान चौपाल' : 'Farmer Forum'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {selectedDialect === 'hi' ? 'किसान चर्चा व सवाल' : 'Peer Discussions'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('blogs')}
              className="bg-white dark:bg-[#18241d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 text-left transition hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {selectedDialect === 'hi' ? 'कृषि सलाह लेख' : 'Agri Guides'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {selectedDialect === 'hi' ? 'जैविक व देसी तरीके' : 'Farming Articles'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('schemes')}
              className="bg-white dark:bg-[#18241d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 text-left transition hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {selectedDialect === 'hi' ? 'सरकारी योजनाएं' : 'Govt Schemes'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  PM-Kisan, KCC, Fasal Bima
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('vault')}
              className="bg-white dark:bg-[#18241d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 text-left transition hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 flex items-center justify-center mb-3">
                <FolderLock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {selectedDialect === 'hi' ? 'मेरी खेत डायरी' : 'Farm Vault'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {selectedDialect === 'hi' ? 'पुराने रिकॉर्ड व पर्चे' : 'Saved Records'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 4. FLOATING AI AGRICULTURE ASSISTANT (Single Krishi Rakshak Assistant) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-2.5">
        {showRakshakBubble && (
          <div className="relative bg-[#0a180f] text-white p-3.5 rounded-2xl shadow-2xl border border-[#235832] max-w-[230px] animate-in fade-in slide-in-from-right duration-300 backdrop-blur-md">
            <button
              onClick={() => setShowRakshakBubble(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 text-xs shadow cursor-pointer"
              aria-label="Close message"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs font-bold leading-snug">
              Hi, I am your <span className="text-[#5bf06c] font-black">Krishi Rakshak</span>. How may I help you?
            </p>
            <button
              onClick={() => onNavigate('chatbot')}
              className="mt-2 text-[11px] font-extrabold text-[#5bf06c] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Start Voice / Text Chat</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        <div
          onClick={() => onNavigate('chatbot')}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#143d22] to-[#256d36] text-white flex items-center justify-center shadow-2xl border-2 border-[#5bf06c] ring-2 ring-emerald-950/60 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          title="Chat with Krishi Rakshak AI"
        >
          <span className="text-2xl select-none">👨‍🌾</span>
        </div>
      </div>
    </div>
  );
};

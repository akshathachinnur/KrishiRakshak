import React from 'react';
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
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { AppLanguage } from '../types';

interface FarmerDashboardProps {
  selectedDialect: AppLanguage;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  currentUser: any;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  selectedDialect,
  onNavigate,
  onOpenAuth,
  currentUser,
}) => {
  // Bilingual greetings and labels tailored for farmers
  const getGreeting = () => {
    switch (selectedDialect) {
      case 'hi':
        return {
          title: 'नमस्ते किसान भाई! 🙏',
          sub: 'आज आप अपने खेत के लिए क्या जानना चाहते हैं?',
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
          title: 'Welcome, Farmer Friend! 🙏',
          sub: 'What would you like to check for your farm today?',
          helplineText: 'Toll-Free Kisan Call Center (24x7)',
        };
    }
  };

  const greeting = getGreeting();

  // 6 Primary Large Action Cards
  const actionCards = [
    {
      id: 'scanner',
      title: selectedDialect === 'hi' ? 'पत्ती का रोग पहचानें' : selectedDialect === 'mr' ? 'पानावरील रोग ओळखा' : 'Check Leaf Disease',
      subtitle: selectedDialect === 'hi' ? 'फोटो खींचें • देसी व दवा उपचार पाएं' : selectedDialect === 'mr' ? 'फोटो काढा • घरगुती व औषधी उपाय' : 'Snap photo • Get instant organic & chemical cure',
      icon: Camera,
      bgGradient: 'from-emerald-600 to-green-600',
      badge: selectedDialect === 'hi' ? 'फोटो से जांचें' : 'Camera AI',
      colorText: 'text-emerald-700 dark:text-emerald-400',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800/60',
    },
    {
      id: 'crop-fertilizer-crop',
      targetTab: 'crop-fertilizer',
      title: selectedDialect === 'hi' ? 'कौन सी फसल लगाएं?' : selectedDialect === 'mr' ? 'कोणते पीक घ्यावे?' : 'Best Crop to Sow',
      subtitle: selectedDialect === 'hi' ? 'मिट्टी के अनुसार ज्यादा मुनाफे वाली फसल' : selectedDialect === 'mr' ? 'मातीनुसार सर्वाधिक नफा देणारे पीक' : 'Match soil texture for highest profit & yield',
      icon: Sprout,
      bgGradient: 'from-teal-600 to-emerald-600',
      badge: selectedDialect === 'hi' ? 'फसल सलाह' : 'Crop Advisory',
      colorText: 'text-teal-700 dark:text-teal-400',
      lightBg: 'bg-teal-50 dark:bg-teal-950/30',
      borderColor: 'border-teal-200 dark:border-teal-800/60',
    },
    {
      id: 'crop-fertilizer-fert',
      targetTab: 'crop-fertilizer',
      title: selectedDialect === 'hi' ? 'खाद की सही खुराक' : selectedDialect === 'mr' ? 'खताची योग्य मात्रा' : 'Right Fertilizer Dose',
      subtitle: selectedDialect === 'hi' ? 'यूरिया, डीएपी, एनपीके की सही मात्रा जानें' : selectedDialect === 'mr' ? 'युरिया, डीएपी खतांची अचूक मात्रा' : 'Calculate exact Urea, DAP & NPK dose per acre',
      icon: FlaskConical,
      bgGradient: 'from-cyan-700 to-teal-600',
      badge: selectedDialect === 'hi' ? 'खाद कैलकुलेटर' : 'Fertilizer ML',
      colorText: 'text-cyan-700 dark:text-cyan-400',
      lightBg: 'bg-cyan-50 dark:bg-cyan-950/30',
      borderColor: 'border-cyan-200 dark:border-cyan-800/60',
    },
    {
      id: 'mandi-weather-mandi',
      targetTab: 'mandi-weather',
      title: selectedDialect === 'hi' ? 'आज का मंडी भाव' : selectedDialect === 'mr' ? 'आजचे बाजार भाव' : 'Live Mandi Rates',
      subtitle: selectedDialect === 'hi' ? 'गेहूं, धान, कपास, सोयाबीन, सब्जियों के ताज़ा रेट' : selectedDialect === 'mr' ? 'गहू, कापूस, सोयाबीनचे ताजे बाजार भाव' : 'Live APMC wholesale auction rates across states',
      icon: Store,
      bgGradient: 'from-amber-600 to-orange-600',
      badge: selectedDialect === 'hi' ? 'ताज़ा भाव' : 'Live Prices',
      colorText: 'text-amber-700 dark:text-amber-400',
      lightBg: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-200 dark:border-amber-800/60',
    },
    {
      id: 'mandi-weather-weather',
      targetTab: 'mandi-weather',
      title: selectedDialect === 'hi' ? 'मौसम व स्प्रे सलाह' : selectedDialect === 'mr' ? 'हवामान व फवारणी सल्ला' : 'Weather & Spray Radar',
      subtitle: selectedDialect === 'hi' ? 'क्या आज छिड़काव या सिंचाई करना सुरक्षित है?' : selectedDialect === 'mr' ? 'आज औषध फवारणी करणे सुरक्षित आहे का?' : 'Is today safe for spraying & irrigation? 5-day radar',
      icon: Sun,
      bgGradient: 'from-sky-600 to-blue-600',
      badge: selectedDialect === 'hi' ? 'स्प्रे रडार' : 'Spray Window',
      colorText: 'text-sky-700 dark:text-sky-400',
      lightBg: 'bg-sky-50 dark:bg-sky-950/30',
      borderColor: 'border-sky-200 dark:border-sky-800/60',
    },
    {
      id: 'chatbot',
      title: selectedDialect === 'hi' ? 'किसान साथी AI (बोलकर पूछें)' : selectedDialect === 'mr' ? 'किसान AI (बोलून विचारा)' : 'Ask Kisan AI (Voice)',
      subtitle: selectedDialect === 'hi' ? 'अपनी भाषा में बोलें और तुरंत समाधान पाएं' : selectedDialect === 'mr' ? 'आपल्या भाषेत बोला आणि लगेच उपाय मिळवा' : 'Speak or type in your language for instant advice',
      icon: MessageSquare,
      bgGradient: 'from-emerald-700 to-teal-800',
      badge: selectedDialect === 'hi' ? '24x7 सहायता' : 'Voice Assistant',
      colorText: 'text-emerald-700 dark:text-emerald-400',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800/60',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Friendly Farmer Welcome Hero */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-green-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden mb-8 border border-emerald-700/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold backdrop-blur-md mb-3 border border-white/20">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>{selectedDialect === 'hi' ? 'सरल व आसान किसान पोर्टल' : 'Simple & Farmer-Friendly Portal'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {greeting.title}
            </h1>
            <p className="mt-2.5 text-base sm:text-lg text-emerald-100/90 max-w-xl font-medium">
              {greeting.sub}
            </p>
          </div>

          {/* Quick Helpline Toll-Free Call Box */}
          <a
            href="tel:18001801551"
            className="flex items-center gap-3.5 bg-white text-emerald-900 hover:bg-emerald-50 p-4 sm:p-5 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 shrink-0 border border-white"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {greeting.helplineText}
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
                1800-180-1551
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Main 6 Big Action Tiles */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            {selectedDialect === 'hi' ? 'मुख्य सेवाएं (सीधे चुनें)' : selectedDialect === 'mr' ? 'प्रमुख सेवा (थेट निवडा)' : 'Quick Services (Tap to Open)'}
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {selectedDialect === 'hi' ? '100% निःशुल्क' : 'Free for Farmers'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {actionCards.map((card) => {
            const Icon = card.icon;
            const target = card.targetTab || card.id;

            return (
              <div
                key={card.id}
                onClick={() => onNavigate(target)}
                className={`group bg-white dark:bg-[#121c16] rounded-3xl border ${card.borderColor} p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1 active:scale-98`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${card.bgGradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${card.lightBg} ${card.colorText} border border-current/20`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  <span>{selectedDialect === 'hi' ? 'अभी खोलें' : 'Open Now'}</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-[#18241d] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Useful Farmer Services: Chaupal, Blogs, Schemes, Farm Vault */}
      <div className="bg-slate-50 dark:bg-[#121c16] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#222c26] mb-10">
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
    </div>
  );
};

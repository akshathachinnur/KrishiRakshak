import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  LogOut,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Users,
  BookOpen,
  Landmark,
  FolderLock,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  MapPin,
  Sprout,
  Mic
} from 'lucide-react';
import { logOutUser } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { AppLanguage } from '../types';
import { txt } from '../lib/i18n';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  onOpenAuth: () => void;
  selectedDialect: AppLanguage;
  setSelectedDialect: (d: AppLanguage) => void;
  diagnosesCount: number;
  nearbyAlertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  selectedDialect,
  setSelectedDialect,
  diagnosesCount,
  nearbyAlertsCount = 0,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLang: AppLanguage) => {
    setLanguage(newLang);
    setSelectedDialect(newLang);
  };

  // Primary Tabs — Crop Scan is the hero tab
  const d = selectedDialect;
  const mainNavItems = [
    {
      id: 'scanner',
      label: txt(d, { hi: '🔬 फसल स्कैन', mr: '🔬 पीक स्कॅन', kn: '🔬 ಬೆಳೆ ಸ್ಕ್ಯಾನ್', te: '🔬 పంట స్క్యాన్', gu: '🔬 પાક સ્કૅન', en: '🔬 Crop Scan' }),
      icon: '🌿',
      isPrimary: true,
    },
    {
      id: 'map',
      label: txt(d, { hi: 'नक्शा', mr: 'नकाशा', kn: 'ನಕ್ಷೆ', te: 'మ్యాప్', gu: 'નકશો', en: 'Map' }),
      icon: '📍',
    },
  ];


  // Secondary Features in "More Services" Dropdown
  const moreServices = [
    {
      id: 'overview',
      label: txt(d, { hi: 'होम', mr: 'होम', kn: 'ಮುಖಪುಟ', te: 'హోమ్', gu: 'હોમ', en: 'Home' }),
      sub: txt(d, { hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड', kn: 'ಡ್ಯಾಶ್ಬೋರ್ಡ್', te: 'డాష్‌బోర్డ్', gu: 'ડેશબોર્ડ', en: 'Dashboard' }),
      icon: Sprout,
    },
    {
      id: 'hotspot-map',
      label: txt(d, { hi: 'रोग रडार', mr: 'रोग नकाशा', kn: 'ರೋಗ ನಕ್ಷೆ', te: 'వ్యాధి మ్యాప్', gu: 'રોગ નકશો', en: 'Disease Map' }),
      sub: txt(d, { hi: 'आसपास के रोग', mr: 'आजबाजूचे आजार', kn: 'ಹತ್ತಿರದ ರೋಗಗಳು', te: 'సమీప వ్యాధులు', gu: 'નજીકના રોગો', en: 'Nearby Alerts' }),
      icon: MapPin,
      badge: nearbyAlertsCount > 0 ? nearbyAlertsCount : undefined,
    },
    {
      id: 'mandi-weather',
      label: txt(d, { hi: 'मंडी व मौसम', mr: 'बाजार व हवामान', kn: 'ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಹವಾಮಾನ', te: 'మార్కెట్ & వాతావరణం', gu: 'બજાર અને હવામાન', en: 'Mandi & Weather' }),
      sub: txt(d, { hi: 'बाजार भाव और मौसम', mr: 'बाजार भाव आणि हवामान', kn: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಮತ್ತು ಹವಾಮಾನ', te: 'మార్కెట్ ధరలు & వాతావరణం', gu: 'બજાર ભાવ અને હવામાન', en: 'Market & Weather' }),
      icon: Sun,
    },
    {
      id: 'crop-fertilizer',
      label: txt(d, { hi: 'फसल व खाद', mr: 'पीक व खत', kn: 'ಬೆಳೆ ಮತ್ತು ಗೊಬ್ಬರ', te: 'పంట & ఎరువు', gu: 'પાક અને ખાતર', en: 'Crop & Fertilizer' }),
      sub: txt(d, { hi: 'फसल अनुशंसा व खाद योजना', mr: 'पीक शिफारस व खत योजना', kn: 'ಬೆಳೆ ಶಿಫಾರಸು ಮತ್ತು ಗೊಬ್ಬರ ಯೋಜನೆ', te: 'పంట సిఫారసు & ఎరువు ప్రణాళిక', gu: 'પાક સિફારસ અને ખાતર યોજના', en: 'Crop Recommendation & Fertilizer Plan' }),
      icon: Sprout,
    },
    {
      id: 'chatbot',
      label: txt(d, { hi: 'किसान AI', mr: 'किसान AI', kn: 'ಕಿಸಾನ್ AI', te: 'కిసాన్ AI', gu: 'કિસાન AI', en: 'Ask Kisan AI' }),
      sub: txt(d, { hi: 'AI से पूछें कोई भी सवाल', mr: 'AI ला विचारा कोणताही प्रश्न', kn: 'AI ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ', te: 'AI ను ఏదైనా అడగండి', gu: 'AI ને કોઈપણ પ્રશ્ન પૂછો', en: 'Voice & Chat AI Assistant' }),
      icon: Mic,
    },
    {
      id: 'community',
      label: txt(d, { hi: 'किसान चौपाल', mr: 'शेतकरी मंच', kn: 'ರೈತ ಚರ್ಚಾವೇದಿಕೆ', te: 'రైతు వేదిక', gu: 'ખેડૂત મંચ', en: 'Farmer Forum' }),
      sub: txt(d, { hi: 'किसान चर्चा व सवाल', mr: 'शेतकरी चर्चा', kn: 'ರೈತರ ಚರ್ಚೆ', te: 'రైతు చర్చ', gu: 'ખેડૂત ચર્ચા', en: 'Peer Discussion' }),
      icon: Users,
    },
    {
      id: 'blogs',
      label: txt(d, { hi: 'कृषि सलाह लेख', mr: 'कृषी लेख', kn: 'ಕೃಷಿ ಲೇಖನಗಳು', te: 'వ్యవసాయ వ్యాసాలు', gu: 'કૃષિ લેખ', en: 'Agri Blogs' }),
      sub: txt(d, { hi: 'देसी तरीके व उपाय', mr: 'देशी पद्धती व उपाय', kn: 'ದೇಸಿ ವಿಧಾನ ಮತ್ತು ಉಪಾಯ', te: 'దేశీ పద్ధతులు మరియు ఉపాయాలు', gu: 'દેસી રીત અને ઉપાય', en: 'Field Knowledge' }),
      icon: BookOpen,
    },
    {
      id: 'schemes',
      label: txt(d, { hi: 'सरकारी योजनाएं', mr: 'सरकारी योजना', kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', te: 'ప్రభుత్వ పథకాలు', gu: 'સરકારી યોજનાઓ', en: 'Govt Schemes' }),
      sub: 'PM-Kisan, KCC, Fasal Bima',
      icon: Landmark,
    },
    {
      id: 'vault',
      label: txt(d, { hi: 'मेरी खेत डायरी', mr: 'शेत डायरी', kn: 'ನನ್ನ ಹೊಲದ ಡೈರಿ', te: 'నా పొలం డైరీ', gu: 'મારી ખેત ડાયરી', en: 'Farm Vault' }),
      sub: txt(d, { hi: 'पुराने रिकॉर्ड व पर्चे', mr: 'जुने रेकॉर्ड', kn: 'ಹಳೆಯ ದಾಖಲೆಗಳು', te: 'పాత రికార్డులు', gu: 'જૂના રેકોર્ડ', en: 'Saved Records' }),
      icon: FolderLock,
      badge: diagnosesCount > 0 ? diagnosesCount : undefined,
    },
  ];

  const isMoreTabActive = moreServices.some((s) => s.id === activeTab);

  return (
    <header className="fixed top-0 w-full z-40 shadow-md transition-colors">
      {/* 1. Official PMFBY Green Utility Strip */}
      <div className="w-full bg-[#1e6b37] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 lg:px-8 border-b border-[#18552c]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: WhatsApp & Helpline Information */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
            <a 
              href="https://wa.me/917065514447" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-200 transition-colors font-semibold"
            >
              <span className="w-4 h-4 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">💬</span>
              <span>WhatsApp ChatBot - <strong className="text-[#a7f3d0]">7065514447</strong></span>
            </a>
            <span className="hidden sm:inline text-emerald-400/60">|</span>
            <a 
              href="tel:14447" 
              className="flex items-center gap-1.5 hover:text-emerald-200 transition-colors font-medium"
            >
              <PhoneCall className="w-3 h-3 text-[#ffeb3b]" />
              <span>Krishi Rakshak Portal &amp; Helpline (KRPH) - <strong className="text-[#ffeb3b]">14447</strong></span>
            </a>
            <span className="hidden md:inline text-emerald-400/60">|</span>
            <span className="hidden md:inline text-emerald-100/80 text-[10px]">
              Toll-Free Kisan Call Center: <strong className="text-white">1800-180-1551</strong>
            </span>
          </div>

          {/* Right: Accessibility Controls, Language, Theme */}
          <div className="flex items-center gap-2.5 ml-auto text-[11px]">
            <span className="hidden lg:inline text-emerald-100/80 hover:text-white cursor-pointer select-none">
              Skip to Main Content
            </span>
            <span className="hidden lg:inline text-emerald-400/50">|</span>
            <div className="hidden sm:flex items-center gap-1 font-bold text-[10px] bg-[#14532a] px-2 py-0.5 rounded border border-emerald-500/30">
              <span className="cursor-pointer hover:text-yellow-300">A-</span>
              <span className="cursor-pointer hover:text-yellow-300 mx-0.5">A</span>
              <span className="cursor-pointer hover:text-yellow-300">A+</span>
            </div>
            <span className="hidden sm:inline text-emerald-400/50">|</span>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-[#14532a] border border-emerald-500/40 px-2 py-0.5 rounded text-white text-xs">
              <Globe className="w-3 h-3 text-emerald-300 shrink-0" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as AppLanguage)}
                aria-label="Select Language"
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-[11px] pr-1"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white text-slate-900 dark:bg-[#141e18] dark:text-[#dae5dc]">
                    {lang.name} ({lang.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-6 h-6 rounded bg-[#14532a] border border-emerald-500/40 flex items-center justify-center hover:bg-emerald-700 transition cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-emerald-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main White Brand Header Tier */}
      <div className="w-full bg-white dark:bg-[#0c1611] border-b border-slate-200 dark:border-[#202b24] py-2 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Government Emblem & KrishiRakshak Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* National Insignia */}
            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-3 sm:pr-4">
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-800 dark:text-amber-300 text-sm font-bold shadow-xs">
                🏛️
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight leading-tight">
                  भारत सरकार
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">
                  Government of India
                </span>
              </div>
            </div>

            {/* KrishiRakshak Shield Logo & Identity */}
            <div 
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <img
                alt="KrishiRakshak Brand Logo"
                className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-105 drop-shadow-xs"
                src="/logo-icon.png"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-space text-lg sm:text-2xl font-black text-[#1b5e20] dark:text-[#5bf06c] tracking-tight leading-none">
                    KrishiRakshak
                  </span>
                  <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60">
                    KRPH • Bio-AI
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                  कृषि एवं किसान कल्याण मंत्रालय • Precision Bio-AI &amp; Diagnostics
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls: Free Badge & Auth Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-[#1a261e] dark:text-[#dae5dc] dark:border-emerald-800/60 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#5bf06c]" />
              <span>{t.nav.freeBadge}</span>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenAuth}
                  title={currentUser.email || 'Farmer Profile'}
                  className="h-8 px-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold text-xs flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[80px] truncate">{currentUser.displayName || 'Profile'}</span>
                </button>
                <button
                  onClick={() => logOutUser()}
                  title={t.nav.signOut}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 dark:bg-[#18221c] dark:text-slate-300 flex items-center justify-center transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1c2921] dark:hover:bg-[#25372c] text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-700 dark:text-[#5bf06c]" />
                <span>{t.nav.signIn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Deep Dark Navigation Ribbon */}
      <nav className="w-full bg-[#0a180f] text-white shadow-sm border-t border-[#142e1d]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-11 sm:h-12">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.id;
              const isPrimary = (item as any).isPrimary;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-xs sm:text-sm font-bold transition-all px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isPrimary && !isActive
                      ? 'bg-[#fbc02d] text-[#134e27] font-black shadow-md hover:bg-[#f9a825] ring-1 ring-amber-400/40'
                      : isPrimary && isActive
                      ? 'bg-[#f57f17] text-white font-black shadow-lg ring-2 ring-amber-300/60'
                      : isActive
                      ? 'bg-[#163b22] text-[#5bf06c] shadow-inner font-black ring-1 ring-[#39d353]/40'
                      : 'text-emerald-100/75 hover:text-white hover:bg-[#122718]'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* "More Tools" Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`text-xs sm:text-sm font-bold transition-all py-1.5 px-3 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isMoreTabActive
                    ? 'bg-[#163b22] text-[#5bf06c] shadow-inner font-black ring-1 ring-[#39d353]/40'
                    : 'text-emerald-100/75 hover:text-white hover:bg-[#122718]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{txt(d, { hi: 'अन्य सेवाएं', mr: 'अधिक सेवा', kn: 'ಇತರ ಸೇವೆಗಳು', te: 'ఇతర సేవలు', gu: 'અન્ય સેવાઓ', en: 'More Tools' })}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-[#0c1811] rounded-2xl shadow-2xl border border-[#1f422b] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
                  {moreServices.map((srv) => {
                    const Icon = srv.icon;
                    const isActive = activeTab === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(srv.id);
                          setIsMoreOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition cursor-pointer ${
                          isActive
                            ? 'bg-[#183d24] text-[#5bf06c] font-bold'
                            : 'hover:bg-[#14291c] text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#183d24] text-[#5bf06c] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs block leading-tight">{srv.label}</span>
                            <span className="text-[10px] text-slate-400 block">{srv.sub}</span>
                          </div>
                        </div>
                        {srv.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            {srv.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Signature Golden-Yellow Action Button (Matches "Register" in reference) */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={() => setActiveTab(activeTab === 'scanner' ? 'overview' : 'scanner')}
              className="h-8 sm:h-9 px-3.5 sm:px-5 rounded-lg bg-[#fbc02d] hover:bg-[#f9a825] active:bg-[#f57f17] text-[#134e27] font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-95 whitespace-nowrap"
            >
              <span>{activeTab === 'scanner' ? '🏠 ' + t.nav.homeBtn : '🔍 ' + t.nav.checkLeaf}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around gap-1 px-2 py-1.5 bg-[#0a180f] text-white border-t border-[#142e1d] shadow-sm">
        {mainNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`text-xs px-2 py-1 rounded-lg whitespace-nowrap transition-colors flex flex-col items-center gap-0.5 shrink-0 ${
              activeTab === item.id
                ? 'text-yellow-300 font-black'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            <span className="text-sm leading-none">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveTab(isMoreTabActive ? 'overview' : 'community')}
          className={`text-xs px-2 py-1 rounded-lg whitespace-nowrap transition-colors flex flex-col items-center gap-0.5 shrink-0 ${
            isMoreTabActive
              ? 'text-yellow-300 font-black'
              : 'text-emerald-100 hover:text-white'
          }`}
        >
          <span className="text-sm leading-none">✨</span>
          <span className="text-[10px] font-bold">
            {txt(d, { hi: 'अन्य', mr: 'अधिक', kn: 'ಇತರ', te: 'ఇతర', gu: 'વધુ', en: 'More' })}
          </span>
        </button>
      </div>
    </header>
  );
};

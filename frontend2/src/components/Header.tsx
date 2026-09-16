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
  Sprout,
  Camera,
  Store,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { logOutUser } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { AppLanguage } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  onOpenAuth: () => void;
  selectedDialect: AppLanguage;
  setSelectedDialect: (d: AppLanguage) => void;
  diagnosesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  selectedDialect,
  setSelectedDialect,
  diagnosesCount,
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

  // 5 Farmer-Friendly Primary Tabs
  const mainNavItems = [
    {
      id: 'overview',
      label: selectedDialect === 'hi' ? 'होम' : selectedDialect === 'mr' ? 'होम' : 'Home',
      icon: '🏠',
    },
    {
      id: 'scanner',
      label: selectedDialect === 'hi' ? 'पत्ती डॉक्टर' : selectedDialect === 'mr' ? 'पान डॉक्टर' : 'Leaf Doctor',
      icon: '🌿',
    },
    {
      id: 'crop-fertilizer',
      label: selectedDialect === 'hi' ? 'फसल व खाद' : selectedDialect === 'mr' ? 'पीक व खत' : 'Crop & Fertilizer',
      icon: '🌱',
    },
    {
      id: 'mandi-weather',
      label: selectedDialect === 'hi' ? 'मंडी व मौसम' : selectedDialect === 'mr' ? 'बाजार व हवामान' : 'Mandi & Weather',
      icon: '💰',
    },
    {
      id: 'chatbot',
      label: selectedDialect === 'hi' ? 'किसान साथी AI' : selectedDialect === 'mr' ? 'किसान AI' : 'Ask Kisan AI',
      icon: '🎙️',
    },
  ];

  // Secondary Features in "More Services" Dropdown
  const moreServices = [
    {
      id: 'community',
      label: selectedDialect === 'hi' ? 'किसान चौपाल' : selectedDialect === 'mr' ? 'शेतकरी मंच' : 'Farmer Forum',
      sub: selectedDialect === 'hi' ? 'किसान चर्चा व सवाल' : 'Peer Discussion',
      icon: Users,
    },
    {
      id: 'blogs',
      label: selectedDialect === 'hi' ? 'कृषि सलाह लेख' : selectedDialect === 'mr' ? 'कृषी लेख' : 'Agri Blogs',
      sub: selectedDialect === 'hi' ? 'देसी तरीके व उपाय' : 'Field Knowledge',
      icon: BookOpen,
    },
    {
      id: 'schemes',
      label: selectedDialect === 'hi' ? 'सरकारी योजनाएं' : selectedDialect === 'mr' ? 'सरकारी योजना' : 'Govt Schemes',
      sub: 'PM-Kisan, KCC, Fasal Bima',
      icon: Landmark,
    },
    {
      id: 'vault',
      label: selectedDialect === 'hi' ? 'मेरी खेत डायरी' : selectedDialect === 'mr' ? 'शेत डायरी' : 'Farm Vault',
      sub: selectedDialect === 'hi' ? 'पुराने रिकॉर्ड व पर्चे' : 'Saved Records',
      icon: FolderLock,
      badge: diagnosesCount > 0 ? diagnosesCount : undefined,
    },
  ];

  const isMoreTabActive = moreServices.some((s) => s.id === activeTab);

  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 text-slate-900 border-b border-slate-200 shadow-sm dark:bg-[#0c1510]/95 dark:text-[#dae5dc] dark:border-[#222c26] backdrop-blur-xl transition-colors">
      <div className="h-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand Logo & Tag */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <img
            alt="KrishiRakshak Brand Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1X3NLjsN4hPWJcRgYI7-FL3W-SBk_iWWZ1rlKEIsPMMCt4JJQi0Rugsbx8JmUqyRpv7-q2Dh0LTfRnCfoZrKGV3PGVO4cHxNpgdTEsk56384uk1vmMMwr7NvhEl799nkEKEbNnDAVri44bD9UbRYGczgC2o7mGtG-IkWjAuElipZxDj9vszwCCG0F2VLw4aYwR_Sa8ooJNQ0KmpFib9LLR9arPDu9Cvrq02-_tzSrDx12bp8WmMakNNUZo"
          />
          <div className="flex flex-col">
            <span className="font-space text-base sm:text-lg font-black text-slate-900 dark:text-[#dae5dc] tracking-tight leading-none">
              KrishiRakshak
            </span>
            <span className="font-space text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-700 dark:text-[#5bf06c] font-bold mt-0.5">
              🌾 किसान साथी
            </span>
          </div>
        </div>

        {/* Simplified 5 Primary Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3" aria-label="Main Navigation">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-xs xl:text-sm font-bold transition-all relative py-1.5 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-[#5bf06c] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#bccbb6] dark:hover:text-[#dae5dc] dark:hover:bg-[#18221c]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {/* "More Services" Dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`text-xs xl:text-sm font-bold transition-all py-1.5 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                isMoreTabActive
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-[#5bf06c] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#bccbb6] dark:hover:text-[#dae5dc] dark:hover:bg-[#18221c]'
              }`}
            >
              <span>✨</span>
              <span>{selectedDialect === 'hi' ? 'और सेवाएं' : selectedDialect === 'mr' ? 'अधिक सेवा' : 'More Tools'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#121c16] rounded-2xl shadow-xl border border-slate-200 dark:border-[#222c26] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
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
                          ? 'bg-emerald-50 dark:bg-[#18241d] text-emerald-800 dark:text-emerald-400'
                          : 'hover:bg-slate-50 dark:hover:bg-[#18221c] text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
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
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Main Website Language Selector (6 Languages) */}
          <div 
            id="website-language-selector"
            className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-emerald-500 text-slate-800 dark:bg-[#18221c] dark:border-[#344439] dark:hover:border-[#5bf06c]/60 dark:text-[#dae5dc] px-2 sm:px-2.5 py-1 rounded-xl text-xs transition-colors shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700 dark:text-[#5bf06c] shrink-0" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as AppLanguage)}
              aria-label="Select Website Language"
              className="bg-transparent text-emerald-800 dark:text-[#5bf06c] font-bold outline-none cursor-pointer text-xs pr-1"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-slate-900 dark:bg-[#141e18] dark:text-[#dae5dc] py-1">
                  {lang.name} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 dark:bg-[#18221c] dark:border-[#2d3731] dark:hover:bg-[#222c26] dark:text-[#dae5dc] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode (दिन का मोड)' : 'Switch to Dark Mode (रात का मोड)'}
            aria-label="Toggle Dark and Light mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-700" />
            )}
          </button>

          {/* Farmer Free Badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-[#222c26] dark:text-[#dae5dc] dark:border-[#2d3731] px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 dark:bg-[#5bf06c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-[#5bf06c]"></span>
            </span>
            <span className="text-[11px] font-medium whitespace-nowrap">
              {t.nav.freeBadge}
            </span>
          </div>

          {/* Quick Launch Tab button */}
          <button
            onClick={() => setActiveTab(activeTab === 'scanner' ? 'overview' : 'scanner')}
            className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-[#39d353] text-[#00390c] text-xs font-bold flex items-center gap-1.5 shadow-[0_0_16px_rgba(57,211,83,0.3)] hover:opacity-95 active:scale-95 transition-all shrink-0"
          >
            <span>{activeTab === 'scanner' ? t.nav.homeBtn : t.nav.checkLeaf}</span>
          </button>

          {/* User Auth Profile Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAuth}
                title={currentUser.email || 'Farmer Profile'}
                className="w-8 h-8 rounded-full bg-[#39d353]/20 border border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-[#5bf06c] hover:border-emerald-500 transition-all"
              >
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <User className="w-4 h-4" />}
              </button>
              <button
                onClick={() => logOutUser()}
                title={t.nav.signOut}
                className="w-8 h-8 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-red-600 dark:bg-[#18221c] dark:border-[#2d3731] dark:hover:bg-[#222c26] dark:text-[#869582] dark:hover:text-[#ffb4ab] flex items-center justify-center transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-8 h-8 rounded-full bg-[#39d353] text-[#00390c] flex items-center justify-center shadow hover:brightness-110 transition-all shrink-0"
              title={t.nav.signIn}
            >
              <User className="w-4 h-4 font-bold" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="lg:hidden flex items-center justify-around gap-1 px-2 py-2 border-t border-slate-200 bg-white/95 text-slate-800 dark:border-[#222c26] dark:bg-[#0c1510]/95 shadow-sm">
        {mainNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`text-xs px-2 py-1 rounded-xl whitespace-nowrap transition-colors flex flex-col items-center gap-0.5 shrink-0 ${
              activeTab === item.id
                ? 'text-emerald-700 dark:text-[#5bf06c] font-black'
                : 'text-slate-500 hover:text-slate-900 dark:text-[#bccbb6]'
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveTab(isMoreTabActive ? 'overview' : 'community')}
          className={`text-xs px-2 py-1 rounded-xl whitespace-nowrap transition-colors flex flex-col items-center gap-0.5 shrink-0 ${
            isMoreTabActive
              ? 'text-emerald-700 dark:text-[#5bf06c] font-black'
              : 'text-slate-500 hover:text-slate-900 dark:text-[#bccbb6]'
          }`}
        >
          <span className="text-base leading-none">✨</span>
          <span className="text-[10px] font-bold">
            {selectedDialect === 'hi' ? 'अन्य' : 'More'}
          </span>
        </button>
      </div>
    </header>
  );
};

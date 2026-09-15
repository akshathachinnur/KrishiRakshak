import React from 'react';
import { User, LogOut, Sun, Moon, Globe } from 'lucide-react';
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

  const handleLanguageChange = (newLang: AppLanguage) => {
    setLanguage(newLang);
    setSelectedDialect(newLang);
  };

  const navItems = [
    { id: 'overview', label: t.nav.home },
    { id: 'scanner', label: t.nav.leafDoctor },
    { id: 'crop-ml', label: t.nav.cropAdvisor },
    { id: 'telemetry', label: t.nav.mandiWeather },
    { id: 'chatbot', label: t.nav.askKisanAI },
    { id: 'schemes', label: t.nav.schemes },
    { id: 'vault', label: t.nav.vault, badge: diagnosesCount > 0 ? diagnosesCount : undefined },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 text-slate-900 border-b border-slate-200 shadow-sm dark:bg-[#0c1510]/90 dark:text-[#dae5dc] dark:border-[#222c26] backdrop-blur-xl transition-colors">
      <div className="h-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 flex items-center justify-between gap-2">
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
            <span className="font-space text-base sm:text-lg font-bold text-slate-900 dark:text-[#dae5dc] tracking-tight leading-none">
              KrishiRakshak
            </span>
            <span className="font-space text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-700 dark:text-[#5bf06c] font-semibold mt-0.5">
              Kisan Smart Companion
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden xl:flex items-center gap-5" aria-label="Main Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-xs lg:text-sm font-medium transition-all relative py-1 flex items-center gap-1.5 ${
                activeTab === item.id
                  ? 'text-emerald-700 dark:text-[#5bf06c] font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#bccbb6] dark:hover:text-[#dae5dc]'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 dark:bg-[#39d353]/20 dark:text-[#5bf06c] dark:border-[#5bf06c]/30">
                  {item.badge}
                </span>
              )}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-[#5bf06c] rounded-full"></span>
              )}
            </button>
          ))}
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
      <div className="xl:hidden flex items-center justify-start gap-1 px-2 py-1.5 border-t border-slate-200 bg-white/95 text-slate-800 dark:border-[#222c26] dark:bg-[#0c1510]/95 overflow-x-auto no-scrollbar shadow-sm">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`text-xs px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
              activeTab === item.id
                ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 dark:bg-[#5bf06c]/20 dark:text-[#5bf06c] dark:border-[#5bf06c]/30'
                : 'text-slate-600 hover:text-slate-900 dark:text-[#bccbb6] dark:hover:text-[#dae5dc]'
            }`}
          >
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white dark:bg-[#5bf06c] dark:text-[#00390c] text-[10px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </header>
  );
};

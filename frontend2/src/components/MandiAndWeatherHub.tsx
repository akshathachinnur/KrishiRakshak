import React, { useState } from 'react';
import {
  Store,
  Sun,
  TrendingUp,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { MarketTracker } from './MarketTracker';
import { AgroWeather } from './AgroWeather';
import { AppLanguage } from '../types';
import { txt } from '../lib/i18n';

interface MandiAndWeatherHubProps {
  initialSubTab?: 'mandi' | 'weather';
  selectedDialect?: AppLanguage;
}

export const MandiAndWeatherHub: React.FC<MandiAndWeatherHubProps> = ({
  initialSubTab = 'mandi',
  selectedDialect = 'hi',
}) => {
  const [subTab, setSubTab] = useState<'mandi' | 'weather'>(initialSubTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Sub Tab Switcher Header */}
      <div className="bg-white dark:bg-[#0a180f] rounded-3xl border border-slate-200 dark:border-[#1b3d26] p-2 sm:p-3 shadow-sm mb-6 max-w-xl mx-auto">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSubTab('mandi')}
            className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'mandi'
                ? 'bg-gradient-to-r from-[#18552c] to-[#256d36] text-white shadow-md shadow-emerald-900/40 border border-emerald-500/40'
                : 'text-slate-600 dark:text-emerald-100/75 hover:bg-slate-100 dark:hover:bg-[#122b1a]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>
              {txt(selectedDialect, { hi: '1. आज का मंडी भाव', mr: '1. आजचे बाजार भाव', kn: '1. ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ', te: '1. నేటి మార్కెట్ ధర', gu: '1. આજનો બજાર ભાવ', en: '1. Live Mandi Prices' })}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('weather')}
            className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'weather'
                ? 'bg-gradient-to-r from-[#18552c] to-[#256d36] text-white shadow-md shadow-emerald-900/40 border border-emerald-500/40'
                : 'text-slate-600 dark:text-emerald-100/75 hover:bg-slate-100 dark:hover:bg-[#122b1a]'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>
              {txt(selectedDialect, { hi: '2. मौसम व स्प्रे सलाह', mr: '2. हवामान व फवारणी', kn: '2. ಹವಾಮಾನ ಮತ್ತು ಸ್ಪ್ರೇ ಸಲಹೆ', te: '2. వాతావరణం & స్ప్రే సలహా', gu: '2. હવામાન અને સ્પ્રે સલાહ', en: '2. Weather & Spray Window' })}
            </span>
          </button>
        </div>
      </div>

      {/* Sub Tab Content */}
      {subTab === 'mandi' ? <MarketTracker /> : <AgroWeather />}
    </div>
  );
};

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
      <div className="bg-white dark:bg-[#121c16] rounded-3xl border border-slate-200 dark:border-[#222c26] p-2 sm:p-3 shadow-sm mb-6 max-w-xl mx-auto">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSubTab('mandi')}
            className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'mandi'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>
              {selectedDialect === 'hi' ? '1. आज का मंडी भाव' : selectedDialect === 'mr' ? '1. आजचे बाजार भाव' : '1. Live Mandi Prices'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('weather')}
            className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'weather'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>
              {selectedDialect === 'hi' ? '2. मौसम व स्प्रे सलाह' : selectedDialect === 'mr' ? '2. हवामान व फवारणी' : '2. Weather & Spray Window'}
            </span>
          </button>
        </div>
      </div>

      {/* Sub Tab Content */}
      {subTab === 'mandi' ? <MarketTracker /> : <AgroWeather />}
    </div>
  );
};

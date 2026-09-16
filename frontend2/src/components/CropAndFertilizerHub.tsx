import React, { useState } from 'react';
import {
  Sprout,
  FlaskConical,
  Sparkles,
  ChevronRight,
  Droplets,
  Layers,
  Thermometer,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { CropRecommendationML } from './CropRecommendationML';
import { FertilizerAdvisor } from './FertilizerAdvisor';
import { SoilMetrics, AppLanguage } from '../types';

interface CropAndFertilizerHubProps {
  currentUser: any;
  onOpenAuth: () => void;
  onAskKisanAI: (crop: string, metrics: SoilMetrics) => void;
  initialSubTab?: 'crop' | 'fertilizer';
  selectedDialect?: AppLanguage;
}

export const CropAndFertilizerHub: React.FC<CropAndFertilizerHubProps> = ({
  currentUser,
  onOpenAuth,
  onAskKisanAI,
  initialSubTab = 'crop',
  selectedDialect = 'hi',
}) => {
  const [subTab, setSubTab] = useState<'crop' | 'fertilizer'>(initialSubTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Sub Tab Switcher Header */}
      <div className="bg-white dark:bg-[#0a180f] rounded-3xl border border-slate-200 dark:border-[#1b3d26] p-2 sm:p-3 shadow-sm mb-6 max-w-xl mx-auto">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSubTab('crop')}
            className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'crop'
                ? 'bg-gradient-to-r from-[#18552c] to-[#256d36] text-white shadow-md shadow-emerald-900/40 border border-emerald-500/40'
                : 'text-slate-600 dark:text-emerald-100/75 hover:bg-slate-100 dark:hover:bg-[#122b1a]'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>
              {selectedDialect === 'hi' ? '1. कौन सी फसल लगाएं?' : selectedDialect === 'mr' ? '1. कोणते पीक घ्यावे?' : '1. Which Crop to Grow?'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('fertilizer')}
            className={`py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'fertilizer'
                ? 'bg-gradient-to-r from-[#18552c] to-[#256d36] text-white shadow-md shadow-emerald-900/40 border border-emerald-500/40'
                : 'text-slate-600 dark:text-emerald-100/75 hover:bg-slate-100 dark:hover:bg-[#122b1a]'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>
              {selectedDialect === 'hi' ? '2. कितनी खाद डालें?' : selectedDialect === 'mr' ? '2. खताची योग्य मात्रा' : '2. Right Fertilizer Dose'}
            </span>
          </button>
        </div>
      </div>

      {/* Sub Tab Content */}
      {subTab === 'crop' ? (
        <CropRecommendationML
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          onAskKisanAI={onAskKisanAI}
        />
      ) : (
        <FertilizerAdvisor
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          onAskKisanAI={onAskKisanAI}
        />
      )}
    </div>
  );
};

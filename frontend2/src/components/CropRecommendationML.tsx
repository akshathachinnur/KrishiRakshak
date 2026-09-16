import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  Droplets, 
  IndianRupee, 
  Sprout, 
  Cloud, 
  Check, 
  MessageSquare,
  Compass
} from 'lucide-react';
import { SoilMetrics } from '../types';
import { REGIONAL_PRESETS, calculateCropRecommendation } from '../lib/agronomyData';
import { saveCropPlanToCloud } from '../lib/firebase';

interface CropRecommendationMLProps {
  currentUser: any;
  onOpenAuth: () => void;
  onAskKisanAI: (crop: string, metrics: SoilMetrics) => void;
}

export const CropRecommendationML: React.FC<CropRecommendationMLProps> = ({
  currentUser,
  onOpenAuth,
  onAskKisanAI,
}) => {
  const [metrics, setMetrics] = useState<SoilMetrics>({
    nitrogen: 90,
    phosphorus: 42,
    potassium: 43,
    ph: 6.5,
    temperature: 24.5,
    humidity: 82,
    rainfall: 210,
  });

  const [activePreset, setActivePreset] = useState<string>('custom');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Compute recommendation instantly
  const recommendation = useMemo(() => {
    return calculateCropRecommendation(metrics);
  }, [metrics]);

  const handleApplyPreset = (key: string) => {
    setActivePreset(key);
    if (REGIONAL_PRESETS[key]) {
      setMetrics({ ...REGIONAL_PRESETS[key].metrics });
    }
  };

  const handleSliderChange = (field: keyof SoilMetrics, val: number) => {
    setActivePreset('custom');
    setMetrics(prev => ({ ...prev, [field]: val }));
  };

  const handleSavePlan = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      setIsSaving(true);
      await saveCropPlanToCloud(currentUser.uid, {
        userId: currentUser.uid,
        cropName: recommendation.cropName,
        metrics,
        yieldEstimate: recommendation.yieldPotential,
        netMargin: recommendation.netMargin,
        regionPreset: activePreset !== 'custom' ? REGIONAL_PRESETS[activePreset]?.name : 'Custom Soil Formulation',
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to save crop plan:', err);
      alert('Error saving plan: ' + (err.message || 'Check connection'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="agronomic-ml" className="w-full bg-[#07100b] py-16 px-4 sm:px-6 lg:px-12 border-t border-[#18221c]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#222c26]">
          <div className="max-w-2xl flex flex-col gap-2">
            <span className="font-space text-xs font-bold text-[#5bf06c] uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#5bf06c]" />
              Crop Sowing Advisor
            </span>
            <h2 className="font-space text-3xl sm:text-4xl font-bold text-[#dae5dc] tracking-tight">
              Find the Best Crop for Your Soil &amp; Season
            </h2>
            <p className="text-sm text-[#bccbb6] leading-relaxed">
              Choose your state or adjust soil values (Nitrogen, Phosphorus, Potash, pH) and weather conditions to find which crop yields the highest harvest and maximum market profits.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-2xl bg-[#141e18] border border-[#222c26] text-xs text-[#83da84]">
            <span>22 Major Indian Crops</span>
            <span className="text-[#3d4a3b]">•</span>
            <span>High Yield Advisory</span>
          </div>
        </div>

        {/* Regional Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#869582] mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#5bf06c]" />
            Select Your Region / Soil Type:
          </span>
          {Object.keys(REGIONAL_PRESETS).map((key) => {
            const p = REGIONAL_PRESETS[key];
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-[#222c26] text-[#5bf06c] border-[#5bf06c]/40 shadow-sm'
                    : 'bg-[#141e18] text-[#bccbb6] border-[#222c26] hover:text-[#dae5dc] hover:border-[#3d4a3b]'
                }`}
              >
                {p.name}
              </button>
            );
          })}
          {activePreset === 'custom' && (
            <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#323b35] text-[#ffcb87] border border-[#3d4a3b]">
              Custom Parameter Tuning
            </span>
          )}
        </div>

        {/* Sliders & Prediction Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 7 Agronomic Sliders */}
          <div className="lg:col-span-6 p-6 md:p-8 rounded-3xl bg-[#141e18] border border-[#2d3731] shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#222c26]">
              <h3 className="font-space text-lg font-bold text-[#dae5dc]">
                Input Field Telemetry
              </h3>
              <span className="text-xs text-[#869582]">Real-time Recalculation</span>
            </div>

            {/* Sliders List */}
            <div className="flex flex-col gap-5">
              {/* Nitrogen */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#dae5dc] font-medium">Nitrogen (N) Content</span>
                  <span className="font-mono text-[#5bf06c] font-bold">{metrics.nitrogen} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="140"
                  value={metrics.nitrogen}
                  onChange={(e) => handleSliderChange('nitrogen', Number(e.target.value))}
                  className="w-full accent-[#5bf06c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869582]">
                  <span>0 kg/ha</span>
                  <span>Optimal: 60-120</span>
                  <span>140 kg/ha</span>
                </div>
              </div>

              {/* Phosphorus */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#dae5dc] font-medium">Phosphorus (P) Content</span>
                  <span className="font-mono text-[#5bf06c] font-bold">{metrics.phosphorus} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="145"
                  value={metrics.phosphorus}
                  onChange={(e) => handleSliderChange('phosphorus', Number(e.target.value))}
                  className="w-full accent-[#5bf06c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869582]">
                  <span>5 kg/ha</span>
                  <span>Optimal: 35-70</span>
                  <span>145 kg/ha</span>
                </div>
              </div>

              {/* Potassium */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#dae5dc] font-medium">Potassium (K) Content</span>
                  <span className="font-mono text-[#5bf06c] font-bold">{metrics.potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="205"
                  value={metrics.potassium}
                  onChange={(e) => handleSliderChange('potassium', Number(e.target.value))}
                  className="w-full accent-[#5bf06c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869582]">
                  <span>5 kg/ha</span>
                  <span>Optimal: 30-80</span>
                  <span>205 kg/ha</span>
                </div>
              </div>

              {/* pH */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#dae5dc] font-medium">Soil Acidity / Alkalinity (pH)</span>
                  <span className="font-mono text-[#5bf06c] font-bold">{metrics.ph.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="9.5"
                  step="0.1"
                  value={metrics.ph}
                  onChange={(e) => handleSliderChange('ph', Number(e.target.value))}
                  className="w-full accent-[#5bf06c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869582]">
                  <span>3.5 (Acidic)</span>
                  <span>6.5 - 7.5 (Neutral)</span>
                  <span>9.5 (Alkaline)</span>
                </div>
              </div>

              {/* Temperature */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#dae5dc] font-medium">Ambient Temperature</span>
                  <span className="font-mono text-[#5bf06c] font-bold">{metrics.temperature.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="45.0"
                  step="0.5"
                  value={metrics.temperature}
                  onChange={(e) => handleSliderChange('temperature', Number(e.target.value))}
                  className="w-full accent-[#5bf06c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869582]">
                  <span>8.0°C</span>
                  <span>Normal: 20-30°C</span>
                  <span>45.0°C</span>
                </div>
              </div>

              {/* Humidity */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#dae5dc] font-medium">Relative Humidity</span>
                  <span className="font-mono text-[#5bf06c] font-bold">{metrics.humidity}%</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="100"
                  value={metrics.humidity}
                  onChange={(e) => handleSliderChange('humidity', Number(e.target.value))}
                  className="w-full accent-[#5bf06c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869582]">
                  <span>14% (Arid)</span>
                  <span>50-80%</span>
                  <span>100% (Saturated)</span>
                </div>
              </div>

              {/* Rainfall */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#dae5dc] font-medium">Seasonal Rainfall Estimate</span>
                  <span className="font-mono text-[#5bf06c] font-bold">{metrics.rainfall} mm</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={metrics.rainfall}
                  onChange={(e) => handleSliderChange('rainfall', Number(e.target.value))}
                  className="w-full accent-[#5bf06c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869582]">
                  <span>20 mm (Drought)</span>
                  <span>100-200 mm</span>
                  <span>300 mm (Monsoon)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Model Output & Economic Analysis */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="p-6 md:p-8 rounded-3xl bg-[#141e18] border border-[#2d3731] shadow-2xl flex flex-col gap-6">
              {/* Output Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#222c26]">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#869582] font-space uppercase tracking-widest flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-[#5bf06c]" />
                    Best Recommended Crop
                  </span>
                  <h3 className="font-space text-3xl font-bold text-[#dae5dc]">
                    {recommendation.cropName}
                  </h3>
                  <span className="text-xs italic text-[#bccbb6]">
                    Botanical Name: {recommendation.latinName}
                  </span>
                </div>

                <span className="px-3 py-1.5 rounded-full bg-[#5bf06c]/20 text-[#5bf06c] font-space text-xs font-bold uppercase tracking-wider border border-[#5bf06c]/30">
                  {recommendation.profitBadge}
                </span>
              </div>

              {/* 4-Metric Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] flex flex-col gap-1">
                  <span className="text-xs text-[#869582] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#5bf06c]" />
                    Expected Harvest Yield
                  </span>
                  <span className="font-space text-lg font-bold text-[#dae5dc]">
                    {recommendation.yieldPotential}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] flex flex-col gap-1">
                  <span className="text-xs text-[#869582] flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-[#ffcb87]" />
                    Govt MSP / Mandi Rate
                  </span>
                  <span className="font-space text-lg font-bold text-[#ffcb87]">
                    {recommendation.mspRate}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] flex flex-col gap-1">
                  <span className="text-xs text-[#869582] flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-[#83da84]" />
                    Water Requirement
                  </span>
                  <span className="font-space text-base font-bold text-[#dae5dc]">
                    {recommendation.waterDemand}
                  </span>
                  <span className="text-[10px] text-[#869582]">{recommendation.waterDetail}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] flex flex-col gap-1">
                  <span className="text-xs text-[#869582] flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-[#5bf06c]" />
                    Estimated Profit / Acre
                  </span>
                  <span className="font-space text-lg font-bold text-[#5bf06c]">
                    {recommendation.netMargin}
                  </span>
                </div>
              </div>

              {/* Rationale */}
              <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#dae5dc]">Why this crop suits your field:</span>
                <p className="text-xs text-[#bccbb6] leading-relaxed">
                  {recommendation.rationale}
                </p>
              </div>

              {/* Alternative Crop */}
              <div className="p-3.5 rounded-2xl bg-[#1d2720] border border-[#2d3731] flex items-center justify-between text-xs">
                <span className="text-[#bccbb6]">
                  Second Best Choice: <strong className="text-[#dae5dc]">{recommendation.alternativeCrop}</strong>
                </span>
                <span className="font-mono text-[#5bf06c] font-bold">
                  {recommendation.alternativeMatch}% Match
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleSavePlan}
                  disabled={isSaving}
                  className={`h-11 px-5 rounded-xl font-space text-xs font-bold flex items-center gap-2 transition-all ${
                    saveSuccess
                      ? 'bg-[#5bf06c] text-[#00390c]'
                      : 'bg-[#222c26] hover:bg-[#2d3731] border border-[#3d4a3b] text-[#5bf06c]'
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-[#00390c]" />
                      <span>Saved in My Notebook!</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4 text-[#5bf06c]" />
                      <span>{isSaving ? 'Saving...' : 'Save Plan to My Notebook'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onAskKisanAI(recommendation.cropName, metrics)}
                  className="h-11 px-5 rounded-xl bg-[#5bf06c] text-[#00390c] font-space text-xs font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask Kisan Mitra About Sowing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

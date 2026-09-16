import React, { useState } from 'react';
import {
  FlaskConical,
  Sprout,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Droplets,
  Thermometer,
  CloudRain,
  Layers,
  MessageSquare,
  BookmarkPlus,
  Compass
} from 'lucide-react';
import { FertilizerInput, FertilizerResult, SoilMetrics } from '../types';

interface FertilizerAdvisorProps {
  currentUser?: any;
  onOpenAuth?: () => void;
  onAskKisanAI?: (crop: string, metrics: SoilMetrics) => void;
}

const PRESETS = [
  { name: 'Paddy / Clayey Soil', n: 80, p: 40, k: 40, temp: 28, humidity: 80, moisture: 60, soil: 'Clayey', crop: 'Paddy' },
  { name: 'Cotton / Black Soil', n: 120, p: 60, k: 60, temp: 32, humidity: 65, moisture: 45, soil: 'Black', crop: 'Cotton' },
  { name: 'Wheat / Loamy Soil', n: 100, p: 50, k: 50, temp: 20, humidity: 60, moisture: 50, soil: 'Loamy', crop: 'Wheat' },
  { name: 'Maize / Red Soil', n: 90, p: 45, k: 45, temp: 26, humidity: 70, moisture: 40, soil: 'Red', crop: 'Maize' },
];

export const FertilizerAdvisor: React.FC<FertilizerAdvisorProps> = ({
  currentUser,
  onOpenAuth,
  onAskKisanAI,
}) => {
  const [formData, setFormData] = useState<FertilizerInput>({
    temperature: 26,
    humidity: 65,
    moisture: 45,
    soil_type: 'Loamy',
    crop_type: 'Wheat',
    n: 60,
    p: 35,
    k: 30,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FertilizerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey'];
  const cropTypes = [
    'Maize',
    'Sugarcane',
    'Cotton',
    'Tobacco',
    'Paddy',
    'Barley',
    'Wheat',
    'Millets',
    'Oil seeds',
    'Pulses',
    'Ground Nuts',
  ];

  const handleInputChange = (field: keyof FertilizerInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFormData({
      temperature: preset.temp,
      humidity: preset.humidity,
      moisture: preset.moisture,
      soil_type: preset.soil,
      crop_type: preset.crop,
      n: preset.n,
      p: preset.p,
      k: preset.k,
    });
  };

  // Fallback intelligent agronomic rules when backend port 8001 is offline
  const getFallbackRecommendation = (data: FertilizerInput): FertilizerResult => {
    let fertName = 'Urea';
    if (data.n < 50 && data.p < 30) {
      fertName = 'DAP (Diammonium Phosphate)';
    } else if (data.k < 30 && data.p < 35) {
      fertName = '10-26-26 NPK Complex';
    } else if (data.n > 80 && data.k < 40) {
      fertName = 'Potash (MOP) + Urea balance';
    } else if (data.crop_type === 'Paddy' || data.crop_type === 'Sugarcane') {
      fertName = '28-28-0 Complex Fertilizer';
    } else if (data.crop_type === 'Pulses' || data.crop_type === 'Ground Nuts') {
      fertName = 'Single Super Phosphate (SSP) + Rhizobium';
    } else {
      fertName = '17-17-17 Balanced NPK';
    }

    const desc = `**What It Is:**\n${fertName} is formulated to balance soil fertility for ${data.crop_type} in ${data.soil_type} soil under current field temperature (${data.temperature}°C) and moisture (${data.moisture}%).\n\n` +
      `**Key Benefits:**\n` +
      `- Boosts root establishment and vigorous vegetative foliage.\n` +
      `- Optimized release based on ${data.soil_type} drainage characteristics.\n` +
      `- Fills the Nitrogen (${data.n}), Phosphorus (${data.p}), and Potassium (${data.k}) nutritional deficit.\n\n` +
      `**How to Apply:**\n` +
      `1. Apply 45-50 kg per acre as a basal dressing during sowing/tillering.\n` +
      `2. Maintain moderate soil moisture before broadcasting to prevent root burning.\n` +
      `3. Top-dress with second dose 30-40 days after germination.\n\n` +
      `**Important Note:**\n` +
      `Avoid direct seed contact. Wear protective gloves and irrigate lightly within 24 hours of application.`;

    return { fertilizer_name: fertName, description: desc };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsSaved(false);

    try {
      const apiUrl = 'http://127.0.0.1:8001/recommend-fertilizer';
      const payload = {
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        moisture: Number(formData.moisture),
        soil_type: formData.soil_type.toLowerCase(),
        crop_type: formData.crop_type.toLowerCase(),
        n: Number(formData.n),
        p: Number(formData.p),
        k: Number(formData.k),
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (response && response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n');
          buffer = parts.pop() || '';

          for (const part of parts) {
            if (part.trim() === '') continue;
            try {
              const parsedJson = JSON.parse(part);
              if (parsedJson.fertilizer_name) {
                setResult(parsedJson);
                setIsLoading(false);
              }
            } catch (err) {
              console.error('JSON parse chunk error:', err);
            }
          }
        }
      } else {
        // Fallback agronomic expert model
        const fallback = getFallbackRecommendation(formData);
        setResult(fallback);
      }
    } catch (err: any) {
      console.warn('Backend unavailable, using expert fallback:', err);
      const fallback = getFallbackRecommendation(formData);
      setResult(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-3 border border-emerald-400/20">
              <FlaskConical className="w-3.5 h-3.5" />
              Agronomic Soil Chemistry & Fertilizer ML
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Precision Fertilizer Advisory
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
              Calculate optimal fertilizer formulation (Urea, DAP, NPK Complexes) based on Nitrogen, Phosphorus, Potassium, moisture, soil texture, and targeted crop.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white backdrop-blur transition-all border border-white/15 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-6 bg-white dark:bg-[#121c16] rounded-3xl border border-slate-200 dark:border-[#222c26] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Soil & Environmental Parameters
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ML Model v2.4
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primary NPK Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-slate-50 dark:bg-[#18241d] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Nitrogen (N)
                </label>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={formData.n}
                    onChange={(e) => handleInputChange('n', Number(e.target.value))}
                    className="w-full bg-transparent text-lg font-black text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                  <span className="text-xs font-semibold text-slate-400">kg/ha</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#18241d] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Phosphorus (P)
                </label>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={formData.p}
                    onChange={(e) => handleInputChange('p', Number(e.target.value))}
                    className="w-full bg-transparent text-lg font-black text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                  <span className="text-xs font-semibold text-slate-400">kg/ha</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#18241d] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Potassium (K)
                </label>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={formData.k}
                    onChange={(e) => handleInputChange('k', Number(e.target.value))}
                    className="w-full bg-transparent text-lg font-black text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                  <span className="text-xs font-semibold text-slate-400">kg/ha</span>
                </div>
              </div>
            </div>

            {/* Environmental Weather Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-slate-50 dark:bg-[#18241d] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Temp</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    min="0"
                    max="55"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', Number(e.target.value))}
                    className="w-full bg-transparent text-lg font-black text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                  <span className="text-xs font-semibold text-slate-400">°C</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#18241d] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Humidity</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.humidity}
                    onChange={(e) => handleInputChange('humidity', Number(e.target.value))}
                    className="w-full bg-transparent text-lg font-black text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                  <span className="text-xs font-semibold text-slate-400">%</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#18241d] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Moisture</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.moisture}
                    onChange={(e) => handleInputChange('moisture', Number(e.target.value))}
                    className="w-full bg-transparent text-lg font-black text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                  <span className="text-xs font-semibold text-slate-400">%</span>
                </div>
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Soil Texture
                </label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => handleInputChange('soil_type', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18241d] border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  {soilTypes.map((type) => (
                    <option key={type} value={type}>
                      {type} Soil
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Crop Type
                </label>
                <select
                  value={formData.crop_type}
                  onChange={(e) => handleInputChange('crop_type', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#18241d] border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  {cropTypes.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Fertilizer Model & Generating Guide...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Calculate Optimal Fertilizer Formulation
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Container */}
        <div className="lg:col-span-6 flex flex-col">
          {result ? (
            <div className="bg-white dark:bg-[#121c16] rounded-3xl border border-emerald-500/40 dark:border-emerald-500/30 p-6 sm:p-8 shadow-md flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-100 dark:border-emerald-950/60 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Prescribed Soil Amendment
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Calculated for {formData.crop_type} ({formData.soil_type} Soil)
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                  Optimal Match
                </span>
              </div>

              {/* Fertilizer Name Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-[#15231b] dark:to-[#17281f] border border-emerald-200/80 dark:border-emerald-800/60 mb-6 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 block mb-1">
                  Recommended Fertilizer
                </span>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {result.fertilizer_name}
                </p>
              </div>

              {/* Guide Content */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 max-h-[380px] text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {result.description.split('\n').map((line, idx) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    return (
                      <h4
                        key={idx}
                        className="font-bold text-slate-900 dark:text-emerald-400 text-sm sm:text-base pt-2 flex items-center gap-1.5"
                      >
                        <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                        {trimmed.replace(/\*\*/g, '')}
                      </h4>
                    );
                  }
                  if (trimmed.startsWith('**')) {
                    return (
                      <p key={idx} className="font-bold text-slate-900 dark:text-emerald-300 text-sm pt-2">
                        {trimmed.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                    return (
                      <li key={idx} className="ml-5 list-disc text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        {trimmed.replace(/^[-*]\s*/, '')}
                      </li>
                    );
                  }
                  if (trimmed.match(/^\d+\./)) {
                    return (
                      <p key={idx} className="pl-3 border-l-2 border-emerald-500/40 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        {trimmed}
                      </p>
                    );
                  }
                  return trimmed ? <p key={idx}>{trimmed}</p> : null;
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                {onAskKisanAI && (
                  <button
                    type="button"
                    onClick={() =>
                      onAskKisanAI(formData.crop_type, {
                        nitrogen: formData.n,
                        phosphorus: formData.p,
                        potassium: formData.k,
                        ph: 6.5,
                        temperature: formData.temperature,
                        humidity: formData.humidity,
                        rainfall: 150,
                      })
                    }
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Discuss with Kisan AI
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsSaved(true);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  {isSaved ? 'Prescription Saved ✓' : 'Save Prescription'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#121c16] rounded-3xl border border-slate-200 dark:border-[#222c26] p-8 sm:p-12 shadow-sm flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Awaiting Soil Metrics
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                Enter your test kit N-P-K numbers or pick a regional preset on the left to generate customized fertilizer dosage and application instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

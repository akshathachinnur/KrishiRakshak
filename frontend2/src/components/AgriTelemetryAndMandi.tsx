import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Wifi, 
  Thermometer, 
  Droplets, 
  Radio, 
  AlertOctagon, 
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { LIVE_MANDI_DATA } from '../lib/agronomyData';

export const AgriTelemetryAndMandi: React.FC = () => {
  return (
    <section id="telemetry-suite" className="w-full bg-[#07100b] py-16 px-4 sm:px-6 lg:px-12 border-t border-[#18221c]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#222c26]">
          <div className="max-w-2xl flex flex-col gap-2">
            <span className="font-space text-xs font-bold text-[#5bf06c] uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#5bf06c]" />
              Today's Mandi Rates &amp; Farm Weather
            </span>
            <h2 className="font-space text-3xl sm:text-4xl font-bold text-[#dae5dc] tracking-tight">
              Live Mandi Rates &amp; Crop Weather Alerts
            </h2>
            <p className="text-sm text-[#bccbb6] leading-relaxed">
              Check real-time APMC Mandi commodity rates across Indian markets and fungal disease risk forecasts before you spray fertilizers or pesticides.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-2xl bg-[#141e18] border border-[#222c26] text-xs text-[#5bf06c]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>4,800+ Mandis Live Rates</span>
          </div>
        </div>

        {/* Top Split: Mandi Price Ticker Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-space text-lg font-bold text-[#dae5dc] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#5bf06c]" />
              Today's Mandi Market Rates (आज के मंडी भाव)
            </h3>
            <span className="text-xs text-[#869582]">Updated Daily</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIVE_MANDI_DATA.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#141e18] border border-[#222c26] hover:border-[#3d4a3b] transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-space text-base font-bold text-[#dae5dc]">
                      {item.commodity}
                    </h4>
                    <p className="text-xs text-[#869582]">{item.variety} • {item.mandi}</p>
                    <span className="text-[10px] text-[#5bf06c] font-medium">{item.state}</span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 ${
                      item.trend === 'up'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-[#5bf06c] border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-700 dark:text-[#ffb4ab] border border-rose-500/30'
                    }`}
                  >
                    {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {item.trend === 'up' ? `+₹${item.change}` : `-₹${Math.abs(item.change)}`}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-[#222c26]">
                  <span className="text-xs text-[#bccbb6]">Mandi Price:</span>
                  <span className="font-space text-xl font-bold text-[#dae5dc]">
                    ₹{item.modalPrice.toLocaleString('en-IN')}{' '}
                    <span className="text-xs text-[#869582] font-normal">/ quintal</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Split: Spore Risk Gauge & Soil Health Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          {/* Micro-Climate Spore Risk Radial Gauge */}
          <div className="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-[#141e18] border border-[#2d3731] border-t-4 border-t-rose-500 shadow-xl flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#222c26]">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-amber-500" />
                <h3 className="font-space text-lg font-bold text-[#dae5dc]">
                  Fungal Disease &amp; Spore Alert
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-[#ffb4ab] text-[10px] font-bold uppercase border border-rose-500/30">
                High Humidity Alert
              </span>
            </div>

            {/* Radial SVG Gauge */}
            <div className="relative flex flex-col items-center justify-center my-2">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="#222c26"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="#ef4444"
                  strokeWidth="10"
                  strokeDasharray="301.59"
                  strokeDashoffset="84" /* ~72% */
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-space text-4xl font-bold text-rose-600 dark:text-[#ffb4ab]">72%</span>
                <span className="text-xs text-[#bccbb6] font-medium">Disease Risk Index</span>
              </div>
            </div>

            {/* Risk details */}
            <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] text-xs text-[#bccbb6] flex flex-col gap-2">
              <div className="flex items-center justify-between font-semibold text-[#dae5dc]">
                <span>Air Humidity: 86%</span>
                <span>Safe Limit: Under 75%</span>
              </div>
              <p>
                Continuous morning fog and leaf-wetness duration over 14 hours create high conditions for blight, rust, and leaf spot spread.
              </p>
              <div className="pt-2 text-[11px] text-emerald-600 dark:text-[#5bf06c] font-medium flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                Spray preventative organic Neem oil or copper fungicide before next rainfall.
              </div>
            </div>
          </div>

          {/* Farm Soil Health Conditions */}
          <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-[#141e18] border border-[#2d3731] border-t-4 border-t-emerald-500 shadow-xl flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#222c26]">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-emerald-500" />
                <h3 className="font-space text-lg font-bold text-[#dae5dc]">
                  Soil Moisture &amp; Field Conditions
                </h3>
              </div>
              <span className="text-xs text-[#869582] font-semibold">Live Field Telemetry</span>
            </div>

            {/* 4 Sensor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] border-t-2 border-t-sky-500 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#869582] font-semibold">Root Zone Moisture</span>
                  <Droplets className="w-4 h-4 text-sky-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-space text-2xl font-bold text-[#dae5dc]">28.4%</span>
                  <span className="text-xs text-emerald-600 dark:text-[#5bf06c] font-bold">Good Moisture</span>
                </div>
                <span className="text-[10px] text-[#869582]">Root depth: 15cm • No immediate watering needed</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] border-t-2 border-t-amber-500 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#869582] font-semibold">Soil Salt / Fertilizer Level</span>
                  <Activity className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-space text-2xl font-bold text-[#dae5dc]">1.2 <span className="text-sm font-normal text-[#869582]">dS/m</span></span>
                  <span className="text-xs text-emerald-600 dark:text-[#5bf06c] font-bold">Normal Fertility</span>
                </div>
                <span className="text-[10px] text-[#869582]">Balanced chemical salts, safe for root growth</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] border-t-2 border-t-rose-500 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#869582] font-semibold">Soil Bed Temperature</span>
                  <Thermometer className="w-4 h-4 text-rose-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-space text-2xl font-bold text-[#dae5dc]">21.8°C</span>
                  <span className="text-xs text-emerald-600 dark:text-[#bccbb6] font-bold">Ideal for Roots</span>
                </div>
                <span className="text-[10px] text-[#869582]">Good for beneficial earthworms and soil microbes</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] border-t-2 border-t-emerald-500 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#869582] font-semibold">Sunlight &amp; Daylight Hours</span>
                  <Radio className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-space text-2xl font-bold text-[#dae5dc]">7.8 <span className="text-sm font-normal text-[#869582]">hrs</span></span>
                  <span className="text-xs text-emerald-600 dark:text-[#5bf06c] font-bold">Good Sun</span>
                </div>
                <span className="text-[10px] text-[#869582]">Adequate light for leaf photosynthesis</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1d2720] border border-[#2d3731] flex items-center justify-between text-xs text-[#bccbb6]">
              <span>Recommended Spray Time: <strong>Early Morning (6:00 AM - 9:00 AM) or Late Evening (4:30 PM - 6:30 PM)</strong></span>
              <span className="text-[#5bf06c] font-semibold">Avoid Noon Sun</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

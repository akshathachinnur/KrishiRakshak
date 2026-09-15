import React from 'react';
import { 
  Scan, 
  Cpu, 
  Volume2, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Sparkles, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onLaunchDiagnostic: () => void;
  onSimulateML: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchDiagnostic,
  onSimulateML,
}) => {
  const { t } = useLanguage();
  return (
    <div className="relative w-full overflow-hidden">
      {/* Subtle Ambient Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#5bf06c]/10 blur-[130px] pointer-events-none -z-10"></div>
      <div className="absolute top-48 right-10 w-[30rem] h-[30rem] rounded-full bg-[#f8a826]/10 blur-[150px] pointer-events-none -z-10"></div>

      {/* Telemetry System Ticker Bar */}
      <div className="w-full bg-slate-100/90 border-b border-slate-200 dark:bg-[#07100b]/80 dark:border-[#18221c] backdrop-blur-md px-4 sm:px-6 lg:px-12 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-[#5bf06c]/15 dark:text-[#5bf06c] dark:border-[#5bf06c]/30 font-space text-[11px] font-bold uppercase tracking-wider border">
              KISAN MITRA 24x7
            </span>
            <span className="text-xs text-slate-600 dark:text-[#bccbb6] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-[#5bf06c] animate-pulse"></span>
              {t.nav.freeBadge}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-slate-600 dark:text-[#bccbb6]">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-700 dark:text-[#5bf06c] font-bold">98%</span>
              <span>Accurate Check</span>
            </div>
            <span className="text-slate-300 dark:text-[#3d4a3b]">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-700 dark:text-[#5bf06c] font-bold">38+</span>
              <span>Crop Diseases</span>
            </div>
            <span className="text-slate-300 dark:text-[#3d4a3b]">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sky-700 dark:text-[#83da84] font-bold">4,800+ Mandis</span>
              <span>Live Rates</span>
            </div>
            <span className="text-slate-300 dark:text-[#3d4a3b]">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-700 dark:text-[#ffcb87] font-bold">6 Languages</span>
              <span>Voice Support</span>
            </div>
          </div>

          <a 
            href="tel:18001801551" 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-xs text-amber-700 dark:text-[#ffcb87] font-semibold hover:bg-amber-500/25 transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
            <span>Kisan Call Center: <strong>1800-180-1551</strong></span>
          </a>
        </div>
      </div>

      {/* HERO MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-16 lg:pt-14 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-[#5bf06c] font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#5bf06c]" />
              <span className="font-space text-xs uppercase tracking-widest font-bold">
                SMART CROP DOCTOR • KISAN COMPANION
              </span>
            </div>

            <h1 className="font-space text-4xl sm:text-5xl lg:text-[54px] font-bold text-slate-900 dark:text-[#dae5dc] tracking-tight leading-[1.08]">
              {t.hero.headline1} <br />
              <span className="text-emerald-700 dark:text-[#5bf06c]">{t.hero.headline2}</span>
            </h1>

            <p className="text-base text-slate-600 dark:text-[#bccbb6] max-w-xl leading-relaxed">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchDiagnostic}
                className="h-[52px] px-7 rounded-2xl bg-[#39d353] text-[#00390c] font-space text-base font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(57,211,83,0.38)] hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <Scan className="w-5 h-5" />
                <span>{t.hero.btnDiagnose}</span>
              </button>

              <button
                onClick={onSimulateML}
                className="h-[52px] px-6 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 dark:bg-[#222c26] dark:hover:bg-[#2d3731] dark:border-[#3d4a3b] dark:text-[#dae5dc] font-space text-base font-semibold flex items-center gap-2.5 transition-colors shadow-sm"
              >
                <Cpu className="w-5 h-5 text-emerald-700 dark:text-[#5bf06c]" />
                <span>{t.hero.btnCropML}</span>
              </button>
            </div>

            {/* Quick Telemetry Badges Strip */}
            <div className="w-full pt-6 mt-2 grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 dark:bg-[#141e18] dark:border-[#222c26] border-t-2 border-t-emerald-500 flex flex-col gap-1 shadow-sm">
                <span className="font-space text-2xl font-bold text-emerald-700 dark:text-[#dae5dc]">{t.hero.stat1Val}</span>
                <span className="text-xs text-slate-600 dark:text-[#bccbb6] font-medium">{t.hero.stat1Lbl}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 dark:bg-[#141e18] dark:border-[#222c26] border-t-2 border-t-sky-500 flex flex-col gap-1 shadow-sm">
                <span className="font-space text-2xl font-bold text-sky-700 dark:text-[#5bf06c]">{t.hero.stat2Val}</span>
                <span className="text-xs text-slate-600 dark:text-[#bccbb6] font-medium">{t.hero.stat2Lbl}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 dark:bg-[#141e18] dark:border-[#222c26] border-t-2 border-t-amber-500 flex flex-col gap-1 shadow-sm">
                <span className="font-space text-2xl font-bold text-amber-700 dark:text-[#ffcb87]">{t.hero.stat3Val}</span>
                <span className="text-xs text-slate-600 dark:text-[#bccbb6] font-medium">{t.hero.stat3Lbl}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Diagnostic HUD Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden bg-[#07100b] border border-[#2d3731] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] group">
              {/* Reference Image Hero Placement */}
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  alt="KrishiRakshak AI Diagnostic scanning soybean leaf with glowing neural grid overlay"
                  className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VwCB9VY5ixcoI9Jo1iuHrH1zGHExWConAUzSVjdnXoKOK3QLpBqL4PTboHWLdGtCzh_jZTFrwrPM1hy9-nni9eCYPsByhTvJpIdBeevEfYPGhUZnJqj-uVXYKxZp4J1L8x-j6MGn9PS7Xe4zp_u7vz-uh-_fQ3_NpStDvsjQAWh3XHXkIXtJHRMNzFnNb1cZ-9pbzslWWPeP4Zqm9m4Y9oUwPC157Yp9V6dWEvJqtSmwcK840CmDQb7bs"
                />

                {/* Laser Scanning Beam Animation */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#5bf06c] to-transparent shadow-[0_0_15px_#5bf06c] animate-scan-line pointer-events-none"></div>

                {/* Top Left Diagnostic Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 border border-slate-200 dark:bg-[#0c1510]/80 dark:text-[#dae5dc] dark:border-[#2d3731] shadow-md backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#5bf06c] animate-ping"></span>
                  <span className="font-space text-[10px] uppercase tracking-wider font-bold">
                    PLANT DOCTOR • ACTIVE
                  </span>
                </div>

                {/* Top Right Voice Playback Pill */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-800 border border-slate-200 dark:bg-[#0c1510]/80 dark:text-[#dae5dc] dark:border-[#2d3731] shadow-md backdrop-blur-md">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#5bf06c]" />
                  <span className="text-xs font-semibold">हिंदी / ಕನ್ನಡ / తెలుగు / English</span>
                </div>

                {/* In-Image HUD Telemetry Overlay */}
                <div className="absolute bottom-5 inset-x-5 z-10 p-4 rounded-2xl bg-white/95 text-slate-900 border border-slate-200 shadow-2xl backdrop-blur-xl dark:bg-[#0c1510]/90 dark:text-[#dae5dc] dark:border-[#2d3731]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222c26]">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="text-emerald-600 dark:text-[#5bf06c] w-5 h-5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-[#dae5dc] leading-tight">Soybean Crop (सोयाबीन)</h4>
                        <p className="text-xs text-emerald-700 dark:text-[#5bf06c] font-semibold">Healthy Leaf • 98.7% Confirmed</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#5bf06c]/20 dark:text-[#5bf06c] dark:border-[#5bf06c]/30 font-space text-[11px] font-bold uppercase">
                      Healthy
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-500 dark:text-[#869582] font-medium">Greenness</span>
                      <span className="text-sm text-slate-900 dark:text-[#dae5dc] font-bold">High</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-500 dark:text-[#869582] font-medium">Moisture</span>
                      <span className="text-sm text-slate-900 dark:text-[#dae5dc] font-bold">76%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-500 dark:text-[#869582] font-medium">Spot Risk</span>
                      <span className="text-sm text-emerald-700 dark:text-[#83da84] font-bold">Low</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-500 dark:text-[#869582] font-medium">Leaf Temp</span>
                      <span className="text-sm text-slate-900 dark:text-[#dae5dc] font-bold">22.4°C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Bottom Bar with Pipeline status */}
              <div className="p-4 bg-slate-100 border-t border-slate-200 text-slate-700 dark:bg-[#18221c] dark:border-[#222c26] dark:text-[#bccbb6] flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700 dark:text-[#5bf06c]" />
                  Includes Safe Organic &amp; Market Medicine Recommendations
                </span>
                <span className="text-emerald-700 dark:text-[#5bf06c] font-semibold">100% Free Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

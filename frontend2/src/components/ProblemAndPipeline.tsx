import React from 'react';
import { 
  CloudRain, 
  AlertTriangle, 
  FlaskConical, 
  Languages, 
  ShieldCheck, 
  Camera, 
  Cpu, 
  Combine, 
  Volume2 
} from 'lucide-react';

export const ProblemAndPipeline: React.FC = () => {
  return (
    <section className="w-full bg-[#07100b] py-20 px-4 sm:px-6 lg:px-12 border-y border-[#18221c]">
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-3">
            <span className="font-space text-xs font-bold text-[#5bf06c] uppercase tracking-widest">
              Everyday Farming Solutions
            </span>
            <h2 className="font-space text-2xl sm:text-3xl lg:text-4xl font-bold text-[#dae5dc] tracking-tight">
              Common Crop Problems We Help You Solve
            </h2>
            <p className="text-base text-[#bccbb6] leading-relaxed">
              Every season, farmers lose hard-earned income to undetected crop diseases and wrong spray dosages. KrishiRakshak gives you immediate, trusted answers directly in your field.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-[#18221c] border border-[#2d3731] text-[#dae5dc] text-xs font-medium">
            <ShieldCheck className="text-[#5bf06c] w-4 h-4" />
            <span>Trusted Agricultural Advisory</span>
          </div>
        </div>

        {/* Problem Breakdown 4-Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-[#141e18] border border-[#222c26] border-t-4 border-t-sky-500 flex flex-col gap-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <h3 className="font-space text-lg font-bold text-[#dae5dc]">Uncertain Weather</h3>
            <p className="text-xs text-[#bccbb6] leading-relaxed">
              Sudden rains or dry spells can ruin newly sown crops. Get soil moisture and season-smart crop recommendations before you buy seeds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141e18] border border-[#222c26] border-t-4 border-t-amber-500 flex flex-col gap-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-space text-lg font-bold text-[#dae5dc]">Late Disease Detection</h3>
            <p className="text-xs text-[#bccbb6] leading-relaxed">
              Yellow spots or curling leaves are often noticed only after spreading across the whole field. Spot fungus or bacterial blight within 5 seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141e18] border border-[#222c26] border-t-4 border-t-emerald-500 flex flex-col gap-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="font-space text-lg font-bold text-[#dae5dc]">Over-Fertilizer Expenses</h3>
            <p className="text-xs text-[#bccbb6] leading-relaxed">
              Excess Urea and chemical fertilizers harden your soil and waste money. Learn exact chemical dosages alongside low-cost organic alternatives.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141e18] border border-[#222c26] border-t-4 border-t-purple-500 flex flex-col gap-4 hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="font-space text-lg font-bold text-[#dae5dc]">Language Barriers</h3>
            <p className="text-xs text-[#bccbb6] leading-relaxed">
              Most science bulletins are written in complex English. KrishiRakshak speaks directly to you in Hindi, Kannada, Telugu, or English.
            </p>
          </div>
        </div>

        {/* Pipeline Stepper Flow */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#18221c] border border-[#2d3731] flex flex-col gap-8 shadow-xl">
          <div className="flex flex-col gap-1">
            <span className="font-space text-xs font-bold text-[#83da84] uppercase tracking-widest">
              Simple 4-Step Guide
            </span>
            <h3 className="font-space text-xl font-bold text-[#dae5dc]">
              How to Check Your Crop in Seconds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="flex flex-col gap-3 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#10b981] text-white font-space font-bold text-sm flex items-center justify-center shadow-md">
                  1
                </div>
                <span className="font-space text-base font-bold text-[#dae5dc] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#059669]" />
                  Take Leaf Photo
                </span>
              </div>
              <p className="text-xs text-[#bccbb6] leading-relaxed pl-11 md:pl-0">
                Snap a clear picture of the damaged or spotted leaf using your mobile phone camera or choose one from your gallery.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-3 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white font-space font-bold text-sm flex items-center justify-center shadow-md">
                  2
                </div>
                <span className="font-space text-base font-bold text-[#dae5dc] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#0284c7]" />
                  Instant Disease Check
                </span>
              </div>
              <p className="text-xs text-[#bccbb6] leading-relaxed pl-11 md:pl-0">
                The smart assistant checks the spots and identifies if your crop has blight, fungal rust, mildew, or nutrient deficiency.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-3 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d97706] text-white font-space font-bold text-sm flex items-center justify-center shadow-md">
                  3
                </div>
                <span className="font-space text-base font-bold text-[#dae5dc] flex items-center gap-1.5">
                  <Combine className="w-4 h-4 text-[#d97706]" />
                  Get Safe Cures &amp; Spray
                </span>
              </div>
              <p className="text-xs text-[#bccbb6] leading-relaxed pl-11 md:pl-0">
                Receive natural organic home remedies (neem oil, chaas) and trusted store spray dosages (e.g. 2 grams per liter water).
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col gap-3 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] text-white font-space font-bold text-sm flex items-center justify-center shadow-md">
                  4
                </div>
                <span className="font-space text-base font-bold text-[#dae5dc] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#7c3aed]" />
                  Listen Spoken Aloud
                </span>
              </div>
              <p className="text-xs text-[#bccbb6] leading-relaxed pl-11 md:pl-0">
                Tap the speaker icon to hear the medicine instructions spoken aloud in your own mother tongue without reading small text.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

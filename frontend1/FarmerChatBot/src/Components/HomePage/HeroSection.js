import React from "react";
import { Link } from "react-router-dom";
import { 
  Camera, 
  Leaf, 
  Sprout, 
  FlaskConical, 
  CloudSun, 
  ArrowRight, 
  ShieldCheck 
} from "lucide-react";
import bgImage from "./Images/Hero.jpg";
import { useLanguage } from "../../context/LanguageContext";

function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden">
      {/* Background Image with optimized farmer-friendly contrast overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-black/60 backdrop-blur-[1px]"></div>
      </div>

      {/* Main Hero Container - Centered / High Impact */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-16 flex-grow flex items-center">
        <div className="max-w-3xl text-white space-y-7">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <span className="text-xs sm:text-sm font-semibold text-emerald-200">
              {t("heroBadge")}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            {t("heroTitle1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-200">
              {t("heroTitle2")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-emerald-100/90 leading-relaxed font-normal">
            {t("heroSubtitle")}
          </p>

          {/* 3 Simple Farmer Steps */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 max-w-xl">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shadow-md">
              <span className="text-3xl">📸</span>
              <p className="text-sm font-bold text-white mt-1">{t("step1Title")}</p>
              <p className="text-xs text-emerald-200 font-medium">{t("step1Desc")}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shadow-md">
              <span className="text-3xl">🤖</span>
              <p className="text-sm font-bold text-white mt-1">{t("step2Title")}</p>
              <p className="text-xs text-emerald-200 font-medium">{t("step2Desc")}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shadow-md">
              <span className="text-3xl">💊</span>
              <p className="text-sm font-bold text-white mt-1">{t("step3Title")}</p>
              <p className="text-xs text-emerald-200 font-medium">{t("step3Desc")}</p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/PredictionIndex"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-base sm:text-xl
                bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-300 hover:from-lime-300 hover:to-emerald-300 
                text-emerald-950 shadow-2xl shadow-emerald-950/60 hover:shadow-lime-400/40 transition-all duration-300 transform hover:-translate-y-1"
            >
              <Camera className="w-7 h-7 text-emerald-950" />
              <span>{t("btnScanDisease")}</span>
              <ArrowRight className="w-6 h-6 ml-1" />
            </Link>

            <Link
              to="/RecommendIndex"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 sm:py-5 rounded-2xl font-semibold text-base
                bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md shadow-md transition-all duration-300"
            >
              <Sprout className="w-6 h-6 text-lime-300" />
              <span>{t("btnCropAdvisory")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Farmer Quick Access Bar */}
      <div className="relative z-10 w-full bg-emerald-950/90 backdrop-blur-md border-t border-emerald-800/40 py-4 px-4 sm:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
            
            <Link 
              to="/PredictionIndex"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 transition group"
            >
              <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-lg group-hover:scale-110 transition">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">{t("shortDisease")}</h4>
                <p className="text-[11px] text-emerald-300">{t("shortDiseaseDesc")}</p>
              </div>
            </Link>

            <Link 
              to="/RecommendIndex"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 transition group"
            >
              <div className="p-2.5 bg-lime-500/20 text-lime-300 rounded-lg group-hover:scale-110 transition">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">{t("shortCrop")}</h4>
                <p className="text-[11px] text-lime-300">{t("shortCropDesc")}</p>
              </div>
            </Link>

            <Link 
              to="/FertilizerForm"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 transition group"
            >
              <div className="p-2.5 bg-sky-500/20 text-sky-300 rounded-lg group-hover:scale-110 transition">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">{t("shortFertilizer")}</h4>
                <p className="text-[11px] text-sky-300">{t("shortFertilizerDesc")}</p>
              </div>
            </Link>

            <Link 
              to="/WeatherForecastIndex"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 transition group"
            >
              <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-lg group-hover:scale-110 transition">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">{t("shortWeather")}</h4>
                <p className="text-[11px] text-amber-300">{t("shortWeatherDesc")}</p>
              </div>
            </Link>

          </div>
        </div>
      </div>

    </section>
  );
}

export default HeroSection;

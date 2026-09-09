import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldAlert, 
  FlaskConical, 
  Mic, 
  Sprout, 
  ArrowRight 
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function FeaturesSection() {
  const { t } = useLanguage();

  const farmerFeatures = [
    {
      id: 1,
      icon: <ShieldAlert className="w-7 h-7 text-emerald-400" />,
      title: t("f1Title"),
      sub: t("f1Sub"),
      description: t("f1Desc"),
      link: "/PredictionIndex",
      badge: "AI Doctor",
    },
    {
      id: 2,
      icon: <FlaskConical className="w-7 h-7 text-lime-400" />,
      title: t("f2Title"),
      sub: t("f2Sub"),
      description: t("f2Desc"),
      link: "/FertilizerForm",
      badge: "Cost Saver",
    },
    {
      id: 3,
      icon: <Sprout className="w-7 h-7 text-teal-400" />,
      title: t("f3Title"),
      sub: t("f3Sub"),
      description: t("f3Desc"),
      link: "/RecommendIndex",
      badge: "High Yield",
    },
    {
      id: 4,
      icon: <Mic className="w-7 h-7 text-amber-400" />,
      title: t("f4Title"),
      sub: t("f4Sub"),
      description: t("f4Desc"),
      link: "/",
      badge: "Farmer Friendly",
    },
  ];

  return (
    <section className="w-full bg-emerald-950 text-gray-100 py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-semibold border border-emerald-500/30">
            {t("featBadge")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t("featHeading")}
          </h2>
          <p className="text-base sm:text-lg text-emerald-200/80">
            {t("featSubheading")}
          </p>
        </div>

        {/* Features Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {farmerFeatures.map((feat) => (
            <div
              key={feat.id}
              className="bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-800/60 hover:border-emerald-500/50 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 bg-emerald-800/60 rounded-2xl group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-lime-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-emerald-300/90 font-medium mt-0.5">
                    {feat.sub}
                  </p>
                </div>

                <p className="text-sm text-emerald-100/75 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  to={feat.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-lime-400 hover:text-lime-300 transition"
                >
                  Explore <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

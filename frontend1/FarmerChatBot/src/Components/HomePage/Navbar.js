import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, Check, Globe } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const { currentLang, changeLanguage, translations } = useLanguage();

  // Scroll effect for shadow and blur adjustment
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Language options
  const languageList = [
    { key: "marathi", name: "मराठी (Marathi)" },
    { key: "english", name: "English" },
    { key: "kannada", name: "ಕನ್ನಡ (Kannada)" },
    { key: "hindi", name: "हिन्दी (Hindi)" },
    { key: "telugu", name: "తెలుగు (Telugu)" },
    { key: "tamil", name: "தமிழ் (Tamil)" },
  ];

  const menuLinks = [
    { path: "/", name: "Home" },
    { path: "/BlogsIndex", name: "Blog" },
    { path: "/CommunityIndex", name: "Community" },
    { path: "/WeatherForecastIndex", name: "Weather" },
    { path: "/MarketPlaceIndex", name: "Market Tracker" },
  ];

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-1.5 border-b border-gray-200/70"
          : "bg-white/85 backdrop-blur-sm shadow-2xs py-2 border-b border-gray-100/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 group transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 flex items-center justify-center text-white font-bold text-base shadow-xs group-hover:shadow-emerald-300/40">
              🌿
            </div>
            <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 bg-clip-text text-transparent tracking-tight">
              KrishiRakshak
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-4 xl:gap-6 text-gray-700 text-xs font-semibold">
            {menuLinks.map(({ path, name }) => {
              const isActive = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`relative py-1 px-0.5 transition-colors duration-200 tracking-wide
                      after:block after:h-[2px] after:bg-emerald-600 after:transition-all after:duration-300 
                      after:absolute after:bottom-0 after:left-0
                      ${
                        isActive
                          ? "text-emerald-700 font-bold after:w-full"
                          : "text-gray-600 hover:text-emerald-600 after:w-0 hover:after:w-full"
                      }`}
                  >
                    {name}
                  </Link>
                </li>
              );
            })}

            {/* Languages Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all duration-200 shadow-2xs ${
                  dropdownOpen
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200/50"
                    : "border-gray-200 hover:border-emerald-400 text-gray-700 bg-white hover:bg-emerald-50/40"
                }`}
                aria-expanded={dropdownOpen}
              >
                <Globe size={13} className="text-emerald-600" />
                <span>{translations[currentLang]?.name || "Language"}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180 text-emerald-600" : "text-gray-400"
                  }`}
                />
              </button>

              {dropdownOpen && (
                <ul className="absolute left-0 mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50 animate-fadeIn text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Language / भाषा
                  </div>
                  {languageList.map(({ key, name }) => (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => {
                          changeLanguage(key);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-1.5 text-xs font-medium text-left transition ${
                          currentLang === key
                            ? "bg-emerald-50 text-emerald-800 font-bold"
                            : "text-gray-700 hover:bg-emerald-50/60"
                        }`}
                      >
                        <span>{name}</span>
                        {currentLang === key && (
                          <Check size={13} className="text-emerald-600" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          {/* Right Side CTA Buttons & Profile */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 flex-shrink-0">
            <Link
              to="/PredictionIndex"
              className={`px-3 py-1 text-xs font-semibold rounded-full text-white shadow-2xs hover:shadow-xs transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap ${
                location.pathname === "/PredictionIndex"
                  ? "bg-emerald-700 ring-2 ring-emerald-300"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              Disease Predict
            </Link>

            <Link
              to="/FertilizerForm"
              className={`px-3 py-1 text-xs font-semibold rounded-full text-white shadow-2xs hover:shadow-xs transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap ${
                location.pathname === "/FertilizerForm"
                  ? "bg-emerald-700 ring-2 ring-emerald-300"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              Fertilization
            </Link>

            <Link
              to="/RecommendIndex"
              className={`px-3 py-1 text-xs font-semibold rounded-full text-white shadow-2xs hover:shadow-xs transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap ${
                location.pathname === "/RecommendIndex"
                  ? "bg-emerald-700 ring-2 ring-emerald-300"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              Recommend
            </Link>

            <Link
              to="/profile"
              className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200/60 hover:border-emerald-300 transition-colors shadow-2xs"
              title="Farmer Profile"
            >
              <User size={15} />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <Link
              to="/profile"
              className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 border border-gray-200"
            >
              <User size={15} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Toggle Navigation Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl px-5 py-6 animate-fadeIn">
          <ul className="flex flex-col gap-4 text-gray-700 text-sm font-medium">
            {menuLinks.map(({ path, name }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-xl font-semibold transition ${
                    location.pathname === path
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}

            {/* Mobile Language Selector */}
            <li className="pt-3 border-t border-gray-100">
              <span className="block px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Select Language / भाषा
              </span>
              <div className="grid grid-cols-2 gap-2">
                {languageList.map(({ key, name }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      changeLanguage(key);
                      setOpen(false);
                    }}
                    className={`px-3 py-2 text-xs rounded-xl border text-left flex items-center justify-between transition ${
                      currentLang === key
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-emerald-50/40"
                    }`}
                  >
                    <span>{name}</span>
                    {currentLang === key && <Check size={14} className="text-emerald-700" />}
                  </button>
                ))}
              </div>
            </li>

            {/* Mobile Action Buttons */}
            <li className="flex flex-col gap-2.5 pt-3 border-t border-gray-100">
              <Link
                to="/PredictionIndex"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm text-center"
              >
                Disease Predict
              </Link>
              <Link
                to="/FertilizerForm"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm text-center"
              >
                Fertilization
              </Link>
              <Link
                to="/RecommendIndex"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm text-center"
              >
                Recommend
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;

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

  const { currentLang, changeLanguage, t, translations } = useLanguage();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
        scrolled ? "shadow-xl" : ""
      }`}
    >
      <nav
        className={`flex items-center justify-between px-6 md:px-12 py-4 rounded-b-2xl border 
          transition-all duration-500
          ${
            scrolled
              ? "bg-white/90 backdrop-blur-md border-gray-200/50"
              : "bg-white/80 backdrop-blur-sm border-gray-200/30"
          }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-400 flex items-center justify-center text-white font-black text-lg shadow-md">
            🌿
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
            AgroSage
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-7 text-gray-700 font-medium text-sm">
          {menuLinks.map(({ path, name }) => (
            <li key={path}>
              <Link
                to={path}
                className={`relative transition-colors duration-300 
                  after:block after:h-[2px] after:w-0 after:bg-emerald-600 
                  after:transition-all after:duration-300 hover:after:w-full 
                  after:absolute after:-bottom-1 after:left-0
                  ${
                    location.pathname === path
                      ? "text-emerald-600 after:w-full font-bold"
                      : "hover:text-emerald-600"
                  }`}
              >
                {name}
              </Link>
            </li>
          ))}

          {/* Languages Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                dropdownOpen
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold"
                  : "border-gray-200 hover:border-emerald-400 text-gray-700 bg-white"
              }`}
            >
              <Globe size={15} className="text-emerald-600" />
              <span>{translations[currentLang]?.name || "Language"}</span>
              <ChevronDown size={14} />
            </button>

            {dropdownOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Language / भाषा
                </div>
                {languageList.map(({ key, name }) => (
                  <li key={key}>
                    <button
                      onClick={() => {
                        changeLanguage(key);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition ${
                        currentLang === key
                          ? "bg-emerald-50 text-emerald-800 font-bold"
                          : "text-gray-700 hover:bg-emerald-50/60"
                      }`}
                    >
                      <span>{name}</span>
                      {currentLang === key && (
                        <Check size={16} className="text-emerald-600" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Right Side: Disease Predict + Fertilization Form + Recommend + Profile */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/PredictionIndex"
            className="px-4 py-2 text-sm font-semibold rounded-full 
              bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 
              text-white shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Disease Predict
          </Link>

          <Link
            to="/FertilizerForm"
            className="px-4 py-2 text-sm font-semibold rounded-full 
              bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 
              text-white shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Fertilization
          </Link>

          <Link
            to="/RecommendIndex"
            className="px-5 py-2 text-sm font-semibold rounded-full 
              bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 
              text-white shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Recommend
          </Link>
          <Link to="/profile" className="p-2 rounded-full hover:bg-green-100 transition">
            <User size={24} className="text-gray-800" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center text-gray-800 p-1"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {open && (
        <div
          className="md:hidden absolute top-[72px] left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 
            shadow-xl px-6 py-6 animate-fadeIn"
        >
          <ul className="flex flex-col gap-5 text-gray-700 text-base font-medium">
            {menuLinks.map(({ path, name }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`${
                    location.pathname === path
                      ? "text-emerald-600 font-bold"
                      : "hover:text-emerald-600"
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}

            {/* Language options in mobile */}
            <li className="pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-800 text-sm">Select Language / भाषा</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {languageList.map(({ key, name }) => (
                  <button
                    key={key}
                    onClick={() => {
                      changeLanguage(key);
                      setOpen(false);
                    }}
                    className={`px-3 py-2 text-xs rounded-xl border text-left flex items-center justify-between ${
                      currentLang === key
                        ? "bg-emerald-100 border-emerald-500 text-emerald-900 font-bold"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <span>{name}</span>
                    {currentLang === key && <Check size={14} className="text-emerald-700" />}
                  </button>
                ))}
              </div>
            </li>

            {/* Action Buttons in Mobile */}
            <li className="flex flex-col gap-2 pt-2">
              <Link
                to="/PredictionIndex"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl 
                  bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow text-center"
              >
                Disease Predict
              </Link>
              <Link
                to="/FertilizerForm"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl 
                  bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow text-center"
              >
                Fertilization
              </Link>
              <Link
                to="/RecommendIndex"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl 
                  bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow text-center"
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

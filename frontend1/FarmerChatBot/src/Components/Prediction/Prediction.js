import React, { useState, useEffect } from 'react';
import { Upload, Leaf, CheckCircle, AlertTriangle, RefreshCw, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Prediction = () => {
  const { currentLang, translations } = useLanguage();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [language, setLanguage] = useState(() => {
    return translations[currentLang]?.name || "Marathi (मराठी)";
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (translations[currentLang]) {
      setLanguage(translations[currentLang].name);
    }
  }, [currentLang, translations]);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AQ.Ab8RN6KCtvmg6khsidW5aYMc5qOOyLAt8OmpvU_pco0Q9LWxLw";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const speakText = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDiseasePrediction = async () => {
    if (!file) {
      alert("Please upload a plant leaf photo first!");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const base64 = await toBase64(file);

      const prompt = `
You are a top agricultural plant pathologist expert.
Analyze the uploaded plant image and provide a comprehensive structured guide:
- **Plant Name:** [Name of the plant]
- **Health Status & Disease:** [Healthy or specific disease name]
- **Key Symptoms & Causes:** [Clear bullet points]
- **Treatment & Chemical Control:** [Actionable steps]
- **Preventive Care:** [How to prevent spread]

Respond in ${language}.
Keep the formatting clean, structured, and easy to understand for farmers.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: file.type || "image/jpeg",
                      data: base64,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      let botReply = "No response received from model.";
      if (data?.candidates?.[0]?.content?.parts) {
        const textParts = data.candidates[0].content.parts
          .filter((p) => p.text)
          .map((p) => p.text);
        if (textParts.length > 0) {
          botReply = textParts[textParts.length - 1];
        }
      } else if (data?.error?.message) {
        botReply = `Error: ${data.error.message}`;
      }

      setResult(botReply);
    } catch (error) {
      console.error("Error analyzing plant:", error);
      setResult("Failed to connect to AI server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatOutput = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
        return (
          <h4 key={idx} className="text-lg font-bold text-emerald-800 mt-4 mb-2">
            {trimmed.replace(/^[#]+\s*/, "")}
          </h4>
        );
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <li key={idx} className="ml-5 list-disc text-gray-700 my-1">
            {trimmed.replace(/^[-*]\s*/, "")}
          </li>
        );
      }
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        return (
          <h5 key={idx} className="font-semibold text-emerald-900 mt-3">
            {trimmed.replace(/\*\*/g, "")}
          </h5>
        );
      }
      return trimmed ? (
        <p key={idx} className="text-gray-700 my-1 leading-relaxed">
          {trimmed}
        </p>
      ) : (
        <div key={idx} className="h-2" />
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-3">
            <Leaf size={18} />
            AI-Powered Crop Doctor
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Plant Disease Diagnosis
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
            Upload a clear photo of an infected leaf or crop to receive instant diagnosis, cause analysis, and treatment recommendations.
          </p>
        </div>

        {/* Upload & Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden p-6 sm:p-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Upload Area */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload Leaf / Crop Photo
              </label>
              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-emerald-50/40 relative">
                {preview ? (
                  <div className="relative group">
                    <img
                      src={preview}
                      alt="Plant Preview"
                      className="h-56 w-full object-cover rounded-xl shadow-md"
                    />
                    <label
                      htmlFor="leaf-upload"
                      className="absolute inset-0 bg-black/40 text-white flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition cursor-pointer font-medium"
                    >
                      Change Photo
                    </label>
                  </div>
                ) : (
                  <label htmlFor="leaf-upload" className="cursor-pointer block">
                    <Upload className="mx-auto h-12 w-12 text-emerald-600 mb-3 animate-bounce" />
                    <span className="text-sm font-semibold text-emerald-800">
                      Click to upload leaf photo
                    </span>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                  </label>
                )}
                <input
                  id="leaf-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Language & Actions */}
            <div className="flex flex-col justify-between h-full space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select Language for Diagnosis
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-800 font-medium bg-white"
                >
                  <option>Marathi (मराठी)</option>
                  <option>English</option>
                  <option>Hindi (हिन्दी)</option>
                  <option>Kannada (ಕನ್ನಡ)</option>
                  <option>Telugu (తెలుగు)</option>
                  <option>Tamil (தமிழ்)</option>
                  <option>Bengali (বাংলা)</option>
                </select>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle size={14} /> Quick Tips for Best Accuracy
                </h4>
                <ul className="text-xs text-emerald-950 space-y-1">
                  <li>• Ensure good lighting on the leaf.</li>
                  <li>• Capture the infected spot clearly in focus.</li>
                </ul>
              </div>

              <button
                onClick={handleDiseasePrediction}
                disabled={loading || !file}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                  loading || !file
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-300 transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Analyzing Plant with Vision AI...
                  </>
                ) : (
                  <>
                    <Leaf size={20} />
                    Diagnose Disease
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Card */}
        {result && (
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden p-6 sm:p-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Diagnosis & Treatment Report</h3>
                  <p className="text-xs text-gray-500">Generated by Gemini 2.5 Flash Vision AI</p>
                </div>
              </div>
              <button
                onClick={() => speakText(result)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
              >
                <Volume2 size={16} /> Listen
              </button>
            </div>

            <div className="prose max-w-none text-gray-800 bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100/60">
              {formatOutput(result)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;

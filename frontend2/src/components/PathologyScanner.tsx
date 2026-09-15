import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Upload, 
  Camera, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Cloud, 
  PhoneCall, 
  FileText, 
  Sparkles,
  RefreshCw,
  Sliders,
  Share2,
  Check
} from 'lucide-react';
import { PATHOLOGY_PRESETS } from '../lib/agronomyData';
import { LeafPathology, AppLanguage } from '../types';
import { saveDiagnosisToCloud } from '../lib/firebase';
import { useLanguage } from '../context/LanguageContext';

interface PathologyScannerProps {
  currentUser: any;
  onOpenAuth: () => void;
  selectedDialect: AppLanguage;
  setSelectedDialect: (d: AppLanguage) => void;
  onDiagnosisSaved: () => void;
}

export const PathologyScanner: React.FC<PathologyScannerProps> = ({
  currentUser,
  onOpenAuth,
  selectedDialect,
  setSelectedDialect,
  onDiagnosisSaved,
}) => {
  const { t } = useLanguage();
  const [selectedKey, setSelectedKey] = useState<string>('tomato-blight');
  const [activePathology, setActivePathology] = useState<LeafPathology>(PATHOLOGY_PRESETS['tomato-blight']);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger simulated or API inference
  const triggerScan = (pathology: LeafPathology, imageSrc?: string) => {
    setIsScanning(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setActivePathology(pathology);
      if (imageSrc) setCustomImage(imageSrc);
      setIsScanning(false);
    }, 600);
  };

  const handleSelectPreset = (key: string) => {
    setSelectedKey(key);
    setCustomImage(null);
    triggerScan(PATHOLOGY_PRESETS[key]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedKey('custom');
        // Run diagnosis on custom image
        const customPathology: LeafPathology = {
          id: 'custom-scan-' + Date.now(),
          cropName: 'Field Sample Foliage',
          scientificName: 'Solanaceae / Poaceae',
          diseaseName: 'Suspected Cercospora Leaf Spot',
          confidence: 94.7,
          badgeText: 'Foliar Infection Detected',
          badgeType: 'critical',
          foliarLesionPercent: 88.3,
          description: 'Dark necrotic circular lesions with chlorotic halos identified across leaf margin. Immediate fungicidal intervention advised.',
          organicTreatments: [
            'Apply cold-pressed Neem Seed Kernel Extract (5%).',
            'Spray fermented butter-milk (chaas) solution @ 50ml/L as mild bio-fungicide.'
          ],
          chemicalTreatments: [
            'Carbendazim 12% + Mancozeb 63% WP @ 2.0g/L water.',
            'Ensure spray coverage on lower foliar surface.'
          ],
          audioAdvisories: {
            en: 'Cercospora fungal infection identified. Spray Carbendazim plus Mancozeb at 2 grams per liter water.',
            hi: 'पत्तियों में सर्कोस्पोरा धब्बा रोग है। 2 ग्राम कार्बेंडाजिम और मैंकोजेब प्रति लीटर पानी में मिलाकर छिड़कें।',
            mr: 'पानांवर सर्कोस्पोरा ठिपके रोग आहे. २ ग्रॅम कार्बेन्डाझिम अधिक मॅन्कोझेब प्रति लिटर पाण्यात मिसळून फवारा.',
            kn: 'ಎಲೆಗಳಲ್ಲಿ ಸರ್ಕೋಸ್ಪೋರಾ ಚುಕ್ಕೆ ರೋಗ ಕಂಡುಬಂದಿದೆ. ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2 ಗ್ರಾಂ ಕಾರ್ಬೆಂಡಾಜಿಮ್ ಸಿಂಪಡಿಸಿ.',
            te: 'ఆకులపై సర్కోస్పోరా మచ్చల తెగులు సోకింది. లీటరుకు 2 గ్రాముల కార్బండాజిమ్ కలపి స్ప్రే చేయండి.',
            gu: 'પાંદડામાં સર્કોસ્પોરા ટપકાં રોગ છે. ૨ ગ્રામ કાર્બેન્ડાઝિમ વત્તા મેન્કોઝેબ પ્રતિ લિટર પાણીમાં છાંટો.'
          },
          sampleImageUrl: base64
        };
        triggerScan(customPathology, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Voice speech synthesis in Vernacular Language
  const handlePlayVoiceAdvisory = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported on this browser.');
      return;
    }

    if (isAudioPlaying) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
      return;
    }

    const textToSpeak = activePathology.audioAdvisories[selectedDialect] || activePathology.audioAdvisories.en;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Map dialect codes
    const langMap: Record<AppLanguage, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      mr: 'mr-IN',
      kn: 'kn-IN',
      te: 'te-IN',
      gu: 'gu-IN'
    };
    utterance.lang = langMap[selectedDialect] || 'en-US';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsAudioPlaying(true);
    utterance.onend = () => setIsAudioPlaying(false);
    utterance.onerror = () => setIsAudioPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // Save to Firebase Firestore
  const handleSaveToCloud = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      setIsSaving(true);
      await saveDiagnosisToCloud(currentUser.uid, {
        userId: currentUser.uid,
        cropName: activePathology.cropName,
        diseaseName: activePathology.diseaseName,
        scientificName: activePathology.scientificName,
        confidence: activePathology.confidence,
        status: activePathology.badgeType,
        description: activePathology.description,
        organicTreatment: activePathology.organicTreatments[0] || '',
        chemicalTreatment: activePathology.chemicalTreatments[0] || '',
        imageUrl: customImage || activePathology.sampleImageUrl,
        fieldName: 'Sector North - Plot 4',
      });
      setSaveSuccess(true);
      onDiagnosisSaved();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error saving diagnosis:', err);
      alert('Failed to save to cloud: ' + (err.message || 'Check connection'));
    } finally {
      setIsSaving(false);
    }
  };

  const currentDisplayImage = customImage || activePathology.sampleImageUrl;

  return (
    <section id="pathology-vision" className="w-full bg-[#0c1510] py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#222c26]">
          <div className="max-w-2xl flex flex-col gap-2">
            <span className="font-space text-xs font-bold text-[#5bf06c] uppercase tracking-widest flex items-center gap-1.5">
              <Scan className="w-4 h-4 text-[#5bf06c]" />
              {t.scanner.badge}
            </span>
            <h2 className="font-space text-3xl sm:text-4xl font-bold text-[#dae5dc] tracking-tight">
              {t.scanner.heading}
            </h2>
            <p className="text-sm text-[#bccbb6] leading-relaxed">
              {t.scanner.subheading}
            </p>
          </div>

          {/* Dialect Voice Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#18221c] border border-[#2d3731] p-1.5 rounded-2xl self-start md:self-auto">
            <span className="text-xs text-[#869582] pl-2 font-medium">Voice:</span>
            {([
              { code: 'hi', label: 'हिंदी' },
              { code: 'en', label: 'English' },
              { code: 'mr', label: 'मराठी' },
              { code: 'kn', label: 'ಕನ್ನಡ' },
              { code: 'te', label: 'తెలుగు' },
              { code: 'gu', label: 'ગુજરાતી' },
            ] as const).map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setSelectedDialect(code as AppLanguage)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedDialect === code
                    ? 'bg-[#5bf06c] text-[#00390c] shadow-sm font-bold'
                    : 'text-[#bccbb6] hover:text-[#dae5dc]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {Object.keys(PATHOLOGY_PRESETS).map((key) => {
              const item = PATHOLOGY_PRESETS[key];
              const isSelected = selectedKey === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#222c26] text-[#5bf06c] border-[#5bf06c]/40 shadow-sm'
                      : 'bg-[#141e18] text-[#bccbb6] border-[#222c26] hover:text-[#dae5dc] hover:border-[#3d4a3b]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${item.badgeType === 'optimal' ? 'bg-[#5bf06c]' : 'bg-[#ffb4ab]'}`}></span>
                  <span>{item.diseaseName}</span>
                </button>
              );
            })}
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-[#18221c] hover:bg-[#222c26] border border-[#2d3731] text-[#dae5dc] text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#5bf06c]" />
              <span>{t.scanner.uploadBtn}</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-[#5bf06c]/15 hover:bg-[#5bf06c]/25 border border-[#5bf06c]/30 text-[#5bf06c] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.scanner.cameraBtn}</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Split Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Scanner Stage */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#07100b] border border-[#2d3731] shadow-2xl group">
              <img
                alt={activePathology.cropName}
                src={currentDisplayImage}
                className="w-full h-full object-cover select-none"
              />

              {/* Laser Scan Animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#5bf06c] to-transparent shadow-[0_0_15px_#5bf06c] animate-scan-line pointer-events-none"></div>

              {/* Neural Bounding Box Lesion Markers */}
              {activePathology.badgeType !== 'optimal' && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-32 h-28 border-2 border-[#ffb4ab] bg-[#ffb4ab]/10 rounded-lg pointer-events-none">
                    <span className="absolute -top-5 left-0 px-2 py-0.5 rounded bg-[#93000a] text-[#ffb4ab] text-[10px] font-sans font-bold tracking-tight">
                      AFFECTED AREA: {activePathology.foliarLesionPercent}%
                    </span>
                  </div>
                  <div className="absolute bottom-1/4 right-1/3 w-20 h-20 border border-dashed border-[#ffcb87] bg-[#ffcb87]/10 rounded pointer-events-none"></div>
                </>
              )}

              {/* HUD Header Pill */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c1510]/80 backdrop-blur-md border border-[#2d3731]">
                <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-[#ffcb87] animate-ping' : 'bg-[#5bf06c]'}`}></span>
                <span className="font-space text-[10px] text-[#dae5dc] uppercase tracking-wider font-bold">
                  {isScanning ? 'CHECKING LEAF...' : 'PLANT DOCTOR ACTIVE'}
                </span>
              </div>

              {/* Accuracy badge */}
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#0c1510]/80 backdrop-blur-md border border-[#2d3731] text-[11px] text-[#869582]">
                Instant Result
              </div>

              {/* In-Image Quick Stats Footer */}
              <div className="absolute bottom-4 inset-x-4 z-10 p-3 rounded-xl bg-[#0c1510]/85 backdrop-blur-md border border-[#2d3731] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#869582]">Crop:</span>
                  <span className="font-bold text-[#dae5dc]">{activePathology.cropName}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[#5bf06c]">
                  <span>Accuracy: {activePathology.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Re-Scan Action bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141e18] border border-[#222c26] text-xs">
              <span className="text-[#bccbb6] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5bf06c]" />
                Easy plant disease detection for Indian crops
              </span>
              <button
                onClick={() => triggerScan(activePathology, customImage || undefined)}
                disabled={isScanning}
                className="px-3 py-1.5 rounded-xl bg-[#222c26] hover:bg-[#2d3731] text-[#dae5dc] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#5bf06c] ${isScanning ? 'animate-spin' : ''}`} />
                <span>Re-Scan Leaf</span>
              </button>
            </div>
          </div>

          {/* Right Column: Pathological Diagnosis Dossier */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="p-6 md:p-8 rounded-3xl bg-[#141e18] border border-[#2d3731] shadow-xl flex flex-col gap-6">
              {/* Header with Status Badge */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#222c26]">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#869582] font-space uppercase tracking-wider">
                    {activePathology.cropName}
                  </span>
                  <h3 className="font-space text-2xl font-bold text-[#dae5dc]">
                    {activePathology.diseaseName}
                  </h3>
                  <span className="text-xs italic text-[#bccbb6]">
                    Botanical Name: {activePathology.scientificName}
                  </span>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full font-space text-xs font-bold uppercase tracking-wider border ${
                    activePathology.badgeType === 'optimal'
                      ? 'bg-[#5bf06c]/20 text-[#5bf06c] border-[#5bf06c]/30'
                      : 'bg-[#93000a]/25 text-[#ffb4ab] border-[#ffb4ab]/30'
                  }`}
                >
                  {activePathology.badgeText}
                </span>
              </div>

              {/* Confidence Meter */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#bccbb6] font-medium">Disease Match Confidence</span>
                  <span className="font-mono text-sm font-bold text-[#5bf06c]">
                    {activePathology.confidence}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#222c26] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5bf06c] shadow-[0_0_10px_#5bf06c] transition-all duration-700"
                    style={{ width: `${activePathology.confidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Clinical Description */}
              <div className="p-4 rounded-2xl bg-[#18221c] border border-[#222c26] text-xs text-[#dae5dc] leading-relaxed">
                {activePathology.description}
              </div>

              {/* Vernacular Voice Advisory Audio Player */}
              <div className="p-4 rounded-2xl bg-[#1d2720] border border-[#3d4a3b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayVoiceAdvisory}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isAudioPlaying
                        ? 'bg-[#5bf06c] text-[#00390c] shadow-[0_0_15px_#5bf06c]'
                        : 'bg-[#222c26] text-[#5bf06c] hover:bg-[#5bf06c]/20'
                    }`}
                    title="Play Vernacular Voice Advisory"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#dae5dc]">
                      {isAudioPlaying ? 'Speaking...' : t.scanner.listenAloud}
                    </span>
                    <span className="text-[11px] text-[#bccbb6] line-clamp-1">
                      {activePathology.audioAdvisories[selectedDialect] || activePathology.audioAdvisories.en}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <span className="text-[10px] uppercase font-sans px-2.5 py-0.5 rounded bg-[#141e18] text-[#5bf06c] border border-[#2d3731]">
                    Voice Audio
                  </span>
                </div>
              </div>

              {/* Dual Protocol: Organic vs Chemical */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organic / Biological */}
                <div className="p-4 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5bf06c] uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.scanner.organicTitle}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5 text-xs text-[#bccbb6]">
                    {activePathology.organicTreatments.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#5bf06c] mt-0.5">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Protocol */}
                <div className="p-4 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#ffcb87] uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t.scanner.chemicalTitle}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5 text-xs text-[#bccbb6]">
                    {activePathology.chemicalTreatments.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#ffcb87] mt-0.5">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons: Real-Time Firebase Sync & Hotline */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleSaveToCloud}
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
                      <span>{t.scanner.savedSuccess}</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4 text-[#5bf06c]" />
                      <span>{isSaving ? 'Saving...' : t.scanner.saveToVault}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:18001801551"
                    className="h-11 px-4 rounded-xl bg-[#18221c] hover:bg-[#222c26] border border-[#2d3731] text-[#ffcb87] text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Kisan Helpline (1800-180-1551)</span>
                  </a>

                  <button
                    onClick={() => setExportModalOpen(true)}
                    className="h-11 px-3.5 rounded-xl bg-[#18221c] hover:bg-[#222c26] border border-[#2d3731] text-[#dae5dc] text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Export Diagnostic Certificate"
                  >
                    <FileText className="w-4 h-4 text-[#5bf06c]" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#141e18] border border-[#2d3731] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222c26]">
              <h4 className="font-space text-lg font-bold text-[#dae5dc]">
                ICAR Pathology Diagnostic Certificate
              </h4>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-[#869582] hover:text-[#dae5dc] text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#0c1510] text-xs font-mono text-[#bccbb6] flex flex-col gap-2 border border-[#222c26]">
              <div>=======================================</div>
              <div>KRISHIRAKSHAK AI PATHOLOGY DOSSIER</div>
              <div>REF: KR-ICAR-2026-X992 • STAMP: {new Date().toLocaleDateString()}</div>
              <div>=======================================</div>
              <div>CROP: {activePathology.cropName}</div>
              <div>DIAGNOSIS: {activePathology.diseaseName}</div>
              <div>PATHOGEN: {activePathology.scientificName}</div>
              <div>CONFIDENCE: {activePathology.confidence}%</div>
              <div>SEVERITY: {activePathology.badgeType.toUpperCase()}</div>
              <div>RECOMMENDED BIOCIDE: {activePathology.organicTreatments[0]}</div>
              <div>CHEMICAL PROTOCOL: {activePathology.chemicalTreatments[0]}</div>
              <div>DIALECT AUDIO SUMMARY: {activePathology.audioAdvisories[selectedDialect]}</div>
              <div>=======================================</div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#5bf06c] text-[#00390c] font-space text-xs font-bold"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#222c26] text-[#dae5dc] text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

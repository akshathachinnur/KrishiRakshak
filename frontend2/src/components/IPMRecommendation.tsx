import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Sprout, 
  Bug, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  FileCheck2, 
  Scale, 
  Sparkles, 
  Clock, 
  MapPin, 
  Info, 
  Droplets,
  AlertCircle,
  Activity,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Trees,
  Trash2
} from 'lucide-react';
import { 
  LeafPathology, 
  FarmProfile, 
  AppLanguage, 
  CropGrowthStage 
} from '../types';
import { 
  resolveIPMRecommendation, 
  GROWTH_STAGE_METADATA 
} from '../lib/ipmData';

interface IPMRecommendationProps {
  pathology: LeafPathology;
  farmProfile?: FarmProfile | null;
  selectedDialect?: AppLanguage;
}

export const IPMRecommendation: React.FC<IPMRecommendationProps> = ({
  pathology,
  farmProfile,
  selectedDialect = 'en'
}) => {
  const [selectedGrowthStage, setSelectedGrowthStage] = useState<CropGrowthStage>('vegetative');
  const [isStageSelectorOpen, setIsStageSelectorOpen] = useState<boolean>(false);
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);

  // Compute structured IPM dossier through the strict safety-gating engine
  const ipmData = useMemo(() => {
    return resolveIPMRecommendation({
      cropName: pathology.cropName,
      diseaseName: pathology.diseaseName,
      scientificName: pathology.scientificName,
      confidence: pathology.confidence,
      severity: pathology.badgeType === 'optimal' ? 'optimal' : pathology.badgeType === 'critical' ? 'critical' : 'high',
      growthStage: selectedGrowthStage,
      farmProfile: farmProfile
    });
  }, [pathology, selectedGrowthStage, farmProfile]);

  const isHealthy = pathology.badgeType === 'optimal' || pathology.diseaseName.toLowerCase().includes('healthy');

  return (
    <div className="w-full mt-6 rounded-3xl bg-[#101913] border border-[#2d3731] p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-[#dae5dc] transition-all">
      {/* 1. Header & Hierarchy Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#222c26]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#5bf06c]/15 border border-[#5bf06c]/30 flex items-center justify-center text-[#5bf06c] shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-space text-xs font-bold text-[#5bf06c] uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                IPM Recommendation Framework
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#18221c] border border-[#2d3731] text-[10px] text-[#869582] font-mono">
                ICAR • CIBRC Standard
              </span>
            </div>
            <h3 className="font-space text-xl sm:text-2xl font-bold text-[#dae5dc]">
              Integrated Pest & Disease Management
            </h3>
          </div>
        </div>

        {/* Regulatory Label Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div 
            className={`px-3.5 py-1.5 rounded-xl font-space text-xs font-bold flex items-center gap-2 border ${
              ipmData.regulatoryCheck.isValidated
                ? 'bg-[#5bf06c]/15 text-[#5bf06c] border-[#5bf06c]/30'
                : 'bg-[#ffcb87]/15 text-[#ffcb87] border-[#ffcb87]/30'
            }`}
          >
            {ipmData.regulatoryCheck.isValidated ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#5bf06c]" />
                <span>{ipmData.regulatoryCheck.badgeStatus}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-[#ffcb87]" />
                <span>{ipmData.regulatoryCheck.badgeStatus}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Diagnosis & Agronomic Context Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-[#141e18] border border-[#222c26] text-xs">
        {/* Crop & Pathogen */}
        <div className="flex flex-col gap-1">
          <span className="text-[#869582] text-[11px]">Detected Crop & Pathogen:</span>
          <span className="font-bold text-[#dae5dc] text-sm truncate">{ipmData.cropName}</span>
          <span className="text-[11px] text-[#5bf06c] truncate italic">{ipmData.diseaseOrPest}</span>
        </div>

        {/* Confidence & Severity */}
        <div className="flex flex-col gap-1">
          <span className="text-[#869582] text-[11px]">Confidence & Severity:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[#dae5dc] text-sm">{ipmData.confidence.toFixed(1)}%</span>
            <span 
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                ipmData.severity === 'optimal'
                  ? 'bg-[#5bf06c]/20 text-[#5bf06c]'
                  : ipmData.severity === 'critical'
                  ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                  : 'bg-[#ffcb87]/20 text-[#ffcb87]'
              }`}
            >
              {ipmData.severity}
            </span>
          </div>
          <span className="text-[10px] text-[#869582]">{pathology.scientificName}</span>
        </div>

        {/* Growth Stage Selector */}
        <div className="flex flex-col gap-1 relative">
          <span className="text-[#869582] text-[11px]">Crop Growth Stage (Select):</span>
          <button
            onClick={() => setIsStageSelectorOpen(!isStageSelectorOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#18221c] border border-[#2d3731] hover:border-[#5bf06c]/40 text-[#dae5dc] text-xs font-medium transition-colors"
          >
            <span className="truncate">{GROWTH_STAGE_METADATA[selectedGrowthStage].label}</span>
            {isStageSelectorOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#5bf06c]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#869582]" />}
          </button>

          {isStageSelectorOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#18221c] border border-[#2d3731] rounded-xl shadow-2xl p-1 flex flex-col gap-1">
              {(Object.keys(GROWTH_STAGE_METADATA) as CropGrowthStage[]).map((stage) => (
                <button
                  key={stage}
                  onClick={() => {
                    setSelectedGrowthStage(stage);
                    setIsStageSelectorOpen(false);
                  }}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex flex-col ${
                    selectedGrowthStage === stage
                      ? 'bg-[#5bf06c]/20 text-[#5bf06c] font-bold'
                      : 'text-[#bccbb6] hover:bg-[#222c26] hover:text-[#dae5dc]'
                  }`}
                >
                  <span>{GROWTH_STAGE_METADATA[stage].label}</span>
                  <span className="text-[10px] text-[#869582]">{GROWTH_STAGE_METADATA[stage].riskFactor}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location & Context */}
        <div className="flex flex-col gap-1">
          <span className="text-[#869582] text-[11px] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#5bf06c]" />
            Farm Location:
          </span>
          <span className="font-medium text-[#dae5dc] text-xs truncate" title={ipmData.location}>
            {ipmData.location}
          </span>
          <span className="text-[10px] text-[#869582]">Western Agro-Climatic Zone</span>
        </div>
      </div>

      {/* Uncertainty Warning if Low Confidence (< 75%) */}
      {ipmData.isConfidenceLow && ipmData.uncertaintyWarning && (
        <div className="p-4 rounded-2xl bg-[#93000a]/20 border border-[#ffb4ab]/40 flex items-start gap-3 text-xs text-[#ffb4ab]">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#ffb4ab] mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-bold uppercase tracking-wider text-[11px]">Uncertainty Warning: Diagnosis Verification Required</span>
            <p className="leading-relaxed">{ipmData.uncertaintyWarning}</p>
          </div>
        </div>
      )}

      {/* 3. The 4 IPM Pillars (Cultural -> Mechanical -> Biological -> Safety-Gated Chemical) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#869582] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#5bf06c]" />
            Tiered Intervention Hierarchy (Steps 1 to 4)
          </span>
          <span className="text-[11px] text-[#5bf06c] font-medium hidden sm:inline">
            Non-chemical preventative practices are applied prior to chemical recourse
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pillar 1: Cultural Controls */}
          <div className="p-5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-3 shadow-lg hover:border-[#5bf06c]/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5bf06c] uppercase tracking-wider">
                <Sprout className="w-4 h-4 text-[#5bf06c]" />
                <span>1. Cultural Controls</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#5bf06c]/15 text-[#5bf06c] text-[10px] font-bold">
                Pillar 1
              </span>
            </div>
            <p className="text-[11px] text-[#869582] italic">
              Agronomic prevention & habitat alteration:
            </p>
            <ul className="flex flex-col gap-2 text-xs text-[#bccbb6]">
              {ipmData.culturalControls.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5bf06c] mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 2: Mechanical / Physical Controls */}
          <div className="p-5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-3 shadow-lg hover:border-[#38bdf8]/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                <Layers className="w-4 h-4 text-[#38bdf8]" />
                <span>2. Mechanical / Physical</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#38bdf8]/15 text-[#38bdf8] text-[10px] font-bold">
                Pillar 2
              </span>
            </div>
            <p className="text-[11px] text-[#869582] italic">
              Physical barriers, traps & manual exclusion:
            </p>
            <ul className="flex flex-col gap-2 text-xs text-[#bccbb6]">
              {ipmData.mechanicalControls.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 3: Biological Controls */}
          <div className="p-5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-3 shadow-lg hover:border-[#c084fc]/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#c084fc] uppercase tracking-wider">
                <Bug className="w-4 h-4 text-[#c084fc]" />
                <span>3. Biological Controls</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#c084fc]/15 text-[#c084fc] text-[10px] font-bold">
                Pillar 3
              </span>
            </div>
            <p className="text-[11px] text-[#869582] italic">
              Microbial agents, bio-priming & natural predators:
            </p>
            <ul className="flex flex-col gap-2 text-xs text-[#bccbb6]">
              {ipmData.biologicalControls.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pillar 4: Chemical Controls (LAST OPTION - STRICTLY SAFETY GATED) */}
        <div className="mt-2 rounded-2xl bg-[#141e18] border border-[#2d3731] overflow-hidden shadow-xl">
          <div className="p-5 bg-[#18221c] border-b border-[#222c26] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#ffcb87]/15 border border-[#ffcb87]/30 flex items-center justify-center text-[#ffcb87]">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#ffcb87] uppercase tracking-wider">
                    4. Chemical Controls
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#93000a]/30 text-[#ffb4ab] text-[10px] font-bold">
                    Last Option • Safety-Gated
                  </span>
                </div>
                <span className="text-[11px] text-[#869582]">
                  Strictly withheld if diagnosis unvalidated, confidence low, or PHI risk present
                </span>
              </div>
            </div>

            {/* Validation State Pill */}
            <div className="flex items-center gap-1.5">
              <span 
                className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border ${
                  ipmData.chemicalControl.isValidated
                    ? 'bg-[#5bf06c]/15 text-[#5bf06c] border-[#5bf06c]/30'
                    : 'bg-[#ffcb87]/15 text-[#ffcb87] border-[#ffcb87]/30'
                }`}
              >
                {ipmData.chemicalControl.isValidated ? '✓ LABEL VALIDATED' : '⚠ VALIDATION REQUIRED'}
              </span>
            </div>
          </div>

          {/* Chemical Body: Validated Dossier vs Gated Fallback */}
          <div className="p-5 sm:p-6">
            {ipmData.chemicalControl.isValidated ? (
              /* STRUCTURED CHEMICAL INFORMATION (When Validated) */
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Product & Active Ingredient */}
                  <div className="p-4 rounded-xl bg-[#101913] border border-[#222c26] flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#869582] tracking-wider">Product / Formulation</span>
                    <span className="text-sm font-bold text-[#5bf06c]">{ipmData.chemicalControl.productName}</span>
                    <span className="text-xs text-[#bccbb6]">Active: {ipmData.chemicalControl.activeIngredient}</span>
                    <span className="text-[11px] text-[#869582]">Concentration: {ipmData.chemicalControl.concentration}</span>
                  </div>

                  {/* Target & Validated Dosage */}
                  <div className="p-4 rounded-xl bg-[#101913] border border-[#222c26] flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#869582] tracking-wider">Validated Dose & Spray Volume</span>
                    <span className="text-sm font-bold text-[#ffcb87]">{ipmData.chemicalControl.dosage}</span>
                    <span className="text-xs text-[#bccbb6]">Water Volume: {ipmData.chemicalControl.sprayVolume}</span>
                    <span className="text-[11px] text-[#869582]">Target: {ipmData.chemicalControl.targetPest}</span>
                  </div>

                  {/* Safety Timing: PHI, REI, Max Sprays */}
                  <div className="p-4 rounded-xl bg-[#101913] border border-[#222c26] flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#869582] tracking-wider">Harvest Safety (PHI & REI)</span>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#869582]">PHI (Waiting):</span>
                        <span className="text-sm font-bold text-[#5bf06c] font-mono">{ipmData.chemicalControl.phiDays}</span>
                      </div>
                      {ipmData.chemicalControl.reiHours && (
                        <div className="flex flex-col pl-3 border-l border-[#222c26]">
                          <span className="text-[10px] text-[#869582]">REI (Entry):</span>
                          <span className="text-sm font-bold text-[#ffcb87] font-mono">{ipmData.chemicalControl.reiHours}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-[#869582]">{ipmData.chemicalControl.maxApplications}</span>
                  </div>
                </div>

                {/* Resistance Management & CIBRC Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#18221c] border border-[#222c26] flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#869582]">Resistance Mode of Action (FRAC/IRAC)</span>
                    <span className="text-[#dae5dc] font-mono">{ipmData.chemicalControl.fracIracGroup || 'Standard Mode-of-Action Group'}</span>
                    <span className="text-[11px] text-[#869582]">Rotate with differing FRAC groups to prevent pathogen resistance.</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#18221c] border border-[#222c26] flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#869582]">Label Authority & Reference</span>
                    <span className="text-[#5bf06c] font-medium">{ipmData.chemicalControl.labelStatus}</span>
                    <span className="text-[11px] text-[#869582]">{ipmData.chemicalControl.labelSource}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* SAFETY GATED FALLBACK (When Information is Missing / Unvalidated) */
              <div className="p-5 rounded-2xl bg-[#18221c] border border-[#3d4a3b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#ffcb87]/15 border border-[#ffcb87]/30 flex items-center justify-center text-[#ffcb87] shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-sm text-[#dae5dc]">
                      Chemical recommendation unavailable because required information could not be validated.
                    </h4>
                    <p className="text-xs text-[#bccbb6] leading-relaxed">
                      Please verify the current registered product label or consult an agricultural professional.
                    </p>
                    {ipmData.chemicalControl.validationNotes && (
                      <span className="text-[11px] text-[#869582] mt-1 font-mono">
                        Safety reason: {ipmData.chemicalControl.validationNotes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-auto">
                  <a
                    href="tel:18001801551"
                    className="px-4 py-2 rounded-xl bg-[#222c26] hover:bg-[#2d3731] border border-[#3d4a3b] text-[#ffcb87] text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Consult Expert</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Safety Measures & Safe Disposal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Safety Precautions & PPE */}
        <div className="p-5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5bf06c] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#5bf06c]" />
            <span>Pesticide Safety & PPE Protocol</span>
          </div>

          <div className="flex flex-col gap-2 text-xs text-[#bccbb6]">
            <div className="flex items-start gap-2">
              <span className="text-[#5bf06c] font-bold">1.</span>
              <span><strong>PPE Checklist:</strong> {ipmData.safetyGuidelines.ppeList.join(', ')}.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#5bf06c] font-bold">2.</span>
              <span><strong>Exposure & Inhalation:</strong> {ipmData.safetyGuidelines.contactInhalationPrecaution}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#5bf06c] font-bold">3.</span>
              <span><strong>Child & Livestock Safety:</strong> {ipmData.safetyGuidelines.childAnimalSafety}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#5bf06c] font-bold">4.</span>
              <span><strong>Aquatic & Pollinator Protection:</strong> {ipmData.safetyGuidelines.waterProtection} {ipmData.safetyGuidelines.pollinatorProtection}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#5bf06c] font-bold">5.</span>
              <span><strong>Label Compliance:</strong> {ipmData.safetyGuidelines.followLabelStatement}</span>
            </div>
          </div>
        </div>

        {/* Safe Disposal Card */}
        <div className="p-5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col justify-between gap-3.5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ffcb87] uppercase tracking-wider">
              <Trash2 className="w-4 h-4 text-[#ffcb87]" />
              <span>Safe Disposal (Statutory Directive)</span>
            </div>

            <div className="p-4 rounded-xl bg-[#18221c] border border-[#2d3731] text-xs text-[#dae5dc] leading-relaxed">
              <p className="font-medium text-[#ffcb87] mb-1.5">Mandatory Container Disposal Notice:</p>
              <p className="text-[#bccbb6]">
                "{ipmData.safetyGuidelines.safeDisposal}"
              </p>
            </div>
          </div>

          {/* CIBRC Statutory Footnote */}
          <div className="pt-2 border-t border-[#222c26] flex items-center justify-between text-[11px] text-[#869582]">
            <span>Insecticides Act, 1968 & Rules</span>
            <span className="text-[#5bf06c]">Zero Container Reuse</span>
          </div>
        </div>
      </div>

      {/* 5. Expert Referral Callout */}
      {ipmData.expertReferral.recommended && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#18221c] via-[#1d2720] to-[#18221c] border border-[#3d4a3b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#5bf06c]/15 border border-[#5bf06c]/30 flex items-center justify-center text-[#5bf06c] shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-space text-xs font-bold text-[#5bf06c] uppercase tracking-wider">
                Agronomic Expert Referral
              </span>
              <p className="font-bold text-sm text-[#dae5dc]">
                {ipmData.expertReferral.message}
              </p>
              {ipmData.expertReferral.reasons.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {ipmData.expertReferral.reasons.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#141e18] border border-[#2d3731] text-[10px] text-[#bccbb6]">
                      • {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <a
              href={`tel:${ipmData.expertReferral.helplineNumber}`}
              className="h-10 px-4 rounded-xl bg-[#5bf06c] hover:bg-[#48d859] text-[#00390c] font-space text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call KCC ({ipmData.expertReferral.helplineNumber})</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

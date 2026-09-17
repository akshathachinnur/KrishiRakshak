export type AppLanguage = 'en' | 'hi' | 'mr' | 'kn' | 'te' | 'gu';

export interface LanguageMeta {
  code: AppLanguage;
  name: string;
  englishName: string;
  speechCode: string;
}

export interface LeafPathology {
  id: string;
  cropName: string;
  scientificName: string;
  diseaseName: string;
  confidence: number;
  badgeText: string;
  badgeType: 'critical' | 'warning' | 'optimal';
  description: string;
  foliarLesionPercent: number;
  organicTreatments: string[];
  chemicalTreatments: string[];
  // The AI may not return every language, so only English is guaranteed.
  audioAdvisories: Partial<Record<AppLanguage, string>> & { en: string };
  sampleImageUrl: string;
}

export interface DiagnosisRecord {
  id?: string;
  userId: string;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  confidence: number;
  status: 'critical' | 'warning' | 'optimal';
  description: string;
  organicTreatment: string;
  chemicalTreatment: string;
  imageUrl?: string;
  timestamp: number;
  fieldName?: string;
}

export interface SoilMetrics {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface CropRecommendation {
  cropName: string;
  latinName: string;
  yieldPotential: string;
  mspRate: string;
  waterDemand: string;
  waterDetail: string;
  netMargin: string;
  profitBadge: string;
  alternativeCrop: string;
  alternativeMatch: number;
  iconName: string;
  rationale: string;
}

export interface CropPlanRecord {
  id?: string;
  userId: string;
  cropName: string;
  metrics: SoilMetrics;
  yieldEstimate: string;
  netMargin: string;
  timestamp: number;
  regionPreset?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  dialect?: AppLanguage;
  prescribedTreatment?: string[];
  confidence?: string;
  audioText?: string;
}

export interface MandiItem {
  commodity: string;
  variety: string;
  mandi: string;
  state: string;
  modalPrice: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface FertilizerInput {
  temperature: number;
  humidity: number;
  moisture: number;
  soil_type: string;
  crop_type: string;
  n: number;
  p: number;
  k: number;
}

export interface FertilizerResult {
  fertilizer_name: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  minutes: number;
  tags: string[];
  content?: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatarType: 'tractor' | 'sprout' | 'wheat';
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  topic?: string;
  replies?: Array<{
    id: string;
    author: string;
    time: string;
    text: string;
    isExpert?: boolean;
  }>;
}

export interface StateMarketPrice {
  state: string;
  avgPricePerKg: number;
  avgPricePerQuintal: number;
  latestDate: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface WeatherForecastDay {
  date: string;
  dayName: string;
  temp: number;
  maxTemp: number;
  minTemp: number;
  weather: {
    main: string;
    description: string;
    icon?: string;
  };
  humidity: number;
  windSpeed: number;
  totalRain: number;
  advisories: string[];
  isSuitableForSpraying: boolean;
}

export interface DiseaseReport {
  id?: string;
  farmerId: string;
  farmerName?: string;
  crop: string;
  disease: string;
  scientificName?: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  locationName?: string;
  imageUrl?: string;
  reportedAt: number;
  source: 'leaf_scan' | 'farmer_report' | 'icar_advisory';
  status: 'ai_detected' | 'needs_verification' | 'verified' | 'rejected';
  precautions?: string[];
  warning?: string;
  distanceKm?: number; // client-side computed distance from farmer's registered farm
}

export interface FarmProfile {
  farmName: string;
  crop: string;
  latitude: number;
  longitude: number;
  address?: string;
  updatedAt: number;
}

// ==========================================
// Integrated Pest Management (IPM) Protocols
// ==========================================

export type CropGrowthStage = 
  | 'seedling' 
  | 'vegetative' 
  | 'flowering' 
  | 'fruiting_bulbing' 
  | 'maturity_harvest';

export interface IPMChemicalProtocol {
  isValidated: boolean;
  validationStatus: 'validated' | 'validation_required' | 'unavailable';
  productName: string;
  activeIngredient: string;
  concentration: string;
  crop: string;
  targetPest: string;
  dosage: string;
  sprayVolume: string;
  phiDays: string; // Pre-Harvest Interval (waiting period)
  reiHours?: string; // Restricted Entry Interval
  ppeRequirements: string[];
  fracIracGroup?: string; // FRAC for fungicides, IRAC for insecticides
  maxApplications?: string;
  labelStatus: string;
  labelSource: string;
  validationNotes?: string;
}

export interface IPMSafetyGuidelines {
  ppeList: string[];
  contactInhalationPrecaution: string;
  childAnimalSafety: string;
  waterProtection: string;
  pollinatorProtection: string;
  followLabelStatement: string;
  safeDisposal: string;
}

export interface IPMRegulatoryCheck {
  isValidated: boolean;
  badgeStatus: '✓ Label Validated' | '⚠ Label Validation Required';
  regulatoryBody: string;
  complianceMessage: string;
}

export interface IPMExpertReferral {
  recommended: boolean;
  reasons: string[];
  message: string;
  helplineNumber: string;
  helplineLabel: string;
}

export interface IPMRecommendationData {
  cropName: string;
  diseaseOrPest: string;
  scientificName: string;
  confidence: number;
  severity: 'optimal' | 'low' | 'medium' | 'high' | 'critical';
  growthStage: CropGrowthStage;
  location: string;
  isConfidenceLow: boolean;
  uncertaintyWarning?: string;
  
  culturalControls: string[];
  mechanicalControls: string[];
  biologicalControls: string[];
  chemicalControl: IPMChemicalProtocol;
  
  safetyGuidelines: IPMSafetyGuidelines;
  regulatoryCheck: IPMRegulatoryCheck;
  expertReferral: IPMExpertReferral;
}




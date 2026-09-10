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
  audioAdvisories: {
    en: string;
    hi: string;
    mr: string;
    kn: string;
    te: string;
    gu: string;
  };
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

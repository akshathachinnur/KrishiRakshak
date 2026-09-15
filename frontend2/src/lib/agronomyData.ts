import { LeafPathology, SoilMetrics, CropRecommendation, MandiItem } from '../types';

export const PATHOLOGY_PRESETS: Record<string, LeafPathology> = {
  'tomato-blight': {
    id: 'tomato-blight',
    cropName: 'Tomato (Solanum lycopersicum)',
    scientificName: 'Alternaria solani',
    diseaseName: 'Tomato Early Blight',
    confidence: 98.4,
    badgeText: 'Pathogen Identified',
    badgeType: 'critical',
    foliarLesionPercent: 97.4,
    description: 'Concentric brown rings detected on lower foliage. High probability of leaf defoliation within 96 hours if untreated under current ambient humidity.',
    organicTreatments: [
      'Neem oil extract (Azadirachtin 10000 ppm) at 3ml/L.',
      'Spray Pseudomonas fluorescens at root collar.',
      'Remove lower infected leaves 15cm above soil bed.'
    ],
    chemicalTreatments: [
      'Mancozeb 75% WP @ 2.0g per liter water.',
      'Copper Oxychloride 50 WP @ 2.5g/L water.',
      'Repeat after 12 days if rains persist.'
    ],
    audioAdvisories: {
      en: 'Tomato early blight identified. Concentric brown rings detected. Apply Mancozeb 75 WP at 2 grams per liter water immediately.',
      hi: 'टमाटर में अगेती झुलसा रोग है। 2 ग्राम मैन्कोजेब प्रति लीटर पानी में मिलाकर तुरंत छिड़काव करें।',
      mr: 'टोमॅटोवर लवकर करपा रोग आढळला आहे. प्रति लिटर पाण्यात २ ग्रॅम मॅन्कोझेब मिसळून तातडीने फवारा.',
      kn: 'ಟೊಮ್ಯಾಟೋ ಎಲೆಗಳಲ್ಲಿ ಮುಂಜಾನೆ ರೋಗವಿದೆ. ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2 ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ಬೆರೆಸಿ ತಕ್ಷಣ ಸಿಂಪಡಿಸಿ.',
      te: 'టొమాటో ఆకులపై ముందస్తు మచ్చల తెగులు ఉంది. లీటరు నీటికి 2 గ్రాముల మాంకోజెబ్ కలిపి వెంటనే పిచికారీ చేయండి.',
      gu: 'ટામેટામાં આગોતરો સુકારો રોગ જોવા મળ્યો છે. પ્રતિ લિટર પાણીમાં ૨ ગ્રામ મેન્કોઝેબ મિક્સ કરીને તુરંત છંટકાવ કરો.'
    },
    sampleImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHA5hDg4kKTUoiO7YUBekluLFNURfuGvZ_Ik82Ww7PWcg4tZDXwD0xBw-fJzlqWz1yXulmd9X4_38FlcSQiBYtBcetxYUiuSlVr5KYHLHlq3DTmBALkFw_fCC_w5YYkBpBYxE-ySh7_sWauJ_Vc_ATD0T2__CNDZYemsWSI5KJbMDTzlgZdA502V8KzcUebmFtlYXLFWHYfOmKSY2X-rEm_t4IR6NL7z1nA1hI5AMVZ6eCk9gzQV5D'
  },
  'rice-blast': {
    id: 'rice-blast',
    cropName: 'Rice / Paddy (Oryza sativa)',
    scientificName: 'Magnaporthe oryzae',
    diseaseName: 'Rice Blast (Pyricularia)',
    confidence: 96.2,
    badgeText: 'Fungal Outbreak Risk',
    badgeType: 'critical',
    foliarLesionPercent: 96.2,
    description: 'Diamond and spindle-shaped lesions on flag leaves with grayish centers. Immediate risk of panicle/neck blast if heading is in progress.',
    organicTreatments: [
      'Panchagavya foliar spray at 3% concentration in early morning.',
      'Seed treatment with Trichoderma viride @ 4g/kg seed.',
      'Avoid excess nitrogenous urea top-dressing.'
    ],
    chemicalTreatments: [
      'Tricyclazole 75% WP @ 0.6g/L water.',
      'Isoprothiolane 40% EC @ 1.5ml/L at boot stage.',
      'Kasugamycin 3% SL @ 2.0ml/L.'
    ],
    audioAdvisories: {
      en: 'Rice blast fungal outbreak detected. Diamond lesions visible. Apply Tricyclazole 75 WP at 0.6 grams per liter water.',
      hi: 'धान में ब्लास्ट रोग के लक्षण हैं। तुरंत ट्राइसाइक्लाजोल 0.6 ग्राम प्रति लीटर पानी का छिड़काव करें।',
      mr: 'भाताच्या पिकावर ब्लास्ट बुरशीजन्य रोग पसरला आहे. त्वरित ट्रायसायक्लाझोल ०.६ ग्रॅम प्रति लिटर फवारा.',
      kn: 'ಭತ್ತದ ಬೆಳೆಯಲ್ಲಿ ಬ್ಲಾಸ್ಟ್ ಶಿಲೀಂಧ್ರ ರೋಗ ಕಂಡುಬಂದಿದೆ. ತಕ್ಷಣ 0.6 ಗ್ರಾಂ ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ ಸಿಂಪಡಿಸಿ.',
      te: 'వరి పంటలో బ్లాస్ట్ తెగులు వ్యాపించింది. వెంటనే లీటరుకు 0.6 గ్రాముల ట్రైసైక్లాజోల్ పిచికారీ చేయండి.',
      gu: 'ડાંગરના પાકમાં બ્લાસ્ટ ફૂગનો રોગ ફેલાયો છે. તુરંત 0.6 ગ્રામ ટ્રાઇસાયક્લાઝોલ પ્રતિ લિટર છાંટો.'
    },
    sampleImageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80'
  },
  'potato-late': {
    id: 'potato-late',
    cropName: 'Potato (Solanum tuberosum)',
    scientificName: 'Phytophthora infestans',
    diseaseName: 'Potato Late Blight',
    confidence: 99.1,
    badgeText: 'Critical Blight Alert',
    badgeType: 'critical',
    foliarLesionPercent: 99.1,
    description: 'Water-soaked irregular dark green lesions turning purplish-black with white mildew fuzz on leaf undersides during high moisture periods.',
    organicTreatments: [
      'Copper Hydroxide organic formulation at 2g/L.',
      'Ensure rapid field drainage; ridging high soil around tubers.',
      'Destruction of volunteer solanaceous weed hosts.'
    ],
    chemicalTreatments: [
      'Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L.',
      'Cymoxanil 8% + Mancozeb 64% WP @ 1.5g/L.',
      'Apply systemic fungicide before next anticipated rainfall.'
    ],
    audioAdvisories: {
      en: 'Potato late blight critical alert. Apply systemic Metalaxyl plus Mancozeb at 2.5 grams per liter before rain.',
      hi: 'आलू में पछेती झुलसा का संक्रमण है। बारिश से पहले तुरंत मेटालेक्सिल और मैंकोजेब का स्प्रे करें।',
      mr: 'बटाट्यावर उशिरा येणारा करपा रोग आढळला आहे. पावसापूर्वी मेटलॅक्सिल अधिक मँकोझेब फवारा.',
      kn: 'ಆಲೂಗೆಡ್ಡೆಯಲ್ಲಿ ತಡವಾದ ಮುರುಟು ರೋಗವಿದೆ. ಮಳೆ ಬರುವ ಮುನ್ನ ಮೆಟಾಲಾಕ್ಸಿಲ್ ಸಿಂಪಡಿಸಿ.',
      te: 'బంగాళాదుంపలో లేట్ బ్లైట్ తెగులు సోకింది. వర్షానికి ముందే మెటలాక్సిల్ స్ప్రే చేయండి.',
      gu: 'બટાટામાં પાછોતરો સુકારો રોગ જોવા મળ્યો છે. વરસાદ પહેલા મેટાલેક્સિલ વત્તા મેન્કોઝેબ છાંટો.'
    },
    sampleImageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80'
  },
  'healthy-soybean': {
    id: 'healthy-soybean',
    cropName: 'Soybean (Glycine max)',
    scientificName: 'Glycine max (L.) Merr.',
    diseaseName: 'Healthy Foliage',
    confidence: 99.8,
    badgeText: 'Optimal Health',
    badgeType: 'optimal',
    foliarLesionPercent: 0.2,
    description: 'Intact mesophyll structure, optimal chlorophyll fluorescence (4.1 index), zero pathogenic spotting or chlorosis detected.',
    organicTreatments: [
      'Maintain balanced microbial composting.',
      'Continue standard vermiwash fertigation schedule.',
      'Encourage beneficial entomopathogenic insects.'
    ],
    chemicalTreatments: [
      'No chemical intervention required.',
      'Maintain routine preventive monitoring every 14 days.'
    ],
    audioAdvisories: {
      en: 'Crop foliage is completely healthy. Mesophyll intact and chlorophyll nominal. No chemical treatment required.',
      hi: 'फसल पूरी तरह स्वस्थ है। पर्णहरित संतुलित है, किसी कीटनाशक या दवा की आवश्यकता नहीं है।',
      mr: 'पीक पूर्णपणे निरोगी आहे. क्लोरोफिल योग्य असून कोणत्याही कीटकनाशकाची गरज नाही.',
      kn: 'ಬೆಳೆ ಸಂಪೂರ್ಣವಾಗಿ ಆರೋಗ್ಯಕರವಾಗಿದೆ. ಯಾವುದೇ ಕೀಟನಾಶಕ ಅಗತ್ಯವಿಲ್ಲ.',
      te: 'పంట చాలా ఆరోగ్యంగా ఉంది. ఎలాంటి రసాయన మందుల పిచಿಕారీ అవసరం లేదు.',
      gu: 'પાક સંપૂર્ણપણે સ્વસ્થ છે. ક્લોરોફિલ બરાબર છે અને કોઈ દવાની જરૂર નથી.'
    },
    sampleImageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1VwCB9VY5ixcoI9Jo1iuHrH1zGHExWConAUzSVjdnXoKOK3QLpBqL4PTboHWLdGtCzh_jZTFrwrPM1hy9-nni9eCYPsByhTvJpIdBeevEfYPGhUZnJqj-uVXYKxZp4J1L8x-j6MGn9PS7Xe4zp_u7vz-uh-_fQ3_NpStDvsjQAWh3XHXkIXtJHRMNzFnNb1cZ-9pbzslWWPeP4Zqm9m4Y9oUwPC157Yp9V6dWEvJqtSmwcK840CmDQb7bs'
  }
};

export const REGIONAL_PRESETS: Record<string, { name: string; metrics: SoilMetrics }> = {
  'punjab-wheat': {
    name: 'Kharif / Rabi - Punjab',
    metrics: {
      nitrogen: 110,
      phosphorus: 50,
      potassium: 40,
      ph: 7.2,
      temperature: 18.0,
      humidity: 55,
      rainfall: 75
    }
  },
  'karnataka-rabi': {
    name: 'Rabi - Karnataka',
    metrics: {
      nitrogen: 45,
      phosphorus: 65,
      potassium: 75,
      ph: 6.8,
      temperature: 28.5,
      humidity: 45,
      rainfall: 60
    }
  },
  'bengal-paddy': {
    name: 'Bengal Delta Paddy',
    metrics: {
      nitrogen: 95,
      phosphorus: 45,
      potassium: 40,
      ph: 6.4,
      temperature: 30.0,
      humidity: 88,
      rainfall: 240
    }
  },
  'gujarat-cotton': {
    name: 'Gujarat Black Soil Belt',
    metrics: {
      nitrogen: 120,
      phosphorus: 40,
      potassium: 30,
      ph: 7.8,
      temperature: 32.0,
      humidity: 62,
      rainfall: 95
    }
  }
};

// Agronomic Random Forest classifier simulation based on ICAR 7-feature NPK data
export function calculateCropRecommendation(m: SoilMetrics): CropRecommendation {
  const { nitrogen: n, phosphorus: p, potassium: k, ph, temperature: t, humidity: h, rainfall: r } = m;

  // 1. High water + high humidity -> Paddy / Rice
  if (r > 175 && h > 70) {
    return {
      cropName: 'Rice (Paddy)',
      latinName: 'Oryza sativa • High Moisture Cultivar',
      yieldPotential: '4.8 MT / ha',
      mspRate: '₹2,300 / qtl',
      waterDemand: 'High (Flood/AWD)',
      waterDetail: `Optimal for rain: ${r}mm`,
      netMargin: '₹44,500 / acre',
      profitBadge: 'High Profitability',
      alternativeCrop: 'Jute (Corchorus)',
      alternativeMatch: 87.4,
      iconName: 'grass',
      rationale: 'Abundant seasonal precipitation and elevated ambient humidity provide ideal swamp conditions for paddy tillering.'
    };
  }

  // 2. Cool temperature + moderate rain + high N -> Wheat
  if (t < 23 && r < 110 && n > 70) {
    return {
      cropName: 'Wheat (Kalyan Sona)',
      latinName: 'Triticum aestivum • Rabi Season',
      yieldPotential: '5.2 MT / ha',
      mspRate: '₹2,425 / qtl',
      waterDemand: 'Medium (3 Irrigations)',
      waterDetail: 'Critical crown root initiation at 21d',
      netMargin: '₹38,200 / acre',
      profitBadge: 'Guaranteed MSP Procurement',
      alternativeCrop: 'Mustard (Brassica)',
      alternativeMatch: 91.0,
      iconName: 'grain',
      rationale: 'Sub-23°C diurnal temperatures with neutral pH support deep root penetration and heavy grain filling.'
    };
  }

  // 3. High Potassium + low rain -> Chickpea / Pulses
  if (k > 50 && r < 115) {
    return {
      cropName: 'Chickpea (Chana)',
      latinName: 'Cicer arietinum • Semi-Arid Pulse',
      yieldPotential: '2.1 MT / ha',
      mspRate: '₹5,440 / qtl',
      waterDemand: 'Low (Drought Resilient)',
      waterDetail: 'Thrives in residual sub-soil moisture',
      netMargin: '₹49,000 / acre',
      profitBadge: 'High Margin / Low Input',
      alternativeCrop: 'Pigeon Pea (Tur)',
      alternativeMatch: 84.3,
      iconName: 'psychiatry',
      rationale: 'High available potassium combined with low rainfall minimizes root rot while maximizing nodular nitrogen fixation.'
    };
  }

  // 4. Moderate/High rain + warm temp + balanced NPK -> Cotton
  if (n > 85 && t >= 25 && ph >= 6.5) {
    return {
      cropName: 'Cotton (Bt Hybrid)',
      latinName: 'Gossypium hirsutum • Deep Taproot',
      yieldPotential: '3.4 MT / ha',
      mspRate: '₹7,120 / qtl',
      waterDemand: 'Medium-High',
      waterDetail: 'Critical at flowering and boll formation',
      netMargin: '₹52,300 / acre',
      profitBadge: 'Bumper Cash Crop',
      alternativeCrop: 'Maize (Zea mays)',
      alternativeMatch: 89.6,
      iconName: 'spa',
      rationale: 'Warm sunny weather with alkaline-leaning pH ensures uniform boll opening and high staple length.'
    };
  }

  // 5. Warm temp + moderate rain + moderate NPK -> Maize / Corn
  if (t >= 22 && r >= 80) {
    return {
      cropName: 'Maize (Kharif Hybrid)',
      latinName: 'Zea mays • C4 Photosynthetic',
      yieldPotential: '6.5 MT / ha',
      mspRate: '₹2,090 / qtl',
      waterDemand: 'Moderate (Furrow Irrigation)',
      waterDetail: 'High water-use efficiency',
      netMargin: '₹36,000 / acre',
      profitBadge: 'Consistent Industrial Demand',
      alternativeCrop: 'Soybean (Glycine max)',
      alternativeMatch: 86.1,
      iconName: 'energy_savings_leaf',
      rationale: 'C4 metabolic pathway maximizes solar radiation conversion in 22–32°C temperature bands.'
    };
  }

  // Default fallback -> Groundnut / Peanut
  return {
    cropName: 'Groundnut (Peanut)',
    latinName: 'Arachis hypogaea • Leguminous Oilseed',
    yieldPotential: '2.8 MT / ha',
    mspRate: '₹6,377 / qtl',
    waterDemand: 'Low-Medium',
    waterDetail: 'Requires light sandy-loam friability',
    netMargin: '₹46,800 / acre',
    profitBadge: 'High Oil Content Premium',
    alternativeCrop: 'Sesame (Sesamum indicum)',
    alternativeMatch: 82.5,
    iconName: 'eco',
    rationale: 'Friable soil conditions with balanced micro-nutrients facilitate pegging and uniform pod development.'
  };
}

export const LIVE_MANDI_DATA: MandiItem[] = [
  { commodity: 'Cotton (Medium Staple)', variety: 'Bt Hybrid', mandi: 'Rajkot Mandi', state: 'Gujarat', modalPrice: 7250, change: 140, trend: 'up' },
  { commodity: 'Soybean (Yellow)', variety: 'JS-335', mandi: 'Indore Mandi', state: 'Madhya Pradesh', modalPrice: 4680, change: 85, trend: 'up' },
  { commodity: 'Wheat (Sharbati)', variety: 'Kalyan Sona', mandi: 'Khanna Mandi', state: 'Punjab', modalPrice: 2840, change: -20, trend: 'down' },
  { commodity: 'Red Onion', variety: 'Nashik Garva', mandi: 'Lasalgaon Mandi', state: 'Maharashtra', modalPrice: 1850, change: 110, trend: 'up' },
  { commodity: 'Chana (Gram)', variety: 'Desi Bold', mandi: 'Gulbarga Mandi', state: 'Karnataka', modalPrice: 5650, change: 70, trend: 'up' },
  { commodity: 'Mustard (Sarson)', variety: 'Pusa Bold', mandi: 'Bharatpur Mandi', state: 'Rajasthan', modalPrice: 5320, change: -45, trend: 'down' },
];

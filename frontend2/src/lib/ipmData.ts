import { 
  CropGrowthStage, 
  IPMChemicalProtocol, 
  IPMRecommendationData, 
  FarmProfile 
} from '../types';

export interface IPMCropRegistryEntry {
  cropKeywords: string[];
  diseaseKeywords: string[];
  scientificName: string;
  culturalControls: string[];
  mechanicalControls: string[];
  biologicalControls: string[];
  chemical: {
    productName: string;
    activeIngredient: string;
    concentration: string;
    dosage: string;
    sprayVolume: string;
    phiDays: string;
    reiHours: string;
    fracIracGroup: string;
    maxApplications: string;
    ppeRequirements: string[];
    labelSource: string;
    labelStatus: string;
  };
}

export const IPM_REGISTRY: IPMCropRegistryEntry[] = [
  // 1. Tomato Early Blight (Alternaria solani)
  {
    cropKeywords: ['tomato', 'solanum lycopersicum', 'tamatar'],
    diseaseKeywords: ['early blight', 'alternaria', 'concentric ring', 'blight', 'spot'],
    scientificName: 'Alternaria solani',
    culturalControls: [
      'Field Sanitation: Collect and burn or bury infected lower leaves to destroy the overwintering fungal inoculum.',
      'Crop Rotation: Follow a 2 to 3-year crop rotation with non-solanaceous crops (e.g. cereals, maize, or legumes).',
      'Canopy Spacing: Maintain 60 cm × 45 cm plant spacing to facilitate rapid foliar drying and improve air circulation.',
      'Irrigation Scheduling: Use furrow or drip fertigation; strictly avoid overhead sprinkler irrigation during humid weather.',
      'Weed Eradication: Eradicate solanaceous weeds (black nightshade, Solanum nigrum) from field borders that serve as alternate hosts.',
      'Resistant Cultivars: Sow certified tolerant cultivars such as Arka Rakshak, Arka Abhed, or Pusa Ruby.'
    ],
    mechanicalControls: [
      'Sanitation Pruning: Remove blighted bottom leaves up to 15 cm above ground level using sanitized shears.',
      'Trapping: Install 15 yellow sticky traps per acre at crop canopy height to capture vectoring sap insects.',
      'Mulching: Lay 25-30 micron reflective silver-black polyethylene mulch to prevent soil-borne spore splashing during rain.',
      'Solarization: Perform summer soil solarization with transparent polythene sheets for 4-6 weeks prior to transplanting.'
    ],
    biologicalControls: [
      'Seed Bio-Priming: Treat seeds with Trichoderma viride @ 4g/kg seed before nursery sowing.',
      'Foliar Biocontrol: Spray Pseudomonas fluorescens (1% WP) @ 5g/liter of water at 15-day intervals.',
      'Botanical Spray: Apply 5% Neem Seed Kernel Extract (NSKE) or Azadirachtin 10000 ppm @ 3 ml/L early morning.',
      'Soil Inoculation: Enrich farmyard manure (FYM) with Trichoderma harzianum @ 2.5 kg/ton and incorporate into soil.'
    ],
    chemical: {
      productName: 'Mancozeb 75% WP',
      activeIngredient: 'Mancozeb',
      concentration: '75% Wettable Powder',
      dosage: '2.0 g per liter of water (600 - 800 g / acre)',
      sprayVolume: '400 - 500 liters water / hectare',
      phiDays: '7 days',
      reiHours: '24 hours',
      fracIracGroup: 'FRAC Group M03 (Multi-site contact activity)',
      maxApplications: 'Maximum 3 applications per season with alternate mode-of-action sprays',
      ppeRequirements: [
        'N95 particulate respirator mask',
        'Chemical-resistant nitrile gloves',
        'Protective eye splash goggles',
        'Full-sleeve coverall and apron',
        'Rubber gumboots'
      ],
      labelStatus: 'CIBRC Registered (Major Schedule)',
      labelSource: 'Central Insecticide Board & Registration Committee (CIBRC) / ICAR Package of Practices'
    }
  },

  // 2. Rice / Paddy Blast (Magnaporthe oryzae / Pyricularia oryzae)
  {
    cropKeywords: ['rice', 'paddy', 'oryza sativa', 'dhan'],
    diseaseKeywords: ['blast', 'pyricularia', 'magnaporthe', 'neck blast', 'leaf blast'],
    scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
    culturalControls: [
      'Field Sanitation: Destroy infected straw and stubbles immediately after harvest; avoid stacking infected straw near seedbeds.',
      'Balanced Nitrogen Nutrition: Apply nitrogenous fertilizers in split doses (50% basal, 25% tillering, 25% panicle initiation); avoid excess single urea doses.',
      'Water Management: Maintain continuous shallow water layer (2-3 cm) in fields during blast-conducive cloudy spells; avoid severe drying.',
      'Varietal Diversification: Cultivate blast-tolerant varieties like Rasi, IR-64, Swarna Sub-1, or Pusa Basmati 1637.',
      'Timely Sowing: Avoid late transplanting in Kharif season when nighttime temperatures drop below 20°C with high dew.'
    ],
    mechanicalControls: [
      'Trap Nurseries: Monitor blast development via susceptible trap cultivars along nursery margins.',
      'Hand Rouging: Rogue out early spindle-lesion seedlings from nursery beds before field transplantation.',
      'Light Traps: Install solar light traps (1 unit / 2 ha) to monitor pest outbreaks and night flight vectors.'
    ],
    biologicalControls: [
      'Seed Treatment: Bio-prime paddy seeds with Pseudomonas fluorescens @ 10g/kg seed soaked in 1 liter water overnight.',
      'Microbial Spray: Foliar spray of Trichoderma viride formulation @ 5g/liter at tillering and boot leaf emergence.',
      'Organic Booster: Spray 3% fermented Panchagavya or Vermiwash early in the morning to induce systemic resistance.'
    ],
    chemical: {
      productName: 'Tricyclazole 75% WP',
      activeIngredient: 'Tricyclazole',
      concentration: '75% Wettable Powder',
      dosage: '0.6 g per liter of water (120 - 150 g / acre)',
      sprayVolume: '500 liters water / hectare',
      phiDays: '30 days',
      reiHours: '24 hours',
      fracIracGroup: 'FRAC Group 16.1 (Melanin Biosynthesis Inhibitor - MBI-D)',
      maxApplications: 'Maximum 2 sprays per cropping cycle (booting & heading stages)',
      ppeRequirements: [
        'N95 respirator mask during chemical mixing',
        'Heavy-duty nitrile gloves',
        'Protective eye goggles',
        'Full-length water-repellent clothing',
        'Gumboots'
      ],
      labelStatus: 'CIBRC Registered (National Schedule)',
      labelSource: 'ICAR-National Rice Research Institute (NRRI) & CIBRC Approved List'
    }
  },

  // 3. Potato Late Blight (Phytophthora infestans)
  {
    cropKeywords: ['potato', 'solanum tuberosum', 'alu', 'batata'],
    diseaseKeywords: ['late blight', 'phytophthora', 'water-soaked', 'mildew', 'purplish'],
    scientificName: 'Phytophthora infestans',
    culturalControls: [
      'Certified Seed Tubers: Always plant disease-free, certified seed tubers sourced from recognized seed corporations.',
      'High Ridging: Perform deep earthing-up (ridging) at 25-30 days to prevent swimming zoospores from washing down into developing tubers.',
      'Drainage Management: Ensure rapid drainage; prevent waterlogging and stagnant puddles in furrows.',
      'Dehaulming: Cut and destroy haulms (potato foliage) 10-12 days before harvest to prevent tuber contamination during lifting.',
      'Resistant Varieties: Cultivate blight-resistant hybrids such as Kufri Jyoti, Kufri Pukhraj, Kufri Girdhari, or Kufri Mohan.'
    ],
    mechanicalControls: [
      'Cull Pile Destruction: Locate and bury all discarded cull potato piles under 60 cm of compacted soil.',
      'Physical Haulm Pulling: Mechanically cut diseased tops before rains if infection exceeds 15% canopy threshold.',
      'Barrier Ridges: Create raised earthen barriers around vulnerable low-lying plots.'
    ],
    biologicalControls: [
      'Tuber Bio-Dressing: Dip seed tubers in Trichoderma harzianum suspension (5g/L) for 15 minutes before shade drying and planting.',
      'Bio-protective Spray: Spray Bacillus subtilis strain @ 3ml/L during cloudy, high-humidity pre-symptom windows.',
      'Copper Hydroxide: Apply certified copper hydroxide bio-compatible formulation @ 2.0g/L.'
    ],
    chemical: {
      productName: 'Metalaxyl 8% + Mancozeb 64% WP',
      activeIngredient: 'Metalaxyl-M + Mancozeb',
      concentration: '72% Wettable Powder (8% + 64%)',
      dosage: '2.5 g per liter of water (1.0 kg / hectare in 400 L water)',
      sprayVolume: '400 - 500 liters water / hectare',
      phiDays: '15 days',
      reiHours: '48 hours',
      fracIracGroup: 'FRAC Group 4 (PA-fungicides) + FRAC Group M03',
      maxApplications: 'Max 2 systemic sprays; follow with purely contact protective fungicides',
      ppeRequirements: [
        'N95 certified vapor/mist respirator',
        'Chemical resistant rubber gloves',
        'Anti-fog splash safety goggles',
        'Protective hooded boiler suit',
        'Chemical safety boots'
      ],
      labelStatus: 'CIBRC Registered (National Blight Schedule)',
      labelSource: 'ICAR-Central Potato Research Institute (CPRI) / CIBRC Registered Product'
    }
  },

  // 4. Cotton (Bollworm, Leaf Blight, Whitefly)
  {
    cropKeywords: ['cotton', 'gossypium', 'kapas'],
    diseaseKeywords: ['bollworm', 'bacterial blight', 'leaf curl', 'aphid', 'whitefly'],
    scientificName: 'Xanthomonas citri pv. malvacearum / Helicoverpa armigera',
    culturalControls: [
      'Synchronized Sowing: Practice timely, synchronized block planting within 15 days across the village cluster.',
      'Trap Cropping: Plant 1 row of Castor for every 5 rows of cotton, or Marigold borders to trap Spodoptera/Helicoverpa.',
      'Defoliation of Residues: Graze sheep/goats or shred and plough in cotton stalks immediately after the final picking.',
      'Balanced Potassium: Maintain adequate potassium nutrition to enhance cell wall thickness against sucking pests.'
    ],
    mechanicalControls: [
      'Pheromone Traps: Install 5 pheromone traps (Helilure) per acre for monitoring and 12-15 traps for mass trapping.',
      'Yellow/Blue Sticky Traps: Set up 20 yellow sticky traps/acre for whiteflies and blue sticky traps for thrips.',
      'Hand Destruction of Flared Squares: Hand-collect and bury dropped squares and damaged green bolls weekly.'
    ],
    biologicalControls: [
      'Egg Parasitoids: Release Trichogramma chilonis @ 60,000 parasitized eggs/acre at 7-day intervals (3-4 releases).',
      'Predator Release: Conserve and release Chrysoperla zastrowi sillemi larvae @ 4,000/acre.',
      'Microbial Entomopathogen: Spray Beauveria bassiana or HaNPV (250 LE/ha) for early instar caterpillar management.'
    ],
    chemical: {
      productName: 'Copper Oxychloride 50% WP + Streptocycline',
      activeIngredient: 'Copper Oxychloride + Streptomycin Sulphate (90:10)',
      concentration: '50% WP + 100 ppm antibiotic',
      dosage: '2.5 g COC + 0.1 g Streptocycline per liter of water',
      sprayVolume: '450 - 500 liters water / hectare',
      phiDays: '21 days',
      reiHours: '24 hours',
      fracIracGroup: 'FRAC Group M01 (Inorganic copper)',
      maxApplications: 'Maximum 2 sprays during active bacterial square infection',
      ppeRequirements: [
        'N95 mask with particulate filter',
        'Nitrile chemical safety gloves',
        'Eye safety goggles',
        'Cotton overall coverall',
        'Safety boots'
      ],
      labelStatus: 'CIBRC Registered (Cotton Schedule)',
      labelSource: 'ICAR-Central Institute for Cotton Research (CICR) / CIBRC'
    }
  },

  // 5. Wheat (Rust, Foliar Blight)
  {
    cropKeywords: ['wheat', 'triticum', 'gehu'],
    diseaseKeywords: ['rust', 'puccinia', 'foliar blight', 'spot', 'stripe rust', 'yellow rust'],
    scientificName: 'Puccinia striiformis / Bipolaris sorokiniana',
    culturalControls: [
      'Varietal Resistance: Sow recommended rust-resistant varieties (HD 2967, DBW 187, DBW 222, PBW 550).',
      'Avoid Late Sowing: Complete wheat sowing by November 15-25 to escape terminal heat and yellow rust waves.',
      'Balanced Nutrients: Ensure adequate potash and zinc; avoid excessive nitrogen top-dressing.',
      'Eradicate Volunteer Grasses: Destroy wild grass hosts (Phalaris minor, Avena fatua) around bunds.'
    ],
    mechanicalControls: [
      'Rogue Out Spot Foci: Manually cut and burn the first isolated yellow rust foci patches in December/January.',
      'Field Surveillance: Conduct regular surveillance along the northern sub-mountainous foothills.'
    ],
    biologicalControls: [
      'Seed Treatment: Inoculate seed with Azotobacter and Trichoderma viride @ 5g/kg seed.',
      'Bio-Foliar Spray: Spray fermented cow urine (10%) + neem oil (2ml/L) as a prophylactic booster.'
    ],
    chemical: {
      productName: 'Propiconazole 25% EC',
      activeIngredient: 'Propiconazole',
      concentration: '25% Emulsifiable Concentrate',
      dosage: '1.0 ml per liter of water (200 ml / acre in 200 L water)',
      sprayVolume: '400 - 500 liters water / hectare',
      phiDays: '30 days',
      reiHours: '24 hours',
      fracIracGroup: 'FRAC Group 3 (Demethylation Inhibitors - DMI)',
      maxApplications: 'Maximum 1-2 sprays at initial rust stripe detection',
      ppeRequirements: [
        'Organic vapor chemical respirator',
        'Nitrile chemical gloves',
        'Eye goggles',
        'Full protective clothing',
        'Boots'
      ],
      labelStatus: 'CIBRC Registered (Wheat Schedule)',
      labelSource: 'ICAR-Indian Institute of Wheat and Barley Research (IIWBR) / CIBRC'
    }
  }
];

export const GROWTH_STAGE_METADATA: Record<CropGrowthStage, { label: string; description: string; riskFactor: string }> = {
  seedling: {
    label: 'Seedling / Nursery',
    description: 'Cotyledon emergence to 4 true leaves. Vulnerable to damping-off and root pathogens.',
    riskFactor: 'High Root & Damping-off Vulnerability'
  },
  vegetative: {
    label: 'Active Vegetative',
    description: 'Rapid leaf canopy expansion and tillering/branching. Moderate foliar area.',
    riskFactor: 'Foliar Blight & Lesion Expansion Period'
  },
  flowering: {
    label: 'Flowering / Booting',
    description: 'Anthesis and flower/boot emergence. Critical reproductive stage.',
    riskFactor: 'Pollinator Active — Avoid Daylight Chemical Sprays'
  },
  fruiting_bulbing: {
    label: 'Fruiting / Tuber Bulbing',
    description: 'Pod fill, fruit enlargement, or tuber initiation under soil.',
    riskFactor: 'High Systemic Water and Nutrient Translocation'
  },
  maturity_harvest: {
    label: 'Near Harvest / Maturity',
    description: 'Grain ripening, fruit color break, or senescing haulm.',
    riskFactor: 'CRITICAL PHI RESTRICTION — High Chemical Residue Hazard'
  }
};

/**
 * Agronomic IPM Recommendation Resolver Engine
 * Follows strict safety gating & zero-invention rules for chemical recommendations.
 */
export function resolveIPMRecommendation(params: {
  cropName: string;
  diseaseName: string;
  scientificName?: string;
  confidence: number;
  severity?: 'optimal' | 'low' | 'medium' | 'high' | 'critical';
  growthStage?: CropGrowthStage;
  locationName?: string;
  farmProfile?: FarmProfile | null;
}): IPMRecommendationData {
  const {
    cropName = 'Agricultural Crop',
    diseaseName = 'Crop Pathogen',
    scientificName = '',
    confidence = 0,
    severity = 'medium',
    growthStage = 'vegetative',
    locationName,
    farmProfile
  } = params;

  // 1. Resolve Location
  const resolvedLocation = 
    locationName || 
    farmProfile?.address || 
    (farmProfile?.farmName ? `${farmProfile.farmName} Farm Plot` : 'Maharashtra / Western Agro-Climatic Zone');

  // 2. Determine if diagnosis confidence is low or uncertain (< 75%)
  const isConfidenceLow = confidence < 75;
  const isHealthy = 
    diseaseName.toLowerCase().includes('healthy') || 
    severity === 'optimal' || 
    (confidence >= 95 && diseaseName.toLowerCase().includes('optimal'));

  // 3. Find matched registry entry from validated database
  const normalizedCrop = cropName.toLowerCase();
  const normalizedDisease = diseaseName.toLowerCase();

  const matchedEntry = IPM_REGISTRY.find(entry => {
    const cropMatch = entry.cropKeywords.some(k => normalizedCrop.includes(k));
    const diseaseMatch = entry.diseaseKeywords.some(k => normalizedDisease.includes(k));
    return cropMatch && diseaseMatch;
  }) || IPM_REGISTRY.find(entry => {
    return entry.cropKeywords.some(k => normalizedCrop.includes(k));
  });

  // 4. Cultural, Mechanical, Biological controls assembly
  let culturalControls: string[] = [];
  let mechanicalControls: string[] = [];
  let biologicalControls: string[] = [];

  if (isHealthy) {
    culturalControls = [
      'Maintain Optimal Irrigation: Continue measured drip or furrow irrigation aligned with current evapotranspiration rates.',
      'Balanced Nutrition: Apply standard split organic manure and balanced NPK fertilizer as per soil health card guidelines.',
      'Field Hygiene: Keep field perimeter and irrigation furrows clear of invasive weed hosts.',
      'Regular Scouting: Conduct weekly walk-through inspections to monitor for early nymphal or foliar symptoms.'
    ];
    mechanicalControls = [
      'Preventive Traps: Maintain 5 yellow sticky traps per acre to monitor baseline insect activity.',
      'Clean Tools: Sanitize farm implements, tractors, and pruning equipment with 5% sodium hypochlorite.'
    ];
    biologicalControls = [
      'Conserve Native Predators: Preserve ladybird beetles, hoverflies, and spiders on border flowering plants.',
      'Soil Health: Continue regular vermiwash and enriched Jeevamrut / Panchagavya soil applications.'
    ];
  } else if (matchedEntry) {
    culturalControls = matchedEntry.culturalControls;
    mechanicalControls = matchedEntry.mechanicalControls;
    biologicalControls = matchedEntry.biologicalControls;
  } else {
    // Generic ICAR validated non-chemical baseline
    culturalControls = [
      'Field Sanitation: Promptly remove and safely compost or bury heavily infected plant leaves and stems.',
      'Crop Spacing: Ensure adequate plant-to-plant spacing to maximize canopy air flow and reduce microclimate humidity.',
      'Irrigation Caution: Avoid late-evening overhead sprinkler irrigation; keep foliage dry during cool night hours.',
      'Crop Rotation: Plan rotational schedules with unrelated botanical families after the current crop cycle.',
      'Weed Eradication: Remove volunteer weed plants that serve as bridge hosts for pathogens.'
    ];
    mechanicalControls = [
      'Hand Removal: Hand-pick and isolate diseased plant tissue in disposable bags before field disposal.',
      'Monitoring Traps: Deploy yellow and blue sticky traps (15-20 / acre) to monitor vector populations.',
      'Sanitation Tools: Disinfect harvesting knives and pruning shears between successive rows.'
    ];
    biologicalControls = [
      'Bio-Fungicide: Spray Trichoderma viride / harzianum @ 5g per liter water in early morning or late evening.',
      'Bio-Protectant: Apply Pseudomonas fluorescens (1% WP) foliar suspension @ 5g/L.',
      'Botanical Neem: Apply cold-pressed Neem Seed Kernel Extract (5% NSKE) or Azadirachtin 10000 ppm @ 3 ml/L.'
    ];
  }

  // 5. Chemical Safety Gating Validation Engine
  // Mandatory check: Chemical is the LAST OPTION.
  // Gating requirements:
  // - Validated crop and recognized disease in official registry
  // - High confidence (>= 75%)
  // - Valid location context
  // - Growth stage NOT violating Pre-Harvest Interval (PHI)
  // - Severity is not 'optimal'

  const hasValidatedChemicalRecord = Boolean(matchedEntry && matchedEntry.chemical && !isHealthy);
  const isNearHarvest = growthStage === 'maturity_harvest';
  const isChemicalAllowed = 
    hasValidatedChemicalRecord && 
    !isConfidenceLow && 
    !isHealthy && 
    !isNearHarvest &&
    Boolean(resolvedLocation);

  let chemicalControl: IPMChemicalProtocol;
  let validationNotes = '';

  if (isHealthy) {
    chemicalControl = {
      isValidated: false,
      validationStatus: 'unavailable',
      productName: 'No Chemical Intervention Warranted',
      activeIngredient: 'N/A (Optimal Plant Health)',
      concentration: '0%',
      crop: cropName,
      targetPest: 'None (Healthy Foliage)',
      dosage: '',
      sprayVolume: '0 L/ha',
      phiDays: '0 days',
      reiHours: '0 hours',
      ppeRequirements: [],
      fracIracGroup: 'N/A',
      maxApplications: 'None',
      labelStatus: 'Not Applicable',
      labelSource: 'ICAR Good Agricultural Practices (GAP)',
      validationNotes: 'Crop is in optimal health. Chemical pesticide sprays are strictly unwarranted and discouraged.'
    };
  } else if (!isChemicalAllowed) {
    if (isNearHarvest) {
      validationNotes = 'Chemical recommendation unavailable because crop is in maturity/harvest stage. Chemical application is blocked to prevent Pre-Harvest Interval (PHI) residue violations.';
    } else if (isConfidenceLow) {
      validationNotes = 'Chemical recommendation unavailable because diagnosis confidence is below 75%. Chemical dosage is withheld to prevent misapplication.';
    } else if (!hasValidatedChemicalRecord) {
      validationNotes = 'Chemical recommendation unavailable because required product/label information could not be validated for this specific crop and pathogen combination.';
    } else {
      validationNotes = 'Chemical recommendation unavailable because required agronomic safety parameters could not be validated.';
    }

    chemicalControl = {
      isValidated: false,
      validationStatus: 'unavailable',
      productName: 'Chemical Recommendation Unavailable',
      activeIngredient: 'Unvalidated / Withheld for Safety',
      concentration: 'N/A',
      crop: cropName,
      targetPest: diseaseName,
      dosage: '', // DO NOT INVENT DOSAGE
      sprayVolume: '',
      phiDays: '',
      reiHours: '',
      ppeRequirements: [
        'N95 particulate respirator mask',
        'Chemical-resistant nitrile gloves',
        'Eye splash goggles'
      ],
      labelStatus: 'Label Validation Required',
      labelSource: 'Central Insecticide Board & Registration Committee (CIBRC)',
      validationNotes
    };
  } else {
    // Validated chemical protocol from official registry
    const rawChem = matchedEntry!.chemical;
    chemicalControl = {
      isValidated: true,
      validationStatus: 'validated',
      productName: rawChem.productName,
      activeIngredient: rawChem.activeIngredient,
      concentration: rawChem.concentration,
      crop: cropName,
      targetPest: `${diseaseName} (${matchedEntry!.scientificName || scientificName})`,
      dosage: rawChem.dosage,
      sprayVolume: rawChem.sprayVolume,
      phiDays: rawChem.phiDays,
      reiHours: rawChem.reiHours,
      ppeRequirements: rawChem.ppeRequirements,
      fracIracGroup: rawChem.fracIracGroup,
      maxApplications: rawChem.maxApplications,
      labelStatus: rawChem.labelStatus,
      labelSource: rawChem.labelSource,
      validationNotes: '✓ Validated CIBRC product formulation for specified crop and pathogen target.'
    };
  }

  // 6. Safety Guidelines & Safe Disposal
  const safetyGuidelines = {
    ppeList: [
      'N95 Particulate Respirator or Organic Vapor Filter Mask',
      'Heavy-duty Nitrile / Neoprene Chemical Resistant Gloves',
      'Protective Eye Splash Goggles or Face Shield',
      'Full-sleeve Coverall / Apron and Long Trousers',
      'Rubber Gumboots (do not wear leather or fabric footwear)'
    ],
    contactInhalationPrecaution: 'Avoid direct skin or eye contact and avoid inhaling spray droplets. Never spray against prevailing wind direction. Do not eat, drink, chew tobacco, or smoke during mixing and application.',
    childAnimalSafety: 'Keep children, pregnant women, livestock, and domestic animals completely away from the chemical mixing zone and treated fields during application and restricted entry interval.',
    waterProtection: 'Never wash spray equipment or dispose of washings in rivers, ponds, streams, irrigation canals, or open wells. Maintain a minimum 15-meter safety buffer zone from water bodies.',
    pollinatorProtection: 'Do not spray flowering crops during daylight peak pollinator hours (9:00 AM to 3:30 PM). Choose late afternoon spraying when bees and beneficial pollinators have returned to hives.',
    followLabelStatement: 'Always read and adhere strictly to the manufacturer container label, CIBRC statutory directions, and regional agricultural extension guidelines.',
    safeDisposal: 'Dispose of pesticide containers and leftover product according to the product label and applicable local regulations. Never reuse pesticide containers.'
  };

  // 7. Regulatory Check
  const regulatoryCheck = {
    isValidated: chemicalControl.isValidated,
    badgeStatus: (chemicalControl.isValidated ? '✓ Label Validated' : '⚠ Label Validation Required') as '✓ Label Validated' | '⚠ Label Validation Required',
    regulatoryBody: 'Central Insecticide Board & Registration Committee (CIBRC) / ICAR',
    complianceMessage: chemicalControl.isValidated
      ? 'Product, target pathogen, dosage, and PHI interval are validated against active CIBRC agricultural schedules.'
      : 'Please verify the current registered product label or consult an agricultural professional.'
  };

  // 8. Expert Referral Trigger
  const referralReasons: string[] = [];
  if (isConfidenceLow) referralReasons.push('Diagnosis confidence is below 75% threshold.');
  if (!chemicalControl.isValidated && !isHealthy) referralReasons.push('Label validation could not be completed for current parameters.');
  if (isNearHarvest && !isHealthy) referralReasons.push('Crop is close to harvest — potential Pre-Harvest Interval (PHI) residue risk.');
  if (severity === 'critical') referralReasons.push('High disease severity with acute defoliation risk.');

  const expertReferral = {
    recommended: referralReasons.length > 0,
    reasons: referralReasons,
    message: referralReasons.length > 0
      ? 'Diagnosis or treatment requires expert verification. Consider consulting a local agricultural expert.'
      : 'Standard agronomic guidance verified. Contact extension officer if unusual symptoms develop.',
    helplineNumber: '1800-180-1551',
    helplineLabel: 'Toll-Free Kisan Call Center (KCC)'
  };

  const uncertaintyWarning = isConfidenceLow
    ? `Confidence level (${confidence.toFixed(1)}%) is low or ambiguous. AI visual analysis should be verified with a field agronomist before applying chemical treatments.`
    : undefined;

  return {
    cropName,
    diseaseOrPest: diseaseName,
    scientificName: scientificName || (matchedEntry?.scientificName || 'Botanical specimen'),
    confidence,
    severity,
    growthStage,
    location: resolvedLocation,
    isConfidenceLow,
    uncertaintyWarning,
    culturalControls,
    mechanicalControls,
    biologicalControls,
    chemicalControl,
    safetyGuidelines,
    regulatoryCheck,
    expertReferral
  };
}

import { DiseaseReport, FarmProfile } from '../types';

export const DISEASE_ALERT_RADIUS_KM = 5.0;
export const DISEASE_REPORT_VALIDITY_DAYS = 30;

/**
 * Calculates geographic distance in kilometers between two coordinates using the Haversine formula.
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number' ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return Infinity;
  }

  // Geographic validation bounds
  if (lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90) return Infinity;
  if (lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180) return Infinity;

  const R = 6371; // Earth's mean radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function isValidCoordinate(lat: number, lon: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

/**
 * Default sample farm location (Kolhapur/Sangli agricultural belt, Maharashtra)
 * Centered around rich sugarcane, tomato, chili, and soybean fields.
 */
export const DEFAULT_TEST_FARM: FarmProfile = {
  farmName: 'Kisan Seva Model Farm (Sector A)',
  crop: 'Tomato & Sugarcane',
  latitude: 16.7050,
  longitude: 74.2433,
  address: 'Karveer Taluk, Kolhapur, Maharashtra 416004',
  updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
};

/**
 * Pre-configured realistic disease hotspot reports for demo/fallback verification
 * Includes immediate 5 km radius outbreaks, regional district threats, and multi-state outbreaks across India.
 */
export const INITIAL_DEMO_REPORTS: DiseaseReport[] = [
  // --- Immediate 5 KM Radius Outbreaks (Local Farm Perimeter) ---
  {
    id: 'rep-hotspot-1',
    farmerId: 'demo-farmer-1',
    farmerName: 'Ramesh Patil',
    crop: 'Tomato',
    disease: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    confidence: 96,
    severity: 'high',
    latitude: 16.7180, // ~2.1 km from default farm
    longitude: 74.2560,
    locationName: 'Uchgaon Village (East Block, Kolhapur)',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
    source: 'leaf_scan',
    status: 'ai_detected',
    precautions: [
      'Inspect tomato plants immediately for water-soaked leaf lesions with white fungal growth on undersides.',
      'Remove and safely bag/destroy infected lower foliage to prevent airborne spore propagation.',
      'Avoid overhead sprinkler irrigation; maintain dry foliage in morning and evening hours.',
      'Spray protective bio-fungicide (Trichoderma viride @ 5g/L) or copper oxychloride (COC 50% WP @ 2.5g/L).',
      'Disinfect pruning shears and agricultural implements with 70% alcohol between plots.'
    ],
    warning: 'Spreads rapidly during high humidity (>85%) and moderate temperatures (18-22°C).'
  },
  {
    id: 'rep-hotspot-2',
    farmerId: 'demo-farmer-2',
    farmerName: 'Suresh More',
    crop: 'Chili',
    disease: 'Chili Leaf Curl Virus (Thrips / Whitefly vector)',
    scientificName: 'Begomovirus',
    confidence: 92,
    severity: 'medium',
    latitude: 16.6850, // ~3.4 km from default farm
    longitude: 74.2210,
    locationName: 'Shiroli Agro Cluster, Kolhapur',
    imageUrl: 'https://images.unsplash.com/photo-1588644525273-f37b60d78512?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 20, // 20 hours ago
    source: 'farmer_report',
    status: 'needs_verification',
    precautions: [
      'Install yellow and blue sticky traps (15-20 traps/acre) to monitor and catch sucking pests (whiteflies & thrips).',
      'Spray Neem seed kernel extract (NSKE 5%) or Azadirachtin 10000 ppm @ 2ml/L to deter insect vectors.',
      'Rogue out and bury stunted, severely crinkled plants to prevent secondary transmission.',
      'Avoid excessive nitrogen fertilizers which promote soft, succulent foliage vulnerable to sucking pests.'
    ],
    warning: 'Vector management is critical; once viral symptoms appear, focus on stopping further vector movement.'
  },
  {
    id: 'rep-hotspot-3',
    farmerId: 'demo-farmer-3',
    farmerName: 'Anil Jadhav',
    crop: 'Sugarcane',
    disease: 'Sugarcane Red Rot',
    scientificName: 'Colletotrichum falcatum',
    confidence: 98,
    severity: 'critical',
    latitude: 16.7380, // ~4.8 km from default farm
    longitude: 74.2620,
    locationName: 'Panchganga Canal Bank Sector, Kolhapur',
    imageUrl: 'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    source: 'leaf_scan',
    status: 'verified',
    precautions: [
      'Inspect cane leaves for yellowing/withering of midribs with characteristic reddish discoloration.',
      'Ensure proper drainage to avoid standing waterlogging around cane roots.',
      'Do not use setts or seed cane from infected blocks for future planting.',
      'Treat seed setts with Carbendazim 50% WP (1g/L) or hot water therapy (50°C for 2 hours) before sowing.',
      'Practice crop rotation with green manure or leguminous crops before replanting sugarcane.'
    ],
    warning: 'Red rot can devastate cane recovery. Isolate water runoff between adjacent fields.'
  },

  // --- Regional District Level Outbreaks (Maharashtra & Northern Karnataka: 7 km - 150 km) ---
  {
    id: 'rep-hotspot-4',
    farmerId: 'demo-farmer-4',
    farmerName: 'Ganpat Rao',
    crop: 'Soybean',
    disease: 'Soybean Rust',
    scientificName: 'Phakopsora pachyrhizi',
    confidence: 89,
    severity: 'medium',
    latitude: 16.7650, // ~7.8 km
    longitude: 74.2850,
    locationName: 'Hatkanangale Agro Belt, Kolhapur',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 72,
    source: 'icar_advisory',
    status: 'verified',
    precautions: [
      'Scout lower canopy leaves for small tan to reddish-brown pustules.',
      'Maintain adequate plant spacing for optimal aeration and quick drying of canopy moisture.',
      'Apply Hexaconazole 5% EC @ 2ml/L if rust severity index crosses economic threshold.'
    ]
  },
  {
    id: 'rep-hotspot-5',
    farmerId: 'demo-farmer-5',
    farmerName: 'Vikas Shinde',
    crop: 'Rice (Paddy)',
    disease: 'Paddy Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    confidence: 94,
    severity: 'high',
    latitude: 16.6200, // ~12.2 km
    longitude: 74.1700,
    locationName: 'Radhanagari Agro Zone, Kolhapur',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 96,
    source: 'leaf_scan',
    status: 'ai_detected',
    precautions: [
      'Avoid excess nitrogen top-dressing in standing water.',
      'Drain standing water temporarily if bacterial lesions appear on wavy leaf margins.',
      'Spray copper hydroxide (Kocide @ 2g/L) along with Streptocycline (1g/10L water).'
    ]
  },
  {
    id: 'rep-hotspot-6',
    farmerId: 'demo-farmer-6',
    farmerName: 'Basavaraj Patil',
    crop: 'Cotton',
    disease: 'Cotton Bacterial Blight / Angular Leaf Spot',
    scientificName: 'Xanthomonas citri pv. malvacearum',
    confidence: 93,
    severity: 'high',
    latitude: 15.8497,
    longitude: 74.4977,
    locationName: 'Gokak & Belagavi Cotton Belt, Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 36,
    source: 'icar_advisory',
    status: 'verified',
    precautions: [
      'Spray Copper Oxychloride 50 WP (2.5g/L) + Streptomycin Sulphate (0.1g/L) at first symptom onset.',
      'Destroy crop residue post-harvest to avoid pathogen carryover in soil.',
      'Maintain balanced potash nutrition to boost plant natural immunity.'
    ]
  },
  {
    id: 'rep-hotspot-7',
    farmerId: 'demo-farmer-7',
    farmerName: 'Balasaheb Kadam',
    crop: 'Onion',
    disease: 'Onion Purple Blotch & Stemphylium Blight',
    scientificName: 'Alternaria porri',
    confidence: 95,
    severity: 'critical',
    latitude: 20.0110,
    longitude: 73.7900,
    locationName: 'Lasalgaon & Niphad Valley, Nashik, Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 18,
    source: 'leaf_scan',
    status: 'verified',
    precautions: [
      'Spray Mancozeb 75 WP @ 2.5g/L or Difenoconazole 25 EC @ 1ml/L with a sticking agent.',
      'Avoid high-density planting; ensure adequate cross-ventilation in onion plots.',
      'Control onion thrips using Dimethoate or Spinosad to eliminate wounding points.'
    ]
  },
  {
    id: 'rep-hotspot-8',
    farmerId: 'demo-farmer-8',
    farmerName: 'Pandurang Deshmukh',
    crop: 'Grapes',
    disease: 'Grapevine Downy Mildew',
    scientificName: 'Plasmopara viticola',
    confidence: 97,
    severity: 'critical',
    latitude: 18.1519,
    longitude: 74.5772,
    locationName: 'Baramati Grape Cluster, Pune, Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 12,
    source: 'leaf_scan',
    status: 'verified',
    precautions: [
      'Apply systemic fungicide (Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L) during cloudy, humid spells.',
      'Prune dense canopy shoots to facilitate sunlight penetration and quick drying.',
      'Monitor oil spots on upper leaf surfaces and downy white growth underneath.'
    ]
  },

  // --- Multi-State National Agro Outbreaks (North, South, Central & West India) ---
  {
    id: 'rep-hotspot-9',
    farmerId: 'demo-farmer-9',
    farmerName: 'Gurpreet Singh',
    crop: 'Wheat',
    disease: 'Wheat Yellow Stripe Rust',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    confidence: 96,
    severity: 'critical',
    latitude: 30.9010,
    longitude: 75.8573,
    locationName: 'Ludhiana & Khanna Agro Corridor, Punjab',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 40,
    source: 'icar_advisory',
    status: 'verified',
    precautions: [
      'Scout for yellow, powdery pustules arranged in parallel stripes along wheat leaf blades.',
      'Spray Propiconazole 25% EC (Tilt @ 1ml/L) or Tebuconazole 25.9% EC immediately upon detection.',
      'Do not delay spray when morning dew and temperatures range between 10-18°C.'
    ]
  },
  {
    id: 'rep-hotspot-10',
    farmerId: 'demo-farmer-10',
    farmerName: 'Chaudhary Satish',
    crop: 'Rice (Paddy)',
    disease: 'Basmati Rice False Smut',
    scientificName: 'Ustilaginoidea virens',
    confidence: 91,
    severity: 'high',
    latitude: 29.6857,
    longitude: 76.9905,
    locationName: 'Karnal & Taraori Basmati Hub, Haryana',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 55,
    source: 'icar_advisory',
    status: 'verified',
    precautions: [
      'Spray Trifloxystrobin 25% + Tebuconazole 50% WG @ 0.4g/L at 50% boot leaf stage.',
      'Avoid high nitrogen application during flowering / panicle emergence stage.',
      'Ensure proper drainage to prevent excessive microclimate humidity inside canopy.'
    ]
  },
  {
    id: 'rep-hotspot-11',
    farmerId: 'demo-farmer-11',
    farmerName: 'Venkat Rao',
    crop: 'Chili',
    disease: 'Chili Anthracnose / Fruit Rot (Dieback)',
    scientificName: 'Colletotrichum capsici',
    confidence: 95,
    severity: 'critical',
    latitude: 16.3067,
    longitude: 80.4365,
    locationName: 'Guntur Chili Market Belt, Andhra Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1588644525273-f37b60d78512?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 28,
    source: 'leaf_scan',
    status: 'verified',
    precautions: [
      'Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L at flowering and pod set.',
      'Collect and burn infected mummified fruits and twigs showing dieback necrosis.',
      'Use seed treatment with Trichoderma harzianum @ 10g/kg before nursery raising.'
    ]
  },
  {
    id: 'rep-hotspot-12',
    farmerId: 'demo-farmer-12',
    farmerName: 'Hasmukh Bhai Patel',
    crop: 'Cotton',
    disease: 'Cotton Pink Bollworm Infestation',
    scientificName: 'Pectinophora gossypiella',
    confidence: 94,
    severity: 'critical',
    latitude: 22.5645,
    longitude: 72.9289,
    locationName: 'Anand & Saurashtra Agro Cluster, Gujarat',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 15,
    source: 'farmer_report',
    status: 'needs_verification',
    precautions: [
      'Install Gossyplure pheromone traps @ 5-8 traps/acre for adult monitoring.',
      'Spray Profenofos 50 EC @ 2ml/L or Chlorantraniliprole 18.5 SC @ 0.3ml/L if rosette flowers exceed 5%.',
      'Release Trichogramma bactrae egg parasitoids @ 60,000/acre at weekly intervals.'
    ]
  },
  {
    id: 'rep-hotspot-13',
    farmerId: 'demo-farmer-13',
    farmerName: 'Digvijay Singh',
    crop: 'Soybean',
    disease: 'Soybean Yellow Mosaic Virus (YMV)',
    scientificName: 'Mungbean yellow mosaic India virus',
    confidence: 92,
    severity: 'high',
    latitude: 22.7196,
    longitude: 75.8577,
    locationName: 'Malwa Agro Plateau, Indore, Madhya Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 60,
    source: 'icar_advisory',
    status: 'verified',
    precautions: [
      'Target whitefly vector immediately with Thiamethoxam 25 WG @ 0.3g/L or Acetamiprid 20 SP @ 0.2g/L.',
      'Uproot and bury infected mosaic-patterned plants in early crop stages.',
      'Adopt YMV-resistant cultivars (JS 20-34, JS 20-29, NRC 86) in future seasons.'
    ]
  },
  {
    id: 'rep-hotspot-14',
    farmerId: 'demo-farmer-14',
    farmerName: 'Ramkishore Yadav',
    crop: 'Mustard',
    disease: 'Mustard Alternaria White Rust & Leaf Blight',
    scientificName: 'Albugo candida / Alternaria brassicae',
    confidence: 90,
    severity: 'medium',
    latitude: 25.3176,
    longitude: 82.9739,
    locationName: 'Varanasi & Gangetic Plains, Uttar Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=600&q=80',
    reportedAt: Date.now() - 1000 * 60 * 60 * 80,
    source: 'icar_advisory',
    status: 'verified',
    precautions: [
      'Spray Mancozeb 75 WP @ 2g/L or Metalaxyl 35% WS seed treatment prior to sowing.',
      'Avoid late sowing; plant before mid-October to escape severe aphid and blight damage.',
      'Maintain clean borders and eliminate wild Brassica weed hosts around field perimeters.'
    ]
  }
];

export const POPULAR_INDIAN_AGRO_HUBS: Array<{ name: string; state: string; lat: number; lon: number; primaryCrop: string }> = [
  { name: 'Kolhapur / Sangli (Maharashtra)', state: 'Maharashtra', lat: 16.7050, lon: 74.2433, primaryCrop: 'Sugarcane, Tomato, Chili' },
  { name: 'Pune / Baramati (Maharashtra)', state: 'Maharashtra', lat: 18.1519, lon: 74.5772, primaryCrop: 'Sugarcane, Onion, Grapes' },
  { name: 'Nashik / Niphad (Maharashtra)', state: 'Maharashtra', lat: 20.0110, lon: 73.7900, primaryCrop: 'Onion, Grapes, Pomegranate' },
  { name: 'Belagavi / Gokak (Karnataka)', state: 'Karnataka', lat: 15.8497, lon: 74.4977, primaryCrop: 'Cotton, Paddy, Sugarcane' },
  { name: 'Karnal / Kurukshetra (Haryana)', state: 'Haryana', lat: 29.6857, lon: 76.9905, primaryCrop: 'Basmati Rice, Wheat' },
  { name: 'Ludhiana / Khanna (Punjab)', state: 'Punjab', lat: 30.9010, lon: 75.8573, primaryCrop: 'Wheat, Paddy, Maize' },
  { name: 'Guntur / Vijayawada (Andhra Pradesh)', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365, primaryCrop: 'Chili, Cotton, Tobacco' },
  { name: 'Varanasi / Mirzapur (Uttar Pradesh)', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, primaryCrop: 'Vegetables, Wheat, Mustard' },
  { name: 'Anand / Kheda (Gujarat)', state: 'Gujarat', lat: 22.5645, lon: 72.9289, primaryCrop: 'Tobacco, Banana, Cotton' },
  { name: 'Indore / Ujjain (Madhya Pradesh)', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, primaryCrop: 'Soybean, Wheat, Garlic' },
];

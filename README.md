# KrishiRakshak - Smart Crop Advisory & Farm Protection Platform

[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/) [![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/) [![Vite](https://img.shields.io/badge/Vite-6-purple)](https://vitejs.dev/) [![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

## Project Overview
**KrishiRakshak** is an AI-powered agricultural intelligence portal designed for Indian small and marginal farmers. It integrates plant pathology vision, precision N-P-K crop & fertilizer recommendations, live All-India Mandi rates, agro-weather radars, multilingual Kisan AI chat, and a community discussion forum.

```
KrishiRakshak/
├── backend/
│   ├── crop_model/             # FastAPI crop prediction service (Port 8000)
│   └── fertilizer_model/       # FastAPI fertilizer recommendation service (Port 8001)
├── frontend2/                  # Unified Modern Frontend (Vite + React 19 + TypeScript)
│   ├── public/community/       # Community forum media assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── PathologyScanner.tsx      # AI plant disease detection
│   │   │   ├── CropRecommendationML.tsx  # Agronomic crop advisory
│   │   │   ├── FertilizerAdvisor.tsx     # [MERGED] Precision fertilizer ML & guides
│   │   │   ├── MarketTracker.tsx         # [MERGED] All-India Mandi price ledger
│   │   │   ├── AgroWeather.tsx           # [MERGED] District agro-weather & spray radar
│   │   │   ├── FarmerCommunity.tsx       # [MERGED] Kisan Chaupal peer forum
│   │   │   ├── AgriBlogs.tsx             # [MERGED] Curated farming field guides
│   │   │   ├── FarmerChatBot.tsx         # Multilingual voice/text AI assistant
│   │   │   ├── FarmerSchemesAndHelp.tsx  # PM-Kisan, KCC, helpline
│   │   │   └── FarmRecordsVault.tsx      # Firestore synced digital farm diary
│   │   └── context/                      # 6-Language multi-dialect & theme engine
├── run_krishi.ps1              # Single-command launcher script
└── vercel.json                 # Production deployment configuration
```

## Features
- **Leaf Doctor (Pathology Vision)**: Instant leaf disease diagnosis with organic & chemical remediation.
- **Crop Advisor ML**: Regional soil and climate-matched crop yield & margin analysis.
- **Fertilizer ML Advisor**: NPK balancing, soil texture calibration, and AI-generated application dosages.
- **All-India Mandi Tracker**: Live auction prices per quintal and kg across Indian APMC mandis.
- **Agro-Weather Radar**: 5-day district-level forecast with crop-specific spray and irrigation advisories.
- **Farmer Chaupal (Community)**: Knowledge sharing, crop photography, and pest warning discussions.
- **Agri Knowledge Blogs**: Comprehensive field guides on soil biology, IPM, and government subsidies.
- **Ask Kisan AI**: 24/7 multilingual conversational assistant in Hindi, English, Marathi, Kannada, Telugu, and Gujarati.
- **Farm Records Vault**: Cloud synchronization of historical diagnostic scans and crop plans.

## Setup Instructions

### 1. Backend Setup
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Start Crop Advisory API (Port 8000)
cd backend/crop_model
python api.py

# Start Fertilizer Advisory API (Port 8001)
cd ../fertilizer_model
python fertilizer.py
```

### 2. Unified Frontend Setup
```bash
cd frontend2
npm install
npm run dev
# App will run on http://localhost:3000 (or custom PORT)
```

### 3. Quick Run (PowerShell)
```powershell
.\run_krishi.ps1
```


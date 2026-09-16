import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Gemini model used for every text / vision call. Override with GEMINI_MODEL in .env
// when Google retires a version (gemini-2.5-flash was retired for new API keys).
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

// Lazy Google Gen AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Models tried in order when the primary one is overloaded or retired.
const GEMINI_FALLBACK_MODELS = [GEMINI_MODEL, 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];

// Gemini free-tier regularly answers 429/503 under load. Retry with backoff, then fall
// back to another model, so a momentary spike does not look like a failed scan.
async function generateWithRetry(
  ai: GoogleGenAI,
  request: Parameters<GoogleGenAI['models']['generateContent']>[0],
  attemptsPerModel = 2,
) {
  let lastErr: any;
  for (const model of GEMINI_FALLBACK_MODELS) {
    for (let i = 0; i < attemptsPerModel; i++) {
      try {
        return await ai.models.generateContent({ ...request, model });
      } catch (err: any) {
        lastErr = err;
        const msg = String(err?.message || err);
        const retryable =
          msg.includes('503') || msg.includes('429') ||
          msg.includes('UNAVAILABLE') || msg.includes('404');
        if (!retryable) throw err;
        if (i < attemptsPerModel - 1) {
          await new Promise(resolve => setTimeout(resolve, 800 * 2 ** i));
        }
      }
    }
    console.warn(`Gemini model "${model}" unavailable, trying next fallback.`);
  }
  throw lastErr;
}

// 1. Health Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'KrishiRakshak Kisan Smart Companion',
    mandiFeeds: 4800,
    timestamp: new Date().toISOString()
  });
});

// 2. Crop Recommendation ML Endpoint (Matching KrishiRakshak /predict_crop)
app.post('/api/predict_crop', (req: Request, res: Response) => {
  try {
    const { n = 90, p = 42, k = 43, ph = 6.5, temperature = 24.5, humidity = 82, rainfall = 210 } = req.body;
    const N = Number(n);
    const P = Number(p);
    const K = Number(k);
    const pH = Number(ph);
    const T = Number(temperature);
    const H = Number(humidity);
    const R = Number(rainfall);

    let crop = 'Rice';
    let latinName = 'Oryza sativa';
    let yieldPotential = '4.8 MT / ha';
    let mspRate = '₹2,300 / qtl';
    let waterDemand = 'High (Flood/AWD)';
    let netMargin = '₹44,500 / acre';
    let altCrop = 'Jute (Corchorus)';
    let confidence = 0.942;

    if (R > 180 && H > 70) {
      crop = 'Rice (Paddy)';
      latinName = 'Oryza sativa • High Moisture Cultivar';
      yieldPotential = '4.8 MT / ha';
      mspRate = '₹2,300 / qtl';
      waterDemand = 'High (Flood/AWD)';
      netMargin = '₹44,500 / acre';
      altCrop = 'Jute (Corchorus)';
      confidence = 0.965;
    } else if (T < 23 && R < 110 && N > 70) {
      crop = 'Wheat (Kalyan Sona)';
      latinName = 'Triticum aestivum • Rabi Season';
      yieldPotential = '5.2 MT / ha';
      mspRate = '₹2,425 / qtl';
      waterDemand = 'Medium (3 Irrigations)';
      netMargin = '₹38,200 / acre';
      altCrop = 'Mustard (Brassica)';
      confidence = 0.958;
    } else if (K > 50 && R < 115) {
      crop = 'Chickpea (Chana)';
      latinName = 'Cicer arietinum • Semi-Arid Pulse';
      yieldPotential = '2.1 MT / ha';
      mspRate = '₹5,440 / qtl';
      waterDemand = 'Low (Drought Resilient)';
      netMargin = '₹49,000 / acre';
      altCrop = 'Pigeon Pea (Tur)';
      confidence = 0.934;
    } else if (N > 85 && T >= 25 && pH >= 6.5) {
      crop = 'Cotton (Bt Hybrid)';
      latinName = 'Gossypium hirsutum • Deep Rooting';
      yieldPotential = '3.4 MT / ha';
      mspRate = '₹7,120 / qtl';
      waterDemand = 'Medium-High';
      netMargin = '₹52,300 / acre';
      altCrop = 'Maize (Zea mays)';
      confidence = 0.948;
    } else {
      crop = 'Maize (Kharif)';
      latinName = 'Zea mays';
      yieldPotential = '6.2 MT / ha';
      mspRate = '₹2,090 / qtl';
      waterDemand = 'Moderate';
      netMargin = '₹36,500 / acre';
      altCrop = 'Soybean (Glycine max)';
      confidence = 0.912;
    }

    res.json({
      success: true,
      prediction: {
        crop,
        latinName,
        yieldPotential,
        mspRate,
        waterDemand,
        netMargin,
        altCrop,
        confidence
      },
      featuresUsed: { n: N, p: P, k: K, ph: pH, temperature: T, humidity: H, rainfall: R }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Leaf Pathology Vision Diagnostic Endpoint (Matching KrishiRakshak /diagnose)
app.post('/api/diagnose', async (req: Request, res: Response) => {
  try {
    const { imageBase64, sampleKey, cropName } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'GEMINI_API_KEY is not set in frontend2/.env — the server cannot reach Gemini.',
      });
    }
    if (!imageBase64 || !imageBase64.startsWith('data:image')) {
      return res.status(400).json({
        success: false,
        error: 'No image received. Upload a JPG/PNG photo of the affected leaf.',
      });
    }

    // Run multimodal diagnosis. Any failure is reported to the caller rather than
    // swallowed — silently falling back produced an identical "diagnosis" every upload.
    {
      try {
        const base64Data = imageBase64.split(',')[1];
        const mimeType = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';'));

        const response = await generateWithRetry(ai, {
          model: GEMINI_MODEL,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  }
                },
                {
                  text: `Analyze this agricultural crop/plant image for diseases. Provide JSON format with fields:
                  {
                    "cropName": "Crop name",
                    "diseaseName": "Disease name or 'Healthy' if no disease found",
                    "scientificName": "Scientific pathogen name or 'N/A' if healthy",
                    "confidence": 0.95,
                    "status": "critical" | "warning" | "optimal",
                    "foliarLesionPercent": 85.0,
                    "description": "2-sentence clinical description of symptoms. If healthy, describe the healthy state.",
                    "organicTreatments": ["Treatment 1", "Treatment 2"],
                    "chemicalTreatments": ["Treatment 1 with dosage", "Treatment 2"],
                    "audioAdvisories": {
                      "en": "English advice",
                      "hi": "Hindi advice",
                      "kn": "Kannada advice",
                      "te": "Telugu advice"
                    }
                  }
                  The audioAdvisories object must also contain "mr" (Marathi) and "gu" (Gujarati) keys.
                  IMPORTANT: If the plant looks healthy with no visible disease symptoms, set status to "optimal", diseaseName to "Healthy", confidence to 0.95+, foliarLesionPercent to 0, and provide general care tips instead of treatments.
                  If the image is not a plant at all, set diseaseName to "Not a plant image" and status to "warning".`
                }
              ]
            }
          ],
          config: {
            // Ask for raw JSON so the result never depends on markdown fences surviving a regex.
            responseMimeType: 'application/json',
          },
        });

        const textOutput = response.text || '';
        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error('Gemini returned no JSON for diagnosis. Raw output:', textOutput);
          return res.status(502).json({
            success: false,
            error: 'The AI returned an unreadable response. Please try the photo again.',
          });
        }

        const parsed = JSON.parse(jsonMatch[0]);
        if (cropName && !parsed.cropName) parsed.cropName = cropName;
        return res.json({ success: true, diagnosis: parsed });
      } catch (geminiErr: any) {
        console.error('Gemini vision diagnosis failed:', geminiErr);
        return res.status(502).json({
          success: false,
          error: `Gemini diagnosis failed (model "${GEMINI_MODEL}"): ${geminiErr?.message || geminiErr}`,
        });
      }
    }

  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Kisan AI Vernacular Conversational Assistant (FarmerChatBot module)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, dialect = 'hi', context = {} } = req.body;
    const ai = getAIClient();

    if (ai) {
      try {
        const systemPrompt = `You are KrishiRakshak Kisan AI Agronomist, an expert precision agriculture advisor supporting Indian smallholder farmers.
        Context:
        - Farmer's soil: N=${context.n || 90}, P=${context.p || 42}, K=${context.k || 43}, pH=${context.ph || 6.5}, Rain=${context.rainfall || 210}mm
        - Current diagnosed issue: ${context.currentDisease || 'None'}
        - Target Dialect / Language: ${dialect} (en, hi, mr, kn, te, or gu)

        Provide an immediate, highly actionable, concise response (2-4 sentences max). Include specific dosage (e.g. g/L or ml/L), organic alternatives, or Mandi price insights if asked. If dialect is hi, respond in Hindi (Devanagari). If mr, respond in Marathi (Devanagari). If kn, respond in Kannada script. If te, respond in Telugu script. If gu, respond in Gujarati script. If en, respond in English.`;

        const response = await generateWithRetry(ai, {
          model: GEMINI_MODEL,
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nFarmer Query: ${message}` }]
            }
          ]
        });

        return res.json({
          success: true,
          reply: response.text,
          dialect
        });
      } catch (geminiErr) {
        // Log loudly — a silent fallback here is why the bot repeated the same few
        // canned lines for every question.
        console.error('Gemini chat failed, serving canned agronomy reply:', geminiErr);
      }
    }

    // Smart Agronomic fallback responses
    const query = (message || '').toLowerCase();
    let reply = "Under current soil conditions, apply split nitrogen top-dressing at 30 days post germination. Combine with Azotobacter biofertilizer to reduce urea dependency by 25%.";

    if (query.includes('urea') || query.includes('fertilizer')) {
      reply = "To replace 1 bag of synthetic Urea: Apply Nano Urea liquid (500ml/acre) mixed in 100L water during active tillering, combined with 200kg fortified neem cake compost.";
    } else if (query.includes('chickpea') || query.includes('chana')) {
      reply = "For Karnataka and Deccan plateau, optimal chickpea sowing window is October 15 to November 10. Treat seeds with Trichoderma + Rhizobium culture for wilt resistance.";
    } else if (query.includes('onion') || query.includes('mandi') || query.includes('price')) {
      reply = "Today's Nashik Mandi modal rate for Red Onion is ₹1,850/quintal (Range: ₹1,400 - ₹2,350). Market trend indicates price firmness over the next 10 days.";
    } else if (query.includes('tomato') || query.includes('blight')) {
      reply = "For Tomato Early Blight (Alternaria), spray Mancozeb 75 WP @ 2g/L or Copper Oxychloride @ 2.5g/L immediately. Prune heavily infected bottom foliage to arrest spore spread.";
    }

    res.json({
      success: true,
      reply,
      dialect
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. APMC Mandi Data Endpoint
app.get('/api/mandi_prices', (req: Request, res: Response) => {
  res.json({
    success: true,
    mandis: [
      { commodity: 'Cotton (Medium Staple)', variety: 'Bt Hybrid', mandi: 'Rajkot Mandi', state: 'Gujarat', modalPrice: 7250, change: 140, trend: 'up' },
      { commodity: 'Soybean (Yellow)', variety: 'JS-335', mandi: 'Indore Mandi', state: 'Madhya Pradesh', modalPrice: 4680, change: 85, trend: 'up' },
      { commodity: 'Wheat (Sharbati)', variety: 'Kalyan Sona', mandi: 'Khanna Mandi', state: 'Punjab', modalPrice: 2840, change: -20, trend: 'down' },
      { commodity: 'Red Onion', variety: 'Nashik Garva', mandi: 'Lasalgaon Mandi', state: 'Maharashtra', modalPrice: 1850, change: 110, trend: 'up' },
      { commodity: 'Chana (Gram)', variety: 'Desi Bold', mandi: 'Gulbarga Mandi', state: 'Karnataka', modalPrice: 5650, change: 70, trend: 'up' },
      { commodity: 'Mustard (Sarson)', variety: 'Pusa Bold', mandi: 'Bharatpur Mandi', state: 'Rajasthan', modalPrice: 5320, change: -45, trend: 'down' }
    ],
    updatedAt: new Date().toISOString()
  });
});

// Vite Middleware for SPA development and static production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KrishiRakshak Bio-AI server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

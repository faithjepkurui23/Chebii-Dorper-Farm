import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Free APIs Health & Hosting Status Endpoint
  app.get("/api/free-status", (req, res) => {
    res.json({
      status: "ok",
      productionHostingReady: true,
      freeApis: {
        weather: {
          provider: "Open-Meteo",
          cost: "0 USD (100% Free Open API)",
          requiresKey: false,
          endpoint: "/api/weather/iten"
        },
        currencyExchange: {
          provider: "Open Exchange Rate API (open.er-api.com)",
          cost: "0 USD (100% Free Public API)",
          requiresKey: false,
          endpoint: "/api/rates"
        },
        geminiAI: {
          provider: "Google AI Studio Gemini API",
          cost: "100% Free Tier Supported",
          requiresKey: "Optional (Built-in Offline Dorper Agronomist Engine activates when no key is set)",
          model: "gemini-2.5-flash",
          endpoint: "/api/ai/advisor"
        }
      },
      hostingCompatibility: ["Vercel", "Netlify", "Render", "Railway", "Docker", "Node.js"]
    });
  });

  // Free Open-Meteo Weather Proxy for Iten, Kenya (Altitude: 2,400m)
  app.get("/api/weather/iten", async (req, res) => {
    try {
      const itenLat = 0.6738;
      const itenLng = 35.5082;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${itenLat}&longitude=${itenLng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Africa%2FNairobi`
      );
      if (!response.ok) throw new Error(`Weather fetch failed: ${response.status}`);
      const data = await response.json();
      res.json({
        success: true,
        data,
        source: "Open-Meteo (100% Free Public API - No Key Required)"
      });
    } catch (err: any) {
      res.json({
        success: false,
        fallback: {
          temperature_2m: 18.2,
          relative_humidity_2m: 65,
          weather_code: 1,
          elevation: 2400
        },
        note: "Highland sensor offline fallback active"
      });
    }
  });

  // Free Open Exchange Rates Proxy (KES, USD, EUR, GBP)
  app.get("/api/rates", async (req, res) => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/KES");
      if (!response.ok) throw new Error(`Rates fetch failed: ${response.status}`);
      const data = await response.json();
      res.json({
        success: true,
        rates: data.rates,
        source: "Open ER-API (100% Free Public API - No Key Required)"
      });
    } catch (err: any) {
      res.json({
        success: false,
        rates: {
          KES: 1,
          USD: 0.00775,
          EUR: 0.00705,
          GBP: 0.00605
        },
        note: "Cached rates fallback active"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      farm: "Chebii Family Dorper Sheep Farm",
      timestamp: new Date().toISOString()
    });
  });

  // Helper: Offline Intelligent Dorper Agronomist Engine for VS Code & local execution
  function getExpertDorperAdvice(prompt: string, context: any) {
    const p = (prompt || "").toLowerCase();
    const sheepCount = context?.dorperCount || 4;

    if (p.includes("feed") || p.includes("nutrition") || p.includes("rhodes") || p.includes("diet") || p.includes("hay")) {
      return `### 🌾 High-Altitude Dorper Nutrition & Feeding Protocol (Iten, 2,400m)

For your flock of **${sheepCount} Dorpers** in the cool climate of Elgeyo-Marakwet:

1. **Basal Roughage**:
   - Provide high-quality **Rhodes grass (*Chloris gayana*) hay** ad libitum. In Iten's cool altitude, energy maintenance increases by 10–15% to maintain body heat.
   - Each mature sheep consumes approx. **1.5–2.0 kg of dry matter daily**.
2. **Protein & Energy Supplements**:
   - Supplement with **200–300g per head/day** of a high-protein concentrate (14–16% Crude Protein, e.g. dairy meal mixed with wheat bran and crushed maize).
   - Feed Evans and Nathan's pregnant ewes extra energy 4 weeks prior to lambing to prevent pregnancy toxaemia.
3. **Mineral & Vitamin Licks**:
   - Provide an all-weather **maclik mineral block** rich in Phosphorus, Calcium, and Selenium (vital to prevent white muscle disease in lambs in highland soils).
   - Clean, fresh water at ambient temperature must always be accessible.`;
    }

    if (p.includes("vaccin") || p.includes("health") || p.includes("disease") || p.includes("pneumonia") || p.includes("ccpp") || p.includes("deworm")) {
      return `### 💉 Veterinary Health & Vaccination Protocol (Faith Jepkurui - Health Lead)

Given Iten's cold morning mists and elevation (2,400m):

1. **Pulpy Kidney (Enterotoxaemia)**:
   - Vaccinate all sheep annually (or bi-annually during heavy lush feeding flushes) with Clostridial vaccine (e.g., Covexin-10 or Blanthax, 2ml subcutaneous).
2. **Contagious Caprine/Ovine Pleuropneumonia (CCPP) & Enzootic Pneumonia**:
   - Cold damp highland winds trigger pasteurellosis. Maintain draft-free elevated slatted housing with good ridge ventilation.
   - Vaccinate pre-rainy season against Pasteurella/CCPP.
3. **Strategic Deworming Schedule**:
   - High rainfall zones in Rift Valley harbor *Haemonchus contortus* (wireworm).
   - Rotate anthelmintics quarterly between **Albendazole** (benzimidazoles) and **Levamisole** or **Ivermectin** to prevent parasite drug resistance.
   - Check mucous membrane FAMACHA eye scores monthly.`;
    }

    if (p.includes("profit") || p.includes("manure") || p.includes("money") || p.includes("revenue") || p.includes("financ") || p.includes("sale") || p.includes("cost")) {
      return `### 💰 Profit Maximization & Value Addition in Iten

1. **Organic Dorper Sheep Manure Packaging**:
   - Dorper manure has high nitrogen and potassium content and low moisture.
   - Bagged into 50kg bags, it retails at **KES 400 – 600 per bag** to local potato, tea, passion fruit, and greenhouse farmers in Elgeyo-Marakwet.
2. **Breeding Stock & Stud Services**:
   - Purebred Dorper ram lambs (35–45kg at 5 months) fetch **KES 15,000 – 25,000** for breeding stock across the Rift Valley.
   - Offer Simba's stud service to local farmers for **KES 1,000 – 1,500** per service mating.
3. **Sibling Cost Accounting**:
   - Maintain accurate record of out-of-pocket receipts by Nathan, Evans, Faith, and Mercy to ensure fair profit distributions and dividend yields.`;
    }

    if (p.includes("breed") || p.includes("lamb") || p.includes("simba") || p.includes("daisy") || p.includes("flock") || p.includes("scale") || p.includes("ram") || p.includes("ewe")) {
      return `### 🐑 Flock Scaling & Breeding Management (4 → 10+ Head)

1. **Breeding Cycle & Ram Ratio**:
   - Simba (Dorper Ram) can comfortably service up to 25–30 ewes per breeding season.
   - Dorpers are non-seasonal breeders with an **8-month lambing interval** (3 lamb crops in 2 years).
2. **Lambing & Weaning**:
   - Dorper ewes frequently deliver twins with high milk yields and exceptional maternal instincts.
   - Wean lambs at 90 days (18–22kg) onto high-protein creep feeds and tender legumes.
3. **Selection & Culling**:
   - Retain fast-growing ewe lambs with characteristic black heads and solid white barrel conformation to build your foundation maternal line.`;
    }

    return `### 🐑 Chebii Family Dorper Farm Advisory (Iten, Kenya)

**Analysis for your ${sheepCount} Dorpers (Simba, Daisy, Baraka, Tumaini):**

1. **Highland Management**: At 2,400m in Iten, keep sheep dry and warm with well-ventilated housing to prevent respiratory stress.
2. **Highland Pasture & Feeds**: Supplement dry Rhodes hay with sunflower cake, cotton seed cake, or dairy meal concentrates.
3. **Health Regimen**: Keep Faith's timetable updated for quarterly deworming and bi-annual Clostridial/Enterotoxaemia vaccines.
4. **Commercial Target**: Aim for market weights of 40kg within 4–5 months to achieve top-tier meat and breeding stock prices in Kenya.`;
  }

  // Unified AI Advisor Handler (handles Gemini API, Vercel AI Gateway, and local VS Code offline fallbacks)
  const handleAiAdvisor = async (req: express.Request, res: express.Response) => {
    const { prompt, context } = req.body || {};
    const userPrompt = prompt || "Provide a summary of Dorper care in Iten";

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_GATEWAY_TOKEN || process.env.VERCEL_AI_GATEWAY_TOKEN;

    // If no API key configured (standard for fresh local VS Code clone), return instant domain insights
    if (!apiKey) {
      const advice = getExpertDorperAdvice(userPrompt, context);
      return res.json({
        advice,
        reply: advice,
        provider: "offline-expert-engine",
        status: "success",
        note: "Running in local VS Code mode with Chebii Dorper Agronomist Engine."
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are an expert Livestock Consultant and Agricultural Financial Advisor specializing in Dorper sheep farming in Kenya and East Africa. 
You are advising the Chebii family siblings: Nathan Kiprop, Evans Kemboi, Faith Jepkurui, and Mercy Jelagat. 
They started with 2 Dorper sheep and now have 4 sheep in Iten, Elgeyo-Marakwet (2,400m altitude).
Provide clear, actionable, practical, and highly professional advice regarding feed management, vaccination protocols, breeding strategies, expense optimization, and profit maximization. Keep answers structured with markdown bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemInstruction}\n\nContext about current farm state: ${JSON.stringify(context || {})}\n\nUser Question/Request: ${userPrompt}`
              }
            ]
          }
        ]
      });

      const advice = response.text || getExpertDorperAdvice(userPrompt, context);
      return res.json({ 
        advice, 
        reply: advice, 
        provider: "gemini-api",
        status: "success" 
      });
    } catch (error: any) {
      // Gracefully catch Vercel AI Gateway authentication exceptions, invalid keys, or network failures
      console.warn("AI Gateway / Gemini authentication exception caught (graceful fallback activated):", error.message || error);
      const advice = getExpertDorperAdvice(userPrompt, context);
      return res.json({
        advice,
        reply: advice,
        provider: "fallback-expert-engine",
        status: "success",
        warning: "Vercel AI Gateway / Gemini authentication fallback handled seamlessly."
      });
    }
  };

  // Register both /api/ai/advisor and /api/gemini/advisor endpoints
  app.post("/api/ai/advisor", handleAiAdvisor);
  app.post("/api/gemini/advisor", handleAiAdvisor);

  // Django Architecture Documentation / Schema Export API
  app.get("/api/django-schema", (req, res) => {
    const modelsPy = `
# Chebii Family Dorper Sheep Management - Django Models (models.py)
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Shareholder(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=50, default="Co-Owner")
    base_equity_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=25.00)
    initial_capital_contributed = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Sheep(models.Model):
    GENDER_CHOICES = [('Ewe', 'Ewe (Female)'), ('Ram', 'Ram (Male)'), ('Wether', 'Wether (Castrated)')]
    STATUS_CHOICES = [('Healthy', 'Healthy'), ('Under Treatment', 'Under Treatment'), ('Pregnant', 'Pregnant'), ('Sold', 'Sold'), ('Deceased', 'Deceased')]
    
    tag_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    breed = models.CharField(max_length=100, default="Purebred Dorper")
    dob = models.DateField()
    current_weight_kg = models.DecimalField(max_digits=5, decimal_places=2)
    acquisition_date = models.DateField(default=timezone.now)
    acquisition_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Healthy')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.tag_id} - {self.name}"

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('Feeds', 'Animal Feeds & Supplements'),
        ('Vaccines', 'Vaccines & Dewormers'),
        ('Vet Care', 'Veterinary Services'),
        ('Shelter & Fencing', 'Shelter, Fencing & Equipment'),
        ('Purchase', 'Livestock Purchase'),
        ('Other', 'Other Operating Costs')
    ]
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)
    paid_by = models.ForeignKey(Shareholder, on_delete=models.SET_NULL, null=True, related_name='expenses_paid')
    is_farm_pool = models.BooleanField(default=False)
    receipt_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - KES {self.amount}"

class Revenue(models.Model):
    SALE_TYPE_CHOICES = [
        ('Livestock Sale', 'Sale of Sheep / Lambs'),
        ('Produce', 'Manure / Wool / Milk'),
        ('Breeding Fee', 'Breeding Service Fee'),
        ('Other', 'Other Income')
    ]
    title = models.CharField(max_length=200)
    sale_type = models.CharField(max_length=50, choices=SALE_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)
    buyer_name = models.CharField(max_length=150, blank=True)
    cost_basis = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)

    @property
    def net_profit(self):
        return self.amount - self.cost_basis

class VaccinationRecord(models.Model):
    sheep = models.ForeignKey(Sheep, on_delete=models.CASCADE, related_name='vaccinations')
    vaccine_name = models.CharField(max_length=150)
    treatment_type = models.CharField(max_length=100) # e.g. Dewormer, Vaccine, Vitamin
    date_administered = models.DateField(default=timezone.now)
    next_due_date = models.DateField(null=True, blank=True)
    administered_by = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
`;
    res.json({
      framework: "Django 5.x / Django REST Framework",
      modelsPy
    });
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Chebii Family Farm server running on http://localhost:${PORT}`);
  });
}

startServer();

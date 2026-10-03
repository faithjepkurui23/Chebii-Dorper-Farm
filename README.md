# Chebii Family Dorper Sheep Farm Web Application

A comprehensive livestock management, financial ledger, and health tracking system for the Chebii family Dorper sheep farming venture in Iten, Elgeyo-Marakwet County, Kenya.

---

## 🚀 Quick Start in VS Code

Follow these simple steps after downloading and extracting the ZIP archive:

### 1. Open in VS Code
1. Extract the downloaded ZIP file to your preferred folder.
2. Open **Visual Studio Code**.
3. Click **File** > **Open Folder...** (or `Cmd+O` on macOS / `Ctrl+K Ctrl+O` on Windows/Linux) and select the extracted project folder.

### 2. Install Dependencies
Open the integrated terminal in VS Code (`Ctrl + \`` or `Cmd + \`` / **Terminal** > **New Terminal**) and run:

```bash
npm install
```

### 3. Start the Development Server
In the VS Code terminal, run:

```bash
npm run dev
```

The application will start on **`http://localhost:3000`**. Open this URL in your web browser.

---

## ⚙️ Environment Variables & AI Gateway Compatibility (Optional)

The application includes an **Adaptive AI Fallback Engine** that guarantees zero runtime crashes:

- **Standalone / VS Code Local Run**: No API keys or tokens are needed. If `GEMINI_API_KEY` or `AI_GATEWAY_TOKEN` is not set, the application automatically uses the built-in **Chebii Dorper Agronomist Engine** to generate instant livestock, nutrition, and financial insights.
- **Vercel AI Gateway & Gemini API**:
  If you configure `GEMINI_API_KEY`, `AI_GATEWAY_TOKEN`, or `VERCEL_AI_GATEWAY_TOKEN`:
  ```env
  GEMINI_API_KEY=your_gemini_api_key_or_gateway_token
  ```
- **Automatic Exception Recovery**: Any `Vercel_ai_gatewayException - Authentication`, 401 Unauthorized, or quota error is safely intercepted and gracefully resolved with tailored farming protocols without disrupting the UI or backend.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the full-stack development server (Express + Vite) on port 3000 |
| `npm run build` | Builds the client-side SPA and bundles the backend server into `dist/` |
| `npm start` | Runs the compiled production server (`dist/server.cjs`) |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## 📂 Project Structure

```
├── .vscode/                 # VS Code workspace settings, extensions & launch configs
│   ├── settings.json        # Formatter, Tailwind & TypeScript workspace settings
│   ├── extensions.json      # Recommended extensions (Tailwind, Prettier, ESLint)
│   └── launch.json          # One-click F5 debug configurations
├── src/
│   ├── components/          # Modular React UI components
│   │   ├── ChebiiLogo.tsx             # Calligraphed brand emblem
│   │   ├── Navbar.tsx                 # Header navigation & quick actions
│   │   ├── DashboardOverview.tsx      # Executive farm metrics & charts
│   │   ├── FlockManager.tsx           # Dorper sheep profiles & records
│   │   ├── HealthVaccineTracker.tsx   # Vaccine & treatment timetable (CRUD)
│   │   ├── FinanceManager.tsx         # Expense ledger & produce sales (CRUD)
│   │   ├── ExportModal.tsx            # PDF, CSV, and JSON report generator
│   │   ├── InstallAppModal.tsx        # PWA installation instructions
│   │   ├── AddSheepModal.tsx          # New animal onboarding form
│   │   ├── EditSheepModal.tsx         # Animal editing modal
│   │   ├── EditStakeholderAvatarModal.tsx # Shareholder photo customizer
│   │   └── StakeholderExpenseModal.tsx    # Sibling contribution breakdown
│   ├── data/
│   │   └── initialData.ts   # Default flock & financial seed data
│   ├── utils/
│   │   └── calculations.ts  # Financial & equity mathematical utilities
│   ├── types.ts             # TypeScript definitions & data models
│   ├── App.tsx              # Root React application
│   ├── main.tsx             # DOM entry point & Service Worker registration
│   └── index.css            # Tailwind CSS styling setup
├── public/
│   ├── manifest.json        # Progressive Web App (PWA) manifest
│   ├── sw.js                # Offline caching service worker
│   └── favicon.svg          # Chebii brand icon
├── server.ts                # Express backend + Vite middleware + AI API
├── package.json             # NPM dependencies and scripts
├── tsconfig.json            # TypeScript compiler configuration
├── vite.config.ts           # Vite + Tailwind CSS configuration
└── metadata.json            # AI Studio applet metadata
```

## 🌐 100% Free APIs & Production Hosting Guide

This project is built from the ground up to require **zero paid subscriptions, zero paid API keys, and zero credit cards** to host and run in production:

### 1. Free Integrated Public APIs (No API Keys Required)
- **Open-Meteo Weather API**: Provides live real-time temperature, humidity, rainfall, and wind speeds for Iten, Kenya (2,400m altitude) with automated Dorper health advisories.
- **Open ER-API (open.er-api.com)**: Provides live foreign exchange rates (KES / USD / EUR) for real-time multi-currency valuation.
- **Google AI Studio Free Tier (Gemini)**: Compatible with Google AI Studio's 100% free tier. If no key is configured, the built-in offline Dorper Agronomist Engine activates automatically with 0 latency and 0 cost.

### 2. Free Production Hosting Options

#### Option A: Vercel (100% Free - Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and import the repository.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. The included `vercel.json` automatically handles client-side routing.
6. Click **Deploy**!

#### Option B: Netlify (100% Free)
1. Run `npm run build`.
2. Connect to [Netlify](https://netlify.com) or drag-and-drop the `dist` folder into [Netlify Drop](https://app.netlify.com/drop).
3. The included `public/_redirects` file ensures all SPA routes resolve cleanly without 404s.

#### Option C: Render / Railway (Free Node.js Fullstack)
1. Import repository into [Render](https://render.com) as a Web Service.
2. Build Command: `npm run build`
3. Start Command: `npm start` (runs `node dist/server.cjs`)

---

## 🌟 Key Features

1. **Flock Management**: Detailed pedigree records for Simba, Daisy, Baraka, and Tumaini (weights, lineage, DOB, category).
2. **Sibling Shareholder Ledgers**: Real-time equity tracking and out-of-pocket expense tracking for Nathan, Evans, Faith, and Mercy.
3. **Health & Vaccination Timetable**: High-altitude (2,400m Iten) medical schedules (Pulpy Kidney, CCPP, dewormers) with status management and countdown badges.
4. **Financial Ledger & Profit Margins**: Itemized expense tracker and produce sales ledger (manure, breeding fees, future lamb projections) with Recharts visualizations.
5. **Export Engine**: Instant 1-click export to official PDF reports (via jsPDF & AutoTable), CSV data spreadsheets, and full JSON backups.
6. **Progressive Web App (PWA)**: Installable on Android, iPhone/iPad, and Windows/Mac desktop for offline access.

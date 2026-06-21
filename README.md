<div align="center">

<img src="https://img.shields.io/badge/CarbonSense-Sustainability%20Intelligence-22c55e?style=for-the-badge&logo=leaf&logoColor=white" alt="CarbonSense"/>

# 🌿 CarbonSense

### AI-Powered Personal Carbon Footprint Intelligence Platform

[![Hack2Skill](https://img.shields.io/badge/Hack2Skill-Google%20AI%20Challenge%202026-4285F4?style=flat-square&logo=google&logoColor=white)](https://hack2skill.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-55%20Passing-brightgreen?style=flat-square&logo=vitest)](src/__tests__)

> **CarbonSense** is a full-stack AI sustainability platform that calculates your personal carbon footprint, classifies your unique "Carbon DNA" persona, and delivers hyper-personalized recommendations — all powered by a secure backend AI proxy and built for offline-first resilience.

## 🎯 Problem Statement Alignment

**Hackathon Challenge:** Carbon Footprint Awareness Platform

**Objective:** To design and develop a platform that educates users about their carbon footprint and encourages sustainable living through personalized insights.

- [x] **Calculation Engine:** Built a robust calculator capturing energy, transport, and diet footprints.
- [x] **AI Insights:** Integrates Google's LLM ecosystem via OpenRouter to provide deep, actionable environmental intelligence.
- [x] **Gamification:** Features Carbon DNA personas, eco-points, and achievement badges to incentivize green choices.
- [x] **Awareness Tools:** Includes Time Travel Projections (2050), Diet Swap Simulators, and Supply Chain mapping.
[**Architecture**](#architecture) · [**Approach & Logic**](#approach--logic) · [**Features**](#features)

</div>

## 📸 Screenshots

<div align="center">
  <img src="public/screenshots/screenshot_1.png" width="800" alt="Carbon Identity Report & Breakdown" style="margin-bottom: 20px;" />
  <img src="public/screenshots/screenshot_2.png" width="800" alt="Action Roadmap & AI Advisor" style="margin-bottom: 20px;" />
  <img src="public/screenshots/screenshot_3.png" width="800" alt="Eco Lab Tools" style="margin-bottom: 20px;" />
  <img src="public/screenshots/screenshot_4.png" width="800" alt="Energy Usage Profile & Evolution" style="margin-bottom: 20px;" />
  <img src="public/screenshots/screenshot_5.png" width="800" alt="Intelligence Scorecard & What-If Simulator" style="margin-bottom: 20px;" />
</div>

---
## 🧠 Approach & Logic

CarbonSense tackles the challenge of carbon footprint awareness by moving beyond generic advice to deliver hyper-personalized, data-driven intelligence:
1. **Data-Driven Baseline:** We calculate a strict, scientifically grounded baseline using IPCC and DEFRA emission factors, adjusting for dynamic regional variables (like country-specific power grid intensities).
2. **Algorithmic Classification:** Using a custom deterministic algorithm, we classify the user into one of five "Carbon DNA" personas (e.g., Urban Commuter, Energy-Intensive Resident).
3. **AI Personalization:** We pass the user's Carbon DNA and baseline footprint as a strict system prompt into our generative AI pipeline (powered by Google Gemini / OpenRouter). This dynamically generates context-aware, hyper-personalized sustainability advice and roadmap actions that directly target the user's biggest emission drivers.



## ✨ Features

### 👤 My Profile — Your Carbon Identity

**4-Step Guided Calculator** using IPCC-based emission factors:

| Step | What It Measures |
|------|-----------------|
| ⚡ Energy | Monthly kWh, AC usage, gas heating, electricity source (grid/solar/mixed), country-specific grid intensity |
| 🚗 Transport | Primary vehicle (petrol/diesel/EV/walk/bus/metro/two-wheeler), weekly km, public-transit km — calculated as two additive inputs, not a single choice |
| 🥗 Diet | Dietary pattern, meat frequency, dairy consumption |
| 🛍️ Lifestyle | Shopping habits, consumption patterns, waste behaviour |

**Carbon DNA Persona Classification** — after calculation, you're classified into one of five scientifically-grounded personas:

- 🌟 **Eco-Leader** — well below average across all categories
- ⚖️ **Balanced Emitter** — moderate footprint, spread across categories
- 🏙️ **Urban Commuter** — transport-dominant footprint
- ⚡ **Energy-Intensive Resident** — energy usage is the primary driver
- 🏭 **Industrial Consumer** — high consumption/shopping-driven footprint

Each persona gets a **category breakdown** (energy/transport/diet/consumption percentages), a **trend indicator**, a **top priority action**, and a **Carbon Evolution panel** showing a 5-year projection comparing your business-as-usual trajectory against an achievable sustainable-action path.

**ELI10 Mode** — one toggle simplifies all technical language and jargon app-wide to plain, accessible explanations suitable for anyone.

---

### 🧠 Intelligence — Understand Your Impact

**Sustainability Scorecard** — a 0–100 composite score with category-level breakdowns, "Top Strength" and "Biggest Opportunity" callouts, and a full emissions table.

**What-If Simulator** — three live sliders (Drive Less / Fly Less / Reduce Meat & Dairy) that recompute your projected annual footprint and potential savings *as you drag*, with no page reload required.

**Benchmark Comparison** — visual chart comparing your footprint against:
- 🇮🇳 India national average (2t CO₂e)
- 🌍 Global average (4.7t CO₂e)
- 🏆 Top 10% of lowest emitters (1.3t CO₂e)
- 🎯 Paris Agreement 2030 per-capita target (2t CO₂e)

**Progress Tracker** — shows your monthly carbon budget vs. actual emissions against a sustainable 167 kg/month target, with an actionable gap message.

**Time-Travel Climate Projection** — a visceral storytelling tool that brings abstract numbers to life. Enter your city, and the AI generates two localized 2050 scenarios based on your specific Carbon DNA footprint: a "Net Zero Path" utopian outcome vs. a "Business As Usual" dystopian reality with realistic sea-level and temperature impacts.

---

### ✅ Actions — Personalised Roadmap

**Phase-Based Action Roadmap** across four stages:
- **Phase 1: Quick Wins** — easy, immediate, high-impact actions
- **Phase 2: Habit Formation** — weekly behaviour changes
- **Phase 3: Optimisation** — systemic home/transport upgrades
- **Phase 4: Carbon Neutral** — deep decarbonisation moves

Each action is **persona-personalised** — the `reason` text and ranking are dynamically adjusted based on your Carbon DNA, so an Energy-Intensive Resident sees energy actions promoted to P0 while an Urban Commuter sees transit actions surfaced first. Completed-category actions automatically promote remaining actions in that category tier.

Track progress with **eco-points and levels** (Beginner → Expert), and click **✨ AI Guide** on any action to get an AI-generated step-by-step implementation plan.

**AI Sustainability Advisor Chat** — a conversational AI coach with three selectable personas:
| Persona | Style |
|---------|-------|
| 💚 Friendly Guide | Supportive, encouraging, motivational |
| 💪 Strict Coach | Direct, results-focused, no excuses |
| 🔬 Eco Scientist | Data-driven, citations, precise numbers |

Pre-loaded with contextual quick-questions based on your actual footprint data. Falls back gracefully to a local intelligence engine if the AI backend is unreachable.

---

### 📊 Reports & Settings

**Carbon Identity Report** — a downloadable PDF of your full profile: DNA persona, annual footprint, category breakdown, P0 priority actions, achievement badges, and a comparison against the India average.

**Achievement Badges** — 7 unlockable milestones from First Step to Net Zero Path, tracked via persistent local habit state.

**Carbon Offsetting Calculator** — calculates how many mature trees per year are needed to offset your unavoidable emissions, plus an estimated cost via certified offset programs. Includes a clear disclaimer that offsets are a last resort, not a substitute for reducing direct emissions.

**Settings Panel:**
- 🌙/☀️ Dark/Light theme toggle
- 🧒 ELI10 mode toggle
- 🌐 Google Translate widget (100+ languages)
- 💵 Display Currency Override — globally override the default monetary display to automatically recalculate and format financial values (like Commute ROI or Offset costs) into local currencies like INR, EUR, or GBP.
- 🤖 AI Coach Persona selection
- 🔒 System Health audit (live backend ping, CSP check, input validation status, error boundary status)
- 🗑️ Clear All Data

---

### 🧪 Eco Lab — Explore & Discover

**AI Receipt & Meal Scanner** — upload a photo of a shopping receipt or a meal; Vision AI extracts line items and returns per-item carbon footprint estimates.

**Daily Eco-Challenge** — AI-generated sustainability trivia, refreshed daily to build engagement and eco-awareness habits.

**Impact Comparison Tool** — compare the cradle-to-gate carbon footprint of common products (beef vs. chicken vs. lentils, laptop vs. smartphone, cotton jeans vs. t-shirt) to inform purchasing decisions.

**Digital Footprint Calculator** — estimate the CO₂e impact of your digital habits: video streaming hours, daily AI query volume, cloud storage usage.

**Phantom Power Analyzer** — input the list of devices you leave plugged in 24/7. The AI estimates their standby "vampire energy" wattage, calculating the annual kWh drain and translating it into localized monetary cost and carbon emissions, while providing actionable mitigation tips.

**Supply Chain Analyzer** — discover the "Food Miles" of your imported goods. Enter a product and its origin, and the AI dynamically calculates transport distance to your selected country, predicts the transport mode (air/sea/road), estimates the logistics carbon footprint, and recommends a greener local alternative.

---

### 🌍 Lifestyle — AI-Powered Sustainability Coaching

**AI Recipe Wizard** — list your fridge leftovers; the AI returns a low-carbon recipe using those exact ingredients, with per-serving emission estimates.

**Eco-Travel Router** — enter origin and destination; the AI suggests the lowest-carbon route and compares transport mode emissions side by side.

**Fast Fashion Analyzer** — check the environmental impact of a clothing item before buying. Enter a garment, and the AI identifies its dominant material, estimates its lifecycle carbon footprint, assigns an impact severity level, and suggests sustainable alternatives alongside an eco-care tip.

**Smart Diet Planner** — generate a full 7-day low-carbon meal plan tailored to your dietary preferences or restrictions. The AI focuses on local, seasonal, and low-impact ingredients, calculating the estimated CO₂e saved compared to an average diet for the week.

---

## ♿ Accessibility (a11y)

CarbonSense is built to be inclusive and navigable for all users:
- **Keyboard Navigation**: Full focus management and focus-visible styling across all tabs, sliders, and buttons.
- **ARIA Labeling**: Appropriate `aria-live`, `aria-hidden`, and `role` attributes to support screen readers, especially on dynamic content like the What-If Simulator and Scorecard.
- **ELI10 Mode**: A dedicated accessibility toggle that converts complex scientific jargon into simple, universal language ("Explain Like I'm 10").

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend (React + Vite + TypeScript)"
        A[Calculator Steps] --> B[Carbon Calculator Engine]
        B --> C[DNA Classifier]
        C --> D[Action Priority Ranker]
        D --> E[Zustand Store]
        E --> F[All UI Tabs]
        F --> G[aiLayer.ts]
    end

    subgraph "Security Layer"
        G -->|VITE_API_URL| H[Express Proxy :3001]
        H -->|Helmet + CSP| I[Rate Limiter]
        I -->|TTL Cache| J[OpenRouter API]
        J -->|Gemma / Gemini| K[AI Response]
    end

    subgraph "Offline Fallback"
        G -.->|fetch fails| L[Local Intelligence Engine]
        L --> M[Static Recommendation DB]
    end

    subgraph "Data Sources"
        B --- N[IPCC Emission Factors]
        B --- O[Country Grid Intensity Map]
        B --- P[DEFRA Consumer Factors]
    end
```

**Stack at a glance:**

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| State | Zustand with persist middleware |
| Backend proxy | Express.js, Helmet, express-rate-limit |
| AI provider | OpenRouter (Gemma 3 / Gemini) |
| Testing | Vitest, React Testing Library |
| Emission data | IPCC AR6, DEFRA 2023, IEA Grid Intensity |

### Project Structure

CarbonSense follows a clean, domain-driven architecture separating the intelligence engine from the presentation layer:
1. **Core Domain** (`src/core/`): Data validation and global Zustand state management.
2. **Services** (`src/services/`): Pure logic modules for Carbon Calculation (`carbonCalculator.ts`), DNA Classification (`dnaClassifier.ts`), and Action Priority Ranking (`actionPriority.ts`).
3. **AI Layer** (`src/services/aiLayer.ts`): Orchestrates all backend AI calls with graceful offline fallback logic.
4. **UI Components** (`src/components/`): Glassmorphism React components organized into 6 tab-based subfolders (`Profile`, `Intelligence`, `Actions`, `Reports`, `EcoLab`, `Lifestyle`) to provide a clear mental map of the app's structure.

---

## 🔒 Security Posture

- **API key never touches the client** — all AI calls are proxied through the Express backend; the `OPENROUTER_API_KEY` lives only in a server-side `.env` file
- **Helmet** sets secure HTTP headers on every response (X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy)
- **Content Security Policy** — strict allowlist restricting script/style/image/connect sources
- **Rate limiting** — 100 requests per 15 minutes per IP on the `/api/chat` endpoint
- **CORS** — origin allowlist driven by `ALLOWED_ORIGINS` environment variable; defaults to localhost in dev
- **TTL response cache** — identical prompts served from memory for 1 hour, reducing API cost and latency
- **Input validation & sanitisation** — `sanitizeText()` strips HTML/script tags from all user inputs; `validateInputs()` enforces type and range constraints before any calculation
- **Request payload limits** — strict 500kb JSON body limits and prompt length validations instantly reject oversized queries with `413 Payload Too Large`.
- **Server-side request timeouts** — `AbortController` prevents hanging downstream connections by enforcing a 15-second proxy timeout returning a `504 Gateway Timeout`.
- **SHA-256 hashed cache keys** — prevents weird-unicode keys and memory exhaustion by cryptographically hashing the prompt payloads rather than storing raw text as map keys.
- **Scrubbed error traces** — upstream OpenRouter AI provider errors are securely logged server-side but never leaked to the client response.
- **No SQL** — no database, no SQL injection surface; all state is in-memory or client-side
- **XSS** — React's default JSX escaping + `sanitizeText()` for externally-supplied strings; no `dangerouslySetInnerHTML` anywhere in application code

---

## 📊 Data & Methodology

CarbonSense uses the following emission factor sources:

| Category | Source |
|----------|--------|
| Electricity (grid) | IEA 2023 country-level grid intensity (kg CO₂e/kWh) |
| Transport | IPCC AR6 WGIII — vehicle lifecycle emission factors |
| Food/Diet | DEFRA 2023 GHG conversion factors for food categories |
| Consumer goods | DEFRA 2023 spend-based emission factors |
| AC & gas | IPCC-aligned appliance energy intensity estimates |

The calculator runs **entirely client-side / offline-first** for the base footprint number — no data is sent anywhere until a user explicitly triggers an AI feature. All AI features fall back gracefully to a local static-logic engine if the backend is unreachable or times out.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- An [OpenRouter](https://openrouter.ai) API key

### 1. Clone & install

```bash
git clone https://github.com/Siva-2511/Carbonfootprint.git
cd Carbonfootprint
npm install
```

### 2. Configure environment

```bash
# Root .env
cp .env.example .env
# Set VITE_API_URL=http://localhost:3001/api/chat

# Server .env
cp server/.env.example server/.env
# Set OPENROUTER_API_KEY=your_key_here
# Set ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Run the application

```bash
# Starts both the Vite frontend and Express backend concurrently
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Run tests

```bash
npx vitest run        # 55 unit + component tests
npx tsc --noEmit      # TypeScript type check
npx eslint .          # Lint (0 errors)
```

---

## ⚠️ Known Limitations

- **AI features require the backend proxy running** — if the Node server isn't running, all AI-powered features (chat advisor, recipe wizard, travel router, receipt scanner, daily challenge, action AI guides, phantom power analyzer, supply chain analyzer, fast fashion analyzer, smart diet planner, time-travel projection) automatically fall back to the local static intelligence engine. The core carbon calculator and all analytics work fully offline.
- **Receipt Scanner accuracy** — Vision AI extraction quality depends on image clarity and lighting; handwritten receipts may produce lower accuracy.
- **Emission factors are estimates** — individual lifestyle variation means actual emissions may differ from calculated values. The tool is best used for *relative comparison* and *identifying the highest-leverage changes*, not as a precise audit.
- **Grid intensity defaults to "Global Average"** if no country is selected — users in India should select "India" for more accurate electricity emission calculations.

---

## 📌 Assumptions Made

In order to simplify the complex reality of carbon accounting for individual users, the following assumptions and constraints were applied:
- **Grid Intensity:** We assume the user's electricity grid matches the national IEA average for their country. Regional or municipal grid variations are not accounted for unless the user explicitly selects "Solar" or "Mixed" power.
- **Dietary Impact:** We rely on flat annual emission benchmarks based on global studies for diet types (e.g., Heavy Meat vs. Vegan) rather than asking users to log every calorie.
- **Appliance Energy Constraints:** Air Conditioning calculations assume a standard 1.5 kWh draw. The Phantom Power analyzer assumes modern average standby wattage for typical consumer appliances.
- **Public Transport Baselines:** Bus and Metro emission calculations assume average passenger capacity utilization, attributing a shared slice of the vehicle's footprint to the user.

---

## 🧪 Testing

```
src/__tests__/
├── carbonCalculator.test.ts # Core emission calculation logic
├── dnaClassifier.test.ts    # Persona classification
├── actionPriority.test.ts   # Recommendation ranking + DNA personalisation
├── projectionEngine.test.ts # 5-year BAU vs sustainable projections
├── validation.test.ts       # Input sanitisation, clamp, boundary cases
├── security.test.ts         # XSS simulation, audit function behaviour
├── storage.test.ts          # Local storage validation and quota handling
└── Simulator.test.tsx       # React component rendering and memoization
```

55 tests passing · 0 failures · Clean TypeScript build · 0 ESLint errors

---

## 🤝 Contributing

This project was built for the **Hack2Skill & Google for Developers AI Challenge 2026**. Pull requests are welcome for bug fixes and improvements.

---

<div align="center">

Built with ❤️ for the **Hack2Skill & Google for Developers AI Challenge 2026**

Developed by **Sivasubramaniyan G**

*CarbonSense — because the planet needs intelligence, not just intention.*

</div>

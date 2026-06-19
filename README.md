# CarbonSense 🌍

![CarbonSense Logo](https://img.shields.io/badge/CarbonSense-Sustainability_Intelligence-059669?style=for-the-badge&logo=leaf&logoColor=white)
![Build Status](https://img.shields.io/badge/build-passing-success?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

Welcome to **CarbonSense**! This is a highly developed, premium SaaS-style sustainability dashboard and carbon footprint calculator designed to help users track, understand, and reduce their environmental impact with the help of AI.

Built with ❤️ for the Hack2Skill & Google for Developers AI Challenge 2026. Developed by **Sivasubramaniyan G**.

## ✨ Features

- **My Profile tab**: 4-step guided calculator (Energy, Transport, Diet, Lifestyle/consumption) using IPCC-based emission factors, with country-aware electricity grid intensity, household size scaling, and real-time input validation. Produces a "Carbon DNA" result: a persona classification (e.g. Eco-Leader, Balanced Emitter, Urban Commuter) with a category breakdown (energy/transport/diet/consumption percentages), a trend indicator, and a "Carbon Evolution" panel showing a 5-year projected trajectory comparing business-as-usual emissions against an achievable sustainable-action trajectory.
- **Intelligence tab**: A Sustainability Scorecard (0-100 score with category-level breakdown and a "biggest opportunity" callout), a What-If Simulator with live sliders (Drive Less / Fly Less / Reduce Meat & Dairy) that recompute projected footprint and savings in real time, a benchmark comparison chart against India average, global average, top-10%-of-emitters, and the Paris Agreement 2030 per-capita target, and a Progress Tracker showing monthly carbon budget vs. actual emissions.
- **Actions tab**: A phase-based Action Roadmap (Quick Wins / Habit Formation / Optimization / Carbon Neutral) with priority-ranked, persona-personalized recommendations, checkable progress tracking with eco-points and levels, an AI-generated step-by-step guide per action, and an AI Advisor chat with three selectable coaching personas (Friendly Guide, Strict Coach, Eco Scientist).
- **Reports & Settings tab**: An Identity Report summary, a Carbon Offsetting calculator (tree-equivalent estimate), theme toggle, ELI10 mode (simplifies technical language app-wide), AI coach persona selection, and a System Health panel showing live security audit results.
- **Eco Lab tab**: An AI Receipt & Meal Scanner (upload a photo, get itemized carbon footprint estimates via Vision AI) and a Daily Eco-Challenge (AI-generated sustainability trivia).
- **Lifestyle tab**: An AI Recipe Wizard (turns listed ingredients into a low-carbon recipe suggestion) and an Eco-Travel Router (suggests the lowest-carbon route between two locations).
- **Cross-cutting**: Offline-first local fallback for every AI feature (the app remains fully functional with static/local logic if the AI backend is unreachable or times out), Google Translate-powered multi-language support, full keyboard navigation and ARIA labeling across all six tabs, and a backend security posture (Helmet, CSP, rate limiting, CORS allowlisting, response caching) that keeps the AI provider key server-side only.

## 🏗️ Architecture Diagram

```mermaid
graph TD
    subgraph Frontend [React + Vite Frontend]
        UI[Glassmorphism UI Components]
        Store[Zustand State Manager]
        I18n[Google Translate Widget]
        Sec[Security Auditor]
        
        UI --> Store
        Store --> UI
    end
    
    subgraph Backend [Express/Node.js Proxy]
        API[Rate Limited API]
        Cache[LRU Memory Cache]
        Headers[Helmet Security Headers]
        
        API --> Cache
    end
    
    subgraph External [External APIs]
        OR[Google Gemini AI]
    end
    
    Frontend <-->|Secure Fetch over HTTP/HTTPS| Backend
    Backend <-->|Server-to-Server| External
```

## 🚀 Getting Started

To run this application locally, you will need two terminal windows (one for the frontend, one for the backend proxy).

### 1. Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your Google Gemini AI API key:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```
   *(Note: The `VITE_API_URL` should remain empty for local development, as the app will automatically default to `http://localhost:3001/api/chat`)*

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Backend Proxy

In your first terminal window:

```bash
npm run api
```

You should see: `Secure AI Proxy listening on port 3001`

### 4. Start the Frontend App

In your second terminal window:

```bash
npm run dev
```

You should see the Vite local server URL (typically `http://localhost:5173/`). Open this in your browser to start using CarbonSense!

# 🌌 QuranPulse v6.0 - Project Context

> **The Future of Islamic Intelligence.**
> A next-generation Quran companion app bridging faith with futuristic technology (AI, AR, Cyber-aesthetics).

## 📂 Project Structure

This repository follows a monorepo-like structure containing two main applications:

### 1. 📱 Main Application (Client)
* **Path**: Root directory (`/`)
* **Type**: Progressive Web App (PWA)
* **Tech Stack**:
  * **Framework**: React 18 + Vite
  * **Language**: TypeScript
  * **Styling**: Tailwind CSS v4 + Framer Motion + **Glassmorphism 2.0 (Premium "Noor-e-Cyber")**
  * **State**: React Query + Context API
  * **Routing**: React Router v7
* **Key Features (Premium Upgrade)**:
  * **Pulse Command Center**: Global dashboard with Bento Grid layout and time-sensitive intelligence.
  * **The Ecosystem**: Modular architecture connecting "Heartware", "Fikr & Zikir", and "Iqra' Digital".
  * **Noor-e-Cyber Design**: 3D Levitation effects, Neon Cyan glows, and holographic glass interfaces.
  * **Ustaz AI 2.0 (Safe)**: Hybrid Fatwa Engine with strict Shafi'i compliance and "Safety First" logic.
  * **Iqra Digital**: 3D Interactive Library for data-to-wisdom transformation.

### 2. 🛡️ Admin Dashboard (Mission Control)
* **Path**: `/ADMIN-DASHBOARD` (Note: Ensure dependencies are installed separately here)
* **Type**: Server-Side Rendered Web App
* **Tech Stack**: Next.js 15 (App Router), Prisma, Tailwind + shadcn/ui.
* **Purpose**: User management (10k+ target), Content CMS, and AI Monitoring.

### 3. 🗄️ Backend & Data
* **Provider**: **Supabase** (PostgreSQL)
* **Role**: Handles Authentication, Real-time Database, and Edge Functions (Chat Proxy).
* **Schema**: Managed via migrations in `supabase/migrations`.

---

## 🛠️ Development Workflow

### Main App (Client)
```bash
npm install
npm run dev   # Runs at http://localhost:5173
```

### Admin Dashboard
```bash
cd ADMIN-DASHBOARD
npm install
npm run dev   # Runs at http://localhost:3000
```

---

## 🏗️ Architecture Highlights

### AI Integration (Ustaz AI)
* **Engine**: Google Gemini 2.5 Flash + Local Regex Fallback.
* **Safety**: "Fatwa Guard" layer to prevent hallucinated rulings.
* **Failover**: Auto-rotation of API keys and model downgrade strategy (Pro -> Flash).

### Design System: "Noor-e-Cyber"
* **Themes**:
  * **Deep Space (Default)**: Midnight Navy + Neon Cyan.
  * **Noor (Light)**: Celestial Blue + White Gold.
* **Core Elements**:
  * **Glass-Premium**: Frosted glass with iridescent borders.
  * **3D Levitation**: Floating cards and interactive mesh backgrounds.
  * **Neon Pulsing**: UI elements that "breathe" with organic animations.

### Documentation (New Structure)
Documentation is now centralized in `DOCS_VAULT`:
* `00_CORE_CONTEXT`: Vision, Tech Stack, Architecture.
* `01_FEATURES_IMPLEMENTED`: Completed modules.
* `02_FEATURES_PENDING`: Future roadmap.

---

## 🧪 Testing & Quality

* **Unit/Integration**: Jest configuration in `jest.config.cjs`.
* **Linting**: ESLint and Prettier setup (inferred).
* **CI/CD**: `.github/workflows/ci-cd.yml`.

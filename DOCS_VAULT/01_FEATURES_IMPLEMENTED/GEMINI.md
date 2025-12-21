# 🌌 QuranPulse v6.0 - Project Context

> **The Future of Islamic Intelligence.**
> A next-generation Quran companion app bridging faith with futuristic technology (AI, AR, Cyber-aesthetics).

## 📂 Project Structure

This repository follows a monorepo-like structure containing two main applications:

### 1. 📱 Main Application (Client)
*   **Path**: Root directory (`/`)
*   **Type**: Progressive Web App (PWA)
*   **Tech Stack**:
    *   **Framework**: React 18 + Vite
    *   **Language**: TypeScript
    *   **Styling**: Tailwind CSS v4 + Framer Motion
    *   **State**: React Query + Context API
    *   **Routing**: React Router v7
*   **Key Features**:
    *   **Pulse Control Center**: Global command center for theme switching (Deep Space / Cyber Pulse) and quick actions.
    *   **AI Intelligence**: Zhipu AI (GLM-4) integration for semantic search, AI Tafsir, and Ustaz AI Chat.
    *   **Iqra Digital**: AR Vision Coach and interactive reading analytics.
    *   **Immersive Reader**: Glassmorphism UI with 3D tilt cards and starfield backgrounds.

### 2. 🛡️ Admin Dashboard (Mission Control)
*   **Path**: `/ADMIN-DASHBOARD`
*   **Type**: Server-Side Rendered Web App
*   **Tech Stack**:
    *   **Framework**: Next.js 15 (App Router)
    *   **Language**: TypeScript
    *   **Styling**: Tailwind CSS + shadcn/ui
    *   **ORM**: Prisma
    *   **State**: Zustand + React Query
*   **Purpose**: Central command for user management (10k+ target), CMS for Quran/Doa content, AI monitoring, and system configuration.

### 3. 🗄️ Backend & Data
*   **Provider**: **Supabase** (PostgreSQL)
*   **Role**: Handles Authentication, Real-time Database, and Edge Functions.
*   **Key Tables**: `profiles` (extends Auth), `surahs`, `ayahs`, `translations`, `bookmarks`.
*   **Schema**: Defined in `supabase_schema.sql` and managed via migrations (`supabase/migrations`).

---

## 🛠️ Development Workflow

### Main App (Client)

```bash
# Install Dependencies
npm install

# Start Development Server (Vite)
# Runs at http://localhost:5173
npm run dev

# Build for Production
npm run build

# Run Tests (Jest)
npm test
```

### Admin Dashboard

```bash
cd ADMIN-DASHBOARD

# Install Dependencies
npm install

# Start Development Server (Next.js)
# Runs at http://localhost:3000
npm run dev

# Database Management (Prisma)
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
```

---

## 🏗️ Architecture Highlights

### AI Integration (Ustaz AI 2.0)
- **Service**: `aiService.ts` running a Hybrid Engine.
- **Core Intelligence**: 
    - **Primary**: Google Gemini 2.5 Flash (Cloud API).
    - **Secondary**: Local Regex/Keyword Matcher for instant FAQs (Solat, Puasa).
- **Resilience Strategy**: 
    - **Key Rotation**: Rotates between 7 API keys to avoid rate limits.
    - **Smart Failover**: If a key hits 429 error, it auto-switches to the next healthy key.
    - **Model Fallback**: Tries `gemini-2.5-flash` -> `1.5-flash` -> `pro` sequentially.
- **Voice (TTS)**: ElevenLabs (Neural) with Web Speech API fallback.

### Design System
- **Themes**:
    - **Deep Space (Classic)**: Standard dark mode.
    - **Cyber Pulse (Futuristic)**: Circuit maze backgrounds, neon cyan accents, HUD-style glass panels.
- **Animation**: Extensive use of Framer Motion for UI transitions and the "Kufi" logo animation.

### Deployment
- **Platform**: Vercel (Auto-deploy from `master`).
- **Output**: `dist` folder for the main app.

---

## 📝 Key Documentation Files

*   `README.md`: General project overview and setup.
*   `ADMIN_DASHBOARD.md`: Detailed specifications for the Admin Dashboard features.
*   `Architecture.md`: High-level system design.
*   `supabase_schema.sql`: Database schema definition.
*   `PRD.md`: Product Requirement Document.

---

## 🧪 Testing & Quality

*   **Unit/Integration**: Jest configuration in `jest.config.cjs`.
*   **Linting**: ESLint and Prettier setup (inferred).
*   **CI/CD**: `.github/workflows/ci-cd.yml`.

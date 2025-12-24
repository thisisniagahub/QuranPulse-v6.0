# QuranPulse v6.0 Technology Stack

> **Document Status:** Auto-Generated
> **Last Updated:** December 24, 2025
> **Source validation:** `package.json`, `aiService.ts`, `QuranAudioContext.tsx`, `README.md`

This document outlines the complete technology stack used to build **QuranPulse v6.0**.

---

## 1. Frontend Technologies

| Component | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | **React** | `^18.2.0` | Core UI library. |
| **Build Tool** | **Vite** | `^6.2.0` | Ultra-fast build tool and dev server. |
| **Language** | **TypeScript** | `~5.8.2` | Strongly typed JavaScript for scalability. |
| **UI Styling** | **Tailwind CSS** | `^4.1.17` | Utility-first CSS framework (v4 Alpha). |
| **Animations** | **Framer Motion** | `^11.0.0` | Production-ready animation library. |
| **State Mgmt** | **React Query** | `^5.90.11` | Server state management & caching. |
| **State Mgmt** | **React Context** | N/A | Global application state (Theme, Audio). |
| **Routing** | **React Router** | `^7.9.6` | Client-side routing. |
| **Icons** | **Lucide React** | `^0.344.0` | Modern, consistent icon set. |
| **PDF Engine** | **React PDF** | `^10.2.0` | Rendering PDF documents (Iqra books). |

---

## 2. Backend Technologies (Serverless)

| Component | Technology | Provider | Details |
| :--- | :--- | :--- | :--- |
| **Database** | **PostgreSQL** | Supabase | Relational data (`ayahs`, `users`). |
| **Auth System** | **Supabase Auth** | Supabase | Email, Google, & Anonymous sign-ins. |
| **API Layer** | **PostgREST** | Supabase | Auto-generated REST API from schema. |
| **Functions** | **Edge Functions** | Deno | Serverless compute for AI proxy (`chat-proxy`). |
| **Realtime** | **Socket.IO** | Self-Hosted | Used for Bot communication (Whatsapp/Telegram). |
| **Bot Server** | **Node.js** | N/A | Runs `whatsapp-web.js` & `telegraf`. |

---

## 3. AI & Intelligence Layer

| Capability | Model / Service | Priority | Purpose |
| :--- | :--- | :--- | :--- |
| **LLM (Primary)** | **Gemini 1.5 Flash** | P0 | "Ustaz AI" core logic (Fast, Cheap). |
| **LLM (Fast)** | **Groq (Llama 3)** | P1 | Ultra-low latency responses. |
| **Vision** | **Gemini Vision** | P2 | Analyzing images in "Iqra Vision". |
| **TTS (Premium)**| **ElevenLabs** | P1 | Neural Voice for Quran Translation. |
| **TTS (Fallback)**| **Google TTS** | P0 | Free, reliable fallback if ElevenLabs fails. |
| **TTS (System)** | **Web Speech API** | P0 | Offline last-resort voice synthesis. |

---

## 4. External Services & APIs

| Service | Purpose | Limits / Tier | Priority |
| :--- | :--- | :--- | :--- |
| **Supabase** | Backend-as-a-Service | Free Tier (500MB DB) | **P0 (Critical)** |
| **Gemini API** | AI Intelligence | Pay-as-you-go | **P0 (Critical)** |
| **ElevenLabs** | Neural Audio | 10k chars/mo (Free) | **P1 (High)** |
| **Groq API** | Fast Inference | Free Beta | **P2 (Nice to have)** |
| **Adhan.js** | Prayer Times Calculation| Local Library | **P0 (Critical)** |
| **Quran.com** | Audio CDN | Public CDN | **P0 (Critical)** |

---

## 5. NPM Dependencies Breakdown

### 🔴 Critical (P0) - Required for App to Run
*   `react`, `react-dom`
*   `@supabase/supabase-js` (Data Sync)
*   `react-router-dom` (Navigation)
*   `@tanstack/react-query` (Data Fetching)
*   `axios` (API Requests)

### 🟡 Important (P1) - Core Experience
*   `framer-motion` (UI Feel)
*   `lucide-react` (Icons)
*   `howler` / `react-use-audio-player` (Audio)
*   `react-markdown` (AI Chat Formatting)
*   `adhan` (Prayer Times)

### 🔵 Optional (P2) - Niche Features
*   `html-to-image` (Share Card Generaton)
*   `qrcode-terminal` (Bot Auth)
*   `whatsapp-web.js`, `telegraf` (Bot Ecosystem)
*   `mermaid` (Diagrams in Chat)
*   `react-pdf` (Iqra Book Reader)

---

## 6. Development Tools

| Category | Tool | Description |
| :--- | :--- | :--- |
| **Package Manager** | **NPM** | Standard Node package manager. |
| **Language** | **TypeScript** | Strict typing configuration (`tsconfig.json`). |
| **Testing** | **Jest** | Unit testing framework (`jest.config.cjs`). |
| **Linting** | **ESLint** | Code quality checks. |
| **Formatting** | **Prettier** | Code formatting (implicit). |
| **Dev Server** | **Vite** | HMR (Hot Module Replacement). |

---

*Assumptions:*
1.  *Payment Gateway (`ToyyibPay`/`Stripe`) is listed as "Mock" in README, so it is excluded from the active tech stack.*
2.  *Admin Dashboard is listed as a skeleton in Next.js, but main app logic resides in Vite/React.*

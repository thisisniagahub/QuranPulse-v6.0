# 🌌 QuranPulse v6.0 — Antigravity Context

> **The Future of Islamic Intelligence.**
> A next-generation Quran companion app bridging faith with futuristic technology.
> **Last Updated**: 21 February 2026

---

## ⚠️ CRITICAL: Workspace Relationship

| Workspace | Path | Purpose |
|-----------|------|---------|
| **v6.0 (THIS)** | `I:\ANTIGRAVITY\QuranPulse-v6.0` | **Source code** — React PWA |
| **v7.0 Strategy** | `D:\GANGNIAGA\QURANPULSE-7.0` | Strategy & planning docs only |

---

## 📂 Project Structure

```
src/
├── modules/          # quran, iqra, smart-deen, landing
├── components/       # Reusable UI components
├── services/         # API services (Supabase, AI)
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── lib/              # Utility libraries
└── types/            # TypeScript type definitions

docs/
├── VPS_PRD.md        # Deployment architecture
├── VPS_STATUS.md     # Infrastructure status
├── OPENCLAW_GUIDE.md # OpenClaw config

supabase/functions/   # Edge Functions (8 deployed)
ADMIN-DASHBOARD/      # Next.js admin app
DOCS_VAULT/           # Documentation repository
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| State | Zustand, React Query, React Context |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions) |
| AI | Gemini 2.5 Flash (primary), Groq, OpenAI Whisper |
| Testing | Jest, React Testing Library |
| Routing | React Router 7 |
| Deployment | Vercel via CLI `vercel --prod`, Docker (API + Qdrant) |

---

## Infrastructure Architecture

### VPS Deployment (srv1322432)

| Component | Runtime | Domain |
|-----------|---------|--------|
| OpenClaw (GangBot) | Root user systemd | operator.gangniaga.my |
| QuranPulse API | Docker Compose | api.gangniaga.my |
| Qdrant | Docker (in QP stack) | localhost:6333 |
| Frontend | Vercel | quranpulse.my |
| Database | Supabase | Managed |
| VPN | Tailscale | 100.100.205.64 |

---

## 🏗️ Current Phase: Battle 1 (Active)

**Objective**: Ship v6.0 polish → Ramadan soft launch by 28 Feb 2026

### Key Features
- **Pulse Command Center** — Global dashboard with Bento Grid layout
- **Ustaz AI 2.0** — Hybrid Fatwa Engine with Shafi'i compliance
- **Landing Page** — "Raudhah" design, reviewed & polished (10 fixes shipped 21 Feb)
- **Iqra Digital** — 3D Interactive Library
- **Khatam Tracker** — Visual 30-juz progress

### Deploy Method
- **Production**: `vercel --prod` CLI (auto-deploy from GitHub unreliable for unverified commits)
- **Verification**: `npx tsc --noEmit` before every deploy

### Quran Module Tiers

| Tier | Features |
|------|----------|
| T1 Quick Wins | Semantic Search, Daily Ayat Widget, Khatam Tracker |
| T2 Medium | Tadabbur AI Mode, Voice-Active Reader, Word Root Explorer |
| T3 Advanced | Digital Mushaf, Iqra Graduation, Smart Deen Crossover |

---

## 🛠️ Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Production build
npm run test         # Run tests
npm run test:watch   # Watch mode
```

### Admin Dashboard
```bash
cd ADMIN-DASHBOARD
npm install
npm run dev          # http://localhost:3000
```

---

## 🎨 Design System: "Raudhah"

| Theme | Colors |
|-------|--------|
| **Raudhah** (Default) | Teal (#1B6B5A) + Gold (#D4AF37) on Ivory |
| **Dark/Ink** | Deep Ink (#2D2A26) accents |

**Core Elements**: Premium glass cards, gradient headlines, generous whitespace, Framer Motion animations

---

## Conventions

- **Styling**: Tailwind CSS v4 + Framer Motion
- **Components**: Functional TypeScript (FC)
- **State**: Zustand (global), React Query (server)
- **Naming**: PascalCase components, camelCase hooks/services

---

## 🤖 Agent Protocols

### Before Any Response
1. READ `.agent/PROJECT_STATUS.md`
2. IDENTIFY request type
3. FOLLOW appropriate protocol

### Workflows

| Command | Purpose |
|---------|---------|
| `/plan-mvp` | MVP planning |
| `/agent-quran` | Quran API |
| `/agent-worship` | Prayer times |
| `/agent-compliance` | Fatwa checks |
| `/agent-education` | Hadith/Tafsir |
| `/agent-zakat` | Calculations |
| `/agent-asr` | ASR engine |
| `/vibe` | Full build flow |
| `/ship` | Deploy pipeline |

---

## 📎 Key References

| File | Purpose |
|------|---------|
| [AGENTS.md](AGENTS.md) | Agent rules & verification |
| [docs/VPS_PRD.md](docs/VPS_PRD.md) | Deployment architecture |
| [docs/VPS_STATUS.md](docs/VPS_STATUS.md) | Infrastructure status |
| [docs/OPENCLAW_GUIDE.md](docs/OPENCLAW_GUIDE.md) | OpenClaw config |
| `.agent/PROJECT_STATUS.md` | Current phase |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

---

> *"Kami tidak membina app. Kami membina jambatan antara ummah dan kitab Allah."*

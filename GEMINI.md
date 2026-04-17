# QuranPulse v6.0 — Gemini Context

> **Last Updated**: 5 March 2026
> **Design System**: Raudhah (Teal/Gold on Ivory)
> **AI Gateway**: OpenClaw (operator.gangniaga.my)

## Project Overview

**QuranPulse v6.0 ("Raudhah Edition")** is a premium Islamic Progressive Web App (PWA) bridging spiritual depth with elegant, modern design. Features include "Ustaz AI" (Shafi'i-compliant AI assistant), "Iqra Digital" (interactive Quran learning), and a "Pulse Command Center" for daily spiritual management.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| State | Zustand, React Query, React Context |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions) |
| AI Gateway | OpenClaw (zero-API-key, OAuth everywhere) |
| AI Models | Gemini 3 Flash (primary), GPT-5.3-Codex (fallback) |
| TTS | OpenAI gpt-4o-mini-tts via Codex OAuth |
| ASR | OpenAI gpt-4o-mini-transcribe via Codex OAuth |
| Testing | Jest, React Testing Library |
| Routing | React Router 7 |

---

## Design System: "Raudhah"

| Element | Value |
|---------|-------|
| Primary | Teal (#1B6B5A) |
| Accent | Gold (#D4AF37) |
| Background | Ivory (#FFFFF0) |
| Dark/Ink | Deep Ink (#2D2A26) |
| Core Style | Premium glass cards, gradient headlines, generous whitespace |
| Animations | Framer Motion (smooth, subtle) |

> ⚠️ **Noor-e-Cyber theme has been fully deprecated.** All Cyan/Purple/Neon references are legacy.

---

## Infrastructure Architecture

### VPS Deployment (srv1322432)

| Component | Runtime | Domain |
|-----------|---------|--------|
| OpenClaw Gateway | Systemd | operator.gangniaga.my → :18789 |
| QuranPulse API | Docker Compose | api.gangniaga.my → :18080 |
| Qdrant | Docker (image exists, not running) | localhost:6333 |
| Frontend | Vercel | quranpulse.my |
| Database | Supabase | Managed |
| VPN | Tailscale | 100.100.205.64 |

### AI Architecture (March 2026)

```
Frontend (quranpulse.my)
    │
    ├── Bearer token only
    ▼
OpenClaw Gateway (operator.gangniaga.my)
    │
    ├── 5 AI Agents: ustaz, content, hafazan, asr, admin
    ├── OAuth providers (ZERO API keys):
    │   ├── Google Antigravity (primary)
    │   ├── Gemini CLI (backup)
    │   ├── OpenAI Codex (fallback + TTS + ASR)
    │   └── Qwen Portal (free tier)
    │
    └── Supabase Edge Functions (10 deployed, transitional)
```

---

## File Structure

```
src/
├── modules/          # quran, iqra, smart-deen, landing
├── components/       # Reusable UI components
├── services/         # API services (openclawClient.ts, aiService.ts)
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── lib/              # Utility libraries
└── types/            # TypeScript types

apps/admin-dashboard/ # Next.js admin app
packages/            # Content and domain packages
docs/                # Curated documentation
docs/vault/          # Archived documentation repository
supabase/functions/  # 10 Edge Functions (transitional)
```

---

## Quran Module Features

### Tier 1 — Quick Wins
- **Semantic Search** — Natural language search using pgvector
- **Daily Ayat Widget** — 7 themed verses with PWA notifications
- **Khatam Tracker** — Visual 30-juz progress with confetti

### Tier 2 — Medium Features
- **Tadabbur AI Mode** — AI reflection questions after reading
- **Voice-Active Reader** — ASR-powered auto-scroll
- **Word Root Explorer** — Arabic etymology analysis

### Tier 3 — Advanced
- **Digital Mushaf** — Raudhah-themed 604-page view
- **Iqra Graduation** — Digital certificate ceremony
- **Smart Deen Crossover** — Floating AI button for context questions

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Production build
npm run test         # Run tests
npx tsc --noEmit     # TypeScript check (WAJIB before deploy)
vercel --prod        # Deploy to production
```

### Admin Dashboard
```bash
cd apps/admin-dashboard
npm install
npm run dev          # http://localhost:3000
```

---

## Conventions

- **Styling**: Tailwind CSS v4 + Framer Motion (Raudhah theme)
- **Components**: Functional TypeScript (FC)
- **State**: Zustand (global), React Query (server)
- **Design**: "Raudhah" aesthetic (Teal/Gold on Ivory)
- **AI calls**: Via OpenClaw gateway (openclawClient.ts), NOT direct API keys
- **Deploy**: `vercel --prod` CLI (auto-deploy from GitHub unreliable)

---

## Agent Protocols

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

## Important Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](AGENTS.md) | Agent rules & verification |
| [docs/operations/VPS_PRD.md](docs/operations/VPS_PRD.md) | Deployment architecture |
| [docs/operations/VPS_STATUS.md](docs/operations/VPS_STATUS.md) | Infrastructure status |
| [docs/operations/OPENCLAW_GUIDE.md](docs/operations/OPENCLAW_GUIDE.md) | OpenClaw config |
| `.agent/PROJECT_STATUS.md` | Current phase |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

---

> *"Kami tidak membina app. Kami membina jambatan antara ummah dan kitab Allah."*

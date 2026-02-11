# QuranPulse v6.0 - Gemini Context

## Project Overview
**QuranPulse v6.0 ("Noor-e-Cyber")** is a futuristic Islamic Progressive Web App (PWA) built to bridge spiritual depth with a modern, cyber-islamic design language. It features advanced modules like "Ustaz AI", "Iqra Digital" (interactive learning), and a "Pulse Command Center" for daily spiritual management.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| State | Zustand, React Query, React Context |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions) |
| AI | Gemini via Antigravity, Groq, OpenAI Whisper |
| Testing | Jest, React Testing Library |
| Routing | React Router 7 |

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

### AI Model Configuration (Actual — 2026-02-10)
```json5
{
  agents: {
    defaults: {
      model: {
        primary: "google-antigravity/gemini-3-flash",   // current active
        fallbacks: ["google-antigravity/gemini-3-pro"]  // target upgrade
      }
    }
  }
}
```

See [docs/VPS_PRD.md](docs/VPS_PRD.md) for complete deployment architecture.

---

## File Structure
```
src/
├── modules/          # quran, iqra, smart-deen
├── components/       # Reusable UI components
├── services/         # API services
├── contexts/         # React contexts
└── hooks/            # Custom hooks

docs/
├── VPS_PRD.md        # Deployment architecture
├── VPS_STATUS.md     # Infrastructure status
├── OPENCLAW_GUIDE.md # OpenClaw config
└── ...               # Feature docs

supabase/functions/   # Edge Functions
admin-dashboard/      # Next.js admin app
DOCS_VAULT/          # Documentation repository
```

---

## Quran Module Features (2026-01-11)

### Tier 1 - Quick Wins
- **Semantic Search** - Natural language search using pgvector
- **Daily Ayat Widget** - 7 themed verses with PWA notifications
- **Khatam Tracker** - Visual 30-juz progress with confetti

### Tier 2 - Medium Features
- **Tadabbur AI Mode** - AI reflection questions after reading
- **Voice-Active Reader** - ASR-powered auto-scroll
- **Word Root Explorer** - Arabic etymology analysis

### Tier 3 - Advanced
- **Digital Mushaf** - Noor-e-Cyber themed 604-page view
- **Iqra Graduation** - Digital certificate ceremony
- **Smart Deen Crossover** - Floating AI button for context questions

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Production build
npm run test         # Run tests
npm run test:watch   # Watch mode
```

### Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev
```

---

## Conventions
- **Styling**: Tailwind CSS + Framer Motion
- **Components**: Functional TypeScript
- **State**: Zustand (global), React Query (server)
- **Design**: "Noor-e-Cyber" aesthetic (Cyan/Purple neon on dark)

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

---

## Important Documentation

| File | Purpose |
|------|---------|
| [docs/VPS_PRD.md](docs/VPS_PRD.md) | Deployment architecture |
| [docs/VPS_STATUS.md](docs/VPS_STATUS.md) | Infrastructure status |
| [docs/OPENCLAW_GUIDE.md](docs/OPENCLAW_GUIDE.md) | OpenClaw config |
| [AGENTS.md](AGENTS.md) | Agent context |
| `.agent/PROJECT_STATUS.md` | Current phase |

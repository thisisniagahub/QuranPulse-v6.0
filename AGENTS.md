# AGENTS.md

> Universal context file for AI coding agents working on QuranPulse v6.0
> Following the [agents.md](https://agents.md/) open standard

---

## Project Overview

**QuranPulse v6.0 ("Raudhah Edition")** is a premium Islamic Progressive Web App (PWA) bridging spiritual depth with elegant modern design.

| Field | Value |
|-------|-------|
| Phase | PRODUCTION |
| Frontend | https://quranpulse.my |
| AI Gateway | https://operator.gangniaga.my (OpenClaw) |
| API | https://api.gangniaga.my |
| Tech | React 18 + Vite + TypeScript + Supabase |
| Design | Raudhah (Teal/Gold on Ivory) |
| Last Updated | 5 March 2026 |

---

## Infrastructure Architecture

### VPS (srv1322432 - 76.13.176.142)

| Component | Runtime | Domain |
|-----------|---------|--------|
| OpenClaw Gateway | Systemd | operator.gangniaga.my → :18789 |
| QuranPulse API | Docker Compose | api.gangniaga.my → :18080 |
| Qdrant | Docker (image exists, not running) | localhost:6333 |
| Frontend | Vercel | quranpulse.my |
| Database | Supabase | Managed |
| VPN | Tailscale | 100.100.205.64 |

### AI Model Configuration (March 2026)

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "google-antigravity/gemini-3-flash",   // via OAuth
        fallbacks: [
          "google-gemini-cli/gemini-3-flash",           // OAuth backup
          "openai-codex/gpt-5.3-codex",                 // OAuth fallback
          "qwen-portal/coder-model"                     // Free tier
        ]
      }
    }
  }
}
```

> **Zero API keys** — all providers use OAuth. Frontend sends 1 bearer token to OpenClaw gateway.

### Recent Development

- **2026-03-03**: OpenClaw gateway integration shipped (`ffbf1de`) — 21 perf fixes + `openclawClient.ts`
- **2026-02-28**: UI consistency audit — Raudhah conversion verified (8.5/10), nav icons + logo updated
- **2026-02-28**: Edge Function fixes
- **2026-02-21**: Landing page review — 10/11 issues fixed
- **2026-02-20**: Full Raudhah theme conversion across 23+ source files

See [docs/VPS_PRD.md](docs/VPS_PRD.md) for deployment architecture.

---

## Setup Commands

```bash
# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev

# Production build
npm run build

# Run tests
npm test

# TypeScript check
npx tsc --noEmit

# Lint check
npm run lint

# Deploy to production
vercel --prod
```

---

## Code Style

- TypeScript strict mode
- Tailwind CSS v4 for styling (Raudhah theme: Teal/Gold/Ivory)
- Framer Motion for animations
- Functional components with hooks
- Zustand for global state, React Query for server state
- AI calls via `openclawClient.ts` — NOT direct API keys in browser
- Commit format: `[AGENT:Name] type: message`

---

## Testing Instructions

Before claiming ANY task complete:

1. **TypeScript Check** - `npx tsc --noEmit` → ZERO errors
2. **Build Check** - `npm run build` → Must succeed
3. **Test Suite** - `npm test` → All tests pass
4. **Runtime Check** - `npm run dev` → No console errors

⛔ **NEVER** say "done" without running these checks first!
⛔ **NEVER** ask user to "check if it works" - verify yourself!

---

## Security Considerations

- Check `.agent/context/PROTECTED_FILES.md` before deleting files
- Never delete without explicit `/approve-delete` from user
- Never expose API keys or secrets in code
- Follow Supabase RLS (Row Level Security) policies
- AI calls go through OpenClaw gateway — no API keys in frontend

---

## Project Structure

```
src/
├── modules/          # Feature modules (quran, iqra, smart-deen, landing)
├── components/       # Reusable UI components
├── services/         # openclawClient.ts, aiService.ts, etc.
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── lib/              # Utility libraries
└── types/            # TypeScript type definitions

docs/
├── VPS_PRD.md        # Deployment architecture
├── VPS_STATUS.md     # Infrastructure status
├── OPENCLAW_GUIDE.md # OpenClaw configuration
└── ...               # Feature documentation

supabase/
├── functions/        # 10 Edge Functions (transitional — OpenClaw replacing)
└── migrations/       # Database migrations

.agent/
├── PROJECT_STATUS.md # Current project phase
├── context/          # Task context files
└── protocols/        # Response templates
```

---

## Agent Workflows

| Command | Purpose |
|---------|---------|
| `/agent-quran` | Quran API operations |
| `/agent-worship` | Prayer times, Qibla |
| `/agent-compliance` | Fatwa, Halal checks |
| `/agent-education` | Hadith, Tafsir |
| `/agent-zakat` | Zakat calculations |
| `/agent-asr` | Speech recognition |
| `/plan-mvp` | Structured MVP planning |
| `/vibe` | Full build flow |
| `/ship` | Deploy pipeline |

---

## Session Protocol

### Starting a Session
1. Read this file (AGENTS.md)
2. Read `.agent/PROJECT_STATUS.md`
3. Read `.agent/context/CURRENT_TASK.md`
4. Check `.agent/context/PROTECTED_FILES.md`

### Ending a Session
1. Update `.agent/context/CURRENT_TASK.md`
2. Add entry to `.agent/context/HANDOFF_LOG.md`
3. Commit with prefix: `[AGENT:Name] type: message`

---

## PR / Commit Instructions

Format: `[AGENT:Name] type: description`

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `refactor` - Code refactor
- `test` - Tests
- `deploy` - Deployment
- `infra` - Infrastructure

Example: `[AGENT:Antigravity] docs: align GEMINI.md and AGENTS.md to Raudhah + OpenClaw`

---

## Critical Rules

1. ✅ **Read before acting** - Load context files first
2. ✅ **Verify before completing** - Run build/test checks
3. ✅ **Document your work** - Update task/handoff files
4. ❌ **Never delete without permission** - Check PROTECTED_FILES.md
5. ❌ **Never assume** - Ask if unclear
6. ❌ **Never skip verification** - Test everything

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `AGENTS.md` | This file - main context |
| `GEMINI.md` | Extended project context |
| `docs/VPS_PRD.md` | Deployment architecture |
| `docs/VPS_STATUS.md` | Infrastructure status |
| `docs/OPENCLAW_GUIDE.md` | OpenClaw configuration |
| `.agent/PROJECT_STATUS.md` | Current phase & health |
| `.agent/context/CURRENT_TASK.md` | Active work items |

---

*Following the [agents.md](https://agents.md/) open standard used by 60k+ projects.*

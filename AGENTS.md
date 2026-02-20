# AGENTS.md

> Universal context file for AI coding agents working on QuranPulse v6.0
> Following the [agents.md](https://agents.md/) open standard

---

## Project Overview

**QuranPulse v6.0 ("Noor-e-Cyber")** is a futuristic Islamic Progressive Web App (PWA) bridging spiritual depth with modern cyber-Islamic design.

| Field | Value |
|-------|-------|
| Phase | PRODUCTION |
| Frontend | https://quranpulse.my |
| API | https://api.gangniaga.my |
| Operator | https://operator.gangniaga.my |
| Tech | React 18 + Vite + TypeScript + Supabase |

---

## Infrastructure Architecture

### VPS (srv1322432 - 76.13.176.142)

| Component | Runtime | Domain |
|-----------|---------|--------|
| OpenClaw (GangBot) | Root user systemd | operator.gangniaga.my |
| QuranPulse API | Docker Compose | api.gangniaga.my |
| Qdrant | Docker (planned) | localhost:6333 (not yet deployed) |
| Frontend | Vercel | quranpulse.my |
| Database | Supabase | Managed |
| VPN | Tailscale | 100.100.205.64 |

### AI Model Configuration (Actual — 2026-02-19)
```json5
{
  agents: {
    defaults: {
      model: {
        primary: "google-antigravity/gemini-3-flash",   // current
        fallbacks: ["google-antigravity/gemini-3-pro"]  // target upgrade
      }
    }
  }
}
```

### Recent Development (Feb 2026)
- **2026-02-19**: Premium landing page polish + Vercel deploy verified ✅
- **2026-02-18**: AI Tadabbur Mode, Ustaz AI EQ, Leaderboard demo data
- **2026-02-10**: VPS infrastructure fix + doc alignment

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
```

---

## Code Style

- TypeScript strict mode
- Tailwind CSS for styling (Glassmorphism + Neon aesthetics)
- Framer Motion for animations
- Functional components with hooks
- Zustand for global state, React Query for server state
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

---

## Project Structure

```
src/
├── modules/          # Feature modules (quran, iqra, smart-deen)
├── components/       # Reusable UI components
├── services/         # API services
├── contexts/         # React contexts
└── hooks/            # Custom hooks

docs/
├── VPS_PRD.md        # Deployment architecture
├── VPS_STATUS.md     # Infrastructure status
├── OPENCLAW_GUIDE.md # OpenClaw configuration
└── ...               # Feature documentation

supabase/
├── functions/        # Edge Functions
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

Example: `[AGENT:Antigravity] infra: Update VPS security hardening`

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

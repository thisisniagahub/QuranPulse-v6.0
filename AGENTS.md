# AGENTS.md

> Universal context file for AI coding agents working on QuranPulse v6.0
> Following the [agents.md](https://agents.md/) open standard

---

## Project Overview

**QuranPulse v6.0 ("Noor-e-Cyber")** is a futuristic Islamic Progressive Web App (PWA) bridging spiritual depth with modern cyber-Islamic design. Features include Ustaz AI (chat), Iqra Digital (learning), and Pulse Command Center (dashboard).

| Field | Value                                   |
| ----- | --------------------------------------- |
| Phase | PRODUCTION                              |
| URL   | https://quranpulse.my                   |
| Tech  | React 18 + Vite + TypeScript + Supabase |

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

```text
src/
├── modules/          # Feature modules (quran, iqra, smart-deen, etc.)
├── components/       # Reusable UI components
├── services/         # API services (aiService, quranService, etc.)
├── contexts/         # React contexts
└── hooks/           # Custom hooks

supabase/
├── functions/       # Edge Functions (mcp-quran, mcp-worship, etc.)
└── migrations/      # Database migrations

.agent/
├── PROJECT_STATUS.md              # Current project phase
├── context/CURRENT_TASK.md        # Active work
├── context/PROTECTED_FILES.md     # Don't delete these
├── context/HANDOFF_LOG.md         # Session notes
└── protocols/                     # Response templates
```

---

## Agent Workflows

| Command             | Purpose                   |
| ------------------- | ------------------------- |
| `/agent-quran`      | Quran API operations      |
| `/agent-worship`    | Prayer times, Qibla       |
| `/agent-compliance` | Fatwa, Halal checks       |
| `/agent-education`  | Hadith, Tafsir            |
| `/agent-zakat`      | Zakat calculations        |
| `/agent-asr`        | Speech recognition        |
| `/plan-mvp`         | Structured MVP planning   |

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

### Full Protocol

See `.agent/protocols/comprehensive-response-protocol.md`

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

Example: `[AGENT:Gemini] feat(quran): Add semantic search`

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

| File                               | Purpose                  |
| ---------------------------------- | ------------------------ |
| `AGENTS.md`                        | This file - main context |
| `GEMINI.md`                        | Extended project context |
| `.agent/PROJECT_STATUS.md`         | Current phase & health   |
| `.agent/context/CURRENT_TASK.md`   | Active work items        |
| `.agent/context/PROTECTED_FILES.md`| Files to never delete    |
| `.agent/context/HANDOFF_LOG.md`    | Session handoff notes    |

---

*Following the [agents.md](https://agents.md/) open standard used by 60k+ projects.*

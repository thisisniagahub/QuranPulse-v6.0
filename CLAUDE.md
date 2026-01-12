# CLAUDE.md - QuranPulse v6.0

> Persistent context for Claude Code
> Last Updated: 2026-01-12

## Project Overview

**QuranPulse v6.0 ("Noor-e-Cyber")** - Futuristic Islamic PWA with Ustaz AI, Iqra Digital, and Pulse Command Center.

| Field | Value                            |
| ----- | -------------------------------- |
| Phase | PRODUCTION                       |
| URL   | https://quranpulse.my            |
| Stack | React 18 + TypeScript + Supabase |

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 5173)
npm run build        # Production build
npm test             # Run Jest tests
npx tsc --noEmit     # TypeScript check (ALWAYS run before done!)
npm run lint         # ESLint check
```

## Code Style Guidelines

- TypeScript strict mode
- Functional components with hooks
- Tailwind CSS for styling (Glassmorphism + Neon)
- Framer Motion for animations
- Zustand for global state
- React Query for server state

## Repository Etiquette

Commit format: `[AGENT:Claude] type: description`

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `deploy`

## Core Files

| File                             | Purpose        |
| -------------------------------- | -------------- |
| `AGENTS.md`                      | Main AI context|
| `.agent/PROJECT_STATUS.md`       | Current phase  |
| `.agent/context/CURRENT_TASK.md` | Active work    |
| `.agent/context/PROTECTED_FILES.md` | Don't delete|

## Verification (MANDATORY!)

Before saying "done":

1. `npx tsc --noEmit` → ZERO errors
2. `npm run build` → Success
3. Include verification results

## Warnings

⛔ NEVER:

- Delete files without checking PROTECTED_FILES.md
- Say "done" without running verification
- Modify .env files
- Skip testing

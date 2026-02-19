---
description: The ultimate vibe coding workflow — idea to design to code to ship in one flow. Use when building anything from scratch or adding major features.
---

# /vibe — Vibe Coding Pipeline ⚡

// turbo-all

The master workflow. Idea → Design → Code → Ship.

## Prerequisites
- User has described what they want to build
- Read `proactive-agent` skill for smart defaults

## Workflow Steps

### Step 1: Understand the Vibe
Capture user intent in 3 dimensions:
- **WHAT** — Feature/product description
- **WHO** — Target users
- **VIBE** — Aesthetic/feeling (dark mode? playful? corporate? cyber?)

If user is vague, use proactive defaults. DON'T ASK — SUGGEST.

### Step 2: Auto-Select Stack
Apply smart defaults based on project type:

```
Web App       → Next.js 15 + Tailwind + Shadcn
PWA           → Vite + React + Workbox
Landing Page  → Next.js + Framer Motion
API Only      → Fastify/Hono + Prisma
Mobile        → React Native / Expo
Full-Stack    → Next.js + Prisma + Supabase
```

If existing project detected, inherit its stack. Check `package.json`.

### Step 3: Design First
Generate visual design BEFORE coding:

```
Option A: Use Stitch MCP
→ mcp_stitch_create_project → mcp_stitch_generate_screen_from_text

Option B: Use Shadcn MCP
→ mcp_shadcn-ui_list-components → pick components → install

Option C: Use generate_image tool
→ Generate UI mockup → get user approval → implement
```

Present design to user for approval before proceeding.

### Step 4: Scaffold Project
If new project:
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --use-npm
# OR
npx -y create-vite@latest ./ --template react-ts
```

If existing project, skip to Step 5.

### Step 5: Implement Core Logic
Build features in this order:
1. **Data layer** — Types, schemas, API routes
2. **UI components** — Using design from Step 3
3. **Business logic** — Hooks, services, state
4. **Polish** — Animations, loading states, error handling

Use `leo-orchestrator` pattern for complex implementations:
- Create `task.md` with checklist
- Track progress per component
- Verify each step before moving on

### Step 6: Quality Check
Run automatically before shipping:
```bash
npm run build          # Build check
npm run lint           # Lint check
npx tsc --noEmit      # Type check
```

Auto-fix any errors found.

### Step 7: Chain to /ship
When code is ready, auto-chain to `/ship` workflow:
→ Git commit → Push → Deploy → Verify

## Example Trigger
```
User: "buat landing page gempak untuk SaaS AI tool"
Agent: [auto-selects Next.js + Shadcn] → [generates design] → [implements] → [ships]
```

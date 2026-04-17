# Project Improvement Research

## Scope

This research is based on the current repository state on April 15, 2026.

Reviewed inputs:

- root `package.json`
- `README.md`
- `DESIGN.md`
- feature-module layout under `src/modules/`
- `apps/admin-dashboard/package.json`
- current test file footprint
- previously identified security and authorization review findings

## Current Snapshot

The project already has strong product ambition and a clearer repository shape than before:

- the main QuranPulse app is a Vite + React + TypeScript PWA at the repository root
- the admin dashboard is now isolated under `apps/admin-dashboard/`
- content and knowledge bundles now live under `packages/`
- documentation is much more structured under `docs/`
- there is already a non-trivial automated test base in the main app

At the same time, the next wave of improvement is less about adding more folders and more about strengthening trust boundaries, consistency, delivery workflow, and product reliability.

## Research Findings

### 1. Security and trust boundaries should become the top engineering priority

This is the highest-ROI improvement area.

Why:

- the main app still contains browser-side trust decisions for admin and AI access
- earlier review findings showed exposed AI bearer-token usage and weak admin authorization patterns
- moderation audit data can still become untrustworthy if identity is accepted from the caller instead of the authenticated actor

Recommended direction:

- move all privileged AI and admin actions behind server-side endpoints or server actions
- make the database role model the single source of truth for authorization
- remove browser-visible secrets and browser-defined admin allowlists
- make audit fields derive from authenticated server identity only

Expected outcome:

- lower security risk
- cleaner architecture
- easier future compliance and admin expansion

### 2. Finish the monorepo move properly with real workspace tooling

The repo now looks like a monorepo, but it is not operating like one yet.

Evidence:

- root `package.json` delegates to `apps/admin-dashboard`, but no npm workspace configuration exists yet
- the main app and admin app have separate tooling stacks and different framework versions
- the root app uses Tailwind v4 while the admin dashboard still uses Tailwind v3

Recommended direction:

- add npm workspaces at the root for `apps/*` and `packages/*`
- centralize shared TypeScript, ESLint, and testing defaults
- create shared packages for reusable domain code such as auth rules, role constants, API schemas, and UI tokens where appropriate
- plan a later optional move of the main web app into `apps/web/` only after the workspace foundation is stable

Expected outcome:

- simpler installs and scripts
- less config drift
- lower long-term maintenance cost

### 3. Unify backend and data-access strategy

The project currently spans:

- Supabase
- root server helpers
- Next admin dashboard server logic
- Prisma inside the admin dashboard

That gives flexibility, but it also risks overlapping responsibilities.

Recommended direction:

- define one primary pattern for privileged data mutations
- decide clearly where Prisma belongs and where Supabase should stay the source of truth
- introduce a thin service layer for core domains such as users, moderation, iqra-progress, subscriptions, and AI requests
- keep frontend modules from talking directly to sensitive infrastructure

Expected outcome:

- fewer authorization edge cases
- easier testing
- less duplication between apps

### 4. Expand tests where business risk is highest

The test baseline is better than average already, but coverage is uneven.

Observed:

- the root app has unit, integration, and Playwright coverage
- the admin dashboard currently appears to have very light automated coverage
- security-sensitive flows are not obviously represented by dedicated contract tests

Recommended direction:

- add admin dashboard tests for role-gating, moderation actions, and auth redirects
- add contract tests for Supabase policies and role transitions
- add service tests for AI orchestration boundaries and ASR callbacks
- define a small smoke suite that covers login, iqra learning flow, quran reading, and admin moderation

Expected outcome:

- fewer regressions in high-value flows
- safer refactors
- faster confidence during deploys

### 5. Improve observability and operational feedback loops

The repo already uses Sentry in the main app, but the next step is to make debugging and product insight systematic.

Recommended direction:

- standardize structured logging across the main app, admin app, and server-side actions
- send moderation, AI, and ASR failures to one observable channel
- define key product metrics such as lesson completion, ASR retry rate, AI fallback rate, and session drop-off
- add health checks and deployment smoke checks for frontend, API, and operator services

Expected outcome:

- faster incident diagnosis
- better product decisions
- clearer production confidence

### 6. Treat Iqra and content pipelines like a product platform

The repo now has a meaningful `packages/` layout for content. That opens the door to better content governance.

Recommended direction:

- version content packages explicitly
- separate raw source content from generated runtime content
- add validation scripts for iqra lesson structure, pronunciation metadata, and JSON schema integrity
- create one documented pipeline from source material to runtime assets

Expected outcome:

- safer content updates
- less manual drift
- easier scaling for future books or learning tracks

### 7. Reduce documentation drift

Documentation quality improved a lot after the restructuring, but there are still signs of drift.

Example:

- `README.md` still contains at least one older `docs/VPS_PRD.md` style path in the architecture section, while the canonical path now lives under `docs/operations/`

Recommended direction:

- define one docs quality check for moved links and outdated paths
- keep active docs outside `docs/vault/`
- introduce short ADRs for major engineering decisions such as AI gateway, admin auth, and data ownership

Expected outcome:

- faster onboarding
- less confusion for agents and humans
- better long-term maintainability

## Highest-Value Improvement Backlog

If the goal is maximum impact with minimum waste, the best backlog order is:

1. Move AI token usage and admin mutations to server-side trust boundaries.
2. Normalize role handling and remove hardcoded or browser-defined admin logic.
3. Add npm workspaces and shared repository-level tooling.
4. Standardize the backend mutation path across Supabase, Prisma, and server actions.
5. Build a focused admin/security smoke-test suite.
6. Create structured observability for AI, ASR, and moderation flows.
7. Add validation pipelines for `packages/iqra-content/` and `packages/reference-content/`.
8. Fix documentation drift and create ADR-style design decisions for the sensitive subsystems.

## Suggested 4-Phase Roadmap

### Phase 1: Secure the foundation

Target: 1 to 2 weeks

- remove browser-exposed secrets
- move privileged actions server-side
- unify role values and admin authorization rules
- fix audit identity handling
- fix the ASR transcription callback bug

### Phase 2: Stabilize the engineering system

Target: 2 to 4 weeks

- add npm workspaces
- centralize lint and TypeScript baselines
- align package conventions between the root app and admin app
- add admin dashboard automated tests

### Phase 3: Product platform maturity

Target: 4 to 8 weeks

- introduce content validation pipelines
- add shared domain packages for auth, roles, schemas, and reusable business rules
- define a clearer backend service boundary
- instrument analytics and reliability metrics

### Phase 4: Premium product polish

Target: 8 to 12 weeks

- strengthen offline and PWA experience
- improve UX feedback loops for Iqra, ASR, and Smart Deen
- introduce release checklists and deployment smoke automation
- prepare the optional `apps/web/` migration only if the workspace model is already stable

## Recommended Next Step

The single best next move is not another structural rename.

The best next move is a focused engineering sprint with this order:

1. security hardening
2. workspace/tooling completion
3. admin and trust-boundary tests

That sequence gives the project more safety, more speed, and a much stronger base for every future feature.

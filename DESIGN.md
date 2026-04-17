# Repository Design

## Goal

This repository is organized as a production-grade QuranPulse workspace with:

- a primary web app at the root
- standalone subprojects under `apps/`
- internal data and content bundles under `packages/`
- curated documentation under `docs/`
- generated outputs under `artifacts/`

## Canonical Structure

```text
.
├── apps/
│   ├── admin-dashboard/
│   └── niagahub-superapp/
├── artifacts/
│   ├── audio/
│   ├── downloads/
│   ├── generated/
│   ├── logs/
│   ├── playwright-report/
│   └── test-results/
├── docs/
│   ├── architecture/
│   ├── governance/
│   ├── integrations/
│   ├── iqra/
│   ├── notes/
│   ├── operations/
│   ├── product/
│   ├── prompts/
│   ├── references/
│   ├── research/
│   ├── status/
│   └── vault/
├── packages/
│   ├── iqra-content/
│   ├── iqra-hub/
│   ├── reference-content/
│   └── umrah-content/
├── public/
├── scripts/
├── server/
├── src/
├── supabase/
├── AGENTS.md
├── CHANGELOG.md
├── CLAUDE.md
├── DESIGN.md
├── GEMINI.md
├── README.md
└── package.json
```

## Design Decisions

### Root app stays at the repository root

The main Vite application still lives at the root in this iteration. That is intentional.

Moving it to `apps/web/` would require a larger migration touching:

- Vite and TypeScript base paths
- deployment assumptions
- Supabase and tooling scripts
- agent and onboarding conventions

This refactor focuses on high-signal structural cleanup without breaking the main delivery path.

### `apps/` is for standalone products

A folder belongs in `apps/` when it has its own runtime, deployment, or product boundary.

Examples:

- `apps/admin-dashboard/`
- `apps/niagahub-superapp/`

### `packages/` is for reusable internal bundles

A folder belongs in `packages/` when it acts like a reusable content or domain bundle, even if it is not an npm package yet.

Examples:

- `packages/iqra-content/`
- `packages/iqra-hub/`
- `packages/reference-content/`
- `packages/umrah-content/`

### `docs/vault/` is archival, not day-to-day docs

`docs/vault/` keeps historically valuable material, audits, reports, and older planning documents. New active documentation should prefer the curated `docs/*` sections outside the vault.

## Naming Rules

- Use lowercase kebab-case for repository folders where practical.
- Keep React components in PascalCase.
- Keep Markdown files descriptive and stable.
- Keep generated output out of the repository root.
- Treat old all-caps or mixed-case folder names as legacy and migrate them when safe.

## Placement Rules

Put files in:

- `apps/` for standalone applications
- `packages/` for reusable internal content or domain bundles
- `docs/` for active documentation
- `docs/vault/` for historical or archival documentation
- `artifacts/` for generated outputs, logs, and reports
- `scripts/` for operational, maintenance, and experimental scripts

Keep in the root only:

- top-level project metadata
- agent entry documents
- core build configuration
- the current main web app until a dedicated `apps/web` migration is approved

## Follow-up Option

If we want a full monorepo finish later, the next deliberate step is:

1. move the main Vite app into `apps/web/`
2. convert the repository into an npm workspace root
3. split shared runtime code into code-first packages under `packages/`

## UI Consistency Rules

### Canonical brand direction

The canonical product look for QuranPulse is `Raudhah`.

That means:

- warm ivory and cream surfaces instead of generic white-on-purple or cyber defaults
- deep teal as the main product anchor
- restrained gold as the premium accent
- high-legibility charcoal ink for reading surfaces
- motion that feels calm and intentional rather than neon or arcade-like by default

### Assistant and infrastructure naming

Use one naming layer per concept:

- `Ustaz AI` is the user-facing assistant identity
- `OpenClaw` is the infrastructure and connectivity layer behind cross-channel AI delivery

Avoid mixing these labels interchangeably in the same surface. In user-facing copy:

- say `Ustaz AI` when describing guidance, answers, or tutoring
- say `OpenClaw` when describing status, connectivity, orchestration, or channel delivery

Avoid drift such as:

- `AI Gateway`
- `Omnichannel Intelligence`
- `Ustazah AI`

unless a feature has an explicit product decision that overrides this rule.

### Design system ownership

The repository should converge on one shadcn-compatible source of truth per app:

- root app: `components.json` + `src/components/ui/*`
- admin dashboard: `apps/admin-dashboard/components.json` + `apps/admin-dashboard/src/components/ui/*`

Hand-rolled components are allowed, but they should follow the same token, spacing, motion, and focus rules as the app's canonical UI primitives.

### Theme boundaries

The main app, Iqra surfaces, and landing pages should stay inside the Raudhah language unless there is a strong product reason to diverge.

The admin dashboard may be darker and more operational, but it should still feel like `Raudhah Mission Control`, not a different product family.

### Motion and focus policy

Use motion deliberately:

- prefer targeted transitions over `transition-all`
- use short easing for controls and slightly longer motion only for storytelling sections
- preserve obvious keyboard focus states on all interactive controls
- do not remove outlines unless an accessible replacement ring is present

### Review bar

A UI change should be considered consistent only if it satisfies all of the following:

- fits the Raudhah palette and typography rules for its app surface
- uses the correct identity layer: `Ustaz AI` vs `OpenClaw`
- reuses or aligns with the app's shared UI primitives
- preserves visible focus states and restrained motion
- does not introduce a second conflicting visual language

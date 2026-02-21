# Changelog

All notable changes to QuranPulse v6.0 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2026-02-21]

### Fixed - Landing Page Review Audit (10 Issues)
- [AGENT:Antigravity] **Spacing Standardization** — Normalized `py-32` → `py-12 md:py-16` in FeatureShowcase, OpenClawShowcase, PricingTable
- [AGENT:Antigravity] **Particle Flicker** — Fixed `Math.random()` re-render in HeroSection with `useMemo` deterministic positions
- [AGENT:Antigravity] **Particle Count** — Reduced 40 → 20 animated particles for mobile performance
- [AGENT:Antigravity] **Section IDs** — Added `id` attributes to all 13 landing page sections for deep-linking & accessibility
- [AGENT:Antigravity] **Accessibility** — Added `aria-label` to FeatureShowcase audio button
- [AGENT:Antigravity] **Mobile Menu UX** — Added click-outside-to-close + Escape key handler
- [AGENT:Antigravity] **External Dependencies** — Replaced 6 pravatar.cc URLs with local SVG initials avatars
- [AGENT:Antigravity] **Competitor Comparison** — Rewrote ComparisonSection with honest nuanced labels + disclaimer
- [AGENT:Antigravity] **Export Standardization** — Added `export default` to OpenClawShowcase, removed `.then()` wrappers from 3 lazy imports

### Deployment
- ✅ Build: 0 TypeScript errors (`tsc --noEmit`)
- ✅ Vercel: Deployed via `vercel --prod` CLI to [quranpulse.my](https://quranpulse.my)
- Commits: `2a5caff` (fixes) + `355e1fd` (refactor exports)

---

## [2026-02-19]

### Fixed - Landing Page Premium Polish (RM2M Standard)
- [AGENT:Antigravity] **Hero Text Overflow** — Reduced font size, switched `SplitText` from `chars` to `words`, added `break-words`
- [AGENT:Antigravity] **Navbar Navigation** — Fixed broken scroll targets, added `id="home"` to Hero, renamed "Ebhat" → "Tentang"
- [AGENT:Antigravity] **Duplicate HTML IDs** — Resolved `#features` and `#pricing` ID conflicts across sections

### Added - Premium Components
- [AGENT:Antigravity] **PremiumTestimonials.tsx** — 3D card-based testimonials (6 total), Raudhah theme, SplitText integration
- [AGENT:Antigravity] **GlowFooter.tsx** — Themed footer with newsletter signup and social links
- [AGENT:Antigravity] **Scroll Progress Bar** — Gradient progress indicator at top (4px height)
- [AGENT:Antigravity] **Lazy Loading** — `React.lazy` + `Suspense` for heavy sections (OpenClaw, QWER, Testimonials, Footer)

### Changed - UX & Architecture
- [AGENT:Antigravity] Section consolidation from 4 → 2 core feature sections (scroll fatigue reduction)
- [AGENT:Antigravity] Dark section backgrounds for `AIAgentShowcase` and `QwerDemoSection`
- [AGENT:Antigravity] Semantic HTML with `<main>` landmark and unique section IDs
- [AGENT:Antigravity] Consistent CTA copy ("Mula Sekarang") across all sections

### Removed
- [AGENT:Antigravity] `ParticlesBackground` component and 12 unused Lucide icons from `LandingPage.tsx`

### Deployment
- ✅ Build: 0 errors, PWA v1.2.0 (111 precache entries)
- ✅ Vercel: Auto-deploy from `main` branch confirmed LIVE at quranpulse.my
- ✅ Security headers: CSP, X-Frame-Options, Referrer-Policy in `vercel.json`

---

## [2026-02-18]

### Added - AI Feature Integration
- [AGENT:Antigravity] **AI Tadabbur Mode** — Guided reflection after Quran reading with AI-generated questions
- [AGENT:Antigravity] **Ustaz AI Emotional Intelligence** — Sentiment-aware responses with empathetic tone adaptation
- [AGENT:Antigravity] **Quran Progress Tracking Service** — Backend service for reading milestones and streaks
- [AGENT:Antigravity] **Leaderboard Demo Data** — Seeded realistic demo data simulating 50+ users

### Changed - Landing Page Push
- [AGENT:Antigravity] Pushed updated landing page components to GitHub via MCP tool
- [AGENT:Antigravity] Updated landing page with Raudhah theme adaptation and premium animations

---

## [2026-02-10]

### Fixed - VPS Infrastructure
- [AGENT:Antigravity] **OpenClaw Port Conflict Resolved**
  - Masked conflicting system service at `/etc/systemd/system/openclaw-gateway.service`
  - Root user service confirmed as sole listener on port 18789
  - Enabled `loginctl enable-linger root` for service persistence

### Changed - Documentation Alignment
- [AGENT:Antigravity] **Full documentation sync with live VPS state**
  - Rewrote `VPS_STATUS.md` — corrected OpenClaw runtime, added Tailscale/Qdrant/cron
  - Updated `VPS_PRD.md` — root user systemd, Tailscale binding, SSH security warnings
  - Rewrote `OPENCLAW_GUIDE.md` — bot identity, linger, dual-service conflict, expanded troubleshooting
  - Updated `AGENTS.md`, `GEMINI.md` — corrected infra table and model config
  - Updated `README.md` — architecture section aligned
  - Updated `PROJECT_STATUS.md` — added security findings
  - Updated `ARCHITECTURE.md` — added VPS infrastructure section
  - Corrected AI model: `gemini-3-flash` (actual) vs `gemini-3-pro` (target)
  - Added fail2ban (active), Qdrant (running), Tailscale (active) to docs
  - Flagged SSH security gap: `PermitRootLogin yes` still active

### Removed
- [AGENT:Antigravity] Deleted obsolete `CONDUKTOR_STATUS.md`, `CONDUCTOR_CHAT.md`, `CONDUCTOR_LIVE.md`

---

## [2026-02-08]

### Fixed - Loading & Build Issues
- [AGENT:Gemini] **TypeScript Errors in Test Files**
  - Fixed `RenderOptions` import error in `src/test/test-utils.tsx`
  - Fixed incorrect import path in `src/components/ui/Button.test.tsx`
  
- [AGENT:Gemini] **CSS Import Order**
  - Reordered `@import` statements in `src/index.css`
  - `@import "tailwindcss"` must be first for Tailwind v4

- [AGENT:Gemini] **CORS Issues with Supabase Edge Functions**
  - Removed custom headers (`x-app-name`, `x-app-version`) from `src/lib/supabase.ts`
  - These caused CORS blocks on Edge Function requests

### Added - Testing & Performance Utilities
- [AGENT:Gemini] **Performance Hooks** (`src/hooks/usePerformance.ts`)
  - `useDebounce`, `useThrottle`, `useIntersectionObserver`
  - `usePrefersReducedMotion`, `useLocalStorage`

- [AGENT:Gemini] **Animation Library** (`src/lib/animations.ts`)
  - 20+ Framer Motion variants (fade, slide, stagger, modal, glow)
  - Noor-e-Cyber themed effects

- [AGENT:Gemini] **Testing Infrastructure** (`src/test/`)
  - Custom render function with providers
  - Mock utilities for IntersectionObserver, matchMedia, localStorage
  - Sample component and hook tests

- [AGENT:Gemini] **LazyImage Component** (`src/components/ui/LazyImage.tsx`)
  - Intersection Observer based lazy loading
  - Loading shimmer effect

### Verified
- Build: ✅ Pass (6655 modules, 5m 44s)
- PWA: ✅ 147 precache entries

---

## [Unreleased]

### Added
- AI Agent Orchestration Framework
  - `AGENTS.md` - Universal context file for all AI agents
  - `.agent/context/CURRENT_TASK.md` - Active task tracking
  - `.agent/context/PROTECTED_FILES.md` - Anti-deletion safeguard
  - `.agent/context/HANDOFF_LOG.md` - Agent transition history

### Documentation
- `DOCS_VAULT/DEEP_DIVE_AUDIT.md` - Comprehensive code audit report
- `DOCS_VAULT/ARCHITECTURE_DIAGRAM.md` - 8 Mermaid architecture diagrams

---

## [2026-01-11]

### Added - Quran Module Major Upgrade
- [AGENT:Gemini] **Tier 1 Quick Wins**
  - Semantic Search with pgvector (`features/search/`)
  - Daily Ayat Widget with 7 themed verses
  - Khatam Progress Tracker with confetti celebrations

- [AGENT:Gemini] **Tier 2 Medium Features**
  - Tadabbur AI Mode - Reflection questions + AI follow-up
  - Voice-Active Reader - ASR auto-scroll + word highlighting
  - Word Root Explorer - Arabic etymology + derivatives

- [AGENT:Gemini] **Tier 3 Advanced Features**
  - Digital Mushaf View - Noor-e-Cyber themed 604-page layout
  - Iqra Graduation Ceremony - Digital certificate + reading plan
  - Smart Deen Crossover - Floating AI button + context prompts

### Documentation
- `DOCS_VAULT/01_FEATURES_IMPLEMENTED/QURAN_MODULE.md` - Full module docs

### Database
- Added `verse_embeddings` table for semantic search
- Added 4 PDF content tables for knowledge base
- Created `search_verses_semantic()` RPC function

### Verified
- Build: ✅ Pass (1m 19s)
- Tests: ✅ 82/82 Pass (26.38s)
- Commits: 6 feature commits pushed to main

---

## [2026-01-08]

### Added
- [AGENT:Gemini] Deep dive code audit system
- [AGENT:Gemini] Architecture diagrams with Mermaid
- [AGENT:Gemini] AI Agent Orchestration Framework

### Verified
- Build status: 6313 modules transformed
- All imports/exports: Working correctly
- Exit code: 0 (success)

---

## [2026-01-06]

### Fixed
- [AGENT:Gemini] Jest test configuration for indexedDB mocking
- [AGENT:Gemini] Tagline assertion updates in tests

### Added
- Static content seeding to Supabase
- Integration with staticContentService

---

## [2026-01-05]

### Fixed
- Jest worker memory limits
- Test file import organization
- TypeScript errors in components

---

## [2026-01-04]

### Fixed
- Build errors in QuranVerseCard.tsx
- mcpService import resolution
- Bot server TypeScript definitions

---

## Commit Convention

```
[AGENT:Name] type: description

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code restructuring
- test: Adding tests
- docs: Documentation
- chore: Maintenance
```

---

**[End of Changelog]**

# QuranPulse Modular Monolith Structure (Next.js 15 App Router)

This structure is designed for the **Next.js 15** architecture, following the Modular Monolith pattern to separate concerns while maintaining a unified codebase.

## 📂 Root Directory

```text
quranpulse/
├── public/                     # [P0] Static assets
│   ├── images/                 # Logos, marketing banners, OG images
│   ├── fonts/                  # Custom fonts (Uthmani, Kufi)
│   ├── audio/                  # [P1] Fallback audio files (Bismillah)
│   └── data/                   # [P2] Static JSON (Surah names, geometric patterns)
│
├── src/                        # [P0] Source Code
│   ├── app/                    # [P0] Next.js 15 App Router (Routing Layer)
│   │   ├── layout.tsx          # Root layout (Providers, Fonts, Metadata)
│   │   ├── page.tsx            # Landing Page
│   │   ├── globals.css         # Global Styles
│   │   │
│   │   ├── (auth)/             # [P0] Auth Routes Group (Clean URL)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (main)/             # [P0] Main Application Layout
│   │   │   ├── layout.tsx      # Main Shell (Navbar, Sidebar)
│   │   │   ├── quran/          # Quran Reader Routes
│   │   │   │   ├── page.tsx    # Surah List
│   │   │   │   └── [chapter]/page.tsx
│   │   │   ├── iqra/           # Iqra Module Routes
│   │   │   └── settings/       # Global Settings
│   │   │
│   │   └── (dashboard)/        # [P1] Admin/Analytics Dashboard
│   │       ├── layout.tsx      # Admin Shell
│   │       └── overview/page.tsx
│   │
│   ├── modules/                # [P0] Feature Modules (The Core Logic)
│   │   │
│   │   ├── quran/              # [P0] Quran Module
│   │   │   ├── components/     # UI: VerseCard, AudioPlayer, MushafView
│   │   │   ├── hooks/          # Logic: useQuranAudio, useVerseSelect
│   │   │   ├── services/       # Data: fetchVerses, fetchTafsir
│   │   │   ├── types/          # Types: Verse, Chapter, Tafsir
│   │   │   └── utils/          # Utils: TajwidParser, VerseFormatter
│   │   │
│   │   ├── iqra/               # [P1] Iqra Digital Module
│   │   │   ├── components/     # UI: VisionCamera, VoiceVisualizer, DigitalBook
│   │   │   ├── hooks/          # Logic: useSpeechRecognition, useAR
│   │   │   └── game-engine/    # Logic: XP, Streaks, Levels
│   │   │
│   │   ├── ai-studio/          # [P1] "Ustaz AI" Intelligence Module
│   │   │   ├── components/     # UI: ChatWidget, ContextAwarePrompt
│   │   │   └── services/       # Logic: GeminiClient, PromptEngineering
│   │   │
│   │   ├── auth/               # [P0] User & Profile Module
│   │   │   ├── components/     # UI: AuthForms, ProfileCard
│   │   │   └── store/          # Logic: UserSession Store
│   │   │
│   │   └── common/             # [P0] Shared Features
│   │       ├── payment/        # Payment Logic
│   │       └── gamification/   # Global XP/Badge Logic
│   │
│   ├── components/             # [P0] Shared Design System
│   │   ├── ui/                 # [P0] Shadcn/Radix Primitives (Button, Dialog)
│   │   ├── layout/             # [P0] Navbar, Sidebar, Footer, MegaMenu
│   │   └── animation/          # [P1] Framer Motion Wrappers (FadeIn, SlideUp)
│   │
│   ├── services/               # [P0] Core Infra Services
│   │   ├── supabase/           # Supabase Client & Middleware
│   │   ├── analytics/          # PostHog / Google Analytics
│   │   └── cache/              # React Query Client Configuration
│   │
│   ├── lib/                    # [P0] Utilities & Config
│   │   ├── utils.ts            # Tailwind Class Merger (cn)
│   │   ├── constants.ts        # App Config (API Keys, Limits)
│   │   └── fonts.ts            # Font Loaders (Next/Font)
│   │
│   └── styles/                 # [P0] Global Styling
│       └── themes/             # CSS Variables for Themes (Noor, Deep Space)
│
├── supabase/                   # [P0] Backend Infrastructure
│   ├── migrations/             # SQL Schema Migrations (Versioning)
│   └── functions/              # Edge Functions (Deno/Node)
│       └── chat-proxy/         # [P0] Secure AI Proxy
│
├── tests/                      # [P2] Quality Assurance
│   ├── e2e/                    # Playwright Flows (Login -> Read -> Audio)
│   └── unit/                   # Jest/Vitest for Utilities
│
└── config files...             # [P0] (tailwind.config, next.config, etc.)
```

## 📝 Folder Guidelines

### `app/` (Next.js Router)
*   **What goes here:** Only routing logic, page wrappers, layouts, and loading states.
*   **What NOT goes here:** Complex business logic, heavy UI components, pure helper functions.
*   **Dependencies:** Imports from `modules/` and `components/`.

### `modules/` (Feature Modules)
*   **What goes here:** All domain-specific code. Each folder should be self-contained.
*   **Encapsulation:** "Quran" code should not import "Iqra" code deeply; use shared interfaces or `programs/` if needed.
*   **Structure:** Every module has `components`, `hooks`, `services` (Standardized).

### `components/` (Shared)
*   **What goes here:** Reusable UI elements that are agnostic to the feature (Button, Card, Modal).
*   **What NOT goes here:** Components that fetch their own data or contain specific business logic (e.g., `QuranVerseCard` belongs in `modules/quran`, but a generic `Card` belongs here).

### `services/` (Core)
*   **What goes here:** Singletons and Clients (Supabase, Analytics, Logger). Features that cut across all modules.

### `supabase/` (Backend)
*   **Purpose:** Houses the "Serverless Backend". All DB schema changes must go into `migrations` to be reproducible.

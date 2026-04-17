# 🏗️ QuranPulse v6.0 - Architecture Diagrams

> **Generated:** 2026-01-08
> **Based on:** Full project file structure analysis

---

## 1️⃣ High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client["🌐 Client Layer"]
        PWA["📱 React PWA<br/>Vite + TypeScript"]
        Admin["🛡️ Admin Dashboard<br/>Next.js 15"]
    end

    subgraph Core["🎯 Core Modules"]
        Landing["🚀 Landing"]
        Auth["🔐 Auth"]
        Dashboard["📊 Dashboard"]
        Quran["📖 Quran"]
        Iqra["📚 Iqra Digital"]
        SmartDeen["🤖 Smart Deen<br/>Ustaz AI"]
        Ibadah["🕌 Ibadah"]
    end

    subgraph Extended["📦 Extended Modules"]
        Profile["👤 Profile"]
        Media["🎬 Media Studio"]
        Social["👥 Social"]
        Barakah["💰 Barakah/Infaq"]
        Souq["🛒 Souq"]
        Umrah["🕋 Umrah"]
        Legal["📜 Legal"]
    end

    subgraph Services["⚙️ Service Layer"]
        AI["🧠 AI Services<br/>aiService, UstazOrchestrator"]
        Data["📊 Data Services<br/>quranService, iqraService"]
        Backend["🔌 Backend Services<br/>supabase, apiClient"]
        Bots["🤖 Bot Services<br/>telegram, whatsapp"]
    end

    subgraph External["☁️ External APIs"]
        Supabase["🗄️ Supabase<br/>PostgreSQL + Auth"]
        Gemini["✨ Gemini AI"]
        JAKIM["🏛️ JAKIM API"]
        Payment["💳 ToyyibPay"]
    end

    PWA --> Core
    PWA --> Extended
    Admin --> Services
    Core --> Services
    Extended --> Services
    Services --> External
```

---

## 2️⃣ Module Dependency Map

```mermaid
flowchart LR
    subgraph Entry["📍 Entry Points"]
        App["App.tsx"]
        Index["index.tsx"]
    end

    subgraph Modules["📦 15 Modules"]
        direction TB
        M1["landing"]
        M2["auth"]
        M3["dashboard"]
        M4["quran"]
        M5["iqra"]
        M6["smart-deen"]
        M7["ibadah"]
        M8["profile"]
        M9["media"]
        M10["social"]
        M11["barakah"]
        M12["souq"]
        M13["umrah"]
        M14["admin"]
        M15["legal"]
    end

    subgraph Components["🧩 Shared Components"]
        Layout["Layout.tsx"]
        BottomNav["BottomNav.tsx"]
        ErrorBoundary["ErrorBoundary.tsx"]
        UI["ui/"]
    end

    App --> Layout
    Layout --> BottomNav
    Layout --> Modules
    App --> ErrorBoundary
    Modules --> Components
```

---

## 3️⃣ Services Architecture

```mermaid
flowchart TB
    subgraph AI["🧠 AI Layer - 4 Services"]
        aiService["aiService.ts<br/>22KB"]
        Orchestrator["UstazOrchestrator.ts<br/>15KB"]
        tts["ttsService.ts"]
        asr["asrService.ts"]

        aiService --> Orchestrator
        Orchestrator --> tts
        Orchestrator --> asr
    end

    subgraph Core["📊 Core Data - 8 Services"]
        quran["quranService.ts<br/>19KB"]
        iqra["iqraService.ts"]
        prayer["prayerService.ts"]
        bookmark["bookmarkService.ts"]
        progress["readingProgressService.ts"]
        settings["settingsService.ts"]
        static["staticContentService.ts"]
        geo["geolocationService.ts"]
    end

    subgraph Bot["🤖 Bot Layer - 4 Services"]
        telegram["telegramService.ts<br/>21KB"]
        whatsapp["whatsappService.ts"]
        whatsappCRM["whatsappCRM.ts"]
        botServer["bot-server.ts"]

        botServer --> telegram
        botServer --> whatsapp
    end

    subgraph Backend["🔌 Backend - 5 Services"]
        apiClient["apiClient.ts"]
        admin["adminService.ts"]
        user["userService.ts"]
        payment["paymentService.ts"]
        analytics["analyticsService.ts"]
    end

    subgraph Specialized["🎯 Specialized - 5 Services"]
        voice["voiceFingerprint.ts"]
        spaced["spacedRepetition.ts"]
        zakat["zakatService.ts"]
        jakim["jakimService.ts"]
        mcp["mcpService.ts"]
    end

    AI --> Backend
    Core --> Backend
    Bot --> AI
```

---

## 4️⃣ Iqra Module Detail (Most Complex)

```mermaid
flowchart TB
    subgraph IqraModule["📚 Iqra Module - 17 Files"]
        direction TB

        subgraph Main["Main Components"]
            Hub["IqraHub.tsx<br/>18KB - Entry"]
            Reader["IqraDigitalReader.tsx<br/>15KB"]
            Coach["IqraInteractiveCoach.tsx<br/>38KB"]
            Voice["IqraVoiceCoach.tsx"]
            Vision["IqraVisionCoach.tsx"]
        end

        subgraph Support["Supporting"]
            Auth["IqraAuthenticReader.tsx"]
            PDF["IqraPdfReader.tsx"]
            Analytics["IqraAnalytics.tsx"]
            Tutorials["IqraTutorials.tsx"]
            Vocab["VocabBuilder.tsx"]
            Book["IqraBookSelector.tsx"]
        end

        subgraph Data["Data Layer"]
            Store["store/"]
            Hooks["hooks/"]
            DataDir["data/"]
            JSON["extracted_BUKU_IQRA1_structured.json"]
        end

        subgraph Subdirs["Sub-modules"]
            Game["game/"]
            Kafa["kafa/"]
            Comps["components/"]
            Tests["__tests__/"]
        end
    end

    Hub --> Reader
    Hub --> Coach
    Coach --> Voice
    Coach --> Vision
    Reader --> Data
    Coach --> Data
```

---

## 5️⃣ Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant C as 📱 React Client
    participant S as ⚙️ Services
    participant SB as 🗄️ Supabase
    participant AI as 🤖 Gemini AI

    U->>C: Interact with App
    C->>S: Call Service Function

    alt Static Content
        S->>SB: Query Database
        SB-->>S: Return Data
    else AI Query
        S->>AI: Send Prompt
        AI-->>S: AI Response
        S->>SB: Cache Response
    end

    S-->>C: Return to Component
    C-->>U: Update UI
```

---

## 6️⃣ File Structure Tree

```mermaid
flowchart TB
    subgraph Root["📁 QuranPulse-v6.0"]
        src["src/"]
        admin["admin-dashboard/"]
        supa["supabase/"]
        docs["DOCS_VAULT/"]
        public["public/"]
    end

    subgraph SrcDir["src/ - Main App"]
        modules["modules/<br/>15 modules"]
        services["services/<br/>31 files"]
        components["components/<br/>13 files + 6 dirs"]
        contexts["contexts/"]
        hooks["hooks/"]
        types["types/"]
        tests["__tests__/"]
    end

    subgraph AdminDir["admin-dashboard/ - Next.js"]
        adminSrc["src/app/"]
        prisma["prisma/"]
    end

    subgraph SupaDir["supabase/ - Backend"]
        migrations["migrations/"]
        functions["functions/"]
        seed["seed/"]
    end

    src --> SrcDir
    admin --> AdminDir
    supa --> SupaDir
```

---

## 7️⃣ Module Status Overview

```mermaid
pie title Module Completion Status
    "Complete (8)" : 8
    "In Progress (3)" : 3
    "Pending (4)" : 4
```

---

## 8️⃣ Technology Stack

```mermaid
mindmap
  root((QuranPulse v6.0))
    Frontend
      React 18
      Vite
      TypeScript
      Tailwind CSS v4
      Framer Motion
    Backend
      Supabase
      PostgreSQL
      Edge Functions
    AI
      Gemini 2.5 Flash
      OpenAI Whisper ASR
      Groq Fallback
    Bots
      Telegram
      WhatsApp Web.js
    Testing
      Jest
      React Testing Library
      Playwright
    DevOps
      Vercel
      GitHub Actions
```

---

**[End of Architecture Diagrams]**

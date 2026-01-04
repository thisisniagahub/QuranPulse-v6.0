# 🏗️ System Architecture: QuranPulse v6.0

## High-Level Overview

QuranPulse v6.0 follows a **"Supabase-First" Modular Monolith** architecture. The frontend is a thick client (PWA) that communicates directly with Supabase for data and Edge Functions for compute-heavy tasks (AI).

```mermaid
graph TD
    User[📱 User PWA]
    
    subgraph Frontend [React + Vite]
        UI[UI Components]
        Store[Zustand Store]
        Router[React Router v7]
        MCP_Router[mcpService]
    end
    
    subgraph Backend [Supabase]
        DB[(PostgreSQL)]
        Auth[GoTrue Auth]
        subgraph MCP [MCP Servers]
            Edge[chat-proxy]
            Quran[mcp-quran]
            Zakat[mcp-zakat]
            Worship[mcp-worship]
        end
    end

    User --> UI
    UI --> Store
    Store --> DB
    Store --> MCP_Router
    MCP_Router --> MCP
    Edge --> Gemini
    Edge --> Groq
```

## Core Modules

### 1. Client-Side (The "Body")
* **Framework:** React 18 with Vite for lightning-fast HMR.
* **State Management:** `zustand` for global state (User, Theme, Player).
* **MCP Service:** `mcpService.ts` acts as the client-side router, detecting user intent and dispatching to the correct domain server.

### 2. Server-Side (The "Brain")
* **Database:** PostgreSQL with Row Level Security (RLS). Optimized with **Partial Indexes** for the MCP cache layer.
* **MCP Edge Functions:** Domain-driven TypeScript/Deno functions in `supabase/functions`.
  * `chat-proxy`: Core AI orchestration and key rotation.
  * `mcp-worship`: Prayer times with JAKIM API + Adhan.js failover.
  * `mcp-quran`: Concept-based semantic search across translations.
  * `mcp-zakat`: State-specific Zakat calculation engine (MY-standard).
  * `mcp-compliance`: Halal and Fatwa lookup service.

### 3. AI Pipeline (The "Soul")
* **Text Generation:** Hybrid failover strategy (Groq/Gemini) with **Zero Token Cache** (DB lookup before LLM).
* **Testing:** Automated CI with Jest (Unit/Integration) and Playwright (E2E).

## Data Flow
1. **Read:** Client fetches JSON data (Surahs/Hadith) from `src/data` (static) or Supabase (dynamic user data).
2. **Write:** Client writes to Supabase Tables (`bookmarks`, `journal`).
3. **Compute:** Client invokes `supabase.functions.invoke('chat-proxy')` -> Edge Function calls LLM -> Streams response back.

## Security
* **RLS:** All tables provided `Enable RLS`. Users can only select/insert their own rows.
* **Env Vars:** API Keys stored in Supabase Vault not exposed to client.
* **Hardened Admin:** Strict role-based access for Admin Dashboard.

## Future Scalability
* **Microservices:** The ASR Engine is designed to be peeled off into a separate Python/FastAPI container service.
* **PWA:** Service Workers cache `quran-data` for offline reading.
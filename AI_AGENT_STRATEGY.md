# 🤖 AI Agent Strategy: The "Ustaz AI" Ecosystem

**Objective:** Transform "Ustaz AI" from a simple chatbot into a **Central Orchestrator** that manages the entire QuranPulse ecosystem (Frontend, Backend, and Admin).

**Inspiration:** Adapted from `NiagaHub-SuperApp` (AdkRunner/AdkAgent) architecture.

---

## 1. The Core Concept: "Ustaz as an OS"

Instead of multiple disconnected AI features (Chat, Prayer Times, Iqra), "Ustaz AI" becomes the operating system interface. Users don't just "chat"; they **command** the app through the Ustaz.

### 1.1 The Orchestrator (Client-Side Router)
*   **Role:** The "Imam". Listens to user intent and delegates tasks.
*   **Implementation:** `src/services/mcpService.ts` (Existing) will be upgraded to `UstazRunner`.
*   **Logic:**
    1.  Receive Input ("Saya nak bayar zakat").
    2.  Classify Intent (Finance).
    3.  Delegate to Specialist Agent (`mcp-zakat`).
    4.  Format & Return Result.

### 1.2 The Worker Bees (Server-Side Agents)
These are the MCP Edge Functions we already have, plus new ones inspired by NiagaHub.

| Agent Name | Role | MCP Function | Status |
| :--- | :--- | :--- | :--- |
| **Agent Education** | Teaching, Tafsir, Hadith | `mcp-education` | ✅ Ready |
| **Agent Worship** | Prayer Times, Qibla | `mcp-worship` | ✅ Ready |
| **Agent Quran** | Semantic Search, Hifz | `mcp-quran` | ✅ Ready |
| **Agent Finance** | Zakat, Infaq, Payment | `mcp-zakat` | ✅ Ready |
| **Agent Compliance** | Fatwa, Halal Check | `mcp-compliance` | ✅ Ready |
| **Agent Admin** | **NEW** System Monitoring | `mcp-admin` | 🚧 Planned |

---

## 2. Infrastructure Improvements (From NiagaHub)

### 2.1 Multi-Key Rotation (Resilience)
*   **Current:** `chat-proxy` (Edge) and `MultiKeyRotator.ts` (Node.js).
*   **Verdict:** ✅ **Excellent**. The logic matches NiagaHub's standard.
    *   *Action:* Maintain the `GEMINI_API_KEYS` comma-separated list in Supabase Secrets.

### 2.2 Caching Strategy (Performance)
*   **NiagaHub:** Uses Redis (In-Memory).
*   **QuranPulse:** Uses Supabase `ai_knowledge_cache` (Postgres).
*   **Improvement:** For high-traffic "Worship" queries (e.g., "Waktu Maghrib KL"), hitting Postgres every time is slow.
    *   *Action:* Implement **Edge Caching** (CDN) for `mcp-worship` responses using `Cache-Control` headers.

---

## 3. The "Agent Admin" (New Frontier)

Inspired by NiagaHub's `AdkRunner` for business, we will create an **Admin Agent** for QuranPulse.

*   **Goal:** Allow you (the developer) to ask: *"How many new users today?"* or *"Generate a poster for Isra Mikraj"*.
*   **Implementation:**
    1.  **Tool:** `supabase-analytics`.
    2.  **Interface:** A specialized chat interface in the `admin-dashboard`.
    3.  **Access:** Strict RLS (Service Role only).

---

## 4. Implementation Roadmap

### Phase 1: Consolidation (Week 1)
- [ ] Rename `mcpService.ts` to `UstazOrchestrator.ts` to reflect its expanded role.
- [ ] Ensure all 5 MCP functions share the same `MultiKeyRotator` logic pattern.

### Phase 2: The "Admin Agent" (Week 2)
- [ ] Create `supabase/functions/mcp-admin`.
- [ ] Connect it to `adminService.ts`.
- [ ] Allow natural language queries for DB stats.

### Phase 3: Voice Command (Week 3)
- [ ] Connect `asr_engine` (Whisper) to `UstazOrchestrator`.
- [ ] Enable "Voice Navigation" (e.g., "Buka Surah Yasin").

---
*Strategy Definition by Antigravity AI Architect.*

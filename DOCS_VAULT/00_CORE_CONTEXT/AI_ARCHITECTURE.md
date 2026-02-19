# QuranPulse AI Architecture: The "Frugal 3-Tier" Engine

> **Role:** AI/ML Engineer Report
> **Objective:** Zero-cost production AI for 90% of queries.
> **Compliance:** JAKIM / Shafi'i Madhab
> **Latency:** <2s target

---

## 🏗️ PART 1: The 3-Tier Strategy

We utilize a waterfall approach to minimize Token usage and Latency.

### 🛡️ Tier 1: Client-Side Processing (0ms Response, $0 Cost)

**Strategy:** Intercept common queries on the device using Regex patterns before they even hit the network.
**Use Case:** Prayer times, Intentions (Niat), Basic navigation.

**Implementation:**
```typescript
// src/modules/ai-studio/services/LocalProcessor.ts

export const LocalQueries = {
  PRAYER_TIMES: /waktu solat|prayer time|azan/i,
  NIAT_PUASA: /niat puasa|intention fasting/i,
  QIBLA: /kiblat|qibla/i,
};

export function processLocally(query: string): string | null {
  if (LocalQueries.PRAYER_TIMES.test(query)) {
    return "COMMAND:OPEN_WIDGET:PRAYER_TIMES"; // UI renders the widget directly
  }
  if (LocalQueries.NIAT_PUASA.test(query)) {
    return "Niat Puasa Esok: 'Sahaja aku berpuasa esok hari menunaikan fardhu Ramadhan tahun ini kerana Allah Ta'ala.'";
  }
  return null; // Pass to Tier 2
}
```

### 🧠 Tier 2: Semantic Vector Cache (50ms Response, $0 AI Cost)

**Strategy:** "Don't think twice." If a user asks what another user has already asked, verify similarity and return the cached answer.
**Technology:** Supabase `pgvector` extension.

**Schema:**
```sql
CREATE TABLE ai_knowledge_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_text TEXT NOT NULL,
  embedding vector(768), -- Gemini Embedding Dimension
  answer_content TEXT NOT NULL,
  
  -- Metadata
  source TEXT DEFAULT 'gemini-1.5-flash',
  verified BOOLEAN DEFAULT false, -- For theological review
  hit_count INT DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IVFFlat Index for fast cosine similarity search
CREATE INDEX idx_cache_embedding ON ai_knowledge_cache 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

**Logic:**
1.  Generate lightweight embedding for user query.
2.  Search `pgvector` with **Similarity Threshold > 0.90**.
3.  If match found, return reliable cached answer.
4.  If no match, proceed to Tier 3.

### ☁️ Tier 3: Cloud LLM (Fallback)

**Strategy:** Use efficient "Flash" models via a secure Proxy.
**Model:** **Gemini 1.5 Flash** (Free Tier is generous, high speed) OR **Groq (Llama 3)** (Ultra-fast).

---

## 🔒 PART 2: Secure Edge Proxy (`chat-proxy`)

**Critical Security:** Never expose `GEMINI_API_KEY` in frontend code.
**Location:** `supabase/functions/chat-proxy/index.ts`

**Workflow:**
1.  **Auth Check:** Verify `Authorization: Bearer <user_token>`.
2.  **Rate Limit:** Redis-backed counter (e.g., 50 req/day/active-user).
3.  **Prompt Injection Guard:** Basic regex to filter "Ignore previous instructions".
4.  **Execute:** Call Google AI Studio / Groq API.
5.  **Log:** Record usage token count for internal audit.

```typescript
// supabase/functions/chat-proxy/index.ts

serve(async (req) => {
  // 1. Auth Guard
  const authHeader = req.headers.get('Authorization')
  const user = await getUserFromSupabase(authHeader);
  if (!user) return new Response('Unauthorized', { status: 401 });

  // 2. Rate Limit (Simple PG based)
  const isAllowed = await checkRateLimit(user.id);
  if (!isAllowed) return new Response('Daily Limit Reached', { status: 429 });

  const { messages } = await req.json();

  // 3. Call LLM (Gemini 1.5 Flash)
  const result = await GoogleGenerativeAI.chat({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT.USTAZ_AI,
    messages: messages
  });

  return new Response(JSON.stringify(result));
});
```

---

## 📜 PART 3: System Prompts & Safety

### Ustaz AI Identity
> "You are Ustaz AI, a humble and knowledgeable Islamic assistant built for the Malaysian Muslim community. You strictly adhere to the **Shafi'i Madhab** (Ahli Sunnah Wal Jamaah) unless explicitly asked otherwise."

### The "No Fatwa" Rule (Hard Constraint)
> "**CRITICAL:** You are an AI, not a Mufti.
> 1. If asked about **Hukum** (Rulings), ONLY cite verses/hadith or general consensus.
> 2. NEVER issue a specific Fatwa for a complex personal situation (e.g., divorce/talaq specific cases).
> 3. Instead, answer: 'Untuk masalah spesifik ini, sila rujuk Pejabat Agama atau asatizah bertauliah kerana ia memerlukan penelitian mendalam.'
> 4. End all answers with '**Wallahu a'lam**'."

---

## 🛠️ PART 4: MCP Tools Integration (Function Calling)

To ground the AI in reality, we expose "Tools" that the LLM can invoke.

### Tool 1: `solat_verifier`
*   **Purpose:** Determine *exact* prayer times, not hallucinations.
*   **Source:** JAKIM / e-Solat API.
*   **Input:** `{ state: "Selangor", zone: "Gombak" }`
*   **Output:** `{ "subuh": "05:50", "syuruk": "07:12", ... }`

### Tool 2: `quran_search`
*   **Purpose:** Find exact Ayah when user asks vaguely.
*   **Source:** Internal DB (`ayahs` table).
*   **Input:** `{ keywords: "hutang", language: "ms" }`
*   **Output:** `[{ "surah": 2, "ayah": 282, "text": "Wahai orang beriman..." }]`

---

## 📉 PART 5: Cost & Error Management

### Failover Circuit Breaker
If `Gemini Flash` returns 503/429:
1.  **Attempt 1:** Retry with Exponential Backoff.
2.  **Attempt 2:** Switch to `Groq (Llama-3-8b)` (Backup Provider).
3.  **Final:** Return "Sistem sedang sibuk" (Graceful degradation).

### Cost Limits
*   **Free Tier Users:** Max 5 Tier-3 (Cloud) queries per day. Unlimited Tier-1 (Local).
*   **Pro Users:** Max 100 queries/day.

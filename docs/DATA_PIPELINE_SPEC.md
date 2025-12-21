# 🧠 The "Neural Ingestor" Pipeline (Islamweb Integration)

> **Goal:** Transform QuranPulse from a static app to a "Living Knowledge Base" by automatically ingesting verified Islamic content from global sources like *Islamweb.net*.

---

## 1. The Strategy: "Scrape, Translate, Vectorize"

Islamweb is a treasure trove of structured data (Fatwa, Audio, Articles). However, it is in Arabic. Our pipeline will bridge this gap.

### The Pipeline Steps:
1.  **Discovery (Crawler):** Puppeteer visits index pages (e.g., `islamweb.net/ar/fatwa/`) to find new content URLs.
2.  **Extraction (Parser):** Extract the Question, Answer, and Evidence (Dalil) using DOM selectors.
3.  **Transformation (The AI Bridge):**
    *   **Translation:** Send Arabic text to Gemini 1.5 Flash.
    *   **Instruction:** "Translate this Fatwa to Malay. Keep the tone formal. Extract key topics."
    *   **Output:** JSON `{ question_ms, answer_ms, topics: [] }`.
4.  **Loading (Vector DB):**
    *   Generate Embedding for `question_ms`.
    *   Store in `ai_knowledge_cache` (or a new `knowledge_base` table).

---

## 2. Advanced Tools Implementation

### A. "Pulse Crawler" (Orchestration)
*   **Tech:** Puppeteer (Dockerized MCP).
*   **Role:** Runs daily. "Wakes up", checks for new Fatwas, sleeps.
*   **Smart throttling:** Respects `robots.txt` and rate limits to avoid IP bans.

### B. "The Translator Node" (AI/ML)
*   **Tech:** Gemini API (Batch Mode).
*   **Efficiency:** We translate *once* during ingestion, not every time a user asks. This saves massive token costs at runtime.

### C. "Audio Sync" (Data Connector)
*   **Challenge:** Storing TBs of MP3s is expensive.
*   **Solution:** Store *Metadata Only* (Title, Sheikh Name, Islamweb URL).
*   **Frontend:** `AudioPlayer` streams directly from the source (or via a simple proxy to handle CORS).

---

## 3. Targeted Content Mapping

| Islamweb Section | QuranPulse Module | Application |
| :--- | :--- | :--- |
| **Fatwa (Family)** | **Ustazah AI** | "Suami saya tak solat..." -> AI searches verified Fatwas. |
| **Fatwa (Ibadah)** | **Tok Imam Bot** | "Batal wuduk jika..." -> AI quotes exact ruling. |
| **Audio (Khutbah)** | **Media Studio** | Weekly Khutbah updates for users to listen. |
| **Articles (History)** | **Kids Mode** | "Ceritakan kisah Nabi Musa" (based on authentic articles). |

---

## 4. Technical Schema (Proposed)

```sql
CREATE TABLE external_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_url TEXT UNIQUE,
    source_domain TEXT DEFAULT 'islamweb',
    
    original_title TEXT, -- Arabic
    translated_title TEXT, -- Malay
    
    content_ar TEXT,
    content_ms TEXT, -- The AI-translated version
    
    category TEXT, -- 'fiqh', 'aqidah'
    embedding VECTOR(1536), -- For Semantic Search
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Next Step:** Build the `ingest_islamweb.ts` script to prove this concept.

# 🌌 Product Requirements Document (PRD): QuranPulse Mobile v6.0

**Project Name:** QuranPulse Mobile (Noor-e-Cyber Edition)  
**Status:** In Development (Advanced Phase)  
**Version:** 6.2 (RAG-Enhanced)  
**Lead Architect:** AI Agent (Lead Software Architect & PM)

---

## 1. Executive Summary
### 1.1 Vision
Menjadi platform ekosistem Islamik digital paling maju di dunia yang menggabungkan pertumbuhan spiritual dengan teknologi **"Cyber-Islamic"** berprestasi tinggi.

### 1.2 Mission
Menyediakan pengalaman "Proper App" yang melangkaui had PWA tradisional melalui:
*   **Zero Latency:** Pemuatan teks Al-Quran sepantas kilat (Sub-100ms).
*   **Intelligent Guidance:** Bimbingan AI Ustaz yang berpusat pada domain (MCP).
*   **High Trust:** Keselamatan peringkat perusahaan dengan ketelusan data.

---

## 2. User Personas (Target Audience)
1.  **Pelajar Iqra (The Learner):** Kanak-kanak atau mualaf yang memerlukan bimbingan suara AI untuk memperbaiki bacaan.
2.  **Profesional Muslim (The Busy Devotee):** Individu yang memerlukan akses pantas kepada waktu solat, carian hukum (Fatwa), dan bacaan harian di celah kesibukan.
3.  **Keluarga (The Clan):** Kumpulan pengguna yang ingin bersaing secara sihat dalam mengumpul Barakah Points dan memantau prestasi streak ibadah bersama.
4.  **Admin/Tutor (The Moderator):** Pendidik bertauliah yang memantau kemajuan pelajar dan menguruskan kandungan komuniti.

---

## 3. Technical Stack (The "Noor-e-Cyber" Stack)
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **React 18 + Vite** | High-performance PWA dengan sub-second HMR. |
| **State Management**| **Zustand** | Lightweight, decoupled global state. |
| **Backend** | **Supabase** | Postgres, GoTrue Auth, dan domain-driven MCP Edge Functions. |
| **Logic Layer** | **MCP Architecture** | Multi-server tool routing untuk domain spesifik. |
| **Database** | **PostgreSQL** | Relational data dengan pgvector dan Partial Indexing. |
| **AI Layer** | **Gemini + Groq** | Hybrid LLM failover strategy (Speed vs Reasoning). |
| **Testing** | **Jest + Playwright** | Full-stack test automation (Unit, Integration, E2E). |

---

## 4. Feature Specifications (MoSCoW Matrix)

### 4.1 Must Have (P0 - Critical)
*   **Quran Reading Engine:** Uthmani script dengan pemuatan sub-100ms.
*   **MCP Worship:** Waktu solat rasmi JAKIM dengan sistem failover.
*   **Secure Auth:** Pendaftaran melalui Google/Email dengan perlindungan RLS.
*   **Iqra Progress:** Penjejakan tahap 1-6 yang tersinkronisasi ke Cloud.

### 4.2 Should Have (P1 - High Priority)
*   **MCP Zakat:** Kalkulator zakat mengikut kadar negeri Malaysia.
*   **MCP Quran Search:** Carian konsep (semantic search) merentasi terjemahan.
*   **Voice AI Coach:** Maklum balas AI terhadap rakaman bacaan Iqra.
*   **Smart Notifications:** Notifikasi waktu solat dan streak reminder.

### 4.3 Could Have (P2 - Innovation)
*   **Barakah Engine:** Gamifikasi melalui XP, Level, dan Badges.
*   **Social Moments:** Perkongsian tadabbur dan aktiviti komuniti.
*   **AR Qibla:** Penunjuk arah kiblat menggunakan Augmented Reality.

### 4.4 Won't Have (P3 - Future Scope)
*   Native Desktop App (Focusing on PWA and Mobile).
*   Video Streaming Platform.

---

## 5. User Journey: The "Zero Latency" Path
1.  **Entry:** Pengguna membuka app -> Splash screen (Noor-e-Cyber theme) muncul < 1s.
2.  **Engagement:** AI Ustaz menyapa berdasarkan waktu (cth: "Dah solat Dhuha?").
3.  **Action:** Pengguna klik "Cari Ayat" -> MCP Quran memberikan hasil dalam < 500ms.
4.  **Persistence:** Bacaan disimpan secara automatik dalam Journal/Bookmark.

---

## 6. Advanced AI Architecture: The RAG Pipeline

We implement a sophisticated **Retrieval-Augmented Generation (RAG)** pipeline to ensure theological accuracy and minimize hallucinations.

### 6.1 Vector Database Integration
*   **Technology:** `pgvector` (PostgreSQL Extension).
*   **Storage:** `hadith_embeddings` and `quran_embeddings` tables.
*   **Dimensions:** 1536 dimensions (OpenAI `text-embedding-3-small` compatible).
*   **Indexing:** HNSW (Hierarchical Navigable Small World) index for <10ms retrieval latency.

### 6.2 The RAG Flow (Step-by-Step)
1.  **Ingestion:**
    *   **Source:** Verified PDFs (Jakim Fatwa), Quran JSON, Hadith Collections.
    *   **Chunking:** Recursive Character Splitting (Size: 1000 tokens, Overlap: 200).
    *   **Embedding:** Text chunks converted to vectors via Edge Function `embed-doc`.
    *   **Storage:** Vectors stored in Supabase with metadata (Source, Page, Grade).

2.  **Retrieval (Query Time):**
    *   User asks: "Apa hukum forex?"
    *   Query is embedded to vector.
    *   DB executes **Cosine Similarity Search** (`1 - (doc <=> query)`).
    *   Top 3 most relevant context chunks are retrieved.

3.  **Generation (LLM Integration):**
    *   **Prompt Construction:** "Context: {chunks}. Question: {query}. Answer using ONLY the context."
    *   **Model:** Gemini 2.0 Flash (via `chat-proxy`).
    *   **Output:** Precise, cited answer ("According to Jakim Fatwa 2012...").

### 6.3 Evaluation Metrics (The AI KPI)
We measure RAG performance using the **RAGAS** framework logic:
*   **Faithfulness:** Does the answer contradict the retrieved context? (Target: > 95%)
*   **Answer Relevance:** Does it actually answer the user's question? (Target: > 90%)
*   **Context Precision:** Is the retrieved chunk actually useful? (Target: > 85% Precision@3)

---

## 7. Monetization & Growth Metrics (KPIs)
### 7.1 Revenue Streams
*   **Premium Tier:** Akses kepada AI Ustaz tanpa had dan analisis Tajweed mendalam.
*   **Infaq Digital:** Sistem mikro-donasi (Barakah Donation) untuk pembangunan masjid/tahfiz.

### 7.2 Key Performance Indicators (KPIs)
*   **Retention:** 40% Day-30 Retention Rate.
*   **Speed:** < 200ms API response time untuk servis MCP.
*   **Accuracy:** > 90% ketepatan dalam klasifikasi intent MCP.

---

## 8. Roadmap (Phased Delivery)
*   **Phase 1 (Genesis):** Project setup, Auth, and Supabase Sync. (✅ DONE)
*   **Phase 2 (Core):** Quran Engine + MCP Architecture + Testing. (✅ DONE)
*   **Phase 3 (AI):** Advanced Ustaz AI + Knowledge Base expansion. (⚡ IN PROGRESS)
*   **Phase 4 (Iqra):** Full Voice AI loop and progress tracking. (UPCOMING)
*   **Phase 5 (Polish):** Admin Dashboard UI and Global Launch. (UPCOMING)

---
**Approval:**  
*Updated by AI Architect for Antigravity Team (Jan 4, 2026).*
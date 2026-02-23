# 🧠 Advanced AI Stack — Model Architecture

> **Last Updated**: 21 Feb 2026
> **Status**: Draft
> **Module**: Core AI Platform

---

> **Status:** Proposal for Phase 2 Implementation
> **Goal:** Move beyond "Basic Chatbot" to "Autonomous System" using industry-leading (often Open Source) tools.

## 1. Orchestration & Optimization (The Brain)

### A. DSPy (Declarative Self-Improving Python)
*   **Masalah:** "Prompt Engineering" sangat leceh. Ubah satu perkataan, output rosak.
*   **Solusi:** DSPy. Anda tak tulis prompt. Anda tulis *logik* dan *contoh* (examples). Sistem akan *compile* dan *optimize* prompt sendiri untuk dapatkan hasil terbaik.
*   **Kegunaan QuranPulse:** Mengoptimumkan jawapan "Tok Imam" supaya sentiasa konsisten dengan format JAKIM tanpa kita perlu tweak prompt manual setiap hari.

### B. LangGraph (Stateful Agents)
*   **Masalah:** Chatbot biasa pelupa. Dia tak ingat "State" (User ni tengah marah ke? User ni dah setuju nak infaq ke?).
*   **Solusi:** LangGraph membina ejen yang ada *Cyclic Logic* (Berulang & Menyemak).
*   **Kegunaan QuranPulse:** Ejen Infaq yang boleh "Follow Up". Jika user kata "Nanti saya bank-in", ejen akan simpan state "Pending Payment" dan tanya semula esok.

---

## 2. Observability & Debugging (The X-Ray)

### A. LangSmith (by LangChain)
*   **Masalah:** Bila AI jawab salah ("Hallucination"), kita tak tahu *kenapa*. Adakah sebab RAG gagal? Atau model salah faham?
*   **Solusi:** LangSmith merekod setiap langkah ("Trace"). Kita boleh replay chat user dan lihat di mana silapnya.
*   **Kegunaan QuranPulse:** "Debug" kenapa Tok Imam bagi fatwa Mazhab Hanafi sedangkan kita set Syafi'i.

### B. Arize Phoenix (Open Source Alternative)
*   **Kelebihan:** Boleh run local (Docker). Zero cost.
*   **Fungsi:** Visualisasi RAG retrieval. Adakah ayat Quran yang diambil tu betul-betul relevan?

---

## 3. Infrastructure & Speed (The Engine)

### A. Groq (LPU Inference)
*   **Masalah:** GPT-4 lambat. User WhatsApp tak suka tunggu 5 saat.
*   **Solusi:** Groq adalah cip AI terpantas di dunia.
*   **Speed:** 500 token/saat (vs 50 token/saat biasa).
*   **Kegunaan QuranPulse:** Jawapan "Instant" di WhatsApp. Rasa macam bercakap dengan manusia sebenar.

### B. LiteLLM (The Proxy)
*   **Masalah:** Nak tukar dari Gemini ke OpenAI ke Claude susah (kena ubah kod).
*   **Solusi:** LiteLLM adalah "Universal Adapter". Kod anda panggil LiteLLM, LiteLLM panggil mana-mana model yang anda set dalam config.
*   **Bonus:** Load balancing (Guna key A, kalau limit, guna key B automatik).

---

## 4. Data Ingestion (The Library)

### A. Unstructured.io
*   **Masalah:** PDF Kitab Turath lama formatnya berterabur. Teks bercampur gambar.
*   **Solusi:** Tool terbaik untuk "ETL" (Extract, Transform, Load). Ia boleh baca jadual, imej, dan nota kaki dalam PDF dengan tepat.
*   **Kegunaan QuranPulse:** "Ingest" kitab-kitab PDF lama dari JAKIM/Mufti ke dalam Vector DB dengan struktur yang betul.

---

## 🏗️ Recommendation for Implementation

**Priority 1 (High Impact, Low Effort):**
*   Pasang **LiteLLM** (untuk urus Key Pool dengan lebih efisien).
*   Guna **Groq** (Free Tier ada) untuk WhatsApp Bot (Speed is King).

**Priority 2 (Quality Assurance):**
*   Integrasi **LangSmith** (Free Tier) untuk pantau kualiti jawapan "Tok Imam".

**Priority 3 (Future Proofing):**
*   Explore **DSPy** jika prompt `aiService.ts` menjadi terlalu panjang dan rumit.


# 🏛️ JAKIM Integration — Official Islamic Authority API

> **Last Updated**: 21 Feb 2026
> **Status**: Draft
> **Module**: Integrations / JAKIM

---

> **Vision:** Integrating Official Malaysian Islamic Data to provide "Hyper-Localized" and "Authority-Compliant" features.

## 1. Data Source Analysis

### A. Masjid & Surau (`/solat-masjid`)
*   **Data:** Name, Location (State/District), Type (Kariah/Jumaat).
*   **Integration:** Populates `official_mosques` table.
*   **Feature:** **"Masjid Hub"** - Find nearest mosque, check status (Active/Renovation).

### B. Koleksi Khutbah (`/koleksi-khutbah`)
*   **Data:** Weekly PDF texts/Audio.
*   **Integration:** Ingest into `knowledge_base` (Vector DB).
*   **Feature:** **"Smart Khutbah"** - "Ustaz, apa tajuk khutbah minggu ni?" AI summarizes the official text.

### C. Portal MyHadith (`/portal-myhadith`)
*   **Data:** Verified translations of Hadith.
*   **Integration:** Training data for **Tok Imam Bot**.
*   **Feature:** Ensures bot answers are **JAKIM-compliant** and authentic.

### D. Status Halal (`/semakan-status-halal`)
*   **Data:** Database of certified products/premises.
*   **Integration:** Real-time lookup (via Proxy/Scraper).
*   **Feature:** **"Halal Lens"** - Scan barcode -> Check status.

### E. KAFA & Pendidikan (`/pendidikan/kafa`)
*   **Data:** School locations, Syllabus.
*   **Integration:** `iqra_digital` expansion.
*   **Feature:** **"KAFA Finder"** & "Syllabus Matcher" (Match app levels to KAFA years).

---

## 2. Advanced Tools (The "Next Level")

### 🛠️ Tool 1: "Khutbah Sentiment Engine" (NLP)
*   **Concept:** Use AI to analyze 5 years of Khutbahs.
*   **Output:** Visualize trends. "Topik 2024 banyak sentuh tentang Palestin & Ekonomi."
*   **Value:** Admin/Imams can see what topics are trending or neglected.

### 🛠️ Tool 2: "Halal Vision" (AR)
*   **Concept:** Computer Vision on mobile.
*   **Workflow:** User points camera at product -> OCR Text -> Search JAKIM DB -> Overlay "Green Tick" (Halal) or "Red Cross" (Syubhah).
*   **Value:** Instant confidence shopping.

### 🛠️ Tool 3: "MyMaqasid Life Score" (Gamification)
*   **Concept:** A new gamification metric based on 5 Maqasid Syariah principles (Agama, Nyawa, Akal, Keturunan, Harta).
*   **Workflow:**
    *   *Solat/Quran* -> +Points (Agama)
    *   *Health/Infaq* -> +Points (Nyawa)
    *   *Reading Articles* -> +Points (Akal)
*   **Value:** Holistic Islamic lifestyle tracking.

---

## 3. Implementation Roadmap

### Phase 1: The "Scraper" Fleet (Ingestion)
*   Use `Puppeteer` (MCP) to crawl JAKIM's public directories weekly.
*   Store in `official_mosques` and `external_knowledge` (Supabase).

### Phase 2: The "Bridge" API
*   Build a standardized API (`/api/jakim/khutbah`) that serves this scraped data to the Frontend.

### Phase 3: The "Features"
*   Deploy **Halal Vision** in `Souq` module.
*   Deploy **Smart Khutbah** in `SmartDeen` module.


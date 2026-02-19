# 🏙️ MAIWP Integration Strategy (Barakah Engine 2.0)

> **Vision:** Expanding "Barakah Hub" from just *Giving* (Infaq/Zakat) to *Cleansing* (Kafarah) and *Receiving* (Bantuan).

---

## 1. Data Source Analysis

### A. Kafarah (The "Debt" of Sin)
*   **Data:** Rates for Fidyah (Missed Fasting), Kafarah Sumpah (Oath), Kafarah Zihar, Kafarah Persetubuhan (Ramadan).
*   **Integration:** `kafarah_rates` table.
*   **Feature:** **"Kafarah Calculator"** - Calculate fines based on "Years Missed" or "Type of Violation".

### B. Bantuan Pembangunan Ummah (Aid)
*   **Data:** 30+ Schemes (Bantuan IPT, Sewa Rumah, Perniagaan, Perubatan).
*   **Criteria:** Income Limits (Had Kifayah), Residency (Mastautin).
*   **Feature:** **"Bantuan Checker AI"** - "Saya gaji RM1500, anak 3. Apa bantuan saya boleh dapat?"

### C. Derma & Sedekah
*   **Data:** General donations for specific causes (Maahad Tahfiz, Hospital).
*   **Integration:** Add to `masjid_funds` with type 'general_charity'.

---

## 2. Advanced Tools (The "Next Level")

### 🛠️ Tool 1: "Smart Kafarah Calculator"
*   **Concept:** Specialized calculator for religious fines.
*   **Input:** "Saya tak puasa 7 hari masa tahun 2015."
*   **Logic:** `(7 days * Rate 2015) + (Multipler for delayed years if applicable)`.
*   **Output:** "Total Fidyah: RM XXX. Bayar Sekarang via FPX."

### 🛠️ Tool 2: "Aid Eligibility AI" (Robo-Advisor)
*   **Concept:** A reverse-zakat calculator.
*   **Workflow:**
    1.  User updates Profile (Income, Dependents).
    2.  AI scans MAIWP schemes.
    3.  **Result:** "Anda layak memohon: 1. Bantuan Sekolah (RMXXX), 2. Bantuan Sewa."
    4.  **Action:** "Auto-Fill Borang" (Generates PDF).

### 🛠️ Tool 3: "Micro-Takaful" (Community Safety Net)
*   **Concept:** Based on 'Pembangunan Ummah'.
*   **Mechanism:** Users contribute RM5/month into a "Community Emergency Fund".
*   **Claim:** If a verified user gets sick/calamity, they get instant cash aid from the pool (verified by AI/Admin).

---

## 3. Implementation Roadmap

### Phase 1: Database Expansion
```sql
CREATE TABLE kafarah_types (
    id UUID PRIMARY KEY,
    name TEXT, -- 'Fidyah', 'Sumpah'
    base_rate NUMERIC, -- RM equivalent of '1 Cupak'
    description TEXT
);
```

### Phase 2: The Calculator UI
*   Add "Kafarah" tab to `ZakatCalculator`.

### Phase 3: The "Aid Matcher"
*   Build a rule engine in `aiService.ts` to match User Profile vs Aid Criteria.

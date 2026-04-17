# 💡 Innovation Lab: "Out-of-the-Box" Ideas for QuranPulse

> **Context:** Inspired by the resilience of legacy web technologies (PHP) and the power of modern AI Agents (MCP).
> **Goal:** To build features that no other Islamic App has by bridging the gap between "Old Tech" (Mosques/Rural) and "New Tech" (AI/Cloud).

---

## 1. 🕌 The "Digital Masjid" Bridge (Legacy Scraper)
*Connects the 'Unconnected' Mosques to the App.*

### The Problem
Most apps only give "Zone Prayer Times" (General). They don't know that **Masjid Al-Hidayah Gombak** solat Isyak lewat 15 minit malam ni sebab ada ceramah. Info ini ada, tapi terkubur dalam laman web lama masjid (Wordpress/Blogspot).

### The Solution
Gunakan **MCP Puppeteer Agent** untuk menjadi "Penyiasat Maya".
1.  **Scout:** Agent melawat senarai laman web masjid kariah setiap Jumaat.
2.  **Extract:** Baca "Poster" atau "Jadual" di web tersebut (walaupun format buruk).
3.  **Sync:** Kemaskini jadual `official_mosques` dalam Supabase dengan data "Live Events".

### Tech Stack
*   **MCP Server:** `puppeteer` (Web Fetcher).
*   **Target:** Legacy PHP/HTML sites.
*   **Value:** "QuranPulse satu-satunya app yang tahu bila masjid taman saya buat kenduri."

---

## 2. 📞 "Suara Surau" Hotline (Zero-UI Interface)
*AI untuk Warga Emas & Golongan Tanpa Smartphone Canggih.*

### The Problem
Nenek di kampung ada telefon Nokia lama. Dia tak pandai guna Apps. Macam mana dia nak tanya soalan agama atau tahu waktu solat?

### The Solution
Sistem telefon pintar (VoIP) yang disambungkan ke **Ustaz AI**.
1.  **User:** Dail nombor hotline (Local Number).
2.  **Voice:** "Assalamualaikum, nak tanya, batal tak puasa kalau gosok gigi?"
3.  **Bridge:** Audio -> Text -> **MCP Agent** -> Gemini -> Jawapan -> Text-to-Speech.
4.  **Respon:** "Waalaikumussalam. Gosok gigi tak batal puasa, tapi makruh jika..."

### Tech Stack
*   **MCP Server:** `twilio` (Custom Wrapper) atau API Integration.
*   **Value:** Keterangkuman total (Total Inclusivity).

---

## 3. 📦 "Wakaf Node" (The Offline Box)
*Penyelesaian Internet Lemah di Pedalaman.*

### The Problem
Di surau pedalaman, internet perlahan. Nak stream video 4K "Media Studio" atau audio Quran HD adalah mustahil.

### The Solution
Sumbangkan **"Raspberry Pi"** (Komputer mini RM200) ke surau sebagai pelayan (server) tempatan.
1.  **Sync:** "Kotak" ini download semua content QuranPulse sekali sebulan bila ada internet.
2.  **Serve:** Jemaah sambung ke WiFi Surau ("Wakaf_WiFi").
3.  **Fast:** Video & Audio load dalam 0.1 saat sebab ia disimpan dalam "Kotak" (Local Network), bukan download dari internet.

### Tech Stack
*   **MCP Server:** `filesystem` (Local Content Manager) + `docker` (Containerization).
*   **Inspiration:** PHP Hosting style (Cheap, distributed, robust).
*   **Value:** Pahala berpanjangan (Infaq Hardware).

---

## 4. 📜 Digital "Sanad" Chain (Trust Protocol)
*Pengesahan Hafazan Tanpa Blockchain Mahal.*

### The Problem
Bagaimana nak sahkan seseorang itu "Verified Tutor" atau "Hafiz" tanpa sijil kertas yang boleh dipalsukan?

### The Solution
Gunakan **Cryptographic Signature** ringkas dalam database.
1.  **Verify:** Guru besar (Verified) tekan butang "Lulus" pada pelajar.
2.  **Chain:** System jana hash unik: `HASH(Guru_ID + Pelajar_ID + Tarikh + Level)`.
3.  **Trace:** Sesiapa boleh klik lencana pelajar untuk lihat "Rantaian Sanad" (Siapa guru dia, siapa guru kepada guru dia).

### Tech Stack
*   **Database:** Supabase (Recursive queries).
*   **Concept:** "Web of Trust" (macam LinkedIn endorsement tapi strict).

---

**Summary:**
Jangan terhad kepada "App dalam Phone". Fikirkan ekosistem: **Web Lama (Data)**, **Telefon Talian Tetap (Akses)**, dan **Hardware Fizikal (Infrastruktur)**.

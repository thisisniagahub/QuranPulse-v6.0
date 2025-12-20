# Cadangan & Contoh MCP Servers untuk QuranPulse v6.0

Berikut adalah senarai contoh MCP Server yang sangat relevan untuk projek aplikasi Islamik seperti QuranPulse, berserta fungsi spesifik yang boleh dibina atau digunakan.

## 1. 🗄️ Database Manager (Supabase/PostgreSQL)
**Status:** *Wajib / Kritikal*
Ini adalah "otak" data aplikasi anda.

*   **Contoh Server:** `mcp/supabase` atau `mcp/postgres`
*   **Fungsi dalam QuranPulse:**
    *   **User Profiling:** AI boleh semak "Siapa pengguna ini?" (Level Iqra berapa? Streak solat macam mana?) sebelum menjawab soalan.
    *   **Dynamic Content:** "Senaraikan 5 surah terakhir yang dibaca oleh Ahmad."
    *   **Admin Tasks:** AI boleh bantu jana SQL untuk analytics, contoh: "Berapa ramai pengguna khatam Iqra 1 bulan ini?"

## 2. 🧠 Knowledge Base & Semantic Search (Vector DB)
**Status:** *Sangat Disyorkan (RAG)*
Untuk membolehkan "Ustaz AI" menjawab dalil dengan tepat, bukan sekadar bersembang kosong.

*   **Contoh Server:** `mcp/pgvector` (Sambung ke Supabase Vector) atau `mcp/qdrant`
*   **Fungsi dalam QuranPulse:**
    *   **Carian Dalil Konteks:** Pengguna tanya "Ayat tentang sabar", AI cari dalam database vector ayat-ayat yang maknanya berkaitan "sabar" walaupun perkataan "sabar" tiada dalam teks.
    *   **Fatwa Retrieval:** Cari fatwa yang paling relevan dengan soalan fiqh pengguna dari database `fatwa_knowledge_base`.

## 3. 🌐 Web Fetcher / Scraper (Puppeteer/Brave)
**Status:** *Perlu untuk Data Real-time*
Untuk dapatkan data yang tiada dalam database anda (data luar).

*   **Contoh Server:** `mcp/puppeteer` atau `mcp/brave-search`
*   **Fungsi dalam QuranPulse:**
    *   **Waktu Solat Fallback:** Jika API JAKIM down, AI boleh "baca" terus dari laman web JAKIM untuk dapatkan waktu solat terkini.
    *   **Semakan Halal:** Pengguna tanya "Adakah produk X halal?", AI boleh search realtime di direktori Halal JAKIM jika database lokal belum update.
    *   **Berita Islamik:** "Apa tarikh puasa sunat akan datang?" - AI cari info terkini di web rasmi.

## 4. 📂 Filesystem Manager (Local Assets)
**Status:** *Penting untuk Development & Media*
Menguruskan fail-fail audio dan imej.

*   **Contoh Server:** `mcp/filesystem`
*   **Fungsi dalam QuranPulse:**
    *   **Audio Management:** "Senaraikan semua fail audio Iqra 1 yang belum ada (404)." AI boleh scan folder `public/audio` dan beritahu mana yang hilang.
    *   **Content Generation:** "Buat fail markdown baru untuk Surah Al-Kahfi." AI boleh cipta fail `.md` terus dalam folder projek.

## 5. 🗣️ Language & Translation Services
**Status:** *Bonus (Enhancement)*
Untuk fitur terjemahan atau tafsir on-the-fly.

*   **Contoh Server:** `mcp/google-translate` atau `mcp/deepl` (Custom)
*   **Fungsi dalam QuranPulse:**
    *   **Tafsir Multibahasa:** Jika tafsir dalam DB hanya Bahasa Melayu, AI boleh guna tool ini untuk terjemah ke Bahasa Inggeris atau Tamil atas permintaan pengguna.
    *   **Transliterasi:** Jana transliterasi rumi untuk teks arab yang kompleks secara automatik.

---

## 🛠️ Contoh Senario Penggunaan (Workflow)

**Situasi:** Pengguna tanya "Ustaz, saya selalu tinggal solat Asar sebab kerja. Apa hukumnya dan macam mana nak ganti?"

**Tanpa MCP:** AI jawab secara umum (hallucination risk).

**Dengan MCP (QuranPulse):**
1.  **MCP Database:** AI semak profil pengguna -> "Oh, dia level Iqra 3 dan umur 25 tahun." (Jawapan disesuaikan ikut umur).
2.  **MCP Vector:** AI cari dalam `fatwa_knowledge_base` -> Jumpa fatwa tentang "Qada solat" dan "Hukum melambat-lambatkan solat".
3.  **MCP Web (Optional):** AI cari artikel ringkas "Tips solat di tempat kerja" untuk bagi nasihat praktikal.
4.  **Jawapan Akhir:** AI gabungkan semua info ini menjadi jawapan yang TEPAT, PERSONAL, dan BERDALIL.

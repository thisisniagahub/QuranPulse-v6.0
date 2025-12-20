# 💸 BARAKAH ENGINE: Sistem Ekonomi Islam Digital

> **Visi:** Mewujudkan kitaran ekonomi yang telus, pantas, dan bermaruah antara penyumbang dan penerima (Asnaf) dalam ekosistem QuranPulse.

---

## 1. Konsep Teras
Sistem ini bukan sekadar tabung derma. Ia adalah **Enjin Pengagihan Automatik** yang menghubungkan 3 entiti:
1.  **Penyumbang (Donor):** Individu yang ingin berinfaq (Wang atau Token AI).
2.  **Penerima (Beneficiary):** Asnaf, Masjid, Pelajar Tahfiz.
3.  **Ekosistem (Marketplace):** Tempat dana dibelanjakan (Souq QuranPulse).

---

## 2. Struktur Dana (The Funds)

### A. Dana Kewangan (Monetary Funds)
*   **Tabung Asnaf:** Agihan terus kepada individu berdaftar.
*   **Tabung Pembangunan:** Untuk fasiliti masjid/surau.
*   **Tabung Pendidikan:** Tajaan yuran/buku untuk pelajar B40.

### B. Dana Digital (Wakaf Token)
*   **Konsep:** Pengguna yang melanggan pakej Premium boleh mewakafkan sebahagian kuota API (Token) mereka.
*   **Penerima:** Pelajar Tahfiz yang perlukan akses Ustaz AI untuk ulangkaji tetapi tiada bajet.
*   **Mekanisme:** Lebihan kuota disalurkan ke `api_keys_pool`.

---

## 3. Aliran Transaksi (The Flow)

### Langkah 1: Sumbangan (Inflow)
*   User pilih Tabung -> Bayar (FPX/Kad) -> `transactions` table direkodkan.
*   Sistem tolak caj gateway (cth: RM1.00). Baki bersih dikreditkan ke `virtual_balance` penerima.

### Langkah 2: Notifikasi & Ketelusan
*   **Penyumbang:** Dapat resit digital & notifikasi: "Alhamdulillah, sumbangan anda telah sampai ke Akaun Pak Ali."
*   **Penerima:** Dapat WhatsApp/Push: "Anda menerima RM50 dari Hamba Allah."

### Langkah 3: Penggunaan Dana (Outflow)
Penerima **TIDAK** perlu keluar duit tunai (elak salah guna). Mereka guna kredit dalam app:
1.  **Beli di Souq:** Beli barangan keperluan asas dari peniaga berdaftar.
2.  **Bayar Yuran:** Auto-tolak ke akaun sekolah tahfiz.
3.  **Reload TNG:** Pindah kredit ke eWallet peribadi (untuk belanja harian).

---

## 4. Kelebihan Sistem Ini
*   **Maruah:** Asnaf "membeli", bukan "meminta-minta".
*   **Speed:** Bantuan sampai dalam saat, bukan hari.
*   **Data Driven:** Kita tahu siapa yang paling memerlukan berdasarkan data penggunaan.
*   **Zero Leakage:** Dana dikawal dalam ekosistem digital.

---

## 5. Roadmap
1.  **Fasa 1:** Tabung Masjid & Asnaf (Manual Withdrawal).
2.  **Fasa 2:** Integrasi Souq (Beli barang guna kredit Infaq).
3.  **Fasa 3:** Wakaf Token AI (Crowdsourced Intelligence).

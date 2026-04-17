# 🕌 Masjid Ecosystem — Community Mosque Network

> **Last Updated**: 21 Feb 2026
> **Status**: Draft
> **Module**: Smart Deen / Community

---

> **Visi:** Mengubah masjid daripada "Bangunan Fizikal" kepada "Hub Komuniti Digital" yang sentiasa terhubung dengan jemaah.

## 1. 📢 Info & Identiti (The Profile)
Bukan sekadar alamat. Ini adalah "CV" Masjid.
*   **Fasiliti:** Ada van jenazah? Ada kerusi roda? Ada lif? Ada dewan nikah?
*   **Kapasiti:** Jumlah jemaah Jumaat.
*   **Sejarah:** Tahun binaan, nama imam besar.
*   **Bank:** QR Code rasmi masjid (Duit masuk terus ke akaun masjid, bukan orang tengah).

## 2. 📅 Jadual Hidup (Live Schedule)
Jadual statik membosankan. Kita buat ia "Hidup".
*   **Kuliah Maghrib:** Siapa ustaz malam ni? Tajuk apa? (User boleh "RSVP").
*   **Kursus:** Kursus Jenazah, Kursus Kahwin, Kem Bestari Solat.
*   **Kenduri/Gotong-Royong:** Ajak komuniti turun padang.
*   **FEATURE KHAS:** *Auto-Sync ke Google Calendar user bila tekan "Hadiri".*

## 3. 💸 Hab Infaq (Smart Donation)
Pendermaan yang spesifik dan telus.
*   **Tabung Khusus:** Bukan satu tabung besar. User pilih: "Saya nak derma RM50 untuk *Tabung Baik Pulih Bumbung*".
*   **Meter Dana:** "Diperlukan: RM10,000. Terkumpul: RM4,500". (Progress bar menaikkan semangat menderma).
*   **Kiosk Tanpa Tunai:** App ini boleh jadi kiosk di masjid (guna tablet).
*   **Langganan Kariah:** RM10/bulan (Auto-debit) untuk jadi ahli kariah premium (dapat laporan kewangan bulanan).

## 4. 📰 Berita & Notifikasi (Community Alert)
*   **e-Jenazah:** Push Notification: "Innalillah... Tuan Hj Ali meninggal dunia. Solat jenazah selepas Asar." (Memudahkan Fardu Kifayah).
*   **Berita Semasa:** "Air masjid tiada hari ini", "Jalan hadapan masjid ditutup".
*   **Smart Khutbah:** Ringkasan khutbah Jumaat dimuat naik setiap minggu. Boleh baca/dengar semula.

## 5. 🤝 Hubungi & Aduan (Helpdesk)
*   **Direct WhatsApp:** Terus ke AJK berkenaan (Biro Kebajikan, Imam, Siak).
*   **Lapor Kerosakan:** User tangkap gambar paip bocor -> Hantar dalam app -> AJK terima notifikasi.
*   **Tempahan Fasiliti:** Booking dewan nikah atau van jenazah dalam app.

## 6. 🧩 Ciri "LUAR KOTAK" (The X-Factor)
*   **Gerobok Rezeki Tracker:** Sensor/Laporan manual status "Gerobok Rezeki". (User tahu bila perlu top-up beras).
*   **Crowd-Parking:** Waze untuk masjid. User lapor "Parking Penuh" waktu Jumaat/Raya.
*   **Ride-to-Masjid:** Carpool sesama jemaah untuk ke masjid (pahala berganda).

---

## 💳 Payment Gateway Integration Strategy

Kita akan guna konsep **"Payment Aggregator Adapter"**. App tak perlu tahu user guna bank apa, ia cuma hantar arahan "Bayar RM50".

### Supported Gateways:
1.  **Billplz / ToyyibPay:** Paling sesuai untuk FPX (Bank Islam, Maybank, CIMB). Caj transaksi rendah (~RM1). Sesuai untuk Infaq Masjid.
2.  **Stripe / Chip:** Untuk Kad Kredit/Debit (Visa/Mastercard). Bagus untuk user antarabangsa atau Auto-Debit bulanan (Subscription).
3.  **Touch 'n Go eWallet:** Melalui integrasi direct atau DuitNow QR dynamic generation.
4.  **Manual Transfer:** Upload resit (untuk masjid yang belum ada payment gateway canggih).

### Aliran Transaksi (User Flow):
1.  Pilih Tabung (cth: "Bina Bumbung").
2.  Masukkan Jumlah (RM50).
3.  Pilih Gateway (FPX / Card / TNG).
4.  Redirect ke Bank/App.
5.  Berjaya -> Update Database -> User dapat "Resit Digital" & "Pahala Points" (Gamification).


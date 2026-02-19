# Product Requirements Document (PRD) - NiagaHub SuperApp

## 1. Executive Summary
**NiagaHub SuperApp** adalah platform pengurusan perniagaan semua-dalam-satu yang diperkasakan oleh Kepintaran Buatan (AI). Ia direka untuk membantu usahawan mengurus operasi, menganalisis data, dan mengautomasikan tugasan menggunakan "AI Agents" yang pintar.

Sistem ini membezakan dirinya dengan penggunaan **Multi-Key LLM Rotation** (untuk kestabilan API) dan **Redis Caching** (untuk kepantasan dan penjimatan kos).

## 2. Objektif Perniagaan
*   **Automasi:** Mengurangkan beban kerja manual melalui ejen AI.
*   **Kestabilan:** Memastikan perkhidmatan AI sentiasa tersedia (Zero Downtime) walaupun satu API Key mencapai had penggunaan.
*   **Prestasi:** Memberikan respon serta-merta untuk pertanyaan berulang melalui caching.

## 3. Sasaran Pengguna (User Personas)
*   **Super Admin:** Menguruskan konfigurasi sistem, API Keys, dan memantau prestasi ejen.
*   **Peniaga (Merchant):** Menggunakan dashboard untuk melihat analitik jualan dan berinteraksi dengan AI untuk nasihat perniagaan.

## 4. Ciri-Ciri Utama (Functional Requirements)

### 4.1 Modul AI & Ejen (The Core)
*   **AdkAgent:** Ejen pintar yang memproses pertanyaan bahasa semulajadi.
*   **Multi-Model Support:** Integrasi utama dengan Google Gemini 1.5 Flash.
*   **API Key Rotation:** Sistem automatik yang menukar API Key jika berlaku ralat "Rate Limit" (429).
*   **Context Awareness:** Ejen mampu mengingati konteks perbualan terdahulu.

### 4.2 Pengurusan Data & Caching
*   **Redis Integration:** Menyimpan soalan dan jawapan AI untuk tempoh masa tertentu (TTL).
*   **Hit/Miss Logic:**
    *   *Hit:* Pulangkan data dari Redis (0ms latency, kos $0).
    *   *Miss:* Panggil Gemini API -> Simpan dalam Redis -> Pulangkan jawapan.

### 4.3 Dashboard Admin
*   Paparan status API Keys (Active/Quota Exceeded).
*   Log aktiviti ejen.

## 5. Keperluan Bukan Fungsian (Non-Functional Requirements)
*   **Latency:** Respon AI < 2 saat (tanpa cache), < 50ms (dengan cache).
*   **Security:** API Keys disimpan dalam `.env.local` dan tidak didedahkan di client-side.
*   **Scalability:** Struktur kod mestilah modular (berasaskan Ejen) untuk penambahan ciri masa depan.

## 6. Metrik Kejayaan (KPI)
*   Pengurangan kos panggilan API sebanyak 40% melalui caching.
*   Uptime sistem AI > 99.9% hasil daripada penggiliran API Key.

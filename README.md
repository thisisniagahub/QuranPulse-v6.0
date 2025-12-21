# QuranPulse v6.0 — Project Status & Master Guide

> **Current Architecture:** Monorepo (Web App + Admin Dashboard + Bot Server)
> **Latest Audit:** December 21, 2025

## 📊 Status Tally (Live Verification)

This table reflects the actual state of the codebase versus the requirements.

| Core Component | Status | Code Reality (Evidence) |
| :--- | :--- | :--- |
| **Backend (Supabase)** | ✅ **READY** | Full Schema in `supabase/migrations/`. Includes `profiles`, `iqra_progress`, `payments`, etc. |
| **Main Web App** | ✅ **READY** | `src/modules` contains `Quran`, `Iqra`, `Ibadah`, `Media` logic. |
| **AI Intelligence** | ✅ **READY** | `aiService.ts` implements Hybrid Engine (Groq/Gemini). `chat-proxy` Edge Function configured. |
| **Bot Ecosystem** | ✅ **READY** | `scripts/start_tok_imam.ts` runs both WhatsApp (`whatsapp-web.js`) and Telegram (`telegraf`). |
| **Admin Dashboard** | ⚠️ **PARTIAL** | Logic exists in `adminService.ts` (with some mocks), but `admin-dashboard/` folder is a basic skeleton. |
| **Monetization** | ⚠️ **MOCK** | `PaymentService` and `CheckoutModal` exist but use "Mock/Simulator" mode. |
| **Iqra Content** | ✅ **READY** | Digitized content for Iqra 1-6 found in `src/modules/iqra/data`. |

---

## 🏗️ Project Structure (Where is everything?)

```text
H:\ANTIGRAVITY\QURANPULSE-V6.0\
├── 📂 src/                      # MAIN APP (React + Vite)
│   ├── 📂 modules/              # Features (The "Meat")
│   │   ├── 📂 quran/            # Quran Reader & Verse Studio
│   │   ├── 📂 iqra/             # Iqra Digital (Voice/Vision Coach)
│   │   ├── 📂 ibadah/           # Prayer Times & Qibla
│   │   └── 📂 admin/            # (Client-side Admin views)
│   ├── 📂 services/             # Logic Layer
│   │   ├── aiService.ts         # The "Brain" (Gemini/Groq)
│   │   ├── whatsappService.ts   # Tok Imam Logic
│   │   └── adminService.ts      # Admin Logic (Mock + Real)
│
├── 📂 supabase/                 # BACKEND
│   ├── 📂 migrations/           # Database Schema (PLAM, Barakah, etc.)
│   └── 📂 functions/            # Edge Functions (chat-proxy)
│
├── 📂 scripts/                  # BOTS & UTILS
│   ├── start_tok_imam.ts        # 🟢 ENTRY POINT for Bots
│   └── env-loader.ts            # Env var helper
│
├── 📂 admin-dashboard/          # ADMIN PANEL (Next.js)
│   └── (Currently a basic scaffold/skeleton)
│
└── 📂 DOCS_VAULT/               # DOCUMENTATION
    ├── 00_CORE_CONTEXT/         # PRD, Architecture, Status
    └── ...
```

---

## ❓ "Backend Ada Ke?" (Backend Status)

**Yes, but it is "Serverless".** we don't have a traditional `server.js` (Express). Instead:
1.  **Database**: Postgres hosted on Supabase (Schema defined in `supabase/migrations`).
2.  **API**: We use `supabase-js` client to talk directly to DB (protected by RLS policies).
3.  **Functions**: Sensitive logic (AI keys) runs in **Supabase Edge Functions**.
4.  **Bots**: The "Server" for bots is `scripts/start_tok_imam.ts`.

---

## 📝 What is Missing? (The "To-Do" List)

1.  **Admin Dashboard UI**:
    *   The `admin-dashboard` folder needs to be built out. Currently only `adminService.ts` logic exists.
    *   *Action*: Connect `adminService.ts` to visual charts in the Next.js app.

2.  **Real Payment Integration**:
    *   `PaymentService` is mocking successful payments.
    *   *Action*: Replace mocks with real ToyyibPay/Stripe API calls.

3.  **Data Seeding**:
    *   Database tables exist but might be empty.
    *   *Action*: Need to run seed scripts to populate initial Verse/Hadith data if not fetching from API.

---

## 🚀 How to Run (Sequence)

1.  **Start the Bots (Terminal 1)**:
    ```powershell
    npx tsx scripts/start_tok_imam.ts
    ```
    *(Scan QR code when it appears)*

2.  **Start the Main App (Terminal 2)**:
    ```powershell
    npm run dev
    ```

3.  **Start the Admin Dashboard (Terminal 3)**:
    ```powershell
    cd admin-dashboard
    npm run dev
    ```

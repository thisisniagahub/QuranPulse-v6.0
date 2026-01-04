# 🛠️ Product Requirements Document (PRD): QuranPulse v6.0 (Technical Baseline)

**Status:** 🚧 Alpha (Development Phase)
**Current Reality:** Hybrid (Supabase Ready, Admin UI Missing, Payment Mocked)
**Last Audit:** Jan 4, 2026

---

## 1. Core Architecture (Current State)
*   **Frontend:** React 18 + Vite (Stable).
*   **Backend:** Supabase (Auth & DB verified).
*   **Intelligence:** 
    *   MCP Servers (`worship`, `quran`, `zakat`) implemented locally in `supabase/functions`.
    *   **CRITICAL:** Edge Functions need deployment to Supabase Cloud to work in Production.

---

## 2. Feature Implementation Matrix

| Feature Module | Status | Codebase Reality | What is MISSING? |
| :--- | :--- | :--- | :--- |
| **Auth & User** | 🟢 **Ready** | `AuthContext` + RLS Policies active. | - |
| **Quran Reader** | 🟢 **Ready** | Fast load, Uthmani script rendering. | - |
| **Iqra Voice** | 🟡 **Partial** | UI exists. Logic points to `localhost`. | **Backend ASR Python** tidak di-host di Cloud. |
| **Worship (Solat)** | 🟢 **Ready** | MCP Worship (JAKIM + Fallback) logic done. | Perlu test `cache` hit/miss di production. |
| **Admin Panel** | 🔴 **Critical** | Logic (`adminService`) wujud. UI (`admin-dashboard`) **KOSONG**. | Tiada Frontend untuk Admin. |
| **Payments** | 🔴 **Fake** | `paymentService` guna Mock Data. | Tiada integrasi Stripe/ToyyibPay sebenar. |
| **Legacy Data** | 🟠 **Risk** | `apiClient.ts` (Google Sheets) masih wujud. | Perlu refactor buang kod lama sepenuhnya. |

---

## 3. Technical Debt (Hutang Teknikal)
Perkara ini perlu diselesaikan sebelum "Official Launch":

1.  **Remove Google Sheets Legacy:**
    *   `src/services/apiClient.ts` masih mengandungi logik lama. Sistem kini keliru antara data Supabase vs Google Sheets.
    *   **Action:** Delete `apiClient.ts` dan pastikan semua component guna `supabase.ts`.

2.  **Hardening Admin Route:**
    *   Baru dibaiki (`AdminRoute.tsx`), tetapi perlu E2E test untuk pastikan tiada *loophole*.

3.  **Deploy MCP Functions:**
    *   Kod ada dalam folder `supabase/functions/`, tetapi belum hidup di server sebenar.
    *   **Action:** Jalankan `supabase functions deploy`.

---

## 4. Immediate Roadmap (The "Fix-It" List)

### Priority 1: Backend Cleanup
*   [ ] Deploy semua 5 MCP functions ke Supabase Cloud.
*   [ ] Buang fail `apiClient.ts` (Legacy).

### Priority 2: Admin Dashboard UI
*   [ ] Bina halaman `Overview` (Stats).
*   [ ] Bina halaman `Users` (Table list + Ban button).
*   [ ] Sambungkan UI ini dengan `src/services/adminService.ts`.

### Priority 3: Payment Integration
*   [ ] Daftar akaun ToyyibPay/Stripe sebenar.
*   [ ] Gantikan Mock logic dalam `paymentService.ts` dengan API sebenar.

---
*Dokumen ini merekodkan status SEBENAR kod, bukan status "marketing".*

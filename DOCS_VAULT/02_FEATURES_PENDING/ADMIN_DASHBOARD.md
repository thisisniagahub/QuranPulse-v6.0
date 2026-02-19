# 🦅 QuranPulse Admin Dashboard (Mission Control) — The Comprehensive Blueprint

> **Role:** The Central Command Center for the QuranPulse Ecosystem.
> **Target Audience:** Administrators, Content Moderators, Financial Controllers.
> **Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, Supabase, Recharts.

---

## 1. 📋 Executive Summary (PRD)

The **Admin Dashboard** is not just a CMS; it is a "God Mode" interface that allows the QuranPulse team to monitor the digital spiritual pulse of the user base. It bridges the gap between **Raw Data** (Database) and **Actionable Insights** (Strategy).

### Core Objectives
1.  **User Management (CRM):** Monitor user growth, subscription tiers (Free vs Pro vs Family), and manage support tickets.
2.  **Content Operations (CMS):** Manage dynamic content like "Daily Doa", "Featured Videos", and specialized "Ramadan Campaigns".
3.  **AI Oversight (The Brain):** Monitor `Ustaz AI` performance, flag hallucinations, and review "Human Handoff" cases.
4.  **Financials (Barakah):** Track Infaq (Donations) transparency, Subscription Revenue (MRR), and Affiliate payouts.
5.  **Official Data Sync:** Status monitor for JAKIM/E-Solat API connectors (MCP Servers).

---

## 2. 🏗️ Tech Stack & Strategy

### 2.1 The Stack
| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15** | Server Components for speed, App Router for clean layout. |
| **UI Library** | **Shadcn/UI** | Professional, copy-paste components, accessible. |
| **Styling** | **Tailwind CSS v4** | Rapid development, consistent design system. |
| **Data Layer** | **Supabase Auth & DB** | Native integration with the main app's backend. |
| **Visuals** | **Recharts** | Lightweight, responsive charts for analytics. |
| **Icons** | **Lucide React** | Consistent, clean iconography. |

### 2.2 Project Structure (Scaffold)
```bash
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx       # Admin Login
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              # Sidebar + Header
│   │   │   ├── page.tsx                # Overview (Stats)
│   │   │   ├── users/page.tsx          # CRM
│   │   │   ├── content/page.tsx        # CMS
│   │   │   ├── finance/page.tsx        # Infaq & Revenue
│   │   │   └── ai-monitor/page.tsx     # Ustaz AI Logs
│   ├── components/
│   │   ├── ui/                         # Shadcn Components
│   │   ├── charts/                     # Recharts Wrappers
│   │   └── layout/                     # Sidebar, UserNav
│   ├── lib/
│   │   └── supabase/                   # Admin Client (Service Role)
```

---

## 3. 🗺️ Sitemap & Wireframes

### 3.1 🏠 Overview (Dashboard Home)
**"The Pulse at a Glance"**
*   **KPI Cards (Top Row):**
    *   Total Users (Active/Total)
    *   MRR (Monthly Recurring Revenue)
    *   Total Infaq Collected (This Month)
    *   AI Query Volume (24h)
*   **Charts:**
    *   **User Growth Curve** (Line Chart): Free vs Pro users.
    *   **Prayer Consistency** (Bar Chart): Average prayers tracked per user/day.
*   **Recent Activity:**
    *   Live feed of "New User Signed Up", "Infaq Received RM50", "Halal Scan Performed".

### 3.2 👥 User Management (CRM)
**"Know Your Ummah"**
*   **Data Table:**
    *   `Name`, `Email`, `Tier` (Badge: Free/Pro), `Last Active`, `Actions`.
*   **Features:**
    *   **Tier Override:** Manually upgrade a user to PRO (e.g., for customer support/compensation).
    *   **Ban/Suspend:** Disable bad actors.
    *   **Impersonate:** "View as User" to debug issues (Critical for support).

### 3.3 📝 Content Management (CMS)
**"Feed the Soul"**
*   **Modules:**
    *   **Banner Manager:** Upload promo images for the Main App specific slots (Ramadan, Friday).
    *   **Notification Center:** Send Push Notifications (FCM) to all users (e.g., "Waktu Imsak in 10 mins").
    *   **Curated Videos:** Add YouTube links for the "Media Studio".

### 3.4 🤖 AI Monitor (Intelligence)
**"Watch the Watchman"**
*   **Chat Logs:** View anonymized conversations to improve `Ustaz AI` quality.
*   **Hallucination Flagging:** Interface to "Correct" an AI answer. These corrections are saved to `ai_knowledge_base` (RLHF).
*   **Usage Costs:** Track Token usage (Groq/Gemini) vs Budget.

### 3.5 💰 Finance & Barakah
**"Trust & Transparency"**
*   **Infaq Ledger:** List of all donations with "Proof of Distribution" upload (PDF).
*   **Subscription Analytics:** Churn rate, LTV (Lifetime Value).
*   **Merchant Settings:** Keys for ToyyibPay / Stripe.

---

## 4. 🗄️ Database & ERD Connection

The dashboard connects directly to the Supabase Postgres instance. It relies on these key tables:

### Core Tables
1.  `profiles`: The source of User CRM data.
2.  `payments`: Transaction logs for Revenue charts.
3.  `ai_conversations`: Source for AI Monitor.
4.  `official_mosques`: Verified data managed by admins.

### Admin-Only Tables (To be created)
```sql
create table admin_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references profiles(id),
  action text not null, -- e.g. "BANNED_USER", "UPDATED_BANNER"
  target_resource text,
  details jsonb,
  created_at timestamptz default now()
);

create table content_banners (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  link_url text,
  active boolean default true,
  start_date timestamptz,
  end_date timestamptz
);
```

---

## 5. 💡 Innovation & Strategy (Future Roadmap)

### 5.1 "Digital Masjid" Data Scraping
*   **Concept:** Use the Admin Dashboard to trigger MCP Agents (`puppeteer`) to scrape local mosque websites for event data.
*   **UI:** A "Scraper Status" panel showing which mosques have been updated recently.

### 5.2 "Suara Surau" Hotline Logs
*   **Concept:** If we implement the VoIP hotline for rural seniors, the Admin Dashboard will show "Voice Logs".
*   **UI:** Audio player to listen to user queries and the AI's spoken response.

### 5.3 "Wakaf Node" Fleet Manager
*   **Concept:** Manage the physical Raspberry Pi servers deployed in rural areas.
*   **UI:** Map view showing "Online/Offline" status of each Wakaf Node box.

---

## 6. 🧠 MCP Integration Strategy (Tech Expansion)

The Admin Dashboard is the **Controller** for our MCP Agents.

| Agent Name | Function | Admin Oversight |
| :--- | :--- | :--- |
| `jakim_connector` | Scrapes Halal/Solat data. | View "Last Sync" timestamp. Trigger manual sync. |
| `fatwa_ingestor` | Vectorizes E-Fatwa articles. | View "Knowledge Base Size". Upload manual fatwa PDFs. |
| `audit_bot` | Checks DB for anomalies. | View "Security Alerts" (e.g., unusual login patterns). |

---

## 7. 🏢 Competitor & Benchmark Analysis

### 7.1 Private Sector (The Bar to Beat)
*   **MuslimPro:** Great UI, but ad-heavy. **Our Admin Dash** must ensure we optimize "No-Ad" revenue streams (Infaq/Premium) effectively to sustain this.
*   **TheNoor:** High influencer engagement. **Our Admin Dash** needs a "Referral/Influencer" tracking tab to manage similar campaigns.
*   **Qara'a:** AI Voice. **Our Admin Dash** needs a "Voice Analysis" tab to see common pronunciation errors across the user base (to improve curriculum).

### 7.2 Official Data (The Foundation)
*   **JAKIM:** The authoritative source. We must never contradict them.
*   **Strategy:** The Admin Dashboard should have a "Compliance Check" indicator that turns RED if our data deviates from JAKIM's official API source.

---

## 8. 🧪 Testing & Validation

### 8.1 Testing Strategy
1.  **Unit Tests:** Jest for utility functions (e.g., Revenue Calculators).
2.  **E2E Tests:** Playwright for critical Admin flows (e.g., "Ban User", "Publish Banner"). *Admins breaking things is dangerous.*
3.  **Role Testing:** Verify that a "Moderator" cannot access "Financial" pages.

### 8.2 Deployment
*   **Host:** Vercel (Same as main app, separate project or sub-path).
*   **Environment:** Needs `SUPABASE_SERVICE_ROLE_KEY` (unlike the main app which uses Anon key) to bypass RLS for admin actions.

---

## 9. 🚀 Backend & README (For Developers)

### Getting Started
1.  **Navigate:** `cd admin-dashboard`
2.  **Install:** `npm install`
3.  **Env:** Copy `.env.example` to `.env.local`
    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=... # CRITICAL for Admin rights
    ```
4.  **Run:** `npm run dev` (Port 3000)

### Key Files
*   `src/lib/supabase.ts`: customized client using Service Role key.
*   `src/services/adminService.ts`: The core logic layer (API calls).
*   `src/middleware.ts`: Protections to ensure only users with `role: 'admin'` can access any route in `/src/app`.

---

**[End of Admin Dashboard Master Plan]**

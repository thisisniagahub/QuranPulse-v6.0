# Admin Dashboard Implementation Blueprint (Mission Control)

> **Status:** Critical Review & Implementation Plan
> **Current State:** Empty Next.js 15 Scaffold
> **Target:** Full-featured "Mission Control" for QuranPulse.

---

## 🧐 Review of Current Dashboard
The current `ADMIN-DASHBOARD` folder is a raw Next.js initialization (`create-next-app`).
**Missing Components:**
*   ❌ UI Component Library (shadcn/ui)
*   ❌ State Management (Zustand)
*   ❌ Database ORM Client (Prisma)
*   ❌ Auth Handling (Middleware)
*   ❌ Navigation/Layout Structure

---

## 🛠️ Implementation Plan

### 1. Technology Stack Upgrades
We need to install these dependencies immediately:
```bash
# UI Core
npx shadcn@latest init # Select 'Neutral', 'CSS Variables'
npm install lucide-react recharts clsx tailwind-merge

# Data & State
npm install @tanstack/react-query zustand
npm install prisma @prisma/client
```

### 2. Feature Architecture

#### A. User Management (CRM)
**Path:** `/dashboard/users`
**Features:**
*   List View: Sort by `Subscription Tier` (PRO/FAMILY).
*   Search: By Email/UUID.
*   **Impersonate**: "Login As User" button (Generates a specialized refined JWT token).

#### B. Content Operations (CMS)
**Path:** `/dashboard/content`
**Features:**
*   **Official Data Sync Monitor**: Visual indicator of valid data vs JAKIM API.
*   **Compliance Check**: "Traffic Light" system for content correctness.
*   Editor: Standard JSON/Form editor for `Ayah` or `Tafsir` metadata.

#### C. AI Oversight (RLHF)
**Path:** `/dashboard/ai-oversight`
**Features:**
*   **Flagged Conversations**: Review chats flagged by regex filters.
*   **Thumb-Down Review**: See user negative feedback.
*   **Prompt Playground**: Test system prompts against "Golden Queries" (e.g., "Hukum Bitcoin").

#### D. Financial Dashboard
**Path:** `/dashboard/finance`
**Features:**
*   **MRR Display**: Calculated from active Stripe/ToyyibPay subscriptions.
*   **Infaq Tracker**: Total donations received.
*   **Churn Rate**: Users cancelling this month.

---

## 💡 Advanced Tools Recommendations

1.  **Trigger.dev (Background Jobs)**:
    *   *Usage*: Sync JAKIM Prayer Times daily at 3 AM.
    *   *Why*: Better than Cron; gives full observability/logging.
2.  **PostHog (Product Analytics)**:
    *   *Usage*: Detailed user conversion funnels (Signup -> Read -> Subscribe).
    *   *Why*: "Session Recording" lets you watch users struggle with UI.
3.  **Novu (Notification Infrastructure)**:
    *   *Usage*: Send "Subscription Expiring" emails or "Jumaat Reminder" push.
    *   *Why*: Unified API for Email, SMS, Push.
4.  **Sentry (Error Tracking)**:
    *   *Usage*: Catch "White Screen" crashes in Admin panel.

---

## 💻 Folder Structure (Proposed)

```text
src/
├── app/
│   ├── dashboard/
│   │   ├── users/
│   │   ├── content/
│   │   ├── ai-oversight/
│   │   ├── finance/
│   │   └── page.tsx (Overview)
│   └── layout.tsx (Sidebar + Header)
├── components/
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── UserTable.tsx
│   │   └── SyncStatus.tsx
│   └── ui/ (shadcn)
├── lib/
│   ├── prisma.ts
│   └── utils.ts
```

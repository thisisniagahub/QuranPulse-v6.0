# QuranPulse v6.0 - 30-Day MVP Execution Plan

> **Role:** Technical Product Manager Report
> **Objective:** Beta Launch in 30 Days (Solo Developer)
> **Budget:** $0.00 (Free Tiers Only)
> **Constraint:** 12 hrs/day intensity

---

## 🏗️ Module Breakdown & Specs

### 1. Authentication & User Profiles
**Priority:** [P0] Critical
**Description:** The gateway to the app. Must be rock-solid to prevent "Day 1 Churn".
**Core Features:**
*   Social Login (Google) via Supabase Auth.
*   Guest Mode (use app without login, gate sync features).
*   Profile Management (Name, Theme Preference).
**Dependencies:** `supabase.auth`, `profiles` table.
**Implementation Sequence:**
1.  Setup Supabase Auth Google Provider.
2.  Create `AuthGuard` wrapper for protected routes.
3.  Build Login/Register UI with glassmorphism.
4.  Implement `onAuthStateChange` listener for syncing Profile data.
**Effort:** 12 Hours (Realistic)
**Success Criteria:**
*   [ ] User can sign up with Google in < 5 seconds.
*   [ ] Refreshing page persists session.
*   [ ] "Guest" user can read Quran but sees "Sign in to Save" on Bookmark.
**Cut from MVP:** Phone Number Auth (Cost), 2FA (Complexity).
**Risk:** Low.

### 2. Quran Reader (The Retention Engine)
**Priority:** [P0] Critical
**Description:** The daily driver feature. Must feel better than other apps.
**Core Features:**
*   Virtual Scroll (TanStack Virtual) for 604 pages performance.
*   Audio Playback (Verse by Verse) with auto-scroll.
*   Translation/Tafsir Modal.
**Dependencies:** `quran.com` API (or local JSON), `howler.js` (Audio).
**Implementation Sequence:**
1.  Optimize `QuranReader.tsx` scroll performance (crucial).
2.  Fix Audio Context "Race Conditions" (playing 2 tracks).
3.  Polish "Verse Menu" (Share, Copy, Tafsir).
**Effort:** 30 Hours (Realistic)
**Success Criteria:**
*   [ ] Scrolling is 60fps on mobile.
*   [ ] Audio continues to play when screen dims (if PWA allowed).
*   [ ] Switching Surah is instantaneous (<200ms).
**Cut from MVP:** Word-by-word grammar analysis (Too much data), Social Sharing Image Generator (Canvas API is flaky).
**Risk:** Medium (Audio state management is tricky).

### 3. Iqra Digital (The UVP / Moat)
**Priority:** [P0] Critical
**Description:** The reason people pay. Digital self-learning tool.
**Core Features:**
*   **Book Viewer:** PDF/Image render of Iqra 1-6.
*   **Teacher Audio:** Click text to hear correct pronunciation.
*   **Recording:** "Press to Record" user voice.
*   **Self-Check:** Playback user voice immediately after recording.
**Dependencies:** `react-pdf`, Web Audio API, `iqra_progress` table.
**Implementation Sequence:**
1.  Implement `IqraBookViewer` (Flipbook or Scroll).
2.  Map "Click Zones" on pages to Teacher Audio files.
3.  Build `VoiceRecorder` component.
4.  Save progress logic (Stars/XP).
**Effort:** 60 Hours (Realistic)
**Success Criteria:**
*   [ ] User can open Iqra 1, Page 1.
*   [ ] Click "Alif" -> Hear "Alif".
*   [ ] Record self -> Playback self clearly.
**Cut from MVP:** **Real-time AI Pronunciation Scoring**. 
*Rationale:* Developing a reliable Tajweed AI model is a 6-month PhD project. Using generic Speech-to-Text APIs (OpenAI/Google) for Arabic/Quranic pronunciation is inaccurate and hallucinates.
*Alternative:* Use **"Self-Reflection Loop"** (Listen -> Record -> Compare). It is pedagogically sound and technically simple.
**Risk:** High (Content Digitization requires mapping audio coordinates manually).

### 4. AI Chat "Tanya Ustaz"
**Priority:** [P1] High Value
**Description:** Engagement driver. Users ask religious questions comfortably.
**Core Features:**
*   Chat UI with Streaming Response.
*   System Prompt enforcement ("Mazhab Syafi'i", "Cite sources").
*   Rate Limiting (prevent API abuse).
**Dependencies:** Gemini Flash (Free Tier), `chat-proxy` Edge Function.
**Implementation Sequence:**
1.  Refine System Prompt in `aiService.ts`.
2.  Build Chat UI with `react-markdown`.
3.  Implement "Standard Questions" chips (Niat Puasa, Doa).
**Effort:** 15 Hours
**Success Criteria:**
*   [ ] "Assalam Ustaz" -> Replies correctly.
*   [ ] Source citations are formatted as links.
**Cut from MVP:** Image Analysis (Scanning food ingredients), Voice Mode.
**Risk:** Low (API is stable).

### 5. Subscriptions & Payments
**Priority:** [P1] Revenue
**Description:** Gatekeeper for Pro features (AI + Advanced Iqra).
**Core Features:**
*   Pricing Page (Free vs Pro).
*   Payment Gateway Integration (ToyyibPay/Stripe).
*   Webhook Handler (Update DB status).
**Dependencies:** `payment_transactions` table, Payment Provider API.
**Implementation Sequence:**
1.  Create `UpgradeModal`.
2.  Implement `ToyyibPay` redirect flow.
3.  Create secure Webhook endpoint in Supabase Functions.
**Effort:** 20 Hours
**Success Criteria:**
*   [ ] Click "Upgrade" -> Redirect to Bank -> Success -> Redirect Back.
*   [ ] Profile shows "PRO" badge immediately.
**Cut from MVP:** Complex Family Plans, Gift Cards.
**Risk:** Medium (Webhook reliability).

### 6. Admin Dashboard
**Priority:** [P3] Defer
**Rationale:** You are a solo dev. You *are* the admin. Use the **Supabase Dashboard** to view users/stats. Don't waste 20 hours building a custom admin UI for yourself.
**Substitute:** Use SQL queries to get "Daily Active Users".

---

## 📅 The 30-Day Battle Plan

### Phase 1: The Iron Foundation (Days 1-7)
*   **Goal:** App works, User can login, Database is ready.
*   **Tasks:**
    *   Initialize Next.js + Supabase.
    *   Apply SQL Schema (from `DOCUMENTATION/DB_SCHEMA_MVP.sql`).
    *   Build Layouts (Navbar/Sidebar).
    *   **Deliverable:** Working "Shell" deployed to Vercel.

### Phase 2: Core Utility - Quran (Days 8-14)
*   **Goal:** Best reading experience in class.
*   **Tasks:**
    *   Implement `QuranReader` with virtual scroll.
    *   Integrate Audio Player (Context).
    *   Add Search functionality.
    *   **Deliverable:** Fully functional Quran app (comparable to existing competitors).

### Phase 3: The Moat - Iqra Digital (Days 15-24)
*   **Goal:** Unique feature that justifies payment.
*   **Tasks:**
    *   Build PDF/Image Viewer for Iqra books.
    *   Manual labour: Map audio timestamps/coordinates for Book 1 (Page 1-10). *Start small.*
    *   Build Recorder Component.
    *   **Deliverable:** Iqra Book 1 Playable Demo.

### Phase 4: Intelligence & Revenue (Days 25-28)
*   **Goal:** Turn it into a business.
*   **Tasks:**
    *   Connect Gemini AI.
    *   Implement "Paywall" (Gate Iqra Book 2+ and Unlimited AI).
    *   Integrate Payment Gateway.
    *   **Deliverable:** Ability to take money.

### Phase 5: Launch Prep (Days 29-30)
*   **Goal:** No crashing on Day 1.
*   **Tasks:**
    *   Legal: Privacy Policy & Terms (Generic).
    *   Smoke Testing: Login -> Read -> Record -> Chat -> Pay.
    *   **Launch:** Post on Twitter/Mukmin Pro/local groups.

---

## 🚦 Critical Path Analysis

**The "Do of Die" Chain:**
1.  **Auth works** -> otherwise no user data.
2.  **Payment works** -> otherwise no revenue.
3.  **Iqra Audio works** -> otherwise no UVP (just another Quran app).

**Strategic Cut:**
I have removed **AR Vision Coach** from the MVP.
*   *Why?* Browser-based computer vision (TensorFlow.js) is heavy (4MB+ download), drains battery, and depends heavily on lighting. A "bad" AI detection experience is worse than "no" AI.
*   *Replace with:* **Audio-First Coaching**. It's reliable, lower bandwidth, and focuses on the core skill (Recitation).

## 🚀 Final Recommendation

**"Build less, Polish more."**
A bug-free Audio Player is valuable. A buggy AR Camera is a liability. Focus on the smooth "Apple-like" feel of the interface (Glassmorphism, transitions) to signify "Premium" status without needing complex tech.

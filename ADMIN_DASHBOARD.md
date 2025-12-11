# 🛡️ QURANPULSE v6.0 — ADMIN DASHBOARD (Mission Control)

> **Role:** Central Command Center for QuranPulse Operations.
> **Access:** Restricted to Super Admin, Admins, and Moderators.
> **Tech Stack:** React (Vite), Tailwind CSS, Supabase (with RLS), Recharts.

---

## 1. 👥 User Management (Pengurusan Pengguna)
*Complete control over the user base (Target: 10k+).*

*   **User Registry:**
    *   View all registered users with pagination & search (Email, Name, ID).
    *   Filter by **Tier** (Free, Pro, Family) or **Status** (Active, Banned).
*   **Profile Actions:**
    *   **Edit Profile:** Modify details on behalf of user (e.g., fix typos).
    *   **Tier Management:** Manually upgrade/downgrade subscription tiers (e.g., "Gift Pro").
    *   **Ban System:** Suspend accounts violating community guidelines (with 'Reason' log).
    *   **Password Reset:** Send password reset emails for support tickets.
*   **Family Groups:** View Family structures (Head of Family + Members).
*   **Activity Logs:** Track last login IP, device, and recent actions.

## 2. 📚 Content Management System (CMS)
*Single source of truth for all static and dynamic Islamic content.*

### 🤲 Doa & Zikir Library
*   **CRUD Operations:** Add new Doa, edit translations (BM/EN), delete duplicates.
*   **Audio Manager:** Upload/Replace MP3 recitations for each Doa.
*   **Categorization:** Tag by occasion (Pagi, Petang, Solat, Musafir, etc.).

### 📖 Quran Content (Critical)
*   **Integrity Check:** SHA-256 hash verification tool for Uthmani text.
*   **Translation Editor:** Update/Correct translations (Jalalayn, Sahih Intl).
*   **Audio Mapping:** Manage Surah/Ayah audio files from different Qaris.
*   **Tafsir Manager:** Upload/Edit tafsir notes for specific ayahs.

### 🎓 Iqra Curriculum (Learning Engine)
*   **Lesson Editor:** Upload page images (`.webp`) for Iqra Vol 1-6.
*   **Objectives:** Define learning goals for each page (e.g., "Makhraj 'Ha'").
*   **Exercise Builder:** Crate quizzes/audio tests for each level.
*   **Pronunciation Guide:** Upload teacher's demo audio for phonetics.

## 3. 🤖 AI Monitoring & Quality Control (Ustaz AI)
*Ensuring AI safety, accuracy, and cost efficiency.*

*   **Conversation Logs:** anonymized view of user-AI interactions (for QA).
*   **Hallucination Watch:** Flag responses marked "Inaccurate" by users.
*   **Fatwa Verification Queue:** Review AI-generated fatwa citations against `fatwa_knowledge_base`.
*   **Cost Management:**
    *   Track API Token usage (Input/Output).
    *   **Key Rotation:** Dashboard to manage Zhipu AI API keys (Status, Quota).
*   **Manual Override:** Ability to correct/rewrite AI answers in the cache.

## 4. 🏛️ Islamic Compliance Dashboard (JAKIM)
*Maintaining the highest standard of Shariah trust.*

*   **Prayer Times Audit:** Daily random check comparing app times vs e-Solat.gov.my.
*   **Content Queue:**
    *   Priority queue for content awaiting "Scholar Review".
    *   Community reports on questionable content.
*   **Halal Data Sync:** Status indicator for SmartHalal database sync.

## 5. 📊 Analytics & Reporting
*Data-driven decision making.*

*   **User Metrics:**
    *   DAU (Daily Active Users) / MAU (Monthly Active Users).
    *   Conversion Rate (Free → Pro).
    *   Retention Rate (Cohorts: D7, D30).
    *   Churn Analysis (Why users leave).
*   **Learning Stats:**
    *   Avg. Iqra Level across users.
    *   Quran completion rates (Khatam count).
    *   Most read Surahs.
*   **Revenue:** MRR (Monthly Recurring Revenue), ARR, LTV (Lifetime Value).
*   **Export:** CSV/PDF export for boardroom meetings (Investor Relations).

## 6. 💳 Subscription & Payment Management
*Financial operations hub.*

*   **Active Subscriptions:** List of all paying members & expiry dates.
*   **Transaction Handler:**
    *   View payment history (Stripe/Billplz).
    *   **One-Click Refund:** Process refunds for disputed charges.
    *   Handle "Failed Payment" retries.
*   **Invoicing:** Generate manual invoices for corporate bulk purchases.
*   **Promo Codes:** Create/Manage discount coupons (e.g., `RAMADAN2025`).

## 7. 🎮 Gamification Control
*Managing the "Pulse" engagement economy.*

*   **Badges:** Create/Edit achievement badges (Icon, Name, Criteria).
*   **XP Strategy:** Configure XP multipliers (e.g., "Double XP Friday").
*   **Leaderboard:** Moderation of usernames on public leaderboards.
*   **Events:** Set up limited-time challenges (e.g., "30 Days Khatam").

## 8. 👨‍👩‍👧‍👦 Family Plan Administration
*Managing multi-user accounts.*

*   **Group Oversight:** View all Family clusters.
*   **Dispute Resolution:** Force-remove members or transfer "Head" ownership.
*   **Limit Enforcement:** Monitor 6-member limit per family.

## 9. 🏪 Marketplace (Souq) Management
*Halal e-commerce oversight.*

*   **Vendor Approval:** Review applications for new sellers.
*   **Product Moderation:** Approve/Reject product listings (Halal check).
*   **Order Oversight:** Monitor dispute cases and shipping delays.
*   **Commission:** Track platform fees collected.

## 10. 💝 Donation (Barakah) Transparency
*Building trust through radical transparency.*

*   **Infaq Ledger:** Real-time view of all donations received.
*   **Reports Generator:** Auto-generate "Transparency Report" (Funds vs Expenses).
*   **Project Updates:** CMS to post photos/videos of where the money went (e.g., Server costs, Charity).

## 11. 🛡️ Community & Moderation
*Keeping the ecosystem safe and barakah.*

*   **Halaqah Watch:** Moderation of study group chats/posts.
*   **Toxic Cleanup:** Auto-flag bad words, manual ban for toxicity.
*   **Content Featuring:** "Pin" high-quality community posts/notes.

## 12. ⚙️ System Settings & Configuration
*App-wide switches and levers.*

*   **Global Announcements:** Pop-up messages for all users (Maintenance, Updates).
*   **Feature Flags:** Enable/Disable modules (e.g., "Disable Market" during server load).
*   **API Management:** Update keys for Google, Zhipu, JAKIM, Billplz.
*   **Templates:** Editor for Email & Push Notification text.
*   **Maintenance Mode:** "Kill Switch" to show maintenance screen.

## 13. 📺 Multimedia Content (TV & FM)
*Streaming and media operations.*

*   **Video Library:** Upload/Embed YouTube or direct MP4 links.
*   **Live Scheduler:** Schedule "Live Kuliah" streams (notification trigger).
*   **Podcast Manager:** RSS feed management for QuranPulse FM.
*   **Playlists:** Curate thematic playlists (e.g., "Morning Zikir").

## 14. 🎫 Support & Ticketing
*Customer success interface.*

*   **Ticket Inbox:** Centralized view of user enquiries.
*   **Reply Interface:** Send responses directly to user email/app.
*   **SLA Tracking:** Monitor response times.
*   **Knowledge Base:** Add "Help Articles" to reduce ticket inquiries.

## 15. 🔒 Security & Audit Logs
*The fortress gatekeeper.*

*   **Login Monitor:** Track failed login attempts (Brute force detection).
*   **Audit Trail:** Immutable log of WHO changed WHAT data in the Admin panel.
*   **Policy Review:** Visualizer for active RLS policies.
*   **IP Blocklist:** Manually block malicious IP ranges.

---

## 🚀 Implementation Roadmap (Phased)

### Phase 1: The Core (Launch Critical)
1.  **User Management** (Support & Ban)
2.  **Content CMS** (Quran & Doa integrity)
3.  **AI Monitoring** (Cost & Safety)
4.  **Analytics** (Basic Metrics)

### Phase 2: Operations (Post-Launch)
5.  **Compliance Dashboard** (Scholar Review)
6.  **Subscription Manager** (Refunts/Upgrades)
7.  **Support Ticketing**
8.  **System Settings** (Announcements)

### Phase 3: Expansion (Growth)
9.  **Marketplace Manager**
10. **Gamification Control**
11. **Multimedia Studio**
12. **Family & Community Ops**

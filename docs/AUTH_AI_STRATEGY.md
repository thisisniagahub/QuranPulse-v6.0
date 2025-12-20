# 🔐 Authentication & AI Strategy: "The Hybrid Model"

> **Context:** Answering the feasibility of "User uses their own Token" vs "Admin OAuth".
> **Verdict:** The Admin idea is **LOGICAL**. The User Auto-Login idea requires adjustment to be practical.

---

## 1. The "Logik Tak?" Analysis

### A. Admin Dashboard OAuth (Status: ✅ LOGICAL)
*   **Concept:** Admin logs in via CLI/Web OAuth to access advanced Gemini features.
*   **Why it works:** Admins (You) have a Google Cloud Project. You can authorize the app to run heavy tasks (Data Embedding, Batch Processing) using your personal developer quota.
*   **Implementation:** Use `GoogleIdentity` provider in Supabase specifically for the Admin role with extra scopes (`cloud-platform`).

### B. User "Auto-Login" to Gemini Web (Status: ❌ NOT FEASIBLE DIRECTLY)
*   **The Myth:** Users login to your app -> Magic -> They are logged into `gemini.google.com`.
*   **Reality:** Google security prevents this (Cross-Site cookies).
*   **The Problem:** Even if we get their OAuth Token, **Regular Users do not have Google Cloud Billing** set up. If we try to use their token to call the API, it will fail with "Billing Not Enabled".
*   **The Solution (The "Real" Logic):** Instead of OAuth, we use **"Bring Your Own Key" (BYOK)**.

---

## 2. Proposed Architecture: The "3-Tier Auth System"

### Tier 1: The Public User (Free Tier)
*   **Auth:** Login via Supabase Google Auth (Standard).
*   **AI Access:** Uses the **Centralized App API Key** (Your Quota).
*   **Control:** We limit them using the `ai_knowledge_cache` (Fetch Once, Store Forever) to save your money.

### Tier 2: The Power User (BYOK)
*   **Auth:** Login via Supabase.
*   **Feature:** User goes to `Settings` -> `AI Preferences` -> "Paste Your Gemini API Key".
*   **Logic:**
    ```typescript
    if (user.settings.custom_api_key) {
       useGemini(user.settings.custom_api_key); // Uses THEIR free tier quota!
    } else {
       useGemini(process.env.APP_API_KEY); // Uses YOUR quota.
    }
    ```
*   **Benefit:** Zero cost to you for these users. They get faster speeds.

### Tier 3: The Super Admin (You)
*   **Auth:** CLI OAuth / Admin Dashboard Google Auth.
*   **Capabilities:**
    *   **Mass Ingestion:** Generate embeddings for 6,000 Ayahs at once.
    *   **Fine-Tuning:** Upload datasets to Vertex AI directly from the Dashboard.

---

## 3. Implementation Plan

### Step 1: Admin Dashboard OAuth
**Goal:** Secure high-privilege access.
1.  **GCP Console:** Create OAuth Client ID.
2.  **Redirect URI:** `https://your-app.com/admin/auth/callback`.
3.  **Supabase:** Enable "Google" provider with `cloud-platform` scope (ONLY for Admin logic).

### Step 2: User "Bring Your Own Key" (The Real Cost Saver)
**Goal:** Allow users to use their own "Token" logically.
1.  **Database:** Add `encrypted_api_key` to `user_settings`.
2.  **UI:** Simple input field in Profile.
3.  **Service:** Update `aiService.ts` to check this field first.

### Step 3: Auto-Login Flow (Supabase)
**Goal:** Seamless entry.
1.  **Supabase Auth:** Configured to `signInWithOAuth({ provider: 'google' })`.
2.  **Session Sync:** The `onAuthStateChange` listener in `AuthContext` (already implemented) handles the session persistence.

---

## 4. Summary for Developers

| Feature | User Strategy | Admin Strategy |
| :--- | :--- | :--- |
| **Authentication** | Standard Google Sign-In | Google OAuth + Cloud Scopes |
| **AI Token Source** | **Hybrid**: App Key (Default) OR Custom Key (BYOK) | **OAuth Token**: Direct Cloud Access |
| **Billing** | Developer pays (unless BYOK) | Developer's Cloud Project |
| **Rate Limits** | Strict (via Caching) | Uncapped (for batch jobs) |

**Conclusion:** Idea anda tentang "User guna token sendiri" adalah bernas, tetapi cara pelaksanaannya adalah melalui **API Key Input (BYOK)**, bukan OAuth Token (kerana isu billing Google Cloud user).

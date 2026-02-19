# QuranPulse QA & DevOps: The Ironclad Launch Guide

> **Role:** QA Engineer & DevOps Specialist Report
> **Objective:** Zero-downtime launch, <1% Bug Rate.
> **Tools:** Vitest, Playwright, Vercel, Supabase, Sentinel (Logging).

---

## 🏗️ PART 1: The Code Quality Shield

### A. Unit Testing (Vitest)
**Target:** 80% Coverage on Critical Logic (Calculations, Utils).
**Skip:** UI Components with no logic (waste of time).

**Config:** `vitest.config.ts`
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

**Critical Test Case: Iqra Scoring Logic**
```typescript
// tests/unit/iqra-scoring.test.ts
import { calculateSimilarity } from '@/modules/iqra/utils/feedback';

describe('Iqra Scoring System', () => {
  it('gives 5 stars for perfect match', () => {
    const score = calculateSimilarity('alhamdulillahi', 'alhamdulillahi');
    expect(score).toBe(1.0);
  });

  it('penalizes minor mispronunciation', () => {
    const score = calculateSimilarity('alhamdu', 'alhamdulillahi');
    expect(score).toBeLessThan(0.6);
  });
});
```

### B. End-to-End Testing (Playwright)
**Target:** Verify "The Golden Path" (User Journey).
**Run:** Before every Production Deploy.

**Golden Path Test:**
```typescript
// tests/e2e/golden-path.spec.ts
import { test, expect } from '@playwright/test';

test('New user can sign up and read Quran', async ({ page }) => {
  // 1. Visit Home
  await page.goto('http://localhost:3000');
  
  // 2. Read Surah Al-Fatihah (Guest Mode)
  await page.click('text=Baca Quran');
  await page.click('text=Al-Fatihah');
  await expect(page).toHaveURL(/.*surah\/1/);
  
  // 3. Play Audio
  await page.click('[aria-label="Play Audio"]');
  // Expect audio visualizer to appear
  await expect(page.locator('.audio-visualizer')).toBeVisible();
});
```

### C. Compliance & Logic Testing
**JAKIM Verification Check:**
*   [ ] Verify "Subuh" time matches e-Solat for "Kuala Lumpur" today.
*   [ ] Verify Al-Kahfi verse count (110).
*   [ ] Check "Hukum" AI query returns disclaimer.

---

## 🚀 PART 2: The DevOps Pipeline

### A. Environment Configuration (`.env.production`)
**Never commit this file.**

```bash
# Core
NEXT_PUBLIC_APP_URL=https://quranpulse.my
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# AI Services (Server-Side ONLY)
GEMINI_API_KEY=AIzaSy...
ELEVENLABS_API_KEY=sk_...

# Payments
TOYYIBPAY_SECRET=xxx
TOYYIBPAY_CATEGORY=xxx
```

### B. Vercel Deployment Strategy

**Configuration:** `vercel.json`
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  "regions": ["sin1"] 
}
```
*Note: `sin1` (Singapore) is crucial for <20ms latency to Malaysia.*

**Build Command:**
`npm run build`

**Output Directory:**
`dist` (for Vite) or `.next` (for Next.js)

### C. Supabase Production Hardening

1.  **Enable PITR (Point-in-Time Recovery):**
    *   Go to Database -> Backups -> Enable PITR.
    *   Cost: ~$25/mo (Worth it if you delete user data by accident).
    *   *Free Tier Alternative:* Daily manual `pg_dump`.

2.  **RLS Policy Audit:**
    *   Run: `SELECT * FROM pg_policies;`
    *   Ensure NO policy allows `DELETE` related to `profiles` for `anon` role.

3.  **Edge Function Secrets:**
    *   `supabase secrets set GEMINI_API_KEY=...`
    *   NEVER put keys in the function code itself.

---

## 🛡️ PART 3: Monitoring & Firefighting

### A. The "Pulse" Dashboard (Monitoring)

1.  **UptimeRobot (Free):**
    *   Monitor: `https://quranpulse.my`
    *   Keyword Check: "Bismillah" (Ensures DB is rendering content).

2.  **Sentry (Error Tracking):**
    *   Catch React "White Screen of Death".
    *   Catch Edge Function 500 errors.

### B. Launch Day Checklist (T-Minus 24 Hours)

*   [ ] **Domain:** DNS Propagated (SSL Valid).
*   [ ] **SEO:** `robots.txt` and `sitemap.xml` are accessible.
*   [ ] **Analytics:** PostHog/Google Analytics receiving events.
*   [ ] **Payment:** Run 1 real RM1 transaction on Live ToyyibPay env.
*   [ ] **Legal:** "Privacy Policy" link works (Required for Google Login approval).
*   [ ] **Performance:** Lighthouse Score > 90 (Mobile).

### C. Emergency Rollback Protocol

**Scenario:** White screen after deploy.
**Action:**
1.  Go to Vercel Dashboard.
2.  Click "Deployments".
3.  Find previous green build -> Click "Promote to Production" (Instance Rollback).
4.  Time taken: ~30 seconds.

---

## 📈 PART 4: Post-Launch Stability Goals

| Metric | Target (MVP) |
| :--- | :--- |
| **Uptime** | 99.9% |
| **Crash Free Users** | 99.0% |
| **Avg API Latency** | < 200ms |
| **AI Response Time** | < 3s |
| **Payment Success** | > 95% |

**"If it's not tested, it's broken."**
- Use the **Golden Path** test suite before every release.
- Monitor **Sentry** obsessively for the first 48 hours.

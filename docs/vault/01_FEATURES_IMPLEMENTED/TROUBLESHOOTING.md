# QuranPulse Troubleshooting Guide

> **Note:** This guide addresses common issues encountered during development and production usage.

---

## 🔌 Database & Connectivity

### Issue: Supabase Connection Timeout

**Symptoms:**
- Queries hang indefinitely.
- "Network request failed" errors in console.

**Solutions:**
1. **Check Project Status:** Ensure Supabase Dashboard shows project is ACTIVE (not paused due to inactivity).
2. **Environment Variables:** Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **RLS Policies:** Check if a new RLS policy is silently blocking requests (run query in SQL Editor to verify).
4. **Client Timeout Config:**
```typescript
const supabase = createClient(url, key, {
  db: { schema: 'public' },
  global: { fetch: (...args) => fetch(...args, { timeout: 10000 }) }
})
```

---

## 🔊 Audio & Media

### Issue: Audio Not Playing on iOS

**Symptoms:**
- Audio works on Desktop/Android but silent on iPhone.
- "NotAllowedError" in logs.

**Solutions:**
1. **User Interaction Trigger:** iOS Safari requires a direct user touch event to unlock audio context.
```typescript
// Must be triggered by user click, not useEffect
button.addEventListener('click', () => {
  const audio = new Audio(url)
  audio.play()
})
```
2. **Unlock Audio Context:** Play a silent 0.1s buffer on first touch anywhere in the app to "warm up" the audio engine.

### Issue: Microphone Permission Denied

**Symptoms:**
- Recording fails immediately.
- Permission prompt never appears.

**Solutions:**
1. **HTTPS Required:** Browsers block microphone access on `http://` (except localhost). Ensure Production URLs use HTTPS.
2. **Handling Denials:**
```typescript
if (!navigator.mediaDevices) {
  toast.error('Browser tidak menyokong rakaman audio')
  return
}

try {
  await navigator.mediaDevices.getUserMedia({ audio: true })
} catch (err) {
  toast.warn('Sila benarkan akses mikrofon dalam tetapan browser')
}
```

---

## 💸 Payments & Subscriptions

### Issue: Payment Webhook Not Firing

**Symptoms:**
- Payment succeeds (bank deduction) but user status remains 'Free'.
- Transaction stuck in "Pending".

**Solutions:**
1. **Public URL:** Webhooks cannot reach `localhost`. Use `ngrok` for local testing.
2. **Signature Validation:** Ensure your secret key matches exactly what is configured in ToyyibPay dashboard.
3. **Logs:** Check Supabase Edge Function logs for 500 errors.
4. **Resend:** Use ToyyibPay dashboard to manually resend the callback to verify fix.

---

## 🧠 AI & Costs

### Issue: High AI API Costs / Quota Exceeded

**Symptoms:**
- Unexpected credit usage.
- "429 Too Many Requests" errors.

**Solutions:**
1. **Aggressive Caching (Tier 2):**
```typescript
// Cache responses via pgvector/redis
const cacheKey = `ai-${queryHash}`
const cached = await checkCache(cacheKey)
if (cached) return cached

const response = await callAI(query)
await saveToCache(cacheKey, response)
```
2. **Rate Limiting:** Enforce strict limits (e.g., 5 queries/hour for Free users).
3. **Fallback Models:** Automatically switch to `Groq (Llama-3)` if Gemini quota hits 80%.

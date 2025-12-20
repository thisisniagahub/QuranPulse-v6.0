# 👳 TOK IMAM & 🧕 USTAZAH AI: Multi-Channel Bot Architecture

> **Mission:** To provide a compliant, accessible, and intelligent Islamic companion on the platforms people use most (WhatsApp & Telegram).
> **Scale:** 5,000 - 10,000 Concurrent Users.

---

## 1. Architecture Overview (The "Cluster" Model)

We use a unified backend to control multiple bot personas across different platforms.

```mermaid
graph TD
    UserWA[WhatsApp User] -->|Message| WA[Tok Imam Worker (Puppeteer)]
    UserTG[Telegram User] -->|Message| TG[Ustazah AI Worker (Telegraf)]
    
    WA -->|Unified Logic| Brain[AI Service (Node.js)]
    TG -->|Unified Logic| Brain
    
    Brain -->|Query| Cache[Supabase Vector Cache]
    Brain -->|Fast Inference| Groq[Groq LPU]
    Brain -->|Deep Reasoning| Gemini[Gemini Flash]
    
    Brain -->|Reply JSON| UI[Widget/Link Generator]
    UI -->|Response| WA
    UI -->|Response| TG
```

### Key Strategies
1.  **Bridge Strategy (Funnel):** Bots give short "Teasers" and direct users to the Web App for full features (Infaq, Zakat Calc). This reduces spam risk.
2.  **Persona Partitioning:**
    *   **Tok Imam (WhatsApp):** Authority figure, general advice.
    *   **Ustazah AI (Telegram):** Gentle approach, focus on Nisa' (Women) & Family topics.

---

## 2. Technology Stack

*   **WhatsApp Core:** `whatsapp-web.js` (Unofficial, Free).
*   **Telegram Core:** `telegraf` (Official, Free).
*   **AI Engine:** **Groq** (Speed) + **Gemini** (Reasoning) + **Supabase** (Memory).
*   **Voice Engine:** **ElevenLabs** (Text-to-Speech Voice Notes).
*   **Process Manager:** `PM2` (Restart on crash, Load Balancing).

---

## 3. "Anti-Ban" Strategy (Crucial for WhatsApp)

Running a bot for 10k users on `whatsapp-web.js` is high risk. You **MUST** follow these rules:

### A. The "Human" Delay
Never reply instantly.
```typescript
const delay = Math.floor(Math.random() * 5000) + 2000; // 2-7 seconds
await new Promise(r => setTimeout(r, delay));
```

### B. Session Rotation (For > 5k Users)
Use multiple SIM cards.
*   `+6011-AAAA-AAAA` (Tok Imam 1)
*   `+6011-BBBB-BBBB` (Tok Imam 2)
The system distributes outgoing messages across these numbers.

### C. "Typing" Indicators
Always send `chat.sendStateTyping()` before replying. It tells WhatsApp "a human is here".

---

## 4. MCP Integration (The "Brain")

The bot is just a "Shell". The intelligence comes from our **AI Service** via MCP principles.

### Workflow:
1.  **Input:** User sends "Hukum makan semut?"
2.  **Context:** Bot fetches User Profile from Supabase (Level Iqra, History).
3.  **Reasoning:** AI checks `ai_knowledge_cache` first.
4.  **Compliance:**
    *   *System Prompt:* "Answer must follow Shafi'i Mazhab & JAKIM Guidelines."
    *   *Reference:* Append "[Sumber: e-SMA]" link.
5.  **Output:** Text sent back to WhatsApp.

---

## 5. Deployment Guide (VPS)

Do not deploy this to Vercel. Vercel will kill the connection after 10 seconds.

### Step 1: Prepare Server
*   Ubuntu 22.04 LTS (4GB RAM recommended for Puppeteer).
*   Install: Node.js 18, Redis, Chrome (for Puppeteer).

### Step 2: Install Dependencies
```bash
npm install whatsapp-web.js qrcode-terminal telegraf pm2 redis bullmq
```

### Step 3: Run with PM2
```bash
# Ecosystem.config.js
module.exports = {
  apps : [{
    name   : "tok-imam-wa",
    script : "./scripts/start_tok_imam.ts",
    instances : 1,
    autorestart : true,
    watch : false,
  }]
}
```
Command: `pm2 start ecosystem.config.js`

---

## 6. Innovation: "Voice Note" Replies
Instead of text, reply with Audio.
1.  Generate Answer Text.
2.  Call ElevenLabs API -> Get MP3.
3.  `client.sendMessage(chatId, MessageMedia.fromUrl(mp3Url), { sendAudioAsVoice: true })`
*   *Result:* User feels like they are chatting with a real Ustaz.

---

## 7. Next Steps
1.  Run `scripts/start_tok_imam.ts` locally to scan QR.
2.  Test with a small group (10-20 friends).
3.  Setup Redis for the queue system.

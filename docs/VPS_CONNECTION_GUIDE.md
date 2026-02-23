# 🔌 VPS — Connection Guide

> **Last Updated**: 21 Feb 2026
> **Status**: Active
> **Module**: Infrastructure / Operations

---

## Quick Overview

```
┌──────────────────────┐          ┌────────────────────────────┐
│   quranpulse.my      │          │  VPS srv1322432            │
│   (Vercel / Frontend)│          │  76.13.176.142             │
│                      │          │                            │
│  React 18 + Vite     │ ──HTTPS──│  api.gangniaga.my          │
│  Tailwind CSS v4     │          │    → Docker containers     │
│                      │          │    → Redis, Workers        │
│  Supabase (Managed)  │          │                            │
│    ↕ Direct          │          │  operator.gangniaga.my     │
│    bomjkgyrkvuivq... │          │    → OpenClaw/NiagaBot     │
│    .supabase.co      │          │    → Telegram + WhatsApp   │
│                      │          │                            │
│  Tailscale (VPN)     │          │  Tailscale: 100.100.205.64 │
│    ↕ Internal        │          │                            │
└──────────────────────┘          └────────────────────────────┘
```

---

## 1. Current Connection Status

| Service | Domain | Frontend Wired? | Status |
|---------|--------|:---------------:|:------:|
| Supabase (DB/Auth) | `bomjkgyrkvuivqodzqzf.supabase.co` | ✅ Yes | 🟢 Working |
| QuranPulse API | `api.gangniaga.my` | ❌ **Not yet** | 🟡 Docker running, not integrated |
| OpenClaw/NiagaBot | `operator.gangniaga.my` | ❌ N/A | 🟢 Bot active |
| Supabase Edge Funcs | `bomjkgyrkvuivqodzqzf.supabase.co/functions/v1/*` | ✅ Yes | 🟢 8 deployed |
| Tailscale VPN | `100.100.205.64` | ❌ Dev only | 🟢 Connected |

---

## 2. VPS Services Architecture

### Docker Containers (Running)

| Container | Image | Port | Purpose |
|-----------|-------|------|---------|
| `quranpulse-api` | Node.js custom | `3001` | API Gateway |
| `agent-ustaz` | Python worker | — | AI processing |
| `agent-content` | Python worker | — | Content pipeline |
| `redis` | `redis:7-alpine` | `6379` | Cache & queue |

### OpenClaw (systemd)

| Component | Entry Point | Port |
|-----------|-------------|------|
| Gateway | `/opt/operator/openclaw/repo/dist/index.js` | `18789` |
| Control UI | via Nginx reverse proxy | `18792` |

---

## 3. Environment Variables — Frontend (.env)

### Currently Active

```env
# Supabase — CONNECTED ✅
VITE_SUPABASE_URL=https://bomjkgyrkvuivqodzqzf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# AI Keys — CONNECTED ✅
VITE_GEMINI_API_KEY=AIzaSy...
VITE_GROQ_API_KEY=gsk_E2Dh...

# Payment — PLACEHOLDER
VITE_TOYYIBPAY_SECRET=
VITE_TOYYIBPAY_CATEGORY=
```

### To Add (VPS API Integration)

```env
# VPS API ─ QuranPulse Backend
VITE_API_BASE_URL=https://api.gangniaga.my
VITE_API_TIMEOUT=30000

# VPS API ─ Internal (Tailscale only, for dev)
# VITE_API_BASE_URL=http://100.100.205.64:3001

# OpenClaw Gateway (operator access)
# VITE_OPENCLAW_URL=https://operator.gangniaga.my
# VITE_OPENCLAW_TOKEN=<gateway-auth-token>
```

---

## 4. VPS `.env` — Backend (Server-Side)

**Path**: `/opt/operator/openclaw/compose/.env`

```env
TG_BOT_TOKEN=__REPLACE__          # ⚠️ NEEDS ACTUAL TOKEN
OPENCLAW_PAIRING_REQUIRED=true
OPENCLAW_LOG_LEVEL=info
OPENCLAW_GATEWAY_TOKEN=0ffbb75d...
```

> ⚠️ **Action Required**: Replace `__REPLACE__` placeholders with actual credentials.

---

## 5. Connection Steps — How to Wire

### Step 1: Add VPS API URL to Frontend

Edit `i:\ANTIGRAVITY\QuranPulse-v6.0\.env`:

```diff
+ # VPS API
+ VITE_API_BASE_URL=https://api.gangniaga.my
```

### Step 2: Create API Service Client

Create `src/services/vpsApiClient.ts`:

```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.gangniaga.my';

export const vpsApi = {
  async query(endpoint: string, body: any) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  // AI Query via VPS (instead of direct Gemini)
  async askAI(query: string, lang: 'ms' | 'en' = 'ms') {
    return this.query('/ai/query', { query, lang });
  },

  // Health check
  async health() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },
};
```

### Step 3: Update Supabase Credentials on VPS

SSH into VPS and update Docker env:

```bash
ssh root@76.13.176.142

# Edit the compose env
nano /opt/operator/openclaw/compose/.env

# Add real credentials:
# SUPABASE_URL=https://bomjkgyrkvuivqodzqzf.supabase.co
# SUPABASE_SERVICE_KEY=<service-role-key-from-supabase-dashboard>
# TG_BOT_TOKEN=<actual-telegram-bot-token>

# Restart
cd /opt/operator/openclaw/compose
docker compose down && docker compose up -d
```

### Step 4: Verify Connection

```bash
# From local machine
curl https://api.gangniaga.my/health

# From VPS
curl http://127.0.0.1:3001/health

# From Tailscale
curl http://100.100.205.64:3001/health
```

---

## 6. Nginx Routing (Already Configured)

### `api.gangniaga.my`

```nginx
# /etc/nginx/sites-enabled/api.gangniaga.my
server {
    listen 443 ssl;
    server_name api.gangniaga.my;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # TLS via Let's Encrypt (certbot)
    ssl_certificate /etc/letsencrypt/live/api.gangniaga.my/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.gangniaga.my/privkey.pem;
}
```

### `operator.gangniaga.my`

```nginx
# /etc/nginx/sites-enabled/operator.gangniaga.my
server {
    listen 443 ssl;
    server_name operator.gangniaga.my;

    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;      # WebSocket
        proxy_set_header Connection "upgrade";        # WebSocket
        proxy_read_timeout 600s;
    }
}
```

---

## 7. SSH Access

```bash
# Direct (public IP)
ssh root@76.13.176.142

# Via Tailscale (VPN)
ssh root@100.100.205.64

# Key paths on VPS
/opt/operator/                    # Main operator directory
/opt/operator/openclaw/           # OpenClaw installation
/opt/operator/openclaw/compose/   # Docker compose files
/opt/operator/openclaw/repo/      # OpenClaw source (git)
/opt/operator/openclaw/workspace/ # Bot workspace
/root/.openclaw/                  # OpenClaw config & agents
```

---

## 8. Gaps to Close Before Ramadan

| # | Gap | Priority | Effort |
|---|-----|:--------:|:------:|
| 1 | Wire `VITE_API_BASE_URL` in frontend `.env` | 🔴 High | 5 min |
| 2 | Create `vpsApiClient.ts` service | 🔴 High | 30 min |
| 3 | Build sync `POST /ai/query` endpoint on VPS API | 🔴 High | 2-4 hrs |
| 4 | Update VPS `.env` with real Supabase credentials | 🔴 High | 10 min |
| 5 | Deploy Qdrant for semantic search | 🟡 Med | 1 hr |
| 6 | Connect Ustaz AI to VPS API (hybrid mode) | 🟡 Med | 2 hrs |
| 7 | Add CORS headers for `quranpulse.my` on API | 🟡 Med | 15 min |

---

## 9. Quick Reference

| What | Where |
|------|-------|
| Frontend prod | `https://quranpulse.my` (Vercel) |
| VPS API | `https://api.gangniaga.my` |
| OpenClaw UI | `https://operator.gangniaga.my` |
| Supabase | `https://bomjkgyrkvuivqodzqzf.supabase.co` |
| VPS SSH | `ssh root@76.13.176.142` |
| Tailscale | `ssh root@100.100.205.64` |
| Docker logs | `docker logs quranpulse-api -f` |
| OpenClaw logs | `journalctl --user -u openclaw-gateway -f` |

---

> *"Setiap sambungan yang kukuh bermula dengan satu wayar yang betul."* 🔌


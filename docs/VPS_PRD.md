# 🖥️ NIAGAHUB 1-VPS Deployment PRD

> **Single VPS Strategy** - Two systems, one server

---

## Executive Summary

NIAGAHUB runs **TWO separate systems** on a single VPS:
1. **Operator Agent (GangBot/OpenClaw)** - Personal AI assistant for Bo
2. **QuranPulse App Platform** - Islamic app for end users

This PRD defines the architecture, deployment patterns, and security requirements.

---

## Architecture Decision

| Component | Runtime | Rationale |
|-----------|---------|-----------|
| **Operator (GangBot)** | Root user systemd | Always-on, predictable restart, journald logging |
| **QuranPulse** | Docker Compose | Application pattern, isolated services |
| **Qdrant** | Docker (in QP stack) | Vector DB for semantic search |
| **Frontend** | Vercel | Edge deployment, auto-scaling |
| **Database** | Supabase | Managed PostgreSQL, built-in auth |
| **VPN** | Tailscale | Private mesh networking for operator access |

### Why This Split?
- **systemd for Operator**: System-level reliability, minimal overhead, direct logging
- **Docker for QuranPulse**: Multi-service orchestration, easy scaling, environment isolation

---

## Folder Structure Law

```
/root/           → Lab only (testing, experiments)
/opt/operator/   → OpenClaw/GangBot data (production)
/opt/openclaw/   → OpenClaw source repository
/opt/codex/      → Codex integration
/opt/apps/       → QuranPulse (production)
/opt/shared/     → Scripts, backups, logs
```

---

## Server Specifications

| Property | Value |
|----------|-------|
| Hostname | srv1322432 |
| Public IP | 76.13.176.142 |
| Tailscale IP | 100.100.205.64 |
| OS | Ubuntu 22.04.5 LTS |
| CPU | AMD EPYC 9354P (2 vCPUs) |
| RAM | 7.8 GB |
| Disk | 97 GB SSD |

---

## Network Security

### Port Policy
```
OPEN (UFW):
- 22/tcp   (SSH) - Key-based auth only
- 80/tcp   (HTTP) - Redirect to HTTPS
- 443/tcp  (HTTPS) - All public services
- 18789/tcp (OpenClaw) - ⚠️ UFW allows, but service binds Tailscale only

CLOSED: Everything else
```

### Service Binding
```
QuranPulse services → 127.0.0.1 (localhost)
OpenClaw Gateway    → 100.100.205.64 (Tailscale only)
Public access       → ONLY via Nginx reverse proxy
```

> [!IMPORTANT]
> OpenClaw binds to Tailscale IP (`100.100.205.64:18789`), NOT localhost. This means it is accessible only from within the Tailscale mesh network.

### Tailscale VPN
```
Purpose: Private mesh network for operator access
IP: 100.100.205.64
Use: OpenClaw Gateway binding, SSH access
```

### Domains

| Domain | Internal | Service |
|--------|----------|---------|
| operator.gangniaga.my | Tailscale `100.100.205.64:18789` | OpenClaw Gateway |
| api.gangniaga.my | `127.0.0.1:18080` | QuranPulse API |

---

## 6. Operator Agent Runtime

### OpenClaw Gateway as Root User systemd Service

> [!WARNING]
> OpenClaw runs as a **root user service** (not a system service). The service file is at a user-level path, NOT `/etc/systemd/system/`.

```ini
# /root/.config/systemd/user/openclaw-gateway.service
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/operator/openclaw
ExecStart=/usr/local/bin/openclaw gateway --port 18789
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=default.target
```

### Critical: Linger & System Service
```bash
# Root user service persists after SSH logout
loginctl enable-linger root

# System-level service MUST be masked to prevent port conflict
systemctl mask openclaw-gateway.service  # → /dev/null
```

### Why Root User systemd (not system service)?
The `openclaw onboard --install-daemon` installer creates a **user** service.
A conflicting system service at `/etc/systemd/system/openclaw-gateway.service` was disabled and masked on 2026-02-10 to resolve port 18789 conflicts.

### Why systemd (not Docker)?

| Factor | systemd | Docker |
|--------|---------|--------|
| Reliability | Always-on | Container restarts |
| Restart | Predictable | Orchestration |
| Logging | journald | Separate driver |
| Complexity | Less parts | More layers |

### Model Configuration (Actual)
```json5
{
  agents: {
    defaults: {
      model: {
        primary: "google-antigravity/gemini-3-flash",  // current
        fallbacks: ["google-antigravity/gemini-3-pro"] // target upgrade
      }
    }
  }
}
```

---

## 7. QuranPulse Platform

### Docker Compose Structure
```
/opt/apps/quranpulse/compose/
├── docker-compose.yml
├── .env.api
├── .env.agent_ustaz
└── .env.agent_content
```

### Services

| Service | Image | Port |
|---------|-------|------|
| quranpulse-api | Node.js | 18080 |
| quranpulse-agent-ustaz | Python | - |
| quranpulse-agent-content | Python | - |
| quranpulse-redis | Redis 7 | 6379 |
| qdrant | Qdrant | 6333, 6334 |

### Supabase Connection
- **URL**: (configured in .env)
- **Anon Key**: (configured in .env)
- **Service Role**: (configured in .env)

---

## 8. Frontend Strategy

### Deployment Target: Vercel
- **Domain**: app.quranpulse.my
- **Framework**: React 18 + Vite
- **Build**: `npm run build`

### Why Vercel?
- Edge deployment (fast globally)
- Git-based deploys
- Preview URLs for PRs
- Zero config for Vite

---

## 9. Secrets Management

### Environment Files
```
/opt/operator/openclaw/data/.openclaw/openclaw.json → OpenClaw config + secrets
/opt/apps/quranpulse/compose/.env.api               → API secrets
/opt/apps/quranpulse/compose/.env.agent_*            → Agent secrets
```

### Rules
- ✅ One .env per service
- ✅ Never commit to Git
- ✅ Backup encrypted
- ❌ Never expose in logs

---

## 10. Security Requirements

### SSH Hardening

> [!CAUTION]
> **Current reality (2026-02-10)**: SSH still has `PermitRootLogin yes` and `PasswordAuthentication yes`. Below is the PRD target that MUST be implemented.

```
PermitRootLogin prohibit-password    ← TARGET (currently: yes ⚠️)
PasswordAuthentication no            ← TARGET (currently: yes ⚠️)
PubkeyAuthentication yes             ← ✅ Active
```

### fail2ban
```
Status: ✅ Active (confirmed 2026-02-10)
Jails: sshd
bantime = 3600
findtime = 600
maxretry = 3
```

### Nginx Security Headers
```nginx
X-Frame-Options: DENY              ← ✅ Active
X-Content-Type-Options: nosniff    ← ✅ Active
X-XSS-Protection: 1; mode=block   ← ✅ Active
```

### SSL
- Let's Encrypt certificates ✅
- Auto-renewal via certbot.timer ✅

---

## 11. Backup Strategy

### Cron Schedule

| Schedule | Script | Purpose |
|----------|--------|---------|
| `0 3 * * *` | `/opt/shared/scripts/backup.sh` | Daily backup |
| `*/60 * * * *` | Watchdog script | Service health check |
| `0 2 * * *` | Update check | System updates |

### Backup Contents
- Nginx configs
- Docker volumes
- OpenClaw data
- Environment files (encrypted)

---

## 12. Non-Goals

- ❌ Multi-VPS clustering (single VPS only)
- ❌ Kubernetes (overkill for this scale)
- ❌ Container per microservice (grouped by app)
- ❌ Self-hosted database (use Supabase)

---

## 13. Success Metrics

| Metric | Target |
|--------|--------|
| Uptime | >99.9% |
| Response Time | <200ms |
| SSL Score | A+ |
| Failed Login Ban | <30s |

---

*Last Updated: 2026-02-10*

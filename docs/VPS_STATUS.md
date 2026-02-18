# 🖥️ NIAGAHUB VPS Infrastructure Status

> **Server**: srv1322432 | **Public IP**: 76.13.176.142 | **Tailscale IP**: 100.100.205.64
> **Last Updated**: 2026-02-12

---

## Architecture Overview

### Two Systems, One VPS

| System | Purpose | Runtime | Status |
|--------|---------|---------|--------|
| **Operator (GangBot)** | Bo's personal AI assistant | Root user systemd | ✅ Active |
| **QuranPulse** | App platform for users | Docker Compose | ✅ Running |

### Folder Structure
```
/root/                → Lab only (testing)
/opt/operator/        → OpenClaw/GangBot data (production)
/opt/openclaw/        → OpenClaw source repository
/opt/codex/           → Codex integration
/opt/apps/            → QuranPulse (production)
/opt/shared/          → Scripts, backups
```

### Network Topology
```
Internet → UFW (22,80,443) → Nginx → localhost services
Tailscale mesh → 100.100.205.64 → OpenClaw (18789)
⚠️ Note: OpenClaw binds 0.0.0.0:18789 — protected by Nginx/Tailscale, UFW 18789 REMOVED (2026-02-12)
```

---

## System Information

| Property | Value |
|----------|-------|
| Hostname | srv1322432 |
| Public IP | 76.13.176.142 |
| Tailscale IP | 100.100.205.64 |
| OS | Ubuntu 22.04.5 LTS |
| CPU | AMD EPYC 9354P (2 vCPUs) |
| RAM | 7.8 GB |
| Disk | 97 GB SSD (~50% used, 49G free) |

---

## Domains

| Domain | Service | Internal Bind |
|--------|---------|---------------|
| `operator.gangniaga.my` | OpenClaw Gateway | Tailscale `100.100.205.64:18789` |
| `api.gangniaga.my` | QuranPulse API | `127.0.0.1:18080` |

---

## Running Services & Containers

### OpenClaw Gateway (systemd — NOT a container)

| Property | Value |
|----------|-------|
| Runtime | Root user systemd service |
| Service file | `/root/.config/systemd/user/openclaw-gateway.service` |
| Bind address | `100.100.205.64:18789` (Tailscale) |
| Linger | Enabled (`loginctl enable-linger root`) |
| System service | **Masked** (`/etc/systemd/system/openclaw-gateway.service → /dev/null`) |

### Docker Containers (QuranPulse Stack)

| Container | Purpose | Status |
|-----------|---------|--------|
| `quranpulse-api` | QuranPulse API | ✅ Running (47h+) |
| `quranpulse-agent-ustaz` | Ustaz AI Agent | ✅ Running (47h+) |
| `quranpulse-agent-content` | Content Agent | ✅ Running (47h+) |
| `quranpulse-redis` | Cache (Redis 7 Alpine) | ✅ Running (47h+) |

> [!NOTE]
> **Qdrant** vector database is not currently running. Will need to be re-added when semantic search is deployed.

---

## PRD Compliance

### ✅ Compliant
- Folder structure (`/opt/operator`, `/opt/apps`)
- Nginx reverse proxy active
- Firewall configured (UFW active)
- Separate .env files per service
- OpenClaw runs as systemd service (PRD requirement met)
- fail2ban active (sshd jail)
- SSL certificates valid & auto-renewing
- Nginx security headers active
- SSH hardened: `PermitRootLogin prohibit-password` + `PasswordAuthentication no` ✅

### ⚠️ Needs Attention
- **Qdrant**: Not running — needs to be deployed when semantic search is ready
- **UFW port 18789**: Open publicly but OpenClaw binds to Tailscale — unnecessary rule
- **Certbot timer**: Masked — renewal handled via cron instead

### ✅ Previously Tracked as Pending (Now Done)
- ~~OpenClaw: Migrate from Docker to systemd~~ → **Done** (root user systemd)
- ~~fail2ban: Install required~~ → **Active** (sshd jail running)
- ~~Nginx security headers~~ → **Active**
- ~~SSH: Harden root login~~ → **Done** (2026-02-11)
- ~~SSH: Disable password auth~~ → **Done** (2026-02-11)

---

## Security Status

### Firewall (UFW)
```
Status: active
22/tcp   ALLOW   SSH
80/tcp   ALLOW   HTTP
443/tcp  ALLOW   HTTPS
~~18789/tcp~~ REMOVED (2026-02-12) — was redundant, OpenClaw uses Tailscale
```

### SSH
```
PermitRootLogin: prohibit-password    ✅ Hardened
PasswordAuthentication: no            ✅ Hardened
Port: 22
PubkeyAuthentication: yes
```

> [!NOTE]
> **SSH is fully hardened** (2026-02-11). Key-based auth only, no password login allowed.

### fail2ban
```
Status: ✅ Active
Jails: sshd
Config: bantime=3600, maxretry=3
```

### SSL Certificates
```
operator.gangniaga.my: ✅ Valid (HTTP 200)
api.gangniaga.my: ✅ Valid (HTTP 200)
Auto-renewal: cron (0 3 * * * /snap/bin/certbot renew)
certbot.timer: masked (inactive) — renewal via cron instead
```

### Tailscale VPN
```
Status: ✅ Active
IP: 100.100.205.64
Purpose: Private mesh for OpenClaw access
```

---

## OpenClaw Configuration

### Bot Identity

| Property | Value |
|----------|-------|
| Bot name | 🦈 NiagaHubBot |
| WhatsApp | +601121112919 |
| WhatsApp allowlist | +601169416694 |
| Telegram | @GangNiagaBot (user: 6798585537) |

### Directory
```
/root/.openclaw/
└── openclaw.json              ← Main config (ACTUAL location)
/opt/operator/openclaw/
├── repo/dist/                 ← OpenClaw source (ExecStart target)
├── workspace/                 ← Agent workspaces
├── data/agents/               ← Agent data
├── scripts/                   ← Cron scripts
```

### Model Configuration (Actual — verified 2026-02-12)
```json5
{
  agents: {
    defaults: {
      model: {
        primary: "google-antigravity/gemini-3-pro",
        fallbacks: [
          "google-antigravity/gemini-1.5-pro",
          "google-antigravity/gemini-3-pro-low",
          "google-antigravity/gemini-3-flash"
        ]
      }
    },
    list: [
      { id: "main", name: "NiagaBot", model: "claude-opus-4-6-thinking" },
      { id: "niagahubbot", name: "NiagaHubBot", model: "gemini-3-pro" }
    ]
  }
}
```

### Commands
```bash
# Health check (via Tailscale)
curl http://100.100.205.64:18789/health

# Service status
systemctl --user status openclaw-gateway.service

# Logs
journalctl --user -u openclaw-gateway.service -f

# Restart
systemctl --user restart openclaw-gateway.service
```

---

## QuranPulse Configuration

### Directory
```
/opt/apps/quranpulse/
├── compose/
│   ├── docker-compose.yml
│   ├── .env.api
│   ├── .env.agent_ustaz
│   └── .env.agent_content
└── data/redis/
```

### Commands
```bash
# Health check
curl http://127.0.0.1:18080/health

# Container status
docker ps --format "table {{.Names}}\t{{.Status}}"

# Restart
cd /opt/apps/quranpulse/compose && docker compose restart

# Logs
docker logs quranpulse-api --tail 50
```

---

## Qdrant Vector Database

> [!NOTE]
> Qdrant is **not currently running**. Will be deployed when semantic search feature is ready.

| Property | Value |
|----------|-------|
| Planned Port | `127.0.0.1:6333` |
| Purpose | Semantic search embeddings |
| Status | ❌ Not deployed |

---

## Cron Jobs

| Schedule | Script | Purpose |
|----------|--------|---------|
| `0 3 * * *` | `/opt/shared/scripts/backup.sh` | Daily backup (nginx, QP, OpenClaw) |
| `0 2 * * *` | `/opt/operator/openclaw/scripts/check_updates.sh` | OpenClaw update check |
| `*/30 * * * *` | `/opt/operator/openclaw/scripts/quota-alert.sh` | API quota monitoring |
| `0 6 * * *` | `/opt/operator/openclaw/scripts/auto-research.sh` | Automated research |
| `*/5 * * * *` | `/opt/operator/openclaw/scripts/watchdog.sh` | Service health watchdog |
| `0 3 * * *` | `/snap/bin/certbot renew` | SSL certificate renewal |

---

## Quick Commands

### Full Health Check
```bash
# OpenClaw (via Tailscale)
curl -s http://100.100.205.64:18789/health

# QuranPulse API
curl -s http://127.0.0.1:18080/health

# OpenClaw service
systemctl --user status openclaw-gateway.service

# Docker containers
docker ps --format "table {{.Names}}\t{{.Status}}"

# Qdrant
curl -s http://localhost:6333/healthz
```

### Nginx
```bash
nginx -t && systemctl reload nginx
```

### Logs
```bash
journalctl --user -u openclaw-gateway.service --since "1 hour ago"
docker logs <container> --tail 50
journalctl -u nginx --since "1 hour ago"
```

---

## Next Steps

### ✅ Completed (Security Hardening)
- [x] SSH: Set `PermitRootLogin prohibit-password` — Done 2026-02-11
- [x] SSH: Set `PasswordAuthentication no` — Done 2026-02-11
- [x] UFW: Removed port 18789 rule — Done 2026-02-12
- [x] Moved `/tmp/check_openclaw_updates.sh` to `/opt/operator/openclaw/scripts/` — Done 2026-02-12
- [x] Docker image/build cache pruned (52% → 50%) — Done 2026-02-12

### Priority 1: Remaining Security
- [ ] Fix OpenClaw bind address: `0.0.0.0` → `100.100.205.64` (Tailscale only)
- [ ] Add Nginx jails to fail2ban

### Priority 2: Monitoring
- [ ] Setup uptime monitoring
- [ ] Unmask certbot.timer or verify cron renewal is reliable

### Priority 3: QuranPulse Integration
- [ ] Connect Supabase
- [ ] Deploy frontend to Vercel
- [ ] Deploy Qdrant for semantic search

---

*Last Updated: 2026-02-12*

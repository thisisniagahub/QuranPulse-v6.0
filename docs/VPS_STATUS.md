# 🖥️ NIAGAHUB VPS Infrastructure Status

> **Server**: srv1322432 | **Public IP**: 76.13.176.142 | **Tailscale IP**: 100.100.205.64
> **Last Updated**: 2026-02-10

---

## Architecture Overview

### Two Systems, One VPS

| System | Purpose | Runtime | Status |
|--------|---------|---------|--------|
| **Operator (GangBot)** | Bo's personal AI assistant | Root user systemd | ✅ Active (PID 251093) |
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
Internet → UFW (22,80,443,18789) → Nginx → localhost services
Tailscale mesh → 100.100.205.64 → OpenClaw (18789)
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
| Disk | 97 GB SSD (~30% used) |

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

### Docker Containers (QuranPulse Stack + Qdrant)

| Container | Purpose | Status |
|-----------|---------|--------|
| `quranpulse-api` | QuranPulse API | ✅ Running |
| `quranpulse-agent-ustaz` | Ustaz AI Agent | ✅ Running |
| `quranpulse-agent-content` | Content Agent | ✅ Running |
| `quranpulse-redis` | Cache | ✅ Running |
| `qdrant` | Vector Database | ✅ Running |

> [!WARNING]
> **Qdrant** is binding to `0.0.0.0:6333-6334` — publicly accessible. Should be restricted to `127.0.0.1`.

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

### ⚠️ Needs Attention
- **SSH**: `PermitRootLogin yes` and `PasswordAuthentication yes` — PRD requires `prohibit-password` and `no`
- **Qdrant**: Exposed on `0.0.0.0` — should be `127.0.0.1`
- **UFW port 18789**: Open publicly but OpenClaw binds to Tailscale — unnecessary rule

### ✅ Previously Tracked as Pending (Now Done)
- ~~OpenClaw: Migrate from Docker to systemd~~ → **Done** (root user systemd)
- ~~fail2ban: Install required~~ → **Active** (sshd jail running)
- ~~Nginx security headers~~ → **Active**

---

## Security Status

### Firewall (UFW)
```
Status: active
22/tcp   ALLOW   SSH
80/tcp   ALLOW   HTTP
443/tcp  ALLOW   HTTPS
18789/tcp ALLOW  OpenClaw (⚠️ redundant — binds to Tailscale)
```

### SSH
```
PermitRootLogin: yes          ⚠️ SHOULD BE prohibit-password
PasswordAuthentication: yes   ⚠️ SHOULD BE no
Port: 22
PubkeyAuthentication: yes
```

> [!CAUTION]
> **SSH is not hardened.** Root login with password is still allowed. This is a critical security risk.

### fail2ban
```
Status: ✅ Active
Jails: sshd
Config: bantime=3600, maxretry=3
```

### SSL Certificates
```
operator.gangniaga.my: ✅ Valid
api.gangniaga.my: ✅ Valid
Auto-renewal: certbot.timer active
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
/opt/operator/openclaw/
├── data/
│   └── .openclaw/
│       └── openclaw.json    ← Main config
```

### Model Configuration (Actual)
```json5
{
  agents: {
    defaults: {
      model: {
        primary: "google-antigravity/gemini-3-flash",  // ← actual current
        fallbacks: ["google-antigravity/gemini-3-pro"] // ← target upgrade
      }
    }
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

| Property | Value |
|----------|-------|
| Container | `qdrant` |
| HTTP API | `0.0.0.0:6333` ⚠️ |
| gRPC | `0.0.0.0:6334` ⚠️ |
| Purpose | Semantic search embeddings |

> Should be bound to `127.0.0.1` for security.

---

## Cron Jobs

| Schedule | Script | Purpose |
|----------|--------|---------|
| `0 3 * * *` | `/opt/shared/scripts/backup.sh` | Daily backup |
| `*/60 * * * *` | Watchdog script | Service health check |
| `0 2 * * *` | Update check | System updates |

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

### Priority 1: Security Hardening
- [ ] SSH: Set `PermitRootLogin prohibit-password`
- [ ] SSH: Set `PasswordAuthentication no`
- [ ] Qdrant: Bind to `127.0.0.1` only
- [ ] UFW: Remove port 18789 rule (OpenClaw uses Tailscale)

### Priority 2: Monitoring
- [ ] Add Nginx jails to fail2ban
- [ ] Setup uptime monitoring

### Priority 3: QuranPulse Integration
- [ ] Connect Supabase
- [ ] Deploy frontend to Vercel

---

*Last Updated: 2026-02-10*

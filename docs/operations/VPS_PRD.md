# 🖥️ VPS — Production Runtime Design

> **Last Updated**: 21 Feb 2026
> **Status**: Active
> **Module**: Infrastructure / Architecture

---

> Scope: production runtime design for QuranPulse + OpenClaw on one VPS
> Revision: **2026-02-19** (aligned with live server verification)

## 1. Executive Summary

Single VPS, two operational domains:

1. **Operator Domain (OpenClaw)**
   Internal operator gateway, managed as root user `systemd --user` service.
2. **Application Domain (QuranPulse API Stack)**
   Queue ingress API + workers + Redis via Docker Compose.

Design objective:
- keep operations simple,
- isolate responsibilities,
- use Nginx as the single public ingress,
- keep internal services on localhost.

---

## 2. Infrastructure Profile

| Property | Value |
|---|---|
| Hostname | `srv1322432` |
| Public IP | `76.13.176.142` |
| Tailscale IP | `100.100.205.64` |
| OS | Ubuntu 22.04.5 LTS |
| CPU | AMD EPYC (2 vCPU) |
| RAM | 7.8 GB |
| Disk | 97 GB SSD |

---

## 3. Runtime Architecture

### 3.1 OpenClaw (Operator)

- Service type: `systemd --user` (root)
- Unit path: `/root/.config/systemd/user/openclaw-gateway.service`
- Binary:

```ini
ExecStart="/usr/bin/node" "/opt/operator/openclaw/repo/dist/index.js" gateway --port 18789
```

- Current socket bind: `127.0.0.1:18789`
- Public exposure only through Nginx reverse proxy.

### 3.2 QuranPulse API Stack

Compose path:

```text
/opt/apps/quranpulse/compose/docker-compose.yml
```

Services:

| Service | Runtime | Port |
|---|---|---|
| `quranpulse-api` | Node.js + Express | `127.0.0.1:18080` |
| `quranpulse-agent-ustaz` | Node.js worker | internal |
| `quranpulse-agent-content` | Node.js worker | internal |
| `quranpulse-redis` | Redis 7 | `127.0.0.1:6379` |

Current `quranpulse-api` endpoints:
- `GET /health`
- `POST /enqueue`

---

## 4. Ingress and DNS

Domains:

| Domain | Public role | Upstream |
|---|---|---|
| `api.gangniaga.my` | API ingress | `http://127.0.0.1:18080` |
| `operator.gangniaga.my` | OpenClaw UI/gateway ingress | `http://127.0.0.1:18789/` |

Nginx active files:
- `/etc/nginx/sites-enabled/api.gangniaga.my.conf`
- `/etc/nginx/sites-enabled/operator.gangniaga.my.conf`

---

## 5. Security Design

### 5.1 Firewall

UFW allow-list:
- `22/tcp`
- `80/tcp`
- `443/tcp`

No public bind for Redis/API/OpenClaw internals.

### 5.2 SSH

Required posture:
- `PermitRootLogin prohibit-password`
- `PasswordAuthentication no`
- key-only auth

### 5.3 Abuse protection

- fail2ban enabled (`sshd` jail)

### 5.4 TLS

- Let’s Encrypt certificates for both domains.
- Renewal by cron with nginx reload deploy hook.

---

## 6. Config and Secrets Layout

### OpenClaw

- unit: `/root/.config/systemd/user/openclaw-gateway.service`
- runtime/config data under `/opt/operator/openclaw` and `/root/.openclaw`

### QuranPulse compose envs

```text
/opt/apps/quranpulse/compose/.env.api
/opt/apps/quranpulse/compose/.env.agent_ustaz
/opt/apps/quranpulse/compose/.env.agent_content
```

Minimum sensitive keys:
- Supabase URL/keys
- service role key
- LLM provider keys

Rules:
- do not commit `.env*`,
- do not print secrets in logs,
- backup encrypted.

---

## 7. Queue Pattern (Current)

Flow today:

1. Client/API caller hits `POST /enqueue`.
2. API pushes payload to Redis list queue (`agent_ustaz` or `agent_content`).
3. Worker consumes queue via blocking pop.
4. Worker processes payload (currently log/consume behavior).

Production gap:
- no response/result callback contract yet.
- no `POST /ai/query` synchronous endpoint yet.

---

## 8. Target Enhancement for AI Delivery

To turn queue stack into full AI API:

1. Add `POST /ai/query` in `quranpulse-api`.
2. Generate `jobId`, enqueue payload with `jobId`.
3. Worker writes result to Redis key `result:{jobId}` (with TTL).
4. API waits/polls for result with timeout, returns final JSON.
5. Add auth + rate-limit + audit logging.

Optional:
- Keep Supabase `chat-proxy` as fallback channel.

---

## 9. Operations Commands

### Core checks

```bash
curl -s https://api.gangniaga.my/health
curl -s -o /dev/null -w "%{http_code}\n" https://operator.gangniaga.my/health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
systemctl --user status openclaw-gateway.service --no-pager -l
```

### Nginx

```bash
nginx -t
systemctl reload nginx
```

### Stack restart

```bash
cd /opt/apps/quranpulse/compose
docker compose restart
```

### Logs

```bash
docker logs --tail 100 quranpulse-api
docker logs --tail 100 quranpulse-agent-ustaz
journalctl --user -u openclaw-gateway.service --since "1 hour ago"
```

---

## 10. Non-Goals

- Kubernetes orchestration
- multi-VPS clustering
- exposing Redis/API ports directly to internet
- placing OpenClaw and QuranPulse into one monolithic runtime

---

## 11. Success Metrics

| Metric | Target |
|---|---|
| Uptime | >99.9% |
| API health endpoint | stable 200 |
| TLS validity | always valid |
| Incident triage time | <15 minutes for common failures |

---

## 12. Supporting Documents

- Live state: `docs/VPS_STATUS.md`
- OpenClaw specific SOP: `docs/OPENCLAW_GUIDE.md`
- Full incident/manual guide: `docs/VPS_MANUAL_A_TO_Z.md`


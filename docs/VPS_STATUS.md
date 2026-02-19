# NIAGAHUB VPS Infrastructure Status

> Server: `srv1322432`  
> Public IP: `76.13.176.142`  
> Tailscale IP: `100.100.205.64`  
> Last Verified: **2026-02-19 (UTC+8)**

---

## 1. Live Architecture Snapshot

### Two systems on one VPS

| System | Purpose | Runtime | Status |
|---|---|---|---|
| OpenClaw Operator | Internal operator control + AI workspace | `systemd --user` (root) | Active |
| QuranPulse API Stack | API queue + workers + Redis | Docker Compose | Active |

### Current request flow (verified)

```text
Internet
  -> Nginx :443
    -> api.gangniaga.my -> 127.0.0.1:18080 (quranpulse-api)
    -> operator.gangniaga.my -> 127.0.0.1:18789 (openclaw-gateway)
```

---

## 2. Runtime Verification

### Docker containers

| Container | Role | Bind |
|---|---|---|
| `quranpulse-api` | Queue API | `127.0.0.1:18080` |
| `quranpulse-agent-ustaz` | Queue worker (`agent_ustaz`) | Internal |
| `quranpulse-agent-content` | Queue worker (`agent_content`) | Internal |
| `quranpulse-redis` | Queue/cache | `127.0.0.1:6379` |

### OpenClaw service

| Property | Value |
|---|---|
| Unit | `openclaw-gateway.service` |
| Unit path | `/root/.config/systemd/user/openclaw-gateway.service` |
| Exec | `/usr/bin/node /opt/operator/openclaw/repo/dist/index.js gateway --port 18789` |
| Listen | `127.0.0.1:18789`, `[::1]:18789` |
| Health via Nginx | `https://operator.gangniaga.my/health` |

---

## 3. Network and Security State

### UFW

Allowed:
- `22/tcp`
- `80/tcp`
- `443/tcp`

Denied:
- `631/tcp`
- `631/udp`

### SSH hardening

- `PermitRootLogin prohibit-password`
- `PasswordAuthentication no`
- `PubkeyAuthentication yes`

### fail2ban

- Jail: `sshd`
- Active bans present (production traffic noise handled)

---

## 4. Nginx Routing (Active Files)

- `/etc/nginx/sites-enabled/api.gangniaga.my.conf`
- `/etc/nginx/sites-enabled/operator.gangniaga.my.conf`

Current upstreams:
- `api.gangniaga.my` -> `http://127.0.0.1:18080`
- `operator.gangniaga.my` -> `http://127.0.0.1:18789/`

---

## 5. API Surface (As-Is Today)

From `/opt/apps/quranpulse/services/api/server.js`:

- `GET /health` -> returns `ok`
- `POST /enqueue` -> pushes payload into Redis queue

Example:

```bash
curl -X POST https://api.gangniaga.my/enqueue \
  -H "Content-Type: application/json" \
  -d '{"queue":"agent_ustaz","payload":{"query":"uji"}}'
```

Response:

```json
{"enqueued":true,"queue":"agent_ustaz"}
```

---

## 6. Known Gaps (Important)

1. `quranpulse-api` is currently a queue ingress API, not a full chat API.
2. There is no public synchronous endpoint yet like `POST /ai/query`.
3. Workers currently consume queue and log payload; no final response callback route in this minimal stack.
4. Qdrant is not deployed.

---

## 7. Quick Health Commands

### External

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://api.gangniaga.my/health
curl -s -o /dev/null -w "%{http_code}\n" https://operator.gangniaga.my/health
```

### VPS internal

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
ss -lntp | egrep '(:443|:80|:18080|:18789|:6379)'
systemctl --user status openclaw-gateway.service --no-pager -l
```

### Logs

```bash
docker logs --tail 100 quranpulse-api
docker logs --tail 100 quranpulse-agent-ustaz
docker logs --tail 100 quranpulse-agent-content
journalctl --user -u openclaw-gateway.service --since "30 min ago"
```

---

## 8. Operations Docs

- Deployment design: `docs/VPS_PRD.md`
- OpenClaw operations: `docs/OPENCLAW_GUIDE.md`
- Full manual runbook: `docs/VPS_MANUAL_A_TO_Z.md`

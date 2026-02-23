# 📘 VPS — Operations Manual (A to Z)

> **Last Updated**: 21 Feb 2026
> **Status**: Active
> **Module**: Infrastructure / Operations

---

> Purpose: full manual runbook for operations, troubleshooting, and recovery
> Server target: `srv1322432`
> Last verified: **2026-02-19**

## A. Access and Authentication

1. SSH as root (key only):

```bash
ssh root@76.13.176.142
```

2. Confirm host and time:

```bash
hostname
date
```

3. If SSH fails:
- verify local key file and permissions,
- check VPS provider console,
- confirm UFW still allows `22/tcp`.

---

## B. Baseline Health Snapshot

Run this as first triage command block:

```bash
hostname
date
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
systemctl --user status openclaw-gateway.service --no-pager -l | sed -n '1,40p'
ss -lntp | egrep '(:443|:80|:18080|:18789|:6379)'
curl -s -o /dev/null -w "api=%{http_code}\n" https://api.gangniaga.my/health
curl -s -o /dev/null -w "operator=%{http_code}\n" https://operator.gangniaga.my/health
```

---

## C. Containers and Compose

Path:

```text
/opt/apps/quranpulse/compose
```

Start/stop/restart:

```bash
cd /opt/apps/quranpulse/compose
docker compose up -d
docker compose down
docker compose restart
```

Per service restart:

```bash
docker restart quranpulse-api
docker restart quranpulse-agent-ustaz
docker restart quranpulse-agent-content
docker restart quranpulse-redis
```

---

## D. Domain and DNS Validation

```bash
dig +short api.gangniaga.my
dig +short operator.gangniaga.my
curl -I https://api.gangniaga.my/health
curl -I https://operator.gangniaga.my/health
```

Expected:
- DNS resolves to current public IP.
- HTTPS returns `200`.

---

## E. Environment and Secrets

Do not print full secrets in logs or screenshots.

Files:

```text
/opt/apps/quranpulse/compose/.env.api
/opt/apps/quranpulse/compose/.env.agent_ustaz
/opt/apps/quranpulse/compose/.env.agent_content
```

Check only key presence:

```bash
awk -F= '/^[A-Z0-9_]+=/{print $1}' /opt/apps/quranpulse/compose/.env.api
awk -F= '/^[A-Z0-9_]+=/{print $1}' /opt/apps/quranpulse/compose/.env.agent_ustaz
awk -F= '/^[A-Z0-9_]+=/{print $1}' /opt/apps/quranpulse/compose/.env.agent_content
```

After env change:

```bash
cd /opt/apps/quranpulse/compose
docker compose up -d --force-recreate
```

---

## F. Firewall and Fail2ban

Firewall:

```bash
ufw status numbered
```

Fail2ban:

```bash
fail2ban-client status
fail2ban-client status sshd
```

If accidentally blocking trusted IP:

```bash
fail2ban-client set sshd unbanip <YOUR_IP>
```

---

## G. Gateway (OpenClaw) Operations

Status and logs:

```bash
systemctl --user status openclaw-gateway.service --no-pager -l
journalctl --user -u openclaw-gateway.service --since "30 min ago"
```

Restart:

```bash
systemctl --user restart openclaw-gateway.service
```

Socket check:

```bash
ss -lntp | grep 18789
```

---

## H. HTTPS and Nginx

Active vhost files:

```text
/etc/nginx/sites-enabled/api.gangniaga.my.conf
/etc/nginx/sites-enabled/operator.gangniaga.my.conf
```

Validate and reload:

```bash
nginx -t
systemctl reload nginx
```

Nginx logs:

```bash
tail -n 120 /var/log/nginx/error.log
tail -n 120 /var/log/nginx/access.log
```

---

## I. Incident Triage Workflow

1. Capture baseline snapshot.
2. Classify impact:
- API only,
- Operator only,
- both.
3. Check process/socket first.
4. Check Nginx mapping.
5. Check recent deploy/change.
6. Apply smallest safe restart.
7. Re-run smoke checks.
8. Record root cause + fix in handoff log.

---

## J. Journal and Log Commands

```bash
journalctl --user -u openclaw-gateway.service -f
docker logs --tail 200 quranpulse-api
docker logs --tail 200 quranpulse-agent-ustaz
docker logs --tail 200 quranpulse-agent-content
```

Time-window query:

```bash
journalctl --user -u openclaw-gateway.service --since "2026-02-19 00:00:00"
```

---

## K. Key Rotation (LLM/Supabase)

1. Update secret in corresponding `.env*` file.
2. Recreate impacted service only.
3. Verify with health + queue test.

Queue test:

```bash
curl -X POST https://api.gangniaga.my/enqueue \
  -H "Content-Type: application/json" \
  -d '{"queue":"agent_ustaz","payload":{"query":"rotation_test"}}'
```

Worker consume proof:

```bash
docker logs --tail 80 quranpulse-agent-ustaz
```

---

## L. Localhost Bind Integrity

Security principle:
- internal services bind localhost,
- public ingress only through Nginx.

Verify:

```bash
ss -lntp | egrep '(:18080|:18789|:6379)'
```

Expected:
- `127.0.0.1:18080`
- `127.0.0.1:18789`
- `127.0.0.1:6379`

---

## M. Monitoring and Cron

Check root cron:

```bash
crontab -l
```

Current important jobs:
- backup script,
- OpenClaw update check,
- quota alert,
- watchdog,
- certbot renew.

If cron appears broken:

```bash
systemctl status cron --no-pager
grep CRON /var/log/syslog | tail -n 120
```

---

## N. Network Troubleshooting

Quick checks:

```bash
ip a
ip r
ping -c 2 1.1.1.1
curl -I https://api.gangniaga.my/health
```

If domain fails but localhost works:
- likely Nginx or certificate issue.

If localhost fails:
- likely service/container issue.

---

## O. OpenClaw Upgrade Safe Procedure

1. Backup current unit and runtime files.
2. Stop service.
3. Deploy new build.
4. Start service.
5. Validate local health then public health.

Command sequence:

```bash
systemctl --user stop openclaw-gateway.service
cp /root/.config/systemd/user/openclaw-gateway.service /root/.config/systemd/user/openclaw-gateway.service.bak.$(date +%F-%H%M%S)
systemctl --user start openclaw-gateway.service
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:18789/health
curl -s -o /dev/null -w "%{http_code}\n" https://operator.gangniaga.my/health
```

---

## P. QuranPulse API Queue Operations

Health:

```bash
curl -s http://127.0.0.1:18080/health
curl -s https://api.gangniaga.my/health
```

Enqueue request:

```bash
curl -X POST http://127.0.0.1:18080/enqueue \
  -H "Content-Type: application/json" \
  -d '{"queue":"agent_ustaz","payload":{"query":"manual_check"}}'
```

Consumer verification:

```bash
docker logs --tail 80 quranpulse-agent-ustaz
```

---

## Q. Qdrant Status

Current state: not deployed.

If you test health now:

```bash
curl -s http://127.0.0.1:6333/healthz
```

Expected currently: unavailable until deployed.

---

## R. Recovery and Rollback

### API stack rollback

1. Restore previous compose and env backup.
2. Recreate containers.
3. Validate health.

```bash
cd /opt/apps/quranpulse/compose
docker compose down
docker compose up -d
curl -s https://api.gangniaga.my/health
```

### OpenClaw rollback

1. restore unit/build backup
2. restart service
3. verify local and public health

---

## S. Security Maintenance

Weekly:
1. `ufw status numbered`
2. `fail2ban-client status sshd`
3. check unexpected open sockets:

```bash
ss -lntp
```

Monthly:
1. verify cert expiry:

```bash
openssl s_client -connect api.gangniaga.my:443 -servername api.gangniaga.my < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

2. patch OS:

```bash
apt update && apt upgrade -y
```

---

## T. Top 10 Common Problems and Fixes

1. `502 Bad Gateway` on API domain
   Fix: check `quranpulse-api` container and port bind.
2. `502` on operator domain
   Fix: check OpenClaw service + socket `127.0.0.1:18789`.
3. Enqueue works but no processing
   Fix: check worker logs and Redis connectivity.
4. Worker alive but no queue consumption
   Fix: verify queue name in `.env.agent_*`.
5. TLS expired warning
   Fix: run `certbot renew` and reload nginx.
6. SSH brute-force noise
   Fix: verify fail2ban jail active.
7. sudden restart loops
   Fix: `journalctl` root cause first, then rollback.
8. domain up, local down
   Fix: service internal crash, not DNS issue.
9. local up, domain down
   Fix: Nginx routing/cert problem.
10. performance degradation
   Fix: inspect container resource usage and logs.

---

## U. Update Procedure (Controlled)

For compose services:

```bash
cd /opt/apps/quranpulse/compose
docker compose pull
docker compose up -d
docker ps --format "table {{.Names}}\t{{.Status}}"
```

Then run smoke tests:

```bash
curl -s https://api.gangniaga.my/health
curl -s -o /dev/null -w "%{http_code}\n" https://operator.gangniaga.my/health
```

---

## V. Validation Checklist After Any Change

1. `docker ps` all required containers up.
2. OpenClaw service active.
3. Sockets correct.
4. Both domain health checks 200.
5. Queue enqueue + consume verified.
6. No major errors in last 10 minutes logs.

---

## W. Worker Debugging

Inspect:

```bash
docker logs --tail 200 quranpulse-agent-ustaz
docker logs --tail 200 quranpulse-agent-content
```

If worker cannot connect Redis:
1. verify `REDIS_URL` in env.
2. verify `quranpulse-redis` container up.
3. test Redis ping from API/worker container shell if needed.

---

## X. eXternal Dependency Checks

Supabase connectivity (if relevant to your app flow):

1. check env values exist.
2. run app-side health call or minimal SQL path from service.

LLM provider issue:
- if provider returns 403/429 repeatedly, rotate key and redeploy worker.

---

## Y. Yearly Hardening Tasks

1. review and rotate long-lived secrets.
2. remove unused domains and vhosts.
3. audit cron jobs for duplicates.
4. re-check backup restore process.
5. re-run full DR drill in staging.

---

## Z. Zero-Downtime Discipline

1. never restart everything at once unless full outage.
2. restart smallest failing unit first.
3. always take pre-change snapshot:
- current config,
- active containers,
- recent logs.
4. verify success immediately with smoke tests.
5. document what changed and why.

---

## Appendix: Quick One-Command Snapshot

```bash
echo "== time ==" && date \
&& echo "== docker ==" && docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" \
&& echo "== openclaw ==" && systemctl --user is-active openclaw-gateway.service \
&& echo "== sockets ==" && ss -lntp | egrep '(:443|:80|:18080|:18789|:6379)' \
&& echo "== health ==" \
&& curl -s -o /dev/null -w "api=%{http_code}\n" https://api.gangniaga.my/health \
&& curl -s -o /dev/null -w "operator=%{http_code}\n" https://operator.gangniaga.my/health
```


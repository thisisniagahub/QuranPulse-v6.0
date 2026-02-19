# OpenClaw Gateway Guide

> Scope: operate and troubleshoot OpenClaw gateway on VPS  
> Verified against live server: **2026-02-19**

---

## 1. Service Identity

| Item | Value |
|---|---|
| Service unit | `openclaw-gateway.service` |
| Service mode | root user `systemd --user` |
| Unit file | `/root/.config/systemd/user/openclaw-gateway.service` |
| Binary | `/usr/bin/node /opt/operator/openclaw/repo/dist/index.js gateway --port 18789` |
| Listen socket | `127.0.0.1:18789` |
| Public domain | `https://operator.gangniaga.my` |
| Nginx upstream | `http://127.0.0.1:18789/` |

---

## 2. Mandatory Baseline Checks

Run in this order:

```bash
systemctl --user status openclaw-gateway.service --no-pager -l
ss -lntp | grep 18789
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:18789/health
curl -s -o /dev/null -w "%{http_code}\n" https://operator.gangniaga.my/health
```

Expected:
- service active/running
- socket listening on localhost
- HTTP 200 from local and domain health URL

---

## 3. Start/Stop/Restart

```bash
systemctl --user start openclaw-gateway.service
systemctl --user stop openclaw-gateway.service
systemctl --user restart openclaw-gateway.service
systemctl --user status openclaw-gateway.service
```

If service does not auto-survive logout:

```bash
loginctl enable-linger root
```

---

## 4. Logs and Triage

### Follow logs live

```bash
journalctl --user -u openclaw-gateway.service -f
```

### Last 1 hour

```bash
journalctl --user -u openclaw-gateway.service --since "1 hour ago"
```

### Last boot

```bash
journalctl --user -u openclaw-gateway.service -b --no-pager
```

---

## 5. Common Failure Playbook

### Case A: `operator.gangniaga.my` down but service up

1. Check Nginx config:

```bash
nginx -t
```

2. Verify vhost file points to `127.0.0.1:18789`:

```bash
sed -n '1,200p' /etc/nginx/sites-enabled/operator.gangniaga.my.conf
```

3. Reload Nginx:

```bash
systemctl reload nginx
```

### Case B: Port 18789 not listening

1. Check service status and errors.
2. Restart service.
3. Re-check socket:

```bash
ss -lntp | grep 18789
```

### Case C: Frequent restart loops

1. Get precise crash line in journal.
2. Verify node runtime path exists.
3. Verify working tree path:

```bash
ls -la /opt/operator/openclaw/repo/dist/index.js
```

4. Validate systemd unit syntax:

```bash
systemd-analyze verify /root/.config/systemd/user/openclaw-gateway.service
```

---

## 6. Safe Update Procedure

When updating OpenClaw binary/build:

1. Capture current state and logs.
2. Stop service.
3. Deploy new build under `/opt/operator/openclaw/repo/dist`.
4. Start service.
5. Run post-checks:

```bash
systemctl --user status openclaw-gateway.service --no-pager -l
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:18789/health
curl -s -o /dev/null -w "%{http_code}\n" https://operator.gangniaga.my/health
```

---

## 7. Security Notes

1. Keep OpenClaw bound to localhost unless there is a strict network reason.
2. Do not log gateway tokens or secrets.
3. Public exposure must remain via Nginx + TLS only.
4. Keep SSH hardening and fail2ban active.

---

## 8. Troubleshooting Checklist (Fast)

Use this in incidents:

```bash
date
hostname
systemctl --user status openclaw-gateway.service --no-pager -l
ss -lntp | grep 18789
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:18789/health
curl -s -o /dev/null -w "%{http_code}\n" https://operator.gangniaga.my/health
nginx -t
journalctl --user -u openclaw-gateway.service --since "30 min ago" | tail -n 120
```

---

## 9. Related Docs

- `docs/VPS_STATUS.md`
- `docs/VPS_PRD.md`
- `docs/VPS_MANUAL_A_TO_Z.md`

# 🦞 OpenClaw Complete Guide

> **OpenClaw** is an AI agent gateway that connects LLMs to messaging channels (WhatsApp, Telegram, Discord, etc.) with tool execution, multi-agent workflows, and enterprise-grade security.

---

## Table of Contents
- [Architecture Decision](#architecture-decision)
- [Bot Identity](#bot-identity)
- [Installation](#installation)
- [Model Configuration](#model-configuration)
- [Providers](#providers)
- [Deployment (NIAGAHUB)](#deployment-niagahub)
- [Security](#security)
- [CLI Commands](#cli-commands)
- [Troubleshooting](#troubleshooting)

---

## Architecture Decision

> **NIAGAHUB PRD Decision**: OpenClaw runs as **root user systemd service** (NOT Docker, NOT system-level systemd)

### Why Root User systemd?

| Factor | Root User systemd | System Service | Docker |
|--------|-------------------|----------------|--------|
| **Installer** | `openclaw onboard` creates this ✅ | Manual setup | Manual setup |
| **Reliability** | Always-on, linger-enabled | Always-on | Container orchestration |
| **Logging** | `journalctl --user` | `journalctl -u` | Separate log driver |
| **Complexity** | Less moving parts | Less moving parts | More layers |
| **Use Case** | Operator (GangBot) ✅ | — | QuranPulse ✅ |

### NIAGAHUB Pattern
```
Operator (GangBot/OpenClaw) → root user systemd service ✓
QuranPulse (App Platform)   → Docker Compose ✓
```

---

## Bot Identity

| Property | Value |
|----------|-------|
| Bot name | 🦈 NiagaHubBot |
| WhatsApp number | +601121112919 |
| WhatsApp allowlist | +601169416694 |
| Telegram bot | @GangNiagaBot |
| Telegram user ID | 6798585537 |

---

## Installation

### Prerequisites
- Node 22 or newer
- systemd (Linux)

### Install OpenClaw Binary
```bash
# macOS/Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex

# Run onboarding wizard (creates user service)
openclaw onboard --install-daemon

# Check status
openclaw gateway status
```

---

## Model Configuration

### Model Format
```
provider/model-name
```

### Built-in Aliases

| Alias | Full Model ID |
|-------|---------------|
| `opus` | `anthropic/claude-opus-4-6` |
| `sonnet` | `anthropic/claude-sonnet-4-5` |
| `gpt` | `openai/gpt-5.2` |
| `gemini` | `google/gemini-3-pro-preview` |
| `gemini-flash` | `google/gemini-3-flash-preview` |

### NIAGAHUB Config (Actual — 2026-02-10)
```json5
{
  agents: {
    defaults: {
      model: {
        primary: "google-antigravity/gemini-3-flash",   // ← current active
        fallbacks: ["google-antigravity/gemini-3-pro"]  // ← target upgrade
      }
    }
  }
}
```

### Setting Models via CLI
```bash
# Set primary model
openclaw models set google-antigravity/gemini-3-flash

# Add fallback
openclaw models fallbacks add google-antigravity/gemini-3-pro

# Verify
openclaw models status
openclaw models list
```

---

## Providers

### Supported Providers

| Provider | Example Model |
|----------|---------------|
| **google-antigravity** | `google-antigravity/gemini-3-flash` |
| **Anthropic** | `anthropic/claude-opus-4-6` |
| **OpenAI** | `openai/gpt-5.2` |
| **OpenRouter** | `openrouter/meta-llama/llama-3.3-70b` |
| **OpenCode Zen** | `opencode/claude-opus-4-6` |

### Adding Provider Auth
```bash
openclaw onboard              # Interactive wizard
openclaw auth add google      # Specific provider
openclaw auth list            # List configured
```

---

## Deployment (NIAGAHUB)

### Service Architecture

OpenClaw runs as a **root user systemd service**:

```
Service file: /root/.config/systemd/user/openclaw-gateway.service
Config file:  /opt/operator/openclaw/data/.openclaw/openclaw.json
Bind address: 100.100.205.64:18789 (Tailscale)
```

### Service File
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

### Essential Setup
```bash
# Enable linger so service survives SSH logout
loginctl enable-linger root

# Enable and start
systemctl --user daemon-reload
systemctl --user enable openclaw-gateway.service
systemctl --user start openclaw-gateway.service

# Verify
systemctl --user status openclaw-gateway.service
```

> [!CAUTION]
> **Dual Service Conflict**: A system-level service at `/etc/systemd/system/openclaw-gateway.service` may exist. It MUST be masked to prevent port 18789 conflicts:
> ```bash
> systemctl stop openclaw-gateway.service
> systemctl disable openclaw-gateway.service
> systemctl mask openclaw-gateway.service
> # This creates a symlink to /dev/null
> ```

### Logs
```bash
# Follow logs (root user service)
journalctl --user -u openclaw-gateway.service -f

# Recent logs
journalctl --user -u openclaw-gateway.service --since "1 hour ago"

# ⚠️ DO NOT USE: journalctl -u openclaw-gateway (this is for system services)
```

### Docker Compose (NOT used for NIAGAHUB)

> ⚠️ **Note**: Docker is NOT how OpenClaw runs on NIAGAHUB. This section is for reference only.

```yaml
# docker-compose.yml (reference only)
version: '3.8'
services:
  openclaw-gateway:
    image: openclaw:local
    container_name: openclaw-gateway
    restart: unless-stopped
    ports:
      - "127.0.0.1:18789:18789"
    volumes:
      - ./data/.openclaw:/home/node/.openclaw
    env_file:
      - .env
```

---

## Security

### VirusTotal Integration
- All ClawHub skills scanned automatically
- Code Insight (Gemini-powered) for behavior analysis
- Auto-approval for benign, blocked for malicious

### Best Practices
1. Bind to Tailscale IP (not public interface)
2. Use Nginx reverse proxy for public access
3. Configure allowlists (`channels.whatsapp.allowFrom`)
4. Enable rate limiting per channel
5. Keep system-level service masked

---

## CLI Commands

### Gateway
```bash
openclaw gateway status          # Health check
openclaw gateway --port 18789    # Run foreground
openclaw dashboard               # Open Control UI
openclaw doctor                  # Diagnose issues
openclaw doctor --fix            # Auto-repair
```

### Models
```bash
openclaw models list             # List available
openclaw models status           # Current config
openclaw models set <model>      # Set primary
openclaw models fallbacks add    # Add fallback
openclaw models fallbacks list   # List fallbacks
```

### In-Chat
```bash
/model              # Model picker
/model list         # List models
/model status       # Detailed info
```

---

## Troubleshooting

### "No API key found for provider"
```bash
openclaw auth add <provider>
openclaw auth list
```

### "Model is not allowed"
```bash
# Add to allowlist in config
agents.defaults.models["provider/model"] = {}
```

### Gateway won't start
```bash
openclaw doctor --fix
journalctl --user -u openclaw-gateway.service --since "10 min ago"
```

### Port 18789 already in use (EADDRINUSE)
```bash
# Check what's using the port
ss -tlnp | grep 18789

# If system service is running, mask it
systemctl stop openclaw-gateway.service
systemctl mask openclaw-gateway.service

# Then restart the user service
systemctl --user restart openclaw-gateway.service
```

### EACCES permission on openclaw.json
```bash
# Ensure the config file is owned by root
chown root:root /opt/operator/openclaw/data/.openclaw/openclaw.json
chmod 600 /opt/operator/openclaw/data/.openclaw/openclaw.json
```

### Service stops after SSH logout
```bash
# Enable linger for root
loginctl enable-linger root

# Verify
loginctl show-user root | grep Linger
# Should output: Linger=yes
```

---

## Resources
- **Docs**: https://docs.openclaw.ai
- **GitHub**: https://github.com/openclaw/openclaw
- **ClawHub**: https://clawhub.ai

---

*Last Updated: 2026-02-10*

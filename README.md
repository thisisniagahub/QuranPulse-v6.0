
# 🌌 QuranPulse v6.0 "Noor-e-Cyber"

> **"Teknologi untuk Taqwa & Syukur"**
> The Super-Islamic App bridging spiritual depth with futuristic Cyber-Islamic design.

![Status](https://img.shields.io/badge/Status-Production-green?style=for-the-badge&logo=react)
![Theme](https://img.shields.io/badge/Theme-Raudhah-teal?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Vercel-Live-black?style=for-the-badge&logo=vercel)

---

## 🎯 Project Overview

QuranPulse v6.0 is a **Progressive Web App (PWA)** designed to revolutionize the Islamic digital experience with AI-powered features and premium "Raudhah" aesthetics.

### Key Features
- 🧠 **Smart Deen (Ustaz AI)** - Shafi'i-compliant AI chat with emotional intelligence
- 📖 **Iqra Digital** - Interactive Quran learning with ASR
- 🕌 **Ibadah Suite** - Prayer times, Qibla, Masjid locator
- 💎 **Pulse Command Center** - Spiritual dashboard
- 🤖 **AI Tadabbur Mode** - Guided Quran reflection with AI questions
- 🏆 **Community Leaderboard** - Gamified progress tracking

---

## 🏗️ Architecture

### Two Systems, One Platform

| System | Purpose | Deployment |
|--------|---------|------------|
| **QuranPulse App** | User-facing PWA | Vercel (Frontend), VPS Docker (API) |
| **Operator (GangBot)** | Admin AI assistant | VPS (root user systemd) |

### VPS Infrastructure (srv1322432)
```
operator.gangniaga.my → OpenClaw Gateway (root user systemd, Tailscale)
api.gangniaga.my      → QuranPulse API (Docker Compose)
Tailscale VPN         → 100.100.205.64 (private mesh)
```

See [docs/VPS_PRD.md](docs/VPS_PRD.md) for complete deployment architecture.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS v4 |
| Animation | Framer Motion (Glassmorphism & Neon) |
| State | Zustand, React Query |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions) |
| AI | Gemini via Antigravity, Groq, OpenAI Whisper |
| Deployment | Vercel (Frontend), Ubuntu VPS (API) |

---

## 🚀 Quick Start

### Web App (Root App)
```bash
npm install
npm run dev
# Visit http://localhost:5173
```

### Admin Dashboard
```bash
cd apps/admin-dashboard
npm install
npm run dev
# Visit http://localhost:3000
```

See [DESIGN.md](DESIGN.md) for the canonical repository layout and naming rules.

---

## 📂 Project Structure

```
apps/
├── admin-dashboard/      # Next.js admin app
└── niagahub-superapp/    # Secondary product workspace

packages/
├── iqra-content/         # Runtime Iqra JSON content
├── iqra-hub/             # Master Iqra source pack
├── reference-content/    # Research PDFs and extracted text
└── umrah-content/        # Umrah reference bundle

docs/
├── architecture/         # System and AI architecture
├── operations/           # VPS, deployment, and runbooks
├── product/              # Product strategy and master specs
└── vault/                # Archived deep documentation

src/                      # Main Vite app source
public/                   # Main Vite app public assets
server/                   # Bot/server helpers
supabase/                 # Edge Functions and migrations
```

---

## 📚 Documentation

### Infrastructure
- [VPS PRD](docs/operations/VPS_PRD.md) - Deployment architecture & decisions
- [VPS Status](docs/operations/VPS_STATUS.md) - Current infrastructure state
- [OpenClaw Guide](docs/operations/OPENCLAW_GUIDE.md) - AI gateway configuration
- [VPS Manual A-Z](docs/operations/VPS_MANUAL_A_TO_Z.md) - Full manual operations and incident recovery runbook

### Features
- [Vault Index](docs/vault/INDEX.md) - Archived feature and implementation documentation
- [Documentation Map](docs/README.md) - Curated documentation structure

---

## 🤖 Agent Context

For AI agents working on this project:
- [AGENTS.md](AGENTS.md) - Universal agent context (agents.md standard)
- [GEMINI.md](GEMINI.md) - Extended project context
- [.agent/](/.agent/) - Protocols and workflows

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| Production | https://quranpulse.my |
| API | https://api.gangniaga.my |
| Operator | https://operator.gangniaga.my |

---

*Built with ❤️ by the Antigravity Team*

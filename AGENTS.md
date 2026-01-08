# AGENTS.md - QuranPulse v6.0

> **Universal Context File for ALL AI Coding Agents**
> Last Updated: 2026-01-08 by Gemini Pro 3

---

## 🚨 CRITICAL RULES FOR ALL AI AGENTS

### Rule 1: Read Before Acting
1. READ this entire file before ANY action
2. CHECK `.agent/context/CURRENT_TASK.md` for active work
3. REVIEW `.agent/context/PROTECTED_FILES.md` before deleting

### Rule 2: Never Delete Without Permission
- ❌ NEVER delete files without explicit `/approve-delete` from user
- ❌ NEVER remove functions unless replacing with better version
- ✅ ALWAYS explain WHY before removing any code
- ✅ CREATE backup branch before major changes

### Rule 3: Document Your Work
- UPDATE `CURRENT_TASK.md` when starting/ending tasks
- ADD entry to `HANDOFF_LOG.md` before session ends
- COMMIT with prefix: `[AGENT:Name] type: message`

---

## 📊 Project Status

| Field | Value |
|-------|-------|
| **Phase** | DEVELOPMENT |
| **Focus** | Testing & Stability |
| **Last Agent** | Gemini Pro 3 |
| **Last Updated** | 2026-01-08 23:00 |

---

## 🛡️ Tech Stack (DO NOT CHANGE WITHOUT APPROVAL)

| Layer | Technology | Status |
|-------|------------|:------:|
| Frontend | React 18 + Vite + TypeScript | 🔒 Locked |
| Styling | Tailwind CSS v4 + Framer Motion | 🔒 Locked |
| Backend | Supabase (PostgreSQL + Auth) | 🔒 Locked |
| AI | Gemini 2.5 Flash + Groq Fallback | ⚙️ Configurable |
| Testing | Jest + React Testing Library | ⚙️ Configurable |

---

## 📂 Project Structure Quick Reference

```
src/
├── modules/           # 15 feature modules
│   ├── quran/         # Quran reader
│   ├── iqra/          # Learning (17 files)
│   ├── smart-deen/    # Ustaz AI chat
│   ├── ibadah/        # Prayer times, Qibla
│   ├── dashboard/     # Main dashboard
│   └── ...
├── services/          # 31 service files
│   ├── aiService.ts   # Main AI orchestration
│   ├── quranService.ts
│   └── UstazOrchestrator.ts
├── components/        # Shared UI components
├── contexts/          # React contexts
└── hooks/            # Custom hooks
```

---

## 🔄 Current Task

**See:** `.agent/context/CURRENT_TASK.md`

---

## 🤖 Agent Workflows (MCP-Based)

| Command | Agent Specialty | Use Case |
|---------|-----------------|----------|
| `/agent-quran` | Quran API | Verse search, audio |
| `/agent-compliance` | JAKIM/Fatwa | Halal checks |
| `/agent-education` | Hadith/Tafsir | Learning content |
| `/agent-worship` | Prayer times | Solat, Qibla |
| `/agent-asr` | Voice Analysis | Tajweed scoring |

---

## 📋 Priority Tasks

1. **HIGH:** Increase test coverage (currently ~15%)
2. **HIGH:** Connect Smart Deen to real AI service
3. **MEDIUM:** Complete Admin Dashboard
4. **MEDIUM:** Add E2E tests with Playwright

---

## 🔗 Key Documentation

- [Deep Dive Audit](DOCS_VAULT/DEEP_DIVE_AUDIT.md)
- [Architecture Diagrams](DOCS_VAULT/ARCHITECTURE_DIAGRAM.md)
- [Testing Guide](DOCS_VAULT/01_FEATURES_IMPLEMENTED/TESTING.md)
- [Pending Features](DOCS_VAULT/02_FEATURES_PENDING/)

---

## 💡 Quick Commands

```bash
# Development
npm run dev           # Start dev server (port 5173)
npm run build         # Production build
npm test              # Run Jest tests

# Admin Dashboard (separate app)
cd admin-dashboard && npm run dev
```

---

**[End of AGENTS.md]**

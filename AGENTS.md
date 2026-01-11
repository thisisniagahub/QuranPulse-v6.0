# AGENTS.md - QuranPulse v6.0

> **Universal Context File for ALL AI Coding Agents**
> Last Updated: 2026-01-11 by Gemini Pro 3

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
| **Focus** | Quran Module Complete ✅ |
| **Last Agent** | Gemini Pro 3 |
| **Last Updated** | 2026-01-11 10:30 |
| **Build** | ✅ Passing |
| **Tests** | ✅ 82/82 Passing |

---

## 🛡️ Tech Stack (DO NOT CHANGE WITHOUT APPROVAL)

| Layer | Technology | Status |
|-------|------------|:------:|
| Frontend | React 18 + Vite + TypeScript | 🔒 Locked |
| Styling | Tailwind CSS v4 + Framer Motion | 🔒 Locked |
| Backend | Supabase (PostgreSQL + Auth) | 🔒 Locked |
| AI | Gemini 2.5 Flash + Groq Fallback | ⚙️ Configurable |
| Testing | Jest + React Testing Library | ⚙️ Configurable |
| Database | 103 tables, 174 indexes, 66 RLS policies | 📊 Audited |

---

## 📂 Project Structure Quick Reference

```
src/
├── modules/           # 15 feature modules
│   ├── quran/         # Quran reader (44+ components) ✨ UPGRADED
│   ├── iqra/          # Learning (17 files)
│   ├── smart-deen/    # Ustaz AI chat
│   ├── ibadah/        # Prayer times, Qibla
│   ├── dashboard/     # Main dashboard
│   └── ...
├── services/          # 31 service files
│   ├── aiService.ts   # Main AI orchestration
│   ├── quranService.ts
│   ├── pdfContentService.ts  # NEW - PDF knowledge base
│   └── UstazOrchestrator.ts
├── components/        # Shared UI components
├── contexts/          # React contexts
└── hooks/            # Custom hooks
```

---

## ✨ Quran Module Features (2026-01-11)

### Tier 1 - Quick Wins ✅

| Feature | File | Status |
|---------|------|:------:|
| Semantic Search | `features/search/` | ✅ |
| Daily Ayat Widget | `components/DailyAyatWidget.tsx` | ✅ |
| Khatam Tracker | `components/KhatamProgressTracker.tsx` | ✅ |

### Tier 2 - Medium ✅

| Feature | File | Status |
|---------|------|:------:|
| Tadabbur AI | `features/studio/TadabburAI.tsx` | ✅ |
| Voice-Active Reader | `features/reader/VoiceActiveReader.tsx` | ✅ |
| Word Root Explorer | `components/WordRootExplorer.tsx` | ✅ |

### Tier 3 - Advanced ✅

| Feature | File | Status |
|---------|------|:------:|
| Digital Mushaf | `features/reader/MushafView.tsx` | ✅ |
| Iqra Graduation | `components/IqraGraduation.tsx` | ✅ |
| Smart Deen Crossover | `components/SmartDeenCrossover.tsx` | ✅ |

---

## 🔄 Current Task

**See:** `.agent/context/CURRENT_TASK.md`

**Recent Completions:**
- ✅ Quran Module Tier 1, 2, 3 (9 features)
- ✅ Database Audit (103 tables aligned)
- ✅ PDF Content Integration (4 new tables)
- ✅ Documentation Update

---

## 🤖 Agent Workflows (MCP-Based)

| Command | Agent Specialty | Use Case |
|---------|-----------------|----------|
| `/agent-quran` | Quran API | Verse search, audio |
| `/agent-compliance` | JAKIM/Fatwa | Halal checks |
| `/agent-education` | Hadith/Tafsir | Learning content |
| `/agent-worship` | Prayer times | Solat, Qibla |
| `/agent-asr` | Voice Analysis | Tajweed scoring |
| `/agent-zakat` | Zakat Calculator | Zakat calculations |
| `/agent-admin` | Admin Functions | System stats |

---

## 📋 Priority Tasks

### ✅ Completed (2026-01-11)
- [x] Quran Semantic Search
- [x] Daily Ayat + Khatam Tracker
- [x] Tadabbur AI + Voice Reader
- [x] Digital Mushaf View
- [x] Documentation Update

### 🔄 Pending
1. **HIGH:** Increase test coverage (currently passing)
2. **MEDIUM:** Complete Admin Dashboard CRUD
3. **MEDIUM:** Add E2E tests with Playwright
4. **LOW:** AR Quran Mode (Tier 3 Advanced)

---

## 🔗 Key Documentation

| Document | Description |
|----------|-------------|
| [QURAN_MODULE.md](DOCS_VAULT/01_FEATURES_IMPLEMENTED/QURAN_MODULE.md) | **Quran module (9 features)** |
| [Deep Dive Audit](DOCS_VAULT/DEEP_DIVE_AUDIT.md) | Full code audit |
| [Architecture Diagrams](DOCS_VAULT/ARCHITECTURE_DIAGRAM.md) | System diagrams |
| [Testing Guide](DOCS_VAULT/01_FEATURES_IMPLEMENTED/TESTING.md) | Test setup |
| [CHANGELOG](CHANGELOG.md) | Version history |

---

## 💡 Quick Commands

```bash
# Development
npm run dev           # Start dev server (port 5173)
npm run build         # Production build
npm test              # Run Jest tests (82 tests)

# Admin Dashboard (separate app)
cd admin-dashboard && npm run dev
```

---

## 📈 Recent Commits (2026-01-11)

```
8395b37 docs: Update documentation with Quran module features
2186cc3 feat(quran): Add Tier 3 - Iqra graduation + Smart Deen
b4d344f feat(quran): Add Digital Mushaf View
b6d803f feat(quran): Add Tier 2 upgrades
eecac6b feat(quran): Add Khatam Progress Tracker
62660b7 feat(quran): Add Daily Ayat Widget
295b329 feat(quran): Add semantic search implementation
```

---

**[End of AGENTS.md]**

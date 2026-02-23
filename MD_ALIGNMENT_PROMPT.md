# 📄 MD Files Alignment & Icon Improvement — Codex CLI Prompt

> **Purpose**: Improve ALL .md files for consistency, alignment, and icon quality
> **Run**: `codex -p @MD_ALIGNMENT_PROMPT.md`
> **Workspace**: `i:\ANTIGRAVITY\QuranPulse-v6.0`

---

## ⚠️ CRITICAL RULES

1. **JANGAN ubah technical content** — hanya formatting, icons, dan alignment
2. **JANGAN padam/ubah Arabic text** atau Quran content
3. **Icons MUST be meaningful** — bukan random emoji spam (NO AI SLOP!)
4. **Consistent header format** across ALL files
5. **Bahasa Melayu** untuk user-facing docs, English untuk technical docs

---

## 🎯 What Needs Fixing

### Icon Rules — NO AI SLOP

**BAD (AI Slop)**: Using random emojis that add NO value:
```
🚀 Getting Started  ← rocket has nothing to do with getting started
💡 Configuration     ← lightbulb is overused and meaningless
🔥 Installation      ← fire? really?
✨ Features           ← sparkles everywhere = visual noise
```

**GOOD (Meaningful Icons)**:
```
📖 Iqra Digital       ← book icon for reading module
🕌 Prayer Times       ← mosque for prayer
🧭 Qibla Direction    ← compass for direction
📿 Tasbih Counter     ← prayer beads for dhikr
🤲 Dua Collection     ← prayer hands for dua
⚖️ Zakat Calculator   ← scales for calculation
🎓 Graduation         ← for learning completion
📊 Analytics          ← chart for data
🔒 Security           ← lock for security
⚙️ Configuration      ← gear for settings
📁 Files              ← folder for file structure
🖥️ Server             ← computer for server
🐳 Docker             ← whale for Docker
🔌 Connection         ← plug for connectivity
📡 API                ← satellite for API/network
🛡️ Compliance         ← shield for protection/compliance
📋 Specification      ← clipboard for specs
🗄️ Database           ← cabinet for data storage
```

### Header Format Standard

Every `.md` file MUST follow this structure:

```markdown
# [Icon] Title — Subtitle

> **Last Updated**: [Date]  
> **Status**: [Active/Draft/Deprecated]  
> **Module**: [Which module this belongs to]

---

## Content sections with proper H2 headings
```

---

## 📂 Files to Process

### `docs/` Directory (30 files)

Process each file below. For each file:
1. ✅ Fix header to match standard format
2. ✅ Replace AI slop icons with meaningful ones
3. ✅ Ensure consistent H2/H3 structure  
4. ✅ Add "Last Updated" if missing
5. ✅ Fix broken links if any

#### Iqra Spec Files (9 files)

| File | Correct Icon | Expected Title |
|------|:---:|---|
| `iqra_scope.md` | 📖 | Iqra Digital — Scope & Overview |
| `iqra_content_structure.md` | 📚 | Iqra Digital — Content Structure |
| `iqra_learning_flow.md` | 🪜 | Iqra Digital — Learning Flow |
| `iqra_pronunciation_rules.md` | 🗣️ | Iqra Digital — Pronunciation Rules (Makhraj) |
| `iqra_error_types.md` | ⚠️ | Iqra Digital — Error Types & Handling |
| `iqra_audio_spec.md` | 🔊 | Iqra Digital — Audio Specification |
| `iqra_ui_states.md` | 🖼️ | Iqra Digital — UI States |
| `iqra_parent_mode.md` | 👨‍👧 | Iqra Digital — Parent Mode |
| `iqra_progress_metrics.md` | 📊 | Iqra Digital — Progress Metrics |

#### Islamic Module Docs

| File | Correct Icon | Expected Title |
|------|:---:|---|
| `BARAKAH_ENGINE.md` | 📿 | Barakah Engine — Spiritual Progress System |
| `ETHICAL_AI_FRAMEWORK.md` | 🛡️ | Ethical AI Framework — Islamic AI Guidelines |
| `JAKIM_INTEGRATION_STRATEGY.md` | 🏛️ | JAKIM Integration — Official Islamic Authority API |
| `MAIWP_INTEGRATION_STRATEGY.md` | 🏛️ | MAIWP Integration — Wilayah Persekutuan Strategy |
| `ZAKAT_MODULE.md` | ⚖️ | Zakat Module — Calculation & Distribution |
| `MADANI_INSIGHTS.md` | 📈 | Madani Insights — Data Analytics Engine |
| `MASJID_ECOSYSTEM.md` | 🕌 | Masjid Ecosystem — Community Mosque Network |
| `TOK_IMAM_BOT_ARCH.md` | 🤖 | Tok Imam Bot — AI Architecture |

#### Technical Architecture Docs

| File | Correct Icon | Expected Title |
|------|:---:|---|
| `QURANPULSE_MASTER_SPEC.md` | 📋 | QuranPulse Master — Technical Specification |
| `ADVANCED_AI_STACK.md` | 🧠 | Advanced AI Stack — Model Architecture |
| `AUTH_AI_STRATEGY.md` | 🔐 | Auth & AI Strategy — Security Framework |
| `DATA_PIPELINE_SPEC.md` | 🗄️ | Data Pipeline — ETL Specification |
| `ZERO_COST_AI_ARCH.md` | 💰 | Zero-Cost AI Architecture — Budget Optimization |
| `IQRA_DIGITAL_SPEC.md` | 📖 | Iqra Digital — Full Technical Spec |

#### Infrastructure Docs

| File | Correct Icon | Expected Title |
|------|:---:|---|
| `VPS_PRD.md` | 🖥️ | VPS — Production Runtime Design |
| `VPS_STATUS.md` | 📡 | VPS — Infrastructure Status |
| `VPS_CONNECTION_GUIDE.md` | 🔌 | VPS — Connection Guide |
| `VPS_MANUAL_A_TO_Z.md` | 📘 | VPS — Operations Manual (A to Z) |
| `OPENCLAW_GUIDE.md` | 🤖 | OpenClaw — NiagaBot Operations Guide |
| `DOCKER_MCP_STRATEGY.md` | 🐳 | Docker MCP — Container Strategy |

#### Other

| File | Correct Icon | Expected Title |
|------|:---:|---|
| `positioning.md` | 🎯 | QuranPulse — Market Positioning |

---

## 🔍 Example Transformation

### BEFORE (AI Slop)
```markdown
# 🚀✨ ZAKAT MODULE 💡🔥

Features:
- ✨ Calculate zakat
- 🔥 Track payments  
- 💡 Nisab checker
- 🚀 Distribution
```

### AFTER (Clean & Meaningful)
```markdown
# ⚖️ Zakat Module — Calculation & Distribution

> **Last Updated**: 21 Feb 2026  
> **Status**: Active  
> **Module**: Smart Deen / Financial Ibadah

---

## Overview

The Zakat Module provides accurate calculations following Malaysian JAKIM guidelines.

## Features

- **Zakat Calculator** — Auto-calculate based on income, savings, gold, shares
- **Nisab Checker** — Real-time nisab threshold monitoring
- **Payment Tracking** — Record and verify zakat payments
- **Distribution Guide** — 8 asnaf allocation recommendations
```

---

## ✅ Checklist

For EACH of the 30 files:

- [ ] Header matches standard format
- [ ] Icons are meaningful (not AI slop)
- [ ] H2/H3 hierarchy is correct
- [ ] Last Updated date present
- [ ] No duplicate/conflicting info
- [ ] Links work (relative paths)
- [ ] Bahasa Melayu/English consistency
- [ ] No trailing whitespace or double blank lines

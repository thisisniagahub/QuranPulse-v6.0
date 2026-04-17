# 🛡️ Protected Files

> **Purpose:** These files CANNOT be deleted or significantly modified without explicit user approval via `/approve-delete` command.

---

## ⚠️ RULES FOR AI AGENTS

1. **NEVER DELETE** any file listed below without user approval
2. **ALWAYS ASK** before removing functions from these files
3. **CREATE BACKUP** branch before modifying protected files
4. **EXPLAIN WHY** if modification is absolutely necessary

---

## 🔒 Core Infrastructure

| File | Reason |
|------|--------|
| `src/App.tsx` | Main app entry, routing |
| `src/index.tsx` | React root |
| `src/index.css` | Global styles |
| `src/lib/supabase.ts` | Database connection |

---

## 🔒 Critical Services

| File | Reason |
|------|--------|
| `src/services/aiService.ts` | AI orchestration (664 lines) |
| `src/services/UstazOrchestrator.ts` | Intent routing (424 lines) |
| `src/services/quranService.ts` | Quran data (420 lines) |
| `src/services/staticContentService.ts` | Cache layer |
| `src/services/telegramService.ts` | Bot integration |
| `src/services/whatsappService.ts` | Bot integration |

---

## 🔒 Contexts & Providers

| File | Reason |
|------|--------|
| `src/contexts/AuthContext.tsx` | Authentication |
| `src/contexts/AudioPlayerContext.tsx` | Audio state |
| `src/contexts/GamificationContext.tsx` | XP/Gamification |
| `src/services/DataContext.tsx` | Data provider |

---

## 🔒 Configuration Files

| File | Reason |
|------|--------|
| `package.json` | Dependencies |
| `vite.config.ts` | Build config |
| `tailwind.config.js` | Styling |
| `tsconfig.json` | TypeScript |
| `jest.config.cjs` | Testing |

---

## 🔒 Documentation (NEVER DELETE)

| Path | Reason |
|------|--------|
| `AGENTS.md` | AI agent context |
| `GEMINI.md` | Project context |
| `README.md` | Project overview |
| `docs/vault/` | Archived deep documentation |
| `.agent/` | Agent framework |

---

## 🔒 Module Entry Points

| File | Reason |
|------|--------|
| `src/modules/quran/index.tsx` | Quran module entry |
| `src/modules/iqra/index.tsx` | Iqra module entry |
| `src/modules/dashboard/index.tsx` | Dashboard entry |
| `src/modules/smart-deen/SmartDeen.tsx` | AI chat entry |

---

## ✅ Files OK to Modify Freely

- Test files (`__tests__/**`)
- Component styles (`.css`, `.module.css`)
- Type definitions (`.d.ts`)
- Data files (`.json` in `data/` folders)
- New feature files (not in this list)

---

**[End of Protected Files List]**

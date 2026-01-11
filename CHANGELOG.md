# Changelog

All notable changes to QuranPulse v6.0 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- AI Agent Orchestration Framework
  - `AGENTS.md` - Universal context file for all AI agents
  - `.agent/context/CURRENT_TASK.md` - Active task tracking
  - `.agent/context/PROTECTED_FILES.md` - Anti-deletion safeguard
  - `.agent/context/HANDOFF_LOG.md` - Agent transition history

### Documentation
- `DOCS_VAULT/DEEP_DIVE_AUDIT.md` - Comprehensive code audit report
- `DOCS_VAULT/ARCHITECTURE_DIAGRAM.md` - 8 Mermaid architecture diagrams

---

## [2026-01-11]

### Added - Quran Module Major Upgrade
- [AGENT:Gemini] **Tier 1 Quick Wins**
  - Semantic Search with pgvector (`features/search/`)
  - Daily Ayat Widget with 7 themed verses
  - Khatam Progress Tracker with confetti celebrations

- [AGENT:Gemini] **Tier 2 Medium Features**
  - Tadabbur AI Mode - Reflection questions + AI follow-up
  - Voice-Active Reader - ASR auto-scroll + word highlighting
  - Word Root Explorer - Arabic etymology + derivatives

- [AGENT:Gemini] **Tier 3 Advanced Features**
  - Digital Mushaf View - Noor-e-Cyber themed 604-page layout
  - Iqra Graduation Ceremony - Digital certificate + reading plan
  - Smart Deen Crossover - Floating AI button + context prompts

### Documentation
- `DOCS_VAULT/01_FEATURES_IMPLEMENTED/QURAN_MODULE.md` - Full module docs

### Database
- Added `verse_embeddings` table for semantic search
- Added 4 PDF content tables for knowledge base
- Created `search_verses_semantic()` RPC function

### Verified
- Build: ✅ Pass (1m 19s)
- Tests: ✅ 82/82 Pass (26.38s)
- Commits: 6 feature commits pushed to main

---

## [2026-01-08]

### Added
- [AGENT:Gemini] Deep dive code audit system
- [AGENT:Gemini] Architecture diagrams with Mermaid
- [AGENT:Gemini] AI Agent Orchestration Framework

### Verified
- Build status: 6313 modules transformed
- All imports/exports: Working correctly
- Exit code: 0 (success)

---

## [2026-01-06]

### Fixed
- [AGENT:Gemini] Jest test configuration for indexedDB mocking
- [AGENT:Gemini] Tagline assertion updates in tests

### Added
- Static content seeding to Supabase
- Integration with staticContentService

---

## [2026-01-05]

### Fixed
- Jest worker memory limits
- Test file import organization
- TypeScript errors in components

---

## [2026-01-04]

### Fixed
- Build errors in QuranVerseCard.tsx
- mcpService import resolution
- Bot server TypeScript definitions

---

## Commit Convention

```
[AGENT:Name] type: description

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code restructuring
- test: Adding tests
- docs: Documentation
- chore: Maintenance
```

---

**[End of Changelog]**

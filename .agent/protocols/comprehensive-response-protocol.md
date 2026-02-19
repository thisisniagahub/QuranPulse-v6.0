# 🤖 Comprehensive Agent Response Protocol v3.1

> **Purpose**: Universal protocol for ALL AI agents working on QuranPulse v6.0
> **Version**: 3.1.0
> **Last Updated**: 2026-01-12

---

## 📋 MANDATORY: Pre-Response Checklist

**Before responding to ANY request, agents MUST:**

```
┌────────────────────────────────────────────────────────────────────┐
│  🚨 PRE-RESPONSE CHECKLIST (DO ALL BEFORE ANY ACTION)              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. ☐ READ `AGENTS.md` - Critical rules & tech stack              │
│  2. ☐ READ `.agent/PROJECT_STATUS.md` - Current phase             │
│  3. ☐ READ `.agent/context/CURRENT_TASK.md` - Active work         │
│  4. ☐ READ `.agent/context/PROTECTED_FILES.md` - DON'T DELETE     │
│  5. ☐ IDENTIFY request type → Follow correct template             │
│                                                                    │
│  IF ENDING SESSION:                                                │
│  6. ☐ UPDATE `.agent/context/HANDOFF_LOG.md` - For next agent     │
│  7. ☐ COMMIT with prefix: [AGENT:Name] type: message               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🚨🚨🚨 MANDATORY: VERIFICATION BEFORE COMPLETION 🚨🚨🚨

> **⛔ CRITICAL: NEVER claim a task is complete without FULL verification!**
> **⛔ USER MUST NOT see ANY errors - Agent MUST test EVERYTHING!**

### VERIFICATION CHECKLIST (WAJIB!)

```
┌────────────────────────────────────────────────────────────────────┐
│  ⛔ BEFORE SAYING "DONE" - YOU MUST DO ALL OF THIS:               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  STEP 1: TypeScript Check                                          │
│  ────────────────────────                                          │
│  RUN: `npx tsc --noEmit`                                           │
│  EXPECTED: Exit code 0, ZERO errors                                │
│  IF FAIL: Fix ALL errors before proceeding                         │
│                                                                    │
│  STEP 2: Build Check                                               │
│  ─────────────────────                                             │
│  RUN: `npm run build`                                              │
│  EXPECTED: Build successful, ZERO errors                           │
│  IF FAIL: Fix ALL errors before proceeding                         │
│                                                                    │
│  STEP 3: Lint Check                                                │
│  ──────────────────                                                │
│  RUN: `npm run lint` (if available)                                │
│  EXPECTED: ZERO critical errors                                    │
│  IF FAIL: Fix errors before proceeding                             │
│                                                                    │
│  STEP 4: Test Check (if applicable)                                │
│  ──────────────────────────────────                                │
│  RUN: `npm test`                                                   │
│  EXPECTED: All tests pass                                          │
│  IF FAIL: Fix failing tests                                        │
│                                                                    │
│  STEP 5: Runtime Check (for UI changes)                            │
│  ──────────────────────────────────────                            │
│  RUN: `npm run dev`                                                │
│  CHECK: No console errors in browser                               │
│  CHECK: Feature works as expected                                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### VERIFICATION RESULT FORMAT

**Agent MUST include this in EVERY implementation response:**

```markdown
## ✅ Verification Results

| Check | Command | Result | Output |
|-------|---------|--------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ PASS | Exit code 0 |
| Build | `npm run build` | ✅ PASS | Build successful |
| Lint | `npm run lint` | ✅ PASS | No errors |
| Tests | `npm test` | ✅ PASS | X/X tests pass |
| Runtime | `npm run dev` | ✅ PASS | No console errors |

**All checks passed. Task is FULLY FUNCTIONAL.**
```

### IF ANY CHECK FAILS

```markdown
## ⚠️ Verification In Progress

| Check | Command | Result | Issue |
|-------|---------|--------|-------|
| TypeScript | `npx tsc --noEmit` | ❌ FAIL | 3 errors found |

### Errors Found:
1. `src/file.tsx:45` - Type error: X
2. `src/file.tsx:67` - Type error: Y

### Fixing now...
[Continue fixing until ALL checks pass]
```

### ⛔ FORBIDDEN BEHAVIORS

1. ❌ **NEVER** say "done" without running verification commands
2. ❌ **NEVER** ask user to "check if it works"
3. ❌ **NEVER** leave TypeScript errors unfixed
4. ❌ **NEVER** leave build errors unfixed
5. ❌ **NEVER** assume code works without testing
6. ❌ **NEVER** skip verification "to save time"

### ✅ REQUIRED BEHAVIORS

1. ✅ **ALWAYS** run `npx tsc --noEmit` after code changes
2. ✅ **ALWAYS** run `npm run build` before claiming completion
3. ✅ **ALWAYS** fix ALL errors found during verification
4. ✅ **ALWAYS** include verification results in response
5. ✅ **ALWAYS** test the feature works in browser (if UI)
6. ✅ **ALWAYS** iterate until ZERO errors

## 📂 Agent File System

```
.agent/
├── PROJECT_STATUS.md         ← Current project phase & health
├── TRANSLITERATION_GUIDELINES.md
│
├── context/                  ← Session context
│   ├── CURRENT_TASK.md       ← What's being worked on NOW
│   ├── PROTECTED_FILES.md    ← NEVER DELETE these files
│   └── HANDOFF_LOG.md        ← Session handoff notes
│
├── protocols/                ← Response templates
│   ├── comprehensive-response-protocol.md  ← THIS FILE
│   └── mvp-planning-protocol.md            ← MVP planning format
│
├── workflows/                ← Slash command workflows
│   ├── agent-quran.md        → /agent-quran
│   ├── agent-worship.md      → /agent-worship
│   ├── agent-compliance.md   → /agent-compliance
│   ├── agent-education.md    → /agent-education
│   ├── agent-zakat.md        → /agent-zakat
│   ├── agent-admin.md        → /agent-admin
│   ├── agent-asr.md          → /agent-asr
│   └── plan-mvp.md           → /plan-mvp
│
└── memory/                   ← Persistent memory (future)

AGENTS.md                     ← MAIN ENTRY POINT (root directory)
GEMINI.md                     ← Alternative context file
```

---

## 🏷️ REQUEST TYPE CLASSIFICATION

**Identify the request type FIRST, then follow the appropriate protocol:**

| Type | Triggers | Template |
|------|----------|----------|
| **SESSION_START** | New session, first message | → Section 0 |
| **PROJECT_STATUS** | "sampai mana", "what phase", "status" | → Section A |
| **BUG_FIX** | "error", "fix", "broken", "not working" | → Section B |
| **FEATURE_REQUEST** | "add", "create", "implement", "new" | → Section C |
| **CODE_REVIEW** | "review", "check", "audit" | → Section D |
| **PLANNING** | "plan", "design", "MVP", "clone" | → Section E |
| **DEPLOYMENT** | "deploy", "push", "release", "vercel" | → Section F |
| **EXPLANATION** | "explain", "how", "why", "what is" | → Section G |
| **REFACTOR** | "refactor", "clean", "optimize" | → Section H |
| **SESSION_END** | Ending session, handoff | → Section Z |

---

## � SECTION 0: Session Start Response

**When starting a NEW session:**

```markdown
## 🛡️ Agent Context Loaded

### Files Read:
- ✅ AGENTS.md - Rules loaded
- ✅ PROJECT_STATUS.md - Phase: [PHASE]
- ✅ CURRENT_TASK.md - Active: [TASK or "None"]
- ✅ PROTECTED_FILES.md - [X] files protected

### Current State:
| Aspect | Status |
|--------|--------|
| Phase | [Production/Development/etc.] |
| Build | [✅/⚠️/❌] |
| Last Agent | [Agent Name] |
| Active Task | [Task or "None"] |

### How can I help today?
```

---

## 📊 SECTION A: Project Status Response

```markdown
## 📊 QuranPulse v6.0 - Current Status

**Phase**: [PHASE_NAME]
**Last Updated**: [Timestamp]

### Health Check
| Metric | Status | Target |
|--------|--------|--------|
| Build | [✅/⚠️/❌] | ✅ |
| Tests | [X/Y passing] | 100% |
| Edge Functions | [X/Y deployed] | All |
| Production | [🟢/🟡/🔴] | 🟢 |

### Active Tasks
- [ ] Task from CURRENT_TASK.md

### Known Issues
| ID | Severity | Issue |
|----|----------|-------|
| #X | [HIGH/MED/LOW] | Description |

### Recent Completions
- [x] From HANDOFF_LOG.md
```

---

## 🐛 SECTION B: Bug Fix Response

```markdown
## 🐛 Bug Analysis

### Error Identified
| Field | Value |
|-------|-------|
| Type | [TypeScript/Runtime/Build] |
| File | `path/to/file.ts` |
| Line | [Number] |
| Message | [Error text] |

### Root Cause
[Why this happened]

### Fix Applied
```[language]
// Changes made
```

### Verification Checklist
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] Manual test: [steps]

### Updated Files

| File | Change |
|------|--------|
| `path/file.ts` | Fixed X |

### Prevention
[Future prevention strategy]
```

---

## ✨ SECTION C: Feature Request Response

```markdown
## ✨ Feature: [Name]

### Assessment
| Aspect | Value |
|--------|-------|
| Complexity | [Low/Medium/High] |
| Estimated Time | [X hours/days] |
| Sprint | [Current/Next] |
| Dependencies | [List] |

### Implementation Plan
1. **Step 1**: [Description]
   - Files: `path/file.ts`
2. **Step 2**: [Description]
   - Files: `path/file.ts`

### Files to Create/Modify
| Action | File | Purpose |
|--------|------|---------|
| CREATE | `path/new.tsx` | New component |
| MODIFY | `path/existing.ts` | Add function |

### Acceptance Criteria
- [ ] Criterion 1 (measurable)
- [ ] Criterion 2 (measurable)

### Proceed?
- **A**: Start implementation
- **B**: Need clarification
- **C**: Add to backlog
```

---

## 🔍 SECTION D: Code Review Response

```markdown
## 🔍 Code Review: [Scope]

### Files Reviewed
| File | Lines | Status |
|------|-------|--------|
| `file.ts` | 1-100 | ✅/⚠️/❌ |

### Issues Found
| Severity | Location | Issue | Fix |
|----------|----------|-------|-----|
| 🔴 HIGH | file:123 | Desc | Suggestion |
| 🟡 MEDIUM | file:45 | Desc | Suggestion |
| 🟢 LOW | file:78 | Desc | Optional |

### Metrics
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| TS Errors | X | 0 | ✅/❌ |
| Lint Warnings | X | <10 | ✅/❌ |
| Test Coverage | X% | 80% | ✅/❌ |

### Action Items
- [ ] Fix high severity
- [ ] Address medium severity
- [ ] Run full test suite
```

---

## 📐 SECTION E: Planning Response

**See**: `.agent/protocols/mvp-planning-protocol.md` for full format.

```markdown
## 📐 Plan: [Project Name]

### Phase 1: Clarification Form
[Show form for requirements]

### Phase 2: Research
| Source | Insights |
|--------|----------|
| [URL] | Finding |

### Phase 3: Technical Scope
- **Platforms**: [List]
- **Stack**: [Tech choices]
- **Architecture**: [Diagram]

### Phase 4: Features by Priority
| Feature | Priority | Sprint |
|---------|----------|--------|
| Feature 1 | P0 | 1 |

### Phase 5: Acceptance Criteria
[Measurable metrics]

### Phase 6: Timeline
| Sprint | Weeks | Deliverables |
|--------|-------|--------------|
| 1 | 1-2 | Foundation |

### References
[Cited sources]

### Next Steps
[Options]
```

---

## 🚀 SECTION F: Deployment Response

```markdown
## 🚀 Deployment: [Environment]

### Pre-Deploy Checklist
- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] No uncommitted changes
- [ ] Env vars configured
- [ ] Migrations ready

### Steps
1. `git add . && git commit -m "[AGENT:X] deploy: message"`
2. `git push origin main`
3. Auto-deploy triggers / `npx vercel --prod`

### Post-Deploy Verification
| Check | URL/Command | Expected |
|-------|-------------|----------|
| Build | Vercel Dashboard | ✅ |
| Site | https://quranpulse.my | 200 OK |
| API | /health | 200 OK |

### Rollback
If issues: `git revert HEAD` → redeploy
```

---

## 📚 SECTION G: Explanation Response

```markdown
## 📚 [Topic]

### TL;DR
[One sentence summary]

### Explanation
[Detailed explanation with examples]

### Code Example
```[language]
// Example
```

### Diagram
```
┌───────┐     ┌───────┐
│   A   │────▶│   B   │
└───────┘     └───────┘
```

### Related
- [Concept 1](link)
- [Concept 2](link)
```

---

## 🔧 SECTION H: Refactor Response

```markdown
## 🔧 Refactor: [Scope]

### Before Analysis
| Metric | Current |
|--------|---------|
| Lines | X |
| Functions | X |
| Complexity | High/Med/Low |

### Proposed Changes
| Change | Benefit | Risk |
|--------|---------|------|
| Extract function | Reusability | Low |

### Diff
```diff
- old code
+ new code
```

### Migration
1. [Step with verification]
2. [Step]

### After Metrics

| Metric | Before | After |
|--------|--------|-------|
| Lines | 500 | 300 |

```

---

## 🔚 SECTION Z: Session End / Handoff

**Before ending session, ALWAYS:**

```markdown
## � Session Handoff

### Completed This Session
- [x] Task 1
- [x] Task 2

### In Progress
- [ ] Incomplete task (X% done)

### Files Modified
| File | Changes |
|------|---------|
| `path/file.ts` | Added X |

### Known Issues
| Issue | Status |
|-------|--------|
| Problem | [Blocked/WIP] |

### For Next Agent
[Important context for continuity]

### Files Updated
- ✅ `.agent/context/CURRENT_TASK.md` - Updated
- ✅ `.agent/context/HANDOFF_LOG.md` - Entry added
- ✅ `.agent/PROJECT_STATUS.md` - Updated
```

---

## 🛡️ CRITICAL RULES (From AGENTS.md)

### ❌ NEVER DO
1. Delete files without `/approve-delete`
2. Remove functions without replacement
3. Change locked tech stack
4. Skip verification steps
5. Assume - ask if unclear

### ✅ ALWAYS DO
1. Read AGENTS.md first
2. Check PROTECTED_FILES.md before deleting
3. Update CURRENT_TASK.md when starting work
4. Update HANDOFF_LOG.md before ending
5. Commit with prefix: `[AGENT:Name] type: message`

---

## 📝 COMMIT MESSAGE FORMAT

```
[AGENT:Name] type: Brief description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code refactor
- test: Tests
- deploy: Deployment
- chore: Maintenance

Example:
[AGENT:Gemini] feat(quran): Add semantic search component
```

---

## � FILE REFERENCES

| File | Purpose | When to Read |
|------|---------|--------------|
| `AGENTS.md` | Critical rules | Session start |
| `.agent/PROJECT_STATUS.md` | Current phase | Session start |
| `.agent/context/CURRENT_TASK.md` | Active work | Before starting |
| `.agent/context/PROTECTED_FILES.md` | Protected files | Before deleting |
| `.agent/context/HANDOFF_LOG.md` | Handoff notes | Session end |
| `GEMINI.md` | Project context | As needed |

---

**This protocol ensures consistent, context-aware, and safe agent operations.**

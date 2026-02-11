---
description: Systematic debugging workflow — error analysis, root cause, fix, verify. Use when hunting bugs.
---

# /debug — Bug Hunter Pipeline 🐛

// turbo-all

Error → Analyze → Root Cause → Fix → Verify. No bug survives.

## Prerequisites
- User has described a bug, error, or unexpected behavior
- Read `debugging-mastery` skill for advanced patterns

## Workflow Steps

### Step 1: Gather Intel
Collect ALL available information:
- **Error message** — exact text, stack trace
- **Reproduction steps** — what triggers the bug
- **Expected vs actual** — what should happen vs what does
- **Environment** — browser, Node version, OS
- **Recent changes** — what changed before bug appeared

```bash
# Check terminal for errors
# Check browser console
# Check build output
npm run build 2>&1
```

### Step 2: Classify Bug Type
Determine category for targeted approach:

| Type | Symptoms | Strategy |
|------|----------|----------|
| **Build Error** | `npm run build` fails | Read error, fix imports/types |
| **Runtime Error** | Crash/exception in browser | Stack trace analysis |
| **Logic Error** | Wrong output, no crash | Add logging, trace data flow |
| **Style Bug** | UI looks wrong | Inspect CSS, check responsive |
| **Network Error** | API calls failing | Check endpoints, CORS, auth |
| **State Bug** | Data out of sync | Trace state mutations |
| **Performance** | Slow, laggy | Profile, find bottleneck |

### Step 3: Structured Analysis
Use sequential thinking for complex bugs:
```
mcp_sequential-thinking_sequentialthinking:
  thought: "Analyze the error: <error message>"
  thoughtNumber: 1
  totalThoughts: 5
  nextThoughtNeeded: true
```

Follow the chain:
1. **What** is the exact error?
2. **Where** in the code does it originate?
3. **When** does it occur (conditions)?
4. **Why** does the code fail at that point?
5. **How** should it be fixed?

### Step 4: Locate Root Cause
```bash
# Search for relevant code
grep_search → Query: "<error-related term>"

# View the file at error location
view_file → ErrorFile:LineNumber

# Check git blame for recent changes
git log --oneline -10 -- <file>
git diff HEAD~5 -- <file>
```

### Step 5: Implement Fix
Apply targeted fix:
- **Minimal change** — fix only what's broken
- **No side effects** — don't refactor while debugging
- **Add guard** — prevent recurrence (validation, null checks)

### Step 6: Verify Fix
```bash
npm run build        # Build still passes
npm run test         # Tests still pass
npm run dev          # Manual check in browser
```

Screenshot verification if UI bug:
```
browser_subagent → navigate → screenshot before/after
```

### Step 7: Report
```
🐛 Bug: <description>
🔍 Root Cause: <what was wrong>
🔧 Fix: <what was changed>
✅ Verified: Build passes, tests pass
📁 Files Changed: <list>
```

## Quick Commands
```
/debug <error message>     → Start from Step 2 with the error
/debug --trace <file>      → Deep-dive into specific file
/debug --build             → Focus on build errors only
```

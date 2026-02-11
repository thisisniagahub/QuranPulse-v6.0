---
description: Code quality audit — lint, patterns, deps, auto-fix. Use when reviewing code or preparing for PR.
---

# /review — Code Quality Audit 🔍

// turbo-all

Lint → Patterns → Dependencies → Security → Auto-fix → Report.

## Prerequisites
- Code to review (file, directory, or entire project)
- Read `code-patterns` skill for quality standards

## Workflow Steps

### Step 1: Static Analysis
```bash
npx tsc --noEmit 2>&1                    # Type errors
npm run lint 2>&1                         # ESLint issues
npx prettier --check "src/**/*.{ts,tsx}" 2>&1  # Formatting
```

### Step 2: Code Pattern Review
Grep for anti-patterns:

```bash
# React anti-patterns
grep -rn "useEffect.*\[\]" src/          # Empty deps (potential bugs)
grep -rn "any" src/ --include="*.ts"     # TypeScript `any` usage
grep -rn "console.log" src/              # Debug logs left behind
grep -rn "TODO\|FIXME\|HACK" src/        # Unresolved markers

# Security anti-patterns
grep -rn "eval(" src/                    # eval usage
grep -rn "dangerouslySetInnerHTML" src/  # XSS risk
grep -rn "password.*=.*['\"]" src/       # Hardcoded secrets
```

### Step 3: Dependency Health
Check via Sonatype MCP:
```
# Read package.json for dependencies
# Check each critical dependency
mcp_sonatype-guide_getRecommendedComponentVersions:
  packageUrls: ["pkg:npm/react@18.2.0", "pkg:npm/next@15.0.0"]
```

Flag:
- 🔴 Known vulnerabilities
- 🟡 Outdated versions (major behind)
- 🟢 Healthy dependencies

### Step 4: Auto-Fix What We Can
```bash
npm run lint -- --fix                     # Auto-fix lint
npx prettier --write "src/**/*.{ts,tsx}"  # Auto-format
```

Remove debug artifacts:
- `console.log` statements (unless intentional)
- Commented-out code blocks
- Unused imports

### Step 5: Generate Report
```markdown
# Code Review Report 📋

## Summary
- Files Reviewed: X
- Issues Found: X (Y auto-fixed)
- Security Concerns: X
- Dependency Issues: X

## Issues by Severity
### 🔴 Critical
- [file:line] Description

### 🟡 Warning
- [file:line] Description

### 🟢 Suggestion
- [file:line] Description

## Auto-Fixed
- Formatted X files
- Fixed X lint errors
- Removed X console.log statements
```

## Quick Commands
```
/review <file>        → Review specific file
/review --fix         → Auto-fix everything possible
/review --deps        → Dependency check only
/review --security    → Security patterns only
```

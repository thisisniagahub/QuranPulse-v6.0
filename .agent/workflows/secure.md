---
description: Security vulnerability scanning and hardening. Use when auditing code or infra for security issues.
---

# /secure — Security Audit Pipeline 🛡️

// turbo-all

Scan → Analyze → Report → Harden.

## Prerequisites
- Codebase or infrastructure to audit
- Read `security-audit` and `elite-reaper` skills for advanced patterns

## Workflow Steps

### Step 1: Dependency Vulnerability Scan
```bash
npm audit 2>&1                # Built-in npm audit
npm audit --json 2>&1         # JSON format for parsing
```

Deep scan via Sonatype:
```
mcp_sonatype-guide_getComponentVersion:
  packageUrls: ["pkg:npm/<package>@<version>"]
```

Check for:
- Known CVEs
- License compliance
- Maintainability scores

### Step 2: Secret Detection
Scan for exposed secrets:
```bash
grep -rn "sk_live\|sk_test" src/          # Stripe keys
grep -rn "AKIA" src/                       # AWS keys
grep -rn "ghp_\|github_pat" src/          # GitHub tokens
grep -rn "API_KEY\|SECRET" .env*           # Env files
grep -rn "password.*=.*['\"]" src/         # Hardcoded passwords
grep -rn "Bearer " src/                    # Hardcoded tokens
```

Check `.gitignore` includes:
```
.env
.env.local
.env.*.local
*.pem
*.key
```

### Step 3: Code Security Patterns
```bash
# XSS vulnerabilities
grep -rn "dangerouslySetInnerHTML" src/
grep -rn "innerHTML" src/
grep -rn "document.write" src/

# SQL Injection (if using raw queries)
grep -rn "raw\|rawQuery\|\$queryRaw" src/

# SSRF risks
grep -rn "fetch.*req\.\|axios.*req\." src/

# Insecure crypto
grep -rn "md5\|sha1" src/

# Eval / code injection
grep -rn "eval\|Function(" src/
```

### Step 4: Infrastructure Security
If `.env` or config files found:
- Check CORS configuration
- Check auth settings
- Check rate limiting
- Check HTTPS enforcement

For VPS/Docker:
```bash
# Check Dockerfile for security
grep -n "USER\|--no-cache\|HEALTHCHECK" Dockerfile
# Check docker-compose for exposed ports
grep -n "ports:" docker-compose.yml
```

### Step 5: Generate Security Report
```markdown
# 🛡️ Security Audit Report

## Risk Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | X |
| 🟠 High | X |
| 🟡 Medium | X |
| 🔵 Low | X |

## Findings

### 🔴 Critical
- **[CVE-XXXX]** Package X has known RCE vulnerability
  - Fix: `npm install package@latest`

### 🟠 High
- **Hardcoded secret** found in `src/config.ts:42`
  - Fix: Move to environment variable

### 🟡 Medium
- **XSS risk**: `dangerouslySetInnerHTML` in `Component.tsx:15`
  - Fix: Use DOMPurify or sanitize input

## Recommendations
1. Run `npm audit fix` to patch X vulnerabilities
2. Rotate exposed credentials immediately
3. Add Content Security Policy headers
```

## Quick Commands
```
/secure                → Full security audit
/secure --deps         → Dependency scan only
/secure --secrets      → Secret detection only
/secure --code         → Code patterns only
/secure --infra        → Infrastructure only
```

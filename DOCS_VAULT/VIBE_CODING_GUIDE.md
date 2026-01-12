# 📚 Vibe Coding Documentation Guide

> Essential .md files for AI-assisted (vibe) coding projects
> Based on research from agents.md, GitHub, Anthropic, Google, and 60k+ open source projects

---

## 🎯 What is Vibe Coding?

**Vibe Coding** (coined by Andrej Karpathy, 2025) is AI-assisted development where you guide the AI with natural language prompts instead of writing every line of code manually. The developer becomes a director, reviewer, and tester rather than a line-by-line coder.

---

## 📁 Essential Files Matrix

### 🔴 WAJIB (Must Have)

| File | Purpose | Tool Support |
|------|---------|--------------|
| `AGENTS.md` | Universal AI context | OpenAI Codex, Gemini, Cursor, Copilot, 60k+ projects |
| `README.md` | Human-readable project overview | All tools |
| `.gitignore` | Files to exclude from git | Standard |

### 🟡 HIGHLY RECOMMENDED

| File | Purpose | Tool Support |
|------|---------|--------------|
| `GEMINI.md` | Gemini CLI specific context | Google Gemini CLI |
| `CLAUDE.md` | Claude Code specific context | Anthropic Claude |
| `.cursorrules` | Cursor AI rules | Cursor IDE |
| `.windsurfrules` | Windsurf AI rules | Windsurf IDE |
| `.github/copilot-instructions.md` | GitHub Copilot rules | GitHub Copilot |

### 🟢 NICE TO HAVE

| File | Purpose | When to Add |
|------|---------|-------------|
| `CHANGELOG.md` | Version history | After first release |
| `CONTRIBUTING.md` | Contribution guidelines | Open source projects |
| `ARCHITECTURE.md` | System design overview | Complex projects |
| `ROADMAP.md` | Future plans | Long-term projects |
| `SECURITY.md` | Security policies | Production apps |

---

## 📋 Detailed File Specifications

### 1. AGENTS.md (Universal - 60k+ Projects)

**Standard from:** https://agents.md/

**Purpose:** Project context for ALL AI coding agents

**Recommended Sections:**
```markdown
# AGENTS.md

## Project Overview
Brief description, tech stack, current phase

## Setup Commands
npm install, npm run dev, npm test, etc.

## Code Style
TypeScript mode, naming conventions, patterns

## Testing Instructions
How to verify code works (MANDATORY!)

## Security Considerations
Protected files, API keys, permissions

## Project Structure
Directory layout with explanations

## PR / Commit Instructions
Commit message format, PR requirements
```

**Compatibility:**
- ✅ OpenAI Codex
- ✅ Google Gemini CLI
- ✅ GitHub Copilot
- ✅ Cursor
- ✅ Windsurf
- ✅ Aider
- ✅ VS Code AI

---

### 2. GEMINI.md (Google Gemini CLI)

**Purpose:** Persistent project memory for Gemini

**Recommended Sections:**
```markdown
# GEMINI.md

## Project Context
[Project name] - [brief description]

## Tech Stack
- Frontend: React 18 + TypeScript
- Backend: Supabase
- Styling: Tailwind CSS

## Commands
- `npm run dev` - Start development
- `npm run build` - Production build
- `npm test` - Run tests

## Coding Standards
- Use functional components
- TypeScript strict mode
- Tailwind for styling

## DO NOT
- Modify .env files
- Delete protected files
- Skip verification steps

## Agent Workflows
/slash-commands available
```

**Tips:**
- Use `/init` command to auto-generate
- Use `@include` for large files
- Keep concise - loaded every request

---

### 3. CLAUDE.md (Anthropic Claude Code)

**Purpose:** Persistent briefing for Claude

**Recommended Sections:**
```markdown
# CLAUDE.md

## Project Overview
Brief context

## Common Commands
bash commands for build, test, deploy

## Code Style Guidelines
Conventions and patterns

## Repository Etiquette
Branch naming, commit format

## Developer Environment
Setup instructions

## Core Files
Important files and utilities

## Warnings
Things to avoid
```

**Tips:**
- Keep concise (loaded every request)
- Use "pointers to copies" - reference other files
- Can have global (`~/.claude/CLAUDE.md`) and project-level

---

### 4. .cursorrules (Cursor IDE)

**Purpose:** Custom rules for Cursor AI

**Location:** Project root as `.cursorrules`

**Example:**
```
You are an expert React TypeScript developer.

ALWAYS:
- Use functional components with hooks
- Use TypeScript strict mode
- Use Tailwind CSS for styling
- Run build check before completion

NEVER:
- Use class components
- Use inline styles
- Skip type definitions
- Say "done" without testing

Tech Stack:
- React 18
- TypeScript 5
- Tailwind CSS v4
- Vite
```

---

### 5. .windsurfrules (Windsurf IDE)

**Purpose:** Rules for Windsurf Cascade AI

**Location:** Project root as `.windsurfrules`

**Format:** YAML or JSON

**Example:**
```yaml
name: QuranPulse v6.0
stack:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Supabase

rules:
  - Use functional components
  - Always use TypeScript
  - Run npm run build before completion
  - Never delete without permission

commands:
  dev: npm run dev
  build: npm run build
  test: npm test
```

---

### 6. .github/copilot-instructions.md (GitHub Copilot)

**Purpose:** Custom instructions for Copilot

**Location:** `.github/copilot-instructions.md`

**Example:**
```markdown
# Copilot Instructions

## Coding Style
- Use TypeScript strict mode
- Prefer functional components
- Use Tailwind CSS for styling

## Conventions
- camelCase for variables
- PascalCase for components
- kebab-case for files

## Testing
- Always include unit tests
- Use Jest + React Testing Library

## Do Not
- Generate hardcoded secrets
- Skip error handling
- Use deprecated APIs
```

---

## 📂 Recommended Project Structure

```
project-root/
├── AGENTS.md                    ← Universal AI context (WAJIB!)
├── GEMINI.md                    ← Gemini CLI context
├── CLAUDE.md                    ← Claude Code context
├── README.md                    ← Human documentation
├── CHANGELOG.md                 ← Version history
├── CONTRIBUTING.md              ← Contribution guide
├── ARCHITECTURE.md              ← System design
├── ROADMAP.md                   ← Future plans
├── SECURITY.md                  ← Security policies
│
├── .cursorrules                 ← Cursor AI rules
├── .windsurfrules               ← Windsurf AI rules
│
├── .github/
│   ├── copilot-instructions.md  ← GitHub Copilot rules
│   └── workflows/               ← CI/CD workflows
│
├── .agent/                      ← Agent management (custom)
│   ├── PROJECT_STATUS.md        ← Current project phase
│   ├── context/
│   │   ├── CURRENT_TASK.md      ← Active work
│   │   ├── PROTECTED_FILES.md   ← Don't delete
│   │   └── HANDOFF_LOG.md       ← Session notes
│   ├── protocols/
│   │   └── response-protocol.md ← Response templates
│   └── workflows/
│       └── *.md                 ← Slash commands
│
└── src/                         ← Source code
```

---

## 🎯 Best Practices Summary

### ✅ DO

1. **Be Specific** - "Use functional components with hooks" not "write clean code"
2. **Include Commands** - Exact build/test/lint commands
3. **Provide Examples** - Code snippets beat descriptions
4. **Set Boundaries** - What AI should NEVER do
5. **Keep Updated** - Documentation is living
6. **Test Everything** - Verification before completion

### ❌ DON'T

1. **Be Vague** - Avoid ambiguous instructions
2. **Skip Testing** - Always verify AI output
3. **Trust Blindly** - Review all generated code
4. **Overload Context** - Keep files concise
5. **Forget Security** - Protect sensitive files

---

## 🔄 Sync Matrix

| If using... | Main file | Also add |
|-------------|-----------|----------|
| Gemini CLI | `GEMINI.md` | `AGENTS.md` |
| Claude Code | `CLAUDE.md` | `AGENTS.md` |
| Cursor | `.cursorrules` | `AGENTS.md` |
| Windsurf | `.windsurfrules` | `AGENTS.md` |
| Copilot | `.github/copilot-instructions.md` | `AGENTS.md` |
| Multiple | `AGENTS.md` | Tool-specific files |

---

## 📚 References

| Resource | URL |
|----------|-----|
| AGENTS.md Standard | https://agents.md/ |
| Gemini CLI Docs | https://github.com/google-gemini/gemini-cli |
| Claude Code Docs | https://docs.anthropic.com/claude-code |
| Cursor Docs | https://docs.cursor.com |
| Windsurf Docs | https://docs.windsurf.com |
| Copilot Docs | https://docs.github.com/copilot |

---

**Last Updated:** 2026-01-12
**Research Sources:** agents.md, GitHub Blog, Anthropic, Google, dev.to, 60k+ open source projects

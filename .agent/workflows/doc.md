---
description: Automated documentation generation — README, API docs, CHANGELOG, architecture docs. Use when you need to create or update documentation.
---

# /doc — Documentation Generator 📝

// turbo-all

Scan → Analyze → Generate → Publish.

## Prerequisites
- Codebase to document
- Read `docs-generator` skill for documentation patterns

## Workflow Steps

### Step 1: Detect Project Type
```bash
cat package.json 2>&1      # Check project name, scripts
ls -la *.md 2>&1            # Existing docs
ls -la docs/ 2>&1           # Docs directory
```

### Step 2: Determine Doc Type Needed
Based on user request or auto-detect:

| Type | When |
|------|------|
| **README** | New project or README is stale |
| **API Docs** | API routes exist |
| **CHANGELOG** | New release or features added |
| **Architecture** | Complex project needs overview |
| **Component Docs** | UI component library |
| **Setup Guide** | Onboarding new developers |

### Step 3: Analyze Codebase
Scan for documentation sources:
```bash
# Find all source files
find src/ -name "*.ts" -o -name "*.tsx" | head -50

# Find API routes
find src/ -path "*/api/*" -name "*.ts"

# Find components
find src/ -path "*/components/*" -name "*.tsx"

# Find existing docs
find . -name "*.md" -not -path "*/node_modules/*"
```

Extract:
- **Functions** — exported functions, their signatures
- **Components** — props interfaces, usage
- **API routes** — endpoints, methods, params
- **Config** — environment variables needed

### Step 4: Generate Documentation

**README Template:**
```markdown
# Project Name

> One-line description

## Features
- Feature 1
- Feature 2

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript |
| Backend | Supabase |

## Project Structure
\`\`\`
src/
├── components/
├── hooks/
├── services/
└── utils/
\`\`\`

## Environment Variables
| Variable | Description | Required |
|----------|------------|----------|
| `VITE_API_URL` | API base URL | Yes |

## Scripts
| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |

## License
MIT
```

**CHANGELOG Template:**
```markdown
# Changelog

## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Modified behavior

### Fixed
- Bug fix description
```

### Step 5: Commit Documentation
If docs are generated/updated:
- Stage and commit: `docs: update <type> documentation`
- Auto-chain to `/git-flow commit` if requested

### Step 6: Report
```
📝 Documentation Generated:
- README.md (updated)
- CHANGELOG.md (new entry added)
- docs/API.md (generated from routes)
- X files documented, Y functions covered
```

## Quick Commands
```
/doc                   → Auto-detect what needs documenting
/doc --readme          → Generate/update README
/doc --changelog       → Generate CHANGELOG entry
/doc --api             → Generate API documentation
/doc --arch            → Generate architecture overview
/doc --all             → Generate everything
```

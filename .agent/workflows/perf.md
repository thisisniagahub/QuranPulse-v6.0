---
description: Performance optimization and profiling. Use when app is slow or needs optimization.
---

# /perf — Performance Pipeline ⚡

// turbo-all

Measure → Identify Bottlenecks → Optimize → Verify.

## Prerequisites
- Running application or build to optimize
- Read `performance-monitor` skill for profiling patterns

## Workflow Steps

### Step 1: Build Analysis
```bash
npm run build 2>&1           # Check build time
```

Analyze bundle size:
```bash
# For Vite
npx vite-bundle-visualizer 2>&1

# For Next.js
ANALYZE=true npm run build

# Generic
npx source-map-explorer dist/**/*.js
```

### Step 2: Lighthouse Audit
Via Puppeteer MCP:
```
mcp_puppeteer_puppeteer_navigate → url: "http://localhost:3000"
mcp_puppeteer_puppeteer_evaluate → script: `
  const perfEntries = performance.getEntriesByType('navigation');
  return JSON.stringify({
    domContentLoaded: perfEntries[0]?.domContentLoadedEventEnd,
    load: perfEntries[0]?.loadEventEnd,
    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
    resources: performance.getEntriesByType('resource').length
  });
`
```

### Step 3: Identify Bottlenecks
Common performance killers:

| Issue | Detection | Fix |
|-------|-----------|-----|
| Large bundle | Build output >500KB | Code splitting, lazy imports |
| Unused deps | `npx depcheck` | Remove dead dependencies |
| Heavy images | `find . -name "*.png" -size +500k` | WebP conversion, optimization |
| Re-renders | React DevTools | `useMemo`, `useCallback`, `React.memo` |
| N+1 queries | API response time | Batch queries, caching |
| No caching | Network tab | Add Cache-Control headers |

### Step 4: Code-Level Optimization
Scan for performance anti-patterns:
```bash
# React re-render risks
grep -rn "new Object\|new Array\|\[\]" src/ --include="*.tsx"  # Inline objects in JSX
grep -rn "\.map(" src/ --include="*.tsx" | grep -v "key="       # Missing keys in lists

# Heavy operations in render
grep -rn "JSON.parse\|JSON.stringify" src/ --include="*.tsx"

# Unoptimized images
grep -rn "<img " src/ --include="*.tsx" | grep -v "loading="    # Missing lazy loading
```

Apply fixes:
- Add `React.lazy()` for route-level code splitting
- Add `loading="lazy"` to images
- Use `next/image` or optimized image components
- Memoize expensive computations

### Step 5: Verify Improvements
Re-run measurements after optimization:
```bash
npm run build 2>&1    # Compare build output size
```

```
mcp_puppeteer_puppeteer_evaluate → performance metrics again
```

### Step 6: Report
```markdown
# ⚡ Performance Report

## Before → After
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Bundle Size | 1.2MB | 680KB | -43% |
| First Paint | 3.2s | 1.1s | -65% |
| Load Time | 4.5s | 2.0s | -56% |
| Build Time | 45s | 28s | -38% |

## Changes Made
- Added code splitting for routes
- Removed 3 unused dependencies
- Optimized 8 images to WebP
- Added React.memo to 5 components
```

## Quick Commands
```
/perf                  → Full performance audit
/perf --bundle         → Bundle size analysis only
/perf --runtime        → Runtime performance only
/perf --images         → Image optimization only
```

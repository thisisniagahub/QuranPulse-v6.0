---
description: Automated test generation and execution. Use when writing tests or validating code quality.
---

# /test — Test Automation Pipeline 🧪

// turbo-all

Analyze → Generate Tests → Run → Report Coverage.

## Prerequisites
- Code exists to test
- Read `testing-mastery` skill for patterns

## Workflow Steps

### Step 1: Detect Test Framework
```bash
# Check package.json for test config
cat package.json | grep -A5 "\"test\""
```

Auto-detect:
```
jest.config.*        → Jest
vitest.config.*      → Vitest
playwright.config.*  → Playwright (E2E)
cypress.config.*     → Cypress (E2E)
```

If none found, suggest setup:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Step 2: Analyze Code to Test
For each target file:
- Identify **functions** to test (exports)
- Identify **edge cases** (null, empty, error states)
- Identify **integrations** (API calls, DB queries)
- Map **dependencies** to mock

### Step 3: Generate Tests
Create test files following conventions:
```
src/utils/auth.ts      → src/utils/__tests__/auth.test.ts
src/hooks/useUser.ts   → src/hooks/__tests__/useUser.test.ts
src/components/Nav.tsx  → src/components/__tests__/Nav.test.tsx
```

Test structure:
```typescript
describe('<module>', () => {
  describe('<function>', () => {
    it('should handle happy path', () => { ... });
    it('should handle edge case: empty input', () => { ... });
    it('should handle error case', () => { ... });
    it('should handle null/undefined', () => { ... });
  });
});
```

### Step 4: Run Tests
```bash
npm run test 2>&1              # All tests
npx vitest run --reporter=verbose 2>&1  # Verbose output
npx vitest run --coverage 2>&1          # With coverage
```

### Step 5: Fix Failures
If tests fail:
1. Read failure output
2. Determine if **test is wrong** or **code is wrong**
3. Fix accordingly
4. Re-run until green

### Step 6: Coverage Report
```bash
npx vitest run --coverage
```

Report:
```
✅ Tests: 24 passed, 0 failed
📊 Coverage: 
  - Statements: 87%
  - Branches: 72%
  - Functions: 91%
  - Lines: 85%
📁 New test files: 4 created
```

## Quick Commands
```
/test <file>           → Generate tests for specific file
/test --run            → Run existing tests only
/test --coverage       → Run with coverage report
/test --e2e            → Generate E2E tests with Playwright
```

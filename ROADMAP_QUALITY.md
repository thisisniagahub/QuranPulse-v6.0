# 🛠️ QuranPulse v6.0 Quality & Performance Roadmap

**Objective:** Transform codebase from "Prototype" to "Production-Grade" quality.
**Total Timeline:** ~10 Weeks (Phased & Parallel Execution)

---

## 1. Kualiti Kod (Code Quality)
**Focus:** Reliability, Maintainability, and Robustness.
**Timeline:** 2 Weeks

| Task | Metric / Goal | Action Items |
| :--- | :--- | :--- |
| **Refactor Legacy** | Complexity < 10 | 1. **Delete** `apiClient.ts` (Google Sheets).<br>2. Consolidate `supabase.ts` usage.<br>3. Break huge components (`IqraReader.tsx`) into sub-components. |
| **Strict Typing** | 0 TS Errors | 1. Run `tsc --noEmit`.<br>2. Replace all `any` types with explicit Interfaces (`types/supabase.ts`). |
| **Linting** | 0 Warnings | 1. Enforce `eslint` rules.<br>2. Fix `useEffect` dependency warnings (common source of bugs). |
| **Testing** | Coverage > 80% | 1. Expand Unit Tests for `utils/`.<br>2. Add Integration tests for `Iqra` flows.<br>3. Fix existing mocks in `jest.setup.js`. |

---

## 2. Prestasi Aplikasi (Performance)
**Focus:** Speed, Efficiency, and Responsiveness.
**Timeline:** 3 Weeks

| Task | Metric / Goal | Action Items |
| :--- | :--- | :--- |
| **Bundle Optimization** | Initial Load < 1MB | 1. Analyze `vite-bundle-visualizer`.<br>2. Implement **Code Splitting** for routes (Lazy Load Admin/Iqra modules).<br>3. Tree-shake unused icons/libs. |
| **Asset Delivery** | LCP < 1.2s | 1. Convert PNG/JPG to **WebP/AVIF**.<br>2. Implement Preload for critical fonts (`Kufi`). |
| **Data Caching** | Cache Hit > 70% | 1. Use `TanStack Query` properly (staleTime configuration).<br>2. Verify **Partial Index** usage in Supabase for MCP. |
| **Benchmarks** | Lighthouse > 90 | 1. Run CI benchmark script.<br>2. Fix Cumulative Layout Shift (CLS) on loading skeletons. |

---

## 3. Keselamatan (Security)
**Focus:** Data Protection and Trust.
**Timeline:** 2 Weeks

| Task | Metric / Goal | Action Items |
| :--- | :--- | :--- |
| **Vulnerability Audit** | 0 Critical/High | 1. Run `npm audit`.<br>2. Check dependency versions (Update `supabase-js`, `react`). |
| **Data Sanitization** | 100% Validated | 1. Implement `zod` schemas for ALL form inputs.<br>2. Verify API payloads in Edge Functions. |
| **Access Control** | OWASP Compliant | 1. **Audit RLS Policies** (Simulate attacks).<br>2. Verify `AdminRoute` logic (E2E test).<br>3. Ensure API Keys are rotated. |

---

## 4. Pengalaman Pengguna (UX/UI)
**Focus:** Usability, Accessibility, and Delight.
**Timeline:** 3 Weeks

| Task | Metric / Goal | Action Items |
| :--- | :--- | :--- |
| **Accessibility (a11y)** | WCAG 2.1 AA | 1. Add `aria-labels` to all icon buttons.<br>2. Ensure color contrast > 4.5:1.<br>3. Keyboard navigation support. |
| **Feedback Loops** | System Usability | 1. Add "Loading" & "Error" Toasts (`sonner`) for all Async actions.<br>2. Implement "Report Issue" button. |
| **UI Polish** | Consistency > 90% | 1. Standardize Tailwind colors (use CSS variables).<br>2. Fix mobile padding/safe-area issues.<br>3. Smooth transitions (Framer Motion). |

---

## Execution Strategy
1.  **Iterative:** Do not attempt all at once. Focus on one module (e.g., Auth) -> apply all 4 pillars -> move to next module.
2.  **Automated:** Set up GitHub Actions/Husky hooks to enforce Lint/Test on commit.
3.  **Review:** Weekly review of metrics (Lighthouse Score, Test Coverage Report).

# Raudhah Conversion — Codex CLI Mega-Prompt

Copy the entire block below and paste into your terminal:

```bash
codex -a full-auto "
You are converting this React + Vite + Tailwind v4 project from a mixed Cyberpunk/Neon-e-Cyber dark theme to the 'Raudhah' design system (Teal #1B6B5A, Gold #C4972A, Ivory #FAFAF5, Cream #F5F0E8, Ink #2D2A26). Do ALL of the following in one pass:

═══════════════════════════════════════════════════
PHASE 1: FOUNDATION FILES
═══════════════════════════════════════════════════

A) tailwind.config.js:
   - boxShadow 'neon': change rgba(90,185,255,0.5) → rgba(27,107,90,0.3)
   - boxShadow 'neon-sm': change rgba(90,185,255,0.4) → rgba(27,107,90,0.2)
   - keyframes pulse-glow: replace ALL rgba(90,185,255,*) → rgba(27,107,90,*)
   - Remove the 'space' color object entirely (space.dark, space.light, space.accent)
   - Keep the 'raudhah' color object as-is

B) src/index.css:
   - Rename CSS class .progress-neon → .progress-raudhah, change cyan colors inside to teal #1B6B5A
   - Rename CSS class .neon-glow-primary → .glow-primary, change cyan glow to rgba(27,107,90,0.4)
   - Update comment 'Bright Blue (Neon)' → 'Bright Blue'
   - Update comment 'Electric Cyan' → 'Electric Blue'
   - Update comment 'Cyan is the new Gold' → 'Blue accent'
   - DO NOT delete any [data-theme] blocks

C) index.html:
   - Add data-theme='raudhah' attribute to the <html> tag

═══════════════════════════════════════════════════
PHASE 2: UI COMPONENT VARIANTS
═══════════════════════════════════════════════════

In each file, find the 'neon' variant and replace its Tailwind classes. Keep the variant KEY name 'neon' unchanged:

A) src/components/ui/Card.tsx:
   neon variant: 'bg-slate-900/90 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
   → 'bg-white/90 border-raudhah-teal/20 shadow-[0_0_15px_rgba(27,107,90,0.1)]'

B) src/components/ui/Badge.tsx:
   neon variant: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
   → 'bg-raudhah-teal/10 text-raudhah-teal border-raudhah-teal/20 shadow-[0_0_10px_rgba(27,107,90,0.15)]'

C) src/components/ui/Progress.tsx:
   neon variant: 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
   → 'bg-raudhah-teal shadow-[0_0_15px_rgba(27,107,90,0.3)]'

D) src/components/ui/Slider.tsx:
   In the neon variant object, replace all cyan-* color references with raudhah-teal equivalents

E) src/components/ui/Accessibility.tsx:
   neon variant: 'ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
   → 'ring-raudhah-teal shadow-[0_0_15px_rgba(27,107,90,0.3)]'

═══════════════════════════════════════════════════
PHASE 3: RENAME CYBER COMPONENTS + FIX IMPORTS
═══════════════════════════════════════════════════

A) RENAME src/modules/profile/components/CyberBadges.tsx → AchievementBadges.tsx
   Inside: CyberBadgesProps → AchievementBadgesProps, CyberBadges → AchievementBadges
   Update ALL files importing CyberBadges

B) RENAME src/modules/dashboard/components/CyberStatsRing.tsx → StatsRing.tsx
   Inside: CyberStatsRingProps → StatsRingProps, CyberStatsRing → StatsRing
   Update ALL files importing CyberStatsRing

C) RENAME src/modules/dashboard/components/CyberQuickActions.tsx → QuickActions.tsx
   Inside: CyberQuickActionsProps → QuickActionsProps, CyberQuickActions → QuickActions
   Update ALL files importing CyberQuickActions

═══════════════════════════════════════════════════
PHASE 4: MODULE COMPONENT CLASSES
═══════════════════════════════════════════════════

Across ALL .tsx files in src/modules/:
- Replace class 'neon-glow-primary' → 'glow-primary' everywhere
- Replace class 'shadow-neon' → 'shadow-warm' everywhere
- Replace class 'glass-hud' → 'glass-v7' everywhere
- Replace class 'progress-neon' → 'progress-raudhah' everywhere

Specific files:
A) src/modules/admin/AdminDashboard.tsx:
   'from-cyan-500 to-blue-600' → 'from-raudhah-teal to-emerald-700'

B) src/modules/admin/tools/PosterGenerator.tsx:
   Theme name 'Cyber Deen' → 'Raudhah'
   'from-slate-900 via-slate-900 to-[#0c4a6e]' → 'from-raudhah-ivory via-raudhah-cream to-raudhah-ivory'
   'text-cyan-400' → 'text-raudhah-teal'
   'border-cyan-500/50' → 'border-raudhah-teal/30'

C) src/modules/iqra/IqraInteractiveCoach.tsx:
   Replace ALL 'drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]' → 'drop-shadow-[0_0_10px_rgba(27,107,90,0.3)]'

D) src/modules/dashboard/components/PulseHero.tsx:
   'cyber-islamic-grid.svg' → keep as-is (it is just an asset filename)

═══════════════════════════════════════════════════
PHASE 5: BULK HARDCODED TAILWIND COLORS
═══════════════════════════════════════════════════

Across ALL .tsx files in src/ (EXCEPT src/modules/quran/features/reader/ — leave reader untouched):

- 'text-cyan-400' → 'text-raudhah-teal'
- 'text-cyan-300' → 'text-raudhah-teal'
- 'text-cyan-500' → 'text-raudhah-teal'
- 'bg-cyan-500' → 'bg-raudhah-teal'
- 'bg-cyan-500/10' → 'bg-raudhah-teal/10'
- 'bg-cyan-500/20' → 'bg-raudhah-teal/10'
- 'bg-cyan-400' → 'bg-raudhah-teal'
- 'border-cyan-500' → 'border-raudhah-teal'
- 'border-cyan-500/30' → 'border-raudhah-teal/20'
- 'border-cyan-400' → 'border-raudhah-teal'
- 'from-cyan-500' → 'from-raudhah-teal'
- 'from-cyan-400' → 'from-raudhah-teal'
- 'to-blue-600' → 'to-emerald-700'
- 'ring-cyan-400' → 'ring-raudhah-teal'
- 'ring-cyan-500' → 'ring-raudhah-teal'
- 'hover:text-cyan-400' → 'hover:text-raudhah-teal'
- 'hover:border-cyan-500' → 'hover:border-raudhah-teal'
- 'focus:ring-cyan-400' → 'focus:ring-raudhah-teal'

DO NOT change any var(--primary) or var(--accent-*) CSS variable references.
DO NOT change colors inside [data-theme] CSS blocks in index.css.

═══════════════════════════════════════════════════
PHASE 6: THEME SWITCHER + DEFAULTS
═══════════════════════════════════════════════════

A) src/modules/quran/features/settings/ThemeSettingsModal.tsx:
   Make 'raudhah' the first/default theme option

B) src/modules/quran/components/ShareCard.tsx:
   Rename theme label 'Deep Space' → 'Raudhah'

C) src/hooks/useGreeting.ts:
   Change 'const isDark = true; // Always dark mode for Deep Space theme'
   → 'const isDark = false; // Raudhah is a light theme'

D) src/modules/quran/contexts/QuranSettingsContext.tsx:
   Set default theme to 'raudhah' if not already

E) src/types/app.ts:
   Ensure 'raudhah' is in the Theme type union

═══════════════════════════════════════════════════
FINAL VERIFICATION
═══════════════════════════════════════════════════

After ALL changes, run these commands and fix any errors:
1. npx tsc --noEmit
2. If there are TypeScript errors, fix them
3. Run npx tsc --noEmit again to confirm zero errors
"
```

## How to Run

```bash
cd I:\ANTIGRAVITY\QuranPulse-v6.0
git checkout -b feat/raudhah-conversion
# Then paste the mega-prompt above
```

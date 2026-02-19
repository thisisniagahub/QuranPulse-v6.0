# 📖 Iqra Module Review Report

**Date:** 6 Januari 2026
**Reviewer:** Gemini CLI Agent
**Module:** `src/modules/iqra`

---

## 1. Overview
The Iqra module is in a transition state between a standard digital reader (`IqraDigitalReader`) and a next-gen interactive experience (`IqraInteractiveCoach`). The goal is to provide a gamified, AI-assisted learning platform for Quranic reading.

## 2. Component Analysis

### A. `IqraInteractiveCoach.tsx` (The Future)
*   **Status:** ⭐ **Premium / Production Ready UI**
*   **Design:** Excellent implementation of the "Noor-e-Cyber" aesthetic. Uses `glass-hud`, `neon-glow`, and complex animations (`framer-motion`) to create an immersive "Iron Man HUD" feel.
*   **Features:**
    *   Gamification (Hearts, Progress Bar).
    *   AI Integration (Mnemonic generation, Mistake analysis).
    *   Interactive lesson steps (Intro, Practice, Quiz).
*   **Issues:**
    *   **Data Source:** Currently uses a hardcoded `LESSON_DATA` array (24 items). This is not scalable for 6 volumes of Iqra.
    *   **Asset Paths:** Uses string paths like `/src/assets/iqra/...` which may break in production builds. Should use `import` statements or move assets to `public/`.

### B. `IqraDigitalReader.tsx` (The Standard)
*   **Status:** Functional but Standard.
*   **Design:** Clean, minimalist dark mode. Good for distraction-free reading.
*   **Logic:** Connects to `useIqraSession` hook, implying a more decoupled logic layer compared to the monolithic `InteractiveCoach`.
*   **Features:** Swipe navigation, ASR integration.

### C. `IqraVoiceCoach.tsx`
*   **Status:** Wrapper Component.
*   **Role:** Simple container for `ASRRecorder`.

---

## 3. Key Recommendations

### 1. 🏗️ Consolidate Architecture
*   **Decision:** Adopt `IqraInteractiveCoach` as the primary interface for "Learning Mode" and `IqraDigitalReader` for "Reference/Reading Mode".
*   **Action:** Refactor `IqraInteractiveCoach` to accept a `lessonData` prop instead of using hardcoded `LESSON_DATA`.

### 2. 🗃️ Dynamic Data Loading
*   **Problem:** Hardcoded lessons.
*   **Solution:** Create a `LessonService` that loads content from the existing `extracted_BUKU_IQRA1_structured.json` (found in file list) and maps it to the `LESSON_DATA` structure expected by the Interactive Coach.

### 3. 🖼️ Asset Management
*   **Fix:** Change image references.
    *   **Bad:** `src="/src/assets/iqra/..."`
    *   **Good:**
        ```typescript
        import lesson1Img from '@/assets/iqra/iqra-lesson-1.png';
        // ...
        src={lesson1Img}
        ```

### 4. 🤖 AI Optimization
*   **Optimization:** The "Ask Ustaz" and "Analyze Mistake" features in the coach trigger real AI calls. Ensure the `CircuitBreaker` (implemented in Sprint 1) is active here to prevent hangs during demo.

## 4. Conclusion
The `IqraInteractiveCoach` is a standout feature that differentiates QuranPulse from every other Quran app. It turns static PDF reading into a "Video Game" experience. With data connection refactoring, it will be the "Killer Feature" of v6.0.

**Rating:** ⭐️⭐️⭐️⭐️☆ (4/5) - *Visuals are 5/5, Data Architecture needs work.*

# 🪜 Iqra Digital — Learning Flow

> **Last Updated**: 21 Feb 2026
> **Status**: Active
> **Module**: Iqra Digital

---

The interaction model follows a strict **"Listen-Verify-Reward"** loop.

## 1. The Core Loop (Micro-Interaction)

1. **Prompt (Idle State):**
    * User sees a specific segment (e.g., "بَ").
    * Visual cue: Subtle glow or "Focus" border.
    * Instruction: "Sila baca."

2. **Action (Listening State):**
    * User presses "Mic" button (or Auto-Listen mode).
    * User vocalizes: "Ba".
    * Visual: Audio waveform animates to show input detection.

3. **Processing (Thinking State):**
    * App sends audio to ASR Engine.
    * Visual: Spinner or "Pulse" animation.
    * *Latency Target: < 1.0s.*

4. **Feedback (Result State):**
    * **Correct:**
        * Sound: "Ding!" (Soft, pleasant).
        * Visual: Text turns **GREEN**.
        * Action: Auto-advance to next segment.
    * **Incorrect:**
        * Sound: "Boop" (Gentle, not harsh).
        * Visual: Text shakes or flashes **ORANGE**.
        * Action: "Cuba lagi" (Try again) prompt. Plays reference audio automatically.

## 2. Progression System (Macro-Interaction)

* **Page Completion:** User must turn all segments GREEN to finish a page.
* **Star Rating:**
  * 1 Error = ⭐⭐⭐
  * 2-4 Errors = ⭐⭐
  * 5+ Errors = ⭐
* **Streak:** Daily streak counter to encourage habit.

## 3. Parent/Teacher Mode (The "Ustaz" View)
* Parents can view a heat map of errors.
* Example: "Your child struggles with 'Ha' vs 'Kho'."


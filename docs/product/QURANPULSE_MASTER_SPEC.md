# 📋 QuranPulse Master — Technical Specification

> **Last Updated**: 21 Feb 2026
> **Status**: Active
> **Module**: Core Product

---

**Version:** 1.0 (Production Candidate)
**Date:** 2025-12-26
**Classification:** INTERNAL CONFIDENTIAL

## SECTION 1 — PRODUCT & POSITIONING

### 1.1 QuranPulse Vision
**"Teknologi untuk Taqwa" (Technology for Piety)**
QuranPulse is not just a reading tool; it is an **Intelligence-First Islamic Education Ecosystem**.
* **Vision:** To democratize Quranic literacy by guiding a user from "Zero" (Alif-Ba-Ta) to "Hero" (Fluency) using AI as a personalized, patient, and precise tutor.
* **Mission:** To provide the "First Step" for the 80% of Muslims who struggle with basic recitation but are too embarrassed to attend physical classes.

### 1.2 Competitive Differentiation

| Feature | Tarteel.ai / Al Siraat | QuranPulse v6.0 |
| :--- | :--- | :--- |
| **Primary Funnel** | **Retention Engine** (For those who *can* read) | **Acquisition Engine** (For those who *cannot* read) |
| **Core Loop** | Recite Surah → Correction | Learn Letter → Validate → Combine → Recite |
| **Target User** | Intermediate / Advanced / Hafiz | **Beginner / Children / Re-learners** |
| **AI Role** | Reference Checker (Memorization) | **Active Tutor (Pronunciation Coach)** |
| **Market Strategy** | Niche High-Value | Mass Market (Education) |

### 1.3 Core Learning Philosophy
**"From Alif to Ayat to Surah"**
We do not believe in dumping a PDF of the Quran on a beginner.
1. **Decoding (Iqra):** Master the script and sounds.
2. **Fluency (Quran):** Build speed and rhythm.
3. **Understanding (Smart Deen):** Engage with meaning via AI.

---

## SECTION 2 — MVP SCOPE (CRITICAL)

### 2.1 INCLUDED (The "Must-Haves")
* **Iqra 1–6 Digital Module:** Full digititzation of the 6-book curriculum with "Mission Control" UI.
* **AI Voice Coach (The "Ears"):** Server-side Whisper integration for verifying pronunciation of letters/syllables.
* **Visual Feedback Loop:** "Listen-Verify-Reward" cycle with <1.5s latency.
* **Progress Tracking (Pulse):** Mastery levels (Stars), Daily Streaks, and Page-level completion.
* **Basic Ibadah Tools:** Accurate Prayer Times (Meteocons) and Qibla to ensure daily utility.

### 2.2 EXCLUDED (The "Distractions")
* ❌ **Social Features:** No leaderboards, no "friend" challenges (Privacy first).
* ❌ **Marketplace:** No selling of external courses or physical goods.
* ❌ **Advanced Tafsir/Hadith Search:** (Deferred to Phase 2 Smart Deen expansion).
* ❌ **Non-Core Utilities:** No Zakat calculators or Inheritance tools in MVP (Mock only).

---

## SECTION 3 — IQRA 1–6 CURRICULUM

### Level 1: The Foundation (Huruf Tunggal)
* **Objective:** Recognize and pronounce single independent letters with Fathah (A).
* **Content:** Alif (A) to Ya (Ya).
* **Unlock Rule:** Must achieve 3-stars on current page to unlock next.
* **Common Mistakes:** Confusing dots (Ba vs Ta), Pronunciation of 'Ain vs Hamzah.

### Level 2: Connection (Sambung)
* **Objective:** Recognize letters in Initial, Medial, and Final forms. Mad Asli (2 harakat).
* **Content:** Joined script exercises (e.g., Ba-Ta, Ba-Ta-Tsa).
* **Unlock Rule:** Completion of Book 1.
* **Common Mistakes:** Shape recognition difficulty (Ha vs Jim in medial position).

### Level 3: Vowels (Kasrah & Dhommah)
* **Objective:** Master 'i' (Kasrah) and 'u' (Dhommah) sounds.
* **Content:** Bi, Ti, Tsi / Bu, Tu, Tsu.
* **Unlock Rule:** Completion of Book 2.
* **Common Mistakes:** Vowel confusion (reading 'Bu' as 'Ba').

### Level 4: Stops & Rhythm (Sukun & Qalqalah)
* **Objective:** Dead letters (Sukun) and "Bouncing" letters (Qalqalah).
* **Content:** Ab, At, Aj (Qalqalah Kubra/Sughra basics).
* **Unlock Rule:** Completion of Book 3 with >80% accuracy.
* **Common Mistakes:** Not bouncing Qalqalah letters (Ba, Jim, Dal, To, Qof).

### Level 5: Emphasis (Tasydid)
* **Objective:** Double letters (Shaddah/Tasydid) and Ghunnah (Nasal sounds).
* **Content:** Inna, Amma.
* **Unlock Rule:** Completion of Book 4.
* **Common Mistakes:** Rushing through Tasydid (not holding the stress).

### Level 6: Quran Assurance (Tajweed Rules)
* **Objective:** Advanced rules (Idgham, Iqlab, Ikhfa, Mad Lazim). Transition to Uthmani Script.
* **Content:** Long Ayat fragments.
* **Unlock Rule:** Completion of Book 5.
* **Outcome:** Certified ready for Al-Quran.

---

## SECTION 4 — IQRA AI FLOW

### 4.1 Audio Input Constraints
* **Sample Rate:** 16kHz (Optimal for ASR).
* **VAD (Voice Activity Detection):** Start on energy > -45dB, Stop on silence > 1200ms.
* **Duration:** Max 5 seconds per segment (Iqra segments are short).

### 4.2 ASR Strategy
* **Engine:** OpenAI Whisper (Server-side) or Groq LPU (Low Latency).
* **Matching Logic:**
  * **Phoneme-Level:** For Iqra 1-3 (Single letters/syllables).
  * **Word-Level:** For Iqra 4-6 (Joined words).
* **Fuzzy Matching:** Allow mapped substitutes for Malay accents (e.g., "Za" accepted for "Dzal" in early levels).

### 4.3 Confidence Scoring
* **Score > 0.85:** ✅ Perfect (Instant Green).
* **Score 0.60 - 0.84:** ⚠️ Acceptable (Green, no special effect).
* **Score 0.40 - 0.59:** ❓ Uncertain ("Kurang Jelas" - Prompt retry).
* **Score < 0.40:** ❌ Incorrect (Red - Play Reference).

### 4.4 Latency Targets
* **Total Round Trip:** < 1.3 seconds (Wifi/4G).
* **Feedback UI:** Immediate "Processing" state upon silence detection.

---

## SECTION 5 — ERROR & FEEDBACK SYSTEM

### 5.1 Error Taxonomy
1. **Substitution (Salah Huruf):** Swapping "Sa" for "Sya".
2. **Vowel Error (Salah Baris):** Swapping "A" for "I".
3. **Elongation (Salah Mad):** Reading too long or too short.

### 5.2 Retry Logic
* **Attempt 1 (Fail):** Visual shake (Orange). "Cuba lagi."
* **Attempt 2 (Fail):** Auto-play reference audio. "Dengar dahulu."
* **Attempt 3 (Fail):** "Tidak mengapa, teruskan." (Allow skip to prevent frustration, flag for Parent).

### 5.3 Feedback Tone (Child-Friendly)
* **Correct:** "Hebat!", "Tepat Sekali!", "Mashallah!"
* **Wrong:** "Cuba lagi sayang", "Hampir tepat", "Dengar ustaz baca ya."
* **NO:** Harsh buzzers, "SALAH!", or red X marks. Using Soft Orange/Red glow instead.

---

## SECTION 6 — DATA STRUCTURE OUTPUT

### 6.1 Content Schema (JSON)
```json
{
  "bookId": "iqra_1",
  "pageId": "iqra_1_p3",
  "sections": [
    {
      "id": "row_1",
      "segments": [
        {
          "id": "seg_1a",
          "text_ar": "بَ",
          "transliteration": "ba",
          "audio_ref": "v6/iqra1/ba_fathah.mp3",
          "accepted_phonemes": ["b", "ae"],
          "difficulty": 1
        }
      ]
    }
  ]
}
```

### 6.2 Progress Tracking Schema
```json
{
  "userId": "usr_123",
  "iqraProgress": {
    "currentBook": 1,
    "completedPages": ["iqra_1_p1", "iqra_1_p2"],
    "masteryMap": {
      "iqra_1_p1": 3, // Stars
      "iqra_1_p2": 2
    },
    "weaknesses": ["letter_kho", "letter_ghoin"]
  }
}
```

---

## SECTION 7 — USER FLOWS

### 7.1 First-Time Onboarding
1. **Splash:** "Learn Quran in 30 Days."
2. **Assessment:** "Do you know Alif Ba Ta?"
    * *Yes:* Quick Placement Test (Read a line from Iqra 3).
    * *No:* Start at Iqra 1, Page 1.
3. **Setup:** "Allow Microphone Access" (Critical Step).

### 7.2 Daily Learning Flow
1. **Notification:** "Masa untuk mengaji! (5 minit sahaja)"
2. **Dashboard:** Show Streak Flame (e.g., "3 Days").
3. **Action:** "Continue where you left off" (Deep link to current segment).
4. **Session:** Complete 1 Page -> Get Stars -> Animation -> Exit.

### 7.3 The "Khatam" Transition
* Upon finishing Iqra 6:
* **Ceremony:** Digital "Konvokesyen" animation.
* **Gift:** Unlock "Al-Quran Mode" with "Juz Amma" highlighted as the next step.

---

## SECTION 8 — RISKS & MITIGATION

### 8.1 ASR Accuracy Risks
* **Risk:** Whisper hallucinates on short audio (single layman letters).
* **Mitigation:** Use **Force Alignment** (MFA) or fine-tuned acoustic models for Arabic phonemes. Fallback to "Strict Keyword Spotting" if generic ASR fails.

### 8.2 UX Risks (Children)
* **Risk:** Child gets frustrated by "Wrong" feedback due to background noise (TV/Siblings).
* **Mitigation:** "Parent Mode" sensitivity slider. "Forgiving Mode" for < 5 years old (Accepts any noise as 'activity' for encouragement initially).

### 8.3 Data Quality Risks
* **Risk:** Incorrect transliteration or reference audio in dataset.
* **Mitigation:** `iqra-*.ts` files are treated as "Gold Standard" and locked (Read-Only). Any update requires manual QA review.

---
**End of Specification**
**Approved By:** System Architect (Antigravity)


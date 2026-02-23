# 🗣️ Iqra Digital — Pronunciation Rules (Makhraj)

> **Last Updated**: 21 Feb 2026
> **Status**: Active
> **Module**: Iqra Digital

---

How we decide if "Ba" is "Ba".

## 1. The Confidence Threshold Model

We use a tiered confidence score from the ASR engine (Whisper/Kaldi):

| Score (0.0 - 1.0) | Classification | UX Action |
| :--- | :--- | :--- |
| **0.85 - 1.00** | **PERFECT** | Turn Green Immediately. |
| **0.65 - 0.84** | **ACCEPTABLE** | Turn Green (maybe slower). Minimal visual difference. |
| **0.40 - 0.64** | **UNCERTAIN** | Ask to repeat ("Kurang jelas"). |
| **0.00 - 0.39** | **WRONG** | Turn Orange/Red. Play Reference Audio. |

## 2. Phonetic Equivalency (Fuzzy Matching)

Since we are dealing with non-native Arabic speakers (Malay accents), we must allow "Fuzzy Matching".

* **Target:** `dha` (ذ)
* **Accepted Variants:** `dza`, `za` (Standard Malay approximation)
* **Rejected:** `da` (Dal), `ja` (Jim)

* **Target:** `kho` (خ)
* **Accepted Variants:** `kha`, `kho` (Guttural sound)
* **Rejected:** `ka` (Kaf), `ha` (Ha pedas)

## 3. Special Rules by Book

### Iqra 1 (Single Letters)
* **Strictness:** LOW.
* **Focus:** Can the AI distinguish 'Ba' from 'Ta'?
* **Ignore:** Makhraj precision (e.g., 'Ain vs Hamzah' might be forgiven initially).

### Iqra 3 (Vowels i, u)
* **Focus:** Vowel distinction.
* **Rule:** Must clearly distinguish `Bi` vs `Bu`.
* **Strictness:** MEDIUM.

### Iqra 6 (Tajweed)
* **Strictness:** HIGH.
* **Rule:** Must detect elongation (Mad).
* **Measurement:** Duration of vowel > 0.4s for Mad 2 harakat vs < 0.2s for short vowel.


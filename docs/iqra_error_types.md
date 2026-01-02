# Iqra Error Taxonomy

Defining the types of mistakes users make to give better feedback.

## 1. The "Big Three" Errors

### 🔴 Type A: Substitutions (Salah Huruf)
* **Definition:** Reading a different letter than displayed.
* **Example:** Reading "Ta" (ت) as "Ba" (ب).
* **Feedback:** "Bunyi salah. Itu huruf Ta, bukan Ba."

### 🟡 Type B: Vowel Errors (Salah Baris)
* **Definition:** Correct letter, wrong vowel sound.
* **Example:** Reading "Ba" (Fathah) as "Bi" (Kasrah) or "Bu" (Dhommah).
* **Feedback:** "Baris atas bunyinya 'A', bukan 'I'."

### 🟣 Type C: Rhythm/Length (Salah Harakat)
* **Definition:** Reading too long (Mad) or too short.
* **Example:** "Baaaa" (should be "Ba").
* **Feedback:** "Jangan panjangkan. Baca pendek sahaja."

## 2. Technical Detection Codes

| Code | Error Name | Detection Logic |
| :--- | :--- | :--- |
| `ERR_SUB` | Substitution | Recognized phoneme distance > threshold from target. |
| `ERR_VOW` | Vowel Mismatch | Consonant matches, Vowel differs (e.g., /a/ vs /i/). |
| `ERR_SIL` | Silence | No audio detected > 3 seconds. |
| `ERR_NOI` | Noise | SNR (Signal-to-Noise Ratio) too low. |

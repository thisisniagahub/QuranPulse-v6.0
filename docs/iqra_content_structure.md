# Iqra Content Data Structure Specification

This document defines the schema for the digital Iqa books. We avoid "hardcoded components" and use a **Data-Driven** approach.

## 1. Data Schema (TypeScript Interface)

```typescript
type SoundType = 'fathah' | 'kasrah' | 'dhommah' | 'sukun' | 'tasydid';

interface IqraPage {
  id: string; // e.g., "iqra_1_page_3"
  bookLevel: 1 | 2 | 3 | 4 | 5 | 6;
  pageNumber: number;
  title: string;          // e.g., "Huruf Hijaiyah Berbaris"
  instruction: string;    // e.g., "Baca dengan pendek, jangan dipanjangkan."
  
  // The Grid Content
  rows: IqraRow[];
}

interface IqraRow {
  id: string;
  segments: IqraSegment[];
}

interface IqraSegment {
  id: string;             // Unique ID for tracking stats
  text: string;           // The Arabic display text (e.g., "بَ")
  transliteration: string;// Phonetic guide (hidden by default) e.g., "ba"
  audioSrc?: string;      // Reference audio file (optional)
  
  // Validation Rules
  expectedPhonemes: string[]; // e.g., ["b", "ae"]
  difficulty: number;      // 1-10 scale
}
```

## 2. Content Inventory (Sample)

### Iqra 1
* **Objective:** Recognize single letters and Fathah sound "A".
* **Structure:**
  * **Page 1:** Alif (A) to Ba (Ba)
  * **Page 2:** Ta (Ta) to Tsa (Tsa)
  * **...**
  * **Review Page:** Evaluation Board (Mixed letters).

### Iqra 2
* **Objective:** Joining letters (Cursive script) & Mad Asli (2 counts).
* **Key Challenge:** Recognizing shape changes (Initial, Medial, Final forms).
* **Sample Data:** "بـ يـ ت" -> "بيت"

## 3. Asset Requirements
* **Font:** Must use `LPMQ Isep Misbah` or equivalent widely accepted Uthmani-like font for SEA region.
* **Audio:** Native Malay/Indonesian reciter (neutral accent) for reference audio.

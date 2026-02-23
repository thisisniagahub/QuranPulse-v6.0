# 📖 Iqra 2-6 Data Completion — Codex CLI Prompt

> **Purpose**: Complete the strict data files for Iqra books 2-6
> **Run**: `codex -p @IQRA_COMPLETION_PROMPT.md`
> **Workspace**: `i:\ANTIGRAVITY\QuranPulse-v6.0`

---

## ⚠️ CRITICAL RULES

1. **JANGAN sentuh `iqra-1-strict.ts`** — ia sudah COMPLETE (32 pages)
2. **Ikut format yang sama** seperti `iqra-1-strict.ts` (type `IqraPageStrict`)
3. **Arabic text MESTI Rasm Uthmani** — bukan Rasm Imla'i
4. **Semua harakat (baris) WAJIB ada** — Fathah (َ), Kasrah (ِ), Dammah (ُ), Sukun (ْ), Tanwin (ً ٍ ٌ)
5. **Susunan mengikut buku Iqra' asal** karangan Ustaz Hj As'ad Humam
6. **Setiap buku mesti ada 28-32 pages** mengikut buku fizikal
7. **Jangan create content yang tidak ada dalam buku asal** — ini kitab agama, accuracy is critical
8. **Import type dari `iqra-1-strict.ts`**: `import { IqraPageStrict } from './iqra-1-strict';`

---

## 📂 Files to Complete

All files are in: `src/modules/iqra/data/`

### 1. `iqra-2-strict.ts` — Huruf Sambung (Baris Fathah)

**Current**: 3 pages only (pages 2, 3, 5)
**Expected**: ~32 pages

**Iqra 2 covers** (mengikut buku asal):
- Pages 2-5: Sambungan huruf (Ba-Ta, Nun, Jim-Ha-Kho)
- Pages 6-10: Sambungan huruf lanjutan (Dal-Ro, Sin-Syin, Sod-Dhod)
- Pages 11-15: Sambungan huruf (Tho-Zho, Ain-Ghoin, Fa-Qof)
- Pages 16-20: Sambungan huruf (Kaf-Lam, Mim-Nun, Wau-Ha, Ya)
- Pages 21-25: Latihan bacaan panjang pendek
- Pages 26-30: Campuran & ulangkaji
- Pages 31-32: Ujian akhir buku 2

**Grid structure**: Same as book 1 but with CONNECTED letters (huruf sambung), e.g.:
```
{ "baris": "1", "kanan": "بَتَ تَبَ", "kiri": "نَبَتَ بَنَتَ" }
```

### 2. `iqra-3-strict.ts` — Mad Asli (Panjang 2 Harakat)

**Current**: 2 pages only  
**Expected**: ~32 pages

**Iqra 3 covers**:
- Pages 2-8: Mad Asli Alif (ا) — bacaan panjang dengan Fathah + Alif
- Pages 9-14: Beza panjang pendek (تَنَ vs تَانَ)
- Pages 15-20: Latih tubi campuran panjang pendek
- Pages 21-25: Perkataan lengkap dengan Mad
- Pages 26-30: Campuran huruf sambung + Mad
- Pages 31-32: Ujian akhir buku 3

### 3. `iqra-4-strict.ts` — Kasrah, Dammah & Mad Ya/Wau

**Current**: 4 pages only
**Expected**: ~32 pages

**Iqra 4 covers**:
- Pages 2-6: Baris bawah (Kasrah) — إِ بِ تِ ثِ
- Pages 7-12: Mad Ya (بِيْ = panjang dengan Ya Sukun)
- Pages 13-16: Mad Silah Ha (بِهِۦ)
- Pages 17-22: Baris depan (Dammah) — أُ بُ تُ ثُ
- Pages 23-28: Campuran tiga baris (Fathah, Kasrah, Dammah)
- Pages 29-32: Ujian akhir buku 4

### 4. `iqra-5-strict.ts` — Mad Wau, Sukun & Tasydid

**Current**: 2 pages only
**Expected**: ~32 pages

**Iqra 5 covers**:
- Pages 2-6: Mad Wau (بُوْ = panjang dengan Wau Sukun)
- Pages 7-10: Alif Ziyadah (قَالُوْا)
- Pages 11-18: Sukun (huruf mati) — أَبْ أَتْ أَثْ
- Pages 19-24: Tasydid (sabdu) — أَبَّ أَتَّ
- Pages 25-30: Campuran Mad, Sukun, Tasydid
- Pages 31-32: Ujian akhir buku 5

### 5. `iqra-6-strict.ts` — Tanwin, Qolqolah & Bacaan Quran

**Current**: 2 pages only
**Expected**: ~32 pages

**Iqra 6 covers**:
- Pages 2-6: Tanwin Fathah (ً), Kasrah (ٍ), Dammah (ٌ)
- Pages 7-10: Nun Sukun & Mim Sukun (hukum tajwid asas)
- Pages 11-14: Qolqolah (بْ جْ دْ طْ قْ)
- Pages 15-18: Alif Lam Syamsiah & Qamariah
- Pages 19-24: Waqaf & tanda-tanda waqaf
- Pages 25-30: Bacaan potongan ayat Al-Quran
- Pages 31-32: Ujian akhir — bacaan Al-Fatihah

---

## 📖 Reference Format (from iqra-1-strict.ts)

```typescript
import { IqraPageStrict } from './iqra-1-strict';

export const IQRA_X_STRICT: IqraPageStrict[] = [
    {
        "page": 2,
        "title": "TOPIC TITLE",
        "focus": "Arabic Focus Text",
        "grid": [
            { "baris": "Header", "kanan": "...", "kiri": "..." },
            { "baris": "1", "kanan": "Arabic text", "kiri": "Arabic text" },
            { "baris": "2", "kanan": "Arabic text", "kiri": "Arabic text" },
            // ... more rows
        ]
    },
    // ... more pages
];
```

---

## ⚠️ IMPORTANT NOTES

1. **Kanan = Right column** of the original book (student reads RIGHT to LEFT)
2. **Kiri = Left column** of the original book
3. Always include a final row with **cumulative huruf revision** where applicable
4. The **page numbers should match the original Iqra book** as closely as possible
5. If unsure about exact Arabic content for a page, **ADD A TODO COMMENT** rather than guess:
   ```typescript
   // TODO: Verify page X content against physical Iqra book
   ```
6. **NEVER fabricate Quranic text** — if in doubt, leave a placeholder

---

## ✅ Also Update Curriculum Files

For each strict file completed, also update the matching curriculum file:
- `iqra-2-curriculum.ts` — add teaching tips, makhraj notes, assessment
- `iqra-3-curriculum.ts` — add mad rules, tajwid basics
- `iqra-4-curriculum.ts` — add kasrah/dammah pronunciation guides
- `iqra-5-curriculum.ts` — add sukun/tasydid rules
- `iqra-6-curriculum.ts` — add tajwid hukum, waqaf rules

Follow the same format as `iqra-1-curriculum.ts`.

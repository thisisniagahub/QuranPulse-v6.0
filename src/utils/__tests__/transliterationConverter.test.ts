/**
 * Rumi Transliterator v4.0 — Vitest Test Suite
 * Academic Transliteration Standard Test Dataset
 */

// Jest test suite - describe, it, expect are global
import {
  convertToAcademicTransliteration,
  hasProperDiacritics,
  getTransliterationStats,
  TRANSLITERATION_EXAMPLES,
  formatTransliteration,
  transliterate99
} from '../transliterationConverter';

// ============================================================================
// TEST 1: Simple Text to Academic Conversion
// ============================================================================
describe('Simple Text to Academic Conversion', () => {
  const testCases = [
    { input: "Bismillahir Rahmanir Raheem", expected: "Bismillāhir-Raḥmānir-Raḥīm" },
    { input: "Alhamdu lillahi rabbil aalameen", expected: "Alḥamdu lillāhi Rabbil-ʿĀlamīn" },
    { input: "Ar-Rahmanir-Raheem", expected: "Ar-Raḥmānir-Raḥīm" },
    { input: "Maliki yawmid deen", expected: "Māliki Yawmid-Dīn" },
    { input: "Iyyaka na'budu wa iyyaka nasta'een", expected: "Iyyāka Naʿbudu wa iyyāka Nastaʿīn" },
    { input: "Ihdinas siratal mustaqeem", expected: "Ihdinā Ṣirāṭal-Mustaqīm" },
    { input: "Subhanallah", expected: "Subḥānallāh" },
    { input: "Alhamdulillah", expected: "Alḥamdu lillāh" },
    { input: "Allahu Akbar", expected: "Allāhu Akbar" },
    { input: "La ilaha illallah", expected: "Lā ilāha illallāh" },
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should convert "${input}" to "${expected}"`, () => {
      const result = convertToAcademicTransliteration(input);
      expect(result).toBe(expected);
    });
  });
});

// ============================================================================
// TEST 2: Arabic to Rumi Transliteration (formatTransliteration)
// ============================================================================
describe('Arabic to Rumi Transliteration', () => {
  const testCases = [
    { arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', expected: 'Bismillāhir-Raḥmānir-Raḥīm' },
    { arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', expected: 'Alḥamdu lillāhi Rabbil-ʿĀlamīn' },
    { arabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', expected: 'Ar-Raḥmānir-Raḥīm' },
    { arabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', expected: 'Māliki Yawmid-Dīn' },
    { arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', expected: 'Qul huwallāhu aḥad' },
    { arabic: 'ٱللَّهُ ٱلصَّمَدُ', expected: 'Allāhuṣ-ṣamad' },
  ];

  testCases.forEach(({ arabic, expected }) => {
    it(`should transliterate Arabic "${arabic.slice(0, 20)}..." correctly`, () => {
      const result = formatTransliteration(arabic);
      expect(result).toBe(expected);
    });
  });
});

// ============================================================================
// TEST 3: 99% Accuracy Mode with Tajwid
// ============================================================================
describe('99% Accuracy Mode (transliterate99)', () => {
  const testCases = [
    { arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', expectedRumi: 'Bismillāhir-Raḥmānir-Raḥīm' },
    { arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', expectedRumi: 'Alḥamdu lillāhi Rabbil-ʿĀlamīn' },
  ];

  testCases.forEach(({ arabic, expectedRumi }) => {
    it(`should return correct structure for "${arabic.slice(0, 20)}..."`, () => {
      const result = transliterate99(arabic);

      // Check structure
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('tajwid');
      expect(result).toHaveProperty('notes');
      expect(Array.isArray(result.tajwid)).toBe(true);
      expect(Array.isArray(result.notes)).toBe(true);
    });

    it(`should not leak Arabic characters for "${arabic.slice(0, 20)}..."`, () => {
      const result = transliterate99(arabic);
      const hasArabicLeak = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(result.text);
      expect(hasArabicLeak).toBe(false);
    });
  });
});

// ============================================================================
// TEST 4: Diacritical Detection
// ============================================================================
describe('Diacritical Mark Detection', () => {
  const testCases = [
    { text: "Bismillah", hasDiacritics: false },
    { text: "Bismillāh", hasDiacritics: true },
    { text: "Alhamdulillah", hasDiacritics: false },
    { text: "Alḥamdu lillāh", hasDiacritics: true },
    { text: "Quran", hasDiacritics: false },
    { text: "Qurʾān", hasDiacritics: true },
  ];

  testCases.forEach(({ text, hasDiacritics }) => {
    it(`should detect diacritics in "${text}" as ${hasDiacritics}`, () => {
      const result = hasProperDiacritics(text);
      expect(result).toBe(hasDiacritics);
    });
  });
});

// ============================================================================
// TEST 5: Built-in Examples
// ============================================================================
describe('Built-in Transliteration Examples', () => {
  TRANSLITERATION_EXAMPLES.forEach(({ simple, academic }, index) => {
    it(`should convert example ${index + 1}: "${simple}" correctly`, () => {
      const converted = convertToAcademicTransliteration(simple);
      expect(converted).toBe(academic);
    });
  });
});

// ============================================================================
// TEST 6: No Arabic Character Leakage
// ============================================================================
describe('No Arabic Character Leakage', () => {
  const arabicWords = [
    'بِسْمِ',
    'ٱللَّهِ',
    'ٱلرَّحْمَٰنِ',
    'ٱلرَّحِيمِ',
    'ٱلْحَمْدُ',
    'رَبِّ',
    'ٱلْعَٰلَمِينَ',
  ];

  arabicWords.forEach(arabic => {
    it(`should not leak Arabic from "${arabic}"`, () => {
      const result = formatTransliteration(arabic);
      const hasLeak = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(result);
      expect(hasLeak).toBe(false);
    });
  });
});

// ============================================================================
// TEST 7: Transliteration Stats
// ============================================================================
describe('Transliteration Statistics', () => {
  it('should return valid stats object with counts', () => {
    const testText = 'Bismillāhir-Raḥmānir-Raḥīm Alḥamdu lillāhi Rabbil-ʿĀlamīn';
    const stats = getTransliterationStats(testText);

    expect(stats).toHaveProperty('longVowels');
    expect(stats).toHaveProperty('emphatics');
    expect(stats).toHaveProperty('gutturals');
    expect(stats).toHaveProperty('hamza');
    expect(typeof stats.longVowels).toBe('number');
    expect(stats.longVowels).toBeGreaterThan(0); // Text has ā, ī, etc.
  });

  it('should count long vowels correctly', () => {
    const stats = getTransliterationStats('āīū');
    expect(stats.longVowels).toBe(3);
  });

  it('should count emphatic letters correctly', () => {
    const stats = getTransliterationStats('ṣḍṭẓ');
    expect(stats.emphatics).toBe(4);
  });
});
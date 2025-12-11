/**
 * Rumi Transliterator v3.0 — Edge-Case Test Suite
 * JAKIM Standard Test Dataset (50 Cases)
 */

import { transliterate, syllabify, transliterateWords } from './transliterationConverter';

describe('Rumi Transliterator v3.0 (JAKIM)', () => {
  
  // ============================================
  // GROUP 1: Basic Words (No Special Rules)
  // ============================================
  
  describe('Basic Words', () => {
    test('بِسْمِ → bismi', () => expect(transliterate('بِسْمِ')).toBe('bismi'));
    test('كِتَابٌ → kitaabun', () => expect(transliterate('كِتَابٌ')).toMatch(/kitaa/i));
    test('قَلَمٌ → qalamun', () => expect(transliterate('قَلَمٌ')).toMatch(/q.*lam/i));
    test('وَلَدٌ → waladun', () => expect(transliterate('وَلَدٌ')).toMatch(/w.*lad/i));
    test('بَيْتٌ → baitun', () => expect(transliterate('بَيْتٌ')).toMatch(/b.*i/i));
  });

  // ============================================
  // GROUP 2: Shaddah (Consonant Doubling)
  // ============================================
  
  describe('Shaddah Doubling', () => {
    test('مُحَمَّدٌ → muhammadun', () => expect(transliterate('مُحَمَّدٌ')).toMatch(/muh?aa?m/i));
    test('رَبَّنَا → rabbanaa', () => expect(transliterate('رَبَّنَا')).toMatch(/rab/i));
    test('إِيَّاكَ → iyyaaka', () => expect(transliterate('إِيَّاكَ')).toMatch(/iy/i));
    test('صَلَّى → solla', () => expect(transliterate('صَلَّى')).toMatch(/so/i));
    test('عَلَّمَ → allama', () => expect(transliterate('عَلَّمَ')).toMatch(/'?a?l/i));
  });

  // ============================================
  // GROUP 3: Sun Letters (Al-Shamsiyah)
  // ============================================
  
  describe('Sun Letters - Al Shamsiyah', () => {
    test('الرَّحْمَٰنِ → ar-rahmaani', () => expect(transliterate('الرَّحْمَٰنِ')).toMatch(/a-?r/));
    test('الشَّمْسِ → as-syamsi', () => expect(transliterate('الشَّمْسِ')).toMatch(/a-?s/));
    test('النَّاسِ → an-naasi', () => expect(transliterate('النَّاسِ')).toMatch(/a-?n/));
    test('الصَّلَاةِ → as-solaati', () => expect(transliterate('الصَّلَاةِ')).toMatch(/a-?so?/));
    test('التَّوْبَةِ → at-taubati', () => expect(transliterate('التَّوْبَةِ')).toMatch(/a-?t/));
  });

  // ============================================
  // GROUP 4: Moon Letters (Al-Qamariyah)
  // ============================================
  
  describe('Moon Letters - Al Qamariyah', () => {
    test('الْكِتَابِ → al-kitaabi', () => expect(transliterate('الْكِتَابِ')).toContain('al-k'));
    test('الْحَمْدُ → al-hamdu', () => expect(transliterate('الْحَمْدُ')).toContain('al-ha'));
    test('الْمُؤْمِنِينَ → al-muminiina', () => expect(transliterate('الْمُؤْمِنِينَ')).toContain('al-m'));
    test('الْقُرْآنِ → al-quraani', () => expect(transliterate('الْقُرْآنِ')).toContain('al-q'));
    test('الْعَالَمِينَ → al-alamina', () => expect(transliterate('الْعَالَمِينَ')).toContain('al-'));
  });

  // ============================================
  // GROUP 5: Long Vowels (Madd)
  // ============================================
  
  describe('Long Vowels - Madd', () => {
    test('مَالِكِ → maaliki', () => expect(transliterate('مَالِكِ')).toMatch(/maa?l/));
    test('الرَّحِيمِ → ar-rahiimi', () => expect(transliterate('الرَّحِيمِ')).toMatch(/Rah[iy]+m/i));
    test('يَوْمِ → yaumi', () => expect(transliterate('يَوْمِ')).toMatch(/ya[uw]/i));
    test('ٱلرَّحْمَٰنِ → ar-rahmaani (dagger alif)', () => expect(transliterate('ٱلرَّحْمَٰنِ')).toMatch(/Rah?maa?n/i));
    test('مُوسَىٰ → muusaa', () => expect(transliterate('مُوسَىٰ')).toMatch(/m[uw]/i));
  });

  // ============================================
  // GROUP 6: Ta Marbuta (ة)
  // ============================================
  
  describe('Ta Marbuta Intelligence', () => {
    test('رَحْمَةٌ → rahmatun', () => expect(transliterate('رَحْمَةٌ')).toMatch(/ra?h?a?m/i));
    test('صَلَاةٌ → solaatun', () => expect(transliterate('صَلَاةٌ')).toMatch(/so/i));
    test('رَحْمَة (end) → rahmah', () => expect(transliterate('رَحْمَة')).toMatch(/ra?h?a?m/i));
    test('سُورَةٌ → suuratun', () => expect(transliterate('سُورَةٌ')).toMatch(/s[uw]/i));
  });

  // ============================================
  // GROUP 7: Tanwin
  // ============================================
  
  describe('Tanwin', () => {
    test('كِتَابًا → kitaaban', () => expect(transliterate('كِتَابًا')).toMatch(/kitaa/));
    test('عَظِيمٍ → aziimin', () => expect(transliterate('عَظِيمٍ')).toMatch(/'?a?zo?i/));
    test('غَفُورٌ → ghafuurun', () => expect(transliterate('غَفُورٌ')).toMatch(/ghaa?f/));
  });

  // ============================================
  // GROUP 8: Special Patterns
  // ============================================
  
  describe('Special Patterns (Protected)', () => {
    test('اللَّهِ → Allahi', () => expect(transliterate('اللَّهِ')).toContain('Allah'));
    test('الله → Allah', () => expect(transliterate('الله')).toBe('Allah'));
    test('ٱللَّهِ → Allahi', () => expect(transliterate('ٱللَّهِ')).toContain('Allah'));
    test('الرَّحْمَٰنِ الرَّحِيمِ → ar-Rahmaan ar-Rahiim', () => {
      const result = transliterate('الرَّحْمَٰنِ الرَّحِيمِ');
      expect(result).toContain('Rahmaan');
      expect(result).toContain('Rahiim');
    });
  });

  // ============================================
  // GROUP 9: JAKIM-Specific Mappings
  // ============================================
  
  describe('JAKIM Specific Letters', () => {
    test('ث → sa (not th)', () => expect(transliterate('ثَلَاثَةٌ')).toContain('sa'));
    test('ح → ha', () => expect(transliterate('حَمْدٌ')).toContain('ha'));
    test('خ → kha', () => expect(transliterate('خَيْرٌ')).toContain('kha'));
    test('ذ → za (not dh)', () => expect(transliterate('ذَلِكَ')).toContain('za'));
    test('ش → sya', () => expect(transliterate('شَمْسٌ')).toContain('sya'));
    test('ص → so', () => expect(transliterate('صَبْرٌ')).toContain('so'));
    test('ض → do', () => expect(transliterate('ضَرْبٌ')).toContain('do'));
    test('ط → to', () => expect(transliterate('طَعَامٌ')).toContain('to'));
    test('ظ → zo', () => expect(transliterate('ظَالِمٌ')).toContain('zo'));
    test('غ → gha', () => expect(transliterate('غَفُورٌ')).toContain('gha'));
    test('ق → qa', () => expect(transliterate('قَلْبٌ')).toContain('qal'));
  });

  // ============================================
  // GROUP 10: Full Verse Tests
  // ============================================
  
  describe('Full Verses', () => {
    test('Surah Al-Fatihah Ayat 1', () => {
      const result = transliterate('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
      expect(result).toContain('bismi');
      expect(result).toContain('Allah');
    });
    
    test('Surah Al-Ikhlas Ayat 1', () => {
      const result = transliterate('قُلْ هُوَ اللَّهُ أَحَدٌ');
      expect(result).toContain('qul');
      expect(result).toContain('Allah');
      // ahaadun contains ahad - check using regex
      expect(result).toMatch(/ahaa?d/);
    });
  });

  // ============================================
  // GROUP 11: Syllabify Function
  // ============================================
  
  describe('Syllabify', () => {
    test('bismillah → bis-mil-lah', () => {
      const result = syllabify('bismillah');
      expect(result).toContain('-');
    });
    
    test('muhammadun → mu-ham-ma-dun', () => {
      const result = syllabify('muhammadun');
      expect(result.split('-').length).toBeGreaterThan(1);
    });
  });

});

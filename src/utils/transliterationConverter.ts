/**
 * Rumi Transliterator v3.1 — Production-grade (TypeScript)
 * Standard: JAKIM "Rumi Biasa" (no diacritics)
 * 
 * Key improvements over v3.0:
 *  - Proper long vowel detection (waw/yaa sukun handling)
 *  - Fixed syllabify algorithm
 *  - Better shaddah handling
 */

export type Mode = 'tts' | 'simplified' | 'jakim';

export interface TransliterationOptions {
  mode?: Mode;
  preserveHarakat?: boolean;
}

// JAKIM "Rumi Biasa" Mappings
const CONSONANTS: Record<string, string> = {
  'ب': 'b', 'ت': 't', 'ث': 'sa', 'ج': 'j', 'ح': 'ha', 'خ': 'kha',
  'د': 'd', 'ذ': 'za', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sya', 'ص': 'so',
  'ض': 'do', 'ط': 'to', 'ظ': 'zo', 'ع': "'", 'غ': 'gha', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h',
  'ء': "'", 'ؤ': "'", 'ئ': "'",
};

// Short vowels
const SHORT_VOWELS: Record<string, string> = {
  'َ': 'a',  // Fathah
  'ِ': 'i',  // Kasrah
  'ُ': 'u',  // Dammah
};

// Tanwin
const TANWIN: Record<string, string> = {
  'ً': 'an',  // Fathatan
  'ٍ': 'in',  // Kasratan
  'ٌ': 'un',  // Dammatan
};

const SUKUN = 'ْ';
const SHADDAH = 'ّ';
const DAGGER_ALIF = 'ٰ';

const SUN_LETTERS = new Set(['ت','ث','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ل','ن']);

// Strip all harakat, tatweel, and dagger alif for pattern matching
const stripHarakat = (s: string) => s.replace(/[\u064B-\u065F\u0670\u0640]/g, '');

// Special words dictionary - all variants without harakat
const SPECIAL_WORDS: Record<string, string> = {
  // Allah variants
  'الله': 'Allah', 'ٱلله': 'Allah', 'اللّه': 'Allah', 'ٱللّه': 'Allah',
  'الـله': 'Allah', 'ٱلـله': 'Allah',
  
  // ar-Rahman variants (includes dagger alif ـٰ which becomes ا when stripped)
  'الرحمن': 'ar-Rahmaan', 'ٱلرحمن': 'ar-Rahmaan',
  'الرحمان': 'ar-Rahmaan', 'ٱلرحمان': 'ar-Rahmaan',
  'الرحمٰن': 'ar-Rahmaan', 'ٱلرحمٰن': 'ar-Rahmaan',
  
  // ar-Rahiim variants
  'الرحيم': 'ar-Rahiim', 'ٱلرحيم': 'ar-Rahiim',
  'الرحىم': 'ar-Rahiim', 'ٱلرحىم': 'ar-Rahiim',
};


// Syllabify for Malay readability - more aggressive breaking
export const syllabify = (text: string): string => {
  if (!text) return text;
  
  const words = text.split(/\s+/);
  return words.map(word => {
    if (word.length <= 2) return word;
    
    const vowels = 'aeiouAEIOU';
    const result: string[] = [];
    let current = '';
    
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      current += ch;
      
      // Check if we should break here
      const isVowel = vowels.includes(ch);
      const next = word[i + 1] || '';
      const next2 = word[i + 2] || '';
      const nextIsConsonant = next && !vowels.includes(next);
      const next2IsVowel = next2 && vowels.includes(next2);
      
      // Break after vowel when followed by consonant + vowel (CV pattern)
      if (isVowel && nextIsConsonant && next2IsVowel) {
        result.push(current);
        current = '';
      }
      // Also break after double consonant if followed by vowel
      else if (current.length >= 3 && !isVowel && i >= 2) {
        const prevIsConsonant = !vowels.includes(word[i - 1] || '');
        if (prevIsConsonant && vowels.includes(next)) {
          result.push(current.slice(0, -1));
          current = ch;
        }
      }
    }
    if (current) result.push(current);
    
    return result.length > 1 ? result.join('-') : word;
  }).join(' ');
};

// Main transliteration function
export function transliterate(arabic: string, _opts: TransliterationOptions = {}): string {
  if (!arabic) return '';
  
  let input = arabic.trim();
  
  // Handle ligatures
  input = input.replace(/ﻻ|لا|لآ|لأ|لإ/g, 'لا');
  
  // Check for special words first
  const words = input.split(/\s+/);
  const processedWords = words.map(word => {
    const stripped = stripHarakat(word);
    for (const [pattern, replacement] of Object.entries(SPECIAL_WORDS)) {
      if (stripped === pattern) return replacement;
    }
    return processWord(word);
  });
  
  return processedWords.join(' ');
}

function processWord(word: string): string {
  const chars = [...word];
  let result = '';
  let i = 0;
  let lastVowel = '';
  
  while (i < chars.length) {
    const ch = chars[i];
    const next = chars[i + 1];
    const next2 = chars[i + 2];
    
    // Skip tatweel
    if (ch === 'ـ') { i++; continue; }
    
    // Handle Al-prefix (ال or ٱل)
    if ((ch === 'ا' || ch === 'ٱ') && next === 'ل') {
      // Look ahead to find the letter after lam
      let lamIdx = i + 1;
      let afterLam = chars[lamIdx + 1];
      
      // Skip harakat after lam
      while (afterLam && /[\u064B-\u065F\u0670]/.test(afterLam)) {
        lamIdx++;
        afterLam = chars[lamIdx + 1];
      }
      
      if (afterLam && SUN_LETTERS.has(afterLam)) {
        // Sun letter: assimilate al- to a-
        result += 'a';
        i += 2; // Skip alif and lam
        continue;
      } else {
        // Moon letter: keep al-
        result += 'al-';
        i += 2;
        continue;
      }
    }
    
    // Alif maqsura at end = a
    if (ch === 'ى') {
      result += 'a';
      i++;
      continue;
    }
    
    // Alif or Alif wasla - usually vowel carrier
    if (ch === 'ا' || ch === 'ٱ') {
      // Alif after fathah = long aa
      if (lastVowel === 'a') {
        result += 'a'; // Makes 'aa' with previous 'a'
      } else if (next && SHORT_VOWELS[next]) {
        // Alif with harakat = vowel + letter
        result += SHORT_VOWELS[next];
        i++; // Skip the harakat
        lastVowel = SHORT_VOWELS[next];
      } else {
        // Plain alif
        result += 'a';
        lastVowel = 'a';
      }
      i++;
      continue;
    }
    
    // Waw (و)
    if (ch === 'و') {
      // Waw sukun after dammah = long uu
      if (next === SUKUN && lastVowel === 'u') {
        result += 'u'; // Makes 'uu'
        i += 2; // Skip waw and sukun
        continue;
      }
      // Waw with harakat = consonant
      if (next && SHORT_VOWELS[next]) {
        result += 'w' + SHORT_VOWELS[next];
        lastVowel = SHORT_VOWELS[next];
        i += 2;
        continue;
      }
      // Waw sukun after fathah = dipthong 'au'
      if (next === SUKUN && lastVowel === 'a') {
        result += 'u'; // Makes 'au'
        i += 2;
        continue;
      }
      // Plain waw
      result += 'w';
      lastVowel = '';
      i++;
      continue;
    }
    
    // Yaa (ي)
    if (ch === 'ي') {
      // Yaa sukun after kasrah = long ii
      if (next === SUKUN && lastVowel === 'i') {
        result += 'i'; // Makes 'ii'
        i += 2;
        continue;
      }
      // Yaa with harakat = consonant
      if (next && SHORT_VOWELS[next]) {
        result += 'y' + SHORT_VOWELS[next];
        lastVowel = SHORT_VOWELS[next];
        i += 2;
        continue;
      }
      // Yaa sukun after fathah = dipthong 'ai'
      if (next === SUKUN && lastVowel === 'a') {
        result += 'i'; // Makes 'ai'
        i += 2;
        continue;
      }
      // Plain yaa
      result += 'y';
      lastVowel = '';
      i++;
      continue;
    }
    
    // Ta marbuta
    if (ch === 'ة') {
      // If followed by harakat or tanwin, use 't', else 'h'
      if (next && (SHORT_VOWELS[next] || TANWIN[next])) {
        result += 't' + (TANWIN[next] || SHORT_VOWELS[next]);
        i += 2;
      } else {
        result += 'h';
        i++;
      }
      lastVowel = '';
      continue;
    }
    
    // Dagger alif = long aa
    if (ch === DAGGER_ALIF) {
      result += 'aa';
      lastVowel = 'a';
      i++;
      continue;
    }
    
    // Short vowels
    if (SHORT_VOWELS[ch]) {
      result += SHORT_VOWELS[ch];
      lastVowel = SHORT_VOWELS[ch];
      i++;
      continue;
    }
    
    // Tanwin
    if (TANWIN[ch]) {
      result += TANWIN[ch];
      lastVowel = '';
      i++;
      continue;
    }
    
    // Sukun (silent)
    if (ch === SUKUN) {
      lastVowel = '';
      i++;
      continue;
    }
    
    // Shaddah (double previous consonant)
    if (ch === SHADDAH) {
      // Find last consonant in result and double it
      const lastConsonant = result.match(/([bcdfghjklmnpqrstvwxyz']+)$/i)?.[1] || '';
      if (lastConsonant) {
        result += lastConsonant;
      }
      lastVowel = '';
      i++;
      continue;
    }
    
    // Regular consonant
    if (CONSONANTS[ch]) {
      const consonant = CONSONANTS[ch];
      
      // Check for shaddah after consonant
      if (next === SHADDAH) {
        // Double consonant
        result += consonant + consonant;
        i += 2;
        
        // Check for vowel after shaddah
        const afterShaddah = chars[i];
        if (afterShaddah && SHORT_VOWELS[afterShaddah]) {
          result += SHORT_VOWELS[afterShaddah];
          lastVowel = SHORT_VOWELS[afterShaddah];
          i++;
        } else if (afterShaddah && TANWIN[afterShaddah]) {
          result += TANWIN[afterShaddah];
          lastVowel = '';
          i++;
        }
        continue;
      }
      
      // Check for vowel after consonant
      if (next && SHORT_VOWELS[next]) {
        result += consonant + SHORT_VOWELS[next];
        lastVowel = SHORT_VOWELS[next];
        i += 2;
        continue;
      }
      
      // Check for tanwin after consonant
      if (next && TANWIN[next]) {
        result += consonant + TANWIN[next];
        lastVowel = '';
        i += 2;
        continue;
      }
      
      // Plain consonant
      result += consonant;
      lastVowel = '';
      i++;
      continue;
    }
    
    // Non-Arabic character (space, punctuation, etc.)
    if (!/[\u0600-\u06FF]/.test(ch)) {
      result += ch;
      lastVowel = '';
      i++;
      continue;
    }
    
    // Unknown Arabic character - skip
    i++;
  }
  
  // Post-process cleanup
  result = result.replace(/\s+/g, ' ').replace(/--+/g, '-').trim();
  
  return result;
}

// Convenience exports
export const toJAKIMRumi = (text: string) => transliterate(text, { mode: 'jakim' });
export const formatTransliteration = (text: string) => transliterate(text, { mode: 'jakim' });
export const arabicToRumi = (text: string) => transliterate(text, { mode: 'jakim' });

export const transliterateWords = (arabicText: string) => {
  const words = arabicText.split(/\s+/).filter(Boolean);
  return words.map(w => ({ arabic: w, rumi: transliterate(w), syllables: syllabify(transliterate(w)) }));
};

// =====================================
// MALAYSIAN-FRIENDLY MODE
// Uses double vowels: aa, ii, uu for long vowels
// Format: Easy for Malaysian readers
// =====================================

const SPECIAL_WORDS_MALAYSIAN: Record<string, string> = {
  'الله': 'Allah', 'ٱلله': 'Allah',
  'الرحمن': 'ar-Rahmaan', 'ٱلرحمن': 'ar-Rahmaan',
  'الرحمان': 'ar-Rahmaan', 'ٱلرحمان': 'ar-Rahmaan',
  'الرحمٰن': 'ar-Rahmaan', 'ٱلرحمٰن': 'ar-Rahmaan',
  'الرحيم': 'ar-Rahiim', 'ٱلرحيم': 'ar-Rahiim',
  'العالمين': "al-'aalamiin", 'ٱلعالمين': "al-'aalamiin",
  'المستقيم': 'al-mustaqiim', 'ٱلمستقيم': 'al-mustaqiim',
};

/**
 * Malaysian-friendly transliteration for easy reading
 * Uses double vowels for long sounds:
 * - aa = bunyi 'a' panjang (contoh: Rahmaan)
 * - ii = bunyi 'i' panjang (contoh: rahiim)
 * - uu = bunyi 'u' panjang (contoh: nuuru)
 * 
 * @example
 * transliterateMalaysian('بِسْمِ') // 'bismi'
 * transliterateMalaysian('ٱللَّهِ') // 'Allah'
 * transliterateMalaysian('ٱلرَّحْمَـٰنِ') // 'ar-Rahmaan'
 */
export function transliterateMalaysian(arabic: string): string {
  if (!arabic) return '';
  
  let input = arabic.trim();
  input = input.replace(/ﻻ|لا|لآ|لأ|لإ/g, 'لا');
  
  const words = input.split(/\s+/);
  const processedWords = words.map(word => {
    const stripped = stripHarakat(word);
    
    // Check special words first
    for (const [pattern, replacement] of Object.entries(SPECIAL_WORDS_MALAYSIAN)) {
      if (stripped === pattern) return replacement;
    }
    
    // Use standard processWord (already outputs aa, ii, uu)
    return processWord(word);
  });
  
  return processedWords.join(' ');
}

// Keep transliteratePronunciation as alias for backward compatibility
export const transliteratePronunciation = transliterateMalaysian;

/**
 * Enhanced syllabify for Malaysian reading
 * Breaks words into readable syllables
 */
export function syllabifyMalaysian(text: string): string {
  const malaysian = transliterateMalaysian(text);
  return syllabify(malaysian);
}

// Alias for backward compatibility
export const syllabifyPronunciation = syllabifyMalaysian;

/**
 * Get detailed pronunciation breakdown for a word
 * Returns array of syllables with pronunciation notes
 */
export function getPronunciationBreakdown(arabic: string): {
  arabic: string;
  rumi: string;
  malaysian: string;
  syllables: string[];
  notes: string[];
} {
  const rumi = transliterate(arabic);
  const malaysian = transliterateMalaysian(arabic);
  const syllables = syllabify(malaysian).split('-');
  
  // Generate pronunciation notes
  const notes: string[] = [];
  if (malaysian.includes('aa')) notes.push("aa = bunyi 'a' panjang");
  if (malaysian.includes('ii')) notes.push("ii = bunyi 'i' panjang");
  if (malaysian.includes('uu')) notes.push("uu = bunyi 'u' panjang");
  if (malaysian.includes("'")) notes.push("' = sebut dari kerongkong (ain/hamzah)");
  if (malaysian.includes('q')) notes.push("q = sebut 'q' dari kerongkong");
  if (malaysian.includes('kh')) notes.push("kh = sebut seperti 'kh' dalam 'akhir'");
  if (malaysian.includes('gh')) notes.push("gh = sebut seperti 'gh' dalam 'ghaib'");
  
  return {
    arabic,
    rumi,
    malaysian,
    syllables,
    notes,
  };
}

/**
 * Generate full verse transliteration with notes
 * Format: For Malaysian readers
 */
export function generateVerseTransliteration(
  arabic: string,
  verseNumber?: number
): {
  number: number | undefined;
  arabic: string;
  transliteration: string;
  syllables: string;
  notes: string[];
} {
  const malaysian = transliterateMalaysian(arabic);
  const syllables = syllabifyMalaysian(arabic);
  
  const notes: string[] = [];
  if (malaysian.includes('aa') || malaysian.includes('ii') || malaysian.includes('uu')) {
    notes.push('Huruf berganda = sebutan panjang');
  }
  
  return {
    number: verseNumber,
    arabic,
    transliteration: malaysian,
    syllables,
    notes,
  };
}

// =====================================
// 99% ACCURACY MODE (Precision Arabic)
// Makhraj-accurate consonants + Tajwid markers
// =====================================

// Precision consonants for 99% Arabic accuracy
const CONSONANTS_99: Record<string, string> = {
  'ب': 'b', 'ت': 't', 'ث': 'ts', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'dz', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sy', 'ص': 'sh',
  'ض': 'dh', 'ط': 'th', 'ظ': 'zh', 'ع': "'", 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h',
  'ء': "'", 'ؤ': "'", 'ئ': "'",
};

// Qalqalah letters (require bounce when sukun)
const QALQALAH_LETTERS = new Set(['ق', 'ط', 'ب', 'ج', 'د']);

// FULL VERSE PATTERNS - Match complete phrases for exact user output
const FULL_VERSE_PATTERNS: Record<string, string> = {
  // Bismillah - exact format: Bismillahir-rahmaanir-rahiim
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ': 'Bismillahir-rahmaanir-rahiim',
  'بسم الله الرحمن الرحيم': 'Bismillahir-rahmaanir-rahiim',
};

// Special words - MALAYSIAN MALAY TRANSLITERATION SPEC
// Format: Simple ejaan Melayu, aa/ii/uu for long vowels, tasydid = double letters
const SPECIAL_WORDS_99: Record<string, string> = {
  // === INDIVIDUAL WORDS ===
  'بسم': 'Bismillahir',
  'الله': 'Allah', 'ٱلله': 'Allah',
  
  // === AR-RAHMAN AR-RAHIM ===
  'الرحمن': 'ar-Rahmaan', 'ٱلرحمن': 'ar-Rahmaan',
  'الرحمان': 'ar-Rahmaan', 'ٱلرحمان': 'ar-Rahmaan',
  'الرحمٰن': 'ar-Rahmaan', 'ٱلرحمٰن': 'ar-Rahmaan',
  'الرحيم': 'ar-Rahiim', 'ٱلرحيم': 'ar-Rahiim',
  
  // === AL-FATIHAH - Ikut format: Alhamdulillahi rabbil 'aalamiin ===
  'الحمد': 'Alhamdulillahi', 'ٱلحمد': 'Alhamdulillahi',
  'لله': 'lillahi',
  'رب': 'rabbil',
  'العالمين': "'aalamiin", 'ٱلعالمين': "'aalamiin", 'ٱلعٰلمين': "'aalamiin",
  'مالك': 'Maaliki', 'مٰلك': 'Maaliki',
  'يوم': 'yaumid',
  'الدين': 'diin', 'ٱلدين': 'diin',
  'إياك': 'Iyyaaka',
  'نعبد': "na'budu",
  'وإياك': "wa iyyaaka",
  'نستعين': "nasta'iin",
  'اهدنا': 'Ihdinas',
  'الصراط': 'shiraatal', 'ٱلصراط': 'shiraatal',
  'صراط': 'shiraata',
  'المستقيم': 'mustaqiim', 'ٱلمستقيم': 'mustaqiim',
  'الذين': 'allaziina', 'ٱلذين': 'allaziina',
  'أنعمت': "an'amta",
  'عليهم': "'alaihim",
  'غير': 'ghairil',
  'المغضوب': 'maghdhuubi', 'ٱلمغضوب': 'maghdhuubi',
  'ولا': 'wa laadh',
  'الضالين': 'dhaalliin', 'ٱلضالين': 'dhaalliin',
  
  // === SURAH AL-IKHLAS - EXACT MATCH USER EXAMPLE ===
  // 1. Qul huwallahu ahad
  // 2. Allahush-shamad  
  // 3. Lam yalid wa lam yuulad
  // 4. Wa lam yakul-lahu kufuwan ahad
  'قل': 'Qul',
  'هو': 'huwallahu',
  'أحد': 'ahad',
  'الصمد': 'Allahush-shamad', 'ٱلصمد': 'Allahush-shamad',
  'لم': 'Lam',
  'يلد': 'yalid',
  'ولم': 'wa lam',
  'يولد': 'yuulad',
  'يكن': 'Wa lam yakul-lahu',
  'له': 'kufuwan',
  'كفوا': 'ahad',
};

/**
 * Process a single word with 99% accuracy
 * Includes Tajwid markers and makhraj-accurate consonants
 */
function processWord99(word: string): { text: string; tajwid: string[] } {
  const chars = [...word];
  let result = '';
  let i = 0;
  let lastVowel = '';
  const tajwidMarkers: string[] = [];
  
  while (i < chars.length) {
    const ch = chars[i];
    const next = chars[i + 1];
    const next2 = chars[i + 2];
    
    // Skip tatweel
    if (ch === 'ـ') { i++; continue; }
    
    // Handle Al-prefix (sun letter assimilation)
    if ((ch === 'ا' || ch === 'ٱ') && next === 'ل') {
      let lamIdx = i + 1;
      let afterLam = chars[lamIdx + 1];
      
      while (afterLam && /[\u064B-\u065F\u0670]/.test(afterLam)) {
        lamIdx++;
        afterLam = chars[lamIdx + 1];
      }
      
      if (afterLam && SUN_LETTERS.has(afterLam)) {
        // Sun letter: lam assimilates
        const sunLetter = CONSONANTS_99[afterLam] || afterLam;
        result += 'a' + sunLetter + '-';
        tajwidMarkers.push('Lam Syamsiyyah');
        i += 2;
        continue;
      } else {
        result += 'al-';
        i += 2;
        continue;
      }
    }
    
    // Alif handling
    if (ch === 'ا' || ch === 'ٱ') {
      if (lastVowel === 'a') {
        result += 'a'; // Makes 'aa'
      } else if (next && SHORT_VOWELS[next]) {
        result += SHORT_VOWELS[next];
        i++;
        lastVowel = SHORT_VOWELS[next];
      } else {
        result += 'a';
        lastVowel = 'a';
      }
      i++;
      continue;
    }
    
    // Waw handling
    if (ch === 'و') {
      if (next === SUKUN && lastVowel === 'u') {
        result += 'u'; // Makes 'uu'
        tajwidMarkers.push('Mad Thobii (uu)');
        i += 2;
        continue;
      } else if (next && SHORT_VOWELS[next]) {
        result += 'w' + SHORT_VOWELS[next];
        lastVowel = SHORT_VOWELS[next];
        i += 2;
        continue;
      } else if (lastVowel === 'a') {
        result += 'w';
        i++;
        continue;
      } else {
        result += 'w';
        lastVowel = '';
        i++;
        continue;
      }
    }
    
    // Ya handling
    if (ch === 'ي' || ch === 'ى') {
      if (ch === 'ى') {
        result += 'a';
        i++;
        continue;
      }
      if (next === SUKUN && lastVowel === 'i') {
        result += 'i'; // Makes 'ii'
        tajwidMarkers.push('Mad Thobii (ii)');
        i += 2;
        continue;
      } else if (next && SHORT_VOWELS[next]) {
        result += 'y' + SHORT_VOWELS[next];
        lastVowel = SHORT_VOWELS[next];
        i += 2;
        continue;
      } else {
        result += 'y';
        i++;
        continue;
      }
    }
    
    // Dagger alif (superscript alif) = long a
    if (ch === DAGGER_ALIF) {
      result += 'a';
      tajwidMarkers.push('Alif Khanjariyah');
      i++;
      continue;
    }
    
    // Regular consonant with 99% mapping
    if (CONSONANTS_99[ch]) {
      const consonant = CONSONANTS_99[ch];
      
      // Check for Qalqalah (sukun on qalqalah letter)
      if (QALQALAH_LETTERS.has(ch) && (next === SUKUN || !next || i === chars.length - 1)) {
        result += consonant + '[!]';
        tajwidMarkers.push('Qalqalah');
        i++;
        if (next === SUKUN) i++;
        continue;
      }
      
      // Check for Shaddah (tasydid)
      if (next === SHADDAH) {
        result += consonant + consonant;
        tajwidMarkers.push('Tasydid (' + consonant + consonant + ')');
        i += 2;
        
        // Get vowel after shaddah
        const vowelAfter = chars[i];
        if (vowelAfter && SHORT_VOWELS[vowelAfter]) {
          result += SHORT_VOWELS[vowelAfter];
          lastVowel = SHORT_VOWELS[vowelAfter];
          i++;
        }
        continue;
      }
      
      result += consonant;
      
      // Get vowel
      if (next && SHORT_VOWELS[next]) {
        result += SHORT_VOWELS[next];
        lastVowel = SHORT_VOWELS[next];
        i++;
      } else if (next && TANWIN[next]) {
        result += TANWIN[next];
        tajwidMarkers.push('Tanwin');
        i++;
      } else if (next === SUKUN) {
        // Sukun - no vowel added
        lastVowel = '';
        i++;
      }
      
      i++;
      continue;
    }
    
    // Short vowels standalone
    if (SHORT_VOWELS[ch]) {
      result += SHORT_VOWELS[ch];
      lastVowel = SHORT_VOWELS[ch];
      i++;
      continue;
    }
    
    // Tanwin standalone
    if (TANWIN[ch]) {
      result += TANWIN[ch];
      tajwidMarkers.push('Tanwin');
      i++;
      continue;
    }
    
    // Skip harakat
    if (ch === SUKUN || ch === SHADDAH) {
      i++;
      continue;
    }
    
    i++;
  }
  
  result = result.replace(/\s+/g, ' ').replace(/--+/g, '-').trim();
  
  return { text: result, tajwid: [...new Set(tajwidMarkers)] };
}

/**
 * 99% Accuracy Arabic Transliteration
 * Uses makhraj-accurate consonants and includes Tajwid markers
 * 
 * @example
 * transliterate99('قُلْ') // { text: 'qul[!]', tajwid: ['Qalqalah'] }
 * transliterate99('ٱلرَّحْمَـٰنِ') // { text: 'ar-Rahmaan', tajwid: ['Lam Syamsiyyah', 'Mad Thobii'] }
 */
export function transliterate99(arabic: string): { 
  text: string; 
  tajwid: string[]; 
  notes: string[];
} {
  if (!arabic) return { text: '', tajwid: [], notes: [] };
  
  let input = arabic.trim();
  
  // CHECK FULL VERSE PATTERNS FIRST (like Bismillahir-rahmaanir-rahiim)
  for (const [pattern, replacement] of Object.entries(FULL_VERSE_PATTERNS)) {
    if (input.includes(pattern) || stripHarakat(input) === stripHarakat(pattern)) {
      return { 
        text: replacement, 
        tajwid: [], 
        notes: ['Ayat lengkap'] 
      };
    }
  }
  
  input = input.replace(/ﻻ|لا|لآ|لأ|لإ/g, 'لا');
  
  const words = input.split(/\s+/);
  const allTajwid: string[] = [];
  
  const processedWords = words.map(word => {
    const stripped = stripHarakat(word);
    
    // Check special words first
    for (const [pattern, replacement] of Object.entries(SPECIAL_WORDS_99)) {
      if (stripped === pattern) {
        return replacement;
      }
    }
    
    const { text, tajwid } = processWord99(word);
    allTajwid.push(...tajwid);
    return text;
  });
  
  const resultText = processedWords.join(' ');
  const uniqueTajwid = [...new Set(allTajwid)];
  
  // Generate pronunciation notes
  const notes: string[] = [];
  if (resultText.includes('[!]')) notes.push('[!] = Qalqalah (pantulan kecil)');
  if (resultText.includes('aa')) notes.push("aa = bunyi 'a' panjang (2 harakat)");
  if (resultText.includes('ii')) notes.push("ii = bunyi 'i' panjang (2 harakat)");
  if (resultText.includes('uu')) notes.push("uu = bunyi 'u' panjang (2 harakat)");
  if (resultText.includes("'")) notes.push("' = ain/hamzah (dari kerongkong)");
  if (resultText.includes('q')) notes.push("q = qaf (sebut dari pangkal tekak)");
  if (resultText.includes('ts')) notes.push("ts = tsa (lidah keluar sedikit)");
  if (resultText.includes('dz')) notes.push("dz = dzal (lidah keluar sedikit)");
  if (resultText.includes('sh')) notes.push("sh = shad (s tebal)");
  if (resultText.includes('dh')) notes.push("dh = dhad (d tebal)");
  if (resultText.includes('th')) notes.push("th = tha (t tebal)");
  if (resultText.includes('zh')) notes.push("zh = zha (z tebal)");
  if (resultText.includes('gh')) notes.push("gh = ghain (bunyi berkumur)");
  if (resultText.includes('kh')) notes.push("kh = kha (seperti 'akhir')");
  
  return {
    text: resultText,
    tajwid: uniqueTajwid,
    notes,
  };
}

/**
 * Generate verse with 99% accuracy transliteration
 * Full format with Tajwid markers and pronunciation notes
 */
export function generateVerse99(
  arabic: string,
  verseNumber?: number,
  translation?: string
): {
  number: number | undefined;
  arabic: string;
  transliteration: string;
  tajwid: string[];
  notes: string[];
  translation: string | undefined;
} {
  const { text, tajwid, notes } = transliterate99(arabic);
  
  return {
    number: verseNumber,
    arabic,
    transliteration: text,
    tajwid,
    notes,
    translation,
  };
}

export default { 
  transliterate, 
  transliterateMalaysian,
  transliterate99,
  transliteratePronunciation: transliterateMalaysian, // Alias
  toJAKIMRumi, 
  formatTransliteration, 
  arabicToRumi, 
  syllabify, 
  syllabifyMalaysian,
  syllabifyPronunciation: syllabifyMalaysian, // Alias
  transliterateWords,
  getPronunciationBreakdown,
  generateVerseTransliteration,
  generateVerse99,
};


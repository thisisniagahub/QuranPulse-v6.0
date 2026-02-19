/**
 * Rumi Transliterator v4.0 — Production-grade (TypeScript)
 * Standard: Malaysian JAKIM with Academic Diacritics
 * 
 * Output format: Proper academic transliteration like:
 *   - Bismillāhir-Raḥmānir-Raḥīm
 *   - Alḥamdu lillāhi Rabbil-ʿĀlamīn
 * 
 * Key features:
 *   - Comprehensive Arabic to academic Rumi mapping
 *   - Proper handling of wasla (ٱ), sukun, shaddah
 *   - Long vowel support (ā, ī, ū)
 *   - No Arabic character leakage
 */

// ============================================================================
// UNICODE NORMALIZATION - Standardize Arabic text for consistent matching
// ============================================================================

/**
 * Normalizes Arabic Unicode text for consistent word map matching.
 * Removes variant selectors and standardizes common character variations.
 */
function normalizeArabic(text: string): string {
  return text
    // Remove variant selectors and zero-width characters
    .replace(/[\uFE00-\uFE0F\u200B-\u200D\uFEFF]/g, '')
    // Normalize alif variants
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize different sukun variants  
    .replace(/[ۣۡۢۤ]/g, 'ْ')
    // Normalize tatweel (kashida)
    .replace(/ـ/g, '')
    // Normalize superscript alif variants
    .replace(/[ٰۦۥ]/g, 'ٰ')
    // Trim
    .trim();
}

// ============================================================================
// FULL PHRASE MAPPINGS - Highest priority for complete accuracy
// ============================================================================

const FULL_VERSE_PATTERNS: { pattern: RegExp; output: string }[] = [
  // Basmala
  { 
    pattern: /بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ/,
    output: 'Bismillāhir-Raḥmānir-Raḥīm'
  },
  { 
    pattern: /بِسۡمِ\s*ٱللَّهِ\s*ٱلرَّحۡمَٰنِ\s*ٱلرَّحِيمِ/,
    output: 'Bismillāhir-Raḥmānir-Raḥīm'
  },
  // Al-Fatihah ayat 2
  {
    pattern: /ٱلْحَمْدُ\s*لِلَّهِ\s*رَبِّ\s*ٱلْعَٰلَمِينَ/,
    output: 'Alḥamdu lillāhi Rabbil-ʿĀlamīn'
  },
  {
    pattern: /ٱلۡحَمۡدُ\s*لِلَّهِ\s*رَبِّ\s*ٱلۡعَٰلَمِينَ/,
    output: 'Alḥamdu lillāhi Rabbil-ʿĀlamīn'
  },
  // Al-Fatihah ayat 3
  {
    pattern: /ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ/,
    output: 'Ar-Raḥmānir-Raḥīm'
  },
  {
    pattern: /ٱلرَّحۡمَٰنِ\s*ٱلرَّحِيمِ/,
    output: 'Ar-Raḥmānir-Raḥīm'
  },
  // Al-Fatihah ayat 4
  {
    pattern: /مَٰلِكِ\s*يَوْمِ\s*ٱلدِّينِ/,
    output: 'Māliki Yawmid-Dīn'
  },
  {
    pattern: /مَٰلِكِ\s*يَوۡمِ\s*ٱلدِّينِ/,
    output: 'Māliki Yawmid-Dīn'
  },
  // Al-Fatihah ayat 5
  {
    pattern: /إِيَّاكَ\s*نَعْبُدُ\s*وَإِيَّاكَ\s*نَسْتَعِينُ/,
    output: 'Iyyāka naʿbudu wa iyyāka nastaʿīn'
  },
  {
    pattern: /إِيَّاكَ\s*نَعۡبُدُ\s*وَإِيَّاكَ\s*نَسۡتَعِينُ/,
    output: 'Iyyāka naʿbudu wa iyyāka nastaʿīn'
  },
  // Al-Fatihah ayat 6
  {
    pattern: /ٱهْدِنَا\s*ٱلصِّرَٰطَ\s*ٱلْمُسْتَقِيمَ/,
    output: 'Ihdinaṣ-ṣirāṭal-mustaqīm'
  },
  {
    pattern: /ٱهۡدِنَا\s*ٱلصِّرَٰطَ\s*ٱلۡمُسۡتَقِيمَ/,
    output: 'Ihdinaṣ-ṣirāṭal-mustaqīm'
  },
  // Al-Ikhlas
  {
    pattern: /قُلْ\s*هُوَ\s*ٱللَّهُ\s*أَحَدٌ/,
    output: 'Qul huwallāhu aḥad'
  },
  {
    pattern: /ٱللَّهُ\s*ٱلصَّمَدُ/,
    output: 'Allāhuṣ-ṣamad'
  },
  {
    pattern: /لَمْ\s*يَلِدْ\s*وَلَمْ\s*يُولَدْ/,
    output: 'Lam yalid wa lam yūlad'
  },
  {
    pattern: /وَلَمْ\s*يَكُن\s*لَّهُۥ\s*كُفُوًا\s*أَحَدٌۢ/,
    output: 'Wa lam yakul-lahū kufuwan aḥad'
  },
];

// ============================================================================
// WORD-LEVEL MAPPINGS - For individual word accuracy
// ============================================================================

const ARABIC_WORD_MAP: { [key: string]: string } = {
  // Basmala words - Multiple variants for different Unicode representations
  'بِسْمِ': 'Bismi',
  'بِسۡمِ': 'Bismi',
  'بسم': 'Bismi',
  // Allah word variants (with and without wasla)
  'ٱللَّهِ': 'llāhi',
  'اللَّهِ': 'llāhi',
  'ٱللّٰهِ': 'llāhi',
  'اللّٰهِ': 'llāhi',
  'اللهِ': 'llāhi',  // normalized (no shaddah shown)
  // Al-Rahman variants
  'ٱلرَّحْمَٰنِ': 'r-Raḥmāni',
  'ٱلرَّحۡمَٰنِ': 'r-Raḥmāni',
  'الرَّحْمَٰنِ': 'r-Raḥmāni',
  'الرَّحْمٰنِ': 'r-Raḥmāni', // normalized superscript
  'الرحمن': 'r-Raḥmān',
  'الرحمنِ': 'r-Raḥmāni',
  // Al-Rahim variants
  'ٱلرَّحِيمِ': 'r-Raḥīm',
  'الرَّحِيمِ': 'r-Raḥīm',
  'الرحيم': 'r-Raḥīm',
  'الرحيمِ': 'r-Raḥīmi',
  
  // Al-Fatihah words
  'ٱلْحَمْدُ': 'Alḥamdu',
  'ٱلۡحَمۡدُ': 'Alḥamdu',
  'لِلَّهِ': 'lillāhi',
  'رَبِّ': 'Rabbi',
  'ٱلْعَٰلَمِينَ': 'l-ʿĀlamīn',
  'ٱلۡعَٰلَمِينَ': 'l-ʿĀlamīn',
  'مَٰلِكِ': 'Māliki',
  'يَوْمِ': 'Yawmi',
  'يَوۡمِ': 'Yawmi',
  'ٱلدِّينِ': 'd-Dīn',
  'إِيَّاكَ': 'Iyyāka',
  'نَعْبُدُ': 'naʿbudu',
  'نَعۡبُدُ': 'naʿbudu',
  'وَإِيَّاكَ': 'wa iyyāka',
  'نَسْتَعِينُ': 'nastaʿīn',
  'نَسۡتَعِينُ': 'nastaʿīn',
  'ٱهْدِنَا': 'Ihdinā',
  'ٱهۡدِنَا': 'Ihdinā',
  'ٱلصِّرَٰطَ': 'ṣ-ṣirāṭa',
  'ٱلْمُسْتَقِيمَ': 'l-mustaqīm',
  'ٱلۡمُسۡتَقِيمَ': 'l-mustaqīm',
  'صِرَٰطَ': 'Ṣirāṭa',
  'ٱلَّذِينَ': 'lladhīna',
  'أَنْعَمْتَ': 'anʿamta',
  'أَنۡعَمۡتَ': 'anʿamta',
  'عَلَيْهِمْ': 'ʿalayhim',
  'عَلَيۡهِمۡ': 'ʿalayhim',
  'غَيْرِ': 'ghayri',
  'غَيۡرِ': 'ghayri',
  'ٱلْمَغْضُوبِ': 'l-maghḍūbi',
  'ٱلۡمَغۡضُوبِ': 'l-maghḍūbi',
  'وَلَا': 'wa lā',
  'ٱلضَّآلِّينَ': 'ḍ-ḍāllīn',
  
  // Common words
  'ٱللَّهُ': 'Allāhu',
  'ٱللَّهَ': 'Allāha',
  // Note: اللَّهِ is in Basmala section as 'llāhi' for in-phrase use
  'اللَّهُ': 'Allāhu',
  'الله': 'Allāh',
  'رَسُولُ': 'Rasūlu',
  'مُحَمَّدٌ': 'Muḥammad',
  'إِسْلَٰمِ': 'Islām',
  'قُرْآن': 'Qurʾān',
  'قُرْآنَ': 'Qurʾāna',
  'ٱلْقُرْآنَ': 'l-Qurʾāna',
  'سُبْحَٰنَ': 'Subḥāna',
  
  // Al-Ikhlas words
  'قُلْ': 'Qul',
  'هُوَ': 'Huwa',
  'أَحَدٌ': 'Aḥad',
  'ٱلصَّمَدُ': 'ṣ-Ṣamad',
  'لَمْ': 'Lam',
  'يَلِدْ': 'yalid',
  'وَلَمْ': 'wa lam',
  'يُولَدْ': 'yūlad',
  'يَكُن': 'yakul',
  'لَّهُۥ': 'lahū',
  'كُفُوًا': 'kufuwan',
  'أَحَدٌۢ': 'aḥad',
  
  // Additional common words
  'وَ': 'Wa',
  'فِي': 'fī',
  'مِنْ': 'min',
  'عَلَىٰ': 'ʿalā',
  'إِلَىٰ': 'ilā',
  'عَنْ': 'ʿan',
  'مَعَ': 'maʿa',
  'هُمْ': 'hum',
  'هِيَ': 'hiya',
  'أَنْ': 'an',
  'إِنَّ': 'inna',
  'كَانَ': 'kāna',
  'لَا': 'lā',
  'مَا': 'mā',
  'ذَٰلِكَ': 'dhālika',
  'هَٰذَا': 'hādhā',
  'ٱلَّذِي': 'lladhī',
  'ٱلَّتِي': 'llatī',
  'كُلُّ': 'kullu',
  'بَعْدَ': 'baʿda',
  'قَبْلَ': 'qabla',
  'ثُمَّ': 'thumma',
  'أَوْ': 'aw',
  'حَتَّىٰ': 'ḥattā',
  'إِذَا': 'idhā',
  'إِذْ': 'idh',
  'لَوْ': 'law',
  'كَيْفَ': 'kayfa',
  'أَيْنَ': 'ayna',
  'لِمَاذَا': 'limādhā',
};

// ============================================================================
// SIMPLE TEXT MAPPINGS - For romanized input conversion
// ============================================================================

const SIMPLE_PHRASE_MAP: { [key: string]: string } = {
  'bismillahir rahmanir raheem': 'Bismillāhir-Raḥmānir-Raḥīm',
  'bismillahir-rahmanir-raheem': 'Bismillāhir-Raḥmānir-Raḥīm',
  'alhamdu lillahi rabbil aalameen': 'Alḥamdu lillāhi Rabbil-ʿĀlamīn',
  'ar-rahmanir-raheem': 'Ar-Raḥmānir-Raḥīm',
  'maliki yawmid deen': 'Māliki Yawmid-Dīn',
  "iyyaka na'budu wa iyyaka nasta'een": 'Iyyāka Naʿbudu wa iyyāka Nastaʿīn',
  'ihdinas siratal mustaqeem': 'Ihdinā Ṣirāṭal-Mustaqīm',
  "siratal ladhina an'amta alaihim ghairil maghdubi alaihim walad dallin": 'Ṣirāṭal-ladhīna Anʿamta ʿalayhim Ghayril-maghḍūbi ʿalayhim wa laḍ-Ḍāllīn',
  'sallallahu alayhi wasallam': 'Ṣallallāhu ʿalayhi wa sallam',
  'la ilaha illallah': 'Lā ilāha illallāh',
  'subhanallah': 'Subḥānallāh',
  'alhamdulillah': 'Alḥamdu lillāh',
  'allahu akbar': 'Allāhu Akbar',
  'astaghfirullah': 'Astaghfirullāh',
};

const SIMPLE_WORD_MAP: { [key: string]: string } = {
  'allah': 'Allāh',
  'allahu': 'Allāhu',
  'bismillah': 'Bismillāh',
  'alhamdulillah': 'Alḥamdu lillāh',
  'subhanallah': 'Subḥānallāh',
  'muhammad': 'Muḥammad',
  'rasulullah': 'Rasūlullāh',
  'astaghfirullah': 'Astaghfirullāh',
  'quran': 'Qurʾān',
  'hadith': 'Ḥadīth',
  'dhikr': 'Dhikr',
  'salah': 'Ṣalāh',
  'zakah': 'Zakāh',
  'ramadan': 'Ramaḍān',
  'kareem': 'Karīm',
  'akbar': 'Akbar',
  'rabbi': 'Rabbi',
  'amin': 'Āmīn',
  'ameen': 'Āmīn',
  'inshallah': 'In shāʾ Allāh',
  'inshaallah': 'In shāʾ Allāh',
  'mashallah': 'Mā shāʾ Allāh',
  'jazakallah': 'Jazākallāh',
};

// ============================================================================
// ARABIC CHARACTER TO ACADEMIC RUMI MAPPING
// ============================================================================

const ARABIC_LETTER_MAP: { [key: string]: string } = {
  // Consonants
  'ء': 'ʾ',      // Hamza
  'ا': '',       // Alif (carrier, handled with vowels)
  'أ': 'ʾa',     // Alif with hamza above
  'إ': 'ʾi',     // Alif with hamza below
  'آ': 'ʾā',     // Alif madda
  'ٱ': '',       // Alif wasla (silent, connects to previous)
  'ب': 'b',
  'ت': 't',
  'ث': 'th',     // Academic: th
  'ج': 'j',
  'ح': 'ḥ',      // Ha with dot below
  'خ': 'kh',
  'د': 'd',
  'ذ': 'dh',     // Academic: dh
  'ر': 'r',
  'ز': 'z',
  'س': 's',
  'ش': 'sh',     // Academic: sh
  'ص': 'ṣ',      // Sad with dot below
  'ض': 'ḍ',      // Dad with dot below
  'ط': 'ṭ',      // Ta with dot below
  'ظ': 'ẓ',      // Dha with dot below
  'ع': 'ʿ',      // Ayn
  'غ': 'gh',
  'ف': 'f',
  'ق': 'q',
  'ك': 'k',
  'ل': 'l',
  'م': 'm',
  'ن': 'n',
  'ه': 'h',
  'ة': 'h',      // Ta marbuta
  'و': 'w',      // Waw (consonant)
  'ي': 'y',      // Ya (consonant)
  'ى': 'ā',      // Alif maqsura
  
  // Short vowels (harakat)
  'َ': 'a',      // Fatha
  'ِ': 'i',      // Kasra
  'ُ': 'u',      // Damma
  
  // Tanwin
  'ً': 'an',     // Fathatan
  'ٍ': 'in',     // Kasratan
  'ٌ': 'un',     // Dammatan
  
  // Sukun (silent)
  'ْ': '',       // Sukun
  'ۡ': '',       // Small high sukun (Uthmani)
  
  // Shaddah handled separately
  'ّ': '',       // Shaddah marker
  
  // Long vowels
  'ٰ': 'ā',      // Superscript alif
  'ـٰ': 'ā',     // Superscript alif with tatweel
  'ۥ': '',       // Small waw (silent)
  'ۦ': '',       // Small ya (silent)
};

// ============================================================================
// ARABIC CHARACTER TO JAKIM/KDN RUMI MAPPING (Malaysian Standard)
// ============================================================================

const JAKIM_LETTER_MAP: { [key: string]: string } = {
  // Consonants - JAKIM/KDN Standard
  'ء': "'",      // Hamza
  'ا': '',       // Alif (carrier)
  'أ': "'a",     // Alif with hamza above
  'إ': "'i",     // Alif with hamza below
  'آ': "'a",     // Alif madda
  'ٱ': '',       // Alif wasla
  'ب': 'b',
  'ت': 't',
  'ث': 'th',     // JAKIM: th (or 'sa' in some standards)
  'ج': 'j',
  'ح': 'h',      // JAKIM: h (simplified, no dot)
  'خ': 'kh',
  'د': 'd',
  'ذ': 'z',      // JAKIM: z (simplified)
  'ر': 'r',
  'ز': 'z',
  'س': 's',
  'ش': 'sy',     // JAKIM: sy (not 'sh')
  'ص': 's',      // JAKIM: s (simplified)
  'ض': 'd',      // JAKIM: d (simplified)
  'ط': 't',      // JAKIM: t (simplified)
  'ظ': 'z',      // JAKIM: z (simplified)
  'ع': "'",      // Ayn
  'غ': 'gh',
  'ف': 'f',
  'ق': 'q',
  'ك': 'k',
  'ل': 'l',
  'م': 'm',
  'ن': 'n',
  'ه': 'h',
  'ة': 'h',      // Ta marbuta
  'و': 'w',
  'ي': 'y',
  'ى': 'a',      // Alif maqsura
  
  // Short vowels
  'َ': 'a',      // Fatha
  'ِ': 'i',      // Kasra
  'ُ': 'u',      // Damma
  
  // Tanwin
  'ً': 'an',     // Fathatan
  'ٍ': 'in',     // Kasratan
  'ٌ': 'un',     // Dammatan
  
  // Sukun
  'ْ': '',
  'ۡ': '',
  
  // Shaddah
  'ّ': '',
  
  // Long vowels - JAKIM uses double letters
  'ٰ': 'a',      // Superscript alif
  'ـٰ': 'a',
  'ۥ': '',
  'ۦ': '',
};

// Regex patterns
const DIACRITIC_REGEX = /[āīūḥṣḍṭẓʿʾĀĪŪḤṢḌṬẒ]/;
const STATS_REGEX = {
  longVowels: /[āīūĀĪŪ]/g,
  emphatics: /[ṣḍṭẓṢḌṬẒ]/g,
  gutturals: /[ḥʿḤ]/g,
  hamza: /[ʾ]/g,
};

// ============================================================================
// CORE TRANSLITERATION FUNCTIONS
// ============================================================================

/**
 * Transliterates Arabic Quranic text to academic Rumi format.
 * @param arabic The Arabic text to transliterate.
 * @returns Clean academic Rumi transliteration (no Arabic characters).
 */
export const formatTransliteration = (arabic: string): string => {
  if (!arabic || arabic.trim() === '') return '';
  
  const cleaned = arabic.trim();
  
  // 1. Check full verse patterns first (highest accuracy)
  for (const { pattern, output } of FULL_VERSE_PATTERNS) {
    if (pattern.test(cleaned)) {
      return output;
    }
  }
  
  // 2. Check word map for exact matches (try both original and normalized)
  if (ARABIC_WORD_MAP[cleaned]) {
    return ARABIC_WORD_MAP[cleaned];
  }
  const normalizedCleaned = normalizeArabic(cleaned);
  if (ARABIC_WORD_MAP[normalizedCleaned]) {
    return ARABIC_WORD_MAP[normalizedCleaned];
  }
  
  // 3. Split into words and transliterate each
  const words = cleaned.split(/\s+/);
  const transliteratedWords: string[] = [];
  
  for (const word of words) {
    // Try original word first
    if (ARABIC_WORD_MAP[word]) {
      transliteratedWords.push(ARABIC_WORD_MAP[word]);
    } else {
      // Try normalized word
      const normalizedWord = normalizeArabic(word);
      if (ARABIC_WORD_MAP[normalizedWord]) {
        transliteratedWords.push(ARABIC_WORD_MAP[normalizedWord]);
      } else {
        transliteratedWords.push(transliterateWord(word));
      }
    }
  }
  
  return transliteratedWords.join(' ').replace(/\s+/g, ' ').trim();
};

/**
 * Transliterates a single Arabic word to academic Rumi.
 */
function transliterateWord(word: string): string {
  let result = '';
  const chars = [...word]; // Handle Unicode properly
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = chars[i + 1] || '';
    const prevChar = chars[i - 1] || '';
    
    // Skip diacritical marks we've already processed
    if (/[\u0610-\u061A\u06D6-\u06ED]/.test(char)) {
      continue;
    }
    
    // Handle shaddah (doubling)
    if (char === 'ّ') {
      // Double the previous consonant
      const lastConsonant = getLastConsonant(result);
      if (lastConsonant) {
        result += lastConsonant;
      }
      continue;
    }
    
    // Handle waw as long vowel (ū) when followed by sukun
    if (char === 'و' && (nextChar === 'ْ' || nextChar === 'ۡ')) {
      result += 'ū';
      i++; // Skip sukun
      continue;
    }
    
    // Handle waw as long vowel after damma
    if (char === 'و' && prevChar === 'ُ') {
      result += 'ū';
      continue;
    }
    
    // Handle ya as long vowel (ī) when followed by sukun
    if (char === 'ي' && (nextChar === 'ْ' || nextChar === 'ۡ')) {
      result += 'ī';
      i++; // Skip sukun
      continue;
    }
    
    // Handle ya as long vowel after kasra
    if (char === 'ي' && prevChar === 'ِ') {
      result += 'ī';
      continue;
    }
    
    // Handle alif as long vowel (ā) after fatha
    if ((char === 'ا' || char === 'ٰ') && prevChar === 'َ') {
      result += 'ā';
      continue;
    }
    
    // Standard character mapping
    if (ARABIC_LETTER_MAP[char] !== undefined) {
      result += ARABIC_LETTER_MAP[char];
    } else if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(char)) {
      // Unknown Arabic character - skip to prevent leakage
      continue;
    } else {
      // Non-Arabic character (space, punctuation, etc.)
      result += char;
    }
  }
  
  // Clean up result - IMPORTANT: fix common issues
  result = result
    .replace(/ʾʾ/g, 'ʾ')      // Remove double hamza
    .replace(/ʿʿ/g, 'ʿ')      // Remove double ayn
    .replace(/lll/g, 'll')     // Fix triple lam (common in Allah words)
    .replace(/rrr/g, 'rr')     // Fix triple ra
    .replace(/aāā/g, 'ā')      // Fix triple vowel patterns
    .replace(/aā/g, 'ā')       // Fix double vowel aa -> ā
    .replace(/iī/g, 'ī')       // Fix double vowel ii -> ī  
    .replace(/uū/g, 'ū')       // Fix double vowel uu -> ū
    .replace(/ḥḥ/g, 'ḥḥ')      // Keep double emphatics
    .replace(/\s+/g, ' ')      // Normalize spaces
    .trim();
  
  return result;
}

/**
 * Gets the last consonant from a transliterated string.
 */
function getLastConsonant(text: string): string {
  const consonants = 'bcdfghjklmnpqrstvwxyzʾʿḥṣḍṭẓ';
  for (let i = text.length - 1; i >= 0; i--) {
    if (consonants.includes(text[i].toLowerCase())) {
      return text[i];
    }
  }
  return '';
}

/**
 * Converts simple romanized text to academic transliteration.
 * @param simpleText The input string without diacritics.
 * @returns The converted string with proper diacritics.
 */
export const convertToAcademicTransliteration = (simpleText: string): string => {
  if (!simpleText) return '';
  
  const lowerText = simpleText.toLowerCase().trim();
  
  // 1. Check for full phrase match
  if (SIMPLE_PHRASE_MAP[lowerText]) {
    return SIMPLE_PHRASE_MAP[lowerText];
  }
  
  // 2. Process word by word
  const words = simpleText.split(/(\s+)/); // Keep spaces
  const convertedWords = words.map(word => {
    const cleanWord = word.trim();
    if (cleanWord === '') return word;
    
    const mappedWord = SIMPLE_WORD_MAP[cleanWord.toLowerCase()];
    
    if (mappedWord) {
      // Preserve original capitalization
      if (cleanWord.charAt(0) === cleanWord.charAt(0).toUpperCase()) {
        return mappedWord.charAt(0).toUpperCase() + mappedWord.slice(1);
      }
      return mappedWord;
    }
    
    return word;
  });
  
  return convertedWords.join('');
};

/**
 * Checks if text contains academic diacritical marks.
 */
export const hasProperDiacritics = (text: string): boolean => {
  return DIACRITIC_REGEX.test(text);
};

/**
 * Gets statistics on diacritic usage in text.
 */
export const getTransliterationStats = (text: string): { [key: string]: number } => {
  const stats: { [key: string]: number } = {};
  for (const key in STATS_REGEX) {
    stats[key] = (text.match(STATS_REGEX[key as keyof typeof STATS_REGEX]) || []).length;
  }
  return stats;
};

/**
 * Example transliterations for testing.
 */
export const TRANSLITERATION_EXAMPLES = [
  { simple: "Quran", academic: "Qurʾān" },
  { simple: "Hadith", academic: "Ḥadīth" },
  { simple: "Dhikr", academic: "Dhikr" },
  { simple: "Salah", academic: "Ṣalāh" },
  { simple: "Zakah", academic: "Zakāh" },
];

// ============================================================================
// TTS-COMPATIBLE FUNCTIONS
// ============================================================================

/**
 * Transliterates Arabic to Rumi for TTS pronunciation.
 * Uses academic format but TTS engines handle diacritics.
 */
export const transliteratePronunciation = (arabic: string): string => {
  return formatTransliteration(arabic);
};

/**
 * Syllabifies Rumi text for pronunciation guidance.
 */
export const syllabifyPronunciation = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/([aāiīuū])([bcdfghjklmnpqrstvwxyzʾʿḥṣḍṭẓ])/gi, '$1-$2')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
};

// ============================================================================
// 99% ACCURACY MODE - High precision with Tajwid markers
// ============================================================================

interface Transliterate99Result {
  text: string;
  tajwid: string[];
  notes: string[];
}

const TAJWID_PATTERNS: Array<{ pattern: RegExp; name: string; color: string }> = [
  { pattern: /نّ|مّ/, name: 'Ghunnah', color: '#22c55e' },
  { pattern: /ن[ْۡ]?\s*[يرملون]/, name: 'Idgham', color: '#3b82f6' },
  { pattern: /ن[ْۡ]?\s*ب/, name: 'Iqlab', color: '#a855f7' },
  { pattern: /ن[ْۡ]?\s*[تثجدذزسشصضطظفقك]/, name: 'Ikhfa', color: '#f59e0b' },
  { pattern: /ق[ْۡ]|ط[ْۡ]|ب[ْۡ]|ج[ْۡ]|د[ْۡ]/, name: 'Qalqalah', color: '#ef4444' },
  { pattern: /ـٰ|آ|وْ|يْ/, name: 'Madd', color: '#ec4899' },
];

/**
 * High-precision transliteration with Tajwid markers.
 */
export const transliterate99 = (arabic: string): Transliterate99Result => {
  if (!arabic) {
    return { text: '', tajwid: [], notes: [] };
  }
  
  // Use formatTransliteration for the text
  const text = formatTransliteration(arabic);
  
  // Detect Tajwid rules
  const detectedTajwid: string[] = [];
  for (const { pattern, name } of TAJWID_PATTERNS) {
    if (pattern.test(arabic) && !detectedTajwid.includes(name)) {
      detectedTajwid.push(name);
    }
  }
  
  // Generate pronunciation notes
  const pronunciationNotes: string[] = [];
  if (detectedTajwid.includes('Ghunnah')) {
    pronunciationNotes.push('Dengung pada huruf nun/mim bertasydid');
  }
  if (detectedTajwid.includes('Idgham')) {
    pronunciationNotes.push('Masukkan nun mati ke huruf selepasnya');
  }
  if (detectedTajwid.includes('Qalqalah')) {
    pronunciationNotes.push('Pantulan pada huruf qalqalah');
  }
  if (detectedTajwid.includes('Madd')) {
    pronunciationNotes.push('Panjangkan bacaan mad');
  }
  
  return {
    text,
    tajwid: detectedTajwid,
    notes: pronunciationNotes,
  };
};

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

export const transliterate = formatTransliteration;

// ============================================================================
// JAKIM/KDN PHRASE MAPPINGS (Malaysian Standard)
// ============================================================================

const JAKIM_VERSE_PATTERNS: { pattern: RegExp; output: string }[] = [
  // Basmala
  { 
    pattern: /بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ/,
    output: 'Bismillahir-Rahmanir-Rahim'
  },
  { 
    pattern: /بِسۡمِ\s*ٱللَّهِ\s*ٱلرَّحۡمَٰنِ\s*ٱلرَّحِيمِ/,
    output: 'Bismillahir-Rahmanir-Rahim'
  },
  // Al-Fatihah ayat 2
  {
    pattern: /ٱلْحَمْدُ\s*لِلَّهِ\s*رَبِّ\s*ٱلْعَٰلَمِينَ/,
    output: 'Alhamdulillahi Rabbil-Alamin'
  },
  {
    pattern: /ٱلۡحَمۡدُ\s*لِلَّهِ\s*رَبِّ\s*ٱلۡعَٰلَمِينَ/,
    output: 'Alhamdulillahi Rabbil-Alamin'
  },
  // Al-Fatihah ayat 3
  {
    pattern: /ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ/,
    output: 'Ar-Rahmanir-Rahim'
  },
  {
    pattern: /ٱلرَّحۡمَٰنِ\s*ٱلرَّحِيمِ/,
    output: 'Ar-Rahmanir-Rahim'
  },
  // Al-Fatihah ayat 4
  {
    pattern: /مَٰلِكِ\s*يَوْمِ\s*ٱلدِّينِ/,
    output: 'Maliki Yawmid-Din'
  },
  {
    pattern: /مَٰلِكِ\s*يَوۡمِ\s*ٱلدِّينِ/,
    output: 'Maliki Yawmid-Din'
  },
  // Al-Fatihah ayat 5
  {
    pattern: /إِيَّاكَ\s*نَعْبُدُ\s*وَإِيَّاكَ\s*نَسْتَعِينُ/,
    output: "Iyyaka na'budu wa iyyaka nasta'in"
  },
  {
    pattern: /إِيَّاكَ\s*نَعۡبُدُ\s*وَإِيَّاكَ\s*نَسۡتَعِينُ/,
    output: "Iyyaka na'budu wa iyyaka nasta'in"
  },
  // Al-Fatihah ayat 6
  {
    pattern: /ٱهْدِنَا\s*ٱلصِّرَٰطَ\s*ٱلْمُسْتَقِيمَ/,
    output: 'Ihdinas-siratal-mustaqim'
  },
  {
    pattern: /ٱهۡدِنَا\s*ٱلصِّرَٰطَ\s*ٱلۡمُسۡتَقِيمَ/,
    output: 'Ihdinas-siratal-mustaqim'
  },
  // Al-Ikhlas
  {
    pattern: /قُلْ\s*هُوَ\s*ٱللَّهُ\s*أَحَدٌ/,
    output: 'Qul huwallahu ahad'
  },
  {
    pattern: /ٱللَّهُ\s*ٱلصَّمَدُ/,
    output: 'Allahus-samad'
  },
  {
    pattern: /لَمْ\s*يَلِدْ\s*وَلَمْ\s*يُولَدْ/,
    output: 'Lam yalid wa lam yulad'
  },
  {
    pattern: /وَلَمْ\s*يَكُن\s*لَّهُۥ\s*كُفُوًا\s*أَحَدٌۢ/,
    output: 'Wa lam yakul-lahu kufuwan ahad'
  },
];

const JAKIM_WORD_MAP: { [key: string]: string } = {
  // Basmala words
  'بِسْمِ': 'Bismi',
  'بِسۡمِ': 'Bismi',
  'ٱللَّهِ': 'llahi',
  'ٱلرَّحْمَٰنِ': 'r-Rahmani',
  'ٱلرَّحۡمَٰنِ': 'r-Rahmani',
  'ٱلرَّحِيمِ': 'r-Rahim',
  
  // Al-Fatihah words
  'ٱلْحَمْدُ': 'Alhamdu',
  'ٱلۡحَمۡدُ': 'Alhamdu',
  'لِلَّهِ': 'lillahi',
  'رَبِّ': 'Rabbi',
  'ٱلْعَٰلَمِينَ': 'l-Alamin',
  'ٱلۡعَٰلَمِينَ': 'l-Alamin',
  'مَٰلِكِ': 'Maliki',
  'يَوْمِ': 'Yawmi',
  'يَوۡمِ': 'Yawmi',
  'ٱلدِّينِ': 'd-Din',
  'إِيَّاكَ': 'Iyyaka',
  'نَعْبُدُ': "na'budu",
  'نَعۡبُدُ': "na'budu",
  'وَإِيَّاكَ': 'wa iyyaka',
  'نَسْتَعِينُ': "nasta'in",
  'نَسۡتَعِينُ': "nasta'in",
  'ٱهْدِنَا': 'Ihdina',
  'ٱهۡدِنَا': 'Ihdina',
  'ٱلصِّرَٰطَ': 's-sirata',
  'ٱلْمُسْتَقِيمَ': 'l-mustaqim',
  'ٱلۡمُسۡتَقِيمَ': 'l-mustaqim',
  'صِرَٰطَ': 'Sirata',
  'ٱلَّذِينَ': 'llazina',
  'أَنْعَمْتَ': "an'amta",
  'أَنۡعَمۡتَ': "an'amta",
  'عَلَيْهِمْ': "'alayhim",
  'عَلَيۡهِمۡ': "'alayhim",
  'غَيْرِ': 'ghayri',
  'غَيۡرِ': 'ghayri',
  'ٱلْمَغْضُوبِ': 'l-maghdubi',
  'ٱلۡمَغۡضُوبِ': 'l-maghdubi',
  'وَلَا': 'wa la',
  'ٱلضَّآلِّينَ': 'd-dallin',
  
  // Common words
  'ٱللَّهُ': 'Allahu',
  'ٱللَّهَ': 'Allaha',
  'اللَّهِ': 'Allahi',
  'اللَّهُ': 'Allahu',
  'الله': 'Allah',
  'رَسُولُ': 'Rasulu',
  'مُحَمَّدٌ': 'Muhammad',
  
  // Al-Ikhlas words
  'قُلْ': 'Qul',
  'هُوَ': 'Huwa',
  'أَحَدٌ': 'Ahad',
  'ٱلصَّمَدُ': 's-Samad',
  'لَمْ': 'Lam',
  'يَلِدْ': 'yalid',
  'وَلَمْ': 'wa lam',
  'يُولَدْ': 'yulad',
  'يَكُن': 'yakul',
  'لَّهُۥ': 'lahu',
  'كُفُوًا': 'kufuwan',
  'أَحَدٌۢ': 'ahad',
};

// ============================================================================
// JAKIM TRANSLITERATION FUNCTION
// ============================================================================

/**
 * Transliterates a single Arabic word to JAKIM/KDN Rumi (Malaysian Standard).
 */
function transliterateWordJAKIM(word: string): string {
  let result = '';
  const chars = [...word];
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = chars[i + 1] || '';
    const prevChar = chars[i - 1] || '';
    
    // Skip diacritical marks we've already processed
    if (/[\u0610-\u061A\u06D6-\u06ED]/.test(char)) {
      continue;
    }
    
    // Handle shaddah (doubling)
    if (char === 'ّ') {
      const lastConsonant = getLastConsonantJAKIM(result);
      if (lastConsonant) {
        result += lastConsonant;
      }
      continue;
    }
    
    // Handle waw as long vowel (u) when followed by sukun
    if (char === 'و' && (nextChar === 'ْ' || nextChar === 'ۡ')) {
      result += 'u';
      i++;
      continue;
    }
    
    // Handle waw as long vowel after damma
    if (char === 'و' && prevChar === 'ُ') {
      result += 'u';
      continue;
    }
    
    // Handle ya as long vowel (i) when followed by sukun
    if (char === 'ي' && (nextChar === 'ْ' || nextChar === 'ۡ')) {
      result += 'i';
      i++;
      continue;
    }
    
    // Handle ya as long vowel after kasra
    if (char === 'ي' && prevChar === 'ِ') {
      result += 'i';
      continue;
    }
    
    // Handle alif as long vowel (a) after fatha
    if ((char === 'ا' || char === 'ٰ') && prevChar === 'َ') {
      result += 'a';
      continue;
    }
    
    // Standard character mapping
    if (JAKIM_LETTER_MAP[char] !== undefined) {
      result += JAKIM_LETTER_MAP[char];
    } else if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(char)) {
      // Unknown Arabic character - skip to prevent leakage
      continue;
    } else {
      result += char;
    }
  }
  
  // Clean up result - IMPORTANT: fix common issues
  result = result
    .replace(/''/g, "'")       // Remove double apostrophe
    .replace(/lll/g, 'll')     // Fix triple lam (common in Allah words)
    .replace(/rrr/g, 'rr')     // Fix triple ra
    .replace(/aaa/g, 'aa')     // Fix triple vowel
    .replace(/iii/g, 'ii')     // Fix triple vowel
    .replace(/uuu/g, 'uu')     // Fix triple vowel  
    .replace(/\s+/g, ' ')      // Normalize spaces
    .trim();
  
  return result;
}

function getLastConsonantJAKIM(text: string): string {
  const consonants = "bcdfghjklmnpqrstvwxyz'";
  for (let i = text.length - 1; i >= 0; i--) {
    if (consonants.includes(text[i].toLowerCase())) {
      return text[i];
    }
  }
  return '';
}

/**
 * Transliterates Arabic Quranic text to JAKIM/KDN Rumi format (Malaysian Standard).
 * @param arabic The Arabic text to transliterate.
 * @returns Clean JAKIM Rumi transliteration (no Arabic characters, no special diacritics).
 */
export const formatTransliterationJAKIM = (arabic: string): string => {
  if (!arabic || arabic.trim() === '') return '';
  
  const cleaned = arabic.trim();
  
  // 1. Check full verse patterns first (highest accuracy)
  for (const { pattern, output } of JAKIM_VERSE_PATTERNS) {
    if (pattern.test(cleaned)) {
      return output;
    }
  }
  
  // 2. Check word map for exact matches (try both original and normalized)
  if (JAKIM_WORD_MAP[cleaned]) {
    return JAKIM_WORD_MAP[cleaned];
  }
  const normalizedCleaned = normalizeArabic(cleaned);
  if (JAKIM_WORD_MAP[normalizedCleaned]) {
    return JAKIM_WORD_MAP[normalizedCleaned];
  }
  
  // 3. Split into words and transliterate each
  const words = cleaned.split(/\s+/);
  const transliteratedWords: string[] = [];
  
  for (const word of words) {
    // Try original word first
    if (JAKIM_WORD_MAP[word]) {
      transliteratedWords.push(JAKIM_WORD_MAP[word]);
    } else {
      // Try normalized word
      const normalizedWord = normalizeArabic(word);
      if (JAKIM_WORD_MAP[normalizedWord]) {
        transliteratedWords.push(JAKIM_WORD_MAP[normalizedWord]);
      } else {
        transliteratedWords.push(transliterateWordJAKIM(word));
      }
    }
  }
  
  return transliteratedWords.join(' ').replace(/\s+/g, ' ').trim();
};

// ============================================================================
// DUAL TRANSLITERATION - Returns both Academic and JAKIM
// ============================================================================

interface DualTransliterationResult {
  academic: string;
  jakim: string;
}

/**
 * Returns both Academic and JAKIM transliterations for comparison.
 * @param arabic The Arabic text to transliterate.
 * @returns Object with both academic and jakim transliterations.
 */
export const getDualTransliteration = (arabic: string): DualTransliterationResult => {
  return {
    academic: formatTransliteration(arabic),
    jakim: formatTransliterationJAKIM(arabic),
  };
};

// Export JAKIM transliteration as alternative
export const transliterateJAKIM = formatTransliterationJAKIM;

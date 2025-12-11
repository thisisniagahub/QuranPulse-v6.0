/**
 * Tajwid Rumi Hints Utility
 * Detects tajwid rules in Arabic text and provides color coding for Rumi display
 */

// Tajwid rule types
export type TajwidRule = 
  | 'izhar'      // Clear pronunciation (green)
  | 'idgham'     // Merging (blue)
  | 'iqlab'      // Conversion (purple)
  | 'ikhfa'      // Hiding (yellow)
  | 'ghunnah'    // Nasal sound (cyan)
  | 'qalqalah'   // Echo (orange)
  | 'madd'       // Lengthening (pink)
  | 'normal';    // No special rule

export interface TajwidHint {
  rule: TajwidRule;
  color: string;
  bgColor: string;
  label: string;
  labelMs: string;
}

// Tajwid color scheme
export const TAJWID_COLORS: Record<TajwidRule, TajwidHint> = {
  izhar: { rule: 'izhar', color: '#10b981', bgColor: '#10b98120', label: 'Izhar', labelMs: 'Jelas' },
  idgham: { rule: 'idgham', color: '#3b82f6', bgColor: '#3b82f620', label: 'Idgham', labelMs: 'Sebati' },
  iqlab: { rule: 'iqlab', color: '#a855f7', bgColor: '#a855f720', label: 'Iqlab', labelMs: 'Tukar' },
  ikhfa: { rule: 'ikhfa', color: '#eab308', bgColor: '#eab30820', label: 'Ikhfa', labelMs: 'Tersembunyi' },
  ghunnah: { rule: 'ghunnah', color: '#06b6d4', bgColor: '#06b6d420', label: 'Ghunnah', labelMs: 'Dengung' },
  qalqalah: { rule: 'qalqalah', color: '#f97316', bgColor: '#f9731620', label: 'Qalqalah', labelMs: 'Pantulan' },
  madd: { rule: 'madd', color: '#ec4899', bgColor: '#ec489920', label: 'Madd', labelMs: 'Panjang' },
  normal: { rule: 'normal', color: '#10b981', bgColor: 'transparent', label: '', labelMs: '' },
};

// Huruf for tajwid rules
const HURUF_HALQI = ['ء', 'ه', 'ع', 'ح', 'غ', 'خ']; // Izhar Halqi
const HURUF_IDGHAM_WITH_GHUNNAH = ['ي', 'ن', 'م', 'و']; // يَنْمُو
const HURUF_IDGHAM_WITHOUT_GHUNNAH = ['ل', 'ر'];
const HURUF_IKHFA = ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'];
const HURUF_QALQALAH = ['ق', 'ط', 'ب', 'ج', 'د']; // قطب جد

// Detect Nun Sakinah / Tanwin rule
export const detectNunSakinahRule = (currentWord: string, nextWord: string): TajwidRule => {
  // Check if current word ends with Nun Sakinah or Tanwin
  const hasNunSakinah = /[نْ]$|[ًٌٍ]$/.test(currentWord);
  if (!hasNunSakinah || !nextWord) return 'normal';
  
  // Get first letter of next word
  const nextFirstChar = nextWord.replace(/[ًٌٍَُِّْٰۡۢ]/g, '')[0];
  
  // Check rules in order
  if (HURUF_HALQI.includes(nextFirstChar)) return 'izhar';
  if (nextFirstChar === 'ب') return 'iqlab'; // Nun → Mim before Ba
  if (HURUF_IDGHAM_WITH_GHUNNAH.includes(nextFirstChar)) return 'idgham';
  if (HURUF_IDGHAM_WITHOUT_GHUNNAH.includes(nextFirstChar)) return 'idgham';
  if (HURUF_IKHFA.includes(nextFirstChar)) return 'ikhfa';
  
  return 'normal';
};

// Detect Qalqalah
export const detectQalqalah = (word: string): boolean => {
  // Qalqalah occurs when qalqalah letter has sukun or at end of word (waqf)
  for (const letter of HURUF_QALQALAH) {
    if (word.includes(letter + 'ْ')) return true; // Letter + sukun
    // Check if word ends with qalqalah letter (simplified)
    const stripped = word.replace(/[ًٌٍَُِّْٰۡۢ]/g, '');
    if (stripped.endsWith(letter)) return true;
  }
  return false;
};

// Detect Madd (lengthening)
export const detectMadd = (word: string): boolean => {
  // Madd patterns: اَ followed by ا, ِي, ُو
  return /[اَ]ا|ِي|ُو|ٰ/.test(word);
};

// Get tajwid hint for a word pair
export const getTajwidHint = (currentWord: string, nextWord: string = ''): TajwidHint => {
  // Check Nun Sakinah rules first
  const nunRule = detectNunSakinahRule(currentWord, nextWord);
  if (nunRule !== 'normal') return TAJWID_COLORS[nunRule];
  
  // Check Qalqalah
  if (detectQalqalah(currentWord)) return TAJWID_COLORS.qalqalah;
  
  // Check Madd
  if (detectMadd(currentWord)) return TAJWID_COLORS.madd;
  
  return TAJWID_COLORS.normal;
};

// Get tajwid hints for an array of Arabic words
export const getTajwidHints = (arabicWords: string[]): TajwidHint[] => {
  return arabicWords.map((word, i) => {
    const nextWord = arabicWords[i + 1] || '';
    return getTajwidHint(word, nextWord);
  });
};

export default { getTajwidHint, getTajwidHints, TAJWID_COLORS };

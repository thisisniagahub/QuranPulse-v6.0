// Huruf Knowledge Base for Iqra Interactive Tools

export interface LetterInfo {
    symbol: string;
    name: string;
    transliteration: string;
    makhraj: string; // Tempat keluar huruf
    sifat: string[]; // Ciri-ciri bunyi
    desc: string;
}

export const LETTER_DATA: Record<string, LetterInfo> = {
    'ا': {
        symbol: 'ا', name: 'Alif', transliteration: 'A',
        makhraj: 'Al-Jauf (Rongga Mulut)',
        sifat: ['Jahru (Jelas)', 'Rakhawah (Lembut)'],
        desc: 'Keluar dari rongga mulut dan kerongkong. Bunyi panjang yang bersih.'
    },
    'أ': {
        symbol: 'أ', name: 'Hamzah', transliteration: 'A',
        makhraj: 'Aqsol Halqi (Pangkal Kerongkong)',
        sifat: ['Jahru', 'Syiddah (Kuat)'],
        desc: 'Bunyi tajam dari pangkal kerongkong, seperti terputus nafas.'
    },
    'ب': {
        symbol: 'ب', name: 'Ba', transliteration: 'B',
        makhraj: 'Asy-Syafatain (Dua Bibir)',
        sifat: ['Jahru', 'Qalqalah (Lantunan)'],
        desc: 'Rapatkan kedua bibir dengan kuat kemudian lepaskan dengan lantunan.'
    },
    'ت': {
        symbol: 'ت', name: 'Ta', transliteration: 'T',
        makhraj: 'Lidah & Gigi Seri Atas',
        sifat: ['Hams (Berangin)', 'Syiddah'],
        desc: 'Hujung lidah menyentuh pangkal gigi seri atas. Ada sedikit nafas keluar.'
    },
    'ث': {
        symbol: 'ث', name: 'Tsa', transliteration: 'Ts',
        makhraj: 'Hujung Lidah & Hujung Gigi',
        sifat: ['Hams', 'Rakhawah'],
        desc: 'Keluarkan sedikit hujung lidah di antara gigi atas dan bawah. Bunyi berdesir lembut.'
    },
    'ج': {
        symbol: 'ج', name: 'Jim', transliteration: 'J',
        makhraj: 'Wasthul Lisan (Tengah Lidah)',
        sifat: ['Jahru', 'Qalqalah'],
        desc: 'Tengah lidah naik ke langit-langit. Bunyi padu dan melantun.'
    },
    'ح': {
        symbol: 'ح', name: 'Ha', transliteration: 'H (Pedas)',
        makhraj: 'Wasthul Halqi (Tengah Kerongkong)',
        sifat: ['Hams', 'Rakhawah'],
        desc: 'Bunyi bersih dan pedas dari tengah kerongkong (macam makan cili).'
    },
    'خ': {
        symbol: 'خ', name: 'Kho', transliteration: 'Kh',
        makhraj: 'Adnal Halqi (Ujung Kerongkong)',
        sifat: ['Hams', 'Istila (Tebal)'],
        desc: 'Bunyi berdengkur atau seperti membuang kahak ringan.'
    },
    'د': {
        symbol: 'د', name: 'Dal', transliteration: 'D',
        makhraj: 'Lidah & Gigi Seri Atas',
        sifat: ['Jahru', 'Qalqalah'],
        desc: 'Hujung lidah ke pangkal gigi seri atas. Bunyi jelas dan melantun.'
    },
    'ذ': {
        symbol: 'ذ', name: 'Dzal', transliteration: 'Dz',
        makhraj: 'Hujung Lidah & Hujung Gigi',
        sifat: ['Jahru', 'Rakhawah'],
        desc: 'Sama seperti Tsa, tetapi suaranya lebih jelas dan tidak berangin kuat.'
    },
    'ر': {
        symbol: 'ر', name: 'Ro', transliteration: 'R',
        makhraj: 'Hujung Lidah',
        sifat: ['Inhiraf', 'Takrir (Bergetar)'],
        desc: 'Hujung lidah bergetar sedikit menyentuh gusi atas.'
    },
    'ز': {
        symbol: 'ز', name: 'Zai', transliteration: 'Z',
        makhraj: 'Hujung Lidah (Bawah)',
        sifat: ['Jahru', 'Sofir (Desir Kuat)'],
        desc: 'Bunyi berdesir kuat seperti lebah, lidah di belakang gigi bawah.'
    },
    'س': {
        symbol: 'س', name: 'Sin', transliteration: 'S',
        makhraj: 'Hujung Lidah (Bawah)',
        sifat: ['Hams', 'Sofir'],
        desc: 'Bunyi berdesir halus seperti ular, angin keluar bebas.'
    },
    'ش': {
        symbol: 'ش', name: 'Syin', transliteration: 'Sy',
        makhraj: 'Tengah Lidah',
        sifat: ['Hams', 'Tafasyi (Hambur Angin)'],
        desc: 'Angin berhamburan memenuhi mulut. Tengah lidah naik.'
    },
    'ص': {
        symbol: 'ص', name: 'Sod', transliteration: 'So',
        makhraj: 'Hujung Lidah (Bawah)',
        sifat: ['Istila', 'Sofir'],
        desc: 'Bunyi S yang tebal. Pangkal lidah naik ke atas.'
    },
    'ض': {
        symbol: 'ض', name: 'Dhod', transliteration: 'Dho',
        makhraj: 'Tepi Lidah',
        sifat: ['Istila', 'Istitholah (Memanjang)'],
        desc: 'Tepi lidah menekan gigi geraham atas. Bunyi paling sukar dan unik.'
    },
    'ط': {
        symbol: 'ط', name: 'Tho', transliteration: 'Tho',
        makhraj: 'Lidah & Gigi Seri Atas',
        sifat: ['Istila', 'Qalqalah'],
        desc: 'Bunyi T yang tebal dan melantun. Langit-langit mulut tertutup.'
    },
    'ظ': {
        symbol: 'ظ', name: 'Zho', transliteration: 'Zho',
        makhraj: 'Hujung Lidah & Hujung Gigi',
        sifat: ['Istila', 'Jahru'],
        desc: 'Bunyi Dz yang sangat tebal. Lidah keluar sedikit.'
    },
    'ع': {
        symbol: 'ع', name: 'Ain', transliteration: "'A",
        makhraj: 'Tengah Kerongkong',
        sifat: ['Jahru', 'Tawasut'],
        desc: 'Tekan tengah kerongkong. Bunyi "A" yang dalam dan bersih.'
    },
    'غ': {
        symbol: 'غ', name: 'Ghain', transliteration: 'Gh',
        makhraj: 'Ujung Kerongkong',
        sifat: ['Jahru', 'Istila'],
        desc: 'Seperti berkumur air. Bunyi tebal di pangkal tekak.'
    },
    'ف': {
        symbol: 'ف', name: 'Fa', transliteration: 'F',
        makhraj: 'Bibir Bawah & Gigi Atas',
        sifat: ['Hams', 'Rakhawah'],
        desc: 'Gigi seri atas menekan bibir bawah bagian dalam.'
    },
    'ق': {
        symbol: 'ق', name: 'Qof', transliteration: 'Q',
        makhraj: 'Pangkal Lidah (Belakang)',
        sifat: ['Istila', 'Qalqalah'],
        desc: 'Pangkal lidah naik menyentuh langit-langit lembut. Bunyi K tebal melantun.'
    },
    'ك': {
        symbol: 'ك', name: 'Kaf', transliteration: 'K',
        makhraj: 'Pangkal Lidah (Depan Qof)',
        sifat: ['Hams', 'Syiddah'],
        desc: 'Pangkal lidah bawah sedikit dari Qof. Ada sedikit hembusan nafas.'
    },
    'ل': {
        symbol: 'ل', name: 'Lam', transliteration: 'L',
        makhraj: 'Hujung Sisi Lidah',
        sifat: ['Jahru', 'Tawasut'],
        desc: 'Hujung lidah menyentuh gusi atas.'
    },
    'م': {
        symbol: 'م', name: 'Mim', transliteration: 'M',
        makhraj: 'Dua Bibir',
        sifat: ['Jahru', 'Ghunnah (Dengung)'],
        desc: 'Rapatkan bibir dengan ringan. Ada getaran di hidung.'
    },
    'ن': {
        symbol: 'ن', name: 'Nun', transliteration: 'N',
        makhraj: 'Hujung Lidah',
        sifat: ['Jahru', 'Ghunnah'],
        desc: 'Hujung lidah ke gusi atas. Wajib ada dengung di hidung.'
    },
    'و': {
        symbol: 'و', name: 'Wau', transliteration: 'W',
        makhraj: 'Dua Bibir',
        sifat: ['Jahru', 'Rakhawah'],
        desc: 'Moncongkan bibir hingga bulat sempurna.'
    },
    'ه': {
        symbol: 'ه', name: 'Ha', transliteration: 'H (Simpul)',
        makhraj: 'Pangkal Kerongkong',
        sifat: ['Hams', 'Rakhawah'],
        desc: 'Bunyi H besar dari dada. Nafas keluar bebas.'
    },
    'ي': {
        symbol: 'ي', name: 'Ya', transliteration: 'Y',
        makhraj: 'Tengah Lidah',
        sifat: ['Jahru', 'Rakhawah'],
        desc: 'Tengah lidah naik mendekati langit-langit tetapi tidak menyentuh.'
    }
};

// Helper to normalize and find info
export const getLetterInfo = (char: string): LetterInfo | null => {
    // Basic normalization
    const cleanChar = char.replace(/[ًٌٍَُِّْ]/g, ''); // Remove harakat for lookup
    if (LETTER_DATA[cleanChar]) return LETTER_DATA[cleanChar];
    if (cleanChar === 'ى') return LETTER_DATA['ي'];
    return null;
};

// Iqra Module Data Constants
import { IqraPage, IqraCell } from '../../types';

// --- MOCK DATA FOR SMART CELLS ---
export const MOCK_IQRA_PAGE_1: IqraPage = {
    pageNumber: 1,
    cells: [
        { id: 'c1', x: 10, y: 10, width: 20, height: 10, content: { arabic: 'بَ', transliteration: 'Ba', audioUrl: '/audio/iqra/1/ba.mp3' } },
        { id: 'c2', x: 40, y: 10, width: 20, height: 10, content: { arabic: 'تَ', transliteration: 'Ta', audioUrl: '/audio/iqra/1/ta.mp3' } },
        { id: 'c3', x: 70, y: 10, width: 20, height: 10, content: { arabic: 'ثَ', transliteration: 'Tha', audioUrl: '/audio/iqra/1/tha.mp3' } },
        { id: 'c4', x: 10, y: 30, width: 20, height: 10, content: { arabic: 'جَ', transliteration: 'Ja', audioUrl: '/audio/iqra/1/ja.mp3' } },
        { id: 'c5', x: 40, y: 30, width: 20, height: 10, content: { arabic: 'حَ', transliteration: 'Ha', audioUrl: '/audio/iqra/1/ha.mp3' } },
        { id: 'c6', x: 70, y: 30, width: 20, height: 10, content: { arabic: 'خَ', transliteration: 'Kha', audioUrl: '/audio/iqra/1/kha.mp3' } },
    ]
};

export const MOCK_IQRA_PAGE_2: IqraPage = {
    pageNumber: 2,
    cells: [
        { id: 'c7', x: 15, y: 20, width: 25, height: 15, content: { arabic: 'دَ', transliteration: 'Da', audioUrl: '/audio/iqra/1/da.mp3' } },
        { id: 'c8', x: 50, y: 20, width: 25, height: 15, content: { arabic: 'ذَ', transliteration: 'Dha', audioUrl: '/audio/iqra/1/dha.mp3' } },
        { id: 'c9', x: 15, y: 50, width: 25, height: 15, content: { arabic: 'رَ', transliteration: 'Ra', audioUrl: '/audio/iqra/1/ra.mp3' } },
        { id: 'c10', x: 50, y: 50, width: 25, height: 15, content: { arabic: 'زَ', transliteration: 'Za', audioUrl: '/audio/iqra/1/za.mp3' } },
    ]
};

export const MOCK_IQRA_PAGE_3: IqraPage = {
    pageNumber: 3,
    cells: [
        { id: 'c11', x: 20, y: 30, width: 30, height: 20, content: { arabic: 'سَ', transliteration: 'Sa', audioUrl: '/audio/iqra/1/sa.mp3' } },
        { id: 'c12', x: 55, y: 30, width: 30, height: 20, content: { arabic: 'شَ', transliteration: 'Sha', audioUrl: '/audio/iqra/1/sha.mp3' } },
    ]
};

export const MOCK_PAGES: Record<number, IqraPage> = {
    1: MOCK_IQRA_PAGE_1,
    2: MOCK_IQRA_PAGE_2,
    3: MOCK_IQRA_PAGE_3
};

// --- IQRA BOOKS DATA ---
export interface IqraBook {
    id: string;
    title: string;
    file: string;
    color: string;
    shadow: string;
    icon: string;
}

export const IQRA_BOOKS_DATA: IqraBook[] = [
    { id: 'iqra-1', title: "Iqra' 1", file: '/books/buku-iqra-1 (1).pdf', color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/20", icon: "1" },
    { id: 'iqra-2', title: "Iqra' 2", file: '/books/buku-iqra-2 (1).pdf', color: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20", icon: "2" },
    { id: 'iqra-3', title: "Iqra' 3", file: '/books/buku-iqra-3-1 (1).pdf', color: "from-yellow-500 to-lime-500", shadow: "shadow-yellow-500/20", icon: "3" },
    { id: 'iqra-4', title: "Iqra' 4", file: '/books/buku-iqra-4 (1).pdf', color: "from-green-500 to-emerald-500", shadow: "shadow-green-500/20", icon: "4" },
    { id: 'iqra-5', title: "Iqra' 5", file: '/books/buku-iqra-5 (1).pdf', color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20", icon: "5" },
    { id: 'iqra-6', title: "Iqra' 6", file: '/books/buku-iqra-6 (1).pdf', color: "from-purple-500 to-indigo-500", shadow: "shadow-purple-500/20", icon: "6" },
];

// --- TAJWEED TUTORIALS ---
export interface TajweedTutorial {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
    prompt: string;
}

export const TAJWEED_TUTORIALS: TajweedTutorial[] = [
    {
        id: 'qalqalah',
        title: 'The Qalqalah (Echo)',
        description: 'Learn how to bounce the sound of Qaf, Toa, Ba, Jim, Dal.',
        icon: 'fa-wave-square',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        prompt: 'Cinematic educational video about Qalqalah Tajweed rule. Show Arabic letters Qaf, Toa, Ba, Jim, Dal vibrating and glowing to represent the echoing sound. Clear Arabic typography on a dark background.'
    },
    {
        id: 'madd',
        title: 'The Madd (Elongation)',
        description: 'Understanding the different lengths of vowels (2, 4, 6).',
        icon: 'fa-wave-square',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        prompt: 'Visual guide to Madd (Elongation) in Quran. Animation of Arabic vowels stretching. Show wave patterns representing sound duration (2, 4, 6 harakat). Educational style.'
    },
    {
        id: 'ghunnah',
        title: 'Ghunnah (Nasal)',
        description: 'The nasal sound of Mim and Nun Mushaddadah.',
        icon: 'fa-wind',
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/30',
        prompt: 'Educational animation of the human profile showing sound airflow through the nose (nasal passage) for Arabic letters Mim and Nun with Shaddah. Soft pink aesthetics.'
    },
    {
        id: 'makhraj',
        title: 'Makhraj (Articulation)',
        description: 'Where exactly each letter sound comes from.',
        icon: 'fa-language',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        prompt: '3D animation of human mouth and throat anatomy showing Makhraj points for Arabic letters. Educational diagram style highlighting tongue positions and throat areas.'
    }
];

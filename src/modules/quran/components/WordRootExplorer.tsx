/**
 * 📚 Word Root Explorer
 * Explore Arabic word roots and their derivatives across the Quran
 * 
 * Features:
 * - Triliteral root analysis
 * - Related words from same root
 * - Semantic field exploration
 * - Related verses lookup
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, BookOpen, GitBranch, Search, ChevronRight,
    ExternalLink, Sparkles, Volume2
} from 'lucide-react';

interface WordRootExplorerProps {
    word: string;
    arabicWord: string;
    translation?: string;
    isOpen: boolean;
    onClose: () => void;
    onVerseClick?: (surahNumber: number, verseNumber: number) => void;
}

interface RootData {
    root: string;
    rootLetters: string[];
    meaning: string;
    semanticField: string;
    derivatives: Derivative[];
    relatedVerses: RelatedVerse[];
}

interface Derivative {
    arabic: string;
    transliteration: string;
    meaning: string;
    form: string;
}

interface RelatedVerse {
    surahNumber: number;
    surahName: string;
    verseNumber: number;
    arabicSnippet: string;
    highlightWord: string;
}

// Sample root database (in production, fetch from API)
const ROOT_DATABASE: Record<string, RootData> = {
    'صبر': {
        root: 'ص-ب-ر',
        rootLetters: ['ص', 'ب', 'ر'],
        meaning: 'To be patient, endure, persevere',
        semanticField: 'Patience & Endurance',
        derivatives: [
            { arabic: 'صَبَرَ', transliteration: 'ṣabara', meaning: 'he was patient', form: 'Form I' },
            { arabic: 'صَابِر', transliteration: 'ṣābir', meaning: 'patient one', form: 'Active Participle' },
            { arabic: 'صَبْر', transliteration: 'ṣabr', meaning: 'patience', form: 'Verbal Noun' },
            { arabic: 'صَابِرِينَ', transliteration: 'ṣābirīn', meaning: 'the patient ones', form: 'Plural' },
            { arabic: 'اصْبِرْ', transliteration: 'iṣbir', meaning: 'be patient!', form: 'Imperative' },
        ],
        relatedVerses: [
            { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 45, arabicSnippet: 'وَاسْتَعِينُوا بِالصَّبْرِ', highlightWord: 'الصَّبْرِ' },
            { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 155, arabicSnippet: 'وَبَشِّرِ الصَّابِرِينَ', highlightWord: 'الصَّابِرِينَ' },
            { surahNumber: 3, surahName: 'Ali Imran', verseNumber: 200, arabicSnippet: 'اصْبِرُوا وَصَابِرُوا', highlightWord: 'اصْبِرُوا' },
        ],
    },
    'شكر': {
        root: 'ش-ك-ر',
        rootLetters: ['ش', 'ك', 'ر'],
        meaning: 'To be thankful, grateful',
        semanticField: 'Gratitude & Thanks',
        derivatives: [
            { arabic: 'شَكَرَ', transliteration: 'shakara', meaning: 'he thanked', form: 'Form I' },
            { arabic: 'شُكْر', transliteration: 'shukr', meaning: 'thankfulness', form: 'Verbal Noun' },
            { arabic: 'شَاكِر', transliteration: 'shākir', meaning: 'thankful one', form: 'Active Participle' },
            { arabic: 'شَكُور', transliteration: 'shakūr', meaning: 'very grateful', form: 'Intensive' },
        ],
        relatedVerses: [
            { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 152, arabicSnippet: 'وَاشْكُرُوا لِي', highlightWord: 'اشْكُرُوا' },
            { surahNumber: 14, surahName: 'Ibrahim', verseNumber: 7, arabicSnippet: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', highlightWord: 'شَكَرْتُمْ' },
        ],
    },
    'ذكر': {
        root: 'ذ-ك-ر',
        rootLetters: ['ذ', 'ك', 'ر'],
        meaning: 'To remember, mention, remind',
        semanticField: 'Remembrance',
        derivatives: [
            { arabic: 'ذَكَرَ', transliteration: 'dhakara', meaning: 'he remembered', form: 'Form I' },
            { arabic: 'ذِكْر', transliteration: 'dhikr', meaning: 'remembrance', form: 'Verbal Noun' },
            { arabic: 'تَذْكِرَة', transliteration: 'tadhkira', meaning: 'reminder', form: 'Noun' },
            { arabic: 'ذَاكِر', transliteration: 'dhākir', meaning: 'one who remembers', form: 'Active Participle' },
        ],
        relatedVerses: [
            { surahNumber: 2, surahName: 'Al-Baqarah', verseNumber: 152, arabicSnippet: 'فَاذْكُرُونِي أَذْكُرْكُمْ', highlightWord: 'اذْكُرُونِي' },
            { surahNumber: 13, surahName: 'Ar-Ra\'d', verseNumber: 28, arabicSnippet: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', highlightWord: 'بِذِكْرِ' },
        ],
    },
    'رحم': {
        root: 'ر-ح-م',
        rootLetters: ['ر', 'ح', 'م'],
        meaning: 'To show mercy, compassion',
        semanticField: 'Mercy & Compassion',
        derivatives: [
            { arabic: 'رَحِمَ', transliteration: 'raḥima', meaning: 'he showed mercy', form: 'Form I' },
            { arabic: 'رَحْمَة', transliteration: 'raḥma', meaning: 'mercy', form: 'Verbal Noun' },
            { arabic: 'رَحْمَٰن', transliteration: 'raḥmān', meaning: 'Most Merciful', form: 'Intensive' },
            { arabic: 'رَحِيم', transliteration: 'raḥīm', meaning: 'Ever Merciful', form: 'Intensive' },
        ],
        relatedVerses: [
            { surahNumber: 1, surahName: 'Al-Fatiha', verseNumber: 1, arabicSnippet: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', highlightWord: 'الرَّحْمَٰنِ' },
            { surahNumber: 39, surahName: 'Az-Zumar', verseNumber: 53, arabicSnippet: 'لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ', highlightWord: 'رَّحْمَةِ' },
        ],
    },
};

// Simple root extraction (in production, use proper Arabic NLP)
const extractRoot = (arabicWord: string): string | null => {
    // Remove common prefixes and suffixes
    let cleaned = arabicWord
        .replace(/^[وفبكل]/, '')  // Remove wa, fa, bi, ka, li prefixes
        .replace(/^ال/, '')       // Remove definite article
        .replace(/[ةينون]$/, '')  // Remove common endings
        .replace(/[ًٌٍَُِّْ]/g, ''); // Remove diacritics

    // Try to match against known roots
    for (const root of Object.keys(ROOT_DATABASE)) {
        if (cleaned.includes(root.replace(/-/g, '')) ||
            root.split('-').some(letter => cleaned.includes(letter))) {
            return root;
        }
    }

    return null;
};

const WordRootExplorer: React.FC<WordRootExplorerProps> = ({
    word,
    arabicWord,
    translation,
    isOpen,
    onClose,
    onVerseClick
}) => {
    const [rootData, setRootData] = useState<RootData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Load root data
    useEffect(() => {
        if (isOpen && arabicWord) {
            setIsLoading(true);
            setNotFound(false);

            // Simulate API delay
            setTimeout(() => {
                const extractedRoot = extractRoot(arabicWord);

                if (extractedRoot && ROOT_DATABASE[extractedRoot.replace(/-/g, '')]) {
                    setRootData(ROOT_DATABASE[extractedRoot.replace(/-/g, '')]);
                } else {
                    // Try direct lookup
                    const directMatch = Object.entries(ROOT_DATABASE).find(([_, data]) =>
                        data.derivatives.some(d => arabicWord.includes(d.arabic.replace(/[ًٌٍَُِّْ]/g, '')))
                    );

                    if (directMatch) {
                        setRootData(directMatch[1]);
                    } else {
                        setNotFound(true);
                    }
                }

                setIsLoading(false);
            }, 300);
        }
    }, [isOpen, arabicWord]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                   flex items-end sm:items-center justify-center"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="w-full max-w-lg bg-slate-900 rounded-t-3xl sm:rounded-2xl 
                     max-h-[85vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 
                             rounded-xl flex items-center justify-center">
                                <GitBranch className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Word Root Explorer</h3>
                                <p className="text-xs text-slate-400">Explore Arabic etymology</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Tutup panel"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Word Display */}
                    <div className="p-4 bg-slate-800/50 text-center">
                        <p className="text-4xl font-arabic text-white mb-2">{arabicWord}</p>
                        {translation && (
                            <p className="text-sm text-slate-400">{translation}</p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
                            </div>
                        ) : notFound ? (
                            <div className="text-center py-12">
                                <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">Root data not found for this word.</p>
                                <p className="text-sm text-slate-500 mt-2">
                                    Try exploring other words in the verse.
                                </p>
                            </div>
                        ) : rootData && (
                            <>
                                {/* Root Information */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        {rootData.rootLetters.map((letter, i) => (
                                            <React.Fragment key={i}>
                                                <span className="text-3xl font-arabic text-amber-400">{letter}</span>
                                                {i < rootData.rootLetters.length - 1 && (
                                                    <span className="text-slate-600">-</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 
                                    rounded-full text-sm">
                                            {rootData.semanticField}
                                        </span>
                                    </div>

                                    <p className="text-center text-slate-300 mt-3">
                                        {rootData.meaning}
                                    </p>
                                </div>

                                {/* Derivatives */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        Derivatives ({rootData.derivatives.length})
                                    </h4>

                                    <div className="space-y-2">
                                        {rootData.derivatives.map((derivative, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl font-arabic text-white">
                                                        {derivative.arabic}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm text-slate-300">{derivative.meaning}</p>
                                                        <p className="text-xs text-slate-500">{derivative.transliteration}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded">
                                                    {derivative.form}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Related Verses */}
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-cyan-400" />
                                        Related Verses ({rootData.relatedVerses.length})
                                    </h4>

                                    <div className="space-y-2">
                                        {rootData.relatedVerses.map((verse, i) => (
                                            <button
                                                key={i}
                                                onClick={() => onVerseClick?.(verse.surahNumber, verse.verseNumber)}
                                                className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg 
                                   text-left transition-colors group"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-cyan-400">
                                                        {verse.surahName} {verse.surahNumber}:{verse.verseNumber}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                                </div>
                                                <p className="text-lg font-arabic text-right text-slate-300" dir="rtl">
                                                    {verse.arabicSnippet.split(verse.highlightWord).map((part, j, arr) => (
                                                        <React.Fragment key={j}>
                                                            {part}
                                                            {j < arr.length - 1 && (
                                                                <span className="text-amber-400 bg-amber-500/20 px-1 rounded">
                                                                    {verse.highlightWord}
                                                                </span>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-800 text-center">
                        <p className="text-xs text-slate-500">
                            Arabic root analysis • {rootData?.derivatives.length || 0} derivatives • {rootData?.relatedVerses.length || 0} verses
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WordRootExplorer;

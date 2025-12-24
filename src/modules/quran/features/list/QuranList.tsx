import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranChapter, SemanticResult } from '../../../../types';

// Premium Components
import QuantumSearchBar from '../../components/QuantumSearchBar';
import HoloSurahCard from '../../components/HoloSurahCard';
import NeuroJuzGrid from '../../components/NeuroJuzGrid';

interface QuranListProps {
    chapters: QuranChapter[];
    loading?: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onChapterSelect: (chapter: QuranChapter) => void;
    isSemanticMode: boolean;
    setIsSemanticMode: (mode: boolean) => void;
    handleSemanticSearch: () => void;
    isSearchingSemantic: boolean;
    semanticResults: SemanticResult[];
}

// Skeleton for premium loading state
const PremiumSkeleton = () => (
    <div className="h-28 bg-slate-900/40 rounded-2xl border border-white/5 p-5 animate-pulse flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-3 bg-slate-800/50 rounded w-1/4"></div>
        </div>
        <div className="w-20 h-10 bg-slate-800 rounded-lg"></div>
    </div>
);

const QuranList: React.FC<QuranListProps> = ({
    chapters,
    loading = false,
    searchQuery,
    setSearchQuery,
    onChapterSelect,
    isSemanticMode,
    setIsSemanticMode,
    handleSemanticSearch,
    isSearchingSemantic,
    semanticResults
}) => {
    // Utility to remove diacritics
    const normalizeText = (text: string) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filteredChapters = chapters.filter(c => {
        const query = normalizeText(searchQuery);
        const nameSimple = normalizeText(c.name_simple || '');
        const nameComplex = normalizeText(c.name_complex || '');
        const nameArabic = c.name_arabic || '';
        const idStr = c.id.toString();

        return nameSimple.includes(query) ||
            nameComplex.includes(query) ||
            nameArabic.includes(searchQuery) ||
            idStr === query;
    });

    const [activeTab, setActiveTab] = React.useState<'surah' | 'juz' | 'revelation'>('surah');

    // JUZ Logic
    const juzStartSurahMap: Record<number, number> = {
        1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8,
        11: 9, 12: 11, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23, 19: 25, 20: 27,
        21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46, 27: 51, 28: 58, 29: 67, 30: 78
    };

    const getSortedChapters = () => {
        let sorted = [...filteredChapters];
        if (activeTab === 'revelation') {
            sorted.sort((a, b) => a.revelation_order - b.revelation_order);
        }
        return sorted;
    };

    const sortedList = getSortedChapters();
    const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="min-h-screen pb-32 bg-background-dark relative overflow-hidden font-sans">

            {/* 1. ATMOSPHERE BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] mix-blend-screen"></div>
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-sheet/20 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            {/* 2. PARALLAX HEADER */}
            <div className="relative pt-24 pb-16 px-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative inline-block"
                >
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/30 to-surface-dark tracking-tighter mb-2 opacity-10 absolute -top-4 left-1/2 -translate-x-1/2 w-full select-none pointer-events-none">
                        AL-QURAN
                    </h1>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 relative z-10 drop-shadow-2xl">
                        The Celestial <span className="text-primary">Library</span>
                    </h1>
                </motion.div>
                <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent mx-auto mt-6 opacity-50"></div>
            </div>

            <div className="px-4 max-w-6xl mx-auto space-y-8 relative z-10">

                {/* 3. SEARCH & NAVIGATION */}
                <div className="sticky top-4 z-40">
                    <QuantumSearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        isSemanticMode={isSemanticMode}
                        setIsSemanticMode={setIsSemanticMode}
                        handleSemanticSearch={handleSemanticSearch}
                    />

                    {/* Tabs (Only visible in Standard Mode) */}
                    <AnimatePresence>
                        {!isSemanticMode && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex justify-center mt-4"
                            >
                                <div className="inline-flex p-1 bg-sheet/80 backdrop-blur-md rounded-full border border-white">
                                    {(['surah', 'juz', 'revelation'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${activeTab === tab
                                                    ? 'bg-primary text-background-dark shadow-neon'
                                                    : 'text-white/60 hover:text-white'
                                                }`}
                                        >
                                            {tab === 'surah' ? 'SURAH' : tab === 'juz' ? 'JUZ GRID' : 'ORDER'}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 4. CONTENT GRID */}
                <AnimatePresence mode="wait">

                    {/* LOADING */}
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {[...Array(9)].map((_, i) => <PremiumSkeleton key={i} />)}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab + (isSemanticMode ? 'ai' : 'std')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="min-h-[50vh]"
                        >
                            {/* SCENARIO A: SEMANTIC RESULTS */}
                            {isSemanticMode && (
                                <div>
                                    {isSearchingSemantic ? (
                                        /* AI SCANNING ANIMATION */
                                        <div className="flex flex-col items-center justify-center py-20">
                                            <div className="relative w-24 h-24 mb-6">
                                                <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-ping"></div>
                                                <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin"></div>
                                                <div className="absolute inset-4 bg-amber-500/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                                                    <i className="fa-solid fa-brain text-amber-400 text-2xl animate-pulse"></i>
                                                </div>
                                            </div>
                                            <h3 className="text-amber-400 font-mono tracking-widest animate-pulse">NEURAL SCANNING...</h3>
                                        </div>
                                    ) : semanticResults.length > 0 ? (
                                        /* AI RESULTS */
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"></span>
                                                <h3 className="text-amber-100 font-bold text-sm tracking-widest uppercase">AI Insights Found</h3>
                                            </div>
                                            {semanticResults.map((res, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="bg-gradient-to-r from-slate-900/80 to-slate-900/40 border-l-4 border-amber-500 p-6 rounded-r-2xl hover:bg-slate-800 transition-all cursor-pointer group"
                                                    onClick={() => {
                                                        const surah = chapters.find(c => c.name_simple.toLowerCase() === res.surah.toLowerCase());
                                                        if (surah) onChapterSelect(surah);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-amber-500 font-mono text-xs font-bold">MATCH {i + 1}</span>
                                                        <span className="text-slate-500 text-xs">{res.surah} • Ayat {res.ayah}</span>
                                                    </div>
                                                    <p className="font-arabic text-2xl text-right text-white mb-2">{res.arabic}</p>
                                                    <p className="text-slate-300 italic text-sm">"{res.text}"</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* EMPTY AI STATE */
                                        <div className="text-center py-20 opacity-40">
                                            <i className="fa-solid fa-microchip text-4xl text-slate-600 mb-4"></i>
                                            <p>Ask anything. "What does Quran say about hope?"</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SCENARIO B: STANDARD LIST */}
                            {!isSemanticMode && (
                                <>
                                    {activeTab === 'juz' ? (
                                        <NeuroJuzGrid
                                            juzList={juzList}
                                            juzStartSurahMap={juzStartSurahMap}
                                            onSelect={(startId) => {
                                                const surah = chapters.find(c => c.id === startId);
                                                if (surah) onChapterSelect(surah);
                                            }}
                                        />
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {sortedList.map((surah, index) => (
                                                <HoloSurahCard
                                                    key={surah.id}
                                                    chapter={surah}
                                                    index={index}
                                                    onClick={() => onChapterSelect(surah)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Empty Search Result */}
                                    {sortedList.length === 0 && (
                                        <div className="text-center py-20">
                                            <div className="inline-block p-6 rounded-full bg-slate-800/50 mb-4">
                                                <i className="fa-solid fa-magnifying-glass text-2xl text-slate-500"></i>
                                            </div>
                                            <h3 className="text-slate-300 font-bold">No Surah Found</h3>
                                            <p className="text-slate-500 text-sm">Try searching for "Kahf" or "18"</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default QuranList;

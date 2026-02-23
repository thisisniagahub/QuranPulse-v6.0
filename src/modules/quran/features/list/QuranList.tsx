import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuranChapter } from '../../../../types';
import { SemanticSearchResult } from '../../features/search/useSemanticSearch';
import { audioCache } from '../../../../services/audioCacheService';

// Premium Components
import QuantumSearchBar from '../../components/QuantumSearchBar';
import HoloSurahCard from '../../components/HoloSurahCard';
import NeuroJuzGrid from '../../components/NeuroJuzGrid';
const DailyAyatWidget = lazy(() => import('../../components/DailyAyatWidget'));
const KhatamProgressTracker = lazy(() => import('../../components/KhatamProgressTracker'));
const SmartDeenCrossover = lazy(() => import('../../components/SmartDeenCrossover'));

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
    semanticResults: SemanticSearchResult[];
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
    // Track cached surahs
    const [cachedIds, setCachedIds] = useState<Set<number>>(new Set());

    const checkCache = useCallback(async () => {
        const cacheChecks = chapters.map(async (chapter) => {
            const padSurah = chapter.id.toString().padStart(3, '0');
            const url = `https://verses.quran.com/Alafasy/mp3/${padSurah}001.mp3`;
            const isCached = await audioCache.isCached(url);
            return isCached ? chapter.id : null;
        });

        const cachedResults = await Promise.all(cacheChecks);
        const cached = new Set<number>(cachedResults.filter((id): id is number => id !== null));
        setCachedIds(cached);
    }, [chapters]);

    useEffect(() => {
        if (chapters.length > 0) {
            checkCache();
        }
    }, [chapters.length, checkCache]);

    // Utility to remove diacritics
    const normalizeText = useCallback((text: string) => (
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    ), []);

    const filteredChapters = useMemo(() => {
        const query = normalizeText(searchQuery);
        return chapters.filter(c => {
            const nameSimple = normalizeText(c.name_simple || '');
            const nameComplex = normalizeText(c.name_complex || '');
            const nameArabic = c.name_arabic || '';
            const idStr = c.id.toString();

            return nameSimple.includes(query) ||
                nameComplex.includes(query) ||
                nameArabic.includes(searchQuery) ||
                idStr === query;
        });
    }, [chapters, normalizeText, searchQuery]);

    const [activeTab, setActiveTab] = React.useState<'surah' | 'juz' | 'revelation'>('surah');

    // JUZ Logic
    const juzStartSurahMap: Record<number, number> = {
        1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8,
        11: 9, 12: 11, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23, 19: 25, 20: 27,
        21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46, 27: 51, 28: 58, 29: 67, 30: 78
    };

    const sortedList = useMemo(() => {
        const sorted = [...filteredChapters];
        if (activeTab === 'revelation') {
            sorted.sort((a, b) => a.revelation_order - b.revelation_order);
        }
        return sorted;
    }, [activeTab, filteredChapters]);

    const juzList = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);

    return (
        <div className="min-h-screen pb-32 bg-raudhah-ivory relative overflow-hidden font-sans">

            {/* 1. ATMOSPHERE BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-pattern-dots-raudhah z-0"></div>

            {/* 2. DASHBOARD WIDGETS (New Tier 1) */}
            <div className="relative pt-24 px-4 max-w-6xl mx-auto z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Suspense fallback={<div className="h-36 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse" />}>
                        <DailyAyatWidget />
                    </Suspense>
                    <Suspense fallback={<div className="h-36 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse" />}>
                        <KhatamProgressTracker
                            compact={true}
                            progress={{
                                versesRead: 1500,
                                currentStreak: 5
                            }}
                        />
                    </Suspense>
                </div>
            </div>

            {/* 3. PARALLAX HEADER */}
            <div className="relative pt-12 pb-12 px-6 text-center z-10 overflow-hidden group">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img loading="lazy"
                        src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop"
                        alt="Celestial Library Background"
                        className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-raudhah-ivory/0 via-raudhah-ivory/80 to-raudhah-ivory"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative inline-block z-10"
                >
                    <h1 className="text-6xl md:text-8xl font-black text-raudhah-teal/5 tracking-tighter mb-2 absolute -top-6 left-1/2 -translate-x-1/2 w-full select-none pointer-events-none">
                        AL-QURAN
                    </h1>
                    <h1 className="text-3xl md:text-5xl font-black text-raudhah-ink mb-2 relative z-10 drop-shadow-[0_0_25px_rgba(27,107,90,0.1)] tracking-tight">
                        The Celestial <span className="text-raudhah-teal">Library</span>
                    </h1>
                </motion.div>
                <div className="w-px h-12 bg-gradient-to-b from-raudhah-teal/50 to-transparent mx-auto mt-6 relative z-10"></div>
            </div>

            <div className="px-4 max-w-6xl mx-auto space-y-8 relative z-10">

                {/* 4. SEARCH & NAVIGATION */}
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
                                <div className="inline-flex p-1 bg-raudhah-teal/5 backdrop-blur-md rounded-full border border-raudhah-teal/10 shadow-warm">
                                    {(['surah', 'juz', 'revelation'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${activeTab === tab
                                                ? 'bg-raudhah-teal/10 text-raudhah-teal border border-raudhah-teal/20 shadow-warm'
                                                : 'text-raudhah-teal/40 hover:text-raudhah-teal hover:bg-raudhah-teal/5 border border-transparent'
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

                {/* 5. CONTENT GRID */}
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
                                                        const surah = chapters.find(c => c.name_simple.toLowerCase() === res.surahName.toLowerCase());
                                                        if (surah) onChapterSelect(surah);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-amber-500 font-mono text-xs font-bold">MATCH {i + 1}</span>
                                                        <span className="text-slate-500 text-xs">{res.surahName} • Ayat {res.verseNumber}</span>
                                                    </div>
                                                    <p className="font-arabic text-2xl text-right text-white mb-2">{res.arabicText}</p>
                                                    <p className="text-slate-300 italic text-sm">"{res.translation}"</p>
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
                                                    isOfflineReady={cachedIds.has(surah.id)}
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

            {/* 6. FLOATING SMART DEEN CROSSOVER */}
            <Suspense fallback={null}>
                <SmartDeenCrossover />
            </Suspense>
        </div>
    );
};

export default QuranList;


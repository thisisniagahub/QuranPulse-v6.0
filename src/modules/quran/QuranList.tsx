import React from 'react';
import { motion } from 'framer-motion';
import { QuranChapter, SemanticResult } from '../../types';

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

// Skeleton for loading state
const SurahSkeleton = () => (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
            <div className="flex-1">
                <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-slate-700/50 rounded w-16"></div>
            </div>
            <div className="w-16 h-8 bg-slate-700 rounded"></div>
        </div>
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
    const filteredChapters = chapters.filter(c => 
        (c.name_simple?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (c.name_arabic || '').includes(searchQuery)
    );

    const [activeTab, setActiveTab] = React.useState<'surah' | 'juz' | 'revelation'>('surah');

    // JUZ Logic: Mapping Juz to approximately starting Surah ID
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
        <div className="min-h-screen pb-24">
            {/* Premium Hero Header - Nature Background */}
            <div className="relative pt-20 pb-12 px-6 text-center z-10 overflow-hidden">
                {/* Nature Image Background */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2670&auto=format&fit=crop" 
                        alt="Nature Background" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900" />
                </div>
                
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Al-</span>Quran
                    </h1>
                    <p className="text-slate-200 text-sm font-medium tracking-widest uppercase opacity-90 drop-shadow-md">The Noble Recitation</p>
                    <div className="mt-4 w-24 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                </div>
            </div>

            <div className="px-4 pb-24 max-w-5xl mx-auto space-y-6">
                {/* Search Bar & Tabs Container */}
                <div className="sticky top-4 z-40 space-y-3">
                    {/* Search Bar */}
                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-2 border border-white/5 shadow-2xl transition-all focus-within:ring-1 focus-within:ring-cyan-500/30">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400">
                                <i className={`fa-solid ${isSemanticMode ? 'fa-wand-magic-sparkles text-amber-400 animate-pulse' : 'fa-magnifying-glass'}`}></i>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isSemanticMode ? 'Ask AI about topics (e.g. "patience")' : 'Search Surah (e.g. "Kahf")'}
                                className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-slate-600 h-12"
                                onKeyDown={(e) => e.key === 'Enter' && isSemanticMode && handleSemanticSearch()}
                            />
                            <button 
                                onClick={() => setIsSemanticMode(!isSemanticMode)} 
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                                    isSemanticMode 
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                                        : 'bg-slate-800 text-slate-400 border-transparent hover:text-white'
                                }`}
                            >
                                {isSemanticMode ? 'AI MODE' : 'LIST MODE'}
                            </button>
                        </div>
                    </div>

                    {/* View Tabs (Surah / Juz / Revelation) */}
                    {!isSemanticMode && (
                        <div className="flex p-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/5">
                            {(['surah', 'juz', 'revelation'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                                        activeTab === tab 
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' 
                                            : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {tab === 'surah' && 'SURAH'}
                                    {tab === 'juz' && 'JUZ'}
                                    {tab === 'revelation' && 'REVELATION ORDER'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => <SurahSkeleton key={i} />)}
                    </div>
                )}

                {/* Content Area */}
                <motion.div layout className="min-h-[50vh]">
                    {/* Semantic Results */}
                    {isSemanticMode && semanticResults.length > 0 && (
                        <div className="space-y-4 mb-8">
                             <div className="flex items-center gap-2 mb-4 px-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                <h3 className="text-amber-400 font-bold text-sm tracking-widest uppercase">AI Insights</h3>
                             </div>
                            {semanticResults.map((res, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/50 border border-amber-500/20 p-6 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer group"
                                    onClick={() => {
                                        const surah = chapters.find(c => c.name_simple.toLowerCase() === res.surah.toLowerCase());
                                        if (surah) onChapterSelect(surah);
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-amber-950/30 text-amber-400 rounded-full text-xs font-bold border border-amber-500/20">
                                            {res.surah} : {res.ayah}
                                        </span>
                                        <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-amber-400 transition-colors"></i>
                                    </div>
                                    <p className="font-arabic text-2xl text-right mb-4 text-slate-200">{res.arabic}</p>
                                    <p className="text-slate-400 text-sm italic border-l-2 border-slate-700 pl-4">"{res.text}"</p>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* MAIN LIST VIEW */}
                    {!isSemanticMode && !loading && (
                        <>
                            {/* JUZ VIEW */}
                            {activeTab === 'juz' ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {juzList.map((juzNum) => (
                                        <motion.div
                                            key={juzNum}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onClick={() => {
                                                const startSurahId = juzStartSurahMap[juzNum] || 1;
                                                const surah = chapters.find(c => c.id === startSurahId);
                                                if (surah) onChapterSelect(surah);
                                            }}
                                            className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-cyan-500/50 hover:bg-slate-800 transition-all cursor-pointer flex flex-col items-center justify-center group h-40"
                                        >
                                            <div className="w-16 h-16 rounded-full border-2 border-slate-700 group-hover:border-cyan-400 flex items-center justify-center mb-3 transition-colors bg-slate-900">
                                                <span className="text-2xl font-bold text-slate-400 group-hover:text-cyan-400">{juzNum}</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-white">JUZ {juzNum}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                /* SURAH & REVELATION VIEW */
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sortedList.map((surah, index) => (
                                        <motion.div
                                            key={surah.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.02 }}
                                            onClick={() => onChapterSelect(surah)}
                                            className="group relative bg-slate-900/40 backdrop-blur-sm p-5 rounded-2xl border border-white/5 hover:bg-slate-800/80 hover:border-cyan-500/20 transition-all duration-300 cursor-pointer flex items-center gap-5 min-h-[85px]"
                                        >
                                            {/* Clean Cyber Ring Marker */}
                                            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600 group-hover:text-cyan-500 transition-colors" />
                                                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700/50" />
                                                </svg>
                                                <span className="font-mono font-medium text-slate-300 text-sm group-hover:text-cyan-400 transition-colors">{surah.id}</span>
                                            </div>
                                            
                                            {/* Text Info - Clean Typography */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="flex justify-between items-baseline w-full">
                                                    <h4 className="font-semibold text-slate-200 text-lg group-hover:text-cyan-400 transition-colors truncate tracking-tight">
                                                        {surah.name_simple}
                                                    </h4>
                                                    
                                                    {/* Arabic Name - Fixed Visibility */}
                                                    <span className="font-arabic text-xl text-cyan-200 group-hover:text-white transition-colors ml-2 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] font-bold">
                                                        {surah.name_arabic}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                                                        {surah.verses_count} Verses
                                                    </p>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                                                        {surah.revelation_place}
                                                    </p>
                                                    {/* Revelation Order Badge */}
                                                    {activeTab === 'revelation' && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                            <span className="text-[10px] text-cyan-500/80 font-mono">
                                                                #{surah.revelation_order}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* No Results */}
                    {!loading && !isSemanticMode && filteredChapters.length === 0 && (
                        <div className="text-center py-20 opacity-60">
                            <i className="fa-solid fa-box-open text-4xl text-slate-700 mb-4"></i>
                            <p className="text-slate-500">No Surah found.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default QuranList;

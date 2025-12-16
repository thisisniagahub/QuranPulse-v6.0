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

    return (
        <div className="min-h-screen pb-24">
            {/* Premium Hero Header - Cleaner & More Spacious */}
            <div className="relative pt-12 pb-8 px-6 text-center z-10">
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Al-</span>Quran
                </h1>
                <p className="text-slate-400 text-sm font-medium tracking-wide uppercase opacity-80">The Noble Recitation</p>
                <div className="mt-2 w-16 h-1 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 mx-auto rounded-full"></div>
            </div>

            <div className="px-4 pb-24 max-w-5xl mx-auto space-y-6">
                {/* Search Bar - Floating & Glassy */}
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-2 border border-white/5 shadow-2xl sticky top-4 z-40 transition-all focus-within:ring-1 focus-within:ring-cyan-500/30">
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

                    {/* Surah List Grid */}
                    {!isSemanticMode && !loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredChapters.map((surah, index) => (
                                <motion.div
                                    key={surah.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => onChapterSelect(surah)}
                                    className="group relative bg-slate-900/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5 hover:bg-slate-800/60 hover:border-cyan-500/20 transition-all duration-300 cursor-pointer flex items-center gap-4 min-h-[90px]"
                                >
                                    {/* Consistent Cyber Ring Marker */}
                                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                                            <defs>
                                                <linearGradient id={`grad-cyber-list-${surah.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#22d3ee" />
                                                    <stop offset="100%" stopColor="#3b82f6" />
                                                </linearGradient>
                                            </defs>
                                            <circle cx="50" cy="50" r="45" fill="none" stroke={`url(#grad-cyber-list-${surah.id})`} strokeWidth="3" strokeDasharray="200" strokeDashoffset="100" className="group-hover:stroke-dashoffset-0 transition-all duration-700 ease-out" />
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                        </svg>
                                        <span className="font-bold text-cyan-400 text-sm">{surah.id}</span>
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-200 text-lg group-hover:text-cyan-400 transition-colors truncate">
                                            {surah.name_simple}
                                        </h4>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                            {surah.verses_count} Verses • {surah.revelation_place}
                                        </p>
                                    </div>

                                    {/* Arabic Name - Subtle */}
                                    <div className="opacity-30 group-hover:opacity-100 transition-opacity">
                                        <span className="font-arabic text-xl text-slate-400">{surah.name_arabic}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
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

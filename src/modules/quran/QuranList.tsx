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
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 p-8 border-b border-cyan-500/20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2 font-serif">
                        <span className="text-cyan-400">Al-</span>Quran
                    </h1>
                    <p className="text-amber-400/80 text-sm font-arabic text-xl mb-1">القرآن الكريم</p>
                    <p className="text-slate-400 text-sm">The Noble Recitation • 114 Surahs</p>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Search Bar */}
                <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl p-4 border border-cyan-500/20 sticky top-0 z-20 shadow-xl shadow-black/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                            <i className={`fa-solid ${isSemanticMode ? 'fa-wand-magic-sparkles text-amber-400' : 'fa-magnifying-glass text-cyan-400'}`}></i>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={isSemanticMode ? 'Ask about Quran (e.g. "verses about patience")...' : 'Search Surah by name...'}
                            aria-label="Search"
                            className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-slate-500"
                            onKeyDown={(e) => e.key === 'Enter' && isSemanticMode && handleSemanticSearch()}
                        />
                        {isSemanticMode && searchQuery && (
                            <button 
                                onClick={handleSemanticSearch} 
                                className="px-4 py-2 bg-cyan-500 text-black text-xs font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                            >
                                <i className="fa-solid fa-search mr-1"></i> Search
                            </button>
                        )}
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsSemanticMode(false)} 
                            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                                !isSemanticMode 
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                            }`}
                        >
                            <i className="fa-solid fa-list mr-2"></i>Browse Surahs
                        </button>
                        <button 
                            onClick={() => setIsSemanticMode(true)} 
                            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                                isSemanticMode 
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                            }`}
                        >
                            <i className="fa-solid fa-sparkles mr-2"></i>AI Search
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => <SurahSkeleton key={i} />)}
                    </div>
                )}

                {/* Semantic Search Loading */}
                {isSemanticMode && isSearchingSemantic && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/80 rounded-full border border-amber-500/30">
                            <i className="fa-solid fa-circle-notch fa-spin text-amber-400 text-lg"></i>
                            <span className="text-slate-300 text-sm">Searching the Quran with AI...</span>
                        </div>
                    </div>
                )}

                {/* Semantic Results */}
                {isSemanticMode && semanticResults.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                            <i className="fa-solid fa-sparkles text-amber-400 mr-2"></i>
                            Found {semanticResults.length} Relevant Verses
                        </p>
                        {semanticResults.map((res, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-900/80 border border-amber-500/20 p-5 rounded-2xl hover:bg-slate-800/80 transition-all cursor-pointer group"
                                onClick={() => {
                                    const surah = chapters.find(c => c.name_simple.toLowerCase() === res.surah.toLowerCase());
                                    if (surah) onChapterSelect(surah);
                                }}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold border border-amber-500/30">
                                        {res.surah} : {res.ayah}
                                    </span>
                                    <i className="fa-solid fa-arrow-right text-slate-600 group-hover:text-cyan-400 transition-colors"></i>
                                </div>
                                <p className="font-arabic text-2xl text-white text-right mb-3 leading-loose">{res.arabic}</p>
                                <p className="text-slate-300 text-sm italic mb-3">"{res.text}"</p>
                                <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20">
                                    <p className="text-xs text-cyan-300">
                                        <i className="fa-solid fa-lightbulb mr-2"></i>
                                        {res.explanation}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Surah Grid */}
                {!isSemanticMode && !loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                        {filteredChapters.map((surah, index) => (
                            <motion.div
                                key={surah.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02, duration: 0.3 }}
                                onClick={() => onChapterSelect(surah)}
                                className="group bg-slate-900/60 backdrop-blur-sm p-4 rounded-2xl hover:bg-slate-800/80 transition-all cursor-pointer border border-slate-800 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Number Badge */}
                                    {/* Number Badge with Frame */}
                                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'}}>
                                            <defs>
                                                {/* Rose Gold to Mocha Mousse Gradient (Pantone 2025 inspired) */}
                                                <linearGradient id="grad-pantone-list" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#E0BFB8" />   {/* Rose Gold */}
                                                    <stop offset="30%" stopColor="#D4AF37" />  {/* Metallic Gold */}
                                                    <stop offset="60%" stopColor="#B76E79" />  {/* Deep Rose Gold */}
                                                    <stop offset="100%" stopColor="#8B5A2B" /> {/* Mocha Mousse */}
                                                </linearGradient>
                                                <linearGradient id="grad-inner-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#1e3a5f" />
                                                    <stop offset="100%" stopColor="#0f172a" />
                                                </linearGradient>
                                            </defs>
                                            {/* 8-Pointed Star - Modern Geometric */}
                                            <g transform="translate(50,50)">
                                                <rect x="-30" y="-30" width="60" height="60" rx="3" fill="url(#grad-pantone-list)" />
                                                <rect x="-30" y="-30" width="60" height="60" rx="3" fill="url(#grad-pantone-list)" transform="rotate(45)" />
                                                {/* Inner glow circle */}
                                                <circle cx="0" cy="0" r="18" fill="url(#grad-inner-glow)" />
                                                <circle cx="0" cy="0" r="16" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
                                            </g>
                                        </svg>
                                        
                                        <span className="relative z-10 text-amber-300 font-bold text-sm group-hover:text-amber-200 transition-colors" style={{textShadow: '0 0 8px rgba(251,191,36,0.5)'}}>{surah.id}</span>
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors truncate">
                                            {surah.name_simple}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            {surah.verses_count} Ayat • {surah.revelation_place === 'makkah' ? 'Makki' : 'Madani'}
                                        </p>
                                    </div>
                                    
                                    {/* Arabic Name */}
                                    <p className="font-arabic text-2xl text-slate-600 group-hover:text-amber-400 transition-colors">
                                        {surah.name_arabic}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* No Results */}
                {!loading && !isSemanticMode && filteredChapters.length === 0 && (
                    <div className="text-center py-16">
                        <i className="fa-solid fa-search text-4xl text-slate-700 mb-4"></i>
                        <p className="text-slate-500">No Surah found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuranList;

/**
 * 🔍 Semantic Search Component
 * Search Quran verses by meaning, theme, or topic using vector embeddings
 * 
 * Features:
 * - Natural language search ("Ayat tentang sabar")
 * - Vector similarity using Supabase pgvector
 * - Bilingual support (Malay/English)
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, BookOpen, Loader2, X } from 'lucide-react';
import { useSemanticSearch, SemanticSearchResult } from './useSemanticSearch';

interface SemanticSearchProps {
    onVerseSelect?: (surahNumber: number, verseNumber: number) => void;
    className?: string;
}

const SemanticSearch: React.FC<SemanticSearchProps> = ({
    onVerseSelect,
    className = ''
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { search, results, isSearching, error } = useSemanticSearch();

    const handleSearch = useCallback(async () => {
        if (query.trim().length < 3) return;
        await search(query);
        setIsOpen(true);
    }, [query, search]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleResultClick = (result: SemanticSearchResult) => {
        if (onVerseSelect) {
            onVerseSelect(result.surahNumber, result.verseNumber);
        }
        setIsOpen(false);
    };

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative flex items-center">
                <div className="absolute left-3 text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Cari ayat berdasarkan makna... (cth: ayat tentang sabar)"
                    className="w-full pl-10 pr-20 py-3 bg-slate-800/60 border border-cyan-500/30 
                     rounded-xl text-white placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500
                     transition-all duration-300"
                />

                <div className="absolute right-2 flex items-center gap-2">
                    {query && (
                        <button
                            onClick={clearSearch}
                            className="p-1 hover:bg-slate-700 rounded-full transition-colors"
                            title="Kosongkan carian"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    )}
                    <button
                        onClick={handleSearch}
                        disabled={query.trim().length < 3 || isSearching}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 
                       rounded-lg text-white text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                    >
                        {isSearching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Search className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* AI Badge */}
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>AI Semantic Search - Cari berdasarkan makna, bukan teks sahaja</span>
            </div>

            {/* Results Dropdown */}
            <AnimatePresence>
                {isOpen && (results.length > 0 || error) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50
                       bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 
                       rounded-xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
                    >
                        {error ? (
                            <div className="p-4 text-center text-red-400">
                                <p>❌ {error}</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                                    <span className="text-sm text-slate-400">
                                        {results.length} ayat ditemui
                                    </span>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-xs text-cyan-400 hover:text-cyan-300"
                                    >
                                        Tutup
                                    </button>
                                </div>

                                <div className="max-h-80 overflow-y-auto">
                                    {results.map((result, index) => (
                                        <motion.button
                                            key={`${result.surahNumber}:${result.verseNumber}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleResultClick(result)}
                                            className="w-full p-4 text-left hover:bg-cyan-500/10 
                                 border-b border-slate-800 last:border-0
                                 transition-colors group"
                                        >
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-cyan-400" />
                                                    <span className="text-cyan-400 font-medium">
                                                        {result.surahName} ({result.surahNumber}:{result.verseNumber})
                                                    </span>
                                                </div>
                                                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
                                                    {Math.round(result.similarity * 100)}% match
                                                </span>
                                            </div>

                                            {/* Arabic Text */}
                                            <p className="text-right text-xl font-arabic text-white mb-2 leading-loose">
                                                {result.arabicText.substring(0, 100)}
                                                {result.arabicText.length > 100 && '...'}
                                            </p>

                                            {/* Translation */}
                                            <p className="text-sm text-slate-300 line-clamp-2">
                                                {result.translation}
                                            </p>

                                            {/* Hover hint */}
                                            <div className="mt-2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Klik untuk buka ayat ini
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SemanticSearch;

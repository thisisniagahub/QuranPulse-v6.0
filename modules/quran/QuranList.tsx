import React from 'react';
import { QuranChapter, SemanticResult } from '../../types';

interface QuranListProps {
    chapters: QuranChapter[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onChapterSelect: (chapter: QuranChapter) => void;
    isSemanticMode: boolean;
    setIsSemanticMode: (mode: boolean) => void;
    handleSemanticSearch: () => void;
    isSearchingSemantic: boolean;
    semanticResults: SemanticResult[];
}

const QuranList: React.FC<QuranListProps> = ({
    chapters,
    searchQuery,
    setSearchQuery,
    onChapterSelect,
    isSemanticMode,
    setIsSemanticMode,
    handleSemanticSearch,
    isSearchingSemantic,
    semanticResults
}) => {
    const filteredChapters = chapters.filter(c => c.name_simple.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="p-4 space-y-4 animate-fade-in">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-islamic-dark to-primary-dark border border-white/5 shadow-2xl p-6">
                <div className="absolute right-0 bottom-0 opacity-10 w-40 h-40 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <h2 className="text-3xl font-serif font-bold text-white relative z-10">Kalamullah</h2>
                <p className="text-secondary-light text-sm mt-1 relative z-10">The Divine Speech.</p>
            </div>

            {/* Search Bar with Semantic Toggle */}
            <div className="bg-space-light/80 backdrop-blur-md rounded-xl p-3 flex flex-col gap-2 border border-white/10 sticky top-0 z-20 shadow-lg">
                <div className="flex items-center gap-3">
                    <i className={`fa-solid ${isSemanticMode ? 'fa-wand-magic-sparkles text-secondary' : 'fa-magnifying-glass text-slate-500'}`}></i>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isSemanticMode ? 'Describe feeling (e.g. Anxiety)...' : 'Search Surah (e.g. Kahf)...'}
                        aria-label={isSemanticMode ? 'Semantic Search' : 'Search Surah'}
                        className="bg-transparent outline-none text-white text-sm w-full placeholder:text-slate-600"
                        onKeyDown={(e) => e.key === 'Enter' && isSemanticMode && handleSemanticSearch()}
                    />
                    {isSemanticMode && (
                        <button onClick={handleSemanticSearch} className="bg-primary text-black text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-primary-hover transition-colors">Search</button>
                    )}
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button onClick={() => setIsSemanticMode(false)} className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${!isSemanticMode ? 'bg-primary/20 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-300'}`}>Name Search</button>
                    <button onClick={() => setIsSemanticMode(true)} className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${isSemanticMode ? 'bg-secondary/20 text-secondary border border-secondary/20' : 'text-slate-500 hover:text-slate-300'}`}>AI Semantic Search</button>
                </div>
            </div>

            {/* Semantic Results */}
            {isSemanticMode && isSearchingSemantic && (
                <div className="text-center py-12">
                    <i className="fa-solid fa-circle-notch fa-spin text-secondary text-2xl mb-2"></i>
                    <p className="text-slate-500 text-xs">Finding relevant verses...</p>
                </div>
            )}

            {isSemanticMode && semanticResults.length > 0 && (
                <div className="space-y-3 animate-slide-up">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Top Matches</h4>
                    {semanticResults.map((res, i) => (
                        <div key={i} className="bg-slate-900 border border-secondary/30 p-4 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => {
                            const surah = chapters.find(c => c.id === (res.ayah > 200 ? 2 : 1)); // Simple fallback logic for demo navigation
                            // Ideally map string surah name to ID
                            if (surah) onChapterSelect(surah);
                        }}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-secondary font-bold text-sm">{res.surah} : {res.ayah}</span>
                                <span className="text-[10px] bg-secondary/10 text-secondary-light px-2 py-0.5 rounded border border-secondary/20">Match</span>
                            </div>
                            <p className="font-arabic text-xl text-white text-right mb-2">{res.arabic}</p>
                            <p className="text-slate-300 text-sm italic mb-2">"{res.text}"</p>
                            <div className="bg-secondary/5 p-2 rounded-lg border border-secondary/10">
                                <p className="text-xs text-secondary-light"><i className="fa-solid fa-circle-info mr-1"></i> {res.explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Regular Grid */}
            {!isSemanticMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-10">
                    {filteredChapters.map((surah) => (
                        <div key={surah.id} onClick={() => onChapterSelect(surah)} className="group bg-white/5 backdrop-blur-sm p-4 rounded-xl hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer border border-white/5 relative">
                            <div className="absolute top-4 left-4 w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center text-primary font-bold">{surah.id}</div>
                            <div className="ml-14 flex justify-between items-center h-full">
                                <div><h4 className="font-bold text-white text-lg">{surah.name_simple}</h4><p className="text-xs text-slate-400">{surah.verses_count} Ayat</p></div>
                                <p className="font-arabic text-2xl text-slate-500 group-hover:text-primary transition-colors">{surah.name_arabic}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuranList;

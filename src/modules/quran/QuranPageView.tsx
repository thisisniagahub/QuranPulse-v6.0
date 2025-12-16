import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuran } from './contexts/QuranContext';
import QuranVerseCard from './QuranVerseCard';
import { QuranVerse } from '../../types';

const QuranPageView: React.FC = () => {
    const { 
        verses, 
        selectedChapter, 
        fontSize,
        showTranslation,
        showTransliteration,
        showWordByWord,
        showTajwid,
        selectedWord,
        handleWordClick,
        openVerseStudio,
        setTafsirVerse,
        setNotesVerse,
        setBookmarkVerse,
        toggleBookmark,
        bookmarkedVerses,
        setShareVerse,
        setHafazanVerse
    } = useQuran();

    const [currentPage, setCurrentPage] = useState<number>(0);

    // Group verses by page
    const versesByPage = useMemo(() => {
        const groups: Record<number, QuranVerse[]> = {};
        verses.forEach(v => {
            const page = v.page_number || 0;
            if (!groups[page]) groups[page] = [];
            groups[page].push(v);
        });
        return groups;
    }, [verses]);

    const pages = Object.keys(versesByPage).map(Number).sort((a, b) => a - b);

    // Initial load: Set page to the first page of the Surah
    useEffect(() => {
        if (pages.length > 0) {
            setCurrentPage(pages[0]);
        }
    }, [pages.length, selectedChapter]); // Reset when chapter changes

    const handleNextPage = () => {
        const currentIndex = pages.indexOf(currentPage);
        if (currentIndex < pages.length - 1) {
            setCurrentPage(pages[currentIndex + 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        const currentIndex = pages.indexOf(currentPage);
        if (currentIndex > 0) {
            setCurrentPage(pages[currentIndex - 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const currentVerses = versesByPage[currentPage] || [];

    if (pages.length === 0) return <div className="text-center py-10 text-slate-500">Loading Mushaf Pages...</div>;

    return (
        <div className="pb-32 px-2 sm:px-4">
            {/* Page Navigation Header */}
            <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 py-3 flex justify-between items-center mb-6 shadow-lg">
                <button 
                    onClick={handlePrevPage}
                    disabled={pages.indexOf(currentPage) === 0}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-500/20 hover:text-cyan-400 transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-chevron-left"></i>
                    <span className="hidden sm:inline">Prev Page</span>
                </button>

                <div className="flex flex-col items-center">
                    <span className="text-amber-400 font-bold font-serif text-lg">Page {currentPage}</span>
                    <span className="text-xs text-slate-500">Mushaf Madinah</span>
                </div>

                <button 
                    onClick={handleNextPage}
                    disabled={pages.indexOf(currentPage) === pages.length - 1}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-500/20 hover:text-cyan-400 transition-all flex items-center gap-2"
                >
                    <span className="hidden sm:inline">Next Page</span>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            {/* Page Content - Mushaf Madinah V2 Style Container */}
            <div className="max-w-3xl mx-auto bg-[#151921] rounded-lg overflow-hidden min-h-[80vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative mx-2 sm:mx-auto transition-all duration-500">
                
                {/* 1. Outer Frame (Blue/Gold Theme of Madinah V2) */}
                <div className="absolute inset-0 border-[12px] border-[#233345] pointer-events-none z-20"></div>
                
                {/* 2. Inner Frame (Golden Line) */}
                <div className="absolute inset-3 border-[2px] border-[#d4af37] opacity-60 pointer-events-none z-20 rounded-[2px]"></div>
                
                {/* 3. Corner Ornaments (CSS Generated) */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#d4af37] z-20"></div>
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#d4af37] z-20"></div>
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#d4af37] z-20"></div>
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#d4af37] z-20"></div>

                {/* 4. Paper Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-5 pointer-events-none z-0 mix-blend-overlay"></div>
                
                <div className="p-8 sm:p-10 pt-12 pb-16 h-full flex flex-col relative z-10">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* MUSHAF PAGE RENDERER */}
                            <div className="font-uthmani text-[5vw] sm:text-[32px] leading-[2.6] text-justify text-slate-200 dir-rtl px-4 sm:px-8 py-6 relative z-10" style={{ textAlignLast: 'center' }} dir="rtl">
                                {currentVerses.map((verse, idx) => {
                                    const isSurahStart = verse.verse_key.endsWith(':1');
                                    
                                    return (
                                        <React.Fragment key={verse.id}>
                                            {/* Surah Header - Classic Ornamental Style */}
                                            {isSurahStart && verse.verse_key !== '1:1' && verse.verse_key !== '9:1' && (
                                                <div className="w-full my-8 select-none relative">
                                                    {/* Decorative Header Container */}
                                                    <div className="relative h-16 sm:h-20 bg-[#233345] border-y-2 border-[#d4af37] flex items-center justify-between px-2 sm:px-6 overflow-hidden shadow-lg mx-auto max-w-[95%]">
                                                        
                                                        {/* Pattern Background */}
                                                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                                                        
                                                        {/* Right Ornament (Ayat Count) */}
                                                        <div className="relative z-10 flex items-center gap-2 text-[#d4af37]">
                                                            <div className="hidden sm:block w-8 h-8 border border-[#d4af37] rotate-45 transform bg-[#151921] flex items-center justify-center shadow-inner">
                                                                <span className="-rotate-45 text-[10px] font-bold text-center leading-tight">{selectedChapter?.verses_count}<br/>Ayat</span>
                                                            </div>
                                                            <span className="sm:hidden text-xs font-bold">{selectedChapter?.verses_count} Ayat</span>
                                                        </div>

                                                        {/* Center Title (Surah Name) */}
                                                        <div className="relative z-10 text-center">
                                                            <div className="w-32 sm:w-48 h-10 border-y border-[#d4af37]/30 flex items-center justify-center">
                                                                <h2 className="font-uthmani text-2xl sm:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-[-8px]">
                                                                    سورة {selectedChapter?.name_arabic}
                                                                </h2>
                                                            </div>
                                                        </div>

                                                        {/* Left Ornament (Revelation Place) */}
                                                        <div className="relative z-10 flex items-center gap-2 text-[#d4af37]">
                                                            <span className="sm:hidden text-xs font-bold capitalize">{selectedChapter?.revelation_place}</span>
                                                            <div className="hidden sm:block w-8 h-8 border border-[#d4af37] rotate-45 transform bg-[#151921] flex items-center justify-center shadow-inner">
                                                                <span className="-rotate-45 text-[8px] font-bold uppercase tracking-wider">{selectedChapter?.revelation_place}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Stylized Bismillah */}
                                                    <div className="text-center mt-6 mb-4">
                                                        <p className="font-uthmani text-xl sm:text-2xl text-[#d4af37] opacity-90 drop-shadow-md">
                                                            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Verse Text - Flowing Inline */}
                                            <span 
                                                className={`hover:text-cyan-400 cursor-pointer transition-colors duration-200 ${
                                                    // Simple highlight logic if needed later
                                                    ''
                                                }`}
                                                onClick={() => openVerseStudio(verse)}
                                            >
                                                {verse.text_uthmani}{' '}
                                            </span>
                                            
                                            {/* Ayah Marker (End) */}
                                            <span className="inline-flex items-center justify-center mx-1 align-middle select-none h-[0.9em] w-[0.9em] relative text-amber-400" style={{ fontSize: '0.9em' }}>
                                                <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full text-amber-500/80 fill-current opacity-80">
                                                    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    {/* Decorative petals */}
                                                    <path d="M20 2a2 2 0 0 1 2 2v32a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z" opacity="0.5" />
                                                    <path d="M2 20a2 2 0 0 1 2-2h32a2 2 0 0 1 0 4H4a2 2 0 0 1-2-2z" opacity="0.5" />
                                                </svg>
                                                <span className="relative z-10 font-sans font-bold text-[0.4em] text-amber-100 pt-0.5">
                                                    {verse.verse_key.split(':')[1]}
                                                </span>
                                            </span>
                                            {' '}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                {/* Page Footer */}
                <div className="absolute bottom-2 left-0 w-full text-center pb-2">
                    <span className="text-[10px] text-slate-600">{selectedChapter?.name_simple} • Juz {currentVerses[0]?.words?.[0]?.page_number || ''}</span>
                </div>
            </div>
        </div>
    );
};

export default QuranPageView;

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuran } from '../../contexts/QuranContext';
import { QuranVerse } from '../../../../types';

const QuranPageView: React.FC = () => {
    const {
        verses,
        selectedChapter,
        openVerseStudio,
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
    }, [pages.length, selectedChapter]);

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

    if (pages.length === 0) return <div className="text-center py-20 text-slate-500 font-serif">Loading Mushaf...</div>;

    return (
        <div className="pb-32 px-0 sm:px-4 bg-[#0a0a0f] min-h-screen">
            {/* Minimalist Page Navigation */}
            <div className="sticky top-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5 py-3 px-4 flex justify-between items-center shadow-2xl">
                <button
                    onClick={handlePrevPage}
                    disabled={pages.indexOf(currentPage) === 0}
                    className="w-10 h-10 rounded-full bg-white/5 text-slate-400 disabled:opacity-20 hover:bg-teal-500/20 hover:text-teal-400 transition-all flex items-center justify-center"
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </button>

                <div className="flex flex-col items-center">
                    <span className="text-amber-100/90 font-serif text-lg tracking-widest">PAGE {currentPage}</span>
                    <span className="text-[10px] text-teal-500/60 uppercase tracking-[0.2em]">{selectedChapter?.name_simple}</span>
                </div>

                <button
                    onClick={handleNextPage}
                    disabled={pages.indexOf(currentPage) === pages.length - 1}
                    className="w-10 h-10 rounded-full bg-white/5 text-slate-400 disabled:opacity-20 hover:bg-teal-500/20 hover:text-teal-400 transition-all flex items-center justify-center"
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            {/* THE MUSHAF CONTAINER (Madinah V3 - Dark Royal Edition) */}
            <div className="max-w-[700px] mx-auto mt-4 sm:mt-8 relative transition-all duration-700">
                
                {/* Book Spine Shadow (3D Effect) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-black/50 blur-[2px] z-0"></div>

                {/* Main Page Body */}
                <div className="bg-[#18181b] sm:rounded-[4px] shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-[#2a2a30] relative overflow-hidden">
                    
                    {/* Inner Content Frame (Double Border) */}
                    <div className="absolute top-3 bottom-3 left-3 right-3 border border-[#d4af37]/30 pointer-events-none z-10"></div>
                    <div className="absolute top-4 bottom-4 left-4 right-4 border border-[#d4af37]/10 pointer-events-none z-10"></div>

                    {/* Paper Texture & Grain */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none z-0"></div>

                    <div className="p-6 sm:p-10 pt-12 pb-16 min-h-[85vh] flex flex-col relative z-20">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, filter: 'blur(4px)' }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {/* TEXT RENDERER */}
                                <div className="font-uthmani text-[6.5vw] sm:text-[34px] leading-[2.1] text-justify text-[#e2e8f0] dir-rtl relative z-10 antialiased" style={{ textAlignLast: 'center' }} dir="rtl">
                                    {currentVerses.map((verse, idx) => {
                                        const isSurahStart = verse.verse_key.endsWith(':1');

                                        return (
                                            <React.Fragment key={verse.id}>
                                                {/* Surah Header - The "Taj" (Crown) */}
                                                {isSurahStart && verse.verse_key !== '1:1' && verse.verse_key !== '9:1' && (
                                                    <div className="w-full my-10 select-none relative group">
                                                        <div className="h-[70px] bg-[#1e293b] border-y border-[#d4af37]/40 flex items-center justify-center relative overflow-hidden shadow-lg mx-auto max-w-[98%]">
                                                            {/* Pattern */}
                                                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat"></div>
                                                            
                                                            {/* Title */}
                                                            <div className="relative z-10 bg-[#0f172a] px-8 py-1 border border-[#d4af37]/20 rounded-full shadow-2xl">
                                                                <h2 className="font-uthmani text-2xl sm:text-3xl text-[#fbbf24] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] pt-2">
                                                                    سورة {selectedChapter?.name_arabic}
                                                                </h2>
                                                            </div>
                                                        </div>

                                                        {/* Bismillah */}
                                                        <div className="text-center mt-6 mb-2">
                                                            <p className="font-uthmani text-xl sm:text-2xl text-[#94a3b8] opacity-80">
                                                                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Verse Text */}
                                                <span
                                                    className="hover:text-teal-300 cursor-pointer transition-colors duration-200 decoration-clone"
                                                    onClick={() => openVerseStudio(verse)}
                                                >
                                                    {verse.text_uthmani}
                                                </span>

                                                {/* Ayah Marker (Golden Rosette) */}
                                                <span className="inline-flex items-center justify-center mx-1.5 align-middle select-none h-[0.85em] w-[0.85em] relative text-[#d4af37] opacity-90 hover:scale-110 transition-transform cursor-default">
                                                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                                                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3" />
                                                        <path d="M50 2 L50 98 M2 50 L98 50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                                                        <circle cx="50" cy="50" r="18" fill="currentColor" opacity="0.1" />
                                                    </svg>
                                                    <span className="relative z-10 font-sans font-bold text-[0.35em] text-[#fef3c7] pt-1">
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

                    {/* Page Number Footer */}
                    <div className="absolute bottom-4 left-0 w-full text-center z-20">
                        <span className="text-xs font-serif font-bold text-[#52525b] tracking-widest">{currentPage}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuranPageView;
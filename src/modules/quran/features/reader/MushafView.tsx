/**
 * 📖 Digital Mushaf View
 * Authentic Mushaf reading experience with Raudhah-themed frame
 * 
 * Features:
 * - 604-page digital mushaf layout
 * - Raudhah glassmorphism frame design
 * - Uthmani script display
 * - Book-like page flip animation
 * - Tajwid color coding support
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, BookOpen, Bookmark,
    Settings, Maximize2, Minimize2, Layers, Moon, Sun
} from 'lucide-react';
import { getMushafPage } from '@/services/quranService';

interface MushafViewProps {
    initialPage?: number;
    onPageChange?: (page: number) => void;
    onVerseClick?: (surahNumber: number, verseNumber: number) => void;
    className?: string;
}

interface MushafPage {
    pageNumber: number;
    juzNumber: number;
    hizbNumber: number;
    verses: MushafVerse[];
}

interface MushafVerse {
    id: number;
    verseNumber: number; // relative to surah
    surahNumber: number;
    surahName: string;
    arabicText: string;
    verseKey: string;
}

const TOTAL_PAGES = 604;

const MushafView: React.FC<MushafViewProps> = ({
    initialPage = 1,
    onPageChange,
    onVerseClick,
    className = ''
}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isNightMode, setIsNightMode] = useState(true);
    const [pageData, setPageData] = useState<MushafPage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    // Load page data
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const loadPage = async () => {
            try {
                const data = await getMushafPage(currentPage);
                if (!isMounted) return;

                const firstVerse = data.verses[0];
                const processedPage: MushafPage = {
                    pageNumber: data.page_number,
                    juzNumber: firstVerse?.juz_number || 1,
                    hizbNumber: firstVerse?.hizb_number || 1,
                    verses: data.verses.map((v: any) => {
                        const [surahNum, verseNum] = v.verse_key.split(':').map(Number);
                        return {
                            id: v.id,
                            verseNumber: verseNum,
                            surahNumber: surahNum,
                            surahName: v.surah_name,
                            arabicText: v.text_uthmani,
                            verseKey: v.verse_key
                        };
                    })
                };

                setPageData(processedPage);
            } catch (err) {
                console.error("Failed to load page", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadPage();
        return () => { isMounted = false; };
    }, [currentPage]);

    // Navigate pages
    const goToPage = useCallback((page: number, dir: 'left' | 'right') => {
        if (page >= 1 && page <= TOTAL_PAGES) {
            setDirection(dir);
            setCurrentPage(page);
            onPageChange?.(page);
        }
    }, [onPageChange]);

    const nextPage = () => goToPage(currentPage + 1, 'left');
    const prevPage = () => goToPage(currentPage - 1, 'right');

    // Handle swipe
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x > threshold) {
            nextPage(); // Swipe right = next page in RTL
        } else if (info.offset.x < -threshold) {
            prevPage(); // Swipe left = prev page in RTL
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Page animation variants
    const pageVariants = {
        enter: (dir: 'left' | 'right') => ({
            x: dir === 'left' ? -300 : 300,
            opacity: 0,
            rotateY: dir === 'left' ? 15 : -15,
        }),
        center: {
            x: 0,
            opacity: 1,
            rotateY: 0,
        },
        exit: (dir: 'left' | 'right') => ({
            x: dir === 'left' ? 300 : -300,
            opacity: 0,
            rotateY: dir === 'left' ? -15 : 15,
        }),
    };

    return (
        <div
            className={`relative h-full flex flex-col ${className}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* === RAUDHAH FRAME === */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-24 h-24">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path
                            d="M0,100 Q0,0 100,0"
                            fill="none"
                            stroke="url(#cornerGradient)"
                            strokeWidth="2"
                            className="opacity-60"
                        />
                        <defs>
                            <linearGradient id="cornerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 transform rotate-90">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path
                            d="M0,100 Q0,0 100,0"
                            fill="none"
                            stroke="url(#cornerGradient)"
                            strokeWidth="2"
                            className="opacity-60"
                        />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24 transform -rotate-90">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path
                            d="M0,100 Q0,0 100,0"
                            fill="none"
                            stroke="url(#cornerGradient)"
                            strokeWidth="2"
                            className="opacity-60"
                        />
                    </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 transform rotate-180">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path
                            d="M0,100 Q0,0 100,0"
                            fill="none"
                            stroke="url(#cornerGradient)"
                            strokeWidth="2"
                            className="opacity-60"
                        />
                    </svg>
                </div>

                {/* Side Borders with Glow */}
                <div className="absolute left-0 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
                <div className="absolute right-0 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
                <div className="absolute top-0 left-24 right-24 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                <div className="absolute bottom-0 left-24 right-24 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                {/* Islamic Geometric Pattern Overlay */}
                <div className="absolute inset-8 border border-cyan-500/10 rounded-lg"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, transparent 98%, rgba(6,182,212,0.03) 100%)`,
                        backgroundSize: '20px 20px'
                    }}
                />
            </div>

            {/* === HEADER === */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 p-4 flex items-center justify-between
                       bg-gradient-to-b from-slate-900/90 to-transparent"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 
                             backdrop-blur-sm border border-cyan-500/30 rounded-xl 
                             flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Digital Mushaf</h2>
                                {pageData && (
                                    <p className="text-xs text-slate-400">
                                        Juz {pageData.juzNumber} • Page {pageData.pageNumber}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsNightMode(!isNightMode)}
                                className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                {isNightMode ? (
                                    <Moon className="w-4 h-4 text-cyan-400" />
                                ) : (
                                    <Sun className="w-4 h-4 text-amber-400" />
                                )}
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="w-4 h-4 text-slate-400" />
                                ) : (
                                    <Maximize2 className="w-4 h-4 text-slate-400" />
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === MUSHAF PAGE CONTENT === */}
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentPage}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'tween', duration: 0.3 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={handleDragEnd}
                        className="absolute inset-0 flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
                    >
                        {/* Page Container with Glassmorphism */}
                        <div className={`relative w-full max-w-2xl aspect-[3/4] rounded-2xl overflow-hidden
                           ${isNightMode
                                ? 'bg-slate-900/80 border border-cyan-500/20'
                                : 'bg-amber-50/90 border border-amber-200'
                            } backdrop-blur-xl shadow-2xl`}
                            style={{
                                boxShadow: isNightMode
                                    ? '0 0 60px rgba(6,182,212,0.1), inset 0 0 30px rgba(6,182,212,0.05)'
                                    : '0 0 60px rgba(245,158,11,0.1)'
                            }}
                        >
                            {/* Page Inner Border */}
                            <div className={`absolute inset-3 rounded-xl border ${isNightMode ? 'border-cyan-500/10' : 'border-amber-300/30'
                                }`} />

                            {/* Verses Content */}
                            <div className="px-6 py-4 h-full overflow-y-auto no-scrollbar">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
                                    </div>
                                ) : (
                                    <div className="text-center leading-[3] text-right pt-4" dir="rtl">
                                        {pageData?.verses.map((verse, index) => (
                                            <React.Fragment key={verse.id}>
                                                {/* DYNAMIC SURAH HEADER */}
                                                {verse.verseNumber === 1 && (
                                                    <div className="pt-6 pb-2 text-center w-full clear-both">
                                                        <div className={`inline-block px-8 py-2 rounded-full mb-4 ${isNightMode
                                                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                                                            : 'bg-gradient-to-r from-amber-200/50 to-amber-300/50 border border-amber-400/30'
                                                            }`}>
                                                            <span className={`text-2xl font-arabic ${isNightMode ? 'text-cyan-300' : 'text-amber-800'
                                                                }`}>
                                                                سورة {verse.surahName}
                                                            </span>
                                                        </div>
                                                        {verse.surahNumber !== 1 && verse.surahNumber !== 9 && (
                                                            <div className="text-center py-2 mb-2">
                                                                <span className={`text-2xl font-arabic ${isNightMode ? 'text-purple-300' : 'text-amber-700'
                                                                    }`}>
                                                                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <span
                                                    className={`text-2xl md:text-3xl font-arabic cursor-pointer
                                     hover:text-cyan-400 transition-colors ${isNightMode ? 'text-white' : 'text-slate-800'
                                                        }`}
                                                    onClick={() => onVerseClick?.(verse.surahNumber, verse.verseNumber)}
                                                >
                                                    {verse.arabicText}
                                                </span>
                                                {/* Verse Number Marker */}
                                                <span className={`inline-flex items-center justify-center 
                                         w-8 h-8 mx-1 text-sm rounded-full ${isNightMode
                                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                                        : 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
                                                    }`}>
                                                    {verse.verseNumber}
                                                </span>
                                                {' '}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Page Number */}
                            <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                                <span className={`px-4 py-1 rounded-full text-sm ${isNightMode
                                    ? 'bg-slate-800/80 text-slate-400'
                                    : 'bg-amber-100/80 text-amber-700'
                                    }`}>
                                    {currentPage}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <AnimatePresence>
                    {showControls && (
                        <>
                            {/* Previous (Right side for RTL) */}
                            {currentPage > 1 && (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onClick={prevPage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 
                            w-12 h-12 bg-slate-800/80 backdrop-blur-sm
                            border border-cyan-500/30 rounded-full
                            flex items-center justify-center
                            hover:bg-cyan-500/20 hover:border-cyan-500/50
                            transition-all shadow-lg shadow-cyan-500/10"
                                >
                                    <ChevronRight className="w-6 h-6 text-cyan-400" />
                                </motion.button>
                            )}

                            {/* Next (Left side for RTL) */}
                            {currentPage < TOTAL_PAGES && (
                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onClick={nextPage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 
                            w-12 h-12 bg-slate-800/80 backdrop-blur-sm
                            border border-purple-500/30 rounded-full
                            flex items-center justify-center
                            hover:bg-purple-500/20 hover:border-purple-500/50
                            transition-all shadow-lg shadow-purple-500/10"
                                >
                                    <ChevronLeft className="w-6 h-6 text-purple-400" />
                                </motion.button>
                            )}
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* === FOOTER CONTROLS === */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="relative z-10 p-4 flex items-center justify-between
                       bg-gradient-to-t from-slate-900/90 to-transparent"
                    >
                        {/* Page Slider */}
                        <div className="flex-1 px-4">
                            <input
                                type="range"
                                min="1"
                                max={TOTAL_PAGES}
                                value={currentPage}
                                onChange={(e) => goToPage(parseInt(e.target.value), 'left')}
                                title="Pilih halaman"
                                aria-label="Pilih halaman"
                                className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-gradient-to-r
                          [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-purple-500
                          [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/25"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>1</span>
                                <span>Page {currentPage} / {TOTAL_PAGES}</span>
                                <span>{TOTAL_PAGES}</span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 ml-4">
                            <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors" title="Penanda buku">
                                <Bookmark className="w-4 h-4 text-amber-400" />
                            </button>
                            <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors" title="Senarai halaman">
                                <Layers className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glow Effects */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
        </div>
    );
};

export default MushafView;

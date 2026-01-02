import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, Mic, Play, Square, BookOpen, Info, Settings, X, GraduationCap, CheckCircle } from 'lucide-react';
import InteractiveSegment from './components/InteractiveSegment';
import { useIqraAudio, useVoiceRecorder } from './hooks/useIqraTools';
import { LetterInfo } from './data/letterData';
import { IQRA_MASTER_DATA } from './data/master-index';
import { adaptStrictToVolume } from './data/adapter';
import { IqraVolume, IqraSection } from './data/types';
import { getResponsiveGridClass } from '../../utils/gridUtils';
import { classifyAudio, mockClassifyAudio } from '../../services/iqraService';
import { useIqraStore } from './store/iqraStore';

// Initial Empty Volume
const INITIAL_VOLUME: IqraVolume = {
    id: 'iqra-1',
    title: 'IQRA 1',
    pages: []
};

interface IqraDigitalReaderProps {
    onClose?: () => void;
    initialPage?: number;
}

const IqraDigitalReader: React.FC<IqraDigitalReaderProps> = ({ onClose, initialPage }) => {
    // State
    const [level, setLevel] = useState(1);
    const [pageIndex, setPageIndex] = useState(initialPage || 0); // 0-based index
    const [volumeData, setVolumeData] = useState<IqraVolume>(INITIAL_VOLUME);
    const isFirstRun = useRef(true);

    // Interactive State
    const [activeSegment, setActiveSegment] = useState<string | null>(null);
    const [activeInfo, setActiveInfo] = useState<LetterInfo | null>(null);
    const [showTools, setShowTools] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [showCover, setShowCover] = useState(true);

    // Hooks
    const { speak } = useIqraAudio();
    const { isRecording, startRecording, stopRecording, audioUrl, playRecording } = useVoiceRecorder();
    const { completePage, unlockNextPage, getStars, setLastRead } = useIqraStore();

    // Verification State
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'listening' | 'processing' | 'correct' | 'incorrect'>('idle');
    const [confidence, setConfidence] = useState(0);

    // Track Last Read
    useEffect(() => {
        setLastRead(level, pageIndex);
    }, [level, pageIndex]);

    // Load Data on Level Change
    useEffect(() => {
        const rawData = IQRA_MASTER_DATA[level];
        if (rawData) {
            const adaptedVolume = adaptStrictToVolume(level, rawData);
            setVolumeData(adaptedVolume);
        }

        if (isFirstRun.current) {
            isFirstRun.current = false;
            // Respect key prop or initialPage
        } else {
            setPageIndex(0); // Reset only on manual level change
        }

        setActiveSegment(null);
        setActiveInfo(null);
        setShowTools(false);
        setCheckedItems(new Set());
        setShowCover(true);
    }, [level]);

    const currentPage: IqraSection | undefined = volumeData.pages[pageIndex];

    // Handlers
    const handleSegmentClick = (text: string, info: any) => {
        setActiveSegment(text);
        setActiveInfo(info);
        setShowTools(true);
    };

    const toggleChecklist = (itemIdx: number) => {
        const key = `${level}-${pageIndex}-${itemIdx}`;
        setCheckedItems(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const handleNextPage = () => {
        if (pageIndex < volumeData.pages.length - 1) {
            setPageIndex(pageIndex + 1);
            setActiveSegment(null);
        }
    };

    const handlePrevPage = () => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
            setActiveSegment(null);
        }
    };

    if (!currentPage) {
        return <div className="h-full flex items-center justify-center text-[#5ab9ff]">Loading Iqra Data...</div>;
    }

    const page = pageIndex + 1;
    const pages = volumeData.pages.map(p => p.image);

    return (
        <div className="h-full bg-background-dark text-slate-100 flex flex-col relative overflow-hidden mesh-gradient">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 -left-20 w-64 h-64 md:w-[30rem] md:h-[30rem] bg-primary/10 rounded-full blur-3xl md:blur-[120px]"></div>
                <div className="absolute bottom-0 -right-20 w-64 h-64 md:w-[30rem] md:h-[30rem] bg-blue-600/10 rounded-full blur-3xl md:blur-[120px]"></div>
                <div className="absolute inset-0 bg-pattern opacity-[0.03]"></div>
            </div>

            {/* Top Toolbar (HUD Style) */}
            <nav className="flex-none p-4 z-20 relative w-full">
                <div className="max-w-4xl mx-auto glass-hud p-2 md:p-3 rounded-2xl flex items-center justify-center md:justify-between border-white/5 hud-border relative min-h-[60px]">

                    {/* Back Button (Mobile: Absolute Left, Desktop: Static) */}
                    <div className="absolute left-2 md:static md:flex md:items-center md:gap-4 z-20">
                        <button
                            onClick={onClose}
                            title="Close"
                            aria-label="Close"
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/10"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    {/* Logo Wrapper (Mobile: Centered, Desktop: Flex) */}
                    <div className="flex items-center gap-3 z-10 md:absolute md:left-20 lg:left-24">
                        <img
                            src="/logo.png"
                            alt="QuranPulse Logo"
                            className="h-10 md:h-[50px] w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            width="60"
                            height="60"
                        />
                        <div className="hidden md:flex flex-col border-l border-white/10 pl-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Protocol.VIEWER</span>
                            <h2 className="text-white font-black text-xs md:text-sm glow-text uppercase">IQRA {level}</h2>
                        </div>
                    </div>

                    {/* Level Selector (Mobile: Absolute Right & Scaled, Desktop: Static) */}
                    <div className="absolute right-2 md:static z-20">
                        <div className="flex gap-1 scale-75 md:scale-100 origin-right hover:scale-100 transition-transform bg-black/40 md:bg-transparent p-1 rounded-lg backdrop-blur-md md:backdrop-blur-none">
                            {[1, 2, 3, 4, 5, 6].map(l => (
                                <button
                                    key={l}
                                    title={`Level ${l}`}
                                    aria-label={`Select Level ${l}`}
                                    onClick={() => setLevel(l)}
                                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${level === l ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]' : 'bg-white/5 text-slate-500 hover:bg-white/10 hidden sm:block'}`} // Hide inactive levels on tiny screens if needed, or just show active? keeping standard for now
                                >
                                    {l}
                                </button>
                            ))}
                            {/* Mobile only active level indicator if space is tight? For now strictly keeping buttons */}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Reader View */}
            <main className="flex-1 relative z-10 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {showCover ? (
                        <motion.div
                            key="cover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-8 backdrop-blur-md md:backdrop-blur-2xl"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative w-full max-w-[16rem] aspect-[3/4] md:w-72 md:h-96 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)] border-4 border-white/5 hud-border bg-black/20"
                            >
                                <img
                                    src={`/src/assets/iqra/iqra-lesson-${level}.png`}
                                    srcSet={`/src/assets/iqra/iqra-lesson-${level}.png 1x, /src/assets/iqra/iqra-lesson-${level}@2x.png 2x`}
                                    sizes="(max-width: 768px) 200px, 300px"
                                    className="w-full h-full object-cover grayscale-[0.2]"
                                    alt={`Iqra ${level}`}
                                    decoding="async"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-60"></div>
                            </motion.div>
                            <div className="text-center mt-12 space-y-4">
                                <h3 className="text-4xl font-black text-white glow-text tracking-widest uppercase">IQRA' {level}</h3>
                                <p className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase neon-glow-primary">Initialize.Data_Stream</p>
                            </div>
                            <button
                                onClick={() => setShowCover(false)}
                                className="mt-8 md:mt-12 bg-primary text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] active:scale-95 transition-all text-[10px] md:text-xs border border-primary/20 hover:bg-primary/90"
                            >
                                MULA_BELAJAR
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`${level}-${page}`}
                            initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 120 }}

                            className="w-full h-full max-w-4xl mx-auto p-2 sm:p-4 md:p-8 flex items-center justify-center"
                        >
                            <div className="relative glass-hud p-4 sm:p-8 rounded-[2rem] md:rounded-[3rem] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] w-full max-h-full overflow-y-auto flex flex-col hud-border custom-scrollbar">
                                {/* Lock Overlay */}
                                {!useIqraStore().isUnlocked(level, pageIndex) && (
                                    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 rounded-[3rem]">
                                        <div className="p-6 bg-white/10 rounded-full mb-4 border border-white/10">
                                            <div className="w-12 h-12 text-slate-400">🔒</div>
                                        </div>
                                        <h3 className="text-2xl font-black text-white glow-text uppercase tracking-widest mb-2">LOCKED</h3>
                                        <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Complete previous page to unlock</p>
                                    </div>
                                )}

                                {/* Page Image as Background or Header */}
                                <div className="relative mb-8 rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                                    <img
                                        src={pages[page - 1]}
                                        // Mobile Performance: Use srcset to serve smaller images on mobile
                                        // Example assumption: filenames like 'page-1-sm.png' exist or handled by CDN
                                        srcSet={`${pages[page - 1]} 1x, ${pages[page - 1]} 2x`}
                                        sizes="(max-width: 768px) 100vw, 800px"
                                        alt={`Iqra ${level} Muka Surat ${page}`}
                                        className="w-full h-auto object-contain max-h-96 grayscale-[0.1] contrast-[1.1] will-change-transform" // will-change avoids repaint
                                        draggable={false}
                                        loading="eager" // LCP element should load immediately
                                        decoding="async" // Decode off main thread
                                        fetchPriority="high"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-20"></div>

                                    {/* Star Badge if completed */}
                                    {useIqraStore().getStars(level, pageIndex) > 0 && (
                                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-yellow-500/30 flex gap-1">
                                            {[...Array(useIqraStore().getStars(level, pageIndex))].map((_, i) => (
                                                <span key={i} className="text-yellow-400 text-xs">⭐</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* The Grid / Rows */}
                                <div className={`w-full space-y-8 pb-12 ${!useIqraStore().isUnlocked(level, pageIndex) ? 'blur-sm pointer-events-none' : ''}`} dir="rtl">
                                    {currentPage.rows.map((row, rowIdx) => (
                                        <div
                                            key={rowIdx}
                                            className="w-full relative group p-3 sm:p-6 rounded-2xl transition-all duration-300 hover:bg-primary/5 border border-transparent hover:border-primary/20"
                                        >
                                            {/* Grid implementation using helper */}
                                            <div className={getResponsiveGridClass(row.segments ? row.segments.length : row.cells.length)} dir="rtl">
                                                {row.segments ? (
                                                    // NEW: Segment-based Rendering
                                                    row.segments.map((segment) => (
                                                        <InteractiveSegment
                                                            key={segment.id}
                                                            text={segment.text}
                                                            isActive={activeSegment === segment.text}
                                                            onClick={handleSegmentClick}
                                                            onPlayAudio={speak}
                                                            fontSize={segment.text.length > 4 ? "text-2xl" : segment.text.length > 2 ? "text-3xl" : "text-4xl md:text-5xl"}
                                                        />
                                                    ))
                                                ) : (
                                                    // LEGACY: String-based Rendering
                                                    row.cells.map((cellText, cellIdx) => (
                                                        <InteractiveSegment
                                                            key={`${rowIdx}-${cellIdx}`}
                                                            text={cellText}
                                                            isActive={activeSegment === cellText}
                                                            onClick={handleSegmentClick}
                                                            onPlayAudio={speak}
                                                            fontSize={cellText.length > 4 ? "text-2xl" : cellText.length > 2 ? "text-3xl" : "text-4xl md:text-5xl"}
                                                        />
                                                    ))
                                                )}
                                            </div>

                                            {row.focus && (
                                                <div className="mt-4 text-center opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[9px] uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                                                        FOKUS: <span className="font-bold text-white ml-1">{row.focus}</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Arrows (HUD Overlay) */}
                {!showCover && (
                    <>
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            title="Previous Page"
                            aria-label="Previous Page"
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all z-20 backdrop-blur-md disabled:opacity-0"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={page === pages.length}
                            title="Next Page"
                            aria-label="Next Page"
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all z-20 backdrop-blur-md disabled:opacity-0"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </>
                )}

                {/* Info Overlay Panel (Right Side) */}
                <AnimatePresence>
                    {showTools && (
                        <motion.div
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            className="absolute right-4 top-24 bottom-24 w-80 glass-hud rounded-[2rem] border-white/5 shadow-2xl z-30 flex flex-col overflow-hidden hud-border"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h3 className="font-black text-xs tracking-widest uppercase flex items-center gap-2 text-primary">
                                    <GraduationCap size={16} /> DATA_ANALYSIS
                                </h3>
                                <button onClick={() => setShowTools(false)} className="text-slate-500 hover:text-white" title="Close Analysis" aria-label="Close Analysis">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                {activeInfo ? (
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <span className="text-7xl font-arabic text-white glow-text">{activeInfo.symbol}</span>
                                            <h4 className="mt-4 font-black text-xl text-primary">{activeInfo.name}</h4>
                                            <p className="text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase">{activeInfo.transliteration}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-[9px] font-black uppercase text-primary tracking-widest mb-2">Makhraj</p>
                                                <p className="text-sm text-slate-300 leading-relaxed font-medium">{activeInfo.makhraj}</p>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-[9px] font-black uppercase text-primary tracking-widest mb-2">Sifat</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {activeInfo.sifat.map(s => (
                                                        <span key={s} className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-bold border border-primary/20">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4 opacity-50">
                                        <Info size={40} strokeWidth={1} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Select character for analysis</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-white/5 border-t border-white/5 space-y-3">
                                {/* TTS Button */}
                                <button
                                    onClick={() => activeSegment && speak(activeSegment)}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px] border border-white/10 mb-2"
                                >
                                    DENGAR (TTS)
                                </button>

                                {/* Verification Button */}
                                <button
                                    onClick={() => {
                                        if (isRecording) {
                                            stopRecording();
                                        } else {
                                            setVerificationStatus('listening');
                                            startRecording(async (blob) => {
                                                setVerificationStatus('processing');
                                                try {
                                                    // REAL AI CALL
                                                    const results = await classifyAudio(blob);

                                                    if (!results || results.length === 0) throw new Error("No results");

                                                    const topResult = results[0];

                                                    // Validation: Check if top aligned phoneme matches target
                                                    // For now, naive check (just score) 
                                                    const success = topResult.score > 0.4; // Low threshold for POC

                                                    setConfidence(topResult.score);
                                                    setVerificationStatus(success ? 'correct' : 'incorrect');

                                                    if (success) {
                                                        // Update Progress
                                                        completePage(level, pageIndex, 3); // 3 stars for perfect Match
                                                        unlockNextPage(level, pageIndex);

                                                        setTimeout(() => {
                                                            setVerificationStatus('idle');
                                                            setShowTools(false);
                                                            setActiveSegment(null);
                                                        }, 1500);
                                                    }
                                                } catch (e) {
                                                    console.error("AI Error", e);
                                                    setVerificationStatus('incorrect'); // Fail gracefully
                                                }
                                            });
                                        }
                                    }}
                                    className={`w-full py-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all ${isRecording
                                        ? 'bg-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                                        : 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02]'
                                        }`}
                                >
                                    {isRecording ? "SEDANG MENDENGAR..." : "SEMAK BACAAN (AI)"}
                                </button>

                                {isRecording && (
                                    <div className="text-center text-[9px] text-slate-400 font-mono mt-2 animate-pulse">
                                        LISTENING_MODE::ACTIVE
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Controls (HUD Style) */}
            {/* Bottom Controls (Compact Float) */}
            <div className="flex-none p-4 z-20 relative flex justify-center">
                <div className="glass-hud p-1.5 rounded-full border-white/5 hud-border flex items-center gap-2 shadow-2xl bg-black/40 backdrop-blur-xl">
                    <button title="Table of Contents" aria-label="Table of Contents" className="p-3 rounded-full hover:bg-white/5 text-slate-400 hover:text-primary transition-colors">
                        <BookOpen size={18} />
                    </button>

                    <div className="w-px h-8 bg-white/5 mx-1"></div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/5">
                        <Volume2 className="text-primary neon-glow-primary" size={16} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white hidden sm:block">Audio_Active</span>
                    </div>

                    <div className="w-px h-8 bg-white/5 mx-1"></div>

                    <button title="Help Info" aria-label="Help Info" className="p-3 rounded-full hover:bg-white/5 text-slate-400 hover:text-primary transition-colors">
                        <Info size={18} />
                    </button>
                </div>
            </div>
        </div >
    );
};

export default IqraDigitalReader;
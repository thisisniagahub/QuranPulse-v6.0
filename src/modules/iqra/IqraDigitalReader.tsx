import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Volume2, Mic, Play, Square,
    BookOpen, Info, Settings, X, GraduationCap, CheckCircle
} from 'lucide-react';
import InteractiveSegment from './components/InteractiveSegment';
import { useIqraAudio, useVoiceRecorder } from './hooks/useIqraTools';
import { LetterInfo } from './data/letterData';
import { IQRA_1, IQRA_2, IQRA_3, IQRA_4, IQRA_5, IQRA_6 } from './data';
import { IqraVolume, IqraSection } from './data/types';
import { getResponsiveGridClass } from '../../utils/gridUtils';

// Map levels to data
const VOLUMES: Record<number, IqraVolume> = {
    1: IQRA_1,
    2: IQRA_2,
    3: IQRA_3,
    4: IQRA_4,
    5: IQRA_5,
    6: IQRA_6
};

interface IqraDigitalReaderProps {
    onClose?: () => void;
}

const IqraDigitalReader: React.FC<IqraDigitalReaderProps> = ({ onClose }) => {
    // State
    const [level, setLevel] = useState(1);
    const [pageIndex, setPageIndex] = useState(0); // 0-based index for pages array
    const [volumeData, setVolumeData] = useState<IqraVolume>(IQRA_1);

    // Interactive State
    const [activeSegment, setActiveSegment] = useState<string | null>(null);
    const [activeInfo, setActiveInfo] = useState<LetterInfo | null>(null);
    const [showTools, setShowTools] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [showCover, setShowCover] = useState(true);

    // Hooks
    const { speak } = useIqraAudio();
    const { isRecording, startRecording, stopRecording, audioUrl, playRecording } = useVoiceRecorder();

    // Load Data on Level Change
    useEffect(() => {
        setVolumeData(VOLUMES[level]);
        setPageIndex(0); // Reset to first page
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
                <div className="absolute top-0 -left-20 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 -right-20 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-pattern opacity-[0.03]"></div>
            </div>

            {/* Top Toolbar (HUD Style) */}
            <div className="flex-none p-4 z-20 relative">
                <div className="max-w-4xl mx-auto glass-hud p-3 rounded-2xl flex items-center justify-between border-white/5 hud-border">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/10"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Protocol.VIEWER</span>
                            <h2 className="text-white font-black text-sm glow-text">IQRA {level}: PG {page} / {pages.length}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6].map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${level === l ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Reader View */}
            <main className="flex-1 relative z-10 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {showCover ? (
                        <motion.div
                            key="cover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-8 backdrop-blur-2xl"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative w-72 h-96 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)] border-4 border-white/5 hud-border"
                            >
                                <img
                                    src={`/src/assets/iqra/iqra-lesson-${level}.png`}
                                    className="w-full h-full object-cover grayscale-[0.2]"
                                    alt={`Iqra ${level}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-60"></div>
                            </motion.div>
                            <div className="text-center mt-12 space-y-4">
                                <h3 className="text-4xl font-black text-white glow-text tracking-widest uppercase">IQRA' {level}</h3>
                                <p className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase neon-glow-primary">Initialize.Data_Stream</p>
                            </div>
                            <button
                                onClick={() => setShowCover(false)}
                                className="mt-12 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] active:scale-95 transition-all text-xs border border-primary/20"
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
                            className="w-full h-full max-w-4xl mx-auto p-4 md:p-8 flex items-center justify-center"
                        >
                            <div className="relative glass-hud p-4 sm:p-8 rounded-[3rem] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] w-full max-h-full overflow-y-auto flex flex-col hud-border custom-scrollbar">
                                {/* Page Image as Background or Header */}
                                <div className="relative mb-8 rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                                    <img
                                        src={pages[page - 1]}
                                        alt={`Iqra ${level} Muka Surat ${page}`}
                                        className="w-full h-auto object-contain max-h-96 grayscale-[0.1] contrast-[1.1]"
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-20"></div>
                                </div>

                                {/* The Grid / Rows */}
                                <div className="w-full space-y-4 pb-12" dir="rtl">
                                    {currentPage.rows.map((row, rowIdx) => (
                                        <div
                                            key={rowIdx}
                                            className="w-full relative group p-6 rounded-2xl transition-all duration-300 hover:bg-primary/5 border border-transparent hover:border-primary/20"
                                        >
                                            {/* Grid implementation using helper */}
                                            <div className={getResponsiveGridClass(row.cells.length)} dir="rtl">
                                                {row.cells.map((cellText, cellIdx) => (
                                                    <InteractiveSegment
                                                        key={`${rowIdx}-${cellIdx}`}
                                                        text={cellText}
                                                        isActive={activeSegment === cellText}
                                                        onClick={handleSegmentClick}
                                                        onPlayAudio={speak}
                                                    />
                                                ))}
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
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all z-20 backdrop-blur-md disabled:opacity-0"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={page === pages.length}
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
                                <button onClick={() => setShowTools(false)} className="text-slate-500 hover:text-white">
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

                            <div className="p-6 bg-white/5 border-t border-white/5">
                                <button
                                    onClick={() => activeSegment && speak(activeSegment)}
                                    className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                                >
                                    PLAY_AUDIO_RELAY
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Controls (HUD Style) */}
            <div className="flex-none p-6 z-20 relative">
                <div className="max-w-4xl mx-auto glass-hud p-2 rounded-2xl border-white/5 hud-border">
                    <div className="flex items-center justify-between">
                        <button className="p-4 text-slate-500 hover:text-primary transition-colors">
                            <BookOpen size={22} />
                        </button>
                        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                            <Volume2 className="text-primary neon-glow-primary" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Audio_Relay.ACTIVE</span>
                        </div>
                        <button className="p-4 text-slate-500 hover:text-primary transition-colors">
                            <Info size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default IqraDigitalReader;
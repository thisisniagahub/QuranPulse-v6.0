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

    // Hooks
    const { speak, isSpeaking } = useIqraAudio();
    const { isRecording, startRecording, stopRecording, audioUrl, playRecording } = useVoiceRecorder();

    // Load Data on Level Change
    useEffect(() => {
        setVolumeData(VOLUMES[level]);
        setPageIndex(0); // Reset to first page
        setActiveSegment(null);
        setActiveInfo(null);
        setShowTools(false);
        setCheckedItems(new Set()); // Reset checklist
    }, [level]);

    const currentPage: IqraSection | undefined = volumeData.pages[pageIndex];

    // Handlers
    const handleSegmentClick = (text: string, info: any) => {
        setActiveSegment(text);
        setActiveInfo(info);
        setShowTools(true); // Open tools panel automatically
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

    const handleNext = () => {
        if (pageIndex < volumeData.pages.length - 1) {
            setPageIndex(p => p + 1);
            setActiveSegment(null);
        }
    };

    const handlePrev = () => {
        if (pageIndex > 0) {
            setPageIndex(p => p - 1);
            setActiveSegment(null);
        }
    };

    if (!currentPage) {
        return <div className="h-full flex items-center justify-center text-[#5ab9ff]">Loading Iqra Data...</div>;
    }

    return (
        <div className="h-full flex flex-col bg-[#051324] text-white overflow-hidden relative">
            
            {/* 1. Header Toolbar */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 bg-[#0e3359]/50 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-[#5ab9ff] text-black w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                        {level}
                    </div>
                    <div>
                        <h1 className="font-bold text-sm line-clamp-1">{currentPage.title}</h1>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{currentPage.subtitle || volumeData.title}</p>
                    </div>
                </div>

                <div className="flex gap-2 shrink-0">
                    {/* Level Selector Pills */}
                    {[1,2,3,4,5,6].map(l => (
                        <button 
                            key={l}
                            onClick={() => setLevel(l)}
                            className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${level === l ? 'bg-white/20 text-white ring-1 ring-white/50' : 'text-slate-500 hover:bg-white/5'}`}
                        >
                            {l}
                        </button>
                    ))}
                    {onClose && (
                        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white ml-2">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Main Content Area (Split View) */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Reader Canvas (Left/Center) */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center bg-[#051324] scrollbar-thin scrollbar-thumb-slate-700">
                    
                    {/* Header Info Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-8 max-w-3xl w-full text-center relative overflow-hidden"
                    >
                        {/* Decorative Bismillah for Page 1 */}
                        {pageIndex === 0 && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50"></div>
                        )}
                        
                        <h2 className="text-xl font-bold text-amber-200 mb-2">{currentPage.title}</h2>
                        {currentPage.subtitle && <p className="text-sm text-amber-400/80 italic">{currentPage.subtitle}</p>}
                        {currentPage.diagramFlow && (
                            <div className="mt-3 text-xs font-mono text-slate-400 bg-black/20 py-1 px-3 rounded-full inline-block border border-white/5">
                                Aliran: {currentPage.diagramFlow}
                            </div>
                        )}
                    </motion.div>

                    {/* The Grid / Rows */}
                    <div className="w-full max-w-4xl space-y-4" dir="rtl">
                        {currentPage.rows.map((row, rowIdx) => (
                            <div 
                                key={rowIdx} 
                                className="w-full relative group p-6 rounded-2xl transition-all duration-300 hover:bg-[#0e3359]/30 border border-transparent hover:border-[#5ab9ff]/20"
                            >
                                {/* Row Label (Left side in LTR, Right side in RTL context - handled by dir="rtl") */}
                                <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[10px] text-slate-700 group-hover:text-[#5ab9ff] font-mono hidden md:block w-8 text-center rotate-90 md:rotate-0 transition-colors">
                                    {row.label}
                                </div>

                                <div className="flex flex-wrap justify-center gap-4 md:gap-6 relative z-10">
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

                                {/* Focus Note for Row - Enhanced */}
                                {row.focus && (
                                    <div className="mt-4 text-center opacity-70 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] uppercase tracking-wider text-[#5ab9ff] bg-[#5ab9ff]/10 px-3 py-1.5 rounded-full border border-[#5ab9ff]/20 shadow-sm">
                                            Fokus: <span className="font-bold text-white ml-1">{row.focus}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Checklist Section - Interactive */}
                    {currentPage.checklist && currentPage.checklist.length > 0 && (
                        <div className="mt-12 max-w-2xl w-full bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6">
                            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                <CheckCircle size={18} /> Semakan Kendiri
                            </h3>
                            <div className="space-y-3">
                                {currentPage.checklist.map((item, idx) => {
                                    const isChecked = checkedItems.has(`${level}-${pageIndex}-${idx}`);
                                    return (
                                        <div 
                                            key={idx} 
                                            onClick={() => toggleChecklist(idx)}
                                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isChecked ? 'bg-emerald-500/10' : 'hover:bg-white/5'}`}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-emerald-500/30'}`}>
                                                {isChecked && <CheckCircle size={14} fill="currentColor" className="text-white" />}
                                            </div>
                                            <p className={`text-sm transition-colors ${isChecked ? 'text-emerald-200 line-through decoration-emerald-500/50' : 'text-slate-300'}`}>
                                                {item}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Footer Notes */}
                    {currentPage.notes && (
                        <div className="mt-8 text-center space-y-2">
                            {currentPage.notes.map((note, idx) => (
                                <p key={idx} className="text-xs text-slate-500 italic">{note}</p>
                            ))}
                        </div>
                    )}

                    <div className="h-20"></div> {/* Spacer */}
                </div>

                {/* 3. Smart Tools Panel (Right Side - Collapsible) */}
                <AnimatePresence>
                    {showTools && (
                        <motion.div 
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="w-80 bg-[#0e3359] border-l border-white/10 flex flex-col shadow-2xl absolute right-0 top-0 bottom-0 z-30 md:relative"
                        >
                            {/* Panel Header */}
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#051324]/50">
                                <h3 className="font-bold flex items-center gap-2">
                                    <GraduationCap className="text-[#5ab9ff]" size={18} />
                                    Studio Pembelajaran
                                </h3>
                                <button onClick={() => setShowTools(false)} className="text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                
                                {/* Info Card */}
                                {activeInfo ? (
                                    <div className="bg-[#154270] rounded-xl p-4 border border-white/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-4xl font-arabic text-[#5ab9ff]">{activeInfo.symbol}</span>
                                            <div className="text-right">
                                                <h4 className="font-bold text-lg">{activeInfo.name}</h4>
                                                <p className="text-xs text-slate-400 font-mono tracking-wider">{activeInfo.transliteration}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Makhraj (Tempat Keluar)</p>
                                                <p className="text-sm font-medium">{activeInfo.makhraj}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Sifat Huruf</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {activeInfo.sifat.map(s => (
                                                        <span key={s} className="px-2 py-0.5 rounded bg-white/10 text-[10px]">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-white/10 mt-2">
                                                <p className="text-xs text-slate-300 italic leading-relaxed">"{activeInfo.desc}"</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeSegment ? (
                                    <div className="text-center py-10 text-slate-500">
                                        <p className="text-4xl mb-4 font-arabic text-white">{activeSegment}</p>
                                        <p className="text-xs">Info terperinci untuk gabungan huruf belum tersedia.</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-slate-500">
                                        <Info className="mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">Klik mana-mana huruf untuk lihat info terperinci.</p>
                                    </div>
                                )}

                                {/* Practice Tools */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Latihan Sebutan</h4>
                                    
                                    {/* AI Audio */}
                                    <button 
                                        onClick={() => activeSegment && speak(activeSegment)}
                                        disabled={!activeSegment}
                                        className="w-full py-3 bg-[#5ab9ff]/10 hover:bg-[#5ab9ff]/20 border border-[#5ab9ff]/30 rounded-xl flex items-center justify-center gap-2 text-[#5ab9ff] transition-all disabled:opacity-50"
                                    >
                                        <Volume2 size={18} />
                                        <span>Dengar Bacaan AI</span>
                                    </button>

                                    {/* Recording */}
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                        <div className="flex justify-center gap-4 mb-4">
                                            <button
                                                onClick={isRecording ? stopRecording : startRecording}
                                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                                    isRecording 
                                                        ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                }`}
                                            >
                                                {isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={24} />}
                                            </button>
                                            
                                            {audioUrl && (
                                                <button
                                                    onClick={playRecording}
                                                    className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 shadow-lg"
                                                >
                                                    <Play size={24} fill="currentColor" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-center text-[10px] text-slate-500">
                                            {isRecording ? "Sedang Merekam..." : audioUrl ? "Rakaman Sedia Dimainkan" : "Tekan mikrofon untuk mula"}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 4. Footer Navigation */}
            <div className="h-16 bg-[#0e3359] border-t border-white/10 px-6 flex items-center justify-between z-20">
                <button 
                    onClick={handlePrev} 
                    disabled={pageIndex === 0} 
                    className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                    <ChevronLeft size={20} /> Sebelumnya
                </button>
                
                <div className="flex flex-col items-center">
                    <span className="text-xs text-[#5ab9ff] font-mono">MS {pageIndex + 1} / {volumeData.pages.length}</span>
                    <div className="flex gap-1 mt-1">
                        {/* Page indicators dots (simplified for performance) */}
                        {volumeData.pages.map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === pageIndex ? 'bg-[#5ab9ff] w-3' : 'bg-white/20'}`}
                            ></div>
                        )).slice(0, 10)} 
                        {volumeData.pages.length > 10 && <span className="text-[8px] text-slate-500">...</span>}
                    </div>
                </div>

                <button 
                    onClick={handleNext} 
                    disabled={pageIndex === volumeData.pages.length - 1}
                    className="flex items-center gap-2 bg-[#5ab9ff] text-black px-4 py-2 rounded-full font-bold hover:bg-[#5ab9ff]/90 disabled:opacity-50 disabled:hover:bg-[#5ab9ff] transition-all"
                >
                    Seterusnya <ChevronRight size={20} />
                </button>
            </div>

        </div>
    );
};

export default IqraDigitalReader;
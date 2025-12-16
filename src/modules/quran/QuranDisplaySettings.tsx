import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSettings, IconClose, IconEye, IconEyeOff, IconFont } from '../../components/Icons';

interface QuranDisplaySettingsProps {
    onClose: () => void;
    // Display Settings
    showTranslation: boolean;
    setShowTranslation: (val: boolean) => void;
    showTransliteration: boolean;
    setShowTransliteration: (val: boolean) => void;
    selectedTranslationId: number;
    setSelectedTranslationId: (id: number) => void;
    fontSize: number;
    setFontSize: (size: number) => void;
    // Reciter Settings
    selectedReciterId?: number;
    setSelectedReciterId?: (id: number) => void;
    // Advanced Settings
    showWordByWord?: boolean;
    setShowWordByWord?: (val: boolean) => void;
    autoScroll?: boolean;
    setAutoScroll?: (val: boolean) => void;
    showTajwid?: boolean;
    setShowTajwid?: (val: boolean) => void;
    repeatMode?: 'none' | 'ayah' | 'surah';
    setRepeatMode?: (mode: 'none' | 'ayah' | 'surah') => void;
    nightMode?: boolean;
    setNightMode?: (val: boolean) => void;
    // Additional Feature Access
    onOpenReadingGoals?: () => void;
    onOpenTheme?: () => void;
    onOpenRangeRepeat?: () => void;
}

// ℹ️ Feature Info Data
const FEATURE_INFO = {
    translation: {
        title: "Paparan Terjemahan",
        desc: "Memaparkan makna setiap ayat dalam bahasa pilihan anda (Melayu/English). Ini membantu anda memahami mesej yang disampaikan oleh Allah SWT.",
        icon: "📝"
    },
    transliteration: {
        title: "Transliterasi (Rumi)",
        desc: "Menunjukkan ejaan rumi untuk setiap ayat. Sangat berguna untuk anda yang masih belajar menyebut ayat Arab dengan lancar.",
        icon: "🔤"
    },
    tajwid: {
        title: "Warna Tajwid",
        desc: "Menandakan hukum tajwid dengan warna-warna khas pada teks Arab. Ia bertindak sebagai panduan visual untuk bacaan yang betul dan tartil.",
        icon: "🎨"
    },
    wordByWord: {
        title: "Terjemahan Perkata",
        desc: "Memaparkan maksud bagi setiap patah perkataan di bawah teks Arab. Sesuai untuk anda yang ingin mendalami kosa kata Al-Quran (Mufradat).",
        icon: "📖"
    }
};

// 🎛️ Control Button (Grid Item)
const ControlBtn = ({ 
    active, 
    onClick, 
    onInfo,
    label, 
    subtitle,
    icon,
    colorClass = "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]"
}: { 
    active: boolean; 
    onClick: () => void; 
    onInfo: (e: React.MouseEvent) => void;
    label: string; 
    subtitle: string;
    icon: React.ReactNode;
    colorClass?: string;
}) => (
    <button 
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 border group ${
            active 
                ? `${colorClass} border-transparent scale-[1.02]` 
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
    >
        {/* Info Icon Button */}
        <div 
            onClick={onInfo}
            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/20 hover:bg-white/20 flex items-center justify-center text-[10px] opacity-60 hover:opacity-100 transition-all z-10"
        >
            <i className="fa-solid fa-info text-current"></i>
        </div>

        <div className={`text-xl mb-1 ${active ? 'scale-110' : 'opacity-50'}`}>{icon}</div>
        <div className="text-center">
            <span className="block text-[11px] font-bold tracking-wide uppercase leading-tight">{label}</span>
            <span className={`block text-[8px] font-medium mt-0.5 ${active ? 'opacity-80' : 'opacity-50'}`}>{subtitle}</span>
        </div>
    </button>
);

// 🌍 Language Pill
const LangPill = ({ active, onClick, label, flag }: { active: boolean, onClick: () => void, label: string, flag: string }) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
            active 
                ? 'bg-cyan-500 text-black shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
    >
        <span className="text-base">{flag}</span>
        {label}
    </button>
);

const QuranDisplaySettings: React.FC<QuranDisplaySettingsProps> = ({
    onClose,
    showTranslation,
    setShowTranslation,
    showTransliteration,
    setShowTransliteration,
    selectedTranslationId,
    setSelectedTranslationId,
    fontSize,
    setFontSize,
    selectedReciterId = 7,
    setSelectedReciterId,
    showWordByWord = true,
    setShowWordByWord,
    autoScroll = true,
    setAutoScroll,
    showTajwid = false,
    setShowTajwid,
    repeatMode = 'none',
    setRepeatMode,
    nightMode = false,
    setNightMode,
}) => {
    const [activeTab, setActiveTab] = useState<'DISPLAY' | 'AUDIO' | 'THEME'>('DISPLAY');

    const reciters = [
        { id: 7, name: "Mishary Rashid Alafasy", style: "Murattal" },
        { id: 13, name: "Ali Al-Hudaifi", style: "Madinah (Klasik)" },
        { id: 14, name: "Ibrahim Al-Akhdar", style: "Madinah (Klasik)" },
        { id: 1, name: "Muhammad Ayyub", style: "Madinah (Emosi)" },
        { id: 3, name: "Abdul Rahman Al-Sudais", style: "Imam Masjidil Haram" },
        { id: 4, name: "Abu Bakr Al-Shatri", style: "Murattal (Jiwa)" },
        { id: 6, name: "Mahmoud Khalil Al-Hussary", style: "Mujawwad (Tartil)" },
    ];

    // Presets Logic
    const setMode = (mode: 'TADABBUR' | 'IQRA' | 'NAHU') => {
        if (mode === 'TADABBUR') {
            setShowTranslation(true);
            setShowTransliteration(false);
            setShowWordByWord?.(false);
        } else if (mode === 'IQRA') {
            setShowTranslation(false);
            setShowTransliteration(true);
            setShowWordByWord?.(false);
        } else if (mode === 'NAHU') {
            setShowTranslation(true);
            setShowTransliteration(false);
            setShowWordByWord?.(true);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center pointer-events-none">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
            />

            <motion.div
                initial={{ y: "100%", scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: "100%", scale: 0.95 }}
                className="relative z-10 w-full max-w-sm mx-auto bg-slate-950 border-t sm:border border-slate-800/60 sm:rounded-[2rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col h-[85vh] sm:h-[600px]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 pb-2">
                    <h3 className="text-xl font-bold text-white">Tetapan</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <IconClose className="w-4 h-4" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex px-6 mb-6 gap-2">
                    {['DISPLAY', 'AUDIO', 'THEME'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                                activeTab === tab 
                                    ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                            }`}
                        >
                            {tab === 'DISPLAY' && '👁️ Paparan'}
                            {tab === 'AUDIO' && '🎧 Audio'}
                            {tab === 'THEME' && '🎨 Tema'}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                    
                    {/* === DISPLAY TAB === */}
                    {activeTab === 'DISPLAY' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            
                            {/* Font Size */}
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                                <div className="flex justify-between mb-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Saiz Tulisan</span>
                                    <span className="text-xs font-mono text-cyan-400">{fontSize}px</span>
                                </div>
                                <div className="h-16 flex items-center justify-center mb-4 relative">
                                    <p className="font-uthmani text-white text-center drop-shadow-md transition-all" style={{ fontSize: `${fontSize}px` }}>
                                        بِسْمِ ٱللَّهِ
                                    </p>
                                </div>
                                <input 
                                    type="range" min="20" max="60" value={fontSize} 
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Reading Modes (Presets) */}
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-slate-400 uppercase px-1">Mod Bacaan Pantas</span>
                                <div className="grid grid-cols-1 gap-3">
                                    {/* Tadabbur Mode */}
                                    <button 
                                        onClick={() => setMode('TADABBUR')}
                                        className={`p-3 rounded-xl border text-left flex items-center gap-4 transition-all ${
                                            showTranslation && !showTransliteration && !showWordByWord 
                                                ? 'bg-emerald-500/10 border-emerald-500 text-white' 
                                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${showTranslation && !showTransliteration && !showWordByWord ? 'bg-emerald-500 text-black' : 'bg-slate-800'}`}>📖</div>
                                        <div>
                                            <p className="font-bold text-sm">Tadabbur (Standard)</p>
                                            <p className="text-[10px] opacity-70">Arab + Terjemahan Sahaja</p>
                                        </div>
                                    </button>

                                    {/* Iqra Mode */}
                                    <button 
                                        onClick={() => setMode('IQRA')}
                                        className={`p-3 rounded-xl border text-left flex items-center gap-4 transition-all ${
                                            !showTranslation && showTransliteration 
                                                ? 'bg-amber-500/10 border-amber-500 text-white' 
                                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${!showTranslation && showTransliteration ? 'bg-amber-500 text-black' : 'bg-slate-800'}`}>🗣️</div>
                                        <div>
                                            <p className="font-bold text-sm">Iqra (Belajar Baca)</p>
                                            <p className="text-[10px] opacity-70">Arab + Rumi Sahaja</p>
                                        </div>
                                    </button>

                                    {/* Nahu Mode */}
                                    <button 
                                        onClick={() => setMode('NAHU')}
                                        className={`p-3 rounded-xl border text-left flex items-center gap-4 transition-all ${
                                            showWordByWord 
                                                ? 'bg-cyan-500/10 border-cyan-500 text-white' 
                                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${showWordByWord ? 'bg-cyan-500 text-black' : 'bg-slate-800'}`}>🔍</div>
                                        <div>
                                            <p className="font-bold text-sm">Nahu (Perkata)</p>
                                            <p className="text-[10px] opacity-70">Arab + Maksud Setiap Kalimah</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* === AUDIO TAB === */}
                    {activeTab === 'AUDIO' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                                <span className="text-sm font-bold text-white">Auto-Scroll</span>
                                <div 
                                    onClick={() => setAutoScroll?.(!autoScroll)}
                                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${autoScroll ? 'bg-cyan-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoScroll ? 'translate-x-5' : 'translate-x-1'}`} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-xs font-bold text-slate-400 uppercase px-1">Pilih Qari</span>
                                {reciters.map(reciter => (
                                    <button
                                        key={reciter.id}
                                        onClick={() => setSelectedReciterId?.(reciter.id)}
                                        className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${
                                            selectedReciterId === reciter.id
                                                ? 'bg-cyan-900/20 border-cyan-500/50'
                                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                            selectedReciterId === reciter.id ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                            🎙️
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className={`font-bold text-sm ${selectedReciterId === reciter.id ? 'text-cyan-400' : 'text-slate-300'}`}>{reciter.name}</p>
                                            <p className="text-[10px] text-slate-500">{reciter.style}</p>
                                        </div>
                                        {selectedReciterId === reciter.id && (
                                            <i className="fa-solid fa-check text-cyan-400 text-xs"></i>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* === THEME TAB === */}
                    {activeTab === 'THEME' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
                                <p className="text-slate-500 text-sm mb-4">Pilihan Tema</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setNightMode?.(false)}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${!nightMode ? 'bg-slate-800 border-cyan-500 text-white' : 'border-slate-800 text-slate-500'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">☀️</div>
                                        <span className="text-xs font-bold">Deep Space</span>
                                    </button>
                                    <button 
                                        onClick={() => setNightMode?.(true)}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${nightMode ? 'bg-black border-cyan-500 text-white' : 'border-slate-800 text-slate-500'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">🌙</div>
                                        <span className="text-xs font-bold">OLED Black</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Tajwid Toggle (Moved here as visual preference) */}
                            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">🎨</div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Warna Tajwid</p>
                                        <p className="text-[10px] text-slate-500">Highlight hukum tajwid</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setShowTajwid?.(!showTajwid)}
                                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${showTajwid ? 'bg-purple-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${showTajwid ? 'translate-x-5' : 'translate-x-1'}`} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default QuranDisplaySettings;

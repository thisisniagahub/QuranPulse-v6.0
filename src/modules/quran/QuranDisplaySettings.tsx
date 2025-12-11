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
    const [view, setView] = useState<'MAIN' | 'RECITERS'>('MAIN');
    const [infoModal, setInfoModal] = useState<keyof typeof FEATURE_INFO | null>(null);

    const reciters = [
        { id: 7, name: "Mishary Rashid Alafasy", style: "Murattal" },
        { id: 3, name: "Abdul Rahman Al-Sudais", style: "Imam Masjidil Haram" },
        { id: 4, name: "Abu Bakr Al-Shatri", style: "Murattal" },
        { id: 6, name: "Mahmoud Khalil Al-Hussary", style: "Mujawwad" },
    ];

    const currentReciter = reciters.find(r => r.id === selectedReciterId) || reciters[0];

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
                className="relative z-10 w-full max-w-sm mx-auto bg-slate-950/90 border-t sm:border border-slate-800/60 sm:rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* INFO MODAL OVERLAY */}
                <AnimatePresence>
                    {infoModal && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                {FEATURE_INFO[infoModal].icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{FEATURE_INFO[infoModal].title}</h4>
                            <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                {FEATURE_INFO[infoModal].desc}
                            </p>
                            <button 
                                onClick={() => setInfoModal(null)}
                                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors w-full"
                            >
                                Faham, Terima Kasih
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {view === 'MAIN' ? (
                        <motion.div 
                            key="main"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="p-6 space-y-6 overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Tetapan</h3>
                                </div>
                                <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                    <IconClose className="w-4 h-4" />
                                </button>
                            </div>

                            {/* 1. Preview & Slider */}
                            <div className="space-y-4">
                                <div className="h-20 flex items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800/50 relative overflow-hidden group">
                                     <div className="absolute inset-0 bg-grid-slate-800/[0.05] bg-[bottom_1px] bg-[size:24px_24px]" />
                                     <p className="font-uthmani text-white relative z-10 transition-all duration-300 drop-shadow-lg" style={{ fontSize: `${fontSize}px` }}>
                                        بِسْمِ ٱللَّهِ
                                    </p>
                                    <span className="absolute bottom-3 right-4 text-[10px] font-mono text-cyan-500/50">{fontSize}px</span>
                                </div>
                                <input 
                                    type="range" min="20" max="60" value={fontSize} 
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer hover:bg-slate-700 transition-colors"
                                />
                            </div>

                            {/* 2. Expanded Translation Section */}
                            <div className={`p-4 rounded-3xl border transition-all duration-300 relative ${showTranslation ? 'bg-cyan-900/10 border-cyan-500/30' : 'bg-slate-900/40 border-slate-800'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showTranslation ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                                            <IconEye className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm font-bold ${showTranslation ? 'text-white' : 'text-slate-400'}`}>Terjemahan</p>
                                                {/* Info Icon for Translation */}
                                                <button onClick={() => setInfoModal('translation')} className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] text-slate-400 hover:text-white">
                                                    <i className="fa-solid fa-info"></i>
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-slate-500">Papar makna ayat</p>
                                        </div>
                                    </div>
                                    {/* Toggle Switch */}
                                    <div 
                                        onClick={() => setShowTranslation(!showTranslation)}
                                        className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${showTranslation ? 'bg-cyan-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${showTranslation ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                </div>
                                
                                <AnimatePresence>
                                    {showTranslation && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-2 flex gap-2">
                                                <LangPill label="Melayu" flag="🇲🇾" active={selectedTranslationId === 39} onClick={() => setSelectedTranslationId(39)} />
                                                <LangPill label="English" flag="🇺🇸" active={selectedTranslationId === 131} onClick={() => setSelectedTranslationId(131)} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* 3. Secondary Toggles Grid with Info */}
                            <div className="grid grid-cols-3 gap-3">
                                <ControlBtn 
                                    active={showTransliteration} 
                                    onClick={() => setShowTransliteration(!showTransliteration)}
                                    onInfo={(e) => { e.stopPropagation(); setInfoModal('transliteration'); }}
                                    label="Rumi"
                                    subtitle="Bantuan Bacaan"
                                    icon={<IconFont className="w-6 h-6" />}
                                    colorClass="bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                />
                                <ControlBtn 
                                    active={!!showTajwid} 
                                    onClick={() => setShowTajwid?.(!showTajwid)}
                                    onInfo={(e) => { e.stopPropagation(); setInfoModal('tajwid'); }}
                                    label="Tajwid"
                                    subtitle="Warna Hukum"
                                    icon={<span className="font-uthmani text-xl">ت</span>}
                                    colorClass="bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                />
                                <ControlBtn 
                                    active={!!showWordByWord} 
                                    onClick={() => setShowWordByWord?.(!showWordByWord)}
                                    onInfo={(e) => { e.stopPropagation(); setInfoModal('wordByWord'); }}
                                    label="Perkata"
                                    subtitle="Faham Maksud"
                                    icon={<span className="text-xl">📖</span>}
                                    colorClass="bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                                />
                            </div>

                            {/* Rumi TTS Settings - Shows when Rumi is enabled */}
                            <AnimatePresence>
                                {showTransliteration && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 rounded-2xl bg-emerald-900/10 border border-emerald-500/20 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-emerald-400">🔊</span>
                                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Tetapan Rumi TTS</span>
                                            </div>
                                            
                                            {/* TTS Speed Slider */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-400">Kelajuan Bacaan</span>
                                                    <span className="text-xs font-mono text-emerald-400">0.8x</span>
                                                </div>
                                                <input 
                                                    type="range" min="50" max="150" defaultValue="80"
                                                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer"
                                                />
                                                <div className="flex justify-between text-[9px] text-slate-600">
                                                    <span>Perlahan</span>
                                                    <span>Normal</span>
                                                    <span>Laju</span>
                                                </div>
                                            </div>
                                            
                                            {/* Rumi Mode Toggle */}
                                            <div className="flex gap-2">
                                                <button className="flex-1 py-2 px-3 bg-emerald-500 text-black text-[10px] font-bold rounded-lg">
                                                    🇲🇾 JAKIM
                                                </button>
                                                <button className="flex-1 py-2 px-3 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg hover:bg-slate-700">
                                                    📚 Akademik
                                                </button>
                                            </div>
                                            
                                            {/* Syllable Toggle */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-white font-medium">Papar Suku Kata</p>
                                                    <p className="text-[9px] text-slate-500">bis-mil-lāh</p>
                                                </div>
                                                <div className="w-10 h-6 rounded-full bg-slate-700 relative cursor-pointer">
                                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 4. Audio Section */}
                            <div className="pt-4 border-t border-slate-800/50 space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Audio</span>
                                    <button 
                                        onClick={() => setAutoScroll?.(!autoScroll)}
                                        className={`px-3 py-1.5 rounded-full text-[9px] font-bold border transition-all ${
                                            autoScroll 
                                             ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                                             : 'bg-slate-800 border-slate-700 text-slate-500'
                                        }`}
                                    >
                                        AUTOSCROLL {autoScroll ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={() => setView('RECITERS')}
                                    className="w-full flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                                            🎙️
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-white text-sm">{currentReciter.name}</p>
                                            <p className="text-[10px] text-slate-500">{currentReciter.style}</p>
                                        </div>
                                    </div>
                                    <i className="fa-solid fa-chevron-right text-xs text-slate-600 group-hover:text-white transition-colors"></i>
                                </button>
                            </div>

                        </motion.div>
                    ) : (
                        <motion.div 
                            key="reciters"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            className="flex flex-col h-full bg-slate-950"
                        >
                            {/* Sub-Header */}
                            <div className="flex items-center gap-4 p-6 border-b border-slate-800">
                                <button onClick={() => setView('MAIN')} className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white border border-slate-800">
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <h3 className="font-bold text-white text-lg">Pilih Qari</h3>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {reciters.map(reciter => (
                                    <button
                                        key={reciter.id}
                                        onClick={() => { setSelectedReciterId?.(reciter.id); setView('MAIN'); }}
                                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                                            selectedReciterId === reciter.id
                                                ? 'bg-cyan-900/20 border-cyan-500/50'
                                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                            selectedReciterId === reciter.id ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                            🎙️
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className={`font-bold text-sm ${selectedReciterId === reciter.id ? 'text-cyan-400' : 'text-slate-300'}`}>{reciter.name}</p>
                                            <p className="text-[10px] text-slate-500">{reciter.style}</p>
                                        </div>
                                        {selectedReciterId === reciter.id && (
                                            <i className="fa-solid fa-check text-cyan-400"></i>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default QuranDisplaySettings;

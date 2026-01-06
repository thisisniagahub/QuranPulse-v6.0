import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Volume2, Heart, X, CheckCircle2, AlertCircle, Moon, Sun, Star,
    Grid, BookOpen, ArrowLeft, VolumeX, Sparkles, Loader2,
    Bookmark, MessageCircle, Info, Image as ImageIcon, Send,
    ChevronRight, BrainCircuit
} from 'lucide-react';
import { useIqraAudio } from './hooks/useIqraTools';
import { askUstazAI } from '../../services/aiService';
import { getResponsiveGridClass } from '../../utils/gridUtils';
import { useIqraLoader, LessonStep } from './hooks/useIqraLoader';
import { useGamification } from '../../contexts/GamificationContext';

// --- REMOVED HARDCODED DATA ---

interface IqraInteractiveCoachProps {
    volume?: number;
    onClose?: () => void;
}

const IqraInteractiveCoach: React.FC<IqraInteractiveCoachProps> = ({ volume = 1, onClose }) => {
    const { steps, loading: dataLoading } = useIqraLoader(volume);
    const { addXP, unlockAchievement } = useGamification();

    const [view, setView] = useState<'lesson' | 'chart'>('lesson');
    const [currentStep, setCurrentStep] = useState(0);
    const [hearts, setHearts] = useState(5);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    // AI States
    const [aiLoading, setAiLoading] = useState(false);
    const [aiContent, setAiContent] = useState<{ type: string, title?: string, text: string } | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [userQuery, setUserQuery] = useState("");
    const [chatResponse, setChatResponse] = useState("");

    const { speak } = useIqraAudio();

    const step = steps[currentStep];
    const progress = steps.length > 0 ? ((currentStep) / steps.length) * 100 : 0;

    // Handle initial loading
    if (dataLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-background-dark text-cyan-400">
                <Loader2 className="animate-spin mr-2" /> Initializing Neural Curriculum...
            </div>
        );
    }

    if (!step) return null;

    const handleCallAI = async (prompt: string, context: string) => {
        setAiLoading(true);
        try {
            const response = await askUstazAI([
                { id: 'sys', role: 'system', content: `Anda adalah Guru Iqra yang mesra. ${context}`, timestamp: Date.now() },
                { id: 'usr', role: 'user', content: prompt, timestamp: Date.now() }
            ]);
            return response;
        } catch (error) {
            console.error("AI Error:", error);
            return "Maaf, Ustaz AI sedang sibuk. Sila cuba lagi sebentar.";
        } finally {
            setAiLoading(false);
        }
    };

    const generateMnemonic = async (letterName: string, sound: string) => {
        setAiContent(null);
        const result = await handleCallAI(
            `Berikan satu tip mnemonik (cara ingat) yang kreatif dalam Bahasa Melayu untuk bunyi "${sound}" (huruf ${letterName}). Maksimum 2 ayat.`,
            "Gunakan bahasa yang mudah dan ceria untuk kanak-kanak."
        );
        setAiContent({ type: 'mnemonic', title: 'Tip Ingatan ✨', text: result });
    };

    const explainMistake = async (target: string, chosen: string) => {
        const result = await handleCallAI(
            `Pelajar tersalah pilih huruf. Dia pilih "${chosen}" sedangkan jawapan yang betul adalah "${target}". Terangkan perbezaan visual antara kedua-dua huruf ini dalam Bahasa Melayu.`,
            "Terangkan dengan sabar dan ringkas."
        );
        setAiContent({ type: 'analysis', title: 'Analisis ✨', text: result });
    };

    const askUstaz = async () => {
        if (!userQuery) return;
        setChatResponse("");
        const result = await handleCallAI(userQuery, `Soalan pelajar mengenai huruf ${step.name}.`);
        setChatResponse(result);
        setUserQuery("");
    };

    const handleCheck = () => {
        if (step.type === 'quiz' || step.type === 'challenge') {
            const target = step.type === 'quiz' ? step.letter : step.target;
            if (selectedOption === target) {
                setIsCorrect(true);
                speak(selectedOption!);
                // 🎮 GAMIFICATION: Reward XP for correct answer
                addXP(10, `Correct Answer: ${selectedOption}`);
            } else {
                setIsCorrect(false);
                setHearts(prev => Math.max(0, prev - 1));
            }
        } else {
            handleNext();
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setAiContent(null);
            setChatResponse("");
        } else {
            setIsComplete(true);
            // 🎮 GAMIFICATION: Reward for finishing the module
            addXP(100, `Completed Iqra Volume ${volume}`);
            unlockAchievement('first_khatam'); // Using existing achievement ID for demo
        }
    };

    // Derived unique letters for the index grid
    const uniqueLetters = Array.from(new Set(steps.filter(s => s.letter).map(s => s.letter!)));

    if (isComplete) {
        return (
            <div className="h-full flex items-center justify-center p-6 bg-background-dark text-white mesh-gradient">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-8 max-w-sm glass-hud p-10 rounded-[3rem] hud-border"
                >
                    <div className="flex justify-center">
                        <div className="bg-amber-400 p-8 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.6)] animate-bounce neon-glow-primary">
                            <Star size={64} className="text-white fill-white" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black uppercase tracking-tight text-white glow-text">MISI SELESAI</h1>
                        <p className="text-lg text-slate-300 leading-relaxed font-medium">Anda telah menamatkan modul latihan awal. Perjalanan ilmu anda adalah cahaya bagi dunia!</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-[0_8px_20px_rgba(var(--primary-rgb),0.4)] active:translate-y-1 transition-all uppercase tracking-widest text-lg"
                    >
                        Teroka Modul Baru
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-background-dark text-slate-100 overflow-hidden relative font-sans mesh-gradient">

            {/* Background Orbs & Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 -left-20 w-64 h-64 md:w-[30rem] md:h-[30rem] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 -right-20 w-64 h-64 md:w-[30rem] md:h-[30rem] bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
                <div className="absolute inset-0 bg-pattern opacity-[0.03]"></div>
            </div>

            {/* Header / HUD Top Bar */}
            <header className="flex-none px-6 pt-6 pb-2 z-10 relative">
                <div className="max-w-4xl mx-auto glass-hud p-4 rounded-3xl flex items-center justify-between border-white/5 hud-border">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                            aria-label="Exit Coach Mode"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary neon-glow-primary">Protocol: IQRA_MASTER</span>
                            <span className="text-sm font-black text-white glow-text">SESSION_V{currentStep + 1}</span>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-xs h-8 bg-black/40 rounded-full overflow-hidden mx-8 relative border border-primary/30 shadow-[inset_0_0_10px_rgba(0,191,255,0.2)]">
                        {/* ECG Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,191,255,0.1)_1px,transparent_1px),linear-gradient(rgba(0,191,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"></div>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-transparent via-primary/50 to-primary relative"
                        >
                            {/* Heartbeat Line */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-red-500 font-black md:scale-110">
                            <Heart className="fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" size={20} />
                            <span className="text-lg md:text-xl glow-text">{hearts}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs (HUD Style) */}
            <div className="flex-none max-w-4xl mx-auto w-full px-6 mt-6 z-10 relative">
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <button
                        onClick={() => setView('lesson')}
                        className={`flex-1 py-4 font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 rounded-xl ${view === 'lesson' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        <BookOpen size={16} /> DATA_STREAM
                    </button>
                    <button
                        onClick={() => setView('chart')}
                        className={`flex-1 py-4 font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 rounded-xl ${view === 'chart' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Grid size={16} /> INDEX_GRID
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar p-6 z-10 relative">
                <div className="max-w-4xl mx-auto h-full">
                    <AnimatePresence mode="wait">
                        {view === 'lesson' ? (
                            <motion.div
                                key={currentStep}
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 1.05, opacity: 0, y: -20 }}
                                className="space-y-10"
                            >
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] neon-glow-primary">Protocol.ACTIVE_TASK</p>
                                        <h2 className="text-2xl md:text-3xl font-black text-white glow-text uppercase leading-tight">{step.instruction || step.name}</h2>
                                    </div>
                                    <button
                                        onClick={() => setChatOpen(!chatOpen)}
                                        className="bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95"
                                    >
                                        <BrainCircuit size={18} /> ✨ USTAZ_AI
                                    </button>
                                </div>

                                {step.type === 'cover' && (
                                    <div className="flex flex-col items-center space-y-12 py-10">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="relative w-64 h-80 md:w-72 md:h-96 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border-4 border-[#00BFFF]/20 hud-border hover:scale-105 transition-transform"
                                        >
                                            <img
                                                src={`/src/assets/iqra/iqra-lesson-${step.id < 12 ? 1 : 2}.png`}
                                                className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                                                alt="Iqra Poster"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-60"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                    <BookOpen size={24} className="text-white" />
                                                </div>
                                            </div>
                                        </motion.div>
                                        <div className="text-center space-y-4 max-w-sm">
                                            <h3 className="text-4xl font-black text-white glow-text tracking-tighter uppercase">{step.letter}</h3>
                                            <p className="text-slate-400 text-lg leading-relaxed px-6 font-medium italic opacity-80">
                                                "{step.description}"
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {step.type === 'insight' && (
                                    <div className="flex flex-col items-center justify-center py-10 md:py-20 space-y-6 md:space-y-10">
                                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 neon-glow-primary">
                                            <Sparkles size={40} className="text-primary" />
                                        </div>
                                        <div className="glass-hud p-10 rounded-[3rem] hud-border w-full max-w-lg text-center space-y-6">
                                            <h4 className="text-primary font-black uppercase tracking-[0.3em] text-xs neon-glow-primary">Diagnostic Insight</h4>
                                            <h3 className="text-2xl font-black text-white leading-relaxed">{step.title}</h3>
                                            <p className="text-slate-400 leading-relaxed font-medium">{step.text}</p>
                                        </div>
                                    </div>
                                )}

                                {step.type === 'intro' && (
                                    <div className="flex flex-col items-center space-y-8 py-6 md:space-y-12 md:py-10">
                                        <motion.button
                                            whileHover={{ scale: 1.05, rotateY: 10 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => speak(step.letter || '')}
                                            className="relative w-full max-w-[16rem] h-64 md:w-64 md:h-80 rounded-[2.5rem] md:rounded-[3rem] glass-hud border border-white/10 flex flex-col items-center justify-center gap-6 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group preserve-3d perspective-1000 hud-border"
                                        >
                                            <div className="absolute inset-0 bg-pattern opacity-[0.05]"></div>
                                            <div className="absolute inset-0 bg-pattern opacity-[0.05]"></div>
                                            <span className="text-8xl md:text-[10rem] font-arabic text-white glow-text transition-all group-hover:scale-110 drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]">{step.letter}</span>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="uppercase font-black text-primary tracking-[0.4em] text-xs neon-glow-primary">{step.sound}</span>
                                                <Volume2 size={24} className="text-white/20 group-hover:text-primary transition-colors" />
                                            </div>
                                        </motion.button>

                                        <div className="text-center space-y-6 max-w-sm">
                                            <p className="text-xl leading-relaxed text-slate-300 font-medium opacity-90 italic">"{step.description}"</p>

                                            <div className="flex flex-col gap-4 pt-6">
                                                <button
                                                    onClick={() => generateMnemonic(step.name || '', step.sound || '')}
                                                    disabled={aiLoading}
                                                    className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 text-primary rounded-[1.5rem] font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/10 transition-all"
                                                >
                                                    {aiLoading ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />} ANALYZE_MNEMONIC
                                                </button>

                                                <AnimatePresence>
                                                    {aiContent && aiContent.type === 'mnemonic' && (
                                                        <motion.div
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            className="p-6 rounded-[2rem] border border-primary/20 bg-primary/5 text-left relative overflow-hidden"
                                                        >
                                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                                <BrainCircuit size={40} className="text-primary" />
                                                            </div>
                                                            <h4 className="text-[10px] font-black uppercase text-primary mb-3 flex items-center gap-2 tracking-[0.2em] neon-glow-primary">
                                                                <Star size={12} fill="currentColor" /> {aiContent.title}
                                                            </h4>
                                                            <p className="text-md font-medium text-slate-200 leading-relaxed italic z-10 relative">
                                                                "{aiContent.text}"
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step.type === 'practice' && (
                                    <div className="space-y-10 py-6 md:space-y-16 md:py-10">
                                        <div className={getResponsiveGridClass((step.letters || []).length)} dir="rtl">
                                            {(step.letters || []).map((l, i) => (
                                                <motion.button
                                                    key={i}
                                                    whileHover={{ y: -5, scale: 1.05 }}
                                                    onClick={() => speak(l)}
                                                    className="w-full h-32 md:h-44 rounded-[2rem] md:rounded-full glass-hud border-2 border-primary/20 flex items-center justify-center text-6xl md:text-8xl font-arabic transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-white hover:border-primary hover:shadow-[0_0_30px_rgba(0,191,255,0.4)] group bg-black/20"
                                                >
                                                    <span className="group-hover:neon-glow-primary transition-all drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]">{l}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                        <div className="glass-hud p-6 rounded-[2rem] text-center border-white/5 max-w-sm mx-auto">
                                            <p className="text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Protocol: READ_RTL</p>
                                            <p className="text-white font-bold text-sm glow-text">Analisis bunyi dari kanan ke kiri.</p>
                                        </div>
                                    </div>
                                )}

                                {(step.type === 'quiz' || step.type === 'challenge') && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 px-4" dir="rtl">
                                        {(step.options || step.letters || []).map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { if (isCorrect === null) { setSelectedOption(opt); speak(opt); } }}
                                                className={`p-8 md:p-14 rounded-[2rem] md:rounded-[3rem] border-2 text-7xl md:text-9xl font-arabic flex items-center justify-center transition-all shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${selectedOption === opt ? 'border-primary bg-primary/20 text-white neon-glow-primary shadow-primary/20' : 'glass-hud border-white/5 text-slate-500 hover:border-white/20 active:scale-95'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-12 py-10"
                            >
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl font-black text-white uppercase tracking-[0.3em] glow-text">INDEX_HIJAIYAH</h2>
                                    <p className="text-primary text-xs font-black tracking-widest uppercase neon-glow-primary">Spectral Character Map</p>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4" dir="rtl">
                                    {uniqueLetters.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => speak(item)}
                                            className="aspect-square flex flex-col items-center justify-center rounded-full glass-hud border border-primary/20 hover:border-primary transition-all active:scale-90 group relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(0,191,255,0.4)]"
                                        >
                                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors rounded-full"></div>
                                            <span className="text-4xl font-arabic mb-1 group-hover:text-white transition-all group-hover:scale-110 drop-shadow-[0_0_5px_rgba(0,191,255,0.8)]">{item}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat HUD Overlay */}
                    <AnimatePresence>
                        {chatOpen && (
                            <motion.div
                                initial={{ y: 200, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 200, opacity: 0 }}
                                className="fixed inset-x-0 bottom-28 p-8 z-50 pointer-events-none"
                            >
                                <div className="max-w-2xl mx-auto glass-hud border-2 border-primary rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,1)] p-8 pointer-events-auto relative overflow-hidden hud-border">
                                    <div className="absolute inset-0 bg-pattern opacity-[0.05] pointer-events-none"></div>
                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center neon-glow-primary">
                                                <BrainCircuit size={20} className="text-primary" />
                                            </div>
                                            <h3 className="font-black text-white uppercase tracking-[0.3em] text-xs glow-text">
                                                USTAZ_AI Stream
                                            </h3>
                                        </div>
                                        <button onClick={() => setChatOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all" aria-label="Close Chat"><X size={20} /></button>
                                    </div>

                                    <div className="space-y-8 relative z-10">
                                        <AnimatePresence mode="wait">
                                            {chatResponse && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="bg-white/5 p-6 rounded-3xl border border-white/10 text-md font-medium text-slate-200 leading-relaxed italic backdrop-blur-md"
                                                >
                                                    {chatResponse}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                value={userQuery}
                                                onChange={(e) => setUserQuery(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && askUstaz()}
                                                placeholder="Query neural network..."
                                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl text-sm p-5 focus:ring-2 focus:ring-primary outline-none text-white tracking-wide"
                                            />
                                            <button
                                                onClick={askUstaz}
                                                disabled={aiLoading}
                                                className="bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
                                            >
                                                {aiLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Footer / Global Interaction Bar */}
            <footer className="flex-none p-8 z-20 relative">
                <div className="max-w-4xl mx-auto w-full">
                    <AnimatePresence>
                        {view === 'lesson' && (
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="space-y-6"
                            >
                                {/* Augmented Feedback Overlays */}
                                {isCorrect !== null && (
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`p-8 rounded-[3rem] border-l-[16px] glass-hud flex flex-col gap-6 shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${isCorrect ? 'border-emerald-500' : 'border-red-500'} hud-border`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                                {isCorrect ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`text-2xl font-black uppercase tracking-tight ${isCorrect ? 'text-emerald-400 glow-text' : 'text-red-400 glow-text'}`}>
                                                    {isCorrect ? 'SYNCHRONIZED' : 'INTERFERENCE_DETECTED'}
                                                </h3>
                                                <p className="font-bold text-slate-300 text-md opacity-80 uppercase tracking-wider">
                                                    {isCorrect ? 'Character identification successful.' : 'Structural error detected in selection.'}
                                                </p>
                                            </div>
                                        </div>

                                        {isCorrect === false && (
                                            <button
                                                onClick={() => explainMistake(step.letter || '', selectedOption!)}
                                                disabled={aiLoading}
                                                className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 rounded-2xl text-red-400 font-black text-xs uppercase tracking-[0.3em] border border-red-500/20 hover:bg-white/10 transition-all"
                                            >
                                                {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />} DIAGNOSE_MISTAKE
                                            </button>
                                        )}

                                        <AnimatePresence>
                                            {aiContent && aiContent.type === 'analysis' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="bg-black/40 p-6 rounded-3xl border border-white/5 text-sm font-medium text-slate-400 leading-relaxed italic"
                                                >
                                                    {aiContent.text}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                <div className="flex items-center justify-between gap-6 pt-2">
                                    {isCorrect === null ? (
                                        <button
                                            onClick={handleCheck}
                                            disabled={(step.type === 'quiz' || step.type === 'challenge') && !selectedOption}
                                            className={`flex-1 py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-md transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${(step.type === 'quiz' || step.type === 'challenge') && !selectedOption ? 'bg-white/5 text-slate-500 border border-white/5' : 'bg-primary text-white hover:brightness-110 active:translate-y-1 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] border border-primary/20'}`}
                                        >
                                            {step.type === 'intro' || step.type === 'insight' || step.type === 'cover' ? 'CONTINUE_STEP' : 'EXECUTE_CHECK'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNext}
                                            className={`flex-1 py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-md text-white transition-all shadow-2xl px-12 flex items-center justify-center gap-4 ${isCorrect ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-red-600 shadow-red-900/40'} hover:brightness-110 active:translate-y-1 border border-white/10`}
                                        >
                                            CONTINUE_SESSION <ChevronRight size={24} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {view === 'chart' && (
                        <button
                            onClick={() => setView('lesson')}
                            className="w-full py-6 glass-hud text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-md shadow-2xl flex items-center justify-center gap-4 active:translate-y-1 border border-primary/30 transition-all hover:bg-primary/10"
                        >
                            <ArrowLeft size={24} /> RETURN_TO_STREAM
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default IqraInteractiveCoach;

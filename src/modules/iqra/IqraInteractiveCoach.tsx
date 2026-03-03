/**
 * 🤖 Iqra' Interactive Coach
 * The premium gamified AI learning engine
 * 
 * Features:
 * - Raudhah "Neural Mirror" design (Ivory/Teal/Gold)
 * - Heart-based life system
 * - Real-time AI Mnemonics & Mistake Analysis
 * - Multi-view (Lesson vs Index Grid)
 * - Gamification (XP, Achievements)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Volume2, Heart, X, CheckCircle2, AlertCircle,
    Star, Grid, BookOpen, ArrowLeft, VolumeX,
    Sparkles, Loader2, Bookmark, MessageCircle,
    Info, Image as ImageIcon, Send, ChevronRight,
    BrainCircuit, Trophy, Lightbulb
} from 'lucide-react';
import { useIqraAudio } from './hooks/useIqraTools';
import { askUstazAI } from '../../services/aiService';
import { getResponsiveGridClass } from '../../utils/gridUtils';
import { useIqraLoader, LessonStep } from './hooks/useIqraLoader';
import { useGamification } from '../../contexts/GamificationContext';

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

    if (dataLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-raudhah-ivory text-raudhah-teal p-10">
                <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-raudhah-teal/10 rounded-full" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-20 h-20 border-4 border-raudhah-teal border-t-transparent rounded-full"
                    />
                    <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 animate-pulse" />
                </div>
                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Menyediakan Kurikulum Pintar...</p>
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
                addXP(10, `Jawapan Betul: ${selectedOption}`);
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
            addXP(100, `Tamat Jilid ${volume}`);
            unlockAchievement('first_khatam');
        }
    };

    const uniqueLetters = Array.from(new Set(steps.filter(s => s.letter).map(s => s.letter!)));

    if (isComplete) {
        return (
            <div className="h-full min-h-screen flex items-center justify-center p-6 bg-raudhah-ivory">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-8 max-w-sm glass-v7 p-12 rounded-[3.5rem] shadow-warm border border-raudhah-teal/10"
                >
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-raudhah-gold rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center animate-bounce">
                            <Trophy className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-raudhah-ink tracking-tight uppercase">Misi Selesai</h1>
                        <p className="text-raudhah-teal/60 font-medium leading-relaxed">Anda telah menamatkan modul latihan awal. Perjalanan ilmu anda adalah cahaya bagi dunia!</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-raudhah-teal hover:bg-raudhah-ink text-white font-black py-5 rounded-[2rem] shadow-warm transition-all uppercase tracking-widest text-sm active:scale-95"
                    >
                        Teroka Modul Baru
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-full min-h-screen flex flex-col bg-raudhah-ivory text-raudhah-ink overflow-hidden relative font-sans transition-colors duration-500">
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 -left-20 w-[40rem] h-[40rem] bg-raudhah-teal/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 -right-20 w-[40rem] h-[40rem] bg-raudhah-gold/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            {/* Header HUD */}
            <header className="flex-none px-4 pt-6 pb-2 z-20 relative">
                <div className="max-w-4xl mx-auto glass-v7 p-4 rounded-[2.5rem] flex items-center justify-between border border-raudhah-teal/10 shadow-warm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl glass-v7 text-raudhah-teal hover:bg-white hover:text-raudhah-ink transition-all shadow-sm border border-raudhah-teal/5"
                            aria-label="Exit Coach Mode"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-raudhah-gold leading-none mb-1">Session Protocol</span>
                            <span className="text-sm font-black text-raudhah-ink leading-none">IQRA_{currentStep + 1}</span>
                        </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="hidden md:flex flex-1 max-w-xs h-3 bg-raudhah-teal/10 rounded-full overflow-hidden mx-8 relative border border-raudhah-teal/5 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-raudhah-teal shadow-glow"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 group">
                            <div className="relative">
                                <Heart className="text-red-500 fill-red-500 w-6 h-6 drop-shadow-sm group-hover:scale-110 transition-transform" />
                                {hearts < 3 && <div className="absolute -inset-1 bg-red-500/20 blur-md rounded-full animate-pulse" />}
                            </div>
                            <span className="text-xl font-black text-raudhah-ink">{hearts}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="flex-none max-w-4xl mx-auto w-full px-4 mt-6 z-20 relative">
                <div className="flex gap-2 p-1.5 glass-v7 rounded-[2rem] border border-raudhah-teal/10 shadow-sm">
                    <button
                        onClick={() => setView('lesson')}
                        className={`flex-1 py-4 font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 rounded-2xl ${view === 'lesson' ? 'bg-raudhah-teal text-white shadow-warm' : 'text-raudhah-teal/40 hover:text-raudhah-teal'}`}
                    >
                        <BookOpen size={16} /> Data Stream
                    </button>
                    <button
                        onClick={() => setView('chart')}
                        className={`flex-1 py-4 font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 rounded-2xl ${view === 'chart' ? 'bg-raudhah-teal text-white shadow-warm' : 'text-raudhah-teal/40 hover:text-raudhah-teal'}`}
                    >
                        <Grid size={16} /> Index Grid
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar p-6 z-10 relative">
                <div className="max-w-4xl mx-auto h-full">
                    <AnimatePresence mode="wait">
                        {view === 'lesson' ? (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="space-y-12 pt-4"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-raudhah-gold rounded-full" />
                                            <p className="text-raudhah-teal/60 font-black uppercase tracking-[0.4em] text-[10px]">Active Task</p>
                                        </div>
                                        <h2 className="text-3xl font-black text-raudhah-ink tracking-tight uppercase leading-tight">{step.instruction || step.name}</h2>
                                    </div>
                                    <button
                                        onClick={() => setChatOpen(!chatOpen)}
                                        className="bg-raudhah-gold/10 hover:bg-raudhah-gold/20 text-raudhah-ink border border-raudhah-gold/20 px-8 py-4 rounded-[2rem] flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all active:scale-95 group shadow-sm"
                                    >
                                        <Sparkles className="w-5 h-5 text-raudhah-gold group-hover:rotate-12 transition-transform" />
                                        ✨ Ustaz AI
                                    </button>
                                </div>

                                {/* Dynamic Content Handling */}
                                {step.type === 'cover' && (
                                    <div className="flex flex-col items-center space-y-12 py-10">
                                        <motion.div
                                            whileHover={{ scale: 1.05, rotateY: 5 }}
                                            className="relative w-72 h-96 rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-raudhah-teal/5 bg-raudhah-teal/5 p-4"
                                        >
                                            <img loading="lazy"
                                                src={`/assets/iqra/iqra-lesson-${step.id < 12 ? 1 : 2}.png`}
                                                className="w-full h-full object-cover rounded-[2.5rem]"
                                                alt="Iqra Poster"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-raudhah-ink/40 via-transparent to-transparent pointer-events-none"></div>
                                        </motion.div>
                                        <div className="text-center space-y-4 max-w-sm">
                                            <h3 className="text-5xl font-arabic text-raudhah-teal drop-shadow-sm">{step.letter}</h3>
                                            <p className="text-raudhah-teal/60 text-lg leading-relaxed font-medium italic opacity-80">
                                                "{step.description}"
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {step.type === 'insight' && (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-10">
                                        <div className="w-24 h-24 rounded-[2.5rem] bg-raudhah-gold flex items-center justify-center shadow-warm">
                                            <Lightbulb size={48} className="text-raudhah-ink" />
                                        </div>
                                        <div className="glass-v7 p-12 rounded-[3.5rem] shadow-warm border border-raudhah-teal/10 w-full max-w-lg text-center space-y-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                                <Sparkles size={120} className="text-raudhah-teal" />
                                            </div>
                                            <h4 className="text-raudhah-gold font-black uppercase tracking-[0.3em] text-[10px]">Penerangan Visual</h4>
                                            <h3 className="text-3xl font-black text-raudhah-ink leading-tight">{step.title}</h3>
                                            <p className="text-raudhah-teal/60 leading-relaxed font-medium text-lg">{step.text}</p>
                                        </div>
                                    </div>
                                )}

                                {step.type === 'intro' && (
                                    <div className="flex flex-col items-center space-y-12 py-6">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -10 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => speak(step.letter || '')}
                                            className="relative w-72 h-80 rounded-[4rem] glass-v7 border border-raudhah-teal/10 flex flex-col items-center justify-center gap-8 shadow-warm group overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-raudhah-teal/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="text-9xl md:text-[11rem] font-arabic text-raudhah-ink transition-all group-hover:scale-110 drop-shadow-sm group-hover:text-raudhah-teal">{step.letter}</span>
                                            <div className="flex flex-col items-center gap-1.5 relative z-10">
                                                <span className="uppercase font-black text-raudhah-gold tracking-[0.4em] text-[10px]">{step.sound}</span>
                                                <div className="w-10 h-10 rounded-xl bg-raudhah-teal/10 flex items-center justify-center group-hover:bg-raudhah-teal transition-all">
                                                    <Volume2 size={24} className="text-raudhah-teal group-hover:text-white" />
                                                </div>
                                            </div>
                                        </motion.button>

                                        <div className="text-center space-y-8 max-w-sm w-full">
                                            <p className="text-2xl leading-relaxed text-raudhah-teal/60 font-medium opacity-90 italic">"{step.description}"</p>

                                            <div className="flex flex-col gap-4">
                                                <button
                                                    onClick={() => generateMnemonic(step.name || '', step.sound || '')}
                                                    disabled={aiLoading}
                                                    className="w-full flex items-center justify-center gap-4 py-6 glass-v7 text-raudhah-gold rounded-[2rem] font-black uppercase tracking-widest text-[10px] border border-raudhah-gold/20 hover:bg-white transition-all shadow-sm"
                                                >
                                                    {aiLoading ? (
                                                        <div className="inline-flex animate-spin">
                                                            <Loader2 size={20} />
                                                        </div>
                                                    ) : <BrainCircuit size={20} />} Cari Mnemonik
                                                </button>

                                                <AnimatePresence>
                                                    {aiContent && aiContent.type === 'mnemonic' && (
                                                        <motion.div
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            className="p-8 rounded-[3rem] border border-raudhah-gold/20 bg-raudhah-gold/5 text-left relative overflow-hidden shadow-sm"
                                                        >
                                                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                                                <BrainCircuit size={64} className="text-raudhah-gold" />
                                                            </div>
                                                            <h4 className="text-[10px] font-black uppercase text-raudhah-gold mb-4 flex items-center gap-2 tracking-[0.2em]">
                                                                <Sparkles size={14} fill="currentColor" /> {aiContent.title}
                                                            </h4>
                                                            <p className="text-lg font-medium text-raudhah-ink/80 leading-relaxed italic z-10 relative">
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
                                    <div className="space-y-12 py-6">
                                        <div className={getResponsiveGridClass((step.letters || []).length)} dir="rtl">
                                            {(step.letters || []).map((l, i) => (
                                                <motion.button
                                                    key={i}
                                                    whileHover={{ y: -8, scale: 1.05 }}
                                                    onClick={() => speak(l)}
                                                    className="w-full h-36 md:h-48 rounded-[3rem] glass-v7 border-2 border-raudhah-teal/5 flex items-center justify-center text-7xl md:text-8xl font-arabic transition-all shadow-sm text-raudhah-ink hover:border-raudhah-gold hover:text-raudhah-teal group bg-white/20"
                                                >
                                                    <span className="drop-shadow-sm group-hover:scale-110 transition-transform">{l}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                        <div className="glass-v7 p-8 rounded-[2.5rem] text-center border border-raudhah-teal/10 max-w-sm mx-auto shadow-sm">
                                            <p className="text-raudhah-teal/30 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Protocol: Read_RTL</p>
                                            <p className="text-raudhah-ink/80 font-bold text-sm tracking-tight capitalize">Baca dari kanan ke kiri untuk hasil terbaik.</p>
                                        </div>
                                    </div>
                                )}

                                {(step.type === 'quiz' || step.type === 'challenge') && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6" dir="rtl">
                                        {(step.options || step.letters || []).map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { if (isCorrect === null) { setSelectedOption(opt); speak(opt); } }}
                                                className={`p-10 md:p-14 rounded-[3.5rem] border-2 text-8xl md:text-9xl font-arabic flex items-center justify-center transition-all shadow-sm ${selectedOption === opt ? 'border-raudhah-teal bg-white text-raudhah-ink shadow-warm scale-105' : 'glass-v7 border-raudhah-teal/5 text-raudhah-teal/20 hover:border-raudhah-teal/30 active:scale-95'}`}
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
                                <div className="text-center space-y-3">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-10 h-1 bg-raudhah-gold rounded-full" />
                                        <h2 className="text-3xl font-black text-raudhah-ink uppercase tracking-[0.2em]">Peta Hijaiyah</h2>
                                        <div className="w-10 h-1 bg-raudhah-gold rounded-full" />
                                    </div>
                                    <p className="text-raudhah-teal/40 text-[10px] font-black tracking-[0.4em] uppercase">Visual Character Map</p>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-4 md:gap-6" dir="rtl">
                                    {uniqueLetters.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => speak(item)}
                                            className="aspect-square flex flex-col items-center justify-center rounded-full glass-v7 border border-raudhah-teal/10 hover:border-raudhah-teal hover:bg-white transition-all active:scale-90 group relative overflow-hidden shadow-sm"
                                        >
                                            <div className="absolute inset-0 bg-raudhah-teal/0 group-hover:bg-raudhah-teal/5 transition-colors"></div>
                                            <span className="text-5xl font-arabic mb-1 text-raudhah-ink/40 group-hover:text-raudhah-teal transition-all group-hover:scale-110">{item}</span>
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
                                className="fixed inset-x-0 bottom-32 p-4 md:p-8 z-50 pointer-events-none"
                            >
                                <div className="max-w-2xl mx-auto bg-raudhah-ivory border-2 border-raudhah-teal rounded-[3.5rem] shadow-2xl p-8 pointer-events-auto relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-raudhah-teal via-raudhah-gold to-raudhah-teal" />

                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-raudhah-teal flex items-center justify-center shadow-warm">
                                                <BrainCircuit size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-raudhah-ink uppercase tracking-[0.2em] text-xs">
                                                    Ustaz AI Stream
                                                </h3>
                                                <p className="text-[10px] font-black text-raudhah-teal/40 uppercase tracking-widest">Active Intelligence</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setChatOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl glass-v7 text-raudhah-teal hover:bg-raudhah-teal/10 transition-all border border-raudhah-teal/10" aria-label="Close Chat"><X size={24} /></button>
                                    </div>

                                    <div className="space-y-8 relative z-10">
                                        <div className="max-h-60 overflow-y-auto no-scrollbar space-y-6">
                                            <AnimatePresence mode="wait">
                                                {chatResponse ? (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="bg-raudhah-teal/5 p-8 rounded-[2.5rem] border border-raudhah-teal/10 text-lg font-medium text-raudhah-ink leading-relaxed italic"
                                                    >
                                                        "{chatResponse}"
                                                    </motion.div>
                                                ) : null}
                                            </AnimatePresence>
                                        </div>

                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                value={userQuery}
                                                onChange={(e) => setUserQuery(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && askUstaz()}
                                                placeholder="Tanya ustaz sesuatu..."
                                                className="flex-1 bg-raudhah-teal/5 border border-raudhah-teal/10 rounded-2xl text-sm p-5 focus:ring-2 focus:ring-raudhah-teal outline-none text-raudhah-ink tracking-tight font-medium"
                                            />
                                            <button
                                                onClick={askUstaz}
                                                disabled={aiLoading}
                                                className="bg-raudhah-teal text-white w-20 h-20 rounded-2xl flex items-center justify-center hover:scale-[1.05] active:scale-95 transition-all shadow-warm disabled:opacity-50"
                                            >
                                                {aiLoading ? (
                                                    <div className="inline-flex animate-spin">
                                                        <Loader2 size={28} />
                                                    </div>
                                                ) : <Send size={28} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Footer Interaction Bar */}
            <footer className="flex-none p-6 md:p-8 z-30 relative glass-v7 border-t border-raudhah-teal/10 shadow-sm">
                <div className="max-w-4xl mx-auto w-full">
                    <AnimatePresence>
                        {view === 'lesson' && (
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="space-y-8"
                            >
                                {/* Correct/Wrong Feedback */}
                                {isCorrect !== null && (
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`p-8 rounded-[3.5rem] border-l-[16px] bg-white flex flex-col gap-8 shadow-2xl relative overflow-hidden ${isCorrect ? 'border-raudhah-teal' : 'border-red-500'}`}
                                    >
                                        <div className="flex items-center gap-8 relative z-10">
                                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-warm ${isCorrect ? 'bg-raudhah-teal text-white' : 'bg-red-500 text-white'}`}>
                                                {isCorrect ? <CheckCircle2 size={42} /> : <AlertCircle size={42} />}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`text-3xl font-black uppercase tracking-tight ${isCorrect ? 'text-raudhah-teal' : 'text-red-500'}`}>
                                                    {isCorrect ? 'Sangat Bagus!' : 'Ejaan Berbeza'}
                                                </h3>
                                                <p className="font-bold text-raudhah-teal/60 text-lg tracking-tight capitalize">
                                                    {isCorrect ? 'Pengecaman karakter berjaya.' : 'Sila teliti bentuk huruf yang dipilih.'}
                                                </p>
                                            </div>
                                        </div>

                                        {isCorrect === false && (
                                            <button
                                                onClick={() => explainMistake(step.letter || '', selectedOption!)}
                                                disabled={aiLoading}
                                                className="w-full flex items-center justify-center gap-4 py-6 glass-v7 text-red-500 border border-red-500/10 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all font-mono"
                                            >
                                                {aiLoading ? (
                                                    <div className="inline-flex animate-spin">
                                                        <Loader2 size={20} />
                                                    </div>
                                                ) : <BrainCircuit size={20} />} Analisis Kesalahan Visual
                                            </button>
                                        )}

                                        <AnimatePresence>
                                            {aiContent && aiContent.type === 'analysis' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="bg-raudhah-teal/5 p-8 rounded-[2.5rem] border border-raudhah-teal/5 text-lg font-medium text-raudhah-teal/80 leading-relaxed italic"
                                                >
                                                    "{aiContent.text}"
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
                                            className={`flex-1 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-md transition-all shadow-warm border-b-[6px] active:border-b-0 active:translate-y-1.5 ${(step.type === 'quiz' || step.type === 'challenge') && !selectedOption ? 'bg-raudhah-teal/5 text-raudhah-teal/20 border-raudhah-teal/10 cursor-not-allowed' : 'bg-raudhah-teal text-white border-raudhah-ink'}`}
                                        >
                                            {step.type === 'intro' || step.type === 'insight' || step.type === 'cover' ? 'Teruskan Langkah' : 'Semak Jawapan'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNext}
                                            className={`flex-1 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-md text-white transition-all shadow-warm px-12 flex items-center justify-center gap-4 border-b-[6px] active:border-b-0 active:translate-y-1.5 ${isCorrect ? 'bg-emerald-600 border-emerald-900' : 'bg-red-600 border-red-900'}`}
                                        >
                                            Next Step <ChevronRight size={24} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {view === 'chart' && (
                        <button
                            onClick={() => setView('lesson')}
                            className="w-full py-7 bg-raudhah-teal text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-md shadow-warm flex items-center justify-center gap-6 active:translate-y-1.5 border-b-[6px] border-raudhah-ink transition-all"
                        >
                            <ArrowLeft size={28} /> Kembali Mengaji
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default IqraInteractiveCoach;

/**
 * 🤖 Smart Deen Crossover
 * Bridges Quran module with Ustaz AI for contextual discussions
 * 
 * Features:
 * - Floating AI assistant button
 * - Context-aware prompts from current verse
 * - Quick question templates
 * - Seamless transition to Smart Deen
 * - Raudhah Ivory/Teal Theme
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, X, Send, Sparkles,
    HelpCircle, BookOpen, Lightbulb, ChevronRight,
    Loader2
} from 'lucide-react';

interface SmartDeenCrossoverProps {
    surahNumber?: number;
    surahName?: string;
    verseNumber?: number;
    arabicText?: string;
    translation?: string;
    onAskUstaz?: (question: string, context: VerseContext) => void;
    onOpenSmartDeen?: (context: VerseContext) => void;
}

interface VerseContext {
    surahNumber: number;
    surahName: string;
    verseNumber: number;
    arabicText: string;
    translation: string;
}

interface QuickPrompt {
    id: string;
    icon: React.ReactNode;
    label: string;
    template: string;
}

const SmartDeenCrossover: React.FC<SmartDeenCrossoverProps> = ({
    surahNumber = 0,
    surahName = '',
    verseNumber = 0,
    arabicText = '',
    translation = '',
    onAskUstaz,
    onOpenSmartDeen
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customQuestion, setCustomQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const verseContext: VerseContext = {
        surahNumber,
        surahName,
        verseNumber,
        arabicText,
        translation,
    };

    const quickPrompts: QuickPrompt[] = [
        {
            id: 'meaning',
            icon: <BookOpen className="w-4 h-4" />,
            label: 'Maksud Ayat',
            template: `Tolong jelaskan maksud ayat ini: ${surahName} ayat ${verseNumber}`,
        },
        {
            id: 'context',
            icon: <HelpCircle className="w-4 h-4" />,
            label: 'Sebab Turun',
            template: `Apakah sebab turun (asbab nuzul) untuk ${surahName} ayat ${verseNumber}?`,
        },
        {
            id: 'lesson',
            icon: <Lightbulb className="w-4 h-4" />,
            label: 'Pengajaran',
            template: `Apakah pengajaran utama dari ${surahName} ayat ${verseNumber} untuk kehidupan seharian?`,
        },
        {
            id: 'tafsir',
            icon: <Sparkles className="w-4 h-4" />,
            label: 'Tafsir Ringkas',
            template: `Berikan tafsir ringkas untuk ${surahName} ayat ${verseNumber}`,
        },
    ];

    const handleQuickPrompt = useCallback((prompt: QuickPrompt) => {
        if (onAskUstaz) {
            setIsLoading(true);
            onAskUstaz(prompt.template, verseContext);

            // Simulate loading then close
            setTimeout(() => {
                setIsLoading(false);
                setIsOpen(false);
            }, 500);
        }
    }, [onAskUstaz, verseContext]);

    const handleCustomQuestion = useCallback(() => {
        if (customQuestion.trim() && onAskUstaz) {
            const fullQuestion = `Berkaitan dengan ${surahName} ayat ${verseNumber}: ${customQuestion}`;
            setIsLoading(true);
            onAskUstaz(fullQuestion, verseContext);

            setTimeout(() => {
                setIsLoading(false);
                setIsOpen(false);
                setCustomQuestion('');
            }, 500);
        }
    }, [customQuestion, onAskUstaz, verseContext, surahName, verseNumber]);

    const handleOpenFullChat = useCallback(() => {
        if (onOpenSmartDeen) {
            onOpenSmartDeen(verseContext);
        }
    }, [onOpenSmartDeen, verseContext]);

    return (
        <>
            {/* Floating AI Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-40 w-16 h-16 
                   bg-raudhah-teal rounded-2xl shadow-xl shadow-raudhah-teal/20
                   flex items-center justify-center border-b-4 border-raudhah-ink
                   hover:scale-110 active:scale-95 active:border-b-0 active:translate-y-1 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
            >
                <MessageCircle className="w-7 h-7 text-white" />

                {/* Pulse Animation */}
                <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-raudhah-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                    }}
                />
            </motion.button>

            {/* Popup Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 sm:p-0 backdrop-blur-sm bg-raudhah-ink/20"
                        onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="w-full max-w-lg bg-raudhah-ivory rounded-[2.5rem] 
                         border-2 border-raudhah-teal/10 shadow-2xl glass-v7
                         max-h-[90vh] overflow-hidden flex flex-col relative"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-raudhah-teal/5 flex items-center justify-between bg-white/50 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-raudhah-teal/5 border border-raudhah-teal/10
                                 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                                        <Sparkles className="w-6 h-6 text-raudhah-teal" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-raudhah-ink uppercase tracking-tight">Ustaz AI</h3>
                                        <p className="text-[10px] text-raudhah-teal/40 font-black uppercase tracking-widest">Tanya tentang ayat ini</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 hover:bg-raudhah-teal/5 rounded-2xl transition-all active:scale-90"
                                    title="Tutup panel"
                                >
                                    <X className="w-6 h-6 text-raudhah-teal/30" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                                {/* Verse Context Card */}
                                <div className="p-6 bg-white rounded-3xl border-2 border-raudhah-teal/5 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-raudhah-teal/5 rounded-full blur-3xl pointer-events-none group-hover:bg-raudhah-gold/5 transition-all"></div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <BookOpen size={14} className="text-raudhah-teal" />
                                        <p className="text-[10px] text-raudhah-teal font-black uppercase tracking-widest">{surahName} • Ayat {verseNumber}</p>
                                    </div>
                                    <p className="text-right text-2xl font-arabic text-raudhah-ink leading-loose mb-4" dir="rtl">
                                        {arabicText.length > 120 ? `${arabicText.substring(0, 120)}...` : arabicText}
                                    </p>
                                    <p className="text-sm text-raudhah-teal/60 italic font-medium border-l-2 border-raudhah-gold/20 pl-4">
                                        "{translation}"
                                    </p>
                                </div>

                                {/* Quick Prompts */}
                                <div className="space-y-4">
                                    <p className="text-[10px] text-raudhah-teal/30 font-black uppercase tracking-[0.3em] px-2">Soalan Lazim</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {quickPrompts.map((prompt) => (
                                            <button
                                                key={prompt.id}
                                                onClick={() => handleQuickPrompt(prompt)}
                                                disabled={isLoading}
                                                className="p-4 bg-white hover:bg-raudhah-teal/5 rounded-2xl border-2 border-raudhah-teal/5
                                   text-left transition-all disabled:opacity-50
                                   flex flex-col gap-3 group active:scale-95 active:shadow-inner"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-raudhah-teal/5 flex items-center justify-center text-raudhah-teal group-hover:bg-raudhah-teal group-hover:text-white transition-all shadow-inner">
                                                    {prompt.icon}
                                                </div>
                                                <span className="text-xs font-black text-raudhah-ink uppercase tracking-tight">{prompt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Question */}
                                <div className="space-y-4">
                                    <p className="text-[10px] text-raudhah-teal/30 font-black uppercase tracking-[0.3em] px-2">Soalan Khusus</p>
                                    <div className="relative group">
                                        <textarea
                                            value={customQuestion}
                                            onChange={(e) => setCustomQuestion(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleCustomQuestion()}
                                            placeholder="Tanya Ustaz apa sahaja tentang ayat ini..."
                                            rows={2}
                                            className="w-full py-4 px-5 pr-14 bg-white border-2 border-raudhah-teal/10 
                                 rounded-3xl text-raudhah-ink placeholder-raudhah-teal/20
                                 focus:outline-none focus:border-raudhah-teal transition-all shadow-sm resize-none font-medium"
                                        />
                                        <button
                                            onClick={handleCustomQuestion}
                                            disabled={!customQuestion.trim() || isLoading}
                                            className="absolute right-3 bottom-3 p-3 
                                 bg-raudhah-teal rounded-2xl text-white shadow-lg shadow-raudhah-teal/20
                                 disabled:opacity-20 transition-all border-b-4 border-raudhah-ink active:border-b-0 active:translate-y-1"
                                            title="Hantar soalan"
                                        >
                                            <Send size={18} className="translate-x-px" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* footer: Open Full Chat */}
                            <div className="p-6 border-t border-raudhah-teal/5 bg-white/50 backdrop-blur-md">
                                <button
                                    onClick={handleOpenFullChat}
                                    className="w-full py-5 bg-white hover:bg-raudhah-teal/5 rounded-[1.5rem] border-2 border-raudhah-teal/10
                           text-raudhah-ink font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-sm"
                                >
                                    <MessageCircle className="w-5 h-5 text-raudhah-teal group-hover:scale-110 transition-transform" />
                                    <span>Buka Smart Deen Penuh</span>
                                    <ChevronRight className="w-4 h-4 text-raudhah-teal/20 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Loading Overlay */}
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/80 backdrop-blur-md 
                              flex items-center justify-center z-50 p-10"
                                    >
                                        <div className="text-center space-y-4">
                                            <div className="relative w-20 h-20 mx-auto">
                                                <div className="absolute inset-0 border-4 border-raudhah-teal/10 rounded-full animate-pulse" />
                                                <div className="absolute inset-0 border-t-4 border-raudhah-teal rounded-full animate-spin" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Sparkles size={24} className="text-raudhah-gold animate-bounce" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-raudhah-ink uppercase tracking-tight">Menghubungi Ustaz AI</p>
                                                <p className="text-[10px] font-black text-raudhah-teal/40 uppercase tracking-widest animate-pulse">Memproses konteks ayat...</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SmartDeenCrossover;

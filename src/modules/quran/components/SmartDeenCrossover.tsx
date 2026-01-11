/**
 * 🤖 Smart Deen Crossover
 * Bridges Quran module with Ustaz AI for contextual discussions
 * 
 * Features:
 * - Floating AI assistant button
 * - Context-aware prompts from current verse
 * - Quick question templates
 * - Seamless transition to Smart Deen
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, X, Send, Sparkles,
    HelpCircle, BookOpen, Lightbulb, ChevronRight
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
                className="fixed bottom-24 right-4 z-40 w-14 h-14 
                   bg-gradient-to-br from-cyan-500 to-purple-500 
                   rounded-full shadow-lg shadow-cyan-500/25
                   flex items-center justify-center
                   hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <MessageCircle className="w-6 h-6 text-white" />

                {/* Pulse Animation */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyan-400"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                        duration: 2,
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
                        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
                        onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-2xl 
                         border border-slate-800 shadow-2xl shadow-cyan-500/10 
                         max-h-[80vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 
                                 rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Ustaz AI</h3>
                                        <p className="text-xs text-slate-400">Tanya tentang ayat ini</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                    title="Tutup panel"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Verse Context */}
                            <div className="p-4 bg-slate-800/50">
                                <p className="text-xs text-cyan-400 mb-1">{surahName} • Ayat {verseNumber}</p>
                                <p className="text-right text-lg font-arabic text-white leading-loose mb-2" dir="rtl">
                                    {arabicText.substring(0, 80)}{arabicText.length > 80 && '...'}
                                </p>
                                <p className="text-sm text-slate-400 line-clamp-2">
                                    {translation}
                                </p>
                            </div>

                            {/* Quick Prompts */}
                            <div className="p-4">
                                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Soalan Pantas</p>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {quickPrompts.map((prompt) => (
                                        <button
                                            key={prompt.id}
                                            onClick={() => handleQuickPrompt(prompt)}
                                            disabled={isLoading}
                                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl 
                               text-left transition-colors disabled:opacity-50
                               flex items-center gap-2"
                                        >
                                            <div className="text-cyan-400">{prompt.icon}</div>
                                            <span className="text-sm text-white">{prompt.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Question */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={customQuestion}
                                        onChange={(e) => setCustomQuestion(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCustomQuestion()}
                                        placeholder="Tanya soalan anda sendiri..."
                                        className="w-full py-3 px-4 pr-12 bg-slate-800 border border-slate-700 
                             rounded-xl text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                                    />
                                    <button
                                        onClick={handleCustomQuestion}
                                        disabled={!customQuestion.trim() || isLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 
                             bg-gradient-to-r from-cyan-500 to-purple-500 
                             rounded-lg text-white disabled:opacity-50"
                                        title="Hantar soalan"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Open Full Chat */}
                            <div className="p-4 border-t border-slate-800">
                                <button
                                    onClick={handleOpenFullChat}
                                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl 
                           text-white flex items-center justify-center gap-2 transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                                    <span>Buka Smart Deen Chat</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            {/* Loading Overlay */}
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm 
                             flex items-center justify-center"
                                    >
                                        <div className="text-center">
                                            <div className="w-12 h-12 border-3 border-cyan-500 border-t-transparent 
                                     rounded-full animate-spin mx-auto mb-3" />
                                            <p className="text-sm text-slate-400">Menghubungi Ustaz AI...</p>
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

/**
 * 🤔 Tadabbur AI - Reflection Questions After Reading
 * 
 * AI-powered component that asks thought-provoking questions
 * to encourage deep reflection (tadabbur) on Quran verses
 * 
 * Features:
 * - Context-aware reflection questions
 * - Integration with Ustaz AI
 * - Save personal reflections
 * - Theme-based prompts
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Send, Loader2, Lightbulb,
    Save, X, Sparkles, Brain, BookOpen,
    ChevronDown, ChevronUp
} from 'lucide-react';

interface TadabburAIProps {
    surahNumber: number;
    surahName: string;
    verseNumber: number;
    arabicText: string;
    translation: string;
    isOpen: boolean;
    onClose: () => void;
    onSaveReflection?: (reflection: string) => void;
}

interface ReflectionQuestion {
    id: string;
    question: string;
    theme: string;
    followUp?: string;
}

// Pre-defined reflection question templates
const REFLECTION_TEMPLATES: Record<string, ReflectionQuestion[]> = {
    default: [
        { id: 'meaning', question: 'Apakah mesej utama yang Allah sampaikan dalam ayat ini?', theme: 'Pemahaman' },
        { id: 'personal', question: 'Bagaimana ayat ini berkaitan dengan kehidupan anda hari ini?', theme: 'Aplikasi' },
        { id: 'action', question: 'Apakah tindakan yang boleh anda ambil selepas membaca ayat ini?', theme: 'Amal' },
    ],
    patience: [
        { id: 'patience1', question: 'Adakah anda sedang menghadapi ujian yang memerlukan kesabaran?', theme: 'Kesabaran' },
        { id: 'patience2', question: 'Bagaimana ayat ini boleh membantu anda lebih sabar?', theme: 'Kesabaran' },
    ],
    gratitude: [
        { id: 'gratitude1', question: 'Apakah nikmat yang anda patut syukuri hari ini?', theme: 'Syukur' },
        { id: 'gratitude2', question: 'Bagaimana anda boleh tunjukkan rasa syukur kepada Allah?', theme: 'Syukur' },
    ],
    tawakkal: [
        { id: 'tawakkal1', question: 'Apakah perkara yang anda risaukan yang patut diserahkan kepada Allah?', theme: 'Tawakkal' },
        { id: 'tawakkal2', question: 'Bagaimana anda boleh tingkatkan tawakkal dalam hidup?', theme: 'Tawakkal' },
    ],
    forgiveness: [
        { id: 'forgive1', question: 'Adakah dosa yang membebankan hati anda?', theme: 'Taubat' },
        { id: 'forgive2', question: 'Bagaimana ayat ini memberi harapan tentang keampunan Allah?', theme: 'Taubat' },
    ],
};

const TadabburAI: React.FC<TadabburAIProps> = ({
    surahNumber,
    surahName,
    verseNumber,
    arabicText,
    translation,
    isOpen,
    onClose,
    onSaveReflection
}) => {
    const [questions, setQuestions] = useState<ReflectionQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponse, setUserResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiFollowUp, setAiFollowUp] = useState<string | null>(null);
    const [savedReflections, setSavedReflections] = useState<string[]>([]);
    const [showAllQuestions, setShowAllQuestions] = useState(false);

    // Detect verse theme and load appropriate questions
    useEffect(() => {
        if (isOpen) {
            const theme = detectVerseTheme(translation);
            const themeQuestions = REFLECTION_TEMPLATES[theme] || [];
            const allQuestions = [...themeQuestions, ...REFLECTION_TEMPLATES.default];

            // Shuffle and limit
            const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
            setQuestions(shuffled);
            setCurrentQuestionIndex(0);
            setUserResponse('');
            setAiFollowUp(null);
        }
    }, [isOpen, translation]);

    // Simple theme detection based on keywords
    const detectVerseTheme = (text: string): string => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('sabar') || lowerText.includes('patience')) return 'patience';
        if (lowerText.includes('syukur') || lowerText.includes('grateful') || lowerText.includes('thankful')) return 'gratitude';
        if (lowerText.includes('tawakkal') || lowerText.includes('trust') || lowerText.includes('rely')) return 'tawakkal';
        if (lowerText.includes('ampun') || lowerText.includes('forgive') || lowerText.includes('mercy')) return 'forgiveness';
        return 'default';
    };

    // Submit reflection and get AI follow-up
    const handleSubmitReflection = useCallback(async () => {
        if (!userResponse.trim()) return;

        setIsGeneratingAI(true);

        // Simulate AI response (replace with actual Ustaz AI call)
        try {
            // In real implementation, call askUstazAI here
            const prompt = `Berdasarkan renungan pengguna tentang ${surahName}:${verseNumber}:
      
Ayat: "${translation.substring(0, 200)}..."

Renungan pengguna: "${userResponse}"

Berikan respons ringkas (2-3 ayat) yang menggalakkan dan mendalam untuk meneruskan tadabbur mereka.`;

            // Simulate AI delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock response (replace with actual AI call)
            const mockResponses = [
                `Mashallah, renungan yang mendalam! ${questions[currentQuestionIndex]?.theme === 'Kesabaran'
                    ? 'Ingatlah, setiap ujian adalah peluang untuk mendekatkan diri kepada Allah.'
                    : 'Teruskan menghayati makna di sebalik ayat ini dalam kehidupan harian.'}`,
                `Alhamdulillah, pemikiran yang baik. Cuba amalkan satu perkara kecil dari renungan ini hari ini.`,
                `Subhanallah, anda sudah mula memahami hikmah di sebalik ayat ini. Teruskan usaha!`,
            ];

            setAiFollowUp(mockResponses[Math.floor(Math.random() * mockResponses.length)]);
            setSavedReflections(prev => [...prev, userResponse]);

        } catch (error) {
            console.error('Error generating AI response:', error);
            setAiFollowUp('Renungan anda telah disimpan. Teruskan menghayati Al-Quran.');
        } finally {
            setIsGeneratingAI(false);
        }
    }, [userResponse, surahName, verseNumber, translation, questions, currentQuestionIndex]);

    // Move to next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setUserResponse('');
            setAiFollowUp(null);
        }
    };

    // Save current reflection
    const handleSave = () => {
        if (onSaveReflection && userResponse.trim()) {
            onSaveReflection(userResponse);
        }
    };

    if (!isOpen) return null;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="w-full max-w-lg bg-slate-900 rounded-t-3xl sm:rounded-2xl 
                     max-h-[85vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 
                             rounded-xl flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Tadabbur AI</h3>
                                <p className="text-xs text-slate-400">{surahName} : {verseNumber}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Tutup panel"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Verse Reference */}
                    <div className="p-4 bg-slate-800/50">
                        <p className="text-right text-xl font-arabic text-white leading-loose mb-2">
                            {arabicText.substring(0, 100)}{arabicText.length > 100 && '...'}
                        </p>
                        <p className="text-sm text-slate-400">
                            {translation.substring(0, 150)}{translation.length > 150 && '...'}
                        </p>
                    </div>

                    {/* Questions Area */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {/* Progress Indicators */}
                        <div className="flex items-center gap-1 mb-4">
                            {questions.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-full transition-colors ${i <= currentQuestionIndex ? 'bg-raudhah-teal' : 'bg-slate-700'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Current Question */}
                        {currentQuestion ? (
                            <motion.div
                                key={currentQuestion.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Lightbulb className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-emerald-400 mb-1 block">{currentQuestion.theme}</span>
                                        <p className="text-white font-medium">{currentQuestion.question}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}

                        {/* User Response Area */}
                        <div className="relative">
                            <textarea
                                value={userResponse}
                                onChange={(e) => setUserResponse(e.target.value)}
                                placeholder="Tulis renungan anda di sini..."
                                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4
                          text-white placeholder-slate-500 resize-none
                          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                <span className="text-xs text-slate-500">{userResponse.length}/500</span>
                            </div>
                        </div>

                        {/* AI Follow-up Response */}
                        <AnimatePresence>
                            {aiFollowUp ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-4 p-4 bg-gradient-to-r from-raudhah-teal/10 to-emerald-500/10 
                            border border-raudhah-teal/20 rounded-xl"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-raudhah-teal to-emerald-500 
                                   rounded-full flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <span className="text-xs text-raudhah-teal mb-1 block">Ustaz AI</span>
                                            <p className="text-slate-300 text-sm">{aiFollowUp}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        {/* All Questions Toggle */}
                        <button
                            onClick={() => setShowAllQuestions(!showAllQuestions)}
                            className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            {showAllQuestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {showAllQuestions ? 'Sembunyikan soalan lain' : 'Lihat semua soalan'}
                        </button>

                        <AnimatePresence>
                            {showAllQuestions && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-2 space-y-2 overflow-hidden"
                                >
                                    {questions.map((q, i) => (
                                        <button
                                            key={q.id}
                                            onClick={() => {
                                                setCurrentQuestionIndex(i);
                                                setUserResponse('');
                                                setAiFollowUp(null);
                                                setShowAllQuestions(false);
                                            }}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${i === currentQuestionIndex
                                                ? 'bg-emerald-500/20 border border-emerald-500/30'
                                                : 'bg-slate-800 hover:bg-slate-700'
                                                }`}
                                        >
                                            <span className="text-xs text-emerald-400">{q.theme}</span>
                                            <p className="text-sm text-slate-300">{q.question}</p>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-slate-800 flex items-center gap-2">
                        {!aiFollowUp ? (
                            <>
                                <button
                                    onClick={handleSubmitReflection}
                                    disabled={!userResponse.trim() || isGeneratingAI}
                                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 
                            rounded-xl text-white font-medium
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2"
                                >
                                    {isGeneratingAI ? (
                                        <>
                                            <div className="inline-flex animate-spin">
                                                <Loader2 className="w-4 h-4" />
                                            </div>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Hantar Renungan
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 
                            rounded-xl text-white flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Simpan
                                </button>
                                {currentQuestionIndex < questions.length - 1 && (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 
                              rounded-xl text-white font-medium"
                                    >
                                        Soalan Seterusnya
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TadabburAI;

/**
 * 🎮 SurahQuest — Gamified Word-by-Word Surah Conquest
 * 
 * Interactive learning mode where users progress through a surah
 * word by word, earning XP and unlocking achievements.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Heart, Star, ChevronRight, RotateCcw, Sparkles, Volume2 } from 'lucide-react';

interface SurahWord {
    id: number;
    arabic: string;
    transliteration: string;
    translation: string;
    position: number;
}

interface QuestProgress {
    surahId: number;
    currentWord: number;
    totalWords: number;
    score: number;
    lives: number;
    streak: number;
    completedWords: Set<number>;
}

interface SurahQuestProps {
    surahId: number;
    surahName: string;
    words: SurahWord[];
    onComplete?: (score: number) => void;
    onXPEarned?: (amount: number, reason: string) => void;
}

const MAX_LIVES = 5;
const XP_PER_WORD = 10;
const XP_STREAK_BONUS = 5;
const XP_COMPLETION_BONUS = 100;

const SurahQuest: React.FC<SurahQuestProps> = ({
    surahId,
    surahName,
    words,
    onComplete,
    onXPEarned,
}) => {
    const [progress, setProgress] = useState<QuestProgress>({
        surahId,
        currentWord: 0,
        totalWords: words.length,
        score: 0,
        lives: MAX_LIVES,
        streak: 0,
        completedWords: new Set(),
    });

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const currentWord = words[progress.currentWord];

    // Generate 4 multiple choice options (1 correct + 3 wrong)
    const options = useMemo(() => {
        if (!currentWord) return [];

        const correctAnswer = currentWord.translation;
        const wrongAnswers = words
            .filter(w => w.id !== currentWord.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w.translation);

        return [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    }, [currentWord, words]);

    const handleAnswer = useCallback((answer: string) => {
        if (showResult || !currentWord) return;

        const correct = answer === currentWord.translation;
        setSelectedAnswer(answer);
        setIsCorrect(correct);
        setShowResult(true);

        setProgress(prev => {
            const newProgress = { ...prev };

            if (correct) {
                newProgress.score += XP_PER_WORD + (prev.streak * XP_STREAK_BONUS);
                newProgress.streak += 1;
                newProgress.completedWords = new Set([...prev.completedWords, prev.currentWord]);
                onXPEarned?.(XP_PER_WORD + (prev.streak * XP_STREAK_BONUS), `Jawab betul: ${currentWord.arabic}`);
            } else {
                newProgress.lives = Math.max(0, prev.lives - 1);
                newProgress.streak = 0;
                if (newProgress.lives === 0) {
                    setGameOver(true);
                }
            }

            return newProgress;
        });

        // Auto-advance after 1.5s
        setTimeout(() => {
            setShowResult(false);
            setSelectedAnswer(null);
            setIsCorrect(null);

            setProgress(prev => {
                if (prev.currentWord + 1 >= prev.totalWords || prev.lives === 0) {
                    if (prev.lives > 0) {
                        onComplete?.(prev.score + XP_COMPLETION_BONUS);
                        onXPEarned?.(XP_COMPLETION_BONUS, `Khatam SurahQuest: ${surahName}`);
                    }
                    setGameOver(true);
                    return prev;
                }
                return { ...prev, currentWord: prev.currentWord + 1 };
            });
        }, 1500);
    }, [currentWord, showResult, onComplete, onXPEarned, surahName]);

    const resetQuest = () => {
        setProgress({
            surahId,
            currentWord: 0,
            totalWords: words.length,
            score: 0,
            lives: MAX_LIVES,
            streak: 0,
            completedWords: new Set(),
        });
        setGameOver(false);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    const progressPercent = (progress.currentWord / progress.totalWords) * 100;

    if (gameOver) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-raudhah-teal/20 text-center"
            >
                <div className="text-6xl mb-4">{progress.lives > 0 ? '🏆' : '💔'}</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    {progress.lives > 0 ? 'Tahniah! Quest Selesai!' : 'Quest Tamat'}
                </h2>
                <p className="text-slate-400 mb-6">
                    Skor: <span className="text-raudhah-teal font-bold">{progress.score}</span> XP
                    {' • '}
                    {progress.completedWords.size}/{progress.totalWords} perkataan betul
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={resetQuest}
                        className="px-6 py-3 bg-raudhah-teal hover:bg-raudhah-teal rounded-xl text-white font-medium flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Cuba Lagi
                    </button>
                </div>
            </motion.div>
        );
    }

    if (!currentWord) return null;

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-raudhah-teal/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Swords className="w-5 h-5 text-raudhah-teal" />
                    <span className="text-white font-semibold">SurahQuest: {surahName}</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Lives */}
                    <div className="flex gap-1">
                        {Array.from({ length: MAX_LIVES }).map((_, i) => (
                            <Heart
                                key={i}
                                className={`w-4 h-4 ${i < progress.lives ? 'text-red-400 fill-red-400' : 'text-slate-700'}`}
                            />
                        ))}
                    </div>
                    {/* Streak */}
                    {progress.streak > 0 && (
                        <div className="flex items-center gap-1 text-orange-400">
                            <span className="text-sm font-bold">🔥 {progress.streak}x</span>
                        </div>
                    )}
                    {/* Score */}
                    <div className="flex items-center gap-1 text-raudhah-teal">
                        <Star className="w-4 h-4 fill-cyan-400" />
                        <span className="text-sm font-bold">{progress.score}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-raudhah-teal to-purple-500 rounded-full"
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Current Word Display */}
            <motion.div
                key={currentWord.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <p className="text-5xl font-arabic text-white mb-3 leading-relaxed">
                    {currentWord.arabic}
                </p>
                <p className="text-sm text-raudhah-teal/70">{currentWord.transliteration}</p>
                <p className="text-xs text-slate-500 mt-1">
                    Perkataan {progress.currentWord + 1} / {progress.totalWords}
                </p>
            </motion.div>

            {/* Question */}
            <p className="text-center text-slate-300 mb-4 font-medium">
                Apakah maksud perkataan ini?
            </p>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
                {options.map((option, index) => {
                    let btnClass = 'p-4 rounded-xl border text-left transition-all duration-200 ';

                    if (showResult) {
                        if (option === currentWord.translation) {
                            btnClass += 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                        } else if (option === selectedAnswer && !isCorrect) {
                            btnClass += 'bg-red-500/20 border-red-500 text-red-300';
                        } else {
                            btnClass += 'bg-slate-800/50 border-slate-700 text-slate-500';
                        }
                    } else {
                        btnClass += 'bg-slate-800/50 border-slate-700 text-white hover:border-raudhah-teal/50 hover:bg-raudhah-teal/10 cursor-pointer';
                    }

                    return (
                        <motion.button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={showResult}
                            whileHover={!showResult ? { scale: 1.02 } : undefined}
                            whileTap={!showResult ? { scale: 0.98 } : undefined}
                            className={btnClass}
                        >
                            <span className="text-xs text-slate-500 mb-1 block">{String.fromCharCode(65 + index)}</span>
                            <span className="text-sm">{option}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Result Feedback */}
            <AnimatePresence>
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-4 p-3 rounded-xl text-center text-sm font-medium ${isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                    >
                        {isCorrect ? (
                            <span>✅ Betul! +{XP_PER_WORD + ((progress.streak - 1) * XP_STREAK_BONUS)} XP</span>
                        ) : (
                            <span>❌ Salah. Jawapan: {currentWord.translation}</span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SurahQuest;

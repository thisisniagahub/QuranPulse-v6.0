/**
 * 📚 Khatam Progress Tracker
 * Visual progress indicator for completing the entire Quran
 * 
 * Features:
 * - Animated book-filling progress bar
 * - Juz-by-juz milestone tracking
 * - Ramadan special theme
 * - Celebration animations on milestones
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Trophy, Target, Calendar, TrendingUp,
    Sparkles, Star, Clock, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KhatamProgress {
    totalVerses: number;       // 6236 total
    versesRead: number;
    juzCompleted: number;      // 0-30
    surahsCompleted: number;   // 0-114
    startDate: string;
    targetDate: string;
    dailyTarget: number;
    currentStreak: number;
}

interface KhatamProgressTrackerProps {
    progress?: Partial<KhatamProgress>;
    onSetGoal?: () => void;
    compact?: boolean;
    className?: string;
}

const TOTAL_VERSES = 6236;
const TOTAL_JUZ = 30;
const TOTAL_SURAHS = 114;

// Juz boundaries (approximate verse counts)
const JUZ_MILESTONES = [
    { juz: 1, verseStart: 1, name: "Juz 1 - Al-Fatiha" },
    { juz: 5, verseStart: 830, name: "Juz 5 - An-Nisa" },
    { juz: 10, verseStart: 1741, name: "Juz 10 - Al-Anfal" },
    { juz: 15, verseStart: 2620, name: "Juz 15 - Bani Israel" },
    { juz: 20, verseStart: 3563, name: "Juz 20 - Ankabut" },
    { juz: 25, verseStart: 4431, name: "Juz 25 - Fussilat" },
    { juz: 30, verseStart: 5673, name: "Juz 30 - Juz Amma" },
];

const STORAGE_KEY = 'quranpulse_khatam_progress';

const getStoredProgress = (): KhatamProgress => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading khatam progress:', e);
    }

    return {
        totalVerses: TOTAL_VERSES,
        versesRead: 0,
        juzCompleted: 0,
        surahsCompleted: 0,
        startDate: new Date().toISOString(),
        targetDate: '',
        dailyTarget: 20,
        currentStreak: 0,
    };
};

const KhatamProgressTracker: React.FC<KhatamProgressTrackerProps> = ({
    progress: externalProgress,
    onSetGoal,
    compact = false,
    className = ''
}) => {
    const [progress, setProgress] = useState<KhatamProgress>(getStoredProgress());
    const [showCelebration, setShowCelebration] = useState(false);

    // Merge external progress if provided
    useEffect(() => {
        if (externalProgress) {
            setProgress(prev => ({ ...prev, ...externalProgress }));
        }
    }, [externalProgress]);

    // Calculate derived values
    const stats = useMemo(() => {
        const percentage = (progress.versesRead / TOTAL_VERSES) * 100;
        const juzProgress = Math.floor((progress.versesRead / TOTAL_VERSES) * TOTAL_JUZ);
        const daysRemaining = progress.targetDate
            ? Math.ceil((new Date(progress.targetDate).getTime() - Date.now()) / 86400000)
            : null;
        const versesRemaining = TOTAL_VERSES - progress.versesRead;
        const dailyNeeded = daysRemaining
            ? Math.ceil(versesRemaining / daysRemaining)
            : progress.dailyTarget;

        return {
            percentage: Math.min(percentage, 100),
            juzProgress,
            daysRemaining,
            versesRemaining,
            dailyNeeded,
            isOnTrack: dailyNeeded <= progress.dailyTarget,
        };
    }, [progress]);

    // Check for milestone achievement
    useEffect(() => {
        const currentJuz = Math.floor((progress.versesRead / TOTAL_VERSES) * TOTAL_JUZ);
        if (currentJuz > progress.juzCompleted) {
            // Milestone achieved!
            setShowCelebration(true);
            celebrateMilestone();

            setProgress(prev => ({
                ...prev,
                juzCompleted: currentJuz,
            }));
        }
    }, [progress.versesRead]);

    const celebrateMilestone = () => {
        // Confetti effect
        if (typeof window !== 'undefined' && confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#06b6d4', '#8b5cf6', '#f59e0b'],
            });
        }

        setTimeout(() => setShowCelebration(false), 3000);
    };

    // Compact version
    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-r from-purple-500/20 to-cyan-500/20 
                    rounded-xl p-4 cursor-pointer group ${className}`}
                onClick={onSetGoal}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 
                           rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-purple-400">Khatam Progress</p>
                            <p className="text-sm font-semibold text-white">
                                {stats.percentage.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative overflow-hidden rounded-2xl ${className}`}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />

            {/* Celebration Overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 
                       flex items-center justify-center z-20"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="text-center"
                        >
                            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">Tahniah!</p>
                            <p className="text-cyan-400">Juz {progress.juzCompleted} Selesai!</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 
                           rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Khatam Progress</h3>
                            <p className="text-sm text-slate-400">
                                {progress.versesRead.toLocaleString()} / {TOTAL_VERSES.toLocaleString()} ayat
                            </p>
                        </div>
                    </div>

                    {onSetGoal && (
                        <button
                            onClick={onSetGoal}
                            className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 
                         rounded-lg text-purple-400 text-sm transition-colors
                         flex items-center gap-1"
                        >
                            <Target className="w-4 h-4" />
                            Set Goal
                        </button>
                    )}
                </div>

                {/* Main Progress */}
                <div className="mb-6">
                    {/* Percentage Display */}
                    <div className="flex items-end justify-between mb-2">
                        <div>
                            <span className="text-4xl font-bold text-white">
                                {stats.percentage.toFixed(1)}
                            </span>
                            <span className="text-2xl text-slate-400 ml-1">%</span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-400">
                                Juz {stats.juzProgress} / {TOTAL_JUZ}
                            </p>
                        </div>
                    </div>

                    {/* Visual Book Progress */}
                    <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden mb-2">
                        {/* Book segments */}
                        <div className="absolute inset-0 flex">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 border-r border-slate-700 last:border-0 ${i < stats.juzProgress
                                            ? 'bg-gradient-to-b from-purple-500 to-cyan-500'
                                            : ''
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Animated progress fill */}
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/50 to-cyan-500/50"
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.percentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </div>

                    {/* Juz Labels */}
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Juz 1</span>
                        <span>Juz 15</span>
                        <span>Juz 30</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{progress.currentStreak}</p>
                        <p className="text-xs text-slate-400">Hari Streak</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{stats.dailyNeeded}</p>
                        <p className="text-xs text-slate-400">Ayat/Hari</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{stats.juzProgress}</p>
                        <p className="text-xs text-slate-400">Juz Selesai</p>
                    </div>
                </div>

                {/* Target Info */}
                {progress.targetDate && (
                    <div className={`p-3 rounded-lg ${stats.isOnTrack
                            ? 'bg-green-500/20 border border-green-500/30'
                            : 'bg-orange-500/20 border border-orange-500/30'
                        }`}>
                        <div className="flex items-center gap-2">
                            <Calendar className={`w-4 h-4 ${stats.isOnTrack ? 'text-green-400' : 'text-orange-400'
                                }`} />
                            <span className={`text-sm ${stats.isOnTrack ? 'text-green-400' : 'text-orange-400'
                                }`}>
                                {stats.isOnTrack
                                    ? `On track! ${stats.daysRemaining} hari lagi`
                                    : `Need ${stats.dailyNeeded} ayat/hari untuk capai target`
                                }
                            </span>
                        </div>
                    </div>
                )}

                {/* Milestones */}
                <div className="mt-4">
                    <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Milestone Seterusnya
                    </p>
                    {JUZ_MILESTONES.filter(m => m.juz > stats.juzProgress).slice(0, 2).map(milestone => (
                        <div
                            key={milestone.juz}
                            className="flex items-center gap-2 py-1 text-sm"
                        >
                            <div className="w-2 h-2 rounded-full bg-slate-600" />
                            <span className="text-slate-400">{milestone.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// Export helper to update progress
export const updateKhatamProgress = (versesRead: number) => {
    const current = getStoredProgress();
    const updated = {
        ...current,
        versesRead,
        juzCompleted: Math.floor((versesRead / TOTAL_VERSES) * TOTAL_JUZ),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};

export default KhatamProgressTracker;

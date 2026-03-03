/**
 * 📚 Khatam Progress Tracker
 * Visual progress indicator for completing the entire Quran
 * 
 * Features:
 * - Animated book-filling progress bar
 * - Juz-by-juz milestone tracking
 * - Celebration animations on milestones
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Trophy, Target, Calendar, TrendingUp,
    Sparkles, Star, Clock, ChevronRight
} from 'lucide-react';
import { storage } from '@/lib/storage';

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

const fireConfetti = async () => {
    if (typeof window === 'undefined') return;

    try {
        const { default: confetti } = await import('canvas-confetti');
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1B6B5A', '#D4AF37', '#1B6B5A'],
        });
    } catch {
        // Ignore animation failures
    }
};

const getStoredProgress = (): KhatamProgress => {
    const stored = storage.get<KhatamProgress>(STORAGE_KEY);
    if (stored) {
        return stored;
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
        // Lazy-load confetti to avoid increasing the initial bundle.
        void fireConfetti();

        setTimeout(() => setShowCelebration(false), 3000);
    };

    // Compact version
    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-raudhah-teal/5 border border-raudhah-teal/10 
                    rounded-xl p-4 cursor-pointer group ${className}`}
                onClick={onSetGoal}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-raudhah-teal rounded-lg flex items-center justify-center shadow-warm">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-raudhah-teal/60 uppercase tracking-wider">Khatam Progress</p>
                            <p className="text-sm font-black text-raudhah-ink">
                                {stats.percentage.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-raudhah-teal/40 group-hover:text-raudhah-teal transition-colors" />
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-raudhah-teal/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-raudhah-teal"
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
            className={`relative overflow-hidden rounded-2xl glass-v7 border border-raudhah-teal/10 ${className}`}
        >
            {/* Background Texture */}
            <div className="absolute inset-0 bg-pattern-dots-raudhah opacity-[0.03] pointer-events-none" />

            {/* Celebration Overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-raudhah-teal/10 backdrop-blur-sm flex items-center justify-center z-20"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="text-center"
                        >
                            <Trophy className="w-16 h-16 text-raudhah-gold mx-auto mb-2" />
                            <p className="text-2xl font-black text-raudhah-ink">Tahniah!</p>
                            <p className="text-raudhah-teal font-bold tracking-widest uppercase text-sm">Juz {progress.juzCompleted} Selesai!</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-raudhah-teal rounded-xl flex items-center justify-center shadow-warm">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-raudhah-ink uppercase tracking-tight">Khatam Progress</h3>
                            <p className="text-xs font-bold text-raudhah-teal/60 uppercase tracking-widest">
                                {progress.versesRead.toLocaleString()} / {TOTAL_VERSES.toLocaleString()} ayat
                            </p>
                        </div>
                    </div>

                    {onSetGoal && (
                        <button
                            onClick={onSetGoal}
                            className="px-3 py-1.5 bg-raudhah-gold/10 hover:bg-raudhah-gold/20 
                         rounded-lg text-raudhah-gold text-[10px] font-black uppercase tracking-widest transition-all
                         flex items-center gap-1 border border-raudhah-gold/20"
                        >
                            <Target className="w-3 h-3" />
                            Set Goal
                        </button>
                    )}
                </div>

                {/* Main Progress */}
                <div className="mb-6">
                    {/* Percentage Display */}
                    <div className="flex items-end justify-between mb-2">
                        <div>
                            <span className="text-4xl font-black text-raudhah-ink">
                                {stats.percentage.toFixed(1)}
                            </span>
                            <span className="text-xl font-bold text-raudhah-teal/40 ml-1">%</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-raudhah-teal/60 uppercase tracking-widest">
                                Juz {stats.juzProgress} / {TOTAL_JUZ}
                            </p>
                        </div>
                    </div>

                    {/* Visual Book Progress */}
                    <div className="relative h-6 bg-raudhah-teal/5 border border-raudhah-teal/10 rounded-lg overflow-hidden mb-2">
                        {/* Book segments */}
                        <div className="absolute inset-0 flex">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 border-r border-raudhah-teal/10 last:border-0 ${i < stats.juzProgress
                                        ? 'bg-raudhah-teal shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                                        : ''
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Animated progress fill marker */}
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-raudhah-gold/20 backdrop-blur-[1px] border-r border-raudhah-gold/50"
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.percentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </div>

                    {/* Juz Labels */}
                    <div className="flex justify-between text-[8px] font-black text-raudhah-teal/30 uppercase tracking-[0.2em]">
                        <span>Juz 1</span>
                        <span>Juz 15</span>
                        <span>Juz 30</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-raudhah-teal/5 border border-raudhah-teal/10 rounded-lg p-3 text-center">
                        <TrendingUp className="w-4 h-4 text-raudhah-teal mx-auto mb-1" />
                        <p className="text-xl font-black text-raudhah-ink">{progress.currentStreak}</p>
                        <p className="text-[8px] font-bold text-raudhah-teal/40 uppercase tracking-widest">Hari Streak</p>
                    </div>

                    <div className="bg-raudhah-teal/5 border border-raudhah-teal/10 rounded-lg p-3 text-center">
                        <Clock className="w-4 h-4 text-raudhah-gold mx-auto mb-1" />
                        <p className="text-xl font-black text-raudhah-ink">{stats.dailyNeeded}</p>
                        <p className="text-[8px] font-bold text-raudhah-teal/40 uppercase tracking-widest">Ayat/Hari</p>
                    </div>

                    <div className="bg-raudhah-teal/5 border border-raudhah-teal/10 rounded-lg p-3 text-center">
                        <Star className="w-4 h-4 text-raudhah-gold mx-auto mb-1" />
                        <p className="text-xl font-black text-raudhah-ink">{stats.juzProgress}</p>
                        <p className="text-[8px] font-bold text-raudhah-teal/40 uppercase tracking-widest">Juz Selesai</p>
                    </div>
                </div>

                {/* Target Info */}
                {progress.targetDate && (
                    <div className={`p-3 rounded-lg border flex items-center gap-3 ${stats.isOnTrack
                        ? 'bg-raudhah-teal/10 border-raudhah-teal/20 text-raudhah-teal'
                        : 'bg-raudhah-gold/10 border-raudhah-gold/20 text-raudhah-gold'
                        }`}>
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {stats.isOnTrack
                                ? `ON TRACK • ${stats.daysRemaining} HARI LAGI`
                                : `TINGKATKAN • ${stats.dailyNeeded} AYAT/HARI`
                            }
                        </span>
                    </div>
                )}

                {/* Milestones */}
                <div className="mt-4 pt-4 border-t border-raudhah-teal/10">
                    <p className="text-[9px] font-black text-raudhah-teal/40 mb-2 flex items-center gap-1 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3 text-raudhah-gold" />
                        Milestone Seterusnya
                    </p>
                    <div className="space-y-2">
                        {JUZ_MILESTONES.filter(m => m.juz > stats.juzProgress).slice(0, 2).map(milestone => (
                            <div
                                key={milestone.juz}
                                className="flex items-center justify-between group/milestone"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-raudhah-teal/20 group-hover/milestone:bg-raudhah-teal transition-colors" />
                                    <span className="text-[10px] font-bold text-raudhah-teal/70">{milestone.name}</span>
                                </div>
                                <span className="text-[9px] font-mono text-raudhah-teal/30">J-{milestone.juz}</span>
                            </div>
                        ))}
                    </div>
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
    storage.set(STORAGE_KEY, updated);
    return updated;
};

export default KhatamProgressTracker;

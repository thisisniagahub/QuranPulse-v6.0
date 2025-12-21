import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import MatchingGame from './components/MatchingGame';
import WordScrambleGame from './components/WordScrambleGame';
import FillInBlankGame from './components/FillInBlankGame';

interface Exercise {
    id: string;
    type: 'MATCHING' | 'FILL_BLANKS' | 'UNSCRAMBLE';
    question_data: any;
    xp_reward: number;
}

const IqraGameEngine: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [xpGained, setXpGained] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('iqra_exercises')
            .select('*')
            .limit(10);

        if (data) setExercises(data);
        setLoading(false);
    };

    const handleAnswer = async (correct: boolean) => {
        if (correct) {
            const current = exercises[currentIndex];
            setXpGained(prev => prev + current.xp_reward);

            // Log to Supabase for Gamification & SRS
            await logProgress(current.id, 5); // 5 = Perfect for SRS
        }

        // Progress to next
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of session
            setShowLevelUp(true);
        }
    };

    const logProgress = async (exerciseId: string, rating: number) => {
        // Implementation for SRS SM-2 logic and XP gain would go here
        console.log(`Logging progress: ${exerciseId} with rating ${rating}`);
    };

    if (loading) return <div className="flex items-center justify-center h-64 text-cyan-400 animate-pulse">Initializing IQRA Engine...</div>;

    if (showLevelUp) return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-black/40 border border-cyan-500/20 rounded-3xl backdrop-blur-xl"
        >
            <i className="fa-solid fa-crown text-6xl text-amber-400 mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]"></i>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Session Complete!</h2>
            <p className="text-cyan-400 font-bold text-xl mb-6">+{xpGained} XP EARNED</p>
            <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-50 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
                Teruskan Belajar
            </button>
        </motion.div>
    );

    const exercise = exercises[currentIndex];

    return (
        <div className="relative h-full flex flex-col items-center">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/5 rounded-full mb-8 overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-xl"
                >
                    {exercise.type === 'MATCHING' && (
                        <MatchingGame data={exercise.question_data} onComplete={() => handleAnswer(true)} />
                    )}
                    {exercise.type === 'UNSCRAMBLE' && (
                        <WordScrambleGame data={exercise.question_data} onComplete={() => handleAnswer(true)} />
                    )}
                    {exercise.type === 'FILL_BLANKS' && (
                        <FillInBlankGame data={exercise.question_data} onComplete={() => handleAnswer(true)} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default IqraGameEngine;

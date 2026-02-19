import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';

interface WordScrambleProps {
    data: {
        words: string[];
        correct_order: string[];
    };
    onComplete: () => void;
}

const WordScrambleGame: React.FC<WordScrambleProps> = ({ data, onComplete }) => {
    const [scrambled, setScrambled] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        // Initialize scrambled words
        setScrambled([...data.words].sort(() => Math.random() - 0.5));
    }, [data]);

    useEffect(() => {
        if (scrambled.join(' ') === data.correct_order.join(' ')) {
            setIsCorrect(true);
            setTimeout(onComplete, 1500);
        }
    }, [scrambled, data, onComplete]);

    return (
        <div className="space-y-8 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Susun Semula Ayat</h3>
                <p className="text-slate-400 text-sm italic">Heret perkataan mengikut turutan yang betul.</p>
            </div>

            <Reorder.Group
                axis="y"
                values={scrambled}
                onReorder={setScrambled}
                className="space-y-3"
            >
                {scrambled.map((word) => (
                    <Reorder.Item
                        key={word}
                        value={word}
                        className={`p-4 rounded-2xl border-2 cursor-grab active:cursor-grabbing transition-all flex items-center justify-between ${isCorrect
                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                : 'bg-black/60 border-white/10 text-white hover:border-cyan-500/30'
                            }`}
                        whileDrag={{ scale: 1.05, boxShadow: "0 0 20px rgba(34,211,238,0.2)" }}
                    >
                        <span className="text-2xl font-arabic">{word}</span>
                        <i className="fa-solid fa-grip-vertical text-slate-600"></i>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {isCorrect && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-green-400 font-bold"
                >
                    <i className="fa-solid fa-circle-check"></i>
                    Maasya-Allah! Susunan Tepat.
                </motion.div>
            )}
        </div>
    );
};

export default WordScrambleGame;

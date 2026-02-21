import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MatchingGameProps {
    data: {
        left: string[];
        right: string[];
    };
    onComplete: () => void;
}

const MatchingGame: React.FC<MatchingGameProps> = ({ data, onComplete }) => {
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [matches, setMatches] = useState<Set<string>>(new Set());
    const [errors, setErrors] = useState<Set<string>>(new Set());

    const checkMatch = (left: string, right: string) => {
        const leftIndex = data.left.indexOf(left);
        const rightIndex = data.right.indexOf(right);

        if (leftIndex === rightIndex) {
            setMatches(prev => new Set([...prev, left, right]));
            // Clear selections
            setSelectedLeft(null);
            setSelectedRight(null);
        } else {
            setErrors(new Set([left, right]));
            setTimeout(() => setErrors(new Set()), 500);
            setSelectedLeft(null);
            setSelectedRight(null);
        }
    };

    useEffect(() => {
        if (matches.size === (data.left.length + data.right.length)) {
            setTimeout(onComplete, 1000);
        }
    }, [matches, data, onComplete]);

    return (
        <div className="space-y-8 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <h3 className="text-xl font-bold text-white text-center mb-4 uppercase tracking-wider">Padankan Huruf & Bunyi</h3>

            <div className="grid grid-cols-2 gap-12">
                {/* Left Column (Arabic) */}
                <div className="space-y-4">
                    {data.left.map((item, idx) => (
                        <motion.button
                            key={`left-${idx}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => !matches.has(item) && setSelectedLeft(item)}
                            className={`w-full py-6 rounded-2xl text-4xl font-arabic border-2 transition-all ${matches.has(item)
                                    ? 'bg-green-500/20 border-green-500 text-green-400 opacity-50 cursor-default'
                                    : selectedLeft === item
                                        ? 'bg-raudhah-teal/10 border-raudhah-teal text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                        : 'bg-black/40 border-white/10 text-slate-300 hover:border-raudhah-teal/50'
                                } ${errors.has(item) ? 'bg-red-500/20 border-red-500 animate-shake' : ''}`}
                        >
                            {item}
                        </motion.button>
                    ))}
                </div>

                {/* Right Column (Transliteration) */}
                <div className="space-y-4">
                    {data.right.map((item, idx) => (
                        <motion.button
                            key={`right-${idx}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (!matches.has(item) && selectedLeft) {
                                    checkMatch(selectedLeft, item);
                                } else if (!matches.has(item)) {
                                    setSelectedRight(item);
                                }
                            }}
                            className={`w-full py-6 rounded-2xl text-xl font-bold border-2 transition-all ${matches.has(item)
                                    ? 'bg-green-500/20 border-green-500 text-green-400 opacity-50 cursor-default'
                                    : selectedRight === item || (selectedLeft && data.right[data.left.indexOf(selectedLeft)] === item && selectedRight)
                                        ? 'bg-purple-500/20 border-purple-400 text-white'
                                        : 'bg-black/40 border-white/10 text-slate-300 hover:border-purple-500/50'
                                } ${errors.has(item) ? 'bg-red-500/20 border-red-500 animate-shake' : ''}`}
                        >
                            {item}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="text-center pt-4">
                <p className="text-slate-500 text-xs italic">Klik huruf Arab kemudian bunyi yang sepadan.</p>
            </div>
        </div>
    );
};

export default MatchingGame;

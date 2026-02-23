import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuantumSearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isSemanticMode: boolean;
    setIsSemanticMode: (mode: boolean) => void;
    handleSemanticSearch: () => void;
}

const QuantumSearchBar: React.FC<QuantumSearchBarProps> = ({
    searchQuery,
    setSearchQuery,
    isSemanticMode,
    setIsSemanticMode,
    handleSemanticSearch
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative z-50 w-full max-w-3xl mx-auto mb-8">
            {/* Outer Glow & Border */}
            <motion.div
                animate={{
                    boxShadow: isSemanticMode
                        ? "0 0 30px rgba(196, 151, 42, 0.1)"
                        : "0 0 30px rgba(27, 107, 90, 0.05)",
                    borderColor: isSemanticMode
                        ? "rgba(196, 151, 42, 0.3)"
                        : "rgba(27, 107, 90, 0.1)"
                }}
                className="glass-v7 rounded-2xl border transition-all duration-500 overflow-hidden"
            >
                <div className="flex items-center px-4 py-1 relative">

                    {/* Animated Leading Icon */}
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        <AnimatePresence mode="wait">
                            {isSemanticMode ? (
                                <motion.div
                                    key="brain"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    className="w-10 h-10 rounded-full bg-raudhah-gold/10 flex items-center justify-center border border-raudhah-gold/30"
                                >
                                    <i className="fa-solid fa-brain text-raudhah-gold animate-pulse"></i>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="search"
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: -180 }}
                                    className="w-10 h-10 rounded-full bg-raudhah-teal/10 flex items-center justify-center border border-raudhah-teal/30"
                                >
                                    <i className="fa-solid fa-search text-raudhah-teal"></i>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Input Field */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={(e) => e.key === 'Enter' && isSemanticMode && handleSemanticSearch()}
                        placeholder={isSemanticMode ? "Ask the Quran... (e.g. 'How to be patient')" : "Search Surah (e.g. 'Kahf')"}
                        className="flex-1 bg-transparent border-none outline-none text-raudhah-ink px-4 h-14 font-medium placeholder-raudhah-teal/40"
                    />

                    {/* Mode Toggle Button */}
                    <button
                        onClick={() => setIsSemanticMode(!isSemanticMode)}
                        className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 overflow-hidden group ${isSemanticMode
                            ? 'bg-raudhah-gold/10 text-raudhah-gold border border-raudhah-gold/30'
                            : 'bg-raudhah-teal/5 text-raudhah-teal/70 border border-raudhah-teal/20 hover:text-raudhah-teal'
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isSemanticMode ? 'AI MODE' : 'LIST MODE'}
                            <i className={`fa-solid ${isSemanticMode ? 'fa-wand-magic-sparkles' : 'fa-list'} text-[10px]`}></i>
                        </span>
                        {/* Hover Glint */}
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    </button>

                </div>

                {/* Linear Scanline Animation at bottom */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-raudhah-teal/10">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: isFocused || searchQuery ? '100%' : '-100%' }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "linear",
                            repeatDelay: 0.5
                        }}
                        className={`h-full w-1/2 bg-gradient-to-r from-transparent ${isSemanticMode ? 'via-raudhah-gold' : 'via-raudhah-teal'} to-transparent`}
                    />
                </div>

            </motion.div>

            {/* Helper Text */}
            <AnimatePresence>
                {isSemanticMode && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-8 left-4 text-[10px] text-raudhah-gold/80 font-mono flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 bg-raudhah-gold rounded-full animate-ping"></span>
                        QUANTUM NEURAL SEARCH ENGINE ACTIVE
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuantumSearchBar;

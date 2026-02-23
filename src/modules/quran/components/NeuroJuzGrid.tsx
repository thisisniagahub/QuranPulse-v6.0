import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface NeuroJuzGridProps {
    juzList: number[];
    juzStartSurahMap: Record<number, number>;
    onSelect: (startSurahId: number) => void;
}

const NeuroJuzGridComponent: React.FC<NeuroJuzGridProps> = ({ juzList, juzStartSurahMap, onSelect }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {juzList.map((juzNum, index) => (
                <motion.div
                    key={juzNum}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onSelect(juzStartSurahMap[juzNum] || 1)}
                    className="group relative aspect-square cursor-pointer"
                >
                    {/* The Cube Container */}
                    <div className="absolute inset-0 glass-v7 rounded-2xl border border-raudhah-teal/10 transition-all duration-300 group-hover:border-raudhah-gold/50 group-hover:bg-raudhah-teal/5 flex flex-col items-center justify-center shadow-warm">

                        {/* Decorative Circuit Lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity duration-500" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#C4972A" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                        </svg>

                        <span className="text-sm font-bold text-raudhah-teal/40 uppercase tracking-widest mb-1 group-hover:text-raudhah-gold transition-colors">JUZ</span>
                        <span className="text-4xl font-bold text-raudhah-ink group-hover:text-raudhah-teal transition-colors">{juzNum}</span>

                        {/* Bottom Accent */}
                        <div className="absolute bottom-3 w-1/3 h-0.5 bg-raudhah-teal/10 group-hover:bg-raudhah-gold transition-colors rounded-full"></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default memo(NeuroJuzGridComponent);

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
                    <div className="absolute inset-0 bg-sheet/40 backdrop-blur-md rounded-2xl border border-white transition-all duration-300 group-hover:border-gold-500/50 group-hover:bg-surface-dark flex flex-col items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        
                        {/* Decorative Circuit Lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                        </svg>

                        <span className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1 group-hover:text-gold-500/80 transition-colors">JUZ</span>
                        <span className="text-4xl font-bold text-white/80 group-hover:text-white transition-colors">{juzNum}</span>
                        
                        {/* Bottom Accent */}
                        <div className="absolute bottom-3 w-1/3 h-0.5 bg-surface-dark group-hover:bg-gold-500 transition-colors rounded-full"></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default memo(NeuroJuzGridComponent);

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { QuranChapter } from '../../../types';

interface HoloSurahCardProps {
    chapter: QuranChapter;
    onClick: () => void;
    index: number;
    isOfflineReady?: boolean;
}

const HoloSurahCardComponent: React.FC<HoloSurahCardProps> = ({ chapter, onClick, index, isOfflineReady }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={onClick}
            className="group relative h-28 cursor-pointer perspective-1000"
        >
            <div className="absolute inset-0 bg-sheet/40 backdrop-blur-md rounded-2xl border border-white transition-all duration-300 group-hover:border-primary/50 group-hover:bg-surface-dark/60 group-hover:shadow-neon overflow-hidden">
                
                {/* Offline Ready Badge */}
                {isOfflineReady && (
                    <div className="absolute top-2 left-2 z-20">
                        <div className="bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <i className="fa-solid fa-cloud-arrow-down text-emerald-400 text-[8px]"></i>
                            <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">OFFLINE READY</span>
                        </div>
                    </div>
                )}

                {/* 1. Massive Background Arabic (Watermark) */}                <div className="absolute -right-4 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                    <span className="font-arabic text-9xl leading-none text-white blur-[1px]">{chapter.name_arabic}</span>
                </div>

                {/* 2. Interactive Border Glow (Rotating Gradient) */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none skew-x-12"></div>
                
                {/* 3. Content Container */}
                <div className="relative h-full p-5 flex items-center justify-between z-10">
                    
                    {/* Left: Number & Info */}
                    <div className="flex items-center gap-5">
                        {/* Hex Number Badge */}
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="absolute inset-0 text-primary/20 group-hover:text-primary transition-colors duration-300">
                                <path d="M50 0 L93 25 L93 75 L50 100 L7 75 L7 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span className="font-mono text-lg font-bold text-white/60 group-hover:text-white transition-colors">{chapter.id}</span>
                        </div>

                        {/* Text Info */}
                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">
                                {chapter.name_simple}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 bg-background-dark/50 px-2 py-0.5 rounded border border-white/10">
                                    {chapter.revelation_place}
                                </span>
                                <span className="text-[10px] text-white/40 font-mono">
                                    {chapter.verses_count} AYAHS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Arabic & Action */}
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-arabic text-2xl text-white group-hover:text-primary transition-colors drop-shadow-[0_0_8px_rgba(90,185,255,0.4)]">
                            {chapter.name_arabic}
                        </span>
                         <span className="text-[10px] italic text-white/40 group-hover:text-primary/70 transition-colors">
                            {chapter.translated_name.name}
                        </span>
                    </div>

                </div>

                {/* 4. Active Corner Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="absolute top-0 right-0 w-full h-[1px] bg-primary"></div>
                     <div className="absolute top-0 right-0 h-full w-[1px] bg-primary"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(HoloSurahCardComponent);

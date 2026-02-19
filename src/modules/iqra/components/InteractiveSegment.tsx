import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getLetterInfo } from '../data/letterData';
import { Volume2, Info } from 'lucide-react';

interface InteractiveSegmentProps {
    text: string;
    isActive: boolean;
    onClick: (text: string, info: any) => void;
    onPlayAudio: (text: string) => void;
    fontSize?: string;
}

const InteractiveSegment: React.FC<InteractiveSegmentProps> = ({
    text,
    isActive,
    onClick,
    onPlayAudio,
    fontSize = "text-5xl"
}) => {
    const info = getLetterInfo(text);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout={false}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                onClick(text, info);
                onPlayAudio(text);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                relative cursor-pointer select-none rounded-[1.5rem] p-4 transition-all duration-300
                flex items-center justify-center w-full aspect-square
                ${isActive
                    ? 'bg-white text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.2)] scale-105 z-10 border-2 border-primary'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-white/10'
                }
            `}
        >
            {/* Main Arabic Text */}
            <span
                className={`font-arabic ${fontSize} leading-none ${isActive ? 'text-slate-900' : 'text-slate-100'} drop-shadow-sm font-scheherazade`}
            >
                {text}
            </span>

            {/* Quick Actions (Appear on Hover) */}
            {(isHovered || isActive) && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute bottom-2 right-2 flex gap-1 ${isActive ? "text-slate-400" : "text-slate-500"}`}
                >
                    <Volume2 size={14} className={isActive ? "text-primary" : "text-white/50"} />
                </motion.div>
            )}
        </motion.div>
    );
};

export default InteractiveSegment;

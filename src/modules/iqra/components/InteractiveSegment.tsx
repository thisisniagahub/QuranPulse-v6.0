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
    fontSize = "text-4xl"
}) => {
    const info = getLetterInfo(text);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            whileHover={{ scale: 1.1, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                onClick(text, info);
                onPlayAudio(text);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                relative cursor-pointer select-none rounded-xl p-4 transition-all duration-300
                flex items-center justify-center min-w-[80px] min-h-[80px]
                ${isActive 
                    ? 'bg-gradient-to-br from-[#5ab9ff]/20 to-[#5ab9ff]/5 border-[#5ab9ff] shadow-[0_0_20px_rgba(90,185,255,0.3)]' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }
                border
            `}
        >
            {/* Main Arabic Text */}
            <span className={`font-arabic ${fontSize} ${isActive ? 'text-[#5ab9ff]' : 'text-white'} drop-shadow-md`}>
                {text}
            </span>

            {/* Quick Actions (Appear on Hover) */}
            {(isHovered || isActive) && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-2 flex gap-1"
                >
                    <div className="bg-[#5ab9ff] text-[#051324] p-1 rounded-full shadow-lg">
                        <Volume2 size={10} />
                    </div>
                    {info && (
                        <div className="bg-slate-700 text-white p-1 rounded-full shadow-lg">
                            <Info size={10} />
                        </div>
                    )}
                </motion.div>
            )}

            {/* Transliteration Hint (Optional/Small) */}
            {info && isActive && (
                <div className="absolute -top-3 bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-white/10 tracking-wider font-mono">
                    {info.transliteration}
                </div>
            )}
        </motion.div>
    );
};

export default InteractiveSegment;

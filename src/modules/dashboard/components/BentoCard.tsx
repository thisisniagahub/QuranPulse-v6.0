import React from 'react';
import { motion } from 'framer-motion';

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    delay?: number;
    bgImage?: string;
    disabled?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({ 
    children, 
    className = "", 
    onClick,
    delay = 0,
    bgImage,
    disabled = false
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={!disabled ? onClick : undefined}
        className={`relative overflow-hidden rounded-[2rem] backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] group ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${!bgImage ? 'bg-white/5' : ''} ${className}`}
    >
        {/* Real Image Background Layer */}
        {bgImage && (
            <>
                <div className="absolute inset-0">
                    <img src={bgImage} alt="bg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50" />
                </div>
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent" />
            </>
        )}
        
        {/* Fallback: Glass effect when no image */}
        {!bgImage && (
            <div className="absolute inset-0 bg-sheet/50" />
        )}
        
        {/* Content Layer */}
        <div className="relative z-10 h-full">
            {children}
        </div>
    </motion.div>
);

export default BentoCard;

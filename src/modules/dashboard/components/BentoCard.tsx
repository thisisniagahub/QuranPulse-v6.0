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
        className={`relative overflow-hidden rounded-[2rem] border border-raudhah-teal/10 shadow-warm group ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${!bgImage ? 'glass-v7' : ''} ${className}`}
    >
        {/* Real Image Background Layer */}
        {bgImage && (
            <>
                <div className="absolute inset-0">
                    <img loading="lazy" src={bgImage} alt="bg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 mix-blend-overlay" />
                </div>
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-raudhah-ink/90 via-raudhah-ink/40 to-transparent" />
            </>
        )}

        {/* Fallback pattern when no image */}
        {!bgImage && (
            <div className="absolute inset-0 bg-pattern-dots-raudhah opacity-20" />
        )}

        {/* Content Layer */}
        <div className="relative z-10 h-full">
            {children}
        </div>
    </motion.div>
);

export default BentoCard;


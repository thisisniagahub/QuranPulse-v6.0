import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, size = 'md' }) => {
    const dimensions = size === 'sm' ? { w: 'w-10', h: 'h-6', p: 4 } : { w: 'w-14', h: 'h-8', p: 6 };

    return (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChange(!checked)}>
            <div className={`relative ${dimensions.w} ${dimensions.h} rounded-full transition-colors duration-300 ${checked ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-700 border border-slate-600'}`}>
                <motion.div
                    className="absolute top-1 bottom-1 bg-white rounded-full shadow-md aspect-square"
                    initial={false}
                    animate={{
                        left: checked ? `calc(100% - ${dimensions.h} + 4px)` : '4px',
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>
            {/* Text Label with Neon Glow when active */}
            {label && (
                <span className={`font-semibold tracking-wide transition-colors duration-300 ${checked ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'text-slate-400'}`}>
                    {label}
                </span>
            )}
        </div>
    );
};

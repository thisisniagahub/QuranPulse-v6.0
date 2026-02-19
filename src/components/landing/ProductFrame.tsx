import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ProductFrameProps {
    children: ReactNode;
    className?: string;
    title?: string;
    /** Show browser-style dots in the header */
    showDots?: boolean;
    /** Glow color accent */
    glowColor?: string;
    /** Optional badge text */
    badge?: string;
}

/**
 * ProductFrame — Dark rounded container for embedding actual product UI.
 * Inspired by Google Antigravity's product showcase containers.
 * Creates a browser-window-like frame that makes product demos feel real.
 */
export const ProductFrame: React.FC<ProductFrameProps> = ({
    children,
    className = '',
    title,
    showDots = true,
    glowColor = 'rgba(20, 184, 166, 0.15)',
    badge,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`relative group ${className}`}
        >
            {/* Outer glow */}
            <div
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                style={{ background: glowColor }}
            />

            {/* Main container */}
            <div className="relative bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-2xl xl:rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/20">
                {/* Header bar */}
                {(showDots || title || badge) && (
                    <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            {showDots && (
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                                </div>
                            )}
                            {title && (
                                <span className="text-xs font-medium text-white/40 tracking-wide uppercase ml-1">
                                    {title}
                                </span>
                            )}
                        </div>
                        {badge && (
                            <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-raudhah-teal/20 text-raudhah-teal border border-raudhah-teal/30">
                                {badge}
                            </span>
                        )}
                    </div>
                )}

                {/* Content area */}
                <div className="relative">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

/**
 * ProductScreenshot — For embedding static product screenshots with hover effects.
 */
export const ProductScreenshot: React.FC<{
    children: ReactNode;
    overlay?: ReactNode;
}> = ({ children, overlay }) => {
    return (
        <div className="relative overflow-hidden">
            <div className="transition-transform duration-700 group-hover:scale-[1.02]">
                {children}
            </div>
            {overlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-500">
                    {overlay}
                </div>
            )}
        </div>
    );
};

export default ProductFrame;

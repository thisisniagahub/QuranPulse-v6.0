import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ConfettiDot {
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
    shape: 'circle' | 'square' | 'diamond';
}

interface ParticlesBackgroundProps {
    className?: string;
    dotCount?: number;
}

/**
 * Confetti Dots Background — Antigravity-inspired scattered colored dots.
 * CSS-based (no canvas) for better performance and smaller bundle.
 * Creates a subtle, premium scattered dot pattern.
 */
const COLORS = [
    '#14b8a6', // teal
    '#0d9488', // teal dark
    '#f59e0b', // gold
    '#8b5cf6', // purple
    '#6366f1', // indigo
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#10b981', // emerald
];

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
    className = '',
    dotCount = 60,
}) => {
    const dots = useMemo<ConfettiDot[]>(() => {
        return Array.from({ length: dotCount }, () => {
            const shapes: ConfettiDot['shape'][] = ['circle', 'square', 'diamond'];
            return {
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 5 + 2,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 8,
                duration: Math.random() * 6 + 8,
                shape: shapes[Math.floor(Math.random() * shapes.length)],
            };
        });
    }, [dotCount]);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
            {dots.map((dot, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        left: `${dot.x}%`,
                        top: `${dot.y}%`,
                        width: dot.size,
                        height: dot.size,
                        backgroundColor: dot.color,
                        borderRadius: dot.shape === 'circle' ? '50%' : dot.shape === 'diamond' ? '2px' : '1px',
                        transform: dot.shape === 'diamond' ? 'rotate(45deg)' : undefined,
                        opacity: 0,
                    }}
                    animate={{
                        opacity: [0, 0.6, 0.3, 0.6, 0],
                        y: [0, -15, 5, -10, 0],
                        scale: [0.8, 1.1, 0.9, 1.05, 0.8],
                    }}
                    transition={{
                        duration: dot.duration,
                        delay: dot.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

export default ParticlesBackground;

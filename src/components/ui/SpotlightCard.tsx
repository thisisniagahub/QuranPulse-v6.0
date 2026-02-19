import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
    children,
    className = "",
    spotlightColor = "rgba(255, 255, 255, 0.15)"
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden rounded-3xl border border-raudhah-teal/10 bg-white shadow-sm transition-all duration-300 hover:border-raudhah-teal/30 ${className}`}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px z-0 transition duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${x.get()}px ${y.get()}px, ${spotlightColor}, transparent 40%)`,
                    opacity
                }}
            />
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
};

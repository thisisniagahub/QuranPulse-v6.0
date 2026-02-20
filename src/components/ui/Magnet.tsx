import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MagnetProps {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}

export const Magnet: React.FC<MagnetProps> = ({
    children,
    className = "",
    strength = 0.5
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from center
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        // Only apply if within a reasonable distance
        if (Math.abs(distX) < width && Math.abs(distY) < height) {
            mouseX.set(distX * strength);
            mouseY.set(distY * strength);
        } else {
            mouseX.set(0);
            mouseY.set(0);
        }
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x: 0, y: 0 }}
            className={`relative inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
};

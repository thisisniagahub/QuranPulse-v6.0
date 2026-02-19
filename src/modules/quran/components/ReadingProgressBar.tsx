import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ReadingProgressBar: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 origin-left z-50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            style={{ scaleX }}
        />
    );
};

export default ReadingProgressBar;

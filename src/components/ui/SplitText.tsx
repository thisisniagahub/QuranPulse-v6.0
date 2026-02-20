import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

/**
 * SplitText — Framer Motion version (no GSAP dependency)
 * Splits text into characters/words and animates them on scroll into view.
 * Adapted from ReactBits SplitText concept but uses Framer Motion.
 */

export interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    splitType?: 'chars' | 'words';
    from?: { opacity?: number; y?: number | string; x?: number | string; filter?: string; scale?: number; rotateX?: number };
    to?: { opacity?: number; y?: number | string; x?: number | string; filter?: string; scale?: number; rotateX?: number };
    threshold?: number;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    textAlign?: React.CSSProperties['textAlign'];
    onAnimationComplete?: () => void;
    triggerOnView?: boolean;
    staggerChildren?: number;
}

const SplitText: React.FC<SplitTextProps> = ({
    text,
    className = '',
    delay = 0,
    duration = 0.8,
    splitType = 'chars',
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    tag = 'p',
    textAlign = 'center',
    onAnimationComplete,
    triggerOnView = true,
    staggerChildren = 0.03,
}) => {
    const containerRef = useRef<HTMLElement>(null);
    const isInView = useInView(containerRef, {
        once: true,
        amount: threshold,
    });

    const shouldAnimate = triggerOnView ? isInView : true;

    const units = useMemo(() => {
        if (splitType === 'words') {
            return text.split(' ').map((word, i) => ({
                text: word,
                key: `word-${i}`,
                addSpace: i < text.split(' ').length - 1,
            }));
        }
        // chars
        return text.split('').map((char, i) => ({
            text: char === ' ' ? '\u00A0' : char,
            key: `char-${i}`,
            addSpace: false,
        }));
    }, [text, splitType]);

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                delayChildren: delay,
                staggerChildren,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: from,
        visible: {
            ...to,
            transition: {
                duration,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
    };

    const Tag = tag as React.ElementType;

    return (
        <Tag
            ref={containerRef}
            style={{ textAlign, wordWrap: 'break-word' as const }}
            className={className}
        >
            <motion.span
                className="inline"
                variants={containerVariants}
                initial="hidden"
                animate={shouldAnimate ? 'visible' : 'hidden'}
                onAnimationComplete={onAnimationComplete}
                style={{ display: 'inline' }}
            >
                {units.map(({ text: unitText, key, addSpace }) => (
                    <React.Fragment key={key}>
                        <span className="inline-block overflow-hidden pt-4 -mt-4 pb-4 -mb-4">
                            <motion.span
                                className="inline-block"
                                variants={itemVariants}
                                style={{ willChange: 'transform, opacity' }}
                            >
                                {unitText}
                            </motion.span>
                        </span>
                        {addSpace && ' '}
                    </React.Fragment>
                ))}
            </motion.span>
        </Tag>
    );
};

export default SplitText;

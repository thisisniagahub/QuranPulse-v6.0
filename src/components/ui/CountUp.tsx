import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

interface CountUpProps {
    /** The target number to count up to */
    end: number;
    /** Starting number (default: 0) */
    start?: number;
    /** Duration in seconds */
    duration?: number;
    /** Text to prepend */
    prefix?: string;
    /** Text to append */
    suffix?: string;
    /** Number of decimal places */
    decimals?: number;
    /** Custom className */
    className?: string;
    /** Separator for thousands */
    separator?: string;
    /** Only animate when in view */
    triggerOnView?: boolean;
}

export const CountUp: React.FC<CountUpProps> = ({
    end,
    start = 0,
    duration = 2,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = '',
    separator = ',',
    triggerOnView = true,
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [displayValue, setDisplayValue] = useState(start);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        if (triggerOnView && !isInView) return;

        hasAnimated.current = true;

        const controls = animate(start, end, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
                setDisplayValue(value);
            },
        });

        return () => controls.stop();
    }, [isInView, start, end, duration, triggerOnView]);

    const formatNumber = (num: number): string => {
        const fixed = num.toFixed(decimals);
        if (!separator) return fixed;

        const [intPart, decPart] = fixed.split('.');
        const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        return decPart ? `${formatted}.${decPart}` : formatted;
    };

    return (
        <span ref={ref} className={className}>
            {prefix}{formatNumber(displayValue)}{suffix}
        </span>
    );
};

export default CountUp;

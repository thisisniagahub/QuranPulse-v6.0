import React from 'react';
import { motion } from 'framer-motion';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    gradient?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
    text,
    className = '',
    delay = 0,
    duration = 0.05,
    gradient = false
}) => {
    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: duration, delayChildren: delay }
        })
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100
            }
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            className={`flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    className={`mr-2 ${gradient ? 'bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent' : ''}`}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
    from?: string;
    to?: string;
    animate?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({
    children,
    className = '',
    from = '#22d3ee',
    to = '#06b6d4',
    animate = false
}) => {
    return (
        <span
            className={`gradient-text-custom ${animate ? 'animate-gradient' : ''} ${className}`}
            style={{
                '--gradient-from': from,
                '--gradient-to': to,
                '--gradient-size': animate ? '200%' : '100%'
            } as React.CSSProperties}
        >
            {children}
        </span>
    );
};

interface TypewriterTextProps {
    text: string;
    className?: string;
    speed?: number;
    delay?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    className = '',
    speed = 0.05,
    delay = 0
}) => {
    const characters = text.split('');

    return (
        <motion.span className={className}>
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + index * speed }}
                >
                    {char}
                </motion.span>
            ))}
            <motion.span
                className="inline-block w-0.5 h-[1em] bg-[#22d3ee] ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
            />
        </motion.span>
    );
};

interface NumberCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({
    end,
    duration = 2,
    suffix = '',
    prefix = '',
    className = ''
}) => {
    const [count, setCount] = React.useState(0);
    const [isInView, setIsInView] = React.useState(false);
    const ref = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        if (!isInView) return;

        const startTime = Date.now();
        const endTime = startTime + duration * 1000;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / (duration * 1000), 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));

            if (now < endTime) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animate();
    }, [isInView, end, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
};

import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    shimmerColor?: string;
    background?: string;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
    children,
    onClick,
    className = '',
    shimmerColor = 'rgba(255,255,255,0.4)',
    background = '#22d3ee'
}) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl overflow-hidden ${className}`}
            style={{ background }}
        >
            {/* Shimmer effect */}
            <div
                className="absolute inset-0 shimmer-bg"
                style={{ '--shimmer-color': shimmerColor } as React.CSSProperties}
            />
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
        </motion.button>
    );
};

interface PulsatingButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    pulseColor?: string;
}

export const PulsatingButton: React.FC<PulsatingButtonProps> = ({
    children,
    onClick,
    className = '',
    pulseColor = '#22d3ee'
}) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative inline-flex items-center justify-center ${className}`}
        >
            {/* Pulsating ring */}
            <span
                className="absolute inset-0 rounded-xl animate-ping opacity-20 dynamic-bg"
                style={{ '--dynamic-color': pulseColor } as React.CSSProperties}
            />
            <span
                className="absolute inset-0 rounded-xl animate-pulse opacity-40 dynamic-bg"
                style={{ '--dynamic-color': pulseColor } as React.CSSProperties}
            />
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

interface GlowingBorderCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

export const GlowingBorderCard: React.FC<GlowingBorderCardProps> = ({
    children,
    className = '',
    glowColor = '#22d3ee'
}) => {
    return (
        <div className={`relative group ${className}`}>
            {/* Animated border */}
            <div
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"
                style={{
                    '--dynamic-color': glowColor,
                    background: `linear-gradient(90deg, var(--dynamic-color), transparent, var(--dynamic-color))`,
                    backgroundSize: '200% 100%',
                    animation: 'borderGlow 3s linear infinite'
                } as React.CSSProperties}
            />
            <div className="relative bg-[#020617] rounded-2xl">
                {children}
            </div>
            <style>{`
        @keyframes borderGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
        </div>
    );
};

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = ''
}) => {
    const ref = React.useRef<HTMLButtonElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (clientX - left - width / 2) * 0.3;
        const y = (clientY - top - height / 2) * 0.3;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={ref}
            onMouseLeave={handleMouseLeave}
            animate={{ x: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            className={className}
        >
            {children}
        </motion.button>
    );
};

/**
 * Animation Utilities for QuranPulse v6.0
 * 
 * Standardized Framer Motion animation variants
 * Following "Raudhah" aesthetic with smooth, elegant animations
 */

import type { Variants, Transition } from 'framer-motion';

// ============================================
// TRANSITION PRESETS
// ============================================

export const springTransition: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
};

export const smoothTransition: Transition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
};

export const gentleTransition: Transition = {
    type: 'tween',
    ease: [0.4, 0, 0.2, 1],
    duration: 0.4,
};

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: smoothTransition
    },
    exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: gentleTransition
    },
    exit: { opacity: 0, y: -10 },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: gentleTransition
    },
    exit: { opacity: 0, y: 10 },
};

export const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: springTransition
    },
    exit: { opacity: 0, scale: 0.95 },
};

// ============================================
// SLIDE ANIMATIONS
// ============================================

export const slideInLeft: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: gentleTransition
    },
    exit: { x: -30, opacity: 0 },
};

export const slideInRight: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: gentleTransition
    },
    exit: { x: 30, opacity: 0 },
};

export const slideUp: Variants = {
    hidden: { y: '100%' },
    visible: {
        y: 0,
        transition: springTransition
    },
    exit: { y: '100%' },
};

// ============================================
// STAGGER ANIMATIONS (for list items)
// ============================================

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: gentleTransition
    },
};

// ============================================
// SPECIAL EFFECTS (Raudhah themed)
// ============================================

export const glowPulse: Variants = {
    idle: {
        boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
    },
    pulse: {
        boxShadow: [
            '0 0 10px rgba(0, 255, 255, 0.3)',
            '0 0 25px rgba(0, 255, 255, 0.6)',
            '0 0 10px rgba(0, 255, 255, 0.3)',
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const floatAnimation: Variants = {
    float: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const shimmer: Variants = {
    shimmer: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

// ============================================
// MODAL & OVERLAY ANIMATIONS
// ============================================

export const modalOverlay: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.15 }
    },
};

export const modalContent: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 10
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: springTransition
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: 0.15 }
    },
};

export const sheetAnimation: Variants = {
    hidden: { y: '100%' },
    visible: {
        y: 0,
        transition: {
            type: 'spring',
            damping: 30,
            stiffness: 300,
        }
    },
    exit: {
        y: '100%',
        transition: { duration: 0.2 }
    },
};

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition: Variants = {
    initial: { opacity: 0, x: -10 },
    animate: {
        opacity: 1,
        x: 0,
        transition: gentleTransition
    },
    exit: {
        opacity: 0,
        x: 10,
        transition: { duration: 0.2 }
    },
};

// ============================================
// BUTTON INTERACTIONS
// ============================================

export const buttonTap = {
    scale: 0.97,
    transition: { duration: 0.1 },
};

export const buttonHover = {
    scale: 1.02,
    transition: springTransition,
};

// ============================================
// UTILITY: Create stagger delay
// ============================================

export const getStaggerDelay = (index: number, baseDelay: number = 0.05): number => {
    return index * baseDelay;
};

// ============================================
// REDUCED MOTION VARIANTS
// ============================================

export const reducedMotionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

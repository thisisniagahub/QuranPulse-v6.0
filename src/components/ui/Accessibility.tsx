import React from 'react';
import { cn } from '@/lib/utils';

/**
 * VisuallyHidden - Accessibility component
 * 
 * Hides content visually while keeping it accessible to screen readers.
 * Useful for providing additional context without visual clutter.
 */
interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    as?: 'span' | 'div';
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
    children,
    as: Component = 'span',
    className,
    ...props
}) => {
    return (
        <Component
            className={cn(
                "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
                "[clip:rect(0,0,0,0)]",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
};

/**
 * FocusRing - Wrapper component that adds consistent focus styling
 */
interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'neon';
}

export const FocusRing: React.FC<FocusRingProps> = ({
    children,
    variant = 'default',
    className,
    ...props
}) => {
    const variants = {
        default: "focus-within:ring-2 focus-within:ring-raudhah-teal focus-within:ring-offset-2 focus-within:ring-offset-slate-900",
        neon: "focus-within:ring-2 focus-within:ring-raudhah-teal focus-within:shadow-[0_0_15px_rgba(27,107,90,0.3)]",
    };

    return (
        <div
            className={cn(
                "rounded-lg transition-all duration-200",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default VisuallyHidden;

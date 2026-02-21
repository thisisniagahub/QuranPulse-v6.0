import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'neon' | 'outline';
    size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const variants = {
            default: "bg-slate-700 text-slate-200 border-slate-600",
            success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            error: "bg-red-500/20 text-red-400 border-red-500/30",
            neon: "bg-raudhah-teal/10 text-raudhah-teal border-raudhah-teal/20 shadow-[0_0_10px_rgba(27,107,90,0.15)]",
            outline: "bg-transparent text-slate-300 border-slate-500",
        };

        const sizes = {
            sm: "px-2 py-0.5 text-xs",
            md: "px-2.5 py-1 text-xs",
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full border font-medium transition-colors",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glow' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    ...props
}, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium tracking-wide transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raudhah-teal/20 focus-visible:ring-offset-2 focus-visible:ring-offset-raudhah-ivory group';

    const variants = {
        primary: 'border border-raudhah-teal/10 bg-raudhah-teal text-white shadow-[0_10px_24px_rgba(27,107,90,0.18)] hover:-translate-y-0.5 hover:bg-[#185b4b] hover:shadow-[0_14px_30px_rgba(27,107,90,0.24)]',
        secondary: 'border border-raudhah-teal/10 bg-raudhah-cream text-raudhah-ink shadow-sm hover:-translate-y-0.5 hover:bg-[#efe6d8] hover:shadow-[0_10px_20px_rgba(27,107,90,0.08)]',
        ghost: 'bg-transparent text-raudhah-ink/70 hover:bg-raudhah-cream/60 hover:text-raudhah-ink',
        glow: 'border border-raudhah-teal/10 bg-gradient-to-r from-raudhah-teal to-[#2F7C6B] text-white shadow-[0_12px_28px_rgba(27,107,90,0.2)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(27,107,90,0.28)]',
        outline: 'border border-raudhah-teal/20 bg-transparent text-raudhah-teal hover:-translate-y-0.5 hover:bg-raudhah-teal/5 hover:border-raudhah-teal/35',
    };

    const sizes = {
        sm: 'px-3.5 py-2 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3.5 text-base',
        icon: 'p-2 aspect-square',
    };

    return (
        <button
            ref={ref}
            aria-busy={isLoading || undefined}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {(variant === 'primary' || variant === 'glow') && (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-safe:group-hover:animate-shimmer" />
            )}

            {isLoading ? (
                <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="sr-only">Loading</span>
                </>
            ) : leftIcon ? (
                <span className="mr-2">{leftIcon}</span>
            ) : null}

            <span className="relative z-10">{children}</span>

            {!isLoading && rightIcon && (
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">{rightIcon}</span>
            )}
        </button>
    );
});

Button.displayName = 'Button';

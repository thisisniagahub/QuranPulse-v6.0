import React from 'react';

// Since I don't know if '@/lib/utils' exists yet, I'll define a simple helper inside or just use template literals.
// For robustness, I'll stick to standard template literals for now if I can't confirm the utils.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glow' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    ...props
}) => {

    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95 overflow-hidden group";

    const variants = {
        primary: "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-400/50",
        secondary: "bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/50 shadow-lg",
        ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white",
        glow: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_25px_rgba(8,145,178,0.5)] border border-white/10 hover:shadow-[0_0_40px_rgba(8,145,178,0.7)]",
        outline: "bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30 hover:border-cyan-400"
    };

    const sizes = {
        sm: "px-4 py-1.5 text-xs",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base",
        icon: "p-2 aspect-square"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {/* Shimmer Effect for Primary/Glow */}
            {(variant === 'primary' || variant === 'glow') && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            )}

            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : leftIcon ? (
                <span className="mr-2">{leftIcon}</span>
            ) : null}

            <span className="relative z-10">{children}</span>

            {!isLoading && rightIcon && (
                <span className="ml-2 group-hover:translate-x-1 transition-transform">{rightIcon}</span>
            )}
        </button>
    );
};

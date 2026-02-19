import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, type, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            // Base styles - matching neon-glow theme
                            "flex h-11 w-full rounded-xl border bg-slate-900/50 px-4 py-2 text-sm text-white",
                            "transition-all duration-300 outline-none",
                            // Border styles
                            "border-slate-700 hover:border-cyan-500/50",
                            "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20",
                            "focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]",
                            // Placeholder
                            "placeholder:text-slate-500",
                            // Disabled
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-800/50",
                            // Error state
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                            // Icon padding
                            icon && "pl-10",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-400">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

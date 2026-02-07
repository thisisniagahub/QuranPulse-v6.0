import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    variant?: 'default' | 'ghost';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, variant = 'default', id, ...props }, ref) => {
        const textareaId = id || `textarea-${React.useId()}`;

        const variants = {
            default: cn(
                "border border-slate-700/50 bg-slate-900/80",
                "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
            ),
            ghost: cn(
                "border-transparent bg-slate-800/50",
                "focus:bg-slate-800 focus:ring-2 focus:ring-cyan-500/20"
            )
        };

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-slate-300 mb-2"
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        "w-full min-h-[120px] px-4 py-3 rounded-xl",
                        "text-white placeholder:text-slate-500",
                        "resize-y transition-all duration-200",
                        "focus:outline-none",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        variants[variant],
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
                    {...props}
                />

                {error && (
                    <p id={`${textareaId}-error`} className="mt-2 text-sm text-red-400" role="alert">
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p id={`${textareaId}-helper`} className="mt-2 text-sm text-slate-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;

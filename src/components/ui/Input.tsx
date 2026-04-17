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
                {label ? (
                    <label className="mb-2 block text-sm font-medium text-raudhah-ink">
                        {label}
                    </label>
                ) : null}
                <div className="relative">
                    {icon ? (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-raudhah-ink/45">
                            {icon}
                        </div>
                    ) : null}
                    <input
                        type={type}
                        className={cn(
                            'flex h-11 w-full rounded-xl border bg-white px-4 py-2 text-sm text-raudhah-ink shadow-sm',
                            'transition-[transform,box-shadow,border-color,background-color,color] duration-200 ease-out',
                            'border-raudhah-teal/15 hover:border-raudhah-teal/25',
                            'placeholder:text-raudhah-ink/35',
                            'disabled:cursor-not-allowed disabled:bg-raudhah-cream/70 disabled:opacity-60',
                            'focus-visible:border-raudhah-teal focus-visible:shadow-[0_0_0_3px_rgba(27,107,90,0.12)]',
                            error && 'border-red-500 focus-visible:border-red-500 focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.14)]',
                            icon && 'pl-10',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error ? (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';

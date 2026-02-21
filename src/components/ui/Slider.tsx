import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
    className?: string;
    showValue?: boolean;
    variant?: 'default' | 'neon';
}

export const Slider: React.FC<SliderProps> = ({
    value: controlledValue,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    onChange,
    className,
    showValue = false,
    variant = 'default'
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue ?? internalValue;
    const trackRef = useRef<HTMLDivElement>(null);

    const percentage = ((value - min) / (max - min)) * 100;

    const handleChange = useCallback((newValue: number) => {
        const clampedValue = Math.min(Math.max(newValue, min), max);
        const steppedValue = Math.round(clampedValue / step) * step;

        if (controlledValue === undefined) {
            setInternalValue(steppedValue);
        }
        onChange?.(steppedValue);
    }, [min, max, step, onChange, controlledValue]);

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || !trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newValue = min + percent * (max - min);
        handleChange(newValue);
    };

    const variants = {
        default: {
            track: 'bg-slate-700',
            fill: 'bg-raudhah-teal',
            thumb: 'bg-white border-2 border-raudhah-teal'
        },
        neon: {
            track: 'bg-slate-800',
            fill: 'bg-gradient-to-r from-raudhah-teal to-purple-500 shadow-[0_0_10px_rgba(27,107,90,0.3)]',
            thumb: 'bg-white border-2 border-raudhah-teal shadow-[0_0_15px_rgba(27,107,90,0.3)]'
        }
    };

    const v = variants[variant];

    return (
        <div className={cn("relative w-full", className)}>
            {showValue && (
                <div className="flex justify-between mb-2 text-sm text-slate-400">
                    <span>{min}</span>
                    <span className="font-medium text-white">{value}</span>
                    <span>{max}</span>
                </div>
            )}

            <div
                ref={trackRef}
                onClick={handleTrackClick}
                className={cn(
                    "relative h-2 rounded-full cursor-pointer",
                    v.track,
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                {/* Fill */}
                <div
                    className={cn("absolute h-full rounded-full transition-all", v.fill)}
                    style={{ width: `${percentage}%` }}
                />

                {/* Thumb */}
                <div
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
                        "h-5 w-5 rounded-full transition-all",
                        "hover:scale-110 focus:scale-110",
                        v.thumb,
                        disabled && "pointer-events-none"
                    )}
                    style={{ left: `${percentage}%` }}
                    role="slider"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    aria-disabled={disabled}
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                        if (disabled) return;
                        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                            e.preventDefault();
                            handleChange(value + step);
                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            handleChange(value - step);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default Slider;

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: 'default' | 'neon' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value, max = 100, variant = 'default', size = 'md', showValue = false, ...props }, ref) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        const variants = {
            default: "bg-raudhah-teal",
            neon: "bg-raudhah-teal shadow-[0_0_15px_rgba(27,107,90,0.3)]",
            gradient: "bg-gradient-to-r from-raudhah-teal via-teal-500 to-emerald-500",
        };

        const sizes = {
            sm: "h-1.5",
            md: "h-2.5",
            lg: "h-4",
        };

        return (
            <div className="w-full">
                <div
                    ref={ref}
                    className={cn(
                        "w-full overflow-hidden rounded-full bg-slate-800",
                        sizes[size],
                        className
                    )}
                    {...props}
                >
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500 ease-out",
                            variants[variant]
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                {showValue && (
                    <div className="flex justify-end mt-1">
                        <span className="text-xs text-slate-400">{Math.round(percentage)}%</span>
                    </div>
                )}
            </div>
        );
    }
);

Progress.displayName = 'Progress';

// Circular Progress Variant
interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max = 100,
    size = 48,
    strokeWidth = 4,
    className,
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-slate-800"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="text-raudhah-teal transition-all duration-500 ease-out"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))' }}
                />
            </svg>
            <span className="absolute text-xs font-medium text-white">
                {Math.round(percentage)}%
            </span>
        </div>
    );
};

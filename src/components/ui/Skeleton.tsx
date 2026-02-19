import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'circular' | 'text';
    width?: string | number;
    height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, variant = 'default', width, height, ...props }, ref) => {
        const variants = {
            default: "rounded-lg",
            circular: "rounded-full",
            text: "rounded h-4",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%]",
                    variants[variant],
                    className
                )}
                style={{
                    width: typeof width === 'number' ? `${width}px` : width,
                    height: typeof height === 'number' ? `${height}px` : height,
                }}
                {...props}
            />
        );
    }
);

Skeleton.displayName = 'Skeleton';

// Pre-built skeleton patterns
export const SkeletonCard = () => (
    <div className="p-6 rounded-2xl border border-slate-700/50 bg-slate-900/80 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-3 pt-2">
            <Skeleton variant="circular" className="h-10 w-10" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    </div>
);

export const SkeletonList = ({ count = 3 }: { count?: number }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 bg-slate-900/50">
                <Skeleton variant="circular" className="h-12 w-12" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' };
    return <Skeleton variant="circular" className={sizes[size]} />;
};

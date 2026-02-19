import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away' | 'busy';
}

const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-xl',
};

const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-slate-500',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = '',
    fallback,
    size = 'md',
    status,
    className,
    ...props
}) => {
    const [imageError, setImageError] = React.useState(false);

    const initials = fallback
        ? fallback.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <div className={cn("relative inline-block", className)} {...props}>
            <div
                className={cn(
                    "relative rounded-full overflow-hidden",
                    "bg-gradient-to-br from-slate-700 to-slate-800",
                    "border-2 border-slate-600/50",
                    "flex items-center justify-center",
                    sizeClasses[size]
                )}
            >
                {src && !imageError ? (
                    <img loading="lazy"
                        src={src}
                        alt={alt}
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="font-semibold text-slate-300">{initials}</span>
                )}
            </div>

            {status && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 block rounded-full ring-2 ring-slate-900",
                        statusColors[status],
                        size === 'xs' ? 'h-1.5 w-1.5' :
                            size === 'sm' ? 'h-2 w-2' :
                                size === 'md' ? 'h-2.5 w-2.5' :
                                    size === 'lg' ? 'h-3 w-3' : 'h-4 w-4'
                    )}
                    aria-label={`Status: ${status}`}
                />
            )}
        </div>
    );
};

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    children,
    max = 4,
    className
}) => {
    const childArray = React.Children.toArray(children);
    const displayed = childArray.slice(0, max);
    const remaining = childArray.length - max;

    return (
        <div className={cn("flex -space-x-3", className)}>
            {displayed.map((child, index) => (
                <div key={index} className="relative ring-2 ring-slate-900 rounded-full">
                    {child}
                </div>
            ))}
            {remaining > 0 && (
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 ring-2 ring-slate-900 text-sm font-medium text-slate-300">
                    +{remaining}
                </div>
            )}
        </div>
    );
};

export default Avatar;


import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'neon' | 'elevated';
    hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
        const variants = {
            default: "bg-slate-900/80 border-slate-700/50",
            glass: "bg-white/5 backdrop-blur-xl border-white/10",
            neon: "bg-white/90 border-raudhah-teal/20 shadow-[0_0_15px_rgba(27,107,90,0.1)]",
            elevated: "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600/50 shadow-xl",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-2xl border p-6 transition-all duration-300",
                    variants[variant],
                    hover && "hover:scale-[1.02] hover:shadow-lg hover:border-raudhah-teal/50 cursor-pointer",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
    )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn("text-xl font-semibold leading-none tracking-tight text-white", className)}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-slate-400", className)} {...props} />
    )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("", className)} {...props} />
    )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />
    )
);
CardFooter.displayName = 'CardFooter';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'neon' | 'elevated';
    hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
        const variants = {
            default: 'bg-raudhah-ivory/90 border-raudhah-teal/10 shadow-[0_8px_30px_rgba(27,107,90,0.06)]',
            glass: 'bg-white/75 backdrop-blur-xl border-white/60 shadow-[0_14px_36px_rgba(27,107,90,0.08)]',
            neon: 'bg-white border-raudhah-teal/15 shadow-[0_0_0_1px_rgba(27,107,90,0.05),0_14px_36px_rgba(27,107,90,0.08)]',
            elevated: 'bg-gradient-to-br from-white via-raudhah-ivory to-raudhah-cream border-raudhah-teal/10 shadow-[0_18px_40px_rgba(27,107,90,0.1)]',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl border p-6 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out',
                    variants[variant],
                    hover && 'cursor-pointer hover:-translate-y-0.5 hover:border-raudhah-teal/25 hover:shadow-[0_18px_40px_rgba(27,107,90,0.12)]',
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
        <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
    )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn('text-xl font-semibold leading-none tracking-tight text-raudhah-ink', className)} {...props} />
    )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn('text-sm text-raudhah-ink/65', className)} {...props} />
    )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('', className)} {...props} />
    )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
    )
);
CardFooter.displayName = 'CardFooter';

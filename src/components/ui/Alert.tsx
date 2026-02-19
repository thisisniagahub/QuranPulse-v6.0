import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    title?: string;
    dismissible?: boolean;
    onDismiss?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = 'default', title, dismissible, onDismiss, children, ...props }, ref) => {
        const variants = {
            default: {
                container: 'bg-slate-800/80 border-slate-700 text-slate-200',
                icon: null,
            },
            success: {
                container: 'bg-emerald-900/30 border-emerald-700/50 text-emerald-200',
                icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
            },
            warning: {
                container: 'bg-amber-900/30 border-amber-700/50 text-amber-200',
                icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
            },
            error: {
                container: 'bg-red-900/30 border-red-700/50 text-red-200',
                icon: <AlertCircle className="h-5 w-5 text-red-400" />,
            },
            info: {
                container: 'bg-cyan-900/30 border-cyan-700/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
                icon: <Info className="h-5 w-5 text-cyan-400" />,
            },
        };

        const variantStyle = variants[variant];

        return (
            <div
                ref={ref}
                role="alert"
                className={cn(
                    "relative flex gap-3 p-4 rounded-xl border",
                    variantStyle.container,
                    className
                )}
                {...props}
            >
                {variantStyle.icon && (
                    <div className="flex-shrink-0">{variantStyle.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                    {title && (
                        <h5 className="font-medium mb-1">{title}</h5>
                    )}
                    <div className="text-sm opacity-90">{children}</div>
                </div>
                {dismissible && onDismiss && (
                    <button
                        onClick={onDismiss}
                        aria-label="Dismiss alert"
                        className="flex-shrink-0 p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }
);

Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h5 ref={ref} className={cn("font-medium mb-1", className)} {...props} />
    )
);
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
    )
);
AlertDescription.displayName = 'AlertDescription';

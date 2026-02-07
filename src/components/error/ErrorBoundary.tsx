import React, { Component, ReactNode, ErrorInfo } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * ErrorBoundary - Catches JavaScript errors in child components
 * 
 * Provides a fallback UI instead of crashing the entire app.
 * Logs error details for debugging.
 */
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
        }

        return this.props.children;
    }
}

/**
 * ErrorFallback - Default error UI component
 */
interface ErrorFallbackProps {
    error: Error | null;
    onRetry?: () => void;
    className?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    error,
    onRetry,
    className
}) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center min-h-[300px] p-8",
                "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
                "border border-red-500/30 rounded-2xl",
                className
            )}
            role="alert"
        >
            {/* Error Icon */}
            <div className="mb-6 p-4 rounded-full bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="w-10 h-10 text-red-400" aria-hidden="true" />
            </div>

            {/* Error Title */}
            <h2 className="text-xl font-bold text-white mb-2">
                Something went wrong
            </h2>

            {/* Error Description */}
            <p className="text-slate-400 text-center mb-6 max-w-md">
                We encountered an unexpected error. Please try again or return to the home page.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && error && (
                <details className="mb-6 w-full max-w-md">
                    <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-400">
                        View Error Details
                    </summary>
                    <pre className="mt-2 p-3 bg-slate-950 rounded-lg text-xs text-red-300 overflow-auto max-h-32">
                        {error.message}
                        {error.stack && `\n\n${error.stack}`}
                    </pre>
                </details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-medium rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" aria-hidden="true" />
                        Try Again
                    </button>
                )}
                <a
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                >
                    <Home className="w-4 h-4" aria-hidden="true" />
                    Go Home
                </a>
            </div>
        </div>
    );
};

export default ErrorBoundary;

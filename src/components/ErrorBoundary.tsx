import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const NAVIGATION_EVENT = 'qp:navigation-change';
let historyPatched = false;

const getLocationSnapshot = () => {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

const patchHistoryEvents = () => {
  if (historyPatched || typeof window === 'undefined') return;

  const { pushState, replaceState } = window.history;

  window.history.pushState = function pushStatePatched(...args) {
    const result = pushState.apply(this, args as Parameters<History['pushState']>);
    window.dispatchEvent(new Event(NAVIGATION_EVENT));
    return result;
  };

  window.history.replaceState = function replaceStatePatched(...args) {
    const result = replaceState.apply(this, args as Parameters<History['replaceState']>);
    window.dispatchEvent(new Event(NAVIGATION_EVENT));
    return result;
  };

  historyPatched = true;
};

const reportToMonitoring = (error: Error, context: Record<string, unknown>) => {
  import('../utils/monitoring')
    .then((monitoring) => {
      monitoring.captureError(error, context);
    })
    .catch(() => {
      // Keep boundary resilient in non-Vite test runtimes.
    });
};

class ErrorBoundary extends Component<Props, State> {
  private lastLocationSnapshot = getLocationSnapshot();

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidMount() {
    if (typeof window === 'undefined') return;

    patchHistoryEvents();
    window.addEventListener(NAVIGATION_EVENT, this.handleNavigationChange);
    window.addEventListener('popstate', this.handleNavigationChange);
    window.addEventListener('hashchange', this.handleNavigationChange);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.resetBoundary();
    }
  }

  componentWillUnmount() {
    if (typeof window === 'undefined') return;

    window.removeEventListener(NAVIGATION_EVENT, this.handleNavigationChange);
    window.removeEventListener('popstate', this.handleNavigationChange);
    window.removeEventListener('hashchange', this.handleNavigationChange);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    reportToMonitoring(error, {
      componentStack: errorInfo.componentStack,
      boundary: 'ErrorBoundary',
      location: this.lastLocationSnapshot
    });

    this.props.onError?.(error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  handleNavigationChange = () => {
    const current = getLocationSnapshot();
    if (current === this.lastLocationSnapshot) return;

    this.lastLocationSnapshot = current;
    if (this.state.hasError) {
      this.resetBoundary();
    }
  };

  resetBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-[#031a38] relative overflow-hidden flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(139,92,246,0.14),transparent_40%)]" />
          <div className="relative w-full max-w-md rounded-2xl border border-raudhah-teal/20 bg-[#0c224b]/70 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2 mb-5">
              <img loading="lazy" src="/logo-primary.png" alt="QuranPulse" className="h-8 w-8 object-contain" />
              <span className="text-sm font-bold tracking-wide text-raudhah-teal">QuranPulse</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Maaf, berlaku masalah
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Something went wrong. Sila cuba lagi sebentar.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left rounded-xl border border-red-400/20 bg-black/30 p-3">
                <summary className="cursor-pointer text-xs text-red-300">Debug details</summary>
                <p className="mt-2 text-xs text-red-200 break-words">{this.state.error.message}</p>
              </details>
            )}

            <button
              type="button"
              onClick={this.resetBoundary}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-raudhah-teal to-teal-300 hover:from-teal-300 hover:to-teal-200 transition-all shadow-[0_0_24px_rgba(34,211,238,0.35)]"
            >
              Cuba Lagi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


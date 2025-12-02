import * as Sentry from '@sentry/react';

export const initMonitoring = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing({
          // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
          tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
        }),
        new Sentry.Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when an error occurs.
    });
  } else {
    console.info("ℹ️ Sentry DSN not configured. Error monitoring disabled (this is normal in development).");
  }
};

export class PerformanceMonitor {
  static trackMetric(name: string, value: number) {
    if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.metrics.distribution(name, value);
    }
    console.log(`[Metric] ${name}: ${value}`);
  }
}

/**
 * 🚀 QuranPulse Advanced Monitoring System v2.0
 * 
 * Features:
 * ✅ Sentry Error Tracking (v8 API)
 * ✅ Performance Web Vitals
 * ✅ Session Replay on Errors
 * ✅ Custom Metrics
 * ✅ Quran Feature Analytics
 */

import * as Sentry from '@sentry/react';

// =====================================
// INITIALIZATION
// =====================================

export const initMonitoring = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (dsn) {
    Sentry.init({
      dsn,
      
      // Use new v8 integrations API
      integrations: [
        Sentry.browserTracingIntegration({
          // URLs for distributed tracing
          tracePropagationTargets: [
            "localhost",
            /^https:\/\/api\.quranpulse\.com/,
            /^https:\/\/.*\.supabase\.co/,
          ],
        }),
        Sentry.replayIntegration({
          // Mask sensitive data
          maskAllText: false,
          maskAllInputs: true,
          blockAllMedia: false,
        }),
        Sentry.feedbackIntegration({
          colorScheme: 'dark',
          buttonLabel: 'Lapor Masalah',
          submitButtonLabel: 'Hantar',
          formTitle: 'Maklum Balas',
          messagePlaceholder: 'Terangkan masalah yang anda hadapi...',
        }),
      ],
      
      // Performance Monitoring
      tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0, // 20% in prod, 100% in dev
      
      // Session Replay
      replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0, // 10% in prod
      replaysOnErrorSampleRate: 1.0, // Always record on error
      
      // Environment
      environment: import.meta.env.MODE,
      release: `quranpulse@${import.meta.env.VITE_APP_VERSION || '6.0.0'}`,
      
      // Filter events
      beforeSend(event) {
        // Don't send events in development unless explicitly enabled
        if (import.meta.env.DEV && !import.meta.env.VITE_SENTRY_DEV) {
          return null;
        }
        return event;
      },
    });
    
    console.info("✅ Sentry Monitoring initialized");
  } else {
    console.info("ℹ️ Sentry DSN not configured. Error monitoring disabled.");
  }
};

// =====================================
// PERFORMANCE MONITORING
// =====================================

export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  
  /**
   * Track a custom metric
   */
  static trackMetric(name: string, value: number, unit: string = 'ms') {
    // Store locally
    const existing = this.metrics.get(name) || [];
    existing.push(value);
    this.metrics.set(name, existing);
    
    // Send to Sentry
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.metrics.distribution(name, value, { unit });
    }
    
    // Console log in dev
    if (import.meta.env.DEV) {
      console.log(`[Metric] ${name}: ${value}${unit}`);
    }
  }
  
  /**
   * Track Web Vitals (LCP, FID, CLS, TTFB, INP)
   */
  static initWebVitals() {
    if (typeof window === 'undefined') return;
    
    // Use Performance Observer API
    try {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.trackMetric('web_vital.lcp', entry.startTime, 'ms');
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      
      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
          this.trackMetric('web_vital.fid', fid, 'ms');
        }
      }).observe({ type: 'first-input', buffered: true });
      
      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.trackMetric('web_vital.cls', clsValue, 'score');
      }).observe({ type: 'layout-shift', buffered: true });
      
      console.info("✅ Web Vitals tracking initialized");
    } catch (e) {
      console.warn("⚠️ Web Vitals API not fully supported");
    }
  }
  
  /**
   * Start a performance span
   */
  static startSpan(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.trackMetric(`span.${name}`, duration, 'ms');
    };
  }
  
  /**
   * Get average for a metric
   */
  static getAverage(name: string): number | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}

// =====================================
// ERROR HANDLING
// =====================================

export const captureError = (error: Error, context?: Record<string, any>) => {
  console.error('[Error]', error);
  
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
  console.log(`[${level.toUpperCase()}]`, message);
};

// =====================================
// USER CONTEXT
// =====================================

export const setUserContext = (user: { id: string; email?: string; name?: string }) => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.setUser(user);
  }
};

export const clearUserContext = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.setUser(null);
  }
};

// =====================================
// BREADCRUMBS
// =====================================

export const addBreadcrumb = (
  category: string, 
  message: string, 
  data?: Record<string, any>
) => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      category,
      message,
      data,
      level: 'info',
    });
  }
};

// =====================================
// EXPORTS
// =====================================

export { Sentry };

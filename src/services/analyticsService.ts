import { supabase } from '@/lib/supabase';

export type EventName = 
  | 'APP_OPEN'
  | 'PAGE_VIEW'
  | 'LOGIN'
  | 'SIGNUP'
  | 'IQRA_SESSION_START'
  | 'IQRA_SESSION_END'
  | 'AI_CHAT_QUERY'
  | 'AI_CHAT_RESPONSE'
  | 'PRAYER_TIMES_CHECK'
  | 'QIBLA_CHECK'
  | 'INFAQ_VIEW'
  | 'INFAQ_INITIATE'
  | 'INFAQ_SUCCESS'
  | 'INFAQ_FAILURE';

export interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, any>;
  user_id?: string;
  timestamp?: string;
}

export const AnalyticsService = {
  /**
   * Log an event to Supabase
   */
  async track(name: EventName, properties: Record<string, any> = {}) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id || 'anonymous';

      console.log(`[Analytics] ${name}`, properties);

      // In a real app, we would batch these or use a beacon
      // For MVP, we insert directly to Supabase
      const { error } = await supabase.from('analytics_events').insert({
        name,
        user_id,
        properties,
        timestamp: new Date().toISOString()
      });

      if (error) {
        // If table doesn't exist, just warn silently
        // console.warn("Analytics insert failed:", error.message);
      }
    } catch (e) {
      console.error("Analytics Error:", e);
    }
  },

  /**
   * Convenience method for page views
   */
  trackPageView(pageName: string) {
    this.track('PAGE_VIEW', { page: pageName });
  }
};

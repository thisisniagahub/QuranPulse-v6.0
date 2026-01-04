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

// Generate or retrieve persistent anonymous ID
const getAnonId = () => {
  if (typeof window === 'undefined') return 'server-side';
  let anonId = localStorage.getItem('qp_anon_id');
  if (!anonId) {
    anonId = `anon_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('qp_anon_id', anonId);
  }
  return anonId;
};

export const AnalyticsService = {
  /**
   * Log an event to Supabase
   */
  async track(name: EventName, properties: Record<string, any> = {}) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Prioritize authenticated ID, fallback to persistent anon ID
      const user_id = session?.user?.id || getAnonId();

      // Debug only in dev mode
      if (import.meta.env.DEV) {
        console.log(`[Analytics] ${name}`, { user_id, ...properties });
      }

      const { error } = await supabase.from('analytics_events').insert({
        name,
        user_id,
        properties: {
          ...properties,
          is_anonymous: !session?.user?.id,
          platform: 'web',
          user_agent: navigator.userAgent
        },
        timestamp: new Date().toISOString()
      });

      if (error) {
        // Silently fail in production to avoid disrupting UX
        if (import.meta.env.DEV) console.warn("Analytics insert failed:", error.message);
      }
    } catch (e) {
      // Catch-all to prevent analytics from crashing the app
      if (import.meta.env.DEV) console.error("Analytics Error:", e);
    }
  },

  /**
   * Convenience method for page views
   */
  trackPageView(pageName: string) {
    this.track('PAGE_VIEW', { page: pageName });
  }
};

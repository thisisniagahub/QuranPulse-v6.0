import { createClient } from '@supabase/supabase-js';
import { getEnv } from '../utils/env';

// Environment variables for Supabase
const rawUrl = getEnv('VITE_SUPABASE_URL');
const rawKey = getEnv('VITE_SUPABASE_ANON_KEY');

console.log('🔎 .env values:', { rawUrl, rawKey });
if (!rawUrl || !rawKey) {
  console.error('🚨 Supabase credentials missing in .env. Login will fail.');
}


const supabaseUrl = rawUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-key';

console.log("🔌 Initializing Supabase Client...");

// Create Supabase client with enhanced options
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      // Persist session in localStorage for "Remember Me" functionality
      persistSession: true,
      // Auto-refresh token before it expires
      autoRefreshToken: true,
      // Detect session from URL (for OAuth redirects)
      detectSessionInUrl: true,
      // Storage type
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'x-app-name': 'QuranPulse',
        'x-app-version': '6.0',
      },
    },
  }
);

if (rawUrl && rawKey) {
  // Immediate health check for debugging email login issues
  supabase.from('surahs').select('count', { count: 'exact', head: true }).then(({ error }) => {
    if (error) {
      console.error("❌ Supabase Health Check Failed:", error.message, error);
      if (error.message.includes("fetch")) {
        console.error("💡 Tip: This usually means the browser rejected the request due to CSP or Network issues.");
      }
    } else {
      console.log("✅ Supabase Health Check Passed. Database is reachable.");
    }
  });
}

// Helper: Check if Supabase is connected
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('surahs').select('number').limit(1);
    return !error;
  } catch {
    return false;
  }
};

// Helper: Get current user session
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Helper: Get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

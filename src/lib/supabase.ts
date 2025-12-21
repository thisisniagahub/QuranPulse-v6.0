import { createClient } from '@supabase/supabase-js';
import { getEnv } from '../utils/env.ts';

// Environment variables for Supabase
const rawUrl = getEnv('VITE_SUPABASE_URL');
const rawKey = getEnv('VITE_SUPABASE_ANON_KEY');

const supabaseUrl = rawUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-key';

if (!rawUrl || !rawKey) {
  console.error('🚨 CRITICAL: Supabase credentials missing. App running in Offline/Fallback mode.');
}

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

import { createClient } from '@supabase/supabase-js';
import { getEnv } from '../utils/env';

// Environment variables for Supabase
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://placeholder.supabase.co';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'placeholder-key';

// Create Supabase client with enhanced options
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
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

// Health check for debugging - strictly internal logging
if (getEnv('VITE_SUPABASE_URL')) {
  supabase.from('surahs').select('count', { count: 'exact', head: true }).then(({ error }) => {
    if (error) {
      console.warn("⚠️ Supabase Connection Warning:", error.message);
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

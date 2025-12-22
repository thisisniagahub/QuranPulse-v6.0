import { createClient } from '@supabase/supabase-js';
import { getEnv } from '../utils/env';

// Environment variables for Supabase
const rawUrl = getEnv('VITE_SUPABASE_URL');
const rawKey = getEnv('VITE_SUPABASE_ANON_KEY');

// For server-side (admin) operations, you might want the SERVICE_ROLE_KEY eventually,
// but for now we stick to ANON_KEY if that's what was used, or check for SERVICE_KEY.
// const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabaseUrl = rawUrl || 'https://placeholder.supabase.co';
const supabaseKey = rawKey || 'placeholder-key';

if (!rawUrl || !rawKey) {
  console.error('🚨 [Server] Supabase credentials missing. App running in Offline/Fallback mode.');
}

// Create Supabase client for Node.js
// Note: No 'auth' storage configuration needed as we don't persist sessions in a browser way.
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});

-- ==============================================================================
-- BOT INTEGRATION MIGRATION
-- ==============================================================================
-- Adds support for Telegram/WhatsApp bot linking and interaction tracking.
-- 1. Add Telegram ID to Profiles (for Account Linking)
DO $$ BEGIN
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE;
EXCEPTION
WHEN duplicate_column THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id ON public.profiles(telegram_id);
-- 2. Pending Bot Links (Temporary OTP Store)
CREATE TABLE IF NOT EXISTS public.pending_bot_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    telegram_id BIGINT NOT NULL,
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Auto-expire after 15 minutes (handled by RLS or Cron usually, but here we just query latest)
    UNIQUE(telegram_id)
);
-- 3. Bot Interactions (Analytics & Streak Tracking)
CREATE TABLE IF NOT EXISTS public.bot_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    telegram_id BIGINT NOT NULL,
    -- Not FK to profiles because guest users might interact
    action_type TEXT NOT NULL,
    -- 'AI_CHAT', 'VISION_X_SCAN', 'ACCOUNT_LINKED'
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 4. RLS POLICIES (Security)
ALTER TABLE public.pending_bot_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_interactions ENABLE ROW LEVEL SECURITY;
-- Allow Bot Service (Service Role) full access
-- Note: Service Role bypasses RLS, but strictly we can define:
CREATE POLICY "Service Role Full Access Links" ON public.pending_bot_links FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Interactions" ON public.bot_interactions FOR ALL USING (true);
-- Optional: Allow public to insert interactions (if anon key used, but bot server uses service key usually)
-- For now, we assume Bot Server uses Service Key (SUPABASE_SERVICE_ROLE_KEY) or User JWT.
-- If Bot Server uses anon key, we need:
CREATE POLICY "Anon Insert Interactions" ON public.bot_interactions FOR
INSERT WITH CHECK (true);
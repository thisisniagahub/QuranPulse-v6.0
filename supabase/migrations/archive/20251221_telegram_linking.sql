
-- QURANPULSE ECOSYSTEM UNIFICATION MIGRATION
-- Run this in your Supabase SQL Editor

-- 1. Add Telegram ID to Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE;

-- 2. Pending Links Table (OTP Store)
CREATE TABLE IF NOT EXISTS pending_bot_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_id BIGINT NOT NULL,
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '15 minutes')
);

-- 3. Bot Interactions Table (For analytics & streaks)
CREATE TABLE IF NOT EXISTS bot_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_id BIGINT NOT NULL,
    action_type TEXT NOT NULL,
    content TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Global Streak Function
CREATE OR REPLACE FUNCTION update_global_streak()
RETURNS void AS $$
BEGIN
  UPDATE gamification_stats gs
  SET 
    streak_days = CASE
      WHEN last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN streak_days + 1
      WHEN last_activity_date < CURRENT_DATE - INTERVAL '1 day' THEN 1
      ELSE streak_days 
    END,
    last_activity_date = CURRENT_DATE
  WHERE EXISTS (
    SELECT 1 FROM iqra_student_progress isp WHERE isp.user_id = gs.user_id AND DATE(isp.last_studied_at) = CURRENT_DATE
    UNION
    SELECT 1 FROM bot_interactions bi 
    JOIN profiles p ON bi.telegram_id = p.telegram_id
    WHERE p.id = gs.user_id AND DATE(bi.timestamp) = CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;

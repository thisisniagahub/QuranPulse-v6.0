-- ============================================================
-- QuranPulse Battle 2: Leaderboard + RAG Tables
-- Run: supabase db push
-- ============================================================

-- ==============================
-- 1. User Leaderboard View/Table
-- ==============================

CREATE TABLE IF NOT EXISTS user_leaderboard (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Pengguna',
  avatar_url TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak INTEGER NOT NULL DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  mosque_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast ranking queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON user_leaderboard(xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_mosque ON user_leaderboard(mosque_id, xp DESC);

-- RLS Policy
ALTER TABLE user_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard read access" ON user_leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Users update own leaderboard" ON user_leaderboard
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users insert own leaderboard" ON user_leaderboard
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================
-- 2. Tafsir Table (for RAG)
-- ==============================

CREATE TABLE IF NOT EXISTS tafsir_collection (
  id BIGSERIAL PRIMARY KEY,
  surah_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  source_name TEXT NOT NULL DEFAULT 'Tafsir Ibn Kathir',
  content_text TEXT NOT NULL,
  content_ms TEXT,
  embedding VECTOR(768),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tafsir_verse ON tafsir_collection(surah_number, verse_number);

-- Vector similarity search for tafsir
CREATE OR REPLACE FUNCTION search_tafsir_semantic(
  query_text TEXT,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  surah_number INT,
  verse_number INT,
  source_name TEXT,
  content_text TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
  query_embedding VECTOR(768);
BEGIN
  -- Generate embedding via Edge Function or use direct text search fallback
  -- For now, use text search as fallback
  RETURN QUERY
  SELECT
    t.id,
    t.surah_number,
    t.verse_number,
    t.source_name,
    t.content_text,
    ts_rank(to_tsvector('english', t.content_text), plainto_tsquery('english', query_text))::FLOAT AS similarity
  FROM tafsir_collection t
  WHERE to_tsvector('english', t.content_text) @@ plainto_tsquery('english', query_text)
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- ==============================
-- 3. Hadith Table (for RAG)
-- ==============================

CREATE TABLE IF NOT EXISTS hadith_collection (
  id BIGSERIAL PRIMARY KEY,
  collection TEXT NOT NULL,       -- e.g. 'Sahih Bukhari', 'Sahih Muslim'
  hadith_number TEXT NOT NULL,
  narrator TEXT,
  content_text TEXT NOT NULL,
  content_ms TEXT,
  topic TEXT,
  grade TEXT DEFAULT 'sahih',
  embedding VECTOR(768),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hadith_collection ON hadith_collection(collection, hadith_number);
CREATE INDEX IF NOT EXISTS idx_hadith_topic ON hadith_collection(topic);

-- Vector similarity search for hadith
CREATE OR REPLACE FUNCTION search_hadith_semantic(
  query_text TEXT,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  collection TEXT,
  hadith_number TEXT,
  content_text TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.id,
    h.collection,
    h.hadith_number,
    h.content_text,
    ts_rank(to_tsvector('english', h.content_text), plainto_tsquery('english', query_text))::FLOAT AS similarity
  FROM hadith_collection h
  WHERE to_tsvector('english', h.content_text) @@ plainto_tsquery('english', query_text)
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- ==============================
-- 4. Subscription Table
-- ==============================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',   -- pending, active, cancelled, expired
  bill_code TEXT,                            -- ToyyibPay bill code
  amount INTEGER NOT NULL,                   -- in sen
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_user ON subscriptions(user_id, status);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own subs" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service insert subs" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

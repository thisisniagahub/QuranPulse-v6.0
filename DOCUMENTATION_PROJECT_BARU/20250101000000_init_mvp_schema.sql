-- ============================================
-- QuranPulse MVP Database Schema
-- Version: 1.0 (Beta Launch)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For AI Embeddings
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For Fuzzy Search

-- Helper Function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- TABLE 1: profiles
-- Extends Supabase Auth with user profile data
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Gamification
  xp_points INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  
  -- Preferences
  theme_preference TEXT DEFAULT 'deep-space', -- 'deep-space' | 'cyber-pulse' | 'light'
  font_size INT DEFAULT 28,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp_points DESC);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- TABLE 2: subscriptions
-- Manages user tiers and statuses
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  tier TEXT NOT NULL DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PREMIUM', 'FAMILY')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  
  provider TEXT DEFAULT 'manual', -- 'stripe', 'toyyibpay', 'manual'
  provider_subscription_id TEXT, -- External ID
  
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subs_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subs_status ON subscriptions(status);

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Only Admin/Service Role can update subscriptions (SECURITY CRITICAL)
-- No generic UPDATE policy for users.


-- ============================================
-- TABLE 3: iqra_progress
-- Tracks granular learning progress
-- ============================================

CREATE TABLE IF NOT EXISTS iqra_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  book_level INT NOT NULL CHECK (book_level BETWEEN 1 AND 6),
  page_number INT NOT NULL,
  
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'completed', 'mastered')),
  stars INT DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
  
  accuracy_score DECIMAL(5,2), -- 0.00 to 100.00
  fluency_score DECIMAL(5,2),
  
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, book_level, page_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_iqra_user_book ON iqra_progress(user_id, book_level);

-- RLS
ALTER TABLE iqra_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own iqra progress" ON iqra_progress
  FOR ALL USING (auth.uid() = user_id);


-- ============================================
-- TABLE 4: iqra_audio_recordings
-- Stores user voice submissions for analysis
-- ============================================

CREATE TABLE IF NOT EXISTS iqra_audio_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_id UUID REFERENCES iqra_progress(id) ON DELETE SET NULL,
  
  storage_path TEXT NOT NULL, -- Bucket path
  duration_seconds INT,
  
  ai_feedback JSONB, -- Stored JSON analysis from Gemini
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE iqra_audio_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recordings" ON iqra_audio_recordings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own recordings" ON iqra_audio_recordings
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ============================================
-- TABLE 5: ai_chat_history
-- Persists Ustaz AI conversations
-- ============================================

CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  session_id UUID NOT NULL, -- Group messages by conversation
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  metadata JSONB DEFAULT '{}', -- Tokens used, model version
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_session ON ai_chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_user ON ai_chat_history(user_id);

-- RLS
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own chats" ON ai_chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert chat messages" ON ai_chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ============================================
-- TABLE 6: ai_knowledge_cache (Smart Caching)
-- Previously 'ai_response_cache'
-- ============================================

CREATE TABLE IF NOT EXISTS ai_knowledge_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  query_text TEXT NOT NULL,
  answer_content TEXT,
  
  structured_response JSONB, -- The HybridResponse object
  embedding vector(768), -- For semantic search (Gemini/Ollama dimension)
  
  hit_count INT DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cache_query_trgm ON ai_knowledge_cache USING gin (query_text gin_trgm_ops); -- Fuzzy search

-- RLS: Public Read (Anon can read cached answers), Service Write
ALTER TABLE ai_knowledge_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cache" ON ai_knowledge_cache
  FOR SELECT USING (true);

-- ============================================
-- TABLE 7: payment_transactions
-- Audit log for all money movement
-- ============================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MYR',
  
  provider TEXT NOT NULL, -- 'toyyibpay', 'stripe'
  provider_ref_id TEXT, -- BillCode or PaymentIntent
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_ref ON payment_transactions(provider_ref_id);

-- RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own transactions" ON payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- System only inserts

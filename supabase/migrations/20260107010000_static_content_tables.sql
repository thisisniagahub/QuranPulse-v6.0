-- Static Content Tables for Pre-Generated AI Data
-- Purpose: Store all AI-generated content once, query forever
-- 1. Tajweed Rules (17 rules)
CREATE TABLE IF NOT EXISTS static_tajweed_rules (
    id SERIAL PRIMARY KEY,
    rule_id VARCHAR(50) UNIQUE NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_ms VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description_ms TEXT NOT NULL,
    description_en TEXT NOT NULL,
    examples JSONB NOT NULL DEFAULT '[]',
    common_mistakes JSONB DEFAULT '[]',
    audio_guide_url VARCHAR(255),
    priority INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Makhraj Points
CREATE TABLE IF NOT EXISTS static_makhraj_points (
    id SERIAL PRIMARY KEY,
    point_id VARCHAR(50) UNIQUE NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_ms VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    letters JSONB NOT NULL DEFAULT '[]',
    position VARCHAR(50) NOT NULL,
    description_ms TEXT NOT NULL,
    description_en TEXT NOT NULL,
    practice_tips_ms TEXT,
    practice_tips_en TEXT,
    svg_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 3. Common Doa Collection
CREATE TABLE IF NOT EXISTS static_doa (
    id SERIAL PRIMARY KEY,
    doa_id VARCHAR(50) UNIQUE NOT NULL,
    title_ms VARCHAR(200) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    arabic TEXT NOT NULL,
    transliteration TEXT,
    translation_ms TEXT NOT NULL,
    translation_en TEXT NOT NULL,
    when_to_recite VARCHAR(200),
    benefits TEXT,
    source VARCHAR(200),
    category VARCHAR(50),
    audio_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 4. Islamic FAQ
CREATE TABLE IF NOT EXISTS static_islamic_faq (
    id SERIAL PRIMARY KEY,
    faq_id VARCHAR(50) UNIQUE NOT NULL,
    question_ms TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_ms TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    category VARCHAR(50),
    source VARCHAR(200),
    related_faqs JSONB DEFAULT '[]',
    keywords JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 5. Hadith Collection
CREATE TABLE IF NOT EXISTS static_hadith (
    id SERIAL PRIMARY KEY,
    hadith_id VARCHAR(50) UNIQUE NOT NULL,
    arabic TEXT NOT NULL,
    translation_ms TEXT NOT NULL,
    translation_en TEXT NOT NULL,
    narrator VARCHAR(200),
    source VARCHAR(100) NOT NULL,
    book_number INT,
    hadith_number INT,
    grade VARCHAR(50),
    topics JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 6. Surah Metadata
CREATE TABLE IF NOT EXISTS static_surah_metadata (
    id SERIAL PRIMARY KEY,
    surah_number INT UNIQUE NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_ms VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    meaning_ms VARCHAR(200),
    meaning_en VARCHAR(200),
    revelation_type VARCHAR(20),
    total_ayahs INT NOT NULL,
    themes JSONB DEFAULT '[]',
    key_lessons_ms TEXT,
    key_lessons_en TEXT,
    recommended_times TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 7. AI Response Cache
CREATE TABLE IF NOT EXISTS ai_response_cache (
    id SERIAL PRIMARY KEY,
    query_hash VARCHAR(64) UNIQUE NOT NULL,
    query_original TEXT NOT NULL,
    response JSONB NOT NULL,
    intent VARCHAR(50),
    language VARCHAR(10) DEFAULT 'ms',
    hit_count INT DEFAULT 1,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 8. User Mastery (spaced repetition)
CREATE TABLE IF NOT EXISTS user_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "itemType" VARCHAR(50) NOT NULL,
    "itemId" VARCHAR(100) NOT NULL,
    "easeFactor" DECIMAL(3, 2) DEFAULT 2.5,
    interval INT DEFAULT 0,
    repetitions INT DEFAULT 0,
    "nextReviewDate" TIMESTAMPTZ DEFAULT NOW(),
    "lastScore" DECIMAL(5, 2),
    "totalAttempts" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("userId", "itemType", "itemId")
);
-- 9. Voice Fingerprints
CREATE TABLE IF NOT EXISTS voice_fingerprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "formantF1Mean" DECIMAL(6, 2),
    "formantF2Mean" DECIMAL(6, 2),
    "pitchMean" DECIMAL(6, 2),
    "pitchRange" DECIMAL(6, 2),
    jitter DECIMAL(5, 4),
    shimmer DECIMAL(5, 4),
    "speakingRate" DECIMAL(4, 2),
    "pauseDuration" DECIMAL(4, 2),
    "totalSamples" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
-- 10. ASR Audit Log
CREATE TABLE IF NOT EXISTS asr_audit_log (
    id SERIAL PRIMARY KEY,
    audio_hash VARCHAR(32),
    transcription_preview VARCHAR(100),
    qwer_score DECIMAL(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_tajweed_category ON static_tajweed_rules(category);
CREATE INDEX IF NOT EXISTS idx_makhraj_position ON static_makhraj_points(position);
CREATE INDEX IF NOT EXISTS idx_doa_category ON static_doa(category);
CREATE INDEX IF NOT EXISTS idx_faq_category ON static_islamic_faq(category);
CREATE INDEX IF NOT EXISTS idx_hadith_source ON static_hadith(source);
CREATE INDEX IF NOT EXISTS idx_hadith_topics ON static_hadith USING GIN(topics);
CREATE INDEX IF NOT EXISTS idx_cache_query_hash ON ai_response_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_cache_intent ON ai_response_cache(intent);
CREATE INDEX IF NOT EXISTS idx_mastery_user ON user_mastery("userId");
CREATE INDEX IF NOT EXISTS idx_mastery_next_review ON user_mastery("nextReviewDate");
-- Enable RLS
ALTER TABLE static_tajweed_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_makhraj_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_doa ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_islamic_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_hadith ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_surah_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_response_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_fingerprints ENABLE ROW LEVEL SECURITY;
-- Drop existing policies first (to avoid conflicts)
DROP POLICY IF EXISTS "Public read static_tajweed" ON static_tajweed_rules;
DROP POLICY IF EXISTS "Public read static_makhraj" ON static_makhraj_points;
DROP POLICY IF EXISTS "Public read static_doa" ON static_doa;
DROP POLICY IF EXISTS "Public read static_faq" ON static_islamic_faq;
DROP POLICY IF EXISTS "Public read static_hadith" ON static_hadith;
DROP POLICY IF EXISTS "Public read static_surah" ON static_surah_metadata;
DROP POLICY IF EXISTS "Public read cache" ON ai_response_cache;
DROP POLICY IF EXISTS "Users own mastery" ON user_mastery;
DROP POLICY IF EXISTS "Users own fingerprint" ON voice_fingerprints;
-- Create policies
CREATE POLICY "Public read static_tajweed" ON static_tajweed_rules FOR
SELECT USING (true);
CREATE POLICY "Public read static_makhraj" ON static_makhraj_points FOR
SELECT USING (true);
CREATE POLICY "Public read static_doa" ON static_doa FOR
SELECT USING (true);
CREATE POLICY "Public read static_faq" ON static_islamic_faq FOR
SELECT USING (true);
CREATE POLICY "Public read static_hadith" ON static_hadith FOR
SELECT USING (true);
CREATE POLICY "Public read static_surah" ON static_surah_metadata FOR
SELECT USING (true);
CREATE POLICY "Public read cache" ON ai_response_cache FOR
SELECT USING (true);
CREATE POLICY "Users own mastery" ON user_mastery FOR ALL USING (auth.uid() = "userId");
CREATE POLICY "Users own fingerprint" ON voice_fingerprints FOR ALL USING (auth.uid() = "userId");
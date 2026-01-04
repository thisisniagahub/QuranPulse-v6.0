-- ============================================================================
-- HADITH REPOSITORY
-- Date: 2026-01-04
-- Purpose: Storage for Hadith collections (Bukhari, Muslim, etc) for MCP lookup
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.hadiths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_name TEXT NOT NULL, -- e.g., 'Sahih Al-Bukhari'
    hadith_number INTEGER,
    title TEXT,
    content_arabic TEXT NOT NULL,
    content_translation TEXT,
    grade TEXT DEFAULT 'Sahih', -- Standard for Bukhari
    tags TEXT[],
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(content_translation, ''))
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast text search
CREATE INDEX IF NOT EXISTS idx_hadiths_search ON public.hadiths USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_hadiths_collection_num ON public.hadiths(collection_name, hadith_number);

-- Enable RLS
ALTER TABLE public.hadiths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read hadiths" ON public.hadiths
    FOR SELECT USING (true);

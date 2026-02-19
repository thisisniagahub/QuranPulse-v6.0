-- ============================================================================
-- RESET HADITH TABLE (CLEAN SLATE)
-- Date: 2026-01-04
-- Purpose: Drop broken table and recreate with CORRECT schema to fix missing columns
-- ============================================================================

-- 1. DROP existing table completely
DROP TABLE IF EXISTS public.hadiths CASCADE;

-- 2. CREATE TABLE fresh
CREATE TABLE public.hadiths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_name TEXT NOT NULL, -- e.g., 'Sahih Al-Bukhari'
    hadith_number INTEGER,
    title TEXT,
    content_arabic TEXT NOT NULL,
    content_translation TEXT,
    grade TEXT DEFAULT 'Sahih', 
    tags TEXT[],
    -- Generated Search Vector
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(content_translation, ''))
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RECREATE INDEXES
CREATE INDEX idx_hadiths_search ON public.hadiths USING GIN(search_vector);
CREATE INDEX idx_hadiths_collection_num ON public.hadiths(collection_name, hadith_number);

-- 4. ENABLE RLS
ALTER TABLE public.hadiths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read hadiths" ON public.hadiths
    FOR SELECT USING (true);
    
-- 5. VERIFY
SELECT column_name FROM information_schema.columns WHERE table_name = 'hadiths';

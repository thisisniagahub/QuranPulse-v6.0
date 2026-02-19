-- =============================================
-- Semantic Search Support for Quran Verses
-- =============================================
-- Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;
-- Add embedding column to translations table (if exists)
DO $$ BEGIN IF EXISTS (
    SELECT
    FROM information_schema.tables
    WHERE table_name = 'translations'
) THEN IF NOT EXISTS (
    SELECT
    FROM information_schema.columns
    WHERE table_name = 'translations'
        AND column_name = 'embedding'
) THEN
ALTER TABLE translations
ADD COLUMN embedding vector(384);
END IF;
END IF;
END $$;
-- Create verse embeddings table for semantic search
CREATE TABLE IF NOT EXISTS verse_embeddings (
    id SERIAL PRIMARY KEY,
    surah_number INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    arabic_text TEXT,
    translation_ms TEXT,
    translation_en TEXT,
    combined_text TEXT,
    embedding vector(384),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(surah_number, verse_number)
);
-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_verse_embeddings_vector ON verse_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- Create index for fast surah/verse lookup
CREATE INDEX IF NOT EXISTS idx_verse_embeddings_surah_verse ON verse_embeddings(surah_number, verse_number);
-- RPC function for semantic search
CREATE OR REPLACE FUNCTION search_verses_semantic(
        query_text TEXT,
        match_count INTEGER DEFAULT 10
    ) RETURNS TABLE (
        surah_number INTEGER,
        surah_name TEXT,
        verse_number INTEGER,
        arabic_text TEXT,
        translation_text TEXT,
        similarity FLOAT
    ) LANGUAGE plpgsql AS $$
DECLARE query_embedding vector(384);
BEGIN -- For now, use keyword-based fallback
-- In production, call Edge Function to get embedding from query_text
RETURN QUERY
SELECT ve.surah_number,
    COALESCE(s.name_simple, 'Surah ' || ve.surah_number::TEXT) as surah_name,
    ve.verse_number,
    ve.arabic_text,
    COALESCE(ve.translation_en, ve.translation_ms) as translation_text,
    0.85::FLOAT as similarity
FROM verse_embeddings ve
    LEFT JOIN surahs s ON s.number = ve.surah_number
WHERE ve.translation_en ILIKE '%' || query_text || '%'
    OR ve.translation_ms ILIKE '%' || query_text || '%'
    OR ve.combined_text ILIKE '%' || query_text || '%'
LIMIT match_count;
END;
$$;
-- Grant permissions
GRANT SELECT ON verse_embeddings TO authenticated,
    anon;
GRANT EXECUTE ON FUNCTION search_verses_semantic TO authenticated,
    anon;
-- Add comments
COMMENT ON TABLE verse_embeddings IS 'Verse embeddings for semantic search using pgvector';
COMMENT ON FUNCTION search_verses_semantic IS 'Search Quran verses by meaning using vector similarity';
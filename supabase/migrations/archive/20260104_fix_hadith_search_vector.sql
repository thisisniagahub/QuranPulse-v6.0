-- ============================================================================
-- FIX: ADD MISSING SEARCH_VECTOR COLUMN
-- Date: 2026-01-04
-- Purpose: Fix ERROR 42703 by forcing the addition of the generated column
-- ============================================================================

-- 1. Add the column if it doesn't exist
ALTER TABLE public.hadiths 
ADD COLUMN IF NOT EXISTS search_vector TSVECTOR 
GENERATED ALWAYS AS (
  to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(content_translation, ''))
) STORED;

-- 2. Re-create the index to ensure it works
DROP INDEX IF EXISTS idx_hadiths_search;
CREATE INDEX IF NOT EXISTS idx_hadiths_search ON public.hadiths USING GIN(search_vector);

-- 3. Verify it exists (This will output the column details if successful)
SELECT column_name, data_type, is_generated 
FROM information_schema.columns 
WHERE table_name = 'hadiths' AND column_name = 'search_vector';

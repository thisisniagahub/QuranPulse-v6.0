-- ============================================================================
-- MCP CACHING LAYER & WORSHIP TOOLS
-- Date: 2026-01-04
-- Purpose: High-performance caching for External APIs (JAKIM/OpenAI/etc)
-- ============================================================================

-- 1. Create Cache Table
CREATE TABLE IF NOT EXISTS public.external_api_cache (
    key TEXT PRIMARY KEY, -- format: "service:param:date" (e.g., "solat:wlp01:2026-01-04")
    data JSONB NOT NULL,
    source TEXT DEFAULT 'external', -- 'jakim', 'adhan_calc', 'openai'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- 2. Index for fast lookups and cleanup
CREATE INDEX IF NOT EXISTS idx_api_cache_expiry ON public.external_api_cache(expires_at);

-- 3. RLS Policies (Service Role only usually, but allowed for authenticated for MVP)
ALTER TABLE public.external_api_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages cache" ON public.external_api_cache
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Public read cache" ON public.external_api_cache
    FOR SELECT TO authenticated, anon USING (expires_at > NOW());

-- 4. Auto-Cleanup Function (Optional: Can be run via pg_cron or Edge Function)
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM public.external_api_cache WHERE expires_at < NOW();
END;
$$;

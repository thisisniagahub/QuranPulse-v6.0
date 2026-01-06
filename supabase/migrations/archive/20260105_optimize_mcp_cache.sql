-- ============================================================================
-- OPTIMIZE MCP CACHE LOOKUPS
-- Date: 2026-01-05
-- Purpose: Add partial index to speed up active cache lookups
-- ============================================================================

-- Partial index focusing only on non-expired entries
-- This reduces index size and speeds up the most common query
CREATE INDEX IF NOT EXISTS idx_active_mcp_cache_lookup 
ON public.external_api_cache (key) 
WHERE expires_at > NOW();

-- Add comment for documentation
COMMENT ON INDEX public.idx_active_mcp_cache_lookup IS 'Fast lookup for active (non-expired) MCP cache entries.';

-- ==============================================================================
-- AI KNOWLEDGE CACHE (Smart Memory)
-- ==============================================================================
-- Purpose: "Fetch Once, Store Forever". Caches AI responses to save tokens.
-- Features: Vector Search for semantic matching, JSONB for structured "Hybrid" answers.

-- 1. Enable Vector Extension (if not already)
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Create Cache Table
CREATE TABLE IF NOT EXISTS public.ai_knowledge_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query_text TEXT NOT NULL,                -- Original question (e.g. "Cara ambil wuduk?")
    query_embedding VECTOR(1536),            -- OpenAI embedding for semantic search
    answer_content TEXT,                     -- Quick summary text
    structured_response JSONB DEFAULT '{}'::jsonb, 
    -- Structure:
    -- {
    --   "steps": ["Step 1", "Step 2"],
    --   "resources": [{ "type": "video", "url": "..." }, { "type": "link", "url": "..." }],
    --   "related_topics": ["Topic A", "Topic B"]
    -- }
    
    category TEXT DEFAULT 'general',         -- 'general', 'fiqh', 'seerah', 'image_gen'
    source TEXT DEFAULT 'ai_generated',      -- 'ai_generated', 'manual_override', 'web_search'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    access_count INTEGER DEFAULT 1
);

-- 3. Indexes for Performance
-- Standard lookup
CREATE INDEX IF NOT EXISTS idx_ai_cache_query ON public.ai_knowledge_cache(query_text);

-- Vector Search Index (IVFFlat for speed)
-- Note: Requires some data to be effective, but good to define.
-- We use a conditional block because creating an IVFFlat index on an empty table can sometimes fail or be inefficient
-- until there are records. For now, we'll stick to a basic index or defer the specialized vector index.
-- A simple HNSW index is often better for general use cases in Supabase.
CREATE INDEX IF NOT EXISTS idx_ai_cache_embedding 
ON public.ai_knowledge_cache USING hnsw (query_embedding vector_cosine_ops);

-- 4. RLS Policies
ALTER TABLE public.ai_knowledge_cache ENABLE ROW LEVEL SECURITY;

-- Public Read (Everyone benefits from the cache)
CREATE POLICY "Public Read Cache" ON public.ai_knowledge_cache
FOR SELECT USING (true);

-- System/Admin Write (Users don't write directly, the AI Service (Server-side) does)
-- However, since we are using Client-side AI service currently, we might need to allow authenticated inserts
-- OR use a Database Function (RPC) to handle the "Search or Insert" logic securely.
-- For now, allow Auth users to insert (to populate cache).
CREATE POLICY "Auth Users Populate Cache" ON public.ai_knowledge_cache
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Function to Update Access Count
CREATE OR REPLACE FUNCTION update_cache_access()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_accessed_at = NOW();
    NEW.access_count = OLD.access_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_cache_timestamp
BEFORE UPDATE ON public.ai_knowledge_cache
FOR EACH ROW EXECUTE PROCEDURE update_cache_access();

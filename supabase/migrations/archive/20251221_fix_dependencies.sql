-- ==============================================================================
-- FIXER MIGRATION: Ensure Base Tables Exist Before Extensions
-- ==============================================================================

-- 1. Ensure PostGIS is enabled
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Ensure Core Reference Tables Exist
CREATE TABLE IF NOT EXISTS public.official_mosques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('national', 'state', 'district', 'kariah', 'surau')),
    address TEXT,
    state TEXT,
    coordinates GEOGRAPHY(POINT, 4326),
    jakim_code TEXT UNIQUE,
    facilities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ensure Profiles Exists (Base for all User IDs)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    tier TEXT DEFAULT 'FREE',
    xp_total INTEGER DEFAULT 0,
    barakah_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS on these base tables immediately
ALTER TABLE public.official_mosques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Mosques" ON public.official_mosques FOR SELECT USING (true);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

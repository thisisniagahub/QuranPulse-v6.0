-- ==============================================================================
-- QURANPULSE v6.0 FINAL DATABASE SCHEMA (PLAM ARCHITECTURE)
-- ==============================================================================
-- Comprehensive schema merging User Identity, Learning, Ibadah, and Social modules.
-- Includes PostGIS support, Full-Text Search, and Granular RLS.

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & SETUP
-- ------------------------------------------------------------------------------
-- UUID for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- PostGIS for Mosque locations
CREATE EXTENSION IF NOT EXISTS "postgis";
-- pg_trgm for fuzzy text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 2. CORE IDENTITY & FAMILIES
-- ------------------------------------------------------------------------------

-- 2.1 FAMILIES (Clan System)
CREATE TABLE IF NOT EXISTS public.families (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID, -- Circular ref handled later
    name TEXT NOT NULL CHECK (LENGTH(name) >= 3),
    invite_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 8),
    max_members INTEGER DEFAULT 6 CHECK (max_members BETWEEN 2 AND 50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 PROFILES (User Identity)
-- Note: Using ALTER to add columns if they don't exist is safer for existing tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'FAMILY_MEMBER', 'FAMILY_OWNER', 'TUTOR')),
    xp_total INTEGER DEFAULT 0 CHECK (xp_total >= 0),
    barakah_points INTEGER DEFAULT 0 CHECK (barakah_points >= 0),
    streak INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges JSONB DEFAULT '[]'::jsonb, -- e.g., ["khatam_1", "early_bird"]
    family_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
    is_verified_tutor BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete support
);

-- Ensure missing columns are added if profile table existed
DO $$ 
BEGIN 
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
    EXCEPTION WHEN duplicate_column THEN NULL; END;
    
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'FAMILY_MEMBER', 'FAMILY_OWNER', 'TUTOR'));
    EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN xp_total INTEGER DEFAULT 0;
    EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN barakah_points INTEGER DEFAULT 0;
    EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN streak INTEGER DEFAULT 0;
    EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN level INTEGER DEFAULT 1;
    EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN badges JSONB DEFAULT '[]'::jsonb;
    EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN family_id UUID REFERENCES public.families(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN is_verified_tutor BOOLEAN DEFAULT FALSE;
    EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN deleted_at TIMESTAMPTZ;
    EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;

-- Circular FK fix for families.owner_id
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_families_owner') THEN
        ALTER TABLE public.families 
        ADD CONSTRAINT fk_families_owner 
        FOREIGN KEY (owner_id) REFERENCES public.profiles(id);
    END IF;
END $$;

-- 2.3 USER SETTINGS (Preferences)
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    quran_script TEXT DEFAULT 'uthmani', -- 'uthmani' or 'indopak'
    preferences JSONB DEFAULT '{}'::jsonb, -- Flexible config (font size, audio speed)
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. QURAN REFERENCE DATA (Immutable Content)
-- ------------------------------------------------------------------------------

-- 3.1 SURAHS
CREATE TABLE IF NOT EXISTS public.surahs (
    number INTEGER PRIMARY KEY CHECK (number BETWEEN 1 AND 114),
    name_simple TEXT NOT NULL,
    name_complex TEXT,
    name_arabic TEXT,
    verses_count INTEGER NOT NULL,
    revelation_place TEXT,
    revelation_order INTEGER
);

-- 3.2 AYAHS
CREATE TABLE IF NOT EXISTS public.ayahs (
    id SERIAL PRIMARY KEY,
    surah_number INTEGER REFERENCES public.surahs(number) NOT NULL,
    ayah_number INTEGER NOT NULL,
    text_uthmani TEXT NOT NULL,
    text_imlaei TEXT NOT NULL, -- Simple Arabic for search
    page_number INTEGER,
    juz_number INTEGER,
    -- Generated TSVECTOR for Full Text Search
    search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('simple', text_imlaei)) STORED
);

-- 3.3 TRANSLATIONS
CREATE TABLE IF NOT EXISTS public.translations (
    id SERIAL PRIMARY KEY,
    ayah_id INTEGER REFERENCES public.ayahs(id) ON DELETE CASCADE NOT NULL,
    language_code TEXT NOT NULL, -- 'en', 'ms', 'id'
    resource_name TEXT, -- 'Sahih International'
    text TEXT NOT NULL,
    UNIQUE(ayah_id, language_code, resource_name)
);

-- ------------------------------------------------------------------------------
-- 4. LEARNING ENGINE (IQRA & VOCAB)
-- ------------------------------------------------------------------------------

-- 4.1 IQRA PROGRESS
CREATE TABLE IF NOT EXISTS public.iqra_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 6),
    page_number INTEGER NOT NULL,
    accuracy_score FLOAT CHECK (accuracy_score BETWEEN 0.0 AND 1.0),
    audio_url TEXT, -- Link to recording in Storage
    mistakes_metadata JSONB DEFAULT '{}'::jsonb, -- e.g. {"makhraj": ["ha"], "tajweed": ["qalqalah"]}
    verified_by_tutor BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, level, page_number)
);

-- 4.2 VOCAB LESSONS (Content)
CREATE TABLE IF NOT EXISTS public.vocab_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    words JSONB NOT NULL, -- Array of objects: [{arabic, translation, audio_url}]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.3 USER VOCAB PROGRESS
CREATE TABLE IF NOT EXISTS public.user_vocab_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.vocab_lessons(id) ON DELETE CASCADE NOT NULL,
    mastery_score INTEGER DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
    completed BOOLEAN DEFAULT FALSE,
    last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- ------------------------------------------------------------------------------
-- 5. IBADAH MODULE (Worship & Locations)
-- ------------------------------------------------------------------------------

-- 5.1 OFFICIAL MOSQUES (Directory)
CREATE TABLE IF NOT EXISTS public.official_mosques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('national', 'state', 'district', 'kariah', 'surau')),
    address TEXT,
    state TEXT,
    coordinates GEOGRAPHY(POINT, 4326), -- PostGIS WGS84
    jakim_code TEXT UNIQUE,
    facilities JSONB DEFAULT '[]'::jsonb, -- ["parking", "wheelchair", "mortuary"]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.2 PRAYER LOGS (Habit Tracking)
CREATE TABLE IF NOT EXISTS public.prayer_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    prayer TEXT NOT NULL CHECK (prayer IN ('subuh', 'zohor', 'asar', 'maghrib', 'isyak', 'dhuha', 'tahajjud', 'witir')),
    status TEXT NOT NULL CHECK (status IN ('early', 'on_time', 'late', 'missed', 'qada', 'jama')),
    location_lat FLOAT, -- Optional check-in
    location_long FLOAT,
    mosque_id UUID REFERENCES public.official_mosques(id) ON DELETE SET NULL, -- Optional link to mosque
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date, prayer)
);

-- 5.3 READING HISTORY
CREATE TABLE IF NOT EXISTS public.reading_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    surah_number INTEGER REFERENCES public.surahs(number),
    ayah_number INTEGER,
    duration_seconds INTEGER DEFAULT 0,
    session_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.4 BOOKMARKS
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT DEFAULT 'ayah' CHECK (type IN ('ayah', 'page', 'iqra', 'lesson')),
    ref_id TEXT NOT NULL, -- Generic reference (e.g., "2:255" or lesson UUID)
    title TEXT,
    note TEXT,
    folder TEXT DEFAULT 'default',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. SOCIAL MODULE (Moments)
-- ------------------------------------------------------------------------------

-- 6.1 MOMENTS (Posts)
CREATE TABLE IF NOT EXISTS public.moments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL CHECK (LENGTH(content) <= 1000),
    image_url TEXT,
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'family', 'private')),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- 6.2 MOMENT LIKES
CREATE TABLE IF NOT EXISTS public.moment_likes (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    moment_id UUID REFERENCES public.moments(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, moment_id)
);

-- ------------------------------------------------------------------------------
-- 7. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------

-- Profiles
DROP INDEX IF EXISTS idx_profiles_username;
CREATE INDEX idx_profiles_username ON public.profiles(username) WHERE deleted_at IS NULL;
DROP INDEX IF EXISTS idx_profiles_family;
CREATE INDEX idx_profiles_family ON public.profiles(family_id) WHERE deleted_at IS NULL;

-- Quran
DROP INDEX IF EXISTS idx_ayahs_search;
CREATE INDEX idx_ayahs_search ON public.ayahs USING GIN(search_vector);
DROP INDEX IF EXISTS idx_ayahs_surah;
CREATE INDEX idx_ayahs_surah ON public.ayahs(surah_number);

-- Progress
DROP INDEX IF EXISTS idx_iqra_progress_user;
CREATE INDEX idx_iqra_progress_user ON public.iqra_progress(user_id);
DROP INDEX IF EXISTS idx_prayer_logs_streak;
CREATE INDEX idx_prayer_logs_streak ON public.prayer_logs(user_id, prayer, date DESC);

-- Location
DROP INDEX IF EXISTS idx_mosques_geo;
CREATE INDEX idx_mosques_geo ON public.official_mosques USING GIST(coordinates);

-- Social
DROP INDEX IF EXISTS idx_moments_feed;
CREATE INDEX idx_moments_feed ON public.moments(visibility, created_at DESC) 
    WHERE deleted_at IS NULL;

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ayahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iqra_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_mosques ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Read: Surahs" ON public.surahs;
    DROP POLICY IF EXISTS "Public Read: Ayahs" ON public.ayahs;
    DROP POLICY IF EXISTS "Public Read: Translations" ON public.translations;
    DROP POLICY IF EXISTS "Public Read: Mosques" ON public.official_mosques;
    DROP POLICY IF EXISTS "Public Read: Vocab" ON public.vocab_lessons;
    DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users manage own settings" ON public.user_settings;
    DROP POLICY IF EXISTS "Users manage own iqra" ON public.iqra_progress;
    DROP POLICY IF EXISTS "Users manage own prayers" ON public.prayer_logs;
    DROP POLICY IF EXISTS "Users manage own bookmarks" ON public.bookmarks;
    DROP POLICY IF EXISTS "Users manage own vocab" ON public.user_vocab_progress;
    DROP POLICY IF EXISTS "Family view prayers" ON public.prayer_logs;
    DROP POLICY IF EXISTS "Feed View" ON public.moments;
    DROP POLICY IF EXISTS "Users create moments" ON public.moments;
    DROP POLICY IF EXISTS "Users delete own moments" ON public.moments;
END $$;

-- 8.1 PUBLIC READ POLICIES
CREATE POLICY "Public Read: Surahs" ON public.surahs FOR SELECT USING (true);
CREATE POLICY "Public Read: Ayahs" ON public.ayahs FOR SELECT USING (true);
CREATE POLICY "Public Read: Translations" ON public.translations FOR SELECT USING (true);
CREATE POLICY "Public Read: Mosques" ON public.official_mosques FOR SELECT USING (true);
CREATE POLICY "Public Read: Vocab" ON public.vocab_lessons FOR SELECT USING (true);

-- 8.2 USER PRIVATE DATA POLICIES
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Settings
CREATE POLICY "Users manage own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- Progress & Logs
CREATE POLICY "Users manage own iqra" ON public.iqra_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own prayers" ON public.prayer_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own vocab" ON public.user_vocab_progress FOR ALL USING (auth.uid() = user_id);

-- 8.3 FAMILY SHARED DATA
CREATE POLICY "Family view prayers" ON public.prayer_logs FOR SELECT USING (
    auth.uid() IN (
        SELECT id FROM public.profiles 
        WHERE family_id = (SELECT family_id FROM public.profiles WHERE id = auth.uid())
        AND family_id IS NOT NULL
    )
);

-- 8.4 SOCIAL FEED
CREATE POLICY "Feed View" ON public.moments FOR SELECT USING (
    deleted_at IS NULL AND (
        visibility = 'public' OR
        user_id = auth.uid() OR
        (visibility = 'family' AND user_id IN (
            SELECT id FROM public.profiles 
            WHERE family_id = (SELECT family_id FROM public.profiles WHERE id = auth.uid())
        ))
    )
);

CREATE POLICY "Users create moments" ON public.moments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own moments" ON public.moments FOR UPDATE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 9. TRIGGERS & FUNCTIONS
-- ------------------------------------------------------------------------------

-- 9.1 Handle New User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$ 
BEGIN
    INSERT INTO public.profiles (id, email, full_name, username)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8))
    ) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.user_settings (user_id) VALUES (new.id) ON CONFLICT (user_id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9.2 Auto Update Timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_time ON public.profiles;
CREATE TRIGGER update_profiles_time BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
DROP TRIGGER IF EXISTS update_families_time ON public.families;
CREATE TRIGGER update_families_time BEFORE UPDATE ON families FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
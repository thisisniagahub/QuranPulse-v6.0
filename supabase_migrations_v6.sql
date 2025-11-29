-- QuranPulse v6.0 Migration: Feature Implementation
-- Includes schema for Vocab Builder (ThinkQuran style) and Moments Feed (Qalby style)

-- ==========================================
-- 1. VOCAB BUILDER (Iqra Engine)
-- ==========================================

-- Table: vocab_lessons
CREATE TABLE IF NOT EXISTS vocab_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    words JSONB NOT NULL, -- Array of { arabic, transliteration, translation, audio_url }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: user_vocab_progress
CREATE TABLE IF NOT EXISTS user_vocab_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES vocab_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, lesson_id)
);

-- RLS Policies for Vocab
ALTER TABLE vocab_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocab_progress ENABLE ROW LEVEL SECURITY;

-- Everyone can read lessons
CREATE POLICY "Public lessons are viewable by everyone" 
ON vocab_lessons FOR SELECT USING (true);

-- Users can manage their own progress
CREATE POLICY "Users can manage their own progress" 
ON user_vocab_progress FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 2. MOMENTS FEED (Social Qalb)
-- ==========================================

-- Table: moments
CREATE TABLE IF NOT EXISTS moments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: moment_likes
CREATE TABLE IF NOT EXISTS moment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    moment_id UUID REFERENCES moments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, moment_id)
);

-- RLS Policies for Moments
ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE moment_likes ENABLE ROW LEVEL SECURITY;

-- Everyone can read public moments
CREATE POLICY "Public moments are viewable by everyone" 
ON moments FOR SELECT USING (is_public = true);

-- Users can create moments
CREATE POLICY "Users can create moments" 
ON moments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own moments
CREATE POLICY "Users can delete own moments" 
ON moments FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can manage their own likes" 
ON moment_likes FOR ALL USING (auth.uid() = user_id);

-- Function to handle likes count
CREATE OR REPLACE FUNCTION handle_new_like()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE moments
  SET likes_count = likes_count + 1
  WHERE id = NEW.moment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_added
  AFTER INSERT ON moment_likes
  FOR EACH ROW EXECUTE PROCEDURE handle_new_like();

CREATE OR REPLACE FUNCTION handle_unlike()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE moments
  SET likes_count = likes_count - 1
  WHERE id = OLD.moment_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_removed
  AFTER DELETE ON moment_likes
  FOR EACH ROW EXECUTE PROCEDURE handle_unlike();

-- ==========================================
-- SEED DATA (Optional)
-- ==========================================

INSERT INTO vocab_lessons (title, description, difficulty, words) VALUES
('Basic Quranic Words 1', 'Learn the most common words in the Quran.', 'beginner', 
'[
  {"arabic": "الله", "transliteration": "Allah", "translation": "God", "audio_url": ""},
  {"arabic": "رَبّ", "transliteration": "Rabb", "translation": "Lord", "audio_url": ""},
  {"arabic": "كِتَاب", "transliteration": "Kitab", "translation": "Book", "audio_url": ""}
]'::jsonb),
('Surah Al-Fatihah Vocab', 'Understand the opening chapter.', 'beginner', 
'[
  {"arabic": "الْحَمْدُ", "transliteration": "Al-Hamd", "translation": "The Praise", "audio_url": ""},
  {"arabic": "عَالَمِين", "transliteration": "Alamin", "translation": "Worlds", "audio_url": ""}
]'::jsonb);

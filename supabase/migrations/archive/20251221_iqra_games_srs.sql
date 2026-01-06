
-- QURANPULSE IQRA GAMIFICATION & SRS MIGRATION
-- Enhancing the IQRA learning module with interactive exercises and spaced repetition.

-- 1. IQRA Exercises Table
CREATE TABLE IF NOT EXISTS iqra_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'MATCHING', 'FILL_BLANKS', 'UNSCRAMBLE'
    difficulty INT DEFAULT 1,
    lesson_id TEXT, -- Logical grouping
    question_data JSONB NOT NULL,
    -- Example for MATCHING: { "left": ["alif", "ba"], "right": ["A", "B"] }
    -- Example for FILL_BLANKS: { "text": "Inna ___ lillahi", "answer": "allaha" }
    correct_hash TEXT, -- For client-side verification or server-side double check
    xp_reward INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Spaced Repetition System (SRS) Data
CREATE TABLE IF NOT EXISTS user_srs_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES iqra_exercises(id) ON DELETE CASCADE,
    interval INT DEFAULT 0, -- Days until next review
    ease_factor FLOAT DEFAULT 2.5, -- Standard SM-2 starting factor
    repetition_count INT DEFAULT 0,
    next_review_date TIMESTAMPTZ DEFAULT NOW(),
    last_performance_rating INT, -- 0-5 scale
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, exercise_id)
);

-- 3. Gamification Logs (For detailed leaderboard parsing)
CREATE TABLE IF NOT EXISTS gamification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'LESSON_DONE', 'QUIZ_PERFECT', 'DAILY_STREAK'
    xp_gained INT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Function to handle XP and Level Up
CREATE OR REPLACE FUNCTION handle_xp_gain()
RETURNS TRIGGER AS $$
DECLARE
    current_xp INT;
    new_level INT;
BEGIN
    -- Get current XP
    SELECT xp_total INTO current_xp FROM profiles WHERE id = NEW.user_id;
    
    -- Calculate new level (Logarithmic or target based)
    -- Simple example: Level = floor(sqrt(xp) / 5) + 1
    new_level := floor(sqrt(current_xp + NEW.xp_gained) / 5) + 1;
    
    -- Update Profile
    UPDATE profiles 
    SET 
        xp_total = xp_total + NEW.xp_gained,
        level = new_level,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for XP gain
CREATE TRIGGER on_gamification_log_added
AFTER INSERT ON gamification_logs
FOR EACH ROW EXECUTE PROCEDURE handle_xp_gain();

-- 5. Seed initial data (Examples)
INSERT INTO iqra_exercises (type, difficulty, lesson_id, question_data)
VALUES 
('MATCHING', 1, 'basic-1', '{"left": ["ا", "ب", "ت"], "right": ["Alif", "Ba", "Ta"]}'),
('FILL_BLANKS', 1, 'basic-1', '{"text": "Bismillahi ____ Rahmani Rahim", "options": ["Ar", "Al", "As"], "answer": "Ar"}'),
('UNSCRAMBLE', 2, 'basic-2', '{"words": ["lillahi", "Inna", "allaha"], "correct_order": ["Inna", "lillahi", "allaha"]}');

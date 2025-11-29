-- QuranPulse v6.0 Comprehensive Schema Merge
-- Merging Core User Management, Learning, Social, Marketplace, and AI Features

-- ==========================================
-- 1. CORE USER MANAGEMENT (Extensions)
-- ==========================================

-- Extend existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'family')),
ADD COLUMN IF NOT EXISTS fiqh_preference TEXT DEFAULT 'shafii' CHECK (fiqh_preference IN ('shafii', 'hanafi', 'maliki', 'hambali')),
ADD COLUMN IF NOT EXISTS hijri_date_preference TEXT DEFAULT 'gregorian',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- User Achievement System
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon_path TEXT,
  xp_reward INT DEFAULT 0,
  category TEXT DEFAULT 'general' CHECK (category IN ('quran', 'iqra', 'ibadah', 'social', 'general')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- WhatsApp Session Management
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_data JSONB,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'expired')),
  updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT whatsapp_session_owner_check CHECK (auth.uid() = user_id)
);

-- ==========================================
-- 2. QURAN & IQRA LEARNING
-- ==========================================

-- Quran Reading Progress
CREATE TABLE IF NOT EXISTS quran_progress (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  surah_id INT NOT NULL CHECK (surah_id >= 1 AND surah_id <= 114),
  last_read_ayah INT DEFAULT 1,
  is_khatam BOOLEAN DEFAULT FALSE,
  daily_target INT DEFAULT 5,
  hifz_status TEXT DEFAULT 'new' CHECK (hifz_status IN ('new', 'learning', 'review', 'mastered', 'hifz')),
  last_practice TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, surah_id),
  CONSTRAINT quran_progress_owner_check CHECK (auth.uid() = user_id)
);

-- Iqra Learning Tracking
CREATE TABLE IF NOT EXISTS iqra_tracking (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_volume INT CHECK (current_volume >= 1 AND current_volume <= 6),
  current_page INT DEFAULT 1,
  voice_accuracy_avg FLOAT DEFAULT 0.0,
  tajwid_accuracy FLOAT DEFAULT 0.0,
  completed_levels INT[] DEFAULT '{}',
  last_practice TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id),
  CONSTRAINT iqra_tracking_owner_check CHECK (auth.uid() = user_id)
);

-- Universal Bookmarks System
-- Note: We are creating a new table. Migration of old data should be handled separately or manually.
CREATE TABLE IF NOT EXISTS bookmarks_new (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ayah', 'page', 'iqra', 'hadith', 'article')),
  ref_id TEXT NOT NULL, -- e.g., "2:255" for Quran ayah
  title TEXT,
  note TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT bookmark_owner_check CHECK (auth.uid() = user_id)
);

-- User Notes System
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('ayah', 'hadith', 'iqra_lesson', 'article')),
  subject_ref TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'personal',
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT note_owner_check CHECK (auth.uid() = user_id)
);

-- ==========================================
-- 3. PRAYER & IBADAH TRACKING
-- ==========================================

-- Prayer Completion Tracking
CREATE TABLE IF NOT EXISTS prayer_tracking (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  fajr BOOLEAN DEFAULT FALSE,
  dhuhr BOOLEAN DEFAULT FALSE,
  asr BOOLEAN DEFAULT FALSE,
  maghrib BOOLEAN DEFAULT FALSE,
  isha BOOLEAN DEFAULT FALSE,
  consistency_score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, date),
  CONSTRAINT prayer_tracking_owner_check CHECK (auth.uid() = user_id)
);

-- Islamic Events Calendar
CREATE TABLE IF NOT EXISTS islamic_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  hijri_date DATE NOT NULL,
  gregorian_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ramadan', 'eid', 'hajj', 'monthly', 'observance', 'monthly_roster')),
  description TEXT,
  is_reminder_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Event Participation
CREATE TABLE IF NOT EXISTS user_islamic_events (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES islamic_events(id) ON DELETE CASCADE,
  is_attended BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id),
  CONSTRAINT user_event_owner_check CHECK (auth.uid() = user_id)
);

-- Zakat Calculations & Tracking
CREATE TABLE IF NOT EXISTS zakat_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  calculation_type TEXT NOT NULL CHECK (calculation_type IN ('gold', 'silver', 'business', 'savings', 'livestock', 'agriculture')),
  asset_value DECIMAL NOT NULL,
  liable_amount DECIMAL,
  liability_date DATE,
  paid_date DATE,
  description TEXT,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT zakat_calculation_owner_check CHECK (auth.uid() = user_id)
);

-- ==========================================
-- 4. CONTENT & MULTIMEDIA
-- ==========================================

-- Multimedia Content Management
CREATE TABLE IF NOT EXISTS multimedia_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'podcast', 'article', 'lecture', 'documentary', 'lesson', 'recitation')),
  url TEXT NOT NULL,
  duration INT,
  thumbnail_url TEXT,
  related_surah INT,
  related_iqra_level INT CHECK (related_iqra_level >= 1 AND related_iqra_level <= 6),
  related_hadith_collection TEXT,
  creator_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Content Progress
CREATE TABLE IF NOT EXISTS user_content_progress (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES multimedia_content(id) ON DELETE CASCADE,
  progress_seconds INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, content_id),
  CONSTRAINT user_content_owner_check CHECK (auth.uid() = user_id)
);

-- Dua Collection System
CREATE TABLE IF NOT EXISTS duas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  arabic TEXT NOT NULL,
  transliteration TEXT,
  translation TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('morning', 'evening', 'prayer', 'travel', 'food', 'sleep', 'emotional', 'repentance', 'seeking_guidance')),
  context TEXT,
  reference TEXT,
  is_authentic BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Dua Practice Tracking
CREATE TABLE IF NOT EXISTS user_dua_practice (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dua_id UUID REFERENCES duas(id) ON DELETE CASCADE,
  times_practiced INT DEFAULT 0,
  last_practiced TIMESTAMP WITH TIME ZONE,
  is_favorite BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, dua_id),
  CONSTRAINT user_dua_owner_check CHECK (auth.uid() = user_id)
);

-- Hadith Collection
CREATE TABLE IF NOT EXISTS hadiths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection TEXT NOT NULL,
  book_number INT,
  hadith_number INT,
  arabic TEXT NOT NULL,
  english TEXT NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('sahih', 'hasan', 'daif', 'mawdu')),
  topic TEXT,
  narrator TEXT,
  chapter TEXT,
  is_authentic BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Hadith Study
CREATE TABLE IF NOT EXISTS user_hadith_study (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hadith_id UUID REFERENCES hadiths(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  is_memorized BOOLEAN DEFAULT FALSE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, hadith_id),
  CONSTRAINT user_hadith_owner_check CHECK (auth.uid() = user_id)
);

-- ==========================================
-- 5. COMMUNITY & SOCIAL
-- ==========================================

-- Family Plan Management
CREATE TABLE IF NOT EXISTS family_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Family',
  max_members INT DEFAULT 6,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT family_owner_check CHECK (auth.uid() = owner_id)
);

CREATE TABLE IF NOT EXISTS family_members (
  family_group_id UUID REFERENCES family_groups(id) ON DELETE CASCADE,
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('head', 'spouse', 'child', 'other')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (family_group_id, member_id)
);

-- Leaderboard & Gamification
CREATE TABLE IF NOT EXISTS user_leaderboard (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_xp INT DEFAULT 0,
  weekly_xp INT DEFAULT 0,
  monthly_xp INT DEFAULT 0,
  total_xp_earned INT DEFAULT 0,
  current_level TEXT DEFAULT 'murid',
  last_level_up TIMESTAMP WITH TIME ZONE,
  streak_count INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id),
  CONSTRAINT leaderboard_owner_check CHECK (auth.uid() = user_id)
);

-- Social Connections
CREATE TABLE IF NOT EXISTS user_connections (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  connected_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked', 'removed')),
  connection_type TEXT DEFAULT 'friend' CHECK (connection_type IN ('friend', 'study_partner', 'mentor', 'mentee')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (user_id, connected_user_id),
  CONSTRAINT user_connections_check CHECK (user_id != connected_user_id),
  CONSTRAINT connection_owner_check CHECK (auth.uid() = user_id)
);

-- Community Posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'general' CHECK (post_type IN ('achievement', 'question', 'general', 'study_group', 'event')),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT post_owner_check CHECK (auth.uid() = author_id)
);

CREATE TABLE IF NOT EXISTS post_likes (
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id),
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT comment_owner_check CHECK (auth.uid() = author_id)
);

-- ==========================================
-- 6. MARKETPLACE & FINANCIAL
-- ==========================================

-- Islamic Marketplace
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  currency TEXT DEFAULT 'MYR',
  category TEXT NOT NULL CHECK (category IN ('books', 'clothing', 'art', 'electronics', 'jewelry', 'services', 'courses')),
  subcategory TEXT,
  condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished')),
  quantity_available INT DEFAULT 1,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- Orders Management
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'MYR',
  shipping_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT order_owner_check CHECK (auth.uid() = customer_id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES marketplace_products(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL NOT NULL,
  total_price DECIMAL NOT NULL
);

-- Islamic Services
CREATE TABLE IF NOT EXISTS islamic_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type TEXT NOT NULL CHECK (service_type IN ('qurban', 'aqiqah', 'umrah', 'hajj', 'course', 'consultation')),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL,
  currency TEXT DEFAULT 'MYR',
  provider_info JSONB,
  availability_dates DATE[],
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES islamic_services(id) ON DELETE CASCADE,
  booking_date DATE,
  service_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  special_requirements TEXT,
  total_amount DECIMAL,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT booking_owner_check CHECK (auth.uid() = user_id)
);

-- ==========================================
-- 7. TRANSPARENCY & ETHICS
-- ==========================================

-- Infaq System
CREATE TABLE IF NOT EXISTS infaq_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'MYR',
  purpose TEXT NOT NULL CHECK (purpose IN ('server_cost', 'development', 'wakaf', 'general', 'content_creation', 'charity')),
  message_doa TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
  payment_method TEXT,
  transaction_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT infaq_owner_check CHECK (auth.uid() = user_id)
);

-- Transparency Reports
CREATE TABLE IF NOT EXISTS transparency_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_month DATE NOT NULL,
  total_collected DECIMAL NOT NULL,
  total_expenses DECIMAL NOT NULL,
  breakdown_json JSONB,
  proof_url TEXT,
  report_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Wakaf System
CREATE TABLE IF NOT EXISTS wakaf_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contributor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount DECIMAL NOT NULL,
  wakaf_type TEXT NOT NULL CHECK (wakaf_type IN ('quran_pulse', 'education', 'orphanage', 'masjid', 'general')),
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT wakaf_contributor_check CHECK (auth.uid() = contributor_id)
);

-- ==========================================
-- 8. AI & LEARNING ANALYTICS
-- ==========================================

-- AI Interaction Logs
CREATE TABLE IF NOT EXISTS ai_chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  ai_model_used TEXT DEFAULT 'glm-4-flash',
  confidence_score DECIMAL,
  is_helpful BOOLEAN,
  feedback TEXT,
  context_used JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chat_log_owner_check CHECK (auth.uid() = user_id)
);

-- AI Learning Analytics
CREATE TABLE IF NOT EXISTS user_learning_analytics (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_learning_minutes INT DEFAULT 0,
  quran_reading_days INT DEFAULT 0,
  iqra_practice_days INT DEFAULT 0,
  content_watched_count INT DEFAULT 0,
  community_engagement_score DECIMAL DEFAULT 0.0,
  learning_streak_days INT DEFAULT 0,
  last_active_date DATE,
  learning_goals_completed INT DEFAULT 0,
  preferred_learning_time TEXT,
  engagement_level TEXT DEFAULT 'low' CHECK (engagement_level IN ('low', 'medium', 'high', 'very_high')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT analytics_owner_check CHECK (auth.uid() = user_id)
);

-- Personalized Learning Plans
CREATE TABLE IF NOT EXISTS learning_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('complete_iqra', 'read_quran', 'memorize_surah', 'understand_tafsir', 'improve_pronunciation')),
  target_completion_date DATE,
  current_status TEXT DEFAULT 'active' CHECK (current_status IN ('active', 'completed', 'paused', 'abandoned')),
  daily_target_minutes INT DEFAULT 30,
  weekly_target_chapters INT DEFAULT 1,
  custom_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT learning_plan_owner_check CHECK (auth.uid() = user_id)
);

CREATE TABLE IF NOT EXISTS plan_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES learning_plans(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  target_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  notes TEXT
);

-- Enable RLS on all new tables
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE iqra_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE islamic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_islamic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE multimedia_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dua_practice ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadiths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hadith_study ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE islamic_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE infaq_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transparency_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE wakaf_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_milestones ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Examples - can be refined)
-- Allow read access to public content
CREATE POLICY "Public achievements are viewable by everyone" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public multimedia is viewable by everyone" ON multimedia_content FOR SELECT USING (status = 'published');
CREATE POLICY "Public posts are viewable by everyone" ON community_posts FOR SELECT USING (is_public = true);
CREATE POLICY "Public marketplace products are viewable by everyone" ON marketplace_products FOR SELECT USING (is_approved = true);

-- Allow users to manage their own data
CREATE POLICY "Users can manage own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own quran progress" ON quran_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON bookmarks_new FOR ALL USING (auth.uid() = user_id);

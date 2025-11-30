
export enum NavView {
  DASHBOARD = 'DASHBOARD',
  QURAN = 'QURAN',
  SMART_DEEN = 'SMART_DEEN',
  IQRA = 'IQRA',
  IBADAH = 'IBADAH',
  SOUQ = 'SOUQ',
  MEDIA_STUDIO = 'MEDIA_STUDIO',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN'
}

export interface AppConfigItem {
  key: string;
  value: string;
  group: 'FEATURES' | 'AI_BRAIN' | 'THEME' | 'CONTENT' | 'TEXT';
  description: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export interface SyariahCheckResult {
  safe: boolean;
  flaggedTerm?: string;
}

export interface IqraPageProgress {
  score: number;
  completedAt: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'CHILD' | 'SPOUSE' | 'HEAD' | 'OTHER';
  avatar: string;
  xp: number;
  level: string;
  joined_at?: string;
}

// --- Souq Types ---
export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: 'BOOK' | 'CLOTHING' | 'DONATION' | 'SERVICE' | 'ART' | 'ELECTRONICS' | 'JEWELRY' | 'COURSES';
  stock: number; // Required for inventory logic
  description?: string;
  currency?: string;
  subcategory?: string;
  condition?: 'new' | 'used' | 'refurbished';
  is_featured?: boolean;
  seller_id?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  items: string; // JSON string of items
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  date: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
}

export interface SystemLog {
  timestamp: string;
  action: string;
  status: string;
  apiKey: string;
}

export interface Bookmark {
  id: string;
  surahId: number;
  verseKey: string;
  timestamp: number;
  note?: string;
  // New fields for universal bookmarks
  type?: 'ayah' | 'page' | 'iqra' | 'hadith' | 'article';
  ref_id?: string;
  title?: string;
  is_favorite?: boolean;
}

export interface UserProfile {
  id?: string;
  email?: string;
  name: string;
  username?: string; // New
  avatar_url?: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
  xp_total: number;
  barakah_points: number;
  streak: number;
  last_read_surah: number;
  last_read_ayah: number;
  iqra_progress?: Record<string, Record<number, IqraPageProgress>>;
  cart?: CartItem[];
  bookmarks?: Bookmark[];
  family_members?: FamilyMember[];
  joinedDate?: string;
  status?: 'ACTIVE' | 'BANNED';
  // New fields
  subscription_tier?: 'free' | 'premium' | 'family';
  fiqh_preference?: 'shafii' | 'hanafi' | 'maliki' | 'hambali';
  hijri_date_preference?: 'gregorian' | 'hijri';
  current_level?: string;
}

// --- Iqra Types ---
export interface IqraCell {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: {
    arabic: string;
    transliteration: string;
    audioUrl: string;
  };
}

export interface IqraPage {
  pageNumber: number;
  cells: IqraCell[];
}

// --- New Schema Interfaces ---

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon_path: string;
  xp_reward: number;
  category: 'quran' | 'iqra' | 'ibadah' | 'social' | 'general';
  is_active: boolean;
  unlocked_at?: string; // If joined with user_achievements
}

export interface QuranProgress {
  user_id: string;
  surah_id: number;
  last_read_ayah: number;
  is_khatam: boolean;
  daily_target: number;
  hifz_status: 'new' | 'learning' | 'review' | 'mastered' | 'hifz';
  last_practice: string;
}

export interface PrayerTracking {
  user_id: string;
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  consistency_score: number;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  title?: string;
  content: string;
  post_type: 'achievement' | 'question' | 'general' | 'study_group' | 'event';
  likes_count: number;
  comments_count: number;
  is_public: boolean;
  created_at: string;
  author?: UserProfile; // If joined
}

export interface MultimediaContent {
  id: string;
  title: string;
  type: 'video' | 'podcast' | 'article' | 'lecture' | 'documentary' | 'lesson' | 'recitation';
  url: string;
  duration?: number;
  thumbnail_url?: string;
  related_surah?: number;
  creator_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
}

// --- Admin/CMS Types ---
export interface AdminStat {
  label: string;
  value: string;
  trend: string;
  icon: string;
  color: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
  active: boolean;
  date: string;
}

export interface FlaggedContent {
  id: string;
  user: string;
  content_snippet: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

// --- Quran API Types ---
export interface QuranChapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface QuranTranslationResource {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
}

export interface QuranWord {
  id: number;
  position: number;
  audio_url: string;
  char_type_name: string;
  text_uthmani: string;
  text_indopak?: string;
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
    language_name: string;
  };
}

export interface QuranVerse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translations: Array<{
    id: number;
    resource_id: number;
    text: string;
  }>;
  audio?: {
    url: string;
  };
  transliteration?: {
    text: string;
    language_name: string;
  };
  words?: QuranWord[];
}

export interface AudioFile {
  verse_key: string;
  url: string;
}

export interface Reciter {
  id: number;
  name: string;
  style?: string;
  recitation_style?: string;
}

export interface TafsirResult {
    tafsir: string;
    reflection: string;
    keywords: { term: string; meaning: string }[];
}

export interface MorphologyResult {
    root: string;
    type: string;
    grammar: string;
    translation: string;
    usage_context: string;
}

export interface SemanticResult {
    surah: string;
    ayah: number;
    text: string;
    arabic: string;
    explanation: string;
}
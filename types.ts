
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
  role: 'CHILD' | 'SPOUSE';
  avatar: string;
  xp: number;
  level: string;
}

// --- Souq Types ---
export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: 'BOOK' | 'CLOTHING' | 'DONATION' | 'SERVICE';
  stock: number; // Required for inventory logic
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  items: string; // JSON string of items
  status: 'PENDING' | 'PAID' | 'SHIPPED';
  date: string;
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
}

export interface UserProfile {
  id?: string;
  email?: string;
  name: string;
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
/**
 * User Settings Service - Supabase Integration
 * Handles user preferences with local storage fallback
 */

import { supabase } from '@/lib/supabase';

export interface UserSettings {
  id?: string;
  user_id?: string;
  arabic_font_size: number;
  translation_font_size: number;
  preferred_reciter_id: number;
  preferred_translation_id: number;
  theme: 'dark' | 'light';
  auto_scroll: boolean;
  word_by_word: boolean;
  show_transliteration: boolean;
  notifications_enabled: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  arabic_font_size: 28,
  translation_font_size: 14,
  preferred_reciter_id: 7, // Mishary Rashid Alafasy
  preferred_translation_id: 131, // Sahih International
  theme: 'dark',
  auto_scroll: false,
  word_by_word: true,
  show_transliteration: true,
  notifications_enabled: true,
};

// In-memory cache
let settingsCache: UserSettings | null = null;

/**
 * Get user settings
 */
export const getSettings = async (): Promise<UserSettings> => {
  // Return cache if available
  if (settingsCache) return settingsCache;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return getLocalSettings();
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      console.warn('No settings found in DB, using defaults');
      return getLocalSettings();
    }

    settingsCache = data;
    
    // Sync to localStorage as backup
    localStorage.setItem('qp_settings', JSON.stringify(settingsCache));
    
    return settingsCache;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return getLocalSettings();
  }
};

/**
 * Update user settings
 */
export const updateSettings = async (updates: Partial<UserSettings>): Promise<UserSettings> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Always update local cache first
    settingsCache = { ...(settingsCache || DEFAULT_SETTINGS), ...updates };
    localStorage.setItem('qp_settings', JSON.stringify(settingsCache));
    
    if (!user) {
      return settingsCache;
    }

    const { error } = await supabase
      .from('user_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating settings in DB:', error);
    }

    return settingsCache;
  } catch (error) {
    console.error('Error updating settings:', error);
    return settingsCache || DEFAULT_SETTINGS;
  }
};

/**
 * Reset settings to defaults
 */
export const resetSettings = async (): Promise<UserSettings> => {
  settingsCache = { ...DEFAULT_SETTINGS };
  localStorage.setItem('qp_settings', JSON.stringify(settingsCache));
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('user_settings')
        .update({
          ...DEFAULT_SETTINGS,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    }
  } catch (error) {
    console.error('Error resetting settings:', error);
  }
  
  return settingsCache;
};

// --- CONVENIENCE ACCESSORS ---

export const getArabicFontSize = async (): Promise<number> => {
  const settings = await getSettings();
  return settings.arabic_font_size;
};

export const setArabicFontSize = async (size: number): Promise<void> => {
  await updateSettings({ arabic_font_size: Math.max(16, Math.min(48, size)) });
};

export const getPreferredReciter = async (): Promise<number> => {
  const settings = await getSettings();
  return settings.preferred_reciter_id;
};

export const setPreferredReciter = async (reciterId: number): Promise<void> => {
  await updateSettings({ preferred_reciter_id: reciterId });
};

export const getPreferredTranslation = async (): Promise<number> => {
  const settings = await getSettings();
  return settings.preferred_translation_id;
};

export const setPreferredTranslation = async (translationId: number): Promise<void> => {
  await updateSettings({ preferred_translation_id: translationId });
};

export const isWordByWordEnabled = async (): Promise<boolean> => {
  const settings = await getSettings();
  return settings.word_by_word;
};

export const toggleWordByWord = async (): Promise<boolean> => {
  const settings = await getSettings();
  const newValue = !settings.word_by_word;
  await updateSettings({ word_by_word: newValue });
  return newValue;
};

export const isTransliterationEnabled = async (): Promise<boolean> => {
  const settings = await getSettings();
  return settings.show_transliteration;
};

export const toggleTransliteration = async (): Promise<boolean> => {
  const settings = await getSettings();
  const newValue = !settings.show_transliteration;
  await updateSettings({ show_transliteration: newValue });
  return newValue;
};

// --- LOCAL STORAGE FALLBACK ---

const getLocalSettings = (): UserSettings => {
  try {
    const stored = localStorage.getItem('qp_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      settingsCache = { ...DEFAULT_SETTINGS, ...parsed };
      return settingsCache;
    }
  } catch {
    console.warn('Failed to parse local settings');
  }
  
  settingsCache = { ...DEFAULT_SETTINGS };
  localStorage.setItem('qp_settings', JSON.stringify(settingsCache));
  return settingsCache;
};

/**
 * Clear settings cache (useful after logout)
 */
export const clearSettingsCache = (): void => {
  settingsCache = null;
};

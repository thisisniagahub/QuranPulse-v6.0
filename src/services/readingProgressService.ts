/**
 * Reading Progress Service - Auto-save & Restore
 * Tracks user reading position and history
 */

import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/storage';

export interface ReadingProgress {
  surah_number: number;
  ayah_number: number;
  verse_key: string;
  scroll_position?: number;
  last_updated: string;
}

export interface ReadingSession {
  id?: string;
  user_id?: string;
  surah_number: number;
  ayah_number: number;
  verse_key: string;
  duration_seconds: number;
  completed: boolean;
  session_date: string;
}

// Local storage keys
const PROGRESS_KEY = 'qp_reading_progress';
const SESSION_START_KEY = 'qp_session_start';

/**
 * Save current reading position (auto-save)
 */
export const saveReadingProgress = async (surahNumber: number, ayahNumber: number, scrollPosition?: number): Promise<void> => {
  const progress: ReadingProgress = {
    surah_number: surahNumber,
    ayah_number: ayahNumber,
    verse_key: `${surahNumber}:${ayahNumber}`,
    scroll_position: scrollPosition,
    last_updated: new Date().toISOString()
  };

  // Always save to localStorage first (instant)
  storage.set(PROGRESS_KEY, progress);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update profile with last read position
    await supabase
      .from('profiles')
      .update({
        last_read_surah: surahNumber,
        last_read_ayah: ayahNumber,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

  } catch (error) {
    console.error('Error saving progress to cloud:', error);
  }
};

/**
 * Get last reading position
 */
export const getReadingProgress = async (): Promise<ReadingProgress | null> => {
  try {
    // Try cloud first if logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('last_read_surah, last_read_ayah')
        .eq('id', user.id)
        .single();

      if (data && data.last_read_surah) {
        return {
          surah_number: data.last_read_surah,
          ayah_number: data.last_read_ayah,
          verse_key: `${data.last_read_surah}:${data.last_read_ayah}`,
          last_updated: new Date().toISOString()
        };
      }
    }
  } catch (error) {
    console.error('Error getting progress from cloud:', error);
  }

  // Fallback to localStorage
  return getLocalProgress();
};

/**
 * Start a reading session (for tracking duration)
 */
export const startReadingSession = (surahNumber: number, ayahNumber: number): void => {
  const sessionData = {
    surah_number: surahNumber,
    ayah_number: ayahNumber,
    start_time: Date.now()
  };
  storage.set(SESSION_START_KEY, sessionData);
};

/**
 * End reading session and save to history
 */
export const endReadingSession = async (completed: boolean = false): Promise<void> => {
  try {
    const sessionData = storage.get<{ surah_number: number; ayah_number: number; start_time: number }>(SESSION_START_KEY);
    if (!sessionData) return;
    const durationSeconds = Math.floor((Date.now() - sessionData.start_time) / 1000);
    
    // Only record if at least 30 seconds
    if (durationSeconds < 30) {
      storage.remove(SESSION_START_KEY);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase
        .from('reading_history')
        .insert({
          user_id: user.id,
          surah_number: sessionData.surah_number,
          ayah_number: sessionData.ayah_number,
          verse_key: `${sessionData.surah_number}:${sessionData.ayah_number}`,
          duration_seconds: durationSeconds,
          completed,
          session_date: new Date().toISOString().split('T')[0]
        });

      // Update total verses read (rough estimate based on duration)
      const estimatedVerses = Math.floor(durationSeconds / 20); // ~20s per verse
      await incrementVersesRead(estimatedVerses);
    }

    storage.remove(SESSION_START_KEY);
  } catch (error) {
    console.error('Error saving reading session:', error);
  }
};

/**
 * Get reading statistics
 */
export const getReadingStats = async (): Promise<{
  total_time_today: number;
  total_verses_read: number;
  current_streak: number;
  sessions_today: number;
}> => {
  const defaultStats = {
    total_time_today: 0,
    total_verses_read: 0,
    current_streak: 0,
    sessions_today: 0
  };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return defaultStats;

    const today = new Date().toISOString().split('T')[0];

    // Get today's sessions
    const { data: todaySessions } = await supabase
      .from('reading_history')
      .select('duration_seconds')
      .eq('user_id', user.id)
      .eq('session_date', today);

    // Get profile stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_verses_read, streak')
      .eq('id', user.id)
      .single();

    const totalTimeToday = todaySessions?.reduce((sum, s) => sum + s.duration_seconds, 0) || 0;

    return {
      total_time_today: totalTimeToday,
      total_verses_read: profile?.total_verses_read || 0,
      current_streak: profile?.streak || 0,
      sessions_today: todaySessions?.length || 0
    };
  } catch (error) {
    console.error('Error getting reading stats:', error);
    return defaultStats;
  }
};

/**
 * Increment total verses read
 */
const incrementVersesRead = async (count: number): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.rpc('increment_verses_read', {
      user_id_input: user.id,
      count_input: count
    });
  } catch (error) {
    // Fallback: Manual increment if RPC doesn't exist
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('total_verses_read')
        .eq('id', user.id)
        .single();

      await supabase
        .from('profiles')
        .update({ total_verses_read: (profile?.total_verses_read || 0) + count })
        .eq('id', user.id);
    } catch {
      console.error('Error incrementing verses read');
    }
  }
};

/**
 * Update streak (call daily)
 */
export const updateStreak = async (): Promise<number> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if read today
    const { data: todaySession } = await supabase
      .from('reading_history')
      .select('id')
      .eq('user_id', user.id)
      .eq('session_date', today)
      .limit(1);

    if (!todaySession || todaySession.length === 0) {
      return 0; // No reading today, streak unchanged
    }

    // Check if read yesterday
    const { data: yesterdaySession } = await supabase
      .from('reading_history')
      .select('id')
      .eq('user_id', user.id)
      .eq('session_date', yesterday)
      .limit(1);

    const { data: profile } = await supabase
      .from('profiles')
      .select('streak')
      .eq('id', user.id)
      .single();

    let newStreak = 1;
    if (yesterdaySession && yesterdaySession.length > 0) {
      newStreak = (profile?.streak || 0) + 1;
    }

    await supabase
      .from('profiles')
      .update({ streak: newStreak })
      .eq('id', user.id);

    return newStreak;
  } catch (error) {
    console.error('Error updating streak:', error);
    return 0;
  }
};

// --- LOCAL STORAGE HELPERS ---

const getLocalProgress = (): ReadingProgress | null => {
  return storage.get<ReadingProgress>(PROGRESS_KEY);
};

/**
 * Clear all reading progress data
 */
export const clearReadingProgress = (): void => {
  storage.remove(PROGRESS_KEY);
  storage.remove(SESSION_START_KEY);
};

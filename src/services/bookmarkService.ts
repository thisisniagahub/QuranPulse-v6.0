/**
 * Bookmark Service - Supabase Integration
 * Handles user bookmarks with offline support
 */

import { supabase } from '@/lib/supabase';

export interface Bookmark {
  id?: string;
  user_id?: string;
  surah_number: number;
  ayah_number: number;
  verse_key: string;
  note?: string;
  folder?: string;
  created_at?: string;
}

// In-memory cache for bookmarks
let bookmarksCache: Bookmark[] = [];
let cacheLoaded = false;

/**
 * Get all bookmarks for current user
 */
export const getBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Return local storage bookmarks for unauthenticated users
      return getLocalBookmarks();
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    bookmarksCache = data || [];
    cacheLoaded = true;
    
    // Sync to localStorage as backup
    localStorage.setItem('qp_bookmarks', JSON.stringify(bookmarksCache));
    
    return bookmarksCache;
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return getLocalBookmarks();
  }
};

/**
 * Add a new bookmark
 */
export const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'user_id' | 'created_at'>): Promise<Bookmark | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Save to localStorage for unauthenticated users
      return addLocalBookmark(bookmark);
    }

    // Check if already bookmarked
    const existing = await isBookmarked(bookmark.surah_number, bookmark.ayah_number);
    if (existing) {
      console.log('Already bookmarked:', bookmark.verse_key);
      return null;
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        ...bookmark
      })
      .select()
      .single();

    if (error) throw error;

    // Update cache
    bookmarksCache.unshift(data);
    localStorage.setItem('qp_bookmarks', JSON.stringify(bookmarksCache));

    return data;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return addLocalBookmark(bookmark);
  }
};

/**
 * Remove a bookmark
 */
export const removeBookmark = async (surahNumber: number, ayahNumber: number): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return removeLocalBookmark(surahNumber, ayahNumber);
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('surah_number', surahNumber)
      .eq('ayah_number', ayahNumber);

    if (error) throw error;

    // Update cache
    bookmarksCache = bookmarksCache.filter(
      b => !(b.surah_number === surahNumber && b.ayah_number === ayahNumber)
    );
    localStorage.setItem('qp_bookmarks', JSON.stringify(bookmarksCache));

    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return removeLocalBookmark(surahNumber, ayahNumber);
  }
};

/**
 * Check if a verse is bookmarked
 */
export const isBookmarked = async (surahNumber: number, ayahNumber: number): Promise<boolean> => {
  if (!cacheLoaded) {
    await getBookmarks();
  }
  return bookmarksCache.some(
    b => b.surah_number === surahNumber && b.ayah_number === ayahNumber
  );
};

/**
 * Toggle bookmark (add if not exists, remove if exists)
 */
export const toggleBookmark = async (surahNumber: number, ayahNumber: number, note?: string): Promise<boolean> => {
  const exists = await isBookmarked(surahNumber, ayahNumber);
  
  if (exists) {
    await removeBookmark(surahNumber, ayahNumber);
    return false; // Now not bookmarked
  } else {
    await addBookmark({
      surah_number: surahNumber,
      ayah_number: ayahNumber,
      verse_key: `${surahNumber}:${ayahNumber}`,
      note,
      folder: 'default'
    });
    return true; // Now bookmarked
  }
};

/**
 * Update bookmark note
 */
export const updateBookmarkNote = async (surahNumber: number, ayahNumber: number, note: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('bookmarks')
      .update({ note })
      .eq('user_id', user.id)
      .eq('surah_number', surahNumber)
      .eq('ayah_number', ayahNumber);

    if (error) throw error;

    // Update cache
    const bookmark = bookmarksCache.find(
      b => b.surah_number === surahNumber && b.ayah_number === ayahNumber
    );
    if (bookmark) bookmark.note = note;

    return true;
  } catch (error) {
    console.error('Error updating bookmark note:', error);
    return false;
  }
};

// --- LOCAL STORAGE FALLBACK ---

const getLocalBookmarks = (): Bookmark[] => {
  try {
    const stored = localStorage.getItem('qp_bookmarks');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addLocalBookmark = (bookmark: Omit<Bookmark, 'id' | 'user_id' | 'created_at'>): Bookmark => {
  const local = getLocalBookmarks();
  const newBookmark: Bookmark = {
    ...bookmark,
    id: `local_${Date.now()}`,
    created_at: new Date().toISOString()
  };
  local.unshift(newBookmark);
  localStorage.setItem('qp_bookmarks', JSON.stringify(local));
  bookmarksCache = local;
  return newBookmark;
};

const removeLocalBookmark = (surahNumber: number, ayahNumber: number): boolean => {
  const local = getLocalBookmarks();
  const filtered = local.filter(
    b => !(b.surah_number === surahNumber && b.ayah_number === ayahNumber)
  );
  localStorage.setItem('qp_bookmarks', JSON.stringify(filtered));
  bookmarksCache = filtered;
  return true;
};

/**
 * Sync local bookmarks to Supabase (after login)
 */
export const syncLocalBookmarksToCloud = async (): Promise<number> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const localBookmarks = getLocalBookmarks().filter(b => b.id?.startsWith('local_'));
    if (localBookmarks.length === 0) return 0;

    let synced = 0;
    for (const bookmark of localBookmarks) {
      const exists = await isBookmarked(bookmark.surah_number, bookmark.ayah_number);
      if (!exists) {
        await addBookmark({
          surah_number: bookmark.surah_number,
          ayah_number: bookmark.ayah_number,
          verse_key: bookmark.verse_key,
          note: bookmark.note,
          folder: bookmark.folder
        });
        synced++;
      }
    }

    // Clear local-only bookmarks after sync
    const remaining = getLocalBookmarks().filter(b => !b.id?.startsWith('local_'));
    localStorage.setItem('qp_bookmarks', JSON.stringify(remaining));

    console.log(`✅ Synced ${synced} local bookmarks to cloud`);
    return synced;
  } catch (error) {
    console.error('Error syncing bookmarks:', error);
    return 0;
  }
};

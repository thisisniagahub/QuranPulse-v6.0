// Iqra Data Loader - Dynamic loader for digitized Iqra book data
// This module loads JSON data for Smart Mode in IqraPdfReader

export interface IqraSegment {
  id: string;
  text_arabic: string;
  transliteration: string;
  type: 'character' | 'word' | 'phrase';
  bounding_box: [number, number, number, number]; // [left%, top%, right%, bottom%]
  audio_url: string;
}

export interface IqraPageData {
  book_id: string;
  page_number: number;
  title: string;
  segments: IqraSegment[];
}

// Cache for loaded data
const dataCache: Record<string, IqraPageData[]> = {};

// Map book IDs to JSON file names
const BOOK_FILE_MAP: Record<string, string> = {
  'iqra-1': '/iqra_json/iqra-1.json',
  'iqra-2': '/iqra_json/iqra-2.json',
  'iqra-3': '/iqra_json/iqra-3.json',
  'iqra-4': '/iqra_json/iqra-4.json',
  'iqra-5': '/iqra_json/iqra-5.json',
  'iqra-6': '/iqra_json/iqra-6.json',
};

/**
 * Load all page data for a specific Iqra book
 */
export async function loadIqraBookData(bookId: string): Promise<IqraPageData[]> {
  // Return cached data if available
  if (dataCache[bookId]) {
    return dataCache[bookId];
  }

  const filePath = BOOK_FILE_MAP[bookId];
  if (!filePath) {
    console.warn(`No data file mapped for book: ${bookId}`);
    return [];
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: ${response.status}`);
    }
    const data: IqraPageData[] = await response.json();
    dataCache[bookId] = data;
    return data;
  } catch (error) {
    console.error(`Error loading Iqra data for ${bookId}:`, error);
    return [];
  }
}

/**
 * Get page data for a specific book and page number
 */
export async function getIqraPageData(bookId: string, pageNumber: number): Promise<IqraPageData | null> {
  const bookData = await loadIqraBookData(bookId);
  return bookData.find(page => page.page_number === pageNumber) || null;
}

/**
 * Get all available pages for a book
 */
export async function getAvailablePages(bookId: string): Promise<number[]> {
  const bookData = await loadIqraBookData(bookId);
  return bookData.map(page => page.page_number);
}

/**
 * Preload all Iqra book data (useful for initial app load)
 */
export async function preloadAllIqraData(): Promise<void> {
  const bookIds = Object.keys(BOOK_FILE_MAP);
  await Promise.all(bookIds.map(loadIqraBookData));
  console.log('All Iqra data preloaded');
}

/**
 * Clear cached data (useful for memory management)
 */
export function clearIqraDataCache(): void {
  Object.keys(dataCache).forEach(key => delete dataCache[key]);
}

/**
 * Check if Smart Mode data is available for a specific page
 */
export async function hasSmartModeData(bookId: string, pageNumber: number): Promise<boolean> {
  const pageData = await getIqraPageData(bookId, pageNumber);
  return pageData !== null && pageData.segments.length > 0;
}

// Export default for easier imports
export default {
  loadIqraBookData,
  getIqraPageData,
  getAvailablePages,
  preloadAllIqraData,
  clearIqraDataCache,
  hasSmartModeData,
};

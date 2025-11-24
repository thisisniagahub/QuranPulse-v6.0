import { QuranChapter, QuranVerse, AudioFile, QuranTranslationResource, Reciter } from "../types";

const BASE_URL = "https://api.quran.com/api/v4";
const AUDIO_BASE_URL = "https://verses.quran.com/";

export const getAllChapters = async (): Promise<QuranChapter[]> => {
  try {
    const response = await fetch(`${BASE_URL}/chapters`);
    if (!response.ok) throw new Error("Failed to fetch chapters");
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return [];
  }
};

export const getAvailableTranslations = async (): Promise<QuranTranslationResource[]> => {
  try {
    const response = await fetch(`${BASE_URL}/resources/translations`);
    if (!response.ok) throw new Error("Failed to fetch translations");
    const data = await response.json();
    return data.translations;
  } catch (error) {
    console.error("Error fetching translations:", error);
    return [];
  }
};

// Updated to fetch words=true for Word-by-Word analysis AND Transliteration (ID 57)
export const getVerses = async (chapterId: number, translationId: number = 131): Promise<QuranVerse[]> => {
  try {
    // We append ',57' to fetch Transliteration text along with the selected translation
    const response = await fetch(
        `${BASE_URL}/verses/by_chapter/${chapterId}?language=en&words=true&translations=${translationId},57&fields=text_uthmani&per_page=300&word_fields=translation,transliteration`
    );
    if (!response.ok) throw new Error("Failed to fetch verses");
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error("Error fetching verses:", error);
    return [];
  }
};

export const getChapterAudio = async (chapterId: number, reciterId: number = 7): Promise<Record<string, string>> => {
  try {
    const response = await fetch(
        `${BASE_URL}/recitations/${reciterId}/by_chapter/${chapterId}?per_page=300`
    );
    if (!response.ok) throw new Error("Failed to fetch audio");
    const data = await response.json();
    
    const audioMap: Record<string, string> = {};
    data.audio_files.forEach((file: AudioFile) => {
        const cleanPath = file.url.startsWith('/') ? file.url.substring(1) : file.url;
        audioMap[file.verse_key] = `${AUDIO_BASE_URL}${cleanPath}`;
    });
    
    return audioMap;
  } catch (error) {
    console.error("Error fetching chapter audio:", error);
    return {};
  }
};

// Hardcoded popular reciters (API endpoint exists but list is huge, curating best ones)
export const getFeaturedReciters = (): Reciter[] => [
    { id: 7, name: "Mishary Rashid Alafasy", style: "Murattal" },
    { id: 3, name: "Abdul Rahman Al-Sudais", style: "Murattal" },
    { id: 4, name: "Abu Bakr Al-Shatri", style: "Murattal" },
    { id: 6, name: "Mahmoud Khalil Al-Hussary", style: "Murattal" },
    { id: 10, name: "Saud Al-Shuraim", style: "Murattal" },
    { id: 5, name: "Hani Ar-Rifai", style: "Murattal" }
];

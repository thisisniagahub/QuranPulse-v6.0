
import { QuranChapter, QuranVerse, AudioFile, QuranTranslationResource, Reciter } from "../types";

const BASE_URL = "https://api.quran.com/api/v4";
const AUDIO_BASE_URL = "https://verses.quran.com/";

import { supabase } from "../src/lib/supabase";

export const getAllChapters = async (): Promise<QuranChapter[]> => {
  const { data, error } = await supabase
    .from('surahs')
    .select('*')
    .order('number');
  
  if (error) throw new Error(error.message);
  
  return data.map((s: any) => ({
    id: s.number,
    revelation_place: s.revelation_place,
    revelation_order: s.revelation_order,
    bismillah_pre: s.number !== 1 && s.number !== 9,
    name_simple: s.name_simple,
    name_complex: s.name_complex || s.name_simple,
    name_arabic: s.name_arabic,
    verses_count: s.verses_count,
    translated_name: {
      language_name: 'english',
      name: s.name_simple 
    }
  }));
};

export const getAvailableTranslations = async (): Promise<QuranTranslationResource[]> => {
  // Currently we only have Sahih International in DB. 
  // We can fetch distinct resources if we had more.
  return [
    { id: 131, name: "Sahih International", author_name: "Sahih International", slug: "sahih-international", language_name: "English" }
  ];
};

export const getVerses = async (chapterId: number, translationId: number = 131): Promise<QuranVerse[]> => {
  const { data, error } = await supabase
    .from('ayahs')
    .select(`
      *,
      translations (
        id,
        text,
        resource_name
      )
    `)
    .eq('surah_number', chapterId)
    .order('ayah_number');

  if (error) throw new Error(error.message);

  return data.map((ayah: any) => {
    // Separate Translation and Transliteration
    const translation = ayah.translations.find((t: any) => t.resource_name !== 'Transliteration');
    const transliteration = ayah.translations.find((t: any) => t.resource_name === 'Transliteration');

    return {
      id: ayah.id,
      verse_key: `${ayah.surah_number}:${ayah.ayah_number}`,
      text_uthmani: ayah.text_uthmani,
      translations: translation ? [{
        id: translation.id,
        resource_id: translationId,
        text: translation.text
      }] : [],
      transliteration: transliteration ? {
        text: transliteration.text,
        language_name: 'English'
      } : undefined,
      words: [] 
    };
  });
};

export const getChapterAudio = async (chapterId: number, reciterId: number = 7): Promise<Record<string, string>> => {
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

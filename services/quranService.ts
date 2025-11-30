
import { QuranChapter, QuranVerse, AudioFile, QuranTranslationResource, Reciter } from "../types";

const BASE_URL = "https://api.quran.com/api/v4";
const AUDIO_BASE_URL = "https://verses.quran.com/";

import { supabase } from "../src/lib/supabase";

export const getAllChapters = async (): Promise<QuranChapter[]> => {
  const { data, error } = await supabase
    .from('surahs')
    .select('*')
    .order('number');
  
  // FALLBACK MOCK DATA (If DB is empty)
  if (error || !data || data.length === 0) {
      console.warn("Using Fallback Mock Data for Chapters");
      return [
          { id: 1, revelation_place: "makkah", revelation_order: 5, bismillah_pre: false, name_simple: "Al-Fatiha", name_complex: "Al-Fatiha", name_arabic: "الفاتحة", verses_count: 7, translated_name: { language_name: 'english', name: "The Opener" } },
          { id: 2, revelation_place: "madinah", revelation_order: 87, bismillah_pre: true, name_simple: "Al-Baqarah", name_complex: "Al-Baqarah", name_arabic: "البقرة", verses_count: 286, translated_name: { language_name: 'english', name: "The Cow" } },
          { id: 18, revelation_place: "makkah", revelation_order: 69, bismillah_pre: true, name_simple: "Al-Kahf", name_complex: "Al-Kahf", name_arabic: "الكهف", verses_count: 110, translated_name: { language_name: 'english', name: "The Cave" } },
          { id: 36, revelation_place: "makkah", revelation_order: 41, bismillah_pre: true, name_simple: "Ya-Sin", name_complex: "Ya-Sin", name_arabic: "يس", verses_count: 83, translated_name: { language_name: 'english', name: "Ya Sin" } },
          { id: 67, revelation_place: "makkah", revelation_order: 77, bismillah_pre: true, name_simple: "Al-Mulk", name_complex: "Al-Mulk", name_arabic: "الملك", verses_count: 30, translated_name: { language_name: 'english', name: "The Sovereignty" } }
      ];
  }
  
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

  // FALLBACK MOCK DATA FOR AL-FATIHA (ID 1)
  if ((error || !data || data.length === 0) && chapterId === 1) {
      return [
          { id: 1, verse_key: "1:1", text_uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", translations: [{ id: 1, resource_id: 131, text: "In the name of Allah, the Entirely Merciful, the Especially Merciful." }], transliteration: { text: "Bismillaahir Rahmaanir Raheem", language_name: "English" }, words: [] },
          { id: 2, verse_key: "1:2", text_uthmani: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", translations: [{ id: 2, resource_id: 131, text: "[All] praise is [due] to Allah, Lord of the worlds -" }], transliteration: { text: "Alhamdu lillaahi Rabbil 'aalameen", language_name: "English" }, words: [] },
          { id: 3, verse_key: "1:3", text_uthmani: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", translations: [{ id: 3, resource_id: 131, text: "The Entirely Merciful, the Especially Merciful," }], transliteration: { text: "Ar-Rahmaanir-Raheem", language_name: "English" }, words: [] },
          { id: 4, verse_key: "1:4", text_uthmani: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", translations: [{ id: 4, resource_id: 131, text: "Sovereign of the Day of Recompense." }], transliteration: { text: "Maaliki Yawmid-Deen", language_name: "English" }, words: [] },
          { id: 5, verse_key: "1:5", text_uthmani: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translations: [{ id: 5, resource_id: 131, text: "It is You we worship and You we ask for help." }], transliteration: { text: "Iyyaaka na'budu wa lyyaaka nasta'een", language_name: "English" }, words: [] },
          { id: 6, verse_key: "1:6", text_uthmani: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", translations: [{ id: 6, resource_id: 131, text: "Guide us to the straight path -" }], transliteration: { text: "Ihdinas-Siraatal-Mustaqeem", language_name: "English" }, words: [] },
          { id: 7, verse_key: "1:7", text_uthmani: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", translations: [{ id: 7, resource_id: 131, text: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }], transliteration: { text: "Siraatal-lazeena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daaaalleen", language_name: "English" }, words: [] }
      ];
  }

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

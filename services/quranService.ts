/**
 * 🚀 ENHANCED QuranService - Complete Transliteration Support
 * 
 * FEATURES:
 * ✅ Word-by-word data from Quran.com API
 * ✅ Transliteration for EVERY verse
 * ✅ Caching layer to reduce API calls
 * ✅ Better error handling
 * ✅ Fallback strategies
 */

import { QuranChapter, QuranVerse, AudioFile, QuranTranslationResource, Reciter, QuranWord } from "../types";

const BASE_URL = "https://api.quran.com/api/v4";
const AUDIO_BASE_URL = "https://verses.quran.com/";

import { supabase } from "../src/lib/supabase";

// ✨ In-memory cache to reduce API calls
const cache = {
  chapters: null as QuranChapter[] | null,
  verses: {} as Record<string, QuranVerse[]>,
  audio: {} as Record<string, Record<string, string>>,
};

// =====================================
// CHAPTERS
// =====================================

export const getAllChapters = async (): Promise<QuranChapter[]> => {
  // Check cache first
  if (cache.chapters) {
    return cache.chapters;
  }

  try {
    const { data, error } = await supabase
      .from('surahs')
      .select('*')
      .order('number');
    
    // FALLBACK MOCK DATA (If DB is empty)
    if (error || !data || data.length === 0) {
        console.warn("⚠️ Using Fallback Mock Data for Chapters");
        return [
            { id: 1, revelation_place: "makkah", revelation_order: 5, bismillah_pre: false, name_simple: "Al-Fatiha", name_complex: "Al-Fātiḥah", name_arabic: "الفاتحة", verses_count: 7, translated_name: { language_name: 'english', name: "The Opener" } },
            { id: 2, revelation_place: "madinah", revelation_order: 87, bismillah_pre: true, name_simple: "Al-Baqarah", name_complex: "Al-Baqarah", name_arabic: "البقرة", verses_count: 286, translated_name: { language_name: 'english', name: "The Cow" } },
            { id: 18, revelation_place: "makkah", revelation_order: 69, bismillah_pre: true, name_simple: "Al-Kahf", name_complex: "Al-Kahf", name_arabic: "الكهف", verses_count: 110, translated_name: { language_name: 'english', name: "The Cave" } },
            { id: 36, revelation_place: "makkah", revelation_order: 41, bismillah_pre: true, name_simple: "Ya-Sin", name_complex: "Yā-Sīn", name_arabic: "يس", verses_count: 83, translated_name: { language_name: 'english', name: "Ya Sin" } },
            { id: 67, revelation_place: "makkah", revelation_order: 77, bismillah_pre: true, name_simple: "Al-Mulk", name_complex: "Al-Mulk", name_arabic: "الملك", verses_count: 30, translated_name: { language_name: 'english', name: "The Sovereignty" } },
            { id: 112, revelation_place: "makkah", revelation_order: 112, bismillah_pre: true, name_simple: "Al-Ikhlas", name_complex: "Al-Ikhlāṣ", name_arabic: "الإخلاص", verses_count: 4, translated_name: { language_name: 'english', name: "The Sincerity" } },
            { id: 113, revelation_place: "makkah", revelation_order: 113, bismillah_pre: true, name_simple: "Al-Falaq", name_complex: "Al-Falaq", name_arabic: "الفلق", verses_count: 5, translated_name: { language_name: 'english', name: "The Daybreak" } },
            { id: 114, revelation_place: "makkah", revelation_order: 114, bismillah_pre: true, name_simple: "An-Nas", name_complex: "An-Nās", name_arabic: "الناس", verses_count: 6, translated_name: { language_name: 'english', name: "Mankind" } },
        ];
    }
    
    const chapters = data.map((s: any) => ({
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

    cache.chapters = chapters;
    return chapters;

  } catch (err) {
    console.error("❌ Error fetching chapters:", err);
    return [
      { id: 1, revelation_place: "makkah", revelation_order: 5, bismillah_pre: false, name_simple: "Al-Fatiha", name_complex: "Al-Fātiḥah", name_arabic: "الفاتحة", verses_count: 7, translated_name: { language_name: 'english', name: "The Opener" } }
    ];
  }
};

// =====================================
// TRANSLATIONS
// =====================================

export const getAvailableTranslations = async (): Promise<QuranTranslationResource[]> => {
  return [
    { id: 131, name: "Sahih International", author_name: "Saheeh International", slug: "sahih-international", language_name: "English" },
  ];
};

// =====================================
// VERSES - WITH FULL TRANSLITERATION FROM API
// =====================================

export const getVerses = async (chapterId: number, translationId: number = 131): Promise<QuranVerse[]> => {
  const cacheKey = `${chapterId}-${translationId}`;
  
  // Check cache
  if (cache.verses[cacheKey]) {
    console.log("✅ Cache hit for verses:", cacheKey);
    return cache.verses[cacheKey];
  }

  try {
    // ✨ ALWAYS fetch from Quran.com API to get complete transliteration
    console.log(`📖 Fetching Surah ${chapterId} from Quran.com API with transliteration...`);
    return await getVersesFromAPI(chapterId, translationId);

  } catch (err) {
    console.error("❌ Error fetching verses:", err);
    // Fallback for Al-Fatiha only
    if (chapterId === 1) {
      return getFatihaFallback();
    }
    throw new Error(`Failed to load verses for Surah ${chapterId}`);
  }
};

// ✨ Fetch verses from Quran.com API with FULL transliteration support
const getVersesFromAPI = async (chapterId: number, translationId: number = 131): Promise<QuranVerse[]> => {
  try {
    // Fetch with words, translations, and transliteration
    const response = await fetch(
      `${BASE_URL}/verses/by_chapter/${chapterId}?language=en&words=true&translations=${translationId}&transliteration=1&word_fields=text_uthmani,transliteration&per_page=300`
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const apiData = await response.json();
    
    const verses: QuranVerse[] = apiData.verses.map((v: any) => ({
      id: v.id,
      verse_key: v.verse_key,
      text_uthmani: v.text_uthmani,
      
      // ✅ Translations
      translations: v.translations?.map((t: any) => ({
        id: t.id,
        resource_id: t.resource_id,
        text: t.text
      })) || [],
      
      // ✅ FULL VERSE Transliteration
      transliteration: v.transliteration ? {
        text: v.transliteration.text,
        language_name: v.transliteration.language_name || 'english'
      } : undefined,
      
      // ✅ Word-by-word data with individual transliterations
      words: v.words?.map((w: any) => ({
        id: w.id,
        position: w.position,
        audio_url: w.audio?.url || '',
        char_type_name: w.char_type_name || 'word',
        text_uthmani: w.text_uthmani,
        translation: w.translation ? {
          text: w.translation.text,
          language_name: w.translation.language_name
        } : undefined,
        transliteration: w.transliteration ? {
          text: w.transliteration.text,
          language_name: w.transliteration.language_name
        } : undefined
      } as QuranWord)) || []
    }));

    const cacheKey = `${chapterId}-${translationId}`;
    cache.verses[cacheKey] = verses;
    
    console.log(`✅ Loaded ${verses.length} verses from Quran.com API with full transliteration`);
    return verses;

  } catch (err) {
    console.error("❌ API fetch failed:", err);
    throw err;
  }
};

// Fallback Al-Fatiha data with transliteration
const getFatihaFallback = (): QuranVerse[] => {
  return [
    { id: 1, verse_key: "1:1", text_uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", translations: [{ id: 1, resource_id: 131, text: "In the name of Allah, the Entirely Merciful, the Especially Merciful." }], transliteration: { text: "bismillāhir-raḥmānir-raḥīm", language_name: "English" }, words: [] },
    { id: 2, verse_key: "1:2", text_uthmani: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", translations: [{ id: 2, resource_id: 131, text: "[All] praise is [due] to Allah, Lord of the worlds -" }], transliteration: { text: "alḥamdu lillāhi rabbil-ʿālamīn", language_name: "English" }, words: [] },
    { id: 3, verse_key: "1:3", text_uthmani: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", translations: [{ id: 3, resource_id: 131, text: "The Entirely Merciful, the Especially Merciful," }], transliteration: { text: "ar-raḥmānir-raḥīm", language_name: "English" }, words: [] },
    { id: 4, verse_key: "1:4", text_uthmani: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", translations: [{ id: 4, resource_id: 131, text: "Sovereign of the Day of Recompense." }], transliteration: { text: "māliki yawmid-dīn", language_name: "English" }, words: [] },
    { id: 5, verse_key: "1:5", text_uthmani: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translations: [{ id: 5, resource_id: 131, text: "It is You we worship and You we ask for help." }], transliteration: { text: "iyyāka naʿbudu wa-iyyāka nastaʿīn", language_name: "English" }, words: [] },
    { id: 6, verse_key: "1:6", text_uthmani: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", translations: [{ id: 6, resource_id: 131, text: "Guide us to the straight path -" }], transliteration: { text: "ihdinaṣ-ṣirāṭal-mustaqīm", language_name: "English" }, words: [] },
    { id: 7, verse_key: "1:7", text_uthmani: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", translations: [{ id: 7, resource_id: 131, text: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }], transliteration: { text: "ṣirāṭal-ladhīna anʿamta ʿalayhim ghayril-maghḍūbi ʿalayhim wa-laḍ-ḍāllīn", language_name: "English" }, words: [] }
  ];
};

// =====================================
// AUDIO
// =====================================

export const getChapterAudio = async (chapterId: number, reciterId: number = 7): Promise<Record<string, string>> => {
  const cacheKey = `${chapterId}-${reciterId}`;
  
  if (cache.audio[cacheKey]) {
    console.log("✅ Cache hit for audio:", cacheKey);
    return cache.audio[cacheKey];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/recitations/${reciterId}/by_chapter/${chapterId}?per_page=300`
    );
    
    if (!response.ok) {
      throw new Error(`Audio API returned ${response.status}`);
    }

    const data = await response.json();
    
    const audioMap: Record<string, string> = {};
    data.audio_files.forEach((file: AudioFile) => {
      const cleanPath = file.url.startsWith('/') ? file.url.substring(1) : file.url;
      audioMap[file.verse_key] = `${AUDIO_BASE_URL}${cleanPath}`;
    });
    
    cache.audio[cacheKey] = audioMap;
    console.log(`✅ Loaded audio for ${Object.keys(audioMap).length} verses`);
    
    return audioMap;

  } catch (err) {
    console.error("❌ Error fetching audio:", err);
    return {};
  }
};

// =====================================
// RECITERS
// =====================================

export const getFeaturedReciters = (): Reciter[] => [
  { id: 7, name: "Mishary Rashid Alafasy", style: "Murattal", recitation_style: "Beautiful and Clear" },
  { id: 3, name: "Abdul Rahman Al-Sudais", style: "Murattal", recitation_style: "Imam of Masjid al-Haram" },
  { id: 4, name: "Abu Bakr Al-Shatri", style: "Murattal", recitation_style: "Heartfelt Recitation" },
  { id: 6, name: "Mahmoud Khalil Al-Hussary", style: "Murattal (Mujawwad)", recitation_style: "Classical Egyptian Style" },
  { id: 10, name: "Saud Al-Shuraim", style: "Murattal", recitation_style: "Imam of Masjid al-Haram" },
  { id: 5, name: "Hani Ar-Rifai", style: "Murattal", recitation_style: "Modern Clear Recitation" },
  { id: 2, name: "Abdullah Basfar", style: "Murattal", recitation_style: "Popular Saudi Reciter" },
  { id: 11, name: "Maher Al Muaiqly", style: "Murattal", recitation_style: "Imam of Masjid al-Haram" },
];

// =====================================
// UTILITY FUNCTIONS
// =====================================

export const clearCache = () => {
  cache.chapters = null;
  cache.verses = {};
  cache.audio = {};
  console.log("🗑️ Cache cleared");
};

export const preloadPopularSurahs = async () => {
  const popular = [1, 2, 18, 36, 67, 112, 113, 114];
  console.log("⏳ Preloading popular surahs...");
  
  const promises = popular.map(id => 
    getVerses(id, 131).catch(err => console.warn(`Failed to preload surah ${id}:`, err))
  );
  
  await Promise.all(promises);
  console.log("✅ Preloading complete");
};

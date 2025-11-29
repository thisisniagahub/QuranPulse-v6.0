console.log("Script started");
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// dotenv.config(); // Skip dotenv for now to debug

const supabaseUrl = "https://cmofwaffmddikupetziv.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("URL:", supabaseUrl);
console.log("Key Length:", supabaseKey ? supabaseKey.length : "MISSING");

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedQuran() {
  console.log('🚀 Starting Quran Data Seeding...');

  try {
    // 1. Fetch Surahs
    console.log('📦 Fetching Surahs...');
    const surahRes = await fetch('https://api.quran.com/api/v4/chapters');
    const surahData = await surahRes.json();
    
    const surahs = surahData.chapters.map(s => ({
      number: s.id,
      name_simple: s.name_simple,
      name_complex: s.name_complex,
      name_arabic: s.name_arabic,
      verses_count: s.verses_count,
      revelation_place: s.revelation_place,
      revelation_order: s.revelation_order
    }));

    // Bulk Insert Surahs
    const { error: surahError } = await supabase.from('surahs').upsert(surahs, { onConflict: 'number' });
    if (surahError) throw new Error(`Surah Insert Failed: ${surahError.message}`);
    console.log(`✅ Inserted ${surahs.length} Surahs`);

    // 2. Fetch Ayahs (Looping by Surah)
    console.log('📦 Fetching Ayahs (This might take a moment)...');
    
    for (const surah of surahs) {
        console.log(`   Processing Surah ${surah.number} (${surah.name_simple})...`);
        
        // Fetch Ayahs for this Surah
        const versesRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.number}?language=en&words=false&fields=text_uthmani,text_imlaei,page_number,juz_number&per_page=300`);
        const versesData = await versesRes.json();
        
        const ayahsToInsert = versesData.verses.map(v => ({
            surah_number: surah.number,
            ayah_number: v.verse_number,
            text_uthmani: v.text_uthmani,
            text_imlaei: v.text_imlaei,
            page_number: v.page_number,
            juz_number: v.juz_number
        }));

        // WORKAROUND: Since unique constraint is missing, we DELETE existing ayahs for this surah first to avoid duplicates.
        const { error: deleteError } = await supabase.from('ayahs').delete().eq('surah_number', surah.number);
        if (deleteError) console.warn(`⚠️ Delete Warning for Surah ${surah.number}:`, deleteError.message);

        // Now we can just INSERT (not upsert)
        const { data: insertedAyahs, error: ayahError } = await supabase.from('ayahs').insert(ayahsToInsert).select();
        if (ayahError) {
            console.error(`❌ Ayah Insert Failed for Surah ${surah.number}:`, ayahError.message);
            continue; 
        }

        // 3. Fetch Translations (Sahih International - ID 131) for this Surah
        // We can fetch translations by chapter too.
        const transRes = await fetch(`https://api.quran.com/api/v4/quran/translations/131?chapter_number=${surah.number}`);
        const transData = await transRes.json();
        
        // Map translations to the inserted Ayahs (we need ayah_id from DB? Or we can rely on surah_number/ayah_number composite key if we had one, but we used serial ID)
        // Actually, our `translations` table references `ayahs(id)`.
        // So we need to know the ID of the ayah we just inserted.
        // Since we upserted, we can get the IDs back.
        
        // Create a map of AyahNumber -> AyahID
        const ayahMap = new Map();
        insertedAyahs.forEach(a => ayahMap.set(a.ayah_number, a.id));

        const translationsToInsert = transData.translations.map(t => ({
            ayah_id: ayahMap.get(t.verse_number),
            text: t.text,
            language_code: 'en',
            resource_name: 'Sahih International'
        })).filter(t => t.ayah_id); // Ensure we have an ID

        if (translationsToInsert.length > 0) {
            // WORKAROUND: Delete existing translations for these ayahs
            const ayahIds = translationsToInsert.map(t => t.ayah_id);
            await supabase.from('translations').delete().in('ayah_id', ayahIds);

            const { error: transError } = await supabase.from('translations').insert(translationsToInsert);
             if (transError) console.warn(`   ⚠️ Translation Insert Warning for Surah ${surah.number}: ${transError.message}`);
        }
    }

    console.log('✅ Quran Data Seeding Completed Successfully!');

  } catch (err) {
    console.error('❌ Seeding Failed:', err);
  }
}

seedQuran().catch(err => {
    console.error("Top level error:", err);
    process.exit(1);
});

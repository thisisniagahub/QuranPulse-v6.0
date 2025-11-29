console.log("Script started");
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = "https://cmofwaffmddikupetziv.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTransliteration() {
  console.log('🚀 Starting Transliteration Seeding...');

  try {
    // Fetch all Surahs to loop through
    const { data: surahs, error: surahError } = await supabase.from('surahs').select('number, name_simple').order('number');
    if (surahError) throw surahError;

    for (const surah of surahs) {
        console.log(`   Processing Surah ${surah.number} (${surah.name_simple})...`);
        
        // 1. Fetch Transliteration (ID 57) from API
        const transRes = await fetch(`https://api.quran.com/api/v4/quran/translations/57?chapter_number=${surah.number}`);
        const transData = await transRes.json();
        
        // 2. Fetch Ayah IDs for this Surah from DB
        const { data: dbAyahs, error: ayahsError } = await supabase
            .from('ayahs')
            .select('id, ayah_number')
            .eq('surah_number', surah.number);
            
        if (ayahsError) throw ayahsError;

        // Map AyahNumber -> AyahID
        const ayahMap = new Map();
        dbAyahs.forEach(a => ayahMap.set(a.ayah_number, a.id));

        // 3. Prepare Data
        const translationsToInsert = transData.translations.map(t => ({
            ayah_id: ayahMap.get(t.verse_number),
            text: t.text,
            language_code: 'en', // Transliteration is usually romanized arabic, often tagged as en
            resource_name: 'Transliteration'
        })).filter(t => t.ayah_id);

        if (translationsToInsert.length > 0) {
            // Delete existing if any (to be safe/idempotent)
            const ayahIds = translationsToInsert.map(t => t.ayah_id);
            await supabase.from('translations').delete().in('ayah_id', ayahIds).eq('resource_name', 'Transliteration');

            // Insert
            const { error: insertError } = await supabase.from('translations').insert(translationsToInsert);
             if (insertError) console.warn(`   ⚠️ Insert Warning for Surah ${surah.number}: ${insertError.message}`);
        }
    }

    console.log('✅ Transliteration Seeding Completed!');

  } catch (err) {
    console.error('❌ Seeding Failed:', err);
  }
}

seedTransliteration().catch(err => {
    console.error("Top level error:", err);
    process.exit(1);
});

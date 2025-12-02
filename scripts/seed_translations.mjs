import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Try to read .env for VITE keys, but we really need SERVICE_ROLE_KEY
const envPath = path.join(rootDir, '.env');
let envVars = {};
try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      envVars[key] = value;
    }
  });
} catch (e) {
  console.log("Could not read .env file");
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || envVars['VITE_SUPABASE_URL'];
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || envVars['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Credentials!');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in .env');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️  WARNING: Using Anon Key. Insertions may fail if RLS is enabled and no policy exists.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTranslations() {
  console.log('🚀 Starting Translation Seeding (Sahih International)...');

  try {
    // 1. Get all Surahs
    const { data: surahs, error: surahError } = await supabase
        .from('surahs')
        .select('number, name_simple')
        .order('number');

    if (surahError) throw new Error(`Failed to fetch surahs: ${surahError.message}`);

    console.log(`Found ${surahs.length} Surahs. Processing...`);

    for (const surah of surahs) {
        // 2. Fetch Translations from API (Sahih International = 20)
        // Using verses/by_chapter to ensure we get verse numbers and text correctly
        const res = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.number}?translations=20&per_page=300`);
        const data = await res.json();
        
        if (!data.verses) {
            console.log('❌ API Error: No verses found');
            continue;
        }

        // 3. Get Ayah IDs from DB for this Surah
        const { data: dbAyahs, error: ayahsError } = await supabase
            .from('ayahs')
            .select('id, ayah_number')
            .eq('surah_number', surah.number);

        if (ayahsError) {
            console.log(`❌ DB Error: ${ayahsError.message}`);
            continue;
        }

        // Map Ayah Number -> UUID/ID
        const ayahMap = new Map();
        dbAyahs.forEach(a => ayahMap.set(a.ayah_number, a.id));

        // 4. Prepare Rows
        const rows = data.verses.map(v => {
            // v.verse_number is the number within the surah (1, 2, 3...)
            const ayahId = ayahMap.get(v.verse_number);
            if (!ayahId) return null;

            // v.translations is an array, we asked for ID 20 so it should be there
            const translationText = v.translations && v.translations[0] ? v.translations[0].text : null;
            if (!translationText) return null;

            return {
                ayah_id: ayahId,
                text: translationText,
                language_code: 'en',
                resource_name: 'Sahih International'
            };
        }).filter(r => r !== null);

        if (rows.length === 0) {
            console.log('⚠️ No matching ayahs found (rows=0)');
            continue;
        }

        // 5. Insert (Delete old first to be safe)
        const ayahIds = rows.map(r => r.ayah_id);
        await supabase.from('translations').delete().in('ayah_id', ayahIds).eq('resource_name', 'Sahih International');
        
        const { error: insertError } = await supabase.from('translations').insert(rows);
        
        if (insertError) {
            console.log(`❌ Insert Failed: ${insertError.message}`);
        } else {
            console.log(`✅ Inserted ${rows.length} verses`);
        }
    }

    console.log('\n✅ Translation Seeding Completed!');

  } catch (err) {
    console.error('\n❌ Script Failed:', err);
    process.exit(1);
  }
}

seedTranslations();

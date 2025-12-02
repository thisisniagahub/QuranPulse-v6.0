import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Read .env file manually
const envPath = path.join(rootDir, '.env');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
  console.error("Could not read .env file");
  process.exit(1);
}

const envVars = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('Checking Supabase Data...');
  console.log(`URL: ${supabaseUrl}`);

  // Check Surahs
  const { count: surahCount, error: surahError } = await supabase
    .from('surahs')
    .select('*', { count: 'exact', head: true });

  if (surahError) {
    console.error('Error checking surahs:', surahError.message);
  } else {
    console.log(`Surahs Count: ${surahCount}`);
  }

  // Check Ayahs
  const { count: ayahCount, error: ayahError } = await supabase
    .from('ayahs')
    .select('*', { count: 'exact', head: true });

  if (ayahError) {
    console.error('Error checking ayahs:', ayahError.message);
  } else {
    console.log(`Ayahs Count: ${ayahCount}`);
  }

  // Check a sample Ayah (Al-Fatihah:1)
  const { data: sampleAyah, error: sampleError } = await supabase
    .from('ayahs')
    .select('text_uthmani, text_imlaei')
    .eq('surah_number', 1)
    .eq('ayah_number', 1)
    .single();

  if (sampleError) {
    console.log('Could not fetch sample ayah (Al-Fatihah:1):', sampleError.message);
  } else if (sampleAyah) {
    console.log('Sample Ayah (1:1):');
    console.log('Uthmani:', sampleAyah.text_uthmani);
    console.log('Imlaei:', sampleAyah.text_imlaei);
  }

  // Check for any 'verified' table or similar (guessing)
  // We can't list tables easily with anon key usually, so we skip that.
}

checkData();

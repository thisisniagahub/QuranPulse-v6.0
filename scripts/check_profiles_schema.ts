
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf-8');
            envConfig.split('\n').forEach((line) => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
        }
    } catch (e) {}
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTables() {
  const tables = [
    'profiles', 
    'families',
    'user_settings',
    'surahs',
    'ayahs',
    'translations',
    'iqra_progress',
    'vocab_lessons',
    'user_vocab_progress',
    'official_mosques',
    'prayer_logs',
    'reading_history',
    'bookmarks',
    'moments',
    'moment_likes'
  ];
  
  console.log('🏁 Starting Database Table Verification...');
  console.log('------------------------------------------');
  
  for (const table of tables) {
    // We use a simple select limit 0 to check if the table exists and is accessible via anon
    const { error } = await supabase.from(table).select('*').limit(0);
    
    if (error) {
      if (error.code === '42P01') {
        console.log(`❌ ${table.padEnd(20)} : DOES NOT EXIST`);
      } else if (error.code === '42501') {
        console.log(`✅ ${table.padEnd(20)} : EXISTS (Protected by RLS)`);
      } else {
        console.log(`⚠️ ${table.padEnd(20)} : ERROR (${error.code} - ${error.message})`);
      }
    } else {
      console.log(`✅ ${table.padEnd(20)} : EXISTS (Publicly Readable)`);
    }
  }
  console.log('------------------------------------------');
  console.log('Verification Complete!');
}

verifyTables().catch(console.error);

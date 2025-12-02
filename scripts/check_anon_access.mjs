import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const envPath = path.join(rootDir, '.env');
let envVars = {};
try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      envVars[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
} catch (e) {}

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Fetching ayahs for Surah 1...');
  const { data, error } = await supabase.from('ayahs').select('id, ayah_number').eq('surah_number', 1);
  
  if (error) {
    console.log(`❌ Error: ${error.message}`);
  } else {
    console.log(`✅ Data:`, data);
  }
}

check();

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf-8');
    return content.split('\n').reduce((acc, line) => {
      const [key, val] = line.split('=');
      if (key && val) acc[key.trim()] = val.trim().replace(/^["']|["']$/g, '');
      return acc;
    }, {});
  } catch (e) {
    return {};
  }
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

const tablesToCheck = [
  'profiles',
  'surahs',           // Existing core
  'moments',          // Social
  'vocab_lessons',    // Education
  'iqra_progress',    // NEW (Proposed)
  'official_mosques', // NEW (Proposed)
  'halal_directory',  // NEW (Proposed)
  'fatwa_knowledge_base' // NEW (Proposed)
];

console.log(`🕵️ Checking Supabase at: ${url}`);
console.log("---------------------------------------------------");

async function checkTables() {
  for (const table of tablesToCheck) {
    // We try to select 0 rows just to check if table exists/is accessible
    const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
    
    if (!error) {
      console.log(`✅  [${table}] \t EXISTS`);
    } else {
      // 404/42P01 usually means missing, but RLS might return 401/403.
      // However, usually API returns 404 for 'relation does not exist' if it's really missing.
      // Or 'PGRST200' (Relation not found).
      if (error.code === 'PGRST200' || error.message.includes('does not exist')) {
         console.log(`❌  [${table}] \t MISSING`);
      } else {
         console.log(`⚠️  [${table}] \t EXISTS but Restricted (${error.message})`);
      }
    }
  }
  console.log("---------------------------------------------------");
}

checkTables();

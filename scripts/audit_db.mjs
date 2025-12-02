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

async function auditProjectData() {
  console.log('📊 Starting Project Data Audit...');
  console.log(`Target: ${supabaseUrl}`);
  console.log('--------------------------------');

  const tablesToCheck = [
    'surahs',
    'ayahs',
    'translations',
    'profiles',
    'vocab_lessons',
    'user_vocab_progress',
    'moments',
    'moment_likes',
    'bookmarks'
  ];

  const results = {};

  for (const table of tablesToCheck) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
        // If table doesn't exist, error code is usually 404 or specific PG error
        results[table] = { status: 'ERROR', message: error.message, code: error.code };
    } else {
        results[table] = { status: 'OK', count: count };
    }
  }

  console.table(results);

  // Specific Data Integrity Checks
  console.log('\n🔍 Deep Dive Integrity Checks:');
  
  // 1. Check for Surah Completeness (114)
  if (results['surahs'].count === 114) {
      console.log('✅ Surahs: 114/114 (Complete)');
  } else {
      console.log(`❌ Surahs: ${results['surahs'].count}/114 (Incomplete)`);
  }

  // 2. Check for Ayah Completeness (6236)
  if (results['ayahs'].count === 6236) {
      console.log('✅ Ayahs: 6236/6236 (Complete)');
  } else {
      console.log(`❌ Ayahs: ${results['ayahs'].count}/6236 (Incomplete)`);
  }

  // 3. Check Vocab Lessons (Should have seed data)
  if (results['vocab_lessons'].count > 0) {
      console.log(`✅ Vocab Lessons: ${results['vocab_lessons'].count} found`);
  } else {
      console.log('⚠️ Vocab Lessons: 0 found (Seed data missing?)');
  }

    // 4. Check Moments (Should be empty or have test data)
  if (results['moments'].count >= 0) {
      console.log(`ℹ️ Moments: ${results['moments'].count} posts`);
  }

  console.log('--------------------------------');
  console.log('Audit Completed.');
}

auditProjectData();

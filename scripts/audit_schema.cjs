const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env manually
const envPath = path.resolve(__dirname, '../.env');
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.log("Could not read .env file, using process.env");
}

const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        if (key) env[key] = val;
    }
});

const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL || process.env.SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(url, key);

// Expected tables from Active Migrations
const CORE_TABLES = [
    'profiles', 'families', 'user_settings', 'audit_logs'
];

const QURAN_TABLES = [
    'surahs', 'ayahs', 'translations', 'reading_history', 'bookmarks'
];

const IQRA_TABLES = [
    'iqra_progress', 'vocab_lessons', 'user_vocab_progress'
];

const STATIC_CONTENT_TABLES = [
    'static_tajweed_rules', 'static_makhraj_points', 'static_doa',
    'static_islamic_faq', 'static_hadith', 'static_surah_metadata',
    'ai_response_cache', 'user_mastery', 'voice_fingerprints', 'asr_audit_log'
];

const COMMUNICATION_TABLES = [
    'whatsapp_messages', 'broadcast_logs'
];

const OTHER_ACTIVE_TABLES = [
    'official_mosques', 'prayer_logs', 'ai_knowledge_cache'
];

// Archived/Optional (Might exist if not dropped, but logic might not use them)
const OPTIONAL_TABLES = [
    'zakat_records', 'zakat_settings', 'crm_contacts', 'whatsapp_templates',
    'broadcast_campaigns', 'scheduled_messages', 'pending_bot_links', 'bot_interactions',
    'masjid_events', 'masjid_funds', 'transactions', 'iqra_exercises', 'user_srs_data', 'gamification_logs'
];

const ALL_EXPECTED = [
    ...CORE_TABLES, ...QURAN_TABLES, ...IQRA_TABLES,
    ...STATIC_CONTENT_TABLES, ...COMMUNICATION_TABLES, ...OTHER_ACTIVE_TABLES
];

async function main() {
    console.log(`\n=== FULL SCHEMA AUDIT ===`);
    console.log(`Target: ${url}`);

    // Fetch actual tables
    // RPC call to get table names? Or use PostgREST on information_schema (might be blocked)
    // Try accessing a known table. If RLS blocks, we might not get data, but valid response?
    // Anonymous key cannot query information_schema usually.
    // But we can try RPC if defined?
    // Or just try `select count` on each table?

    // We will probe each table individually since we don't have service role key to query metadata easily.

    const results = {
        found: [],
        missing: [],
        optional_found: [],
        optional_missing: []
    };

    console.log(`\nChecking Core & Active Tables...`);
    for (const table of ALL_EXPECTED) {
        const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        // Error code 42P01: relation does not exist
        if (error && error.code === '42P01') {
            results.missing.push(table);
            process.stdout.write('❌ ');
        } else if (error) {
            // Permission error or other? Assume exists if permission denied (42501)
            if (error.code === '42501') {
                results.found.push(`${table} (Protected)`);
                process.stdout.write('🔒 ');
            } else {
                console.log(`\n[ERR] ${table}: ${error.message} (${error.code})`);
                results.missing.push(table); // Treat unknown error as potential missing/broken
            }
        } else {
            results.found.push(table);
            process.stdout.write('✅ ');
        }
    }

    console.log(`\n\nChecking Optional/Archived Tables...`);
    for (const table of OPTIONAL_TABLES) {
        const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (!error || error.code === '42501') {
            results.optional_found.push(table);
            process.stdout.write('⚠️ ');
        } else {
            // 42P01
            results.optional_missing.push(table);
            process.stdout.write('⚪ ');
        }
    }

    console.log('\n\n-----------------------------');
    console.log(`✅  FOUND (${results.found.length}/${ALL_EXPECTED.length}):`);
    console.log(results.found.join(', '));

    if (results.missing.length > 0) {
        console.log(`\n❌  MISSING ACTIVE TABLES (${results.missing.length}):`);
        console.log(results.missing.join(', '));
    } else {
        console.log(`\n✨  ALL ACTIVE TABLES PRESENT`);
    }

    if (results.optional_found.length > 0) {
        console.log(`\n⚠️  ARCHIVED TABLES IN DB (${results.optional_found.length}):`);
        console.log(results.optional_found.join(', '));
    }
}

main();

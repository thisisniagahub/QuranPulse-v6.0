const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env manually
const envPath = path.resolve(__dirname, '../.env');
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error("Could not read .env file");
    process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, ''); // Remove quotes
        if (key) env[key] = val;
    }
});

const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("Missing credentials in .env");
    process.exit(1);
}

const supabase = createClient(url, key);

const TABLES = [
    'static_tajweed_rules',
    'static_makhraj_points',
    'static_doa',
    'static_islamic_faq',
    'static_hadith',
    'ai_response_cache'
];

async function main() {
    console.log(`\n=== SUPABASE AUDIT REPORT ===`);
    console.log(`Target: ${url}`);
    console.log(`-----------------------------`);

    let allPass = true;
    for (const table of TABLES) {
        const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`[FAIL] ${table}: ${error.message} (Code: ${error.code})`);
            allPass = false;
        } else {
            const status = count > 0 ? '[PASS]' : '[WARN]';
            console.log(`${status} ${table.padEnd(25)}: ${count} rows`);
            if (count === 0) allPass = false;
        }
    }
    console.log(`-----------------------------`);
    if (allPass) console.log("Audit Result: SUCCESS ✅");
    else console.log("Audit Result: ISSUES DETECTED ⚠️");
}

main();

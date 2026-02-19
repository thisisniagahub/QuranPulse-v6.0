
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Manually Load .env (since dotenv is not installed/guaranteed)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');

console.log(`📂 Loading .env from: ${envPath}`);

if (fs.existsSync(envPath)) {
    // Try reading as UTF-16LE first (common on Windows PowerShell created files)
    let envConfig = fs.readFileSync(envPath, 'utf16le');

    // Heuristic: If it looks like garbage (lots of nulls or weird chars), try UTF-8
    if (!envConfig.includes('VITE_')) {
        console.log("⚠️ UTF-16LE read failed or empty, trying UTF-8...");
        envConfig = fs.readFileSync(envPath, 'utf-8');
    }

    envConfig.split('\n').forEach((line) => {
        // Clean up BOM and whitespace
        const cleanLine = line.replace(/^\uFEFF/, '').trim();
        const [key, ...valParts] = cleanLine.split('=');
        if (key && valParts.length > 0) {
            const val = valParts.join('=').trim();
            process.env[key.trim()] = val;
        }
    });
    console.log("✅ Environment variables loaded.");
} else {
    console.error("❌ .env file not found!");
    process.exit(1);
}

// Since we are in scripts/ and lib is in src/lib, we need to handle ts alias or relative paths.
import { supabase, checkSupabaseConnection } from '../src/lib/supabase';
import axios from 'axios';

async function runTest() {
    console.log("📡 Testing Supabase Connection...");

    // Check URL validity (sanity check)
    const url = process.env.VITE_SUPABASE_URL;
    if (!url) {
        console.error("❌ VITE_SUPABASE_URL is missing in .env");
        return;
    }
    console.log(`🎯 Target: ${url.substring(0, 15)}...`);

    // AXIOS CHECK
    try {
        console.log("⏳ Pinging via Axios (HTTP/1.1)...");
        // Supabase REST endpoint often returns 404 on root, but if we get a response, we are connected.
        // We can try key validation endpoint if documented, but root is enough for connectivity.
        await axios.get(url + '/rest/v1/', {
            headers: { 'apikey': process.env.VITE_SUPABASE_ANON_KEY }
        });
        console.log("✅ Axios Connection: SUCCESS (HTTP Layer working)");
    } catch (e: any) {
        if (e.response) {
            console.log(`✅ Axios Connection: SUCCESS (Reached Server, Status ${e.response.status})`);
        } else {
            console.error(`❌ Axios Connection: FAILED. (${e.message})`);
        }
    }

    // Run Check with Supabase Client (`fetch`)
    console.log("⏳ Pinging database...");
    const { error: pingError } = await supabase.from('surahs').select('number').limit(1);

    if (!pingError) {
        console.log("✅ SUCCESSFULLY CONNECTED to Supabase!");

        // Extra info
        const { count, error } = await supabase.from('surahs').select('*', { count: 'exact', head: true });
        if (!error) {
            console.log(`📊 Validated Data Access: Found ${count} Surahs.`);
        }
    } else {
        console.error("❌ FAILED to connect to Supabase.");
        console.error(`   Error Message: ${pingError.message}`);
        console.error(`   Error Code: ${pingError.code}`);
        console.log("   Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    }
}

runTest();

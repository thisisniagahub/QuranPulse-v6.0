import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env manual
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf-8');
            envConfig.split('\n').forEach((line) => {
                const [key, value] = line.split('=');
                if (key && value) process.env[key.trim()] = value.trim();
            });
        }
    } catch (e) {}
}
loadEnv();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '', 
    process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function testConnection() {
    console.log("🔌 MENGUJI SAMBUNGAN SUPABASE...");
    console.log(`Target: ${process.env.VITE_SUPABASE_URL}`);

    // UJIAN 1: BACA DATA AWAM (Surahs)
    // RLS Policy: "Public Read: Surahs" ON public.surahs FOR SELECT USING (true);
    const { data: publicData, error: publicError } = await supabase
        .from('surahs')
        .select('name_simple')
        .limit(3);

    if (publicError) {
        console.error("❌ GAGAL SAMBUNG (Public):", publicError.message);
        console.error("   -> Kemungkinan URL/Key salah atau database offline.");
    } else {
        console.log("✅ BERJAYA SAMBUNG (Public Data):");
        console.log("   -> Data Surah:", publicData.length > 0 ? publicData : "Table kosong (tapi connect!)");
    }

    // UJIAN 2: BACA DATA PERIBADI (Profiles) TANPA LOGIN
    // RLS Policy: "Users view own profile" (auth.uid() = id)
    const { data: privateData, error: privateError } = await supabase
        .from('profiles')
        .select('*')
        .limit(3);

    if (privateError) {
        console.log("⚠️  RLS BLOCKED (Jangkaan):", privateError.message);
    } else {
        console.log("🔒 UJIAN RLS (Private Data):");
        console.log("   -> Result:", privateData.length === 0 ? "✅ Array Kosong (RLS Berfungsi - Data terlindung)" : "❌ Data Bocor! (RLS tak set)");
    }
}

testConnection();

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env manually if running locally via node
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bomjkgyrkvuivqodzqzf.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
    console.error("❌ Please set VITE_SUPABASE_ANON_KEY environment variable.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedHadiths() {
    try {
        const filePath = path.join(__dirname, '../../myhadith_bukhari_parsed.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const hadiths = JSON.parse(rawData);

        console.log(`📖 Found ${hadiths.length} hadiths to seed...`);

        const formattedData = hadiths.map((h: any) => ({
            collection_name: h.source || 'Sahih Al-Bukhari',
            hadith_number: h.number,
            title: h.title,
            content_arabic: h.arabic,
            content_translation: h.translation,
            grade: 'Sahih'
        }));

        const { error } = await supabase.from('hadiths').upsert(formattedData, { 
            onConflict: 'collection_name,hadith_number' 
        });

        if (error) throw error;

        console.log("✅ Successfully seeded hadiths!");

    } catch (e) {
        console.error("❌ Seeding failed:", e);
    }
}

seedHadiths();

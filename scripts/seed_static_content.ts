/**
 * Seed Static Content Script
 * Run this once to populate database with pre-generated content
 * 
 * Usage: npx tsx scripts/seed_static_content.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load env
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_DIR = path.join(__dirname, '../supabase/seed');

interface SeedConfig {
    file: string;
    table: string;
    idColumn: string;
}

const SEED_CONFIGS: SeedConfig[] = [
    { file: 'tajweed_rules.json', table: 'static_tajweed_rules', idColumn: 'rule_id' },
    { file: 'makhraj_points.json', table: 'static_makhraj_points', idColumn: 'point_id' },
    { file: 'common_doa.json', table: 'static_doa', idColumn: 'doa_id' },
    { file: 'islamic_faq.json', table: 'static_islamic_faq', idColumn: 'faq_id' },
    { file: 'hadith_collection.json', table: 'static_hadith', idColumn: 'hadith_id' },
];

async function seedTable(config: SeedConfig): Promise<void> {
    const filePath = path.join(SEED_DIR, config.file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Skipping ${config.file} - file not found`);
        return;
    }

    console.log(`📥 Seeding ${config.table}...`);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Upsert data (insert or update on conflict)
    const { data: result, error } = await supabase
        .from(config.table)
        .upsert(data, { onConflict: config.idColumn })
        .select();

    if (error) {
        console.error(`❌ Error seeding ${config.table}:`, error.message);
        return;
    }

    console.log(`✅ ${config.table}: ${result?.length || 0} records`);
}

async function runMigration(): Promise<void> {
    console.log('🗄️ Running migration...');

    const migrationPath = path.join(__dirname, '../supabase/migrations/20260107_static_content_tables.sql');

    if (!fs.existsSync(migrationPath)) {
        console.log('⚠️ Migration file not found, skipping...');
        return;
    }

    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Execute migration via RPC or direct SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        // Try alternative: split and execute statements individually
        console.log('⚠️ RPC not available, migration should be run via Supabase Dashboard');
    } else {
        console.log('✅ Migration completed');
    }
}

async function main(): Promise<void> {
    console.log('🌱 QuranPulse Static Content Seeder');
    console.log('===================================\n');

    // Note: Migration should be run via Supabase Dashboard or CLI
    console.log('📋 Note: Run migration first via Supabase Dashboard');
    console.log('   Or use: npx supabase db push\n');

    // Seed all tables
    for (const config of SEED_CONFIGS) {
        await seedTable(config);
    }

    console.log('\n✨ Seeding complete!');
    console.log('\n📊 Summary:');

    // Count records
    for (const config of SEED_CONFIGS) {
        const { count } = await supabase
            .from(config.table)
            .select('*', { count: 'exact', head: true });
        console.log(`   ${config.table}: ${count || 0} records`);
    }
}

main().catch(console.error);

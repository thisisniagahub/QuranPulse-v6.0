/**
 * Generate Seed SQL Migration
 * Converts JSON seed files into a SQL migration file for deployment via db push
 */

import * as fs from 'fs';
import * as path from 'path';

const SEED_DIR = path.join(__dirname, '../supabase/seed');
const MIGRATION_DIR = path.join(__dirname, '../supabase/migrations');
// Target migration file: timestamp + name
const TIMESTAMP = '20260107020000';
const OUTPUT_FILE = path.join(MIGRATION_DIR, `${TIMESTAMP}_seed_static_content.sql`);

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

function escapeSql(value: any): string {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
    // String escaping: replace ' with ''
    return `'${value.toString().replace(/'/g, "''")}'`;
}

async function generateSql() {
    let sql = `-- Seed Data for Static Content\n-- Generated automatically from JSON seed files\n\n`;

    for (const config of SEED_CONFIGS) {
        const filePath = path.join(SEED_DIR, config.file);
        if (!fs.existsSync(filePath)) {
            console.warn(`JSON file not found: ${config.file}`);
            continue;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (!Array.isArray(data) || data.length === 0) continue;

        console.log(`Processing ${config.table} (${data.length} records)...`);

        // Get columns from first record
        const columns = Object.keys(data[0]);

        sql += `-- Data for ${config.table}\n`;

        // Generate INSERT statements
        // We do bulk insert if possible, or individual upserts
        // Using ON CONFLICT DO UPDATE to make it idempotent

        for (const record of data) {
            const values = columns.map(col => escapeSql(record[col]));
            const updateSet = columns
                .filter(col => col !== 'id' && col !== config.idColumn)
                .map(col => `"${col}" = EXCLUDED."${col}"`)
                .join(', ');

            const colsQuoted = columns.map(c => `"${c}"`).join(', ');

            sql += `INSERT INTO ${config.table} (${colsQuoted}) VALUES (${values.join(', ')})\n`;
            sql += `ON CONFLICT (${config.idColumn}) DO UPDATE SET ${updateSet};\n`;
        }
        sql += '\n';
    }

    fs.writeFileSync(OUTPUT_FILE, sql);
    console.log(`\n✅ Generated migration file: ${OUTPUT_FILE}`);
}

generateSql().catch(console.error);

const fs = require('fs');
const path = require('path');

const SEED_DIR = path.join(process.cwd(), 'supabase/seed');
const MIGRATION_DIR = path.join(process.cwd(), 'supabase/migrations');
const TIMESTAMP = '20260107020000';
const OUTPUT_FILE = path.join(MIGRATION_DIR, `${TIMESTAMP}_seed_static_content.sql`);

const SEED_CONFIGS = [
    { file: 'tajweed_rules.json', table: 'static_tajweed_rules', idColumn: 'rule_id' },
    { file: 'makhraj_points.json', table: 'static_makhraj_points', idColumn: 'point_id' },
    { file: 'common_doa.json', table: 'static_doa', idColumn: 'doa_id' },
    { file: 'islamic_faq.json', table: 'static_islamic_faq', idColumn: 'faq_id' },
    { file: 'hadith_collection.json', table: 'static_hadith', idColumn: 'hadith_id' },
];

function escapeSql(value) {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
    return `'${value.toString().replace(/'/g, "''")}'`;
}

function generateSql() {
    console.log('Generating seed SQL...');
    let sql = `-- Seed Data for Static Content\n-- Generated automatically\n\n`;

    for (const config of SEED_CONFIGS) {
        const filePath = path.join(SEED_DIR, config.file);
        if (!fs.existsSync(filePath)) {
            console.warn(`Skipping ${config.file} (not found)`);
            continue;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(content);

            if (!Array.isArray(data) || data.length === 0) continue;

            console.log(`Processing ${config.table} (${data.length} records)`);

            const columns = Object.keys(data[0]);

            sql += `-- Data for ${config.table}\n`;

            for (const record of data) {
                const values = columns.map(col => escapeSql(record[col]));
                const updateSet = columns
                    .filter(col => col !== 'id' && col !== config.idColumn)
                    .map(col => `"${col}" = EXCLUDED."${col}"`)
                    .join(', ');

                const colsQuoted = columns.map(c => `"${c}"`).join(', ');

                sql += `INSERT INTO ${config.table} (${colsQuoted}) VALUES (${values.join(', ')})\n`;
                sql += `ON CONFLICT (${config.idColumn}) DO UPDATE SET ${updateSet};\n\n`;
            }
        } catch (e) {
            console.error(`Error processing ${config.file}:`, e.message);
        }
    }

    try {
        fs.writeFileSync(OUTPUT_FILE, sql);
        console.log(`\n✅ Generated: ${OUTPUT_FILE}`);
    } catch (e) {
        console.error('Error writing output:', e.message);
    }
}

generateSql();

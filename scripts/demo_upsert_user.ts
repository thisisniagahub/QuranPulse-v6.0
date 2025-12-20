import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf-8');
            envConfig.split('\n').forEach((line) => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
        }
    } catch (e) {}
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDemo() {
  console.log('🚀 Supabase User Data Upsert Demo');

  // 1. Auth Check (Mocking ID for demonstration since we are in Node)
  // We'll use a dummy UUID. In production, this would be session.user.id.
  const userId = '00000000-0000-0000-0000-000000000000'; 

  // 2. Specify Valid Fields to Update (Based on Schema Discovery)
  const updates = {
    id: userId,
    email: 'demo@example.com',
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    updated_at: new Date().toISOString(),
  };

  console.log(`📝 Upserting data for User ID: ${userId}`);
  console.table(updates);

  // 3. Upsert User Data
  // Using 'id' as primary key for conflict resolution
  const { data, error } = await supabase
    .from('profiles')
    .upsert(updates, { 
        onConflict: 'id'
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Upsert Failed:', error.message);
    if (error.code === '42501') {
        console.error('   Hint: RLS Policy Violation. Please sign in or enable public access for this test.');
    }
  } else {
    console.log('✅ Upsert Success!');
    console.log('🔍 Verified Record:', data);
  }
}

runDemo().catch(console.error);
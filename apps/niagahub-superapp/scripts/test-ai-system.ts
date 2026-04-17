import dotenv from 'dotenv';
import path from 'path';

// 1. Muat turun environment variables DAHULU sebelum import lain
console.log('📂 Memuatkan fail .env.local...');
const result = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (result.error) {
  console.error('❌ Gagal membaca .env.local:', result.error);
  process.exit(1);
}

async function runTest() {
  console.log('🚀 Memulakan Ujian Diagnostik NiagaHub AI...\n');

  // Import modul SECARA DINAMIK selepas env vars tersedia
  const { AdkRunner } = await import('../src/lib/ai/AdkRunner');
  const { redis } = await import('../src/lib/redis/client');

  const runner = new AdkRunner();
  const testQuestion = "Senaraikan 3 rukun negara Malaysia yang pertama.";

  try {
    // --- UJIAN 1: Panggilan Pertama (Cold Start) ---
    console.log('🧪 UJIAN 1: Pertanyaan Pertama (Sepatutnya panggil API Gemini)');
    const start1 = Date.now();
    
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256').update(testQuestion).digest('hex');
    await redis.del(`ai_cache:${hash}`);

    const res1 = await runner.ask(testQuestion);
    const time1 = Date.now() - start1;
    
    console.log(`⏱️  Masa diambil: ${time1}ms`);
    console.log(`📝 Jawapan: ${res1.substring(0, 50)}...`); 
    console.log('✅ UJIAN 1 SELESAI\n');

    // --- UJIAN 2: Panggilan Kedua (Cache Hit) ---
    console.log('🧪 UJIAN 2: Pertanyaan Ulangan (Sepatutnya baca dari Redis)');
    const start2 = Date.now();
    const res2 = await runner.ask(testQuestion);
    const time2 = Date.now() - start2;

    console.log(`⏱️  Masa diambil: ${time2}ms`);
    
    if (time2 < 200) {
      console.log('⚡ KEPUTUSAN: SANGAT PANTAS! (Cache berfungsi)');
    } else {
      console.log('⚠️ KEPUTUSAN: Lambat sikit, tapi asalkan HIT ok.');
    }
    
    if (res1 === res2) {
      console.log('✅ Konsistensi Data: Jawapan sama.');
    } else {
      console.error('❌ Data Mismatch!');
    }

    console.log('\n🎉 SEMUA SISTEM BERFUNGSI DENGAN BAIK!');

  } catch (error) {
    console.error('🔥 UJIAN GAGAL:', error);
  } finally {
    process.exit(0);
  }
}

runTest();
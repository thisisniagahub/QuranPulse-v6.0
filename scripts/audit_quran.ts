

// Scripts/audit_quran.ts
import { getAllChapters, getVerses, getChapterAudio } from '../src/services/quranService';

// Simple polyfill for performance.now() if missing
const now = () => performance.now();

console.log("\n🔍 STARTING QURAN COMPONENT AUDIT...\n");

async function runAudit() {
  const results = {
    integration: false,
    accuracy: { text: false, transliteration: false, audio: false },
    performance: { fatiha: 0, yasin: 0 }
  };

  try {
    // 1. Check Integration (Chapters)
    console.log("--- 1. Checking Integration (Chapters) ---");
    const chapters = await getAllChapters();
    if (chapters.length > 0) {
      console.log(`✅ Success: Retrieved ${chapters.length} chapters.`);
      results.integration = true;
    } else {
      console.error("❌ Failed: No chapters returned.");
    }

    // 2. Check Performance & Accuracy (Al-Fatiha)
    console.log("\n--- 2. Checking Performance & Accuracy (Al-Fatiha) ---");
    const start1 = now();
    const verses1 = await getVerses(1);
    const end1 = now();
    results.performance.fatiha = end1 - start1;

    console.log(`⏱️ Al-Fatiha Load Time: ${results.performance.fatiha.toFixed(2)}ms`);

    if (verses1.length === 7) {
      const v1 = verses1[0];
      console.log(`📝 Sample Verse: ${v1.text_uthmani}`);
      console.log(`🔤 Transliteration: ${v1.transliteration?.text || 'N/A'}`);
      
      if (v1.text_uthmani) results.accuracy.text = true;
      if (v1.transliteration?.text) results.accuracy.transliteration = true;
    } else {
      console.error("❌ Failed: Expected 7 verses for Al-Fatiha");
    }

    // 3. Check Audio Integration
    console.log("\n--- 3. Checking Audio Data ---");
    const audioMap = await getChapterAudio(1);
    const audioKeys = Object.keys(audioMap);
    if (audioKeys.length > 0) {
      console.log(`✅ Audio Found for ${audioKeys.length} verses.`);
      console.log(`🎵 Sample URL: ${audioMap['1:1']}`);
      results.accuracy.audio = true;
    } else {
      console.warn("⚠️ No audio data found (API might be restricted or offline).");
    }

    // 4. Stress Test (Surah Al-Baqarah)
    console.log("\n--- 4. Stress Test (Al-Baqarah - 286 Verses) ---");
    const start2 = now();
    // Use try-catch for stress test
    try {
        const verses2 = await getVerses(2);
        const end2 = now();
        results.performance.yasin = end2 - start2; // storing in yasin slot for summary
        console.log(`⏱️ Al-Baqarah Load Time: ${results.performance.yasin.toFixed(2)}ms`);
        console.log(`✅ Loaded ${verses2.length} verses.`);
    } catch (e) {
        console.error("❌ Stress Test Failed:", e.message);
    }

    // SUMMARY
    console.log("\n===========================================");
    console.log("📊 AUDIT SUMMARY");
    console.log("===========================================");
    console.log(`Integration:   ${results.integration ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Accuracy:      Text: ${results.accuracy.text ? '✅' : '❌'} | Translit: ${results.accuracy.transliteration ? '✅' : '❌'} | Audio: ${results.accuracy.audio ? '✅' : '❌'}`);
    console.log(`Performance:   Fatiha: ${results.performance.fatiha.toFixed(0)}ms | Baqarah: ${results.performance.yasin.toFixed(0)}ms`);
    
    if (results.performance.fatiha > 1500) console.warn("⚠️ Performance Warning: Basic load is slow (>1.5s)");
    if (results.performance.yasin > 5000) console.warn("⚠️ Performance Warning: Large Surah load is slow (>5s)");

  } catch (err) {
    console.error("\n❌ FATAL ERROR DURING AUDIT:", err);
  }
}

runAudit();

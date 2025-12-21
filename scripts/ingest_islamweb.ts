import axios from 'axios';
import * as cheerio from 'cheerio';
import { GroqClient } from '../src/services/ai/GroqClient.ts';
import './env-loader.ts'; // Load env vars

// Mock Database Insert (Replace with actual Supabase insert)
const mockDBInsert = (data: any) => {
    console.log("\n💾 [MOCK DB] Saving to 'external_knowledge' table:");
    console.log(JSON.stringify(data, null, 2));
};

async function ingestFatwa(url: string) {
    console.log(`🔍 [Crawler] Visiting: ${url}`);
    
    try {
        // 1. Fetch HTML
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // 2. Extract Data (Selectors specific to Islamweb - Hypothetical for demo)
        const titleAr = $('h1.title').text().trim() || "Fatwa Title (Arabic)";
        const questionAr = $('.question-box').text().trim() || "Question text...";
        const answerAr = $('.answer-box').text().trim() || "Answer text...";

        console.log(`✅ [Parser] Extracted: "${titleAr}"`);

        // 3. AI Transformation (Translate to Malay)
        console.log("🧠 [AI] Translating content...");
        
        const prompt = [
            { role: 'system', content: 'You are a translator. Translate this Arabic Islamic text to Malay. Keep Islamic terms accurate.' },
            { role: 'user', content: `TITLE: ${titleAr}\n\nQ: ${questionAr}\n\nA: ${answerAr}` }
        ];

        // Using Groq for fast translation
        // Note: In real prod, use Gemini Flash for better context window/cost
        let translatedText = "";
        try {
            translatedText = await GroqClient.callGroq(prompt as any);
        } catch (e) {
            console.warn("⚠️ AI Translation failed (Check API Key). Using mock.");
            translatedText = "[AI TRANSLATION RESULT]\nTajuk: ...\nSoalan: ...\nJawapan: ...";
        }

        // 4. Save
        const record = {
            source_url: url,
            source_domain: 'islamweb.net',
            original_title: titleAr,
            content_ar: answerAr,
            content_ms: translatedText,
            category: 'fiqh', // This could also be classified by AI
            ingested_at: new Date().toISOString()
        };

        mockDBInsert(record);

    } catch (error) {
        console.error("❌ Ingestion Failed:", error);
    }
}

// Run Demo
const SAMPLE_FATWA_URL = "https://www.islamweb.net/ar/fatwa/12345/"; // Example
console.log("🚀 Starting Ingestion Pipeline Demo...");
ingestFatwa(SAMPLE_FATWA_URL);

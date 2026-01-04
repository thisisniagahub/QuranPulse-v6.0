import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const apiKey = process.env.GOOGLE_API_KEYS?.split(',')[0]; // Ambil key pertama
  
  if (!apiKey) {
    console.error('Tiada API Key dijumpai.');
    return;
  }

  console.log('🔍 Menyemak model yang tersedia untuk API Key anda...');
  
  try {
    // Kita guna pengurusan model untuk senaraikan apa yang ada
    // Note: GoogleGenerativeAI class utama tak ada listModels direct, 
    // kita kena guna GoogleAIFileManager atau cuba request raw jika SDK tak support direct listing mudah.
    // Tapi SDK v0.1.3+ ada getGenerativeModel. 
    
    // Mari kita cuba cara direct fetch sebab SDK kadang abstract benda ni.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.models) {
      console.log('✅ Model yang ditemui:');
      data.models.forEach((m: any) => {
        console.log(` - ${m.name.replace('models/', '')} (${m.description.substring(0, 50)}...)`);
      });
    } else {
      console.log('⚠️ Tiada model disenaraikan. Response:', data);
    }

  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();

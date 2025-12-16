import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY || process.env.GLM_API_KEY; // Fallback to available keys if GEMINI specific is missing, usually we need GOOGLE_API_KEY
// Note: For actual Google Gen AI SDK, we need a Google API Key. 
// If bos uses OpenRouter, we need to use OpenAI compatible endpoint.
// Let's assume standard Google AI for this script pattern first.

// Placeholder Key for script structure (User needs to replace or ensure .env has GOOGLE_API_KEY)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "YOUR_GOOGLE_API_KEY"; 

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

async function digitizeIqraPage(imagePath) {
  console.log(`👁️ Scanning Iqra Page: ${imagePath}...`);

  try {
    // For Node.js, we need to read the file and convert to base64
    const imageFile = fs.readFileSync(imagePath);
    const imageBase64 = imageFile.toString('base64');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this image of an Iqra learning page (Arabic alphabet).
      I need to digitize it into interactive segments.
      
      Identify every individual Arabic letter or word block on this page.
      For each item found, provide:
      1. "arabic": The Arabic character text.
      2. "transliteration": The pronunciation (e.g., "Ba", "Ta").
      3. "box_2d": The bounding box coordinates [ymin, xmin, ymax, xmax] relative to the image size (0-1000 scale).

      Return the result strictly as a JSON array of objects.
      Example: [{"arabic": "بَ", "transliteration": "Ba", "box_2d": [100, 200, 150, 250]}]
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up JSON markdown block if present
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(jsonString);
    
    console.log(`✅ Success! Found ${data.length} segments.`);
    
    // Save to file
    const outputPath = imagePath.replace('.jpg', '.json').replace('.png', '.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Saved metadata to: ${outputPath}`);

  } catch (error) {
    console.error("❌ Error digitizing page:", error);
  }
}

// Example usage:
// digitizeIqraPage('public/iqra-sample/page1.jpg');
console.log("Script ready. Please provide an image path to run.");

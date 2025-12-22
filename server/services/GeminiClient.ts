
import axios from 'axios';
import { geminiRotator } from './MultiKeyRotator';
import { ChatMessage } from './GroqClient'; // Reuse interface

/**
 * DIRECT Gemini Client (Server Side)
 */
export async function callGeminiDirect(messages: ChatMessage[]): Promise<string> {
  return geminiRotator.executeWithRetry(async (apiKey) => {
    console.log("📡 Calling Gemini 2.0 Flash (Server Side)...");

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(GEMINI_URL, {
      contents: formattedContents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      }
    });

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tiada jawapan.";
  });
}

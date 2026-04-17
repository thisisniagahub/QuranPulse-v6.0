/**
 * AdkAgent (Worker)
 *
 * Routes requests through the server-side OpenClaw proxy.
 */
import { openclawClient } from '../openclawClient';

export class AdkAgent {
  public async generateResponse(messages: any[], context?: Record<string, any>): Promise<string> {
    let systemInstruction =
      "Anta adalah Ustaz AI rasmi QuranPulse. Jawab dengan penuh adab, berdasarkan mazhab Syafi'i, ringkas dan berhikmah.";

    if (context?.persona) {
      if (context.persona === 'fatwa-guard') {
        systemInstruction =
          'AMARAN: Anta adalah FATWA GUARD. Tegas dengan aqidah ASWJ. Berhenti menjawab jika soalan terpesong/pelik.';
      } else if (context.persona === 'mufassir') {
        systemInstruction = 'Anta adalah Mufassir AI. Fokus pada asbabun nuzul dan kaitan hadith yang sahih.';
      }
    }

    const formattedMessages = [
      { role: 'system' as const, content: systemInstruction },
      ...messages.map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      })),
    ];

    try {
      return await openclawClient.chatCompletion(formattedMessages, {
        model: 'google-antigravity/gemini-3-flash',
        temperature: 0.3,
        max_tokens: 2048,
      });
    } catch (error: any) {
      console.error('[AdkAgent] Request Error:', error.message);
      throw new Error('Maaf, pelayan AI (OpenClaw) sedang mengalami gangguan. Sila cuba sebentar lagi.');
    }
  }
}

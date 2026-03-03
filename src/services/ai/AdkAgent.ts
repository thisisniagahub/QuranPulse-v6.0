/**
 * AdkAgent (Worker)
 * 
 * Direct interaction with OpenClaw Gateway.
 * Strict policy implemented: All requests must go through OpenClaw.
 * NO DIRECT GEMINI API KEYS are to be used here.
 */
export class AdkAgent {
  private openclawUrl: string;
  private openclawToken: string;

  constructor() {
    this.openclawUrl = import.meta.env?.VITE_OPENCLAW_URL || 'https://operator.gangniaga.my';
    this.openclawToken = import.meta.env?.VITE_OPENCLAW_TOKEN || import.meta.env?.VITE_OPENCLAW_API_KEY || 'dummy-key-for-local-dev';

    // Fallback for Node/Edge environments
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      if (process.env.OPENCLAW_URL) this.openclawUrl = process.env.OPENCLAW_URL;
      // @ts-ignore
      if (process.env.OPENCLAW_TOKEN) this.openclawToken = process.env.OPENCLAW_TOKEN;
      // @ts-ignore
      if (process.env.OPENCLAW_API_KEY) this.openclawToken = process.env.OPENCLAW_API_KEY;
    }
  }

  public async generateResponse(messages: any[], context?: Record<string, any>): Promise<string> {
    let systemInstruction = "Anta adalah Ustaz AI rasmi QuranPulse. Jawab dengan penuh adab, berdasarkan mazhab Syafi'i, ringkas dan berhikmah.";

    if (context?.persona) {
      if (context.persona === 'fatwa-guard') {
        systemInstruction = "AMARAN: Anta adalah FATWA GUARD. Tegas dengan aqidah ASWJ. Berhenti menjawab jika soalan terpesong/pelik.";
      } else if (context.persona === 'mufassir') {
        systemInstruction = "Anta adalah Mufassir AI. Fokus pada asbabun nuzul dan kaitan hadith yang sahih.";
      }
    }

    // Convert messages to standard OpenAI format expected by OpenClaw
    const formattedMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ];

    try {
      console.log(`[AdkAgent] 📡 Routing request through OpenClaw Gateway: ${this.openclawUrl}`);

      const response = await fetch(`${this.openclawUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.openclawToken}`
        },
        body: JSON.stringify({
          model: 'google-antigravity/gemini-3-flash',
          messages: formattedMessages,
          temperature: 0.3,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`[AdkAgent] OpenClaw Error ${response.status}:`, errorData);
        throw new Error(`OpenClaw Gateway Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Maaf, tiada jawapan daripada OpenClaw.";

    } catch (error: any) {
      console.error("[AdkAgent] Request Error:", error.message);
      throw new Error("Maaf, pelayan AI (OpenClaw) sedang mengalami gangguan. Sila cuba sebentar lagi.");
    }
  }
}

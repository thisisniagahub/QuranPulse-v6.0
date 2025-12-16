import { ChatMessage } from './ollamaAiService';

const GEMINI_CLI_ENDPOINT = '/api/gemini-cli';

export class GeminiCliService {
    async checkStatus(): Promise<boolean> {
        // Simple ping to check if endpoint is responsive
        try {
            const res = await fetch(GEMINI_CLI_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: 'test connection' })
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    }

    private getSystemPrompt(persona: 'AZHAR' | 'AISHAH' | 'AIMAN' = 'AZHAR'): string {
        return `
Context: You are Ustaz AI in QuranPulse app.
Persona: ${persona} (AZHAR=Fiqh expert, AISHAH=Gentle mentor, AIMAN=Youth friend).
Language: Malay (Bahasa Melayu).
Task: Answer the following question accurately with Islamic references if needed.
`;
    }

    async chatWithUstaz(
        message: string,
        history: ChatMessage[] = [],
        persona: 'AZHAR' | 'AISHAH' | 'AIMAN' = 'AZHAR'
    ): Promise<string> {
        try {
            const systemPrompt = this.getSystemPrompt(persona);
            
            // Construct a single prompt block since CLI is stateless mostly
            // Or typically handles one shot well.
            const fullPrompt = `${systemPrompt}\n\nHistory:\n${history.map(h => `${h.role}: ${h.content}`).join('\n')}\n\nUser: ${message}\nAssistant:`;

            const response = await fetch(GEMINI_CLI_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: fullPrompt })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'CLI Error');
            }

            const data = await response.json();
            return data.text;

        } catch (error) {
            console.error("Gemini CLI Error:", error);
            throw new Error("Gagal menghubungi Gemini CLI. Sila pastikan anda sudah login 'gemini auth login' di terminal.");
        }
    }
}

export const geminiCliService = new GeminiCliService();

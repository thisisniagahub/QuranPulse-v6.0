# OpenClaw Complete Integration — Round 2 Prompt

You are a senior TypeScript/React engineer completing the OpenClaw gateway integration for QuranPulse. Round 1 already created `openclawClient.ts` and refactored `aiService.ts`. This round completes ALL remaining tasks: TTS, ASR, dead code cleanup, session memory, and gateway status UI. Follow each instruction precisely. Ensure `npx tsc --noEmit` passes after all changes.

---

## PHASE 1: Refactor VoiceService — Replace ElevenLabs with OpenClaw TTS (CRITICAL)

### Task 1.1: Rewrite `src/services/ai/VoiceService.ts`

This file currently imports `VITE_ELEVENLABS_API_KEY` and makes direct calls to `api.elevenlabs.io`. Replace the entire ElevenLabs integration with OpenClaw TTS via the gateway.

Replace the file contents with this (keep the browser TTS fallback logic):

```typescript
import { openclawClient } from '../openclawClient';

/**
 * Voice generation response types
 */
export interface VoiceGenerationResult {
    type: 'buffer' | 'browser_tts' | 'url';
    data?: ArrayBuffer;
    url?: string;
    text?: string;
    voice?: string;
}

export class VoiceService {
    /**
     * Generate Audio from Text - Hybrid Approach
     * 1. Try OpenClaw Gateway TTS (OpenAI gpt-4o-mini-tts via Codex OAuth)
     * 2. Fallback to Browser Web Speech API
     */
    static async generateVoice(text: string, voice?: string): Promise<VoiceGenerationResult | null> {
        // 1. Try OpenClaw TTS (routes to openai/gpt-4o-mini-tts on the server)
        try {
            const ttsResult = await this.callOpenClawTTS(text, voice);
            if (ttsResult) return ttsResult;
        } catch (err) {
            console.warn('⚠️ OpenClaw TTS failed, falling back to browser:', err);
        }

        // 2. Fallback to Browser TTS
        console.log('🔊 Using Browser TTS Fallback...');
        return this.prepareBrowserTTS(text);
    }

    /**
     * Call OpenClaw Gateway for TTS
     * The gateway routes to OpenAI gpt-4o-mini-tts via Codex OAuth.
     * Returns audio as ArrayBuffer.
     */
    private static async callOpenClawTTS(text: string, voice?: string): Promise<VoiceGenerationResult | null> {
        const OPENCLAW_URL = import.meta.env.VITE_OPENCLAW_URL || 'https://operator.gangniaga.my';
        const OPENCLAW_TOKEN = import.meta.env.VITE_OPENCLAW_TOKEN || '';

        try {
            console.log(`🎙️ Generating TTS via OpenClaw: ${text.substring(0, 30)}...`);

            const response = await fetch(`${OPENCLAW_URL}/v1/audio/speech`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini-tts',
                    input: text,
                    voice: voice || 'nova', // Best for Malay/Arabic
                    response_format: 'mp3',
                }),
                signal: AbortSignal.timeout(15000), // 15s timeout
            });

            if (!response.ok) {
                console.warn(`OpenClaw TTS returned ${response.status}`);
                return null;
            }

            const audioBuffer = await response.arrayBuffer();
            return { type: 'buffer', data: audioBuffer };
        } catch (error) {
            console.warn('⚠️ OpenClaw TTS request failed:', error);
            return null;
        }
    }

    /**
     * Prepare Browser TTS payload
     * Frontend will handle actual speech synthesis
     */
    private static prepareBrowserTTS(text: string): VoiceGenerationResult {
        const recommendedVoices = ['ms-MY', 'id-ID', 'en-GB', 'en-US'];
        return {
            type: 'browser_tts',
            text: text,
            voice: recommendedVoices[0],
        };
    }

    /**
     * Client-side helper: Speak using Web Speech API
     */
    static speakWithBrowser(text: string, lang: string = 'ms-MY'): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.speechSynthesis) {
                reject(new Error('Speech Synthesis not available'));
                return;
            }

            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);

            const voices = synth.getVoices();
            const preferredVoice = voices.find(v =>
                v.lang.startsWith('ms') ||
                v.lang.startsWith('id') ||
                v.name.toLowerCase().includes('malay')
            ) || voices.find(v => v.lang.startsWith('en'));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.lang = lang;
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onend = () => resolve();
            utterance.onerror = (e) => reject(e);

            synth.speak(utterance);
        });
    }

    /**
     * Get available browser voices
     */
    static getBrowserVoices(): SpeechSynthesisVoice[] {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            return [];
        }
        return window.speechSynthesis.getVoices();
    }

    /**
     * Check if premium TTS is available (OpenClaw gateway)
     */
    static isPremiumVoiceAvailable(): boolean {
        const token = import.meta.env.VITE_OPENCLAW_TOKEN;
        return !!token;
    }
}
```

**IMPORTANT**: Remove the `import axios from 'axios'` and `import { getEnv } from '../../utils/env'` imports completely. The new version only uses native `fetch` and `openclawClient`. Also remove any `VITE_ELEVENLABS_API_KEY` references.

---

## PHASE 2: Refactor ASRRecorder — Replace localhost Python with OpenClaw ASR

### Task 2.1: Update `src/modules/iqra/components/ASRRecorder.tsx`

Currently `sendToBackend` sends audio to `http://localhost:8000/analyze`. Replace this with the OpenClaw gateway's ASR endpoint.

Find the `sendToBackend` function and replace it:

```typescript
const sendToBackend = async (blob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const OPENCLAW_URL = import.meta.env.VITE_OPENCLAW_URL || 'https://operator.gangniaga.my';
      const OPENCLAW_TOKEN = import.meta.env.VITE_OPENCLAW_TOKEN || '';

      // Step 1: Transcribe audio via OpenClaw ASR (OpenAI gpt-4o-mini-transcribe)
      const formData = new FormData();
      formData.append('file', blob, 'recitation.webm');
      formData.append('model', 'gpt-4o-mini-transcribe');
      formData.append('language', 'ar'); // Arabic for Quran

      const transcribeRes = await fetch(`${OPENCLAW_URL}/v1/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
        },
        body: formData,
        signal: AbortSignal.timeout(30000), // 30s for audio processing
      });

      if (!transcribeRes.ok) throw new Error(`ASR error: ${transcribeRes.status}`);

      const transcription = await transcribeRes.json();
      const transcribedText = transcription.text || '';

      // Step 2: Compare with expected text and calculate confidence
      const confidence = calculateSimilarity(transcribedText, expectedText);
      const feedback = generateFeedback(transcribedText, expectedText, confidence);

      onResult(expectedText, confidence, feedback);

    } catch (err) {
      console.error('ASR Error:', err);
      setError('Sambungan gagal. Sila cuba lagi.');
      setTimeout(() => {
        onResult(expectedText, 0.5, 'Ralat sambungan server.');
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };
```

### Task 2.2: Add helper functions in ASRRecorder.tsx

Add these helper functions BEFORE the component definition (outside the component, at module level):

```typescript
/**
 * Calculate text similarity (Levenshtein-based normalized score)
 */
function calculateSimilarity(transcribed: string, expected: string): number {
  if (!transcribed || !expected) return 0;
  
  const a = transcribed.trim().toLowerCase();
  const b = expected.trim().toLowerCase();
  
  if (a === b) return 1.0;

  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;

  // Simple character overlap ratio
  const aChars = new Set(a.split(''));
  const bChars = new Set(b.split(''));
  let overlap = 0;
  for (const ch of aChars) {
    if (bChars.has(ch)) overlap++;
  }
  
  return Math.min(1.0, overlap / Math.max(aChars.size, bChars.size));
}

/**
 * Generate human-readable feedback based on similarity
 */
function generateFeedback(transcribed: string, expected: string, confidence: number): string {
  if (confidence >= 0.9) return '🟢 Sangat baik! Bacaan hampir sempurna.';
  if (confidence >= 0.7) return '🟡 Bagus, ada sedikit perbezaan. Teruskan latihan!';
  if (confidence >= 0.5) return '🟠 Perlu diperbaiki. Cuba perlahankan bacaan.';
  return '🔴 Cuba lagi. Pastikan sebutan huruf yang tepat.';
}
```

### Task 2.3: Remove `localhost:8000` reference

After replacing `sendToBackend`, verify there are NO remaining references to `localhost:8000` in the entire `src/` directory. If any are found, update them to use the OpenClaw gateway URL pattern.

---

## PHASE 3: Dead Code Cleanup

### Task 3.1: Remove `MultiKeyRotator.ts` exports that read VITE_ keys

In `src/services/ai/MultiKeyRotator.ts`, find these lines at the bottom:

```typescript
export const geminiRotator = new MultiKeyRotator('VITE_GEMINI_API_KEY');
export const groqRotator = new MultiKeyRotator('VITE_GROQ_API_KEY');
```

These are instances that read API keys from the browser environment — they MUST be removed or neutralized.

**Option A (preferred)**: If `geminiRotator` and `groqRotator` are no longer imported anywhere else in the codebase, DELETE these two export lines entirely.

**Option B**: If they are still imported somewhere, replace them with:

```typescript
// DEPRECATED: All AI calls now route through openclawClient.ts
// These rotators are kept for backward compatibility but do nothing
export const geminiRotator = new MultiKeyRotator('__DEPRECATED_GEMINI__');
export const groqRotator = new MultiKeyRotator('__DEPRECATED_GROQ__');
```

Check first: `grep -r "geminiRotator\|groqRotator" src/ --include="*.ts" --include="*.tsx"` — if only found in `MultiKeyRotator.ts` itself  and `GeminiClient.ts` and `GroqClient.ts`, then those files have already been refactored to use `openclawClient`, so it's safe to remove the exports.

### Task 3.2: Remove `axios` import from VoiceService

After Task 1.1, `VoiceService.ts` no longer uses `axios`. Check if `axios` is used anywhere else in `src/`. If it is only used in `VoiceService.ts`, you can leave the package installed but just remove the import. Do NOT uninstall the npm package.

### Task 3.3: Clean up `VITE_ELEVENLABS_API_KEY` references

Search the entire `src/` directory for `ELEVENLABS`. Remove or comment out any references. If found in env validation files, update them.

### Task 3.4: Remove unused `getEnv` import

If `src/utils/env.ts` exports a `getEnv` function that is no longer imported anywhere after VoiceService cleanup, leave the file but verify it's not causing issues.

---

## PHASE 4: Add OpenClaw Session Support to Chat

### Task 4.1: Add session key to openclawClient

In `src/services/openclawClient.ts`, add a session management capability. Add these methods to the `openclawClient` object:

```typescript
  /**
   * Session-based chat — maintains conversation history on the server
   */
  async sessionChat(
    sessionKey: string,
    message: string,
    options: {
      agentId?: string;
      onChunk?: (chunk: string) => void;
    } = {}
  ): Promise<string> {
    const { agentId = 'ustaz', onChunk } = options;

    const hookPath = agentId === 'ustaz' ? 'ai-query' : agentId;
    
    const response = await this.hookRequest(hookPath, {
      message,
      agentId,
    }, {
      sessionKey: `web:${sessionKey}`,
    });

    if (response.ok && response.reply) {
      return response.reply;
    }

    // Fallback to stateless chat completions if hooks fail
    return this.askUstaz(message, sessionKey, onChunk);
  },

  /**
   * Create a new session key for a user
   */
  createSessionKey(userId: string): string {
    return `web:${userId}:${Date.now()}`;
  },
```

---

## PHASE 5: Add Gateway Status Indicator to UI

### Task 5.1: Create `src/components/OpenClawStatus.tsx`

Create a minimal connection status indicator component:

```tsx
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useOpenClawStatus } from '../hooks/useOpenClawStatus';

/**
 * Minimal gateway status indicator.
 * Shows a small dot in the corner — green if connected, red if not.
 */
const OpenClawStatus: React.FC = () => {
  const { status } = useOpenClawStatus(30000); // Check every 30s

  if (status === 'checking') return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-40"
      title={status === 'connected' ? 'AI Gateway: Aktif' : 'AI Gateway: Tidak Tersambung'}
    >
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm border transition-all ${
        status === 'connected'
          ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200'
          : 'bg-red-50/90 text-red-600 border-red-200'
      }`}>
        {status === 'connected' ? (
          <>
            <Wifi className="w-3 h-3" />
            <span>AI Aktif</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OpenClawStatus;
```

### Task 5.2: Add OpenClawStatus to App layout

In `src/App.tsx`, import and render `OpenClawStatus` inside the main layout. Place it as a sibling to the main router content, NOT inside any conditional:

```tsx
import OpenClawStatus from './components/OpenClawStatus';

// Inside the return JSX, add near the bottom (before closing fragment/div):
<OpenClawStatus />
```

Place it so it renders on every page. It should be AFTER the main content and BEFORE any closing tags. It's a fixed-position component so placement in the JSX tree doesn't affect layout.

---

## PHASE 6: Update env.ts validation (if exists)

### Task 6.1: Find and update env validation

Search for `src/utils/env.ts` or any file that validates required environment variables. If found:

1. Remove `VITE_GEMINI_API_KEY` and `VITE_GROQ_API_KEY` and `VITE_ELEVENLABS_API_KEY` from required vars
2. Add `VITE_OPENCLAW_URL` and `VITE_OPENCLAW_TOKEN` as the required vars
3. Make the validation non-fatal (warn instead of throw) so the app still runs in dev without the token

If no such file exists, skip this task.

---

## VERIFICATION

After making ALL changes:

1. Run `npx tsc --noEmit` — must pass with zero errors
2. Run `npm run build` — must succeed
3. Run `npm run test -- --passWithNoTests` — must pass
4. Verify ZERO references to `api.elevenlabs.io` in `src/`
5. Verify ZERO references to `localhost:8000` in `src/`
6. Verify ZERO references to `VITE_ELEVENLABS_API_KEY` in `src/` (except comments)
7. Verify ZERO references to `VITE_GEMINI_API_KEY` / `VITE_GROQ_API_KEY` being actively READ at runtime in `src/` (they may exist in dead code or comments)
8. Verify `src/components/OpenClawStatus.tsx` exists
9. Verify `VoiceService.ts` uses `openclawClient` or direct gateway fetch, NOT `axios` or ElevenLabs
10. Verify `ASRRecorder.tsx` uses gateway `/v1/audio/transcriptions`, NOT `localhost:8000`

---

## RULES

- Do NOT add any new npm dependencies — use native `fetch` only
- Do NOT delete any files that might still be imported — neutralize dead code instead
- Do NOT change any visual appearance or existing UI styling
- Do NOT modify files in `ADMIN-DASHBOARD/`, `supabase/`, or `docs/`
- Preserve ALL existing comments
- Use single quotes for imports
- Use `import type` for type-only imports
- Keep all existing LOCAL logic (FAQ search, cache, emotion detection)
- If `axios` is used elsewhere in the project, leave the package. Only remove the import from VoiceService.
- The `OpenClawStatus` component must use Raudhah design system colors (emerald/teal tones, not neon/cyan)
- Default TTS voice is `nova` (best for Malay/Arabic)
- Default ASR language for Quran is `ar` (Arabic)
- AbortSignal.timeout is available (ES2022+ is in tsconfig target)

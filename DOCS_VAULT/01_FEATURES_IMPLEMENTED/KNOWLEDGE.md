# QuranPulse Knowledge Items

This file contains persistent memory items capturing the core insights, architectural patterns, and solutions of the QuranPulse-v6.0 project.

---

## 🏗️ 1. Modular Monolith Architecture
**Summary**: The project follows a "Modular Monolith" pattern where features are encapsulated within specific directories, allowing for clear separation of concerns while maintaining deployment simplicity.

**Artifacts**:
- **Directory Structure**: Core features are located in `src/modules/` (e.g., `quran`, `iqra`, `ibadah`, `smart-deen`).
- **Core Component**: `src/App.tsx` acts as the orchestrator for these modular routes.
- **Data Cohesion**: Each module maps to specific tables in Supabase (e.g., `iqra` -> `iqra_progress`).

---

## 🤖 2. Hybrid AI Engine (Tiered Response Logic)
**Summary**: To optimize for cost, speed, and accuracy, the AI system employs a 3-tier strategy: Local FAQ first, then Semantic DB Cache (pgvector), and finally Cloud LLM as a fallback.

**Artifacts**:
- **Implementation**: `src/services/aiService.ts` implements the `askUstazAI` function.
- **Caching**: Uses `pgvector` in Supabase to find similar previous answers before hitting the API.
- **Fallback**: Automatically routes to Gemini 2.5 Flash or Groq LPU if local/cached results are insufficient.

---

## 🔑 3. Secure AI Proxy & Key Rotation
**Summary**: API keys for external AI services are never exposed on the frontend. Instead, all requests pass through a secure Supabase Edge Function that handles authentication and key rotation.

**Artifacts**:
- **Edge Function**: Located in `supabase/functions/chat-proxy/index.ts`.
- **Reliability**: Implements `MAX_RETRIES` and failover logic across multiple providers (Google, Groq, OpenAI).
- **Security**: Validates user JWT before processing AI requests.

---

## 📖 4. Digitized Iqra Learning Path (1-6)
**Summary**: A major competitive moat of QuranPulse is the fully interactive, digitized Iqra 1-6 curriculum, replacing static PDFs with trackable learning segments.

**Artifacts**:
- **Reader**: `src/modules/iqra/IqraDigitalReader.tsx`.
- **Granularity**: Content is broken down into `InteractiveSegment` components for precise progress tracking.
- **Progress Tracking**: Data is persisted in the `iqra_progress` table, supporting cross-device synchronization.

---

## 🇲🇾 5. JAKIM & Malaysian Context Integration
**Summary**: The app is purpose-built for the Malaysian Muslim community, integrating official JAKIM (Department of Islamic Development Malaysia) data for prayer times and halal compliance.

**Artifacts**:
- **Prayer Times**: `src/services/jakimService.ts` fetches data from official E-Solat APIs.
- **Content Accuracy**: AI personas (Tok Imam) are prompted to adhere to Shafi'i madhab and JAKIM guidelines.
- **Database**: `prayer_logs` table tracks Malaysian-standard prayer adherence.

---

## 💰 6. Frugal AI Strategy (Zero-Cost Arch)
**Summary**: The architecture is designed to remain operational within "Free Tier" limits by leveraging highly efficient models like Gemini Flash and maximizing local processing.

**Artifacts**:
- **Model Selection**: Preference for `gemini-2.0-flash` and `llama-3-70b` (via Groq) for high performance at zero/low cost.
- **Efficiency**: Heavy use of `Web Speech API` for local TTS/STT instead of paid cloud APIs where possible.
- **Storage**: Asset optimization (AVIF/WebP) to stay within Supabase storage limits.

---

## 🏆 7. Gamification & Clan (Family) System
**Summary**: QuranPulse uses social hooks and gamification to encourage consistency in worship and learning, particularly within family groups.

**Artifacts**:
- **Identity Model**: `profiles` table in Supabase stores `xp`, `streak`, and `level`.
- **Social Structure**: `families` and `family_members` tables allow users to create "Clans" for collective goals.
- **UI Elements**: Progress rings and leaderboards within the `Dashboard` module.

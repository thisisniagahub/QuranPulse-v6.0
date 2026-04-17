# 🧕 Ustazah AI 2.0 (Telegram Mission Control) — 2025 Advanced Blueprint

> **Role:** The "Heart & Soul" of QuranPulse on Telegram.
> **Persona:** Wise, gentle, encouraging, and digitally empowered.
> **Vision:** A context-aware spiritual companion that bridge users to the Super App via AI, Voice, and Generative UI.

---

## 1. 📋 Core Objective (2025 Vision)

Ustazah AI is no longer just a chatbot. In 2025, she is a **Multi-Modal Personal Mentor** that:
1.  **Understands Emotion:** Analyzes user sentiment to provide comforting verses.
2.  **Guided by MCP:** Always provides factual, JAKIM-verified data (No hallucinations).
3.  **Voice-First:** Uses premium neural TTS for realistic voice interactions.
4.  **Mini App Hub:** Launches Telegram Mini Apps (TMAs) for complex tools (Zakat, Quran Reader).

---

## 2. 🧠 Advanced 2025 Intelligence Layer

### 2.1 Emotional Intelligence (EI) Flow
Using Gemini 2.0/Pro to analyze user input for:
*   **Sentimen**: (Sad, Confused, Happy, Seeking Knowledge).
*   **Ustazah Response Change**: 
    - *Sad*: "Sabar ya hamba Allah, sesungguhnya..." (Slow, calm voice).
    - *Curious*: "MashaAllah, soalan yang bagus! Mari Ustazah jelaskan..." (Cheerful, energetic voice).

### 2.2 RAG + MCP (Official Data)
Ustazah AI is connected to the **Pulse-MCP Server**, allowing her to "Tools Use":
| Tool | Action | Source |
| :--- | :--- | :--- |
| `halal_verify` | Scans product images or text. | JAKIM SmartHalal |
| `fatwa_search` | Real-time lookup of rulings. | E-SMAF (National Fatwa) |
| `solat_precise` | Zone-based prayer times. | E-Solat API |
| `quran_vector` | Semantic search of Tafsir. | QuranPulse Vector DB |

---

## 3. 🎙️ Premium Voice Experience (ElevenLabs)

*   **Multilingual V2 Model**: Native Malay (Bahasa Melayu) with correct Arabic pronunciation.
*   **Voice Switching**: Ustazah can switch between "Casual Malay" for daily talk and "Formal Arabic" for reciting verses.
*   **Podcast Mode**: Generates 2-minute "Daily Tazkirah" audio automatically every morning.

---

## 4. 📱 Generative UI & Mini Apps (TMA)

Instead of long text walls, Ustazah AI sends **Interactive Cards**:

*   **Zakat Card**: "Klik untuk kira zakat anda" (Opens Telegram Mini App).
*   **Prayer HUD**: Real-time countdown to next prayer as a pinned message.
*   **Verse Studio Lite**: Preview specific verses with translation directly in the bot.

---

## 5. 🏗️ Technical Architecture (The Stack)

| Layer | Tools |
| :--- | :--- |
| **Framework** | `Telegraf.js` (TypeScript) |
| **Server** | `Node.js` (Unified Bot Server on Port 3002) |
| **LLM Orchestration** | `Hybrid Engine` (Gemini 2.0 Pro + Groq Llama 3) |
| **Voice** | `ElevenLabs API` (VoiceID: *Phoebe* or *Custom Train*) |
| **Database** | `Supabase` (User sessions, chat history, progress) |
| **Integration** | `Model Context Protocol (MCP)` |

---

## 6. 🛠️ Command Structure (UX Map)

| Command | Action |
| :--- | :--- |
| `/start` | Rich Greeting + Menu Buttons (Beginner Guide). |
| `/ustazah` | Toggle "Mentoring Mode" (AI Chat). |
| `/quran` | Search for verses or open Mini App Reader. |
| `/solat` | Get current zone prayer times + Qibla direction. |
| `/infaq` | Direct link to Barakah Hub (Infaq/Wakaf). |
| `/help` | Complete tutorial on how to use the bot. |

---

## 7. 🚀 Security & Performance

*   **Anti-Ban Logic**: Human-like typing delays and message queuing (2-second jitter).
*   **Session Persistence**: All conversations are stored in Supabase for cross-platform continuity (App <-> Bot).
*   **Zero-Cost Failover**: If ElevenLabs/Gemini limits are hit, falls back to Web Speech API / Local FAQ.

---

## 8. 📅 Implementation Roadmap (Q1 2025)

1.  **Phase 1**: Full Command Menu + Button Integration (COMPLETE).
2.  **Phase 2**: ElevenLabs Voice Note Integration (IN PROGRESS).
3.  **Phase 3**: MCP Tooling (Halal & Fatwa) Integration.
4.  **Phase 4**: Telegram Mini App (TMA) for Quran & Zakat.

---

## 9. 🛰️ Futuristic "Vision-X" Features (Vision AI)

Ustazah AI can now "see" via the Telegram camera:
*   **SmartHalal OCR**: Send a photo of food ingredients; Ustazah verifies against JAKIM's non-halal registry in real-time.
*   **Ayat Vision**: Snap a photo of a Quran verse; Ustazah provides the exact Surah/Ayah number and its Tafsir.
*   **Mosque Finder AR**: Telegram sends a location, but Ustazah sends back a 360° image or Mini App link to view the nearest mosque interally.

---

## 10. 🎙️ Advanced "Voice Duplex" Mode

*   **Real-time Interruption**: Users can speak while Ustazah is talking, and she will stop and listen (using ElevenLabs ConvAI).
*   **Tazkirah Podcast Generator**: Users can request: "/tazkirah topik Sabar", and Ustazah generates a 3-minute, high-quality audio podcast with background ambient prayer hall sounds.
*   **Automatic Translation**: Send an Arabic audio clip; Ustazah translates it to Malay text and voice instantly.

---

## 11. 🎨 Generative Media & Social Share

*   **AI Dua Cards**: Just ask: "Buatkan kad doa untuk kesihatan emak." Ustazah generates a beautiful, shareable image (DALL-E 3) with the specific Dua text and QuranPulse branding.
*   **Daily Video Shorts**: Auto-generating 15-second "Vertical Reminders" for users to post on their Telegram/WhatsApp Stories.

---

## 12. 📊 Cross-Platform Continuity

*   **Unified State**: If you started a learning plan on the Web App, Ustazah will remind you on Telegram: "Assalamualaikum Teddy, hari ini kita ada 2 ayat lagi untuk dihafal. Sedia?"
*   **Global Progress**: XP gained in Telegram (by chatting/asking questions) contributes to your QuranPulse Global Leaderboard.

---

## 13. 💎 Zero-Cost Token Architecture (2025 Strategy)

To ensure the bot remains 100% free and sustainable, we use a **Four-Layer Intelligence Fallback**:

1.  **Layer 1: Local Pattern Matcher (0 Tokens)**: 
    *   Immediate regex/keyword matching for greeting, common FAQs (Solat/Puasa), and navigation commands.
2.  **Layer 2: Supabase Hybrid Cache (0 Tokens)**: 
    *   Fuzzy search on previously answered questions stored in DB. No AI call needed for repeated queries.
3.  **Layer 3: Groq Llama 3.3 70B / 3.2 (Advanced Free Tier)**:
    *   Ultra-fast, sophisticated reasoning available for free. 
4.  **Layer 4: Gemini 2.0 Flash / Pro 1.5 (Advanced Free Tier)**:
    *   Multimodal (Vision/Audio) capabilities that are state-of-the-art in 2025. 
5.  **Layer 5: Key Rotation System (Multi-Provider)**:
    *   Automatic switching between multiple keys across Gemini, Groq, and Mistral to maximize daily "Pro" level usage for zero cost.

---

**[End of Ustazah AI 2.0 Ultra-Advanced Blueprint]**

# Quran Pulse v6.0 - Genesis Master Edition 🌙

**The Ultimate Islamic AI SuperApp Ecosystem.**

Quran Pulse v6.0 represents a paradigm shift in Islamic applications, fusing traditional spiritual tools with cutting-edge Generative AI. Built with React 19, TypeScript, and the Google Gemini API, it offers a holistic suite of features ranging from AI-powered religious guidance to real-time pronunciation correction.

---

## 🚀 Key Modules & Features

### 🤖 Smart Deen (AI Core)
*   **Gemini Live Call:** Experience real-time, low-latency voice conversations with "Ustaz AI" using the `gemini-2.5-flash-native-audio-preview` model. Features a custom Web Audio API visualizer.
*   **Deep Reasoning Mode:** Toggles `thinkingConfig` to provide detailed Fiqh analysis based on the Syafi'i Mazhab, referencing classical texts and Malaysian Fatwa.
*   **Jawi Converter:** Instantly transliterates Rumi text to Jawi script.
*   **Smart Planner:** Generates personalized learning schedules for Quran memorization.

### 📖 Iqra (Digital Learning)
*   **AI Voice Coach:** Uses Multimodal AI to listen to user recitation, analyze pronunciation (Tajweed), and provide an accuracy score and specific feedback.
*   **Tajweed Masterclass:** Generates dynamic educational videos on-the-fly using **Google Veo** (`veo-3.1-fast-generate-preview`) to visualize rules like Qalqalah and Ikhfa.

### 🕌 Quran & Ibadah
*   **Semantic Search:** Search the Quran using emotions or natural language (e.g., "I feel anxious") instead of just keywords.
*   **Verse Studio:** Deep dive into specific verses with AI Chat, Tafsir summaries, and Morphology analysis (Word-by-Word grammar).
*   **Digital Tasbih:** Haptic-enabled 3D counter.
*   **Qibla & Prayer:** Geolocation-based prayer times and compass.
*   **WhatsApp Bot Integration:** Monitor and control a WhatsApp notification bot directly from the app.

### 🛍️ The Souq & Admin CMS
*   **Cloud Backend:** The app functions offline (Mock Mode) or connects to Google Sheets (Cloud Mode) for persistent user data, inventory, and order management.
*   **God Mode Admin:** A comprehensive dashboard to manage users, products, broadcast alerts, and view system audit logs.

### 🎥 Media Studio
*   **Veo Integration:** Create cinematic Islamic videos using text-to-video generation.
*   **Prompt Enhancement:** Uses Gemini Flash to refine simple prompts into detailed cinematic descriptions before generation.

---

## 🛠 Technical Architecture

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS, Framer Motion (3D animations & transitions)
*   **AI SDK:** `@google/genai` v1.30+
*   **Audio:** Web Audio API (AudioWorklet, AnalyserNode, ScriptProcessor) for raw PCM streaming.

### AI Models Used
*   **Logic & Text:** `gemini-2.5-flash` (High speed, low latency)
*   **Voice (Real-time):** `gemini-2.5-flash-native-audio-preview-09-2025`
*   **Speech Generation:** `gemini-2.5-flash-preview-tts`
*   **Video Generation:** `veo-3.1-fast-generate-preview`

---

## ⚙️ Setup & Configuration

### 1. Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### 2. API Key Configuration
The application requires a Google Gemini API Key.
*   The key is injected via `process.env.API_KEY` in the build environment.
*   **Note:** For **Veo** video generation and **Gemini Live** features, the app includes a secure flow (`window.aistudio`) to prompt the user to select their own paid API key if required by the model.

### 3. Backend Setup (Google Sheets - Optional)
To enable the persistent "Cloud Mode" for the Shop and Admin panel:

1.  Open the file `GOOGLE_SHEET_SETUP.md` included in this project.
2.  Follow the instructions to copy the App Script code into a new Google Sheet.
3.  Deploy the script as a Web App (Access: Anyone).
4.  In the Quran Pulse Admin Dashboard (`God Mode` -> `Config`), paste your Deployment URL.
5.  The app will now sync Users, Orders, and Products to your Sheet.

---

## 📂 Project Structure

```
/
├── components/       # Shared UI components (Layout, PulseLoader)
├── modules/          # Main Feature Views
│   ├── Dashboard.tsx # Home & Daily Deeds
│   ├── SmartDeen.tsx # AI Chat & Live Call implementation
│   ├── Iqra.tsx      # Reading & Audio Analysis
│   ├── MediaStudio.tsx # Veo Video Generation
│   └── Admin.tsx     # CMS & Config
├── services/         # Logic Layers
│   ├── geminiService.ts # All GenAI interactions
│   ├── apiClient.ts     # Data abstraction layer (Mock vs Cloud)
│   ├── googleSheetService.ts # Apps Script Bridge
│   └── prayerService.ts # External APIs
└── types.ts          # TypeScript Definitions
```

---
*Secured by Barakah Engine™ • Est 2025*

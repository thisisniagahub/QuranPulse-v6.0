# 🌌 Product Requirements Document (PRD): QuranPulse Mobile v6.0

**Project Name:** QuranPulse Mobile (Noor-e-Cyber Edition)  
**Status:** Initializing (Genesis Phase)  
**Version:** 6.0  
**Lead Architect:** AI Agent (Lead Software Architect & PM)

---

## 1. Executive Summary
### 1.1 Vision
To create the world's most advanced, high-performance, and immersive Islamic application that bridges spiritual growth with futuristic "Cyber-Islamic" technology.

### 1.2 Mission
To provide a "Proper App" experience that exceeds PWA limitations, focusing on:
*   **Zero Latency:** Instant Quranic text loading.
*   **Deep Engagement:** Background audio and proactive spiritual notifications.
*   **High Trust:** Native security and frictionless "one-tap" support/monetization.

---

## 2. Technical Stack (The "Noor-e-Cyber" Stack)
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Flutter (Dart)** | Single codebase for iOS/Android with 60FPS performance. |
| **State Management**| **Riverpod (Gen)** | Compile-safe, testable state management. |
| **Local Database** | **Isar NoSQL** | Ultra-fast local storage for Quran text (Offline-First). |
| **Backend** | **Supabase** | Auth, Postgres, and Edge Functions (Shared with Web). |
| **Navigation** | **GoRouter** | Declarative routing for deep-linking support. |
| **Audio Engine** | **Just Audio** | Native background audio with lock-screen controls. |
| **AI Layer** | **Gemini 1.5/2.0** | Integrated via Google AI Dart SDK. |

---

## 3. Core Feature Specifications

### 3.1 Quran Module (The Reading Engine)
*   **Requirement:** Must load any Surah in under 100ms.
*   **Features:**
    *   Uthmani Script rendering.
    *   Word-by-word transliteration.
    *   **Background Audio:** Continuous play even when the app is minimized (Native Audio Service).
    *   **Offline Mode:** Users can download Surahs for offline use via Isar.

### 3.2 Iqra Digital (Voice & Vision)
*   **Voice Coach (ASR):** Record user recitation and send to forensics API for Tajweed analysis.
*   **Vision Coach:** Real-time camera overlay to detect hand/lip movements during learning (using Google ML Kit).
*   **Interactive Books:** PDF rendering for Iqra 1-6 with clickable audio segments.

### 3.3 Smart Deen (AI Ustaz)
*   **Personalized AI:** Support for multiple personas (Shafi'i, General, Youth).
*   **Streaming Chat:** Real-time "typewriter" effect using Gemini API.
*   **Generative UI:** AI can trigger app widgets (e.g., if user asks for prayer times, AI shows the Prayer Widget).

### 3.4 Ibadah Suite
*   **Prayer Times:** Accurate offline calculations using `adhan` library.
*   **Qibla AR:** Use device compass and camera for Augmented Reality Qibla direction.
*   **Smart Notifications:** Reminder for Sunnah prayers, Dhuha, and Friday Kahfi.

---

## 4. UI/UX & Design Language
**Theme Name:** Noor-e-Cyber
*   **Palette:** Deep Navy (`#0F172A`), Cyan Neon (`#06B6D4`), Royal Purple (`#581C87`).
*   **Style:**
    *   **Glassmorphism:** Semi-transparent cards with heavy blur.
    *   **Micro-animations:** Use `flutter_animate` for every transition.
    *   **Haptic Feedback:** Subtle vibrations on button taps and long-presses.

---

## 5. Monetization & Growth
*   **In-App Purchases (IAP):**
    *   **QP Premium:** Monthly/Annual subscription for advanced AI features.
    *   **Barakah Donation:** One-tap donation via Apple Pay / Google Pay.
*   **Deep Linking:** Every Ayah share link from the web app should open the mobile app directly.

---

## 6. Architecture Standards (Clean Architecture)
To ensure consistency, all code must follow:
1.  **`data` layer:** Repositories, Data Sources, and Models (DART classes).
2.  **`domain` layer:** Entities and Use Cases (Business Logic).
3.  **`presentation` layer:** Screens, Widgets, and Riverpod Providers.

---

## 7. Roadmap (Phased Delivery)
*   **Phase 1 (Genesis):** Project setup, Auth, and Supabase Sync.
*   **Phase 2 (Core):** Quran Engine + Local DB (Isar) + Audio Service.
*   **Phase 3 (AI):** Ustaz AI Chat integration.
*   **Phase 4 (Iqra):** ASR Recording & Feedback loop.
*   **Phase 5 (Polish):** AR Qibla, IAP, and App Store Submission.

---
**Approval:**  
*Prepared by AI Architect for Antigravity Team.*

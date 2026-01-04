# QuranPulse v6.0 - Gemini Context

## Project Overview
**QuranPulse v6.0 ("Noor-e-Cyber")** is a futuristic Islamic Progressive Web App (PWA) built to bridge spiritual depth with a modern, cyber-islamic design language. It features advanced modules like "Ustaz AI", "Iqra Digital" (interactive learning), and a "Pulse Command Center" for daily spiritual management.

## Tech Stack
*   **Frontend:** React 18, Vite, TypeScript
*   **Styling:** Tailwind CSS v4, Framer Motion (Glassmorphism & Neon aesthetics)
*   **State Management:** Zustand, React Query, React Context
*   **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
*   **AI:** Gemini, Groq, OpenAI Whisper (ASR)
*   **Testing:** Jest, React Testing Library
*   **Routing:** React Router 7

## Architecture & File Structure
The project follows a modular architecture within `src/`:

*   `src/modules/`: Contains core feature modules (e.g., `quran`, `iqra`, `smart-deen`).
*   `src/components/`: Reusable UI components (Atoms, Molecules).
*   `src/services/`: API integration services (Supabase, AI endpoints).
*   `src/contexts/`: Global state providers (Theme, Audio).
*   `src/hooks/`: Custom React hooks.
*   `admin-dashboard/`: Separate Next.js application for administration.
*   `DOCS_VAULT/`: Centralized documentation repository.

## Development Workflow

### Key Commands
*   **Install Dependencies:** `npm install`
*   **Start Dev Server:** `npm run dev` (Runs at http://localhost:5173)
*   **Build for Production:** `npm run build`
*   **Run Tests:** `npm run test`
*   **Run Tests (Watch):** `npm run test:watch`

### Admin Dashboard
To work on the admin dashboard:
```bash
cd admin-dashboard
npm install
npm run dev
```

## Conventions
*   **Styling:** Use Tailwind utility classes. Prefer `Framer Motion` for animations.
*   **Components:** Functional components with TypeScript.
*   **State:** Use `Zustand` for global app state and `React Query` for server state.
*   **Testing:** Write unit tests for new logic using Jest.
*   **Design System:** Adhere to the "Noor-e-Cyber" aesthetic (Cyan/Purple neon on dark backgrounds).

## Important Files
*   `package.json`: Project dependencies and scripts.
*   `vite.config.ts`: Vite configuration.
*   `supabase_schema_final.sql`: Current database schema.
*   `DOCUMENTATION_PROJECT_BARU/TECH_STACK.md`: Detailed tech stack reference.

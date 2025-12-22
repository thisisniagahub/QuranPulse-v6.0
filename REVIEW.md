# Comprehensive Review & Audit Report: Quran Pulse v6.0

## 1. Executive Summary
This report covers a deep dive analysis of the Quran Pulse v6.0 codebase, including the main React application (`src`), the standalone Admin Dashboard (`admin-dashboard`), the backend/bot integration (`bot-server.ts`), and the database schema (`supabase`).

**Overall Health:** The project shows a strong foundation with modern tech choices (Vite, React, TypeScript, Tailwind, Supabase). It integrates advanced features like AI (Ustaz AI), social bots (Telegram/WhatsApp), and a rich Quran reading experience. However, there are architectural inconsistencies, potential performance bottlenecks, and security considerations that need addressing to ensure scalability and stability.

---

## 2. Architecture & Code Structure

### Findings
*   **Repo Monorepo-ish Structure:** The project contains both the main app (`src/`) and a separate Next.js app (`admin-dashboard/`) in the same repo. This is good for keeping things together but they share no code (types, utils, or UI components are duplicated or isolated).
*   **State Management:** The app uses a mix of Context API (`AuthContext`, `DataContext`, `AudioPlayerContext`) and React Query (`QueryProvider`). This is generally good, but `DataContext` seems to be a large global store which can lead to unnecessary re-renders.
*   **Service Layer:** The `src/services/` folder is well-populated, but `apiClient.ts` has a toggle between "MOCK" and "CLOUD" modes, relying on a Google Sheet script as a backend for some features (`AppConfig`, `Products`, `Orders`). This is an unusual hybrid with Supabase.
*   **Bot Server:** `src/bot-server.ts` is a standalone Node.js script that runs alongside the Vite dev server. It attempts to import from `src/services`, which are written for the browser (using `localStorage`, `window`, etc.). This is a **critical architectural risk** because browser-specific code will crash in the Node.js environment.

### Suggestions
1.  **Strict Separation of Environments:** Move `bot-server.ts` and its dependencies (like `whatsappService.ts`) into a dedicated `server/` or `functions/` directory. Ensure they do not import browser-only code.
2.  **Shared Library:** Create a `packages/shared` or `src/shared` folder for types (e.g., `UserProfile`, `Product`) that can be used by both the main app, the admin dashboard, and the bot server.
3.  **Unify Backend Strategy:** The reliance on Google Sheets via `GoogleSheetService` alongside Supabase is redundant and brittle. **Migrate all Google Sheet data (Products, Configs, Orders) to Supabase tables.** This will unify authentication, security policies (RLS), and data integrity.

---

## 3. Code Quality & Patterns

### Findings
*   **TypeScript Strictness:** `tsconfig.json` has `"strict": true` but also `"skipLibCheck": true`. In `AuthContext.tsx`, there are `any` types used for errors and session data.
*   **Component Size:** `App.tsx` contains a large `LoadingFallback` component and route definitions. `Layout.tsx` handles a lot of conditional logic.
*   **Hardcoded Values:** `bot-server.ts` has hardcoded ports (`3002`) and inconsistent environment variable loading (`../scripts/env-loader.js`).
*   **Duplicate Logic:** The `AdminDashboard` exists as a module in the main app (`src/modules/admin`) *and* as a separate Next.js app (`admin-dashboard/`). This is confusing. Which one is the source of truth?

### Suggestions
1.  **Refactor `App.tsx`:** Extract `LoadingFallback` to a separate component. Move route definitions to a `routes.tsx` config file for better readability.
2.  **Standardize Admin:** Decide on ONE admin interface. If the Next.js `admin-dashboard` is the future, remove `src/modules/admin` to reduce bundle size and confusion.
3.  **Type Safety:** Replace `any` in `AuthContext` and services with proper Supabase generated types. Run `supabase gen types` to get exact schema definitions.

---

## 4. Performance & Optimization

### Findings
*   **Heavy Assets:** `LoadingFallback` in `App.tsx` uses multiple DOM elements for animations. While visually appealing, it might delay Time-to-Interactive on low-end devices.
*   **Bundle Size:** `vite.config.ts` has manual chunking, which is good. However, large libraries like `whatsapp-web.js` (used in `bot-server.ts` but potentially imported in shared services) could leak into the client bundle if not carefully isolated.
*   **Image Optimization:** The app uses standard `<img>` tags or `div` backgrounds. The Admin Dashboard (Next.js) uses `next/image`, which is excellent. The main Vite app should utilize `vite-plugin-image-optimizer` or Supabase Image Transformations.

### Suggestions
1.  **Lazy Loading:** Ensure *all* route components are lazy-loaded (already mostly done in `App.tsx`).
2.  **Asset Optimization:** Check `public/` for unused large images. Convert PNG/JPG assets to WebP where possible.
3.  **Code Splitting:** Verify that `whatsapp-web.js` and `telegraf` are **strictly** excluded from the client build. They are Node.js libraries and will bloat the browser bundle or cause build errors.

---

## 5. Security

### Findings
*   **RLS Policies:** `supabase_schema.sql` shows RLS is enabled for most tables.
    *   *Risk:* `Public surahs are viewable by everyone` (Good).
    *   *Risk:* `Users can view own profile` (Good).
    *   *Missing:* Policies for `admin` role checks. Currently, anyone with a valid token might be able to access "admin" routes if client-side checks are bypassed.
*   **Secret Management:** `bot-server.ts` logs "Bot Server running" but doesn't seem to enforce strict API key checks for the `/api/broadcast` endpoint. Anyone who can reach port 3002 could trigger broadcasts.
*   **Google Sheets API:** The `apiClient` exposes a Google Apps Script URL (`DEFAULT_SHEET_URL`). If this script doesn't validate an "API Key" or token, anyone can read/write data to it.

### Suggestions
1.  **Secure Bot API:** Add a middleware to `bot-server.ts` that checks for a `X-Admin-Secret` header before allowing POST requests to `/api/broadcast`.
2.  **Migrate to Supabase Auth:** Completely replace the Google Sheet backend. It's insecure by design for a production app dealing with user orders or config.
3.  **Role-Based Access Control (RBAC):** Implement a proper `role` column in `public.profiles` (already there) and enforce it in RLS policies (e.g., `create policy "Admins can do everything" ... using (auth.jwt() ->> 'role' = 'admin')`).

---

## 6. Bot Integration Specifics

### Findings
*   **WhatsApp Library:** `whatsapp-web.js` relies on Puppeteer. This is heavy and resource-intensive. Running it inside the same repo/server as a lightweight API might lead to memory leaks.
*   **Telegram Polling:** `TelegramService` uses polling (`this.bot.launch()`). For production, Webhooks are preferred to avoid "conflict" errors and reduce server load.
*   **Vision-X:** The `analyzeImage` function sends images to an AI service. Ensure this endpoint is rate-limited to prevent abuse.

### Suggestions
1.  **Isolate Bot Service:** The bot server should ideally be a separate microservice or at least a separate Docker container.
2.  **Switch to Webhooks:** Configure Telegram to use Webhooks instead of Polling in production.

---

## 7. Immediate Action Plan (High Priority)

1.  **Fix Bot Server Imports:** Ensure `bot-server.ts` does not import any file that uses `window`, `document`, or `localStorage`.
2.  **Consolidate Admin:** Choose the Next.js dashboard as the source of truth and deprecate the React internal admin module.
3.  **Secure API:** Migrate critical data (Orders, Products) from Google Sheets to Supabase.

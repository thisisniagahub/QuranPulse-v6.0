# QuranPulse v6.0 (Next.js Edition) - Zero to Hero Setup Guide

> **Target Architecture:** Next.js 15 App Router + Supabase
> **Prerequisites:** Node.js 18.17+, Git, VS Code

## Step 1: Project Initialization

Initialize the Next.js project with the required configuration.

```bash
# Create Next.js project with TypeScript, Tailwind, and App Router
npx create-next-app@latest quranpulse \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm

cd quranpulse
```

**What this does:** Creates a clean Next.js 15 application with TypeScript and Tailwind CSS v4 predefined, utilizing the `src/` directory structure for modularity.

---

## Step 2: Install Core Dependencies

Install the critical P0 dependencies identified in `TECH_STACK.md`.

```bash
npm install @supabase/supabase-js @tanstack/react-query framer-motion lucide-react adhan react-markdown react-pdf clsx tailwind-merge zod react-hook-form sonner
```

**Packages Breakdown:**
*   `@supabase/supabase-js`: Official Supersbase client.
*   `@tanstack/react-query`: Robust async state management.
*   `framer-motion`: High-performance animations.
*   `lucide-react`: Modern icon set.
*   `adhan`: Islamic prayer time calculations.
*   `react-markdown`: Rendering AI chat responses.
*   `react-pdf`: Rendering Iqra digital books.
*   `clsx` & `tailwind-merge`: Utility for dynamic class names (shadcn/ui standard).
*   `zod` & `react-hook-form`: Form validation and handling.
*   `sonner`: Premium toast notifications.

---

## Step 3: Install Dev Dependencies

Development tools for testing and formatting.

```bash
npm install -D jest @testing-library/react @testing-library/dom @testing-library/jest-dom jest-environment-jsdom ts-node cross-env
```

---

## Step 4: Setup Supabase CLI

We use the CLI for local development and database management.

```bash
# Install Supabase CLI globally (if not installed)
npm install -g supabase

# Login to Supabase (opens browser authentication)
supabase login

# Initialize Supabase inside the project
supabase init
```

---

## Step 5: Configure Supabase Project

You need to link your local environment to a cloud project for authentication to work effectively.

```bash
# Option A: Link to existing project (Get Ref from Dashboard URL)
supabase link --project-ref your-project-ref

# Option B: Start Local Supabase (Docker required)
# supabase start
```

---

## Step 6: Configure Environment Variables

Create the local environment configuration.

```bash
# Create .env.local file (Windows PowerShell)
New-Item -Path .env.local -ItemType File

# OR standard copy command
cp .env.example .env.local
```

**Edit `.env.local` with these required keys:**

```env
# 1. Supabase (Get from Dashboard -> Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# 2. AI Intelligence (Get from Google AI Studio / Groq)
GEMINI_API_KEY=AIzaSy...
GROQ_API_KEY=gsk_...

# 3. Voice & Vision
ELEVENLABS_API_KEY=sk_...

# 4. App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 7: Run Database Migrations

Apply the database schema (`tables`, `rls_policies`) to your instance.

```bash
# Pushes the local migration files to the remote database
supabase db push
```

---

## Step 8: Setup Supabase Edge Functions

Initialize the AI Proxy function.

```bash
# 1. Create function boilerplate
supabase functions new chat-proxy

# 2. Set API Secrets for the Function
supabase secrets set GEMINI_API_KEY=AIzaSy...
supabase secrets set GROQ_API_KEY=gsk_...

# 3. Deploy the function
supabase functions deploy chat-proxy
```

---

## Step 9: Start Development Server

Launch the full stack application.

```bash
npm run dev
```

🚀 **Access the App:** Open [http://localhost:3000](http://localhost:3000)

---

## Step 10: Verification Checklist

*   [ ] **Server**: Terminal shows `Ready in [x]ms`.
*   [ ] **Frontend**: Browser loads without "Hydration Error".
*   [ ] **Supabase**: Login page allows sign-in.
*   [ ] **AI Chat**: "Ustaz AI" responds (checks Edge Function connection).
*   [ ] **Audio**: Bismillah audio plays (checks Public assets).

---

## Troubleshooting

**Error: "Hydration failed because the initial UI does not match..."**
> **Solution:** Ensure you are not rendering random data (dates/math) directly in Server Components without Client Wrappers. Use `useEffect` for date rendering.

**Error: "Supabase CLI: Docker is not running"**
> **Solution:** If running `supabase start` (Local dev), Docker Desktop must be open. For `npm run dev` connecting to Cloud, Docker is not needed.

**Error: "401 Unauthorized" on Edge Function**
> **Solution:** Check if `Authorization: Bearer ANON_KEY` header is being sent in your fetch request to the function.

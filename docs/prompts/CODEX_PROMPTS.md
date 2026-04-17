# 🛡️ Codex Cloud Prompts — VERIFIED & SAFE Edition

> **Repo**: `thisisniagahub/QuranPulse-v6.0` (branch: `main`)
> **Platform**: <https://chatgpt.com/codex>
> **Verified**: 28 Feb 2026 — every file path and line reference checked against actual code

---

## Cara Guna

1. Buka <https://chatgpt.com/codex>
2. Connect repo `thisisniagahub/QuranPulse-v6.0`
3. Run **Batch A dulu** (launch blockers) — satu task, satu PR, merge sebelum next
4. Lepas Batch A semua merged, run **Batch B** (cleanup)

---

## 📦 BATCH A — Launch Blockers (5 tasks)

---

### TASK A1: Fix Compile Blocker

```
Fix the TypeScript compile error in src/modules/iqra/components/IqraFeedbackOverlay.tsx.

The problem is on line 9:
  import { motion, AnimatePresence } from 'framer-presence';

'framer-presence' is not a real npm package. This is a typo.

Fix: Change line 9 to:
  import { motion, AnimatePresence } from 'framer-motion';

Only change this one line in this one file.
After the fix, run: npx tsc --noEmit
Expected: zero errors.
```

---

### TASK A2: Fix Admin Auth (3 files)

```
Fix admin authorization in 3 specific files. The app uses the profiles table in Supabase with a 'role' column that has values 'ADMIN' or 'SUPERADMIN'.

FILE 1: src/services/adminService.ts

Current problem (lines 9-11): The isAdmin function has a fallback that checks VITE_ADMIN_USER_IDS env var, which exposes admin user IDs in client-side code.

Fix: Remove lines 10-11 (the VITE_ADMIN_USER_IDS check). Keep only the profiles.role database check that already exists at lines 14-20. The function should be:

  isAdmin: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    return data?.role === 'ADMIN' || data?.role === 'SUPERADMIN';
  },

FILE 2: src/modules/admin/components/AdminRoute.tsx

Current problem (lines 6-11): There is a hardcoded SUPER_ADMINS email array used as a bypass. This means anyone who knows these emails could theoretically be assumed admin without real auth.

Fix: Remove the SUPER_ADMINS constant (lines 6-11) and the Level 1 email whitelist check (lines 30-34). Keep only the Level 2 database role check (lines 37-61) which correctly queries profiles.role. The verifyAccess function should go straight to the database check.

FILE 3: supabase/functions/mcp-admin/index.ts

Current problem: The edge function at line 9 uses a service-role Supabase client and processes ALL requests at line 47 with ZERO authentication. Anyone who knows the endpoint URL can call it.

Fix: Add authentication at the top of the serve handler (after the OPTIONS check at line 44, before the request processing at line 47). Add this auth block:

  // --- AUTH CHECK ---
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Verify the user's JWT using anon client
  const anonClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } }
  });
  const { data: { user }, error: authError } = await anonClient.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Check admin role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPERADMIN') {
    return new Response(JSON.stringify({ success: false, error: 'Forbidden: Admin access required' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  // --- END AUTH CHECK ---

Keep the existing service-role supabase client (line 9) for the actual DB operations after auth passes. Also sanitize the catch block at line 141-149 — replace `error: String(err)` with `error: 'Internal server error'`.

After all changes, run: npx tsc --noEmit
```

---

### TASK A3: Fix Critical CORS (3 files only — not all 10)

```
Fix wildcard CORS in the 3 most critical edge functions. Do NOT touch the other 7 edge functions yet — those will be done in a separate task after verifying these work.

FILES TO FIX:
1. supabase/functions/chat-proxy/index.ts
2. supabase/functions/mcp-admin/index.ts
3. server/bot-server.ts

FOR FILES 1 and 2 (Deno edge functions):

Replace the existing corsHeaders constant with a dynamic function. Current code in both files is:
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    ...
  };

Replace with:
  const ALLOWED_ORIGINS = [
    'https://quranpulse.my',
    'https://www.quranpulse.my',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  function getCorsHeaders(req: Request): Record<string, string> {
    const origin = req.headers.get('origin') ?? '';
    if (ALLOWED_ORIGINS.includes(origin)) {
      return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-name',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      };
    }
    // No valid origin — do not set Access-Control-Allow-Origin at all
    return {
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-name',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    };
  }

Then replace every usage of `corsHeaders` with `getCorsHeaders(req)` throughout each file. Make sure the OPTIONS handler also passes req to getCorsHeaders.

FOR FILE 3 (server/bot-server.ts — Express/Node):

Find the existing CORS setup (likely cors() with no options or manual * headers). Replace with:
  const ALLOWED_ORIGINS = [
    'https://quranpulse.my',
    'https://www.quranpulse.my',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

After changes, run: npx tsc --noEmit
```

---

### TASK A4: Sanitize chat-proxy Errors + Fix CSP

```
Two small, focused fixes.

FILE 1: supabase/functions/chat-proxy/index.ts

Current problem at lines 136-141: The catch block returns raw error.message to the client:
  return new Response(JSON.stringify({ error: error.message }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Fix: Change the catch block to:
  } catch (error: any) {
    console.error('Chat proxy error:', error.message);
    return new Response(JSON.stringify({ error: 'Service temporarily unavailable. Please try again.' }), {
      status: 500,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }

Note: If TASK A3 has already been merged, use getCorsHeaders(req). If not, keep the existing corsHeaders reference.

FILE 2: vercel.json

Current problem at line 8: The CSP script-src contains 'unsafe-eval' which allows arbitrary script execution.

Fix: In the Content-Security-Policy value on line 8, find the text:
  script-src 'self' 'unsafe-inline' 'unsafe-eval'

Replace with:
  script-src 'self' 'unsafe-inline'

Keep ALL other CSP directives exactly as they are. Do not change connect-src, img-src, style-src, or any other directive. Only remove 'unsafe-eval' from script-src.

Only modify these 2 files.
```

---

### TASK A5: Audit AI Client Exposure (Report Only — No Code Changes)

```
This is an AUDIT task. Do NOT modify any code. Only produce a report.

The following client-side files make direct API calls to AI providers using API keys stored in VITE_ environment variables. These keys are exposed in the browser JavaScript bundle.

Files to audit:
1. src/services/ai/GroqClient.ts — directly calls https://api.groq.com with VITE_GROQ_API_KEY
2. src/services/ai/GeminiVisionClient.ts — directly calls Gemini API with VITE_GEMINI_API_KEY
3. src/services/ai/MultiKeyRotator.ts — loads VITE_GEMINI_API_KEY and VITE_GROQ_API_KEY at lines 68-69
4. src/services/ragService.ts — check if it uses direct API calls or proxy

Note: src/services/ai/GeminiClient.ts is ALREADY SAFE — the browser function (callGeminiFlashWithFailover at line 14) correctly routes through supabase.functions.invoke('chat-proxy'). The callGeminiDirect function at line 45 is only used by the bot-server (server-side), which is acceptable.

Produce a report that answers:
1. Which of the above files are actually imported and used in browser-side components (src/modules/*, src/components/*)?
2. Which files are only imported by server-side code (server/*)?
3. For each browser-exposed file, what proxy endpoint would be needed? (chat-proxy currently only supports Gemini text messages — it would need expansion for Groq and vision)
4. Are there any env vars starting with VITE_ that contain API keys or secrets?

Run: grep -rn "VITE_.*KEY\|VITE_.*SECRET\|VITE_.*TOKEN" src/ --include="*.ts" --include="*.tsx"

Write the report as a comment in the PR description. Do NOT modify any code.
```

---

## 📦 BATCH B — Cleanup (5 tasks, run after all Batch A merged)

---

### TASK B1: Update .gitignore Only

```
Append the following lines to the end of .gitignore. Do NOT remove any existing entries.

# === Binary assets (use CDN/external storage) ===
*.mp3
*.mp4
*.wav
*.pdf
*.psd

# Keep public/ assets tracked
!public/**

# === Orphan directories ===
NiagaHub-SuperApp/
agents-md-repo/
IQRA-POSTER/
nanobanana-output/
stitch_arabic_letter_practice/
winy/
downloads/

# === Build artifacts ===
_cleanup_*/
coverage/
playwright-report/
test-results/
.pytest_cache/
.wwebjs_auth/
.wwebjs_cache/

Only modify .gitignore. Do NOT run git rm or delete any files. Do NOT run npm commands.
```

---

### TASK B2: Untrack Orphan Directories

```
Remove orphan directories from git tracking. These directories exist in the repo but are not part of the QuranPulse application.

Run these commands:
  git rm -r --cached NiagaHub-SuperApp/ || true
  git rm -r --cached agents-md-repo/ || true

These are the only two safe to remove right now. NiagaHub-SuperApp is a completely separate project. agents-md-repo is agent configuration that doesn't belong in the app repo.

Do NOT touch any other directories.
Do NOT run npm commands.
Do NOT delete files from disk — git rm --cached only removes from tracking.

Verify with: git status
The files should show as "deleted" in staging but still exist on disk.
```

---

### TASK B3: npm Audit Fix (Safe Only)

```
Fix npm security vulnerabilities using ONLY safe fixes.

Step 1: Run npm audit and save the output
Step 2: Run npm audit fix (this applies only non-breaking fixes)
Step 3: Run npx tsc --noEmit to verify no new type errors
Step 4: Run npm run build to verify the build still works
Step 5: Run npm audit again and report the before/after count

Do NOT run npm audit fix --force. Only safe, non-breaking fixes.
If the build breaks after npm audit fix, revert the package-lock.json changes and report which package caused the issue.
```

---

### TASK B4: RLS Audit (New Migration File — Don't Edit Old Ones)

```
Audit Row Level Security across all Supabase migration files and create a NEW migration file with findings and fixes.

STEP 1 — Read ALL migration files in supabase/migrations/ and list:
- Which tables are created
- Whether each table has ALTER TABLE ... ENABLE ROW LEVEL SECURITY
- Whether each table has CREATE POLICY statements

STEP 2 — Create a NEW migration file (do NOT edit any existing migration files):
  supabase/migrations/20260228_rls_hardening_audit.sql

In this new file:
- Add a comment block at the top listing the full RLS audit results
- For any tables that are missing RLS, add:
  ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
- For admin-specific tables, add policies restricting to admin role:
  CREATE POLICY "admin_only_access" ON table_name FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPERADMIN')
      )
    );
- For user-specific tables, add policies that check auth.uid():
  CREATE POLICY "user_own_data" ON table_name FOR ALL
    USING (user_id = auth.uid());

IMPORTANT: Do NOT edit supabase/migrations/010_admin_tables.sql or any other existing migration. Only create the new file.
Do NOT run the migration. It will be reviewed and applied manually.
```

---

### TASK B5: Audit Stale Branches (Report Only — No Deletion)

```
This is an AUDIT task. Do NOT delete any branches.

List all remote branches and their status:
  git branch -a
  git log --oneline -1 origin/dependabot/npm_and_yarn/npm_and_yarn-4e59cccb31
  git log --oneline -1 origin/dependabot/pip/_archive/prototypes/asr_engine/pip-18a7a29121
  git log --oneline -1 origin/fix/google-oauth-redirect
  git log --oneline -1 origin/review-audit-report-11775922143938757404
  git log --oneline -1 origin/vercel/install-vercel-web-analytics-fx307t

For each branch, report:
1. Last commit date
2. Whether it has been merged into main (git branch -a --merged main)
3. Whether it has any unique commits not in main

Write the report as the PR description. Recommend which branches are safe to delete, but do NOT delete them. The owner will delete manually after reviewing the report.
```

---

## ✅ Execution Summary

| Task | Scope | Files | Risk |
|------|-------|:-----:|:----:|
| A1 | Compile fix | 1 | 🟢 Minimal |
| A2 | Admin auth | 3 | 🟡 Medium |
| A3 | CORS (critical 3 only) | 3 | 🟡 Medium |
| A4 | Error sanitization + CSP | 2 | 🟢 Low |
| A5 | AI exposure audit (no code changes) | 0 | 🟢 None |
| B1 | .gitignore only | 1 | 🟢 Minimal |
| B2 | Untrack 2 orphan dirs | 0 (git ops) | 🟢 Low |
| B3 | npm audit safe fix | package*.json | 🟡 Medium |
| B4 | RLS audit (new migration) | 1 new file | 🟢 Low |
| B5 | Branch audit (report only) | 0 | 🟢 None |

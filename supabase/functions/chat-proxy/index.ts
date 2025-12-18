import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- LOGGING UTILITY ---
const log = (level: "INFO" | "WARN" | "ERROR", message: string, meta?: any) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  }));
};

const maskKey = (key: string) => {
  if (!key || key.length < 8) return "****";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
};

serve(async (req) => {
  // 1. Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Validate Auth (Must be logged in)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // 3. Parse Request
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid request body");
    }

    // 4. Load Keys
    const keysString = Deno.env.get("GEMINI_API_KEYS") || "";
    const allKeys = keysString.split(",").map((k) => k.trim()).filter((k) => k);

    if (allKeys.length === 0) {
      log("ERROR", "Server misconfiguration: No API keys found.");
      throw new Error("Server configuration error.");
    }

    // --- ROTATION LOGIC START ---
    
    // Shuffle keys to distribute load initially
    let availableKeys = [...allKeys].sort(() => Math.random() - 0.5);
    
    let lastError = null;
    let success = false;
    let attempt = 0;
    let answer = "Maaf, tiada jawapan.";

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Retry Loop (Try up to 3 keys or until success)
    const MAX_RETRIES = Math.min(availableKeys.length, 3);

    while (attempt < MAX_RETRIES && !success) {
      const currentKey = availableKeys[attempt];
      const masked = maskKey(currentKey);
      
      log("INFO", `Attempt ${attempt + 1}/${MAX_RETRIES} using key ${masked}`);

      try {
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${currentKey}`;

        const response = await fetch(GEMINI_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: formattedContents,
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1024,
            }
          }),
        });

        if (!response.ok) {
            const status = response.status;
            
            // Handle Rate Limit (429) or Auth Error (403/401) -> Rotate
            if (status === 429 || status === 403 || status === 401) {
                log("WARN", `Key ${masked} failed with status ${status}. Rotating...`);
                attempt++;
                continue; // Try next key
            }

            // Handle Server Error (5xx) -> Don't rotate immediately, maybe backoff (simplified here to just throw for now)
            const errData = await response.json();
            throw new Error(`Gemini API Error: ${status} - ${JSON.stringify(errData)}`);
        }

        const data = await response.json();
        answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tiada jawapan.";
        success = true;
        log("INFO", `Success with key ${masked}`);

      } catch (e: any) {
        lastError = e;
        log("ERROR", `Request failed with key ${masked}: ${e.message}`);
        attempt++;
      }
    }

    if (!success) {
      log("ERROR", "All retry attempts failed.");
      throw lastError || new Error("Service temporarily unavailable (All keys exhausted).");
    }

    // --- ROTATION LOGIC END ---

    // 6. Return Response
    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
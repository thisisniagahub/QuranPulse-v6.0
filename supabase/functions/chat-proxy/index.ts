import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // 4. Load & Rotate Keys (Server-Side)
    const keysString = Deno.env.get("GEMINI_API_KEYS") || "";
    const keys = keysString.split(",").map((k) => k.trim()).filter((k) => k);

    if (keys.length === 0) {
      throw new Error("Server misconfiguration: No API keys found.");
    }

    // Simple Random Rotation to distribute load
    const selectedKey = keys[Math.floor(Math.random() * keys.length)];

    // 5. Call Gemini API
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${selectedKey}`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

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
        const errData = await response.json();
        console.error("Gemini Error:", errData);
        // TODO: Implement retry with different key if 429
        throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tiada jawapan.";

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

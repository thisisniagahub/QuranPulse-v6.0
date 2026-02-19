import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// --- CONFIGURATION ---
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- TYPES ---
interface RequestPayload {
  intent: "hadith" | "tafsir";
  query: string;
}

// --- CORS Headers Helper ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- CORE LOGIC ---
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { intent, query } = await req.json() as RequestPayload;
    const normalizedQuery = query.toLowerCase().trim();

    console.log(`🧠 [Sequential Thinking] Education Request: ${intent} -> "${normalizedQuery}"`);

    // 1. HADITH LOOKUP
    if (intent === "hadith") {
      // Use Full Text Search
      const { data, error } = await supabase
        .from('hadiths')
        .select('collection_name, hadith_number, title, content_translation, grade')
        .textSearch('search_vector', normalizedQuery)
        .limit(3);

      if (error) throw error;

      return new Response(JSON.stringify({
        source: 'internal_db',
        results: data || []
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. TAFSIR LOOKUP (Mock for now, until Tafsir DB is populated)
    if (intent === "tafsir") {
      // Simulate lookup
      return new Response(JSON.stringify({
        source: 'mock_tafsir',
        results: [{
          surah: "Al-Asr",
          verse: 1,
          tafsir: "Masa yang dimaksudkan adalah waktu asar atau masa secara umum di mana manusia sering kerugian melainkan mereka yang beriman."
        }]
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown Intent" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

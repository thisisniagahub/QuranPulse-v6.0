import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface RequestPayload {
  intent: "search" | "random" | "taddabur";
  query?: string;
  lang?: "ms" | "en";
}

serve(async (req) => {
  try {
    const { intent, query, lang = "ms" } = await req.json() as RequestPayload;
    console.log(`📖 [MCP Quran] Intent: ${intent}, Query: ${query}`);

    // 1. INTENT: SEARCH (Basic Full Text for MVP, upgrade to Vector later)
    if (intent === "search" && query) {
      // Search in Translations (using ILIKE for MVP, FTS is better for Prod)
      const { data: verses, error } = await supabase
        .from('translations')
        .select(`
          text,
          ayah_id,
          ayahs (
            ayah_number,
            surah_number,
            surahs (name_simple)
          )
        `)
        .ilike('text', `%${query}%`)
        .eq('language_code', lang)
        .limit(3);

      if (error) throw error;

      return new Response(JSON.stringify({
        source: 'db_search',
        results: verses?.map((v: any) => ({
          ref: `${v.ayahs.surahs.name_simple} ${v.ayahs.surah_number}:${v.ayahs.ayah_number}`,
          text: v.text
        })) || []
      }), { headers: { "Content-Type": "application/json" } });
    }

    // 2. INTENT: RANDOM / DAILY AYAH
    if (intent === "random") {
       // Get a random Ayah ID (approx max 6236)
       const randomId = Math.floor(Math.random() * 6236) + 1;
       const { data, error } = await supabase
        .from('ayahs')
        .select(`
            ayah_number,
            surah_number,
            text_uthmani,
            surahs (name_simple)
        `)
        .eq('id', randomId)
        .single();
        
        if (error) throw error;

        return new Response(JSON.stringify({
            source: 'random',
            data: {
                ref: `${data.surahs.name_simple} ${data.surah_number}:${data.ayah_number}`,
                arabic: data.text_uthmani
            }
        }), { headers: { "Content-Type": "application/json" } });
    }

    // 3. INTENT: TADABBUR (AI Reflection - Simulated for now)
    if (intent === "taddabur") {
        return new Response(JSON.stringify({
            source: 'static_taddabur',
            data: {
                title: "Reflection on Time",
                content: "Surah Al-Asr reminds us that time is our most precious capital. Are we investing it in Iman and Amal Saleh?"
            }
        }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid Intent" }), { status: 400 });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});

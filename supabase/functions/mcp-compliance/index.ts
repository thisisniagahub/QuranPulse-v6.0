import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// --- CONFIGURATION ---
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- TYPES ---
interface RequestPayload {
  type: "halal" | "fatwa";
  query: string;
  lang?: "ms" | "en";
}

interface ComplianceResponse {
  source: "cache" | "jakim_fatwa" | "jakim_halal";
  query: string;
  lang: string;
  status: "found" | "not_found" | "error";
  data: {
    title?: string;
    ruling?: string; 
    reference_url?: string;
    date?: string;
  };
}

// --- CORE LOGIC ---
serve(async (req) => {
  try {
    const { type, query, lang = "ms" } = await req.json() as RequestPayload;
    
    if (!query || query.length < 3) {
      return new Response(JSON.stringify({ error: "Query too short" }), { status: 400 });
    }

    const normalizedQuery = query.toLowerCase().trim();
    const cacheKey = `compliance:${type}:${lang}:${normalizedQuery}`;

    console.log(`🧠 [Sequential Thinking] Step 1: Processing ${type} (${lang}) request for "${normalizedQuery}"`);

    // 2. STATE TRANSITION: CHECK CACHE
    const { data: cachedData } = await supabase
      .from("external_api_cache")
      .select("data")
      .eq("key", cacheKey)
      .single();

    if (cachedData) {
      console.log(`✅ [Sequential Thinking] Cache HIT.`);
      return new Response(JSON.stringify({ ...cachedData.data, source: "cache" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. STATE TRANSITION: SEARCH EXTERNAL
    let result: ComplianceResponse;

    // Simulation of multi-language response logic
    if (type === "fatwa") {
      if (normalizedQuery.includes("forex")) {
        result = {
          source: "jakim_fatwa",
          query: normalizedQuery,
          lang,
          status: "found",
          data: {
            title: lang === "ms" ? "Hukum Forex" : "Forex Trading Ruling",
            ruling: lang === "ms" 
              ? "Haram kerana melibatkan elemen riba dan gharar." 
              : "Prohibited (Haram) due to elements of usury (riba) and uncertainty (gharar).",
            reference_url: "http://e-smaf.islam.gov.my/",
            date: "2012-02-15"
          }
        };
      } else {
        result = { source: "jakim_fatwa", query: normalizedQuery, lang, status: "not_found", data: {} };
      }
    } else {
       result = { source: "jakim_halal", query: normalizedQuery, lang, status: "not_found", data: { ruling: "Check Halal Portal" } };
    }
    console.timeEnd("⏱️ External-Search");

    // 4. STATE TRANSITION: WRITE CACHE
    if (result.status === "found") {
      console.log(`💾 [Sequential Thinking] Step 4: Writing to Cache...`);
      // Cache fatwa for 7 days (static data)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await supabase.from("external_api_cache").upsert({
        key: cacheKey,
        data: result,
        source: result.source,
        expires_at: expiresAt.toISOString(),
      });
    }

    // 5. FINAL RESPONSE
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ [Sequential Thinking] Error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});

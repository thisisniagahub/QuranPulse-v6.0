import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { PrayerTimes, Coordinates, CalculationMethod } from "https://esm.sh/adhan@4.4.3";

// --- CONFIGURATION ---
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const JAKIM_API_URL = "https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=";

// Initialize Supabase Client (Service Role for Cache Write Access)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- TYPES ---
interface RequestPayload {
  zone?: string; // e.g., "WLP01" (Kuala Lumpur)
  lat?: number;
  lng?: number;
  date?: string; // YYYY-MM-DD
}

interface WorshipResponse {
  source: "cache" | "jakim" | "calculation";
  zone: string;
  date: string;
  times: {
    imsak: string;
    subuh: string;
    syuruk: string;
    zohor: string;
    asar: string;
    maghrib: string;
    isyak: string;
  };
  hijri?: string;
}

// --- CORE LOGIC ---

// CORS Headers Helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-name',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. INPUT VALIDATION
    const { zone = "WLP01", lat, lng, date } = await req.json() as RequestPayload;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = `solat:${zone}:${targetDate}`;

    console.log(`🧠 [Sequential Thinking] Step 1: Request received for ${zone} on ${targetDate}`);

    // 2. STATE TRANSITION: CHECK CACHE
    console.time("⏱️ Cache-Lookup");
    const { data: cachedData } = await supabase
      .from("external_api_cache")
      .select("data")
      .eq("key", cacheKey)
      .single();
    console.timeEnd("⏱️ Cache-Lookup");

    if (cachedData) {
      console.log(`✅ [Sequential Thinking] Cache HIT.`);
      return new Response(JSON.stringify({ ...cachedData.data, source: "cache" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. STATE TRANSITION: FETCH EXTERNAL (JAKIM)
    console.log(`⚠️ [Sequential Thinking] Cache MISS. Fetching JAKIM...`);
    console.time("⏱️ JAKIM-Fetch");
    let result: WorshipResponse | null = null;

    try {
      const response = await fetch(`${JAKIM_API_URL}${zone}`);
      const json = await response.json();
      console.timeEnd("⏱️ JAKIM-Fetch");

      if (json.status === "OK!" && json.prayerTime && json.prayerTime.length > 0) {
        const pt = json.prayerTime[0];
        result = {
          source: "jakim",
          zone: zone,
          date: targetDate,
          hijri: pt.hijri,
          times: {
            imsak: pt.imsak,
            subuh: pt.fajr,
            syuruk: pt.syuruk,
            zohor: pt.dhuhr,
            asar: pt.asr,
            maghrib: pt.maghrib,
            isyak: pt.isha,
          },
        };
      } else {
        throw new Error("Invalid JAKIM response");
      }
    } catch (err) {
      console.error(`❌ [Sequential Thinking] JAKIM Fetch Failed:`, err);

      // 4. STATE TRANSITION: FAILOVER CALCULATION (Adhan.js)
      if (lat && lng) {
        console.log(`🔄 [Sequential Thinking] Fallback: Calculating locally using Adhan.js`);
        const coordinates = new Coordinates(lat, lng);
        const params = CalculationMethod.Singapore(); // Closest to JAKIM standard
        const dateObj = new Date(targetDate);
        const prayerTimes = new PrayerTimes(coordinates, dateObj, params);

        result = {
          source: "calculation",
          zone: zone,
          date: targetDate,
          times: {
            imsak: prayerTimes.imsak.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            subuh: prayerTimes.fajr.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            syuruk: prayerTimes.sunrise.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            zohor: prayerTimes.dhuhr.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            asar: prayerTimes.asr.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            maghrib: prayerTimes.maghrib.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            isyak: prayerTimes.isha.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          },
        };
      } else {
        return new Response(
          JSON.stringify({ error: "JAKIM down and no coordinates provided for fallback" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 5. STATE TRANSITION: WRITE CACHE (Thread Safe-ish via Upsert)
    if (result) {
      console.log(`💾 [Sequential Thinking] Step 5: Writing to Cache...`);
      // Expire cache at midnight next day
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);
      expiresAt.setHours(0, 0, 0, 0);

      await supabase.from("external_api_cache").upsert({
        key: cacheKey,
        data: result,
        source: result.source,
        expires_at: expiresAt.toISOString(),
      });
    }

    // 6. FINAL RESPONSE
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

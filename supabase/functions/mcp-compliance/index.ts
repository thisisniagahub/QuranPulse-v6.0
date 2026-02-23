import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { type, query, lang = "ms" } = await req.json();

        if (!query || query.length < 3) {
            return new Response(JSON.stringify({ error: "Query too short" }), { status: 400, headers: corsHeaders });
        }

        const systemInstruction = `AMARAN: Anta adalah FATWA GUARD. Jika soalan melibatkan hukum hakam hudud, fiqh kritikal atau fatwa kompleks, WAJIB rujuk e-SMAF JAKIM. Jika tiada dalil, mengaku tidak tahu. Jawab dalam bahasa ${lang === 'ms' ? 'Melayu' : 'Inggeris'}.`;

        console.log(`🧠 [mcp-compliance] processing query via OpenClaw: ${query}`);

        // OpenClaw routing (No Gemini keys used here)
        const openclawUrl = Deno.env.get("OPENCLAW_URL") || "https://operator.gangniaga.my/v1/chat/completions";
        const openclawKey = Deno.env.get("OPENCLAW_API_KEY") || "dummy-key";

        const response = await fetch(openclawUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openclawKey}`
            },
            body: JSON.stringify({
                model: "antigravity",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: query }
                ],
                temperature: 0.2,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`OpenClaw Error ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content || "Harap maaf, tiada maklum balas daripada OpenClaw.";

        const output = {
            source: "openclaw_fatwa_guard",
            query: query,
            lang: lang,
            status: "found",
            data: {
                ruling: responseText,
                reference_url: "http://e-smaf.islam.gov.my/"
            }
        };

        return new Response(JSON.stringify(output), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (err: any) {
        console.error("❌ [mcp-compliance] Error:", err.message);
        return new Response(JSON.stringify({ error: String(err.message) }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});

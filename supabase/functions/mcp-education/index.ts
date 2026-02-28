import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const ALLOWED_ORIGINS = [
    'https://quranpulse.my',
    'https://www.quranpulse.my',
    'http://localhost:5173',
    'http://localhost:3000',
];

function getCorsHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    };
    const origin = req.headers.get('origin') ?? '';
    if (ALLOWED_ORIGINS.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }
    return headers;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: getCorsHeaders(req) });
    }

    try {
        const { query, lang = "ms" } = await req.json();

        if (!query || query.length < 3) {
            return new Response(JSON.stringify({ error: "Query too short" }), { status: 400, headers: getCorsHeaders(req) });
        }

        const systemInstruction = `Anta adalah Mufassir AI. Berikan tafsir ringkas dan pengajaran ayat/hadis berdasarkan sumber sahih (Tafsir Ibn Kathir, Sahih Bukhari). Jawab dalam bahasa ${lang === 'ms' ? 'Melayu' : 'Inggeris'} dengan nada mendidik dan tenang.`;

        console.log(`🧠 [mcp-education] processing query via OpenClaw: ${query}`);

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
                temperature: 0.3,
                max_tokens: 1536
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`OpenClaw Error ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content || "Harap maaf, tiada maklum balas daripada OpenClaw.";

        const output = {
            source: "openclaw_mufassir",
            query: query,
            lang: lang,
            status: "found",
            data: {
                tafsir: responseText,
                source_reference: "Al-Quran & Hadith Sahih"
            }
        };

        return new Response(JSON.stringify(output), {
            headers: { {...getCorsHeaders(req), "Content-Type": "application/json" },
        });

    } catch (err: any) {
        console.error("❌ [mcp-education] Error:", err.message);
        return new Response(JSON.stringify({ error: String(err.message) }), {
            status: 500,
            headers: { {...getCorsHeaders(req), "Content-Type": "application/json" }
        });
    }
});

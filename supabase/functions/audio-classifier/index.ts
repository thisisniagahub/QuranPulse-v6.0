import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const HF_API_URL = "https://api-inference.huggingface.co/models/HamzaSidhu786/arabic-alphabet-speech-classification";

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
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: getCorsHeaders(req) })
    }

    try {
        const formData = await req.formData();
        const audioFile = formData.get('file');

        if (!audioFile) {
            return new Response(
                JSON.stringify({ error: 'No file uploaded' }),
                { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }, status: 400 }
            )
        }

// Retrieve HF_TOKEN from environment
const hfToken = Deno.env.get('HF_TOKEN');
if (!hfToken) {
    console.error("Missing HF_TOKEN");
    return new Response(
        JSON.stringify({ error: 'Server misconfiguration: Missing AI Token' }),
        { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }, status: 500 }
            )
        }

console.log(`Received audio file. Size: ${(audioFile as Blob).size} bytes. forwarding to HF...`);

// Forward to Hugging Face
const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "audio/webm", // Hint content type, though binary body usually works
    },
    body: audioFile,
});

if (!response.ok) {
    const errorText = await response.text();
    console.error("HF Error:", response.status, errorText);
    return new Response(
        JSON.stringify({ error: `AI Provider Error: ${response.statusText}`, details: errorText }),
        { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }, status: 502 }
            );
        }

const result = await response.json();
console.log("AI Result:", result);

return new Response(
    JSON.stringify(result),
    { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }, status: 200 }
)

    } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})

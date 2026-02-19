import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const HF_API_URL = "https://api-inference.huggingface.co/models/HamzaSidhu786/arabic-alphabet-speech-classification";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const formData = await req.formData();
        const audioFile = formData.get('file');

        if (!audioFile) {
            return new Response(
                JSON.stringify({ error: 'No file uploaded' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Retrieve HF_TOKEN from environment
        const hfToken = Deno.env.get('HF_TOKEN');
        if (!hfToken) {
            console.error("Missing HF_TOKEN");
            return new Response(
                JSON.stringify({ error: 'Server misconfiguration: Missing AI Token' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
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
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
            );
        }

        const result = await response.json();
        console.log("AI Result:", result);

        return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        console.error("Edge Function Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})

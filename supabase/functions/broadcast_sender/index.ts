import { serve } from 'https://deno.land/std@0.171.0/http/server.ts';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
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

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  try {
    const body = await req.json();
    const { topic, event, payload } = body;
    if (!topic || !event) return new Response(JSON.stringify({ error: 'topic and event required' }), { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/realtime/v1/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ topic, event, payload }),
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
    });
  } catch (err) {
  console.error(err);
  return new Response(JSON.stringify({ error: String(err) }), {
    status: 500,
    headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
    });
  }
});
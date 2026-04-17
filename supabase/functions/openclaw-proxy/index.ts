import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ALLOWED_ORIGINS = [
  'https://quranpulse.my',
  'https://www.quranpulse.my',
  'http://localhost:5173',
  'http://localhost:3000',
];

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ProxyRequest =
  | {
      intent: 'chat_completion';
      messages: ChatMessage[];
      model?: string;
      stream?: boolean;
      temperature?: number;
      max_tokens?: number;
    }
  | {
      intent: 'hook_request';
      hookPath: string;
      payload?: Record<string, unknown>;
      sessionKey?: string;
    }
  | {
      intent: 'health_check';
    }
  | {
      intent: 'audio_speech';
      input: string;
      voice?: string;
      model?: string;
      response_format?: string;
    }
  | {
      intent: 'audio_transcription';
      audio_base64: string;
      mime_type?: string;
      model?: string;
      language?: string;
    };

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

function getGatewayHeaders(): HeadersInit {
  const token = Deno.env.get('OPENCLAW_TOKEN');

  if (!token) {
    throw new Error('OPENCLAW_TOKEN is not configured.');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function getGatewayUrl(path: string): string {
  const baseUrl = Deno.env.get('OPENCLAW_URL') || 'https://operator.gangniaga.my';
  return `${baseUrl}${path}`;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as ProxyRequest;

    switch (body.intent) {
      case 'chat_completion': {
        const upstream = await fetch(getGatewayUrl('/v1/chat/completions'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getGatewayHeaders(),
          },
          body: JSON.stringify({
            model: body.model || 'google-antigravity/gemini-3-flash',
            messages: body.messages,
            stream: body.stream || false,
            temperature: body.temperature ?? 0.7,
            max_tokens: body.max_tokens ?? 2048,
          }),
        });

        if (!upstream.ok) {
          const errorText = await upstream.text().catch(() => 'Unknown gateway error');
          return new Response(JSON.stringify({ error: errorText }), {
            status: upstream.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (body.stream) {
          return new Response(upstream.body, {
            status: upstream.status,
            headers: {
              ...corsHeaders,
              'Content-Type': upstream.headers.get('content-type') || 'text/event-stream',
              'Cache-Control': 'no-cache',
            },
          });
        }

        const text = await upstream.text();
        return new Response(text, {
          status: upstream.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'hook_request': {
        const upstream = await fetch(getGatewayUrl(`/hooks/${body.hookPath}`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getGatewayHeaders(),
          },
          body: JSON.stringify({
            ...(body.payload || {}),
            ...(body.sessionKey ? { sessionKey: body.sessionKey } : {}),
          }),
        });

        const text = await upstream.text();
        return new Response(text, {
          status: upstream.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'health_check': {
        const upstream = await fetch(getGatewayUrl('/health'), {
          method: 'GET',
          headers: getGatewayHeaders(),
        });

        return new Response(JSON.stringify({ ok: upstream.ok, status: upstream.status }), {
          status: upstream.ok ? 200 : upstream.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'audio_speech': {
        const upstream = await fetch(getGatewayUrl('/v1/audio/speech'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getGatewayHeaders(),
          },
          body: JSON.stringify({
            model: body.model || 'gpt-4o-mini-tts',
            input: body.input,
            voice: body.voice || 'nova',
            response_format: body.response_format || 'mp3',
          }),
        });

        if (!upstream.ok) {
          const errorText = await upstream.text().catch(() => 'Unknown gateway error');
          return new Response(JSON.stringify({ error: errorText }), {
            status: upstream.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const bytes = new Uint8Array(await upstream.arrayBuffer());
        return new Response(
          JSON.stringify({
            audio_base64: encodeBase64(bytes),
            content_type: upstream.headers.get('content-type') || 'audio/mpeg',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'audio_transcription': {
        const audioBytes = decodeBase64(body.audio_base64);
        const audioBlob = new Blob([audioBytes], {
          type: body.mime_type || 'audio/webm',
        });

        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('model', body.model || 'gpt-4o-mini-transcribe');
        formData.append('language', body.language || 'ar');

        const upstream = await fetch(getGatewayUrl('/v1/audio/transcriptions'), {
          method: 'POST',
          headers: getGatewayHeaders(),
          body: formData,
        });

        const text = await upstream.text();
        return new Response(text, {
          status: upstream.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown intent' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown proxy error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

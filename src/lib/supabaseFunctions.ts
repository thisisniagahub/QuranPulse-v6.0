import { supabase } from './supabase';
import { getEnv } from '../utils/env';

interface FunctionRequestOptions {
  body?: BodyInit | null;
  headers?: HeadersInit;
  method?: 'GET' | 'POST';
  signal?: AbortSignal;
}

async function getFunctionHeaders(extraHeaders?: HeadersInit): Promise<Headers> {
  const anonKey = getEnv('VITE_SUPABASE_ANON_KEY');
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;

  const headers = new Headers(extraHeaders);
  if (anonKey) {
    headers.set('apikey', anonKey);
  }

  headers.set('Authorization', `Bearer ${accessToken || anonKey}`);
  return headers;
}

export function getFunctionUrl(functionName: string): string {
  const supabaseUrl = getEnv('VITE_SUPABASE_URL');

  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is required to call Supabase Edge Functions.');
  }

  return `${supabaseUrl}/functions/v1/${functionName}`;
}

export async function fetchFunction(
  functionName: string,
  options: FunctionRequestOptions = {}
): Promise<Response> {
  const headers = await getFunctionHeaders(options.headers);

  return fetch(getFunctionUrl(functionName), {
    method: options.method || 'POST',
    headers,
    body: options.body,
    signal: options.signal,
  });
}

export async function invokeFunctionJson<TResponse>(
  functionName: string,
  payload: unknown,
  signal?: AbortSignal
): Promise<TResponse> {
  const response = await fetchFunction(functionName, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`${functionName} failed with ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<TResponse>;
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

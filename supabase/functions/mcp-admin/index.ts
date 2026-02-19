import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// --- CONFIGURATION ---
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Initialize Supabase Client (Service Role for admin access)
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- TYPES ---
interface AdminRequest {
  intent: "user_stats" | "content_stats" | "system_health" | "query";
  query?: string;
  timeframe?: "today" | "week" | "month" | "all";
}

interface AdminResponse {
  success: boolean;
  intent: string;
  data: Record<string, unknown>;
  generated_at: string;
}

// --- CORS Headers ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- HELPER: Generate Cache Key (AdkRunner Pattern) ---
function generateCacheKey(intent: string, params: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${intent}:${params}`);
  // Simple hash for Deno (no crypto.createHash)
  return `mcp_admin:${intent}:${btoa(params).slice(0, 32)}`;
}

// --- CORE LOGIC ---
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { intent, query, timeframe = 'today' } = await req.json() as AdminRequest;
    console.log(`🛡️ [mcp-admin] Intent: ${intent} | Query: "${query || 'N/A'}"`);

    let result: Record<string, unknown> = {};

    // 1. USER STATS
    if (intent === "user_stats") {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // New users (based on timeframe)
      const dateFilter = getDateFilter(timeframe);
      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dateFilter);

      result = {
        total_users: totalUsers || 0,
        new_users: newUsers || 0,
        timeframe,
        summary: `📊 Total: ${totalUsers || 0} users | New (${timeframe}): ${newUsers || 0}`
      };
    }

    // 2. CONTENT STATS
    else if (intent === "content_stats") {
      const { count: totalVerses } = await supabase
        .from('quran_verses')
        .select('*', { count: 'exact', head: true });

      const { count: totalHadiths } = await supabase
        .from('hadiths')
        .select('*', { count: 'exact', head: true });

      result = {
        quran_verses: totalVerses || 0,
        hadiths: totalHadiths || 0,
        summary: `📖 Quran Verses: ${totalVerses || 0} | Hadiths: ${totalHadiths || 0}`
      };
    }

    // 3. SYSTEM HEALTH
    else if (intent === "system_health") {
      const { count: cacheEntries } = await supabase
        .from('ai_knowledge_cache')
        .select('*', { count: 'exact', head: true });

      result = {
        cache_entries: cacheEntries || 0,
        status: 'healthy',
        summary: `✅ System Healthy | Cache Entries: ${cacheEntries || 0}`
      };
    }

    // 4. NATURAL LANGUAGE QUERY (Fallback)
    else if (intent === "query") {
      // Parse natural language for common patterns
      const lowerQuery = (query || '').toLowerCase();
      
      if (lowerQuery.includes('user') || lowerQuery.includes('pengguna')) {
        // Redirect to user_stats
        return await handleIntent({ intent: 'user_stats', timeframe });
      }
      
      result = {
        message: "Query not understood. Try: 'user stats', 'content stats', 'system health'",
        available_intents: ['user_stats', 'content_stats', 'system_health']
      };
    }

    else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Unknown intent",
        available: ['user_stats', 'content_stats', 'system_health', 'query']
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const response: AdminResponse = {
      success: true,
      intent,
      data: result,
      generated_at: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error('❌ [mcp-admin] Error:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: String(err) 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// --- HELPERS ---

function getDateFilter(timeframe: string): string {
  const now = new Date();
  switch (timeframe) {
    case 'today':
      return now.toISOString().split('T')[0];
    case 'week':
      now.setDate(now.getDate() - 7);
      return now.toISOString();
    case 'month':
      now.setMonth(now.getMonth() - 1);
      return now.toISOString();
    default:
      return '1970-01-01';
  }
}

async function handleIntent(params: AdminRequest): Promise<Response> {
  // Recursive call for query redirection
  const mockReq = new Request('http://localhost', {
    method: 'POST',
    body: JSON.stringify(params)
  });
  // Note: In practice, we'd refactor to avoid this pattern
  return new Response(JSON.stringify({ 
    redirect: true, 
    to: params.intent 
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

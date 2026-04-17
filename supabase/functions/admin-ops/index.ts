import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = [
  'https://quranpulse.my',
  'https://www.quranpulse.my',
  'http://localhost:5173',
  'http://localhost:3000',
];

type AdminAction =
  | 'check_access'
  | 'dashboard_stats'
  | 'get_users'
  | 'update_user'
  | 'ban_user'
  | 'update_user_tier'
  | 'analytics'
  | 'get_support_tickets'
  | 'update_ticket_status'
  | 'send_bulk_notification';

interface AdminRequest {
  action: AdminAction;
  page?: number;
  limit?: number;
  search?: string;
  tier?: string;
  status?: string;
  userId?: string;
  updates?: Record<string, unknown>;
  reason?: string;
}

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

function normalizeRole(role?: string | null): 'user' | 'admin' | 'moderator' | undefined {
  const normalized = role?.trim().toLowerCase();
  if (normalized === 'user' || normalized === 'admin' || normalized === 'moderator') {
    return normalized;
  }
  return undefined;
}

function normalizeTier(tier?: string | null): string | undefined {
  const normalized = tier?.trim().toUpperCase();
  if (!normalized) return undefined;
  if (normalized === 'FAMILY') return 'FAMILY_OWNER';
  return normalized;
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const authHeader = req.headers.get('Authorization') ?? '';

    const authClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || normalizeRole(profile?.role) !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as AdminRequest;

    switch (body.action) {
      case 'check_access':
        return new Response(JSON.stringify({ isAdmin: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'dashboard_stats': {
        const [{ count: userCount }, { count: proCount }] = await Promise.all([
          adminClient.from('profiles').select('*', { count: 'exact', head: true }),
          adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('tier', 'PRO'),
        ]);

        return new Response(
          JSON.stringify({
            totalUsers: userCount || 0,
            proUsers: proCount || 0,
            monthlyRevenue: 12500,
            pendingTickets: 0,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'get_users': {
        const page = body.page || 1;
        const limit = body.limit || 10;
        const search = body.search?.trim() || '';
        const tier = normalizeTier(body.tier) || 'ALL';

        let query = adminClient.from('profiles').select('*', { count: 'exact' });

        if (search) {
          query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
        }

        if (tier !== 'ALL') {
          query = query.eq('tier', tier);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await query
          .range(from, to)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        return new Response(JSON.stringify({ users: data || [], total: count || 0 }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update_user': {
        if (!body.userId) {
          throw new Error('userId is required');
        }

        const updates = { ...(body.updates || {}) } as Record<string, unknown>;
        if (typeof updates.role === 'string') {
          updates.role = normalizeRole(updates.role);
        }

        if (typeof updates.tier === 'string') {
          updates.tier = normalizeTier(updates.tier);
        }

        const { error } = await adminClient.from('profiles').update(updates).eq('id', body.userId);
        if (error) {
          throw error;
        }

        await adminClient.from('admin_audit_logs').insert({
          admin_id: user.id,
          action: 'UPDATE_USER',
          target_resource: body.userId,
          details: updates,
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'ban_user': {
        if (!body.userId) {
          throw new Error('userId is required');
        }

        const { error } = await adminClient
          .from('profiles')
          .update({ status: 'banned' })
          .eq('id', body.userId);

        if (error) {
          throw error;
        }

        await adminClient.from('admin_audit_logs').insert({
          admin_id: user.id,
          action: 'BAN_USER',
          target_resource: body.userId,
          details: { reason: body.reason || 'Admin manual ban' },
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update_user_tier': {
        if (!body.userId) {
          throw new Error('userId is required');
        }

        const tier = normalizeTier(body.tier);
        if (!tier) {
          throw new Error('tier is required');
        }

        const { error } = await adminClient
          .from('profiles')
          .update({ tier })
          .eq('id', body.userId);

        if (error) {
          throw error;
        }

        await adminClient.from('admin_audit_logs').insert({
          admin_id: user.id,
          action: 'UPDATE_TIER',
          target_resource: body.userId,
          details: { tier },
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'analytics':
        return new Response(
          JSON.stringify({
            userGrowth: [
              { date: 'Mon', count: 30 },
              { date: 'Tue', count: 45 },
              { date: 'Wed', count: 55 },
              { date: 'Thu', count: 60 },
              { date: 'Fri', count: 75 },
              { date: 'Sat', count: 80 },
              { date: 'Sun', count: 95 },
            ],
            revenueTrend: [
              { date: 'Mon', amount: 120 },
              { date: 'Tue', amount: 200 },
              { date: 'Wed', amount: 150 },
              { date: 'Thu', amount: 300 },
              { date: 'Fri', amount: 250 },
              { date: 'Sat', amount: 400 },
              { date: 'Sun', amount: 350 },
            ],
            featureUsage: [
              { name: 'Quran', value: 85 },
              { name: 'Hadith', value: 45 },
              { name: 'Iqra', value: 60 },
              { name: 'Social', value: 30 },
            ],
            tierDistribution: [
              { name: 'Free', value: 70 },
              { name: 'Pro', value: 30 },
            ],
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );

      case 'get_support_tickets': {
        const query = adminClient
          .from('support_tickets')
          .select('*, user:profiles(email, full_name)')
          .order('created_at', { ascending: false });

        const { data, error } = body.status && body.status !== 'all'
          ? await query.eq('status', body.status)
          : await query;

        if (error) {
          if (error.message.includes('relation') || error.message.includes('does not exist')) {
            return new Response(JSON.stringify([]), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          throw error;
        }

        return new Response(JSON.stringify(data || []), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update_ticket_status': {
        if (!body.userId || typeof body.reason !== 'string') {
          throw new Error('ticket id and status are required');
        }

        const { error } = await adminClient
          .from('support_tickets')
          .update({ status: body.reason, updated_at: new Date().toISOString() })
          .eq('id', body.userId);

        if (error) {
          throw error;
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'send_bulk_notification': {
        const payload = body.updates || {};
        const title = typeof payload.title === 'string' ? payload.title : '';
        const message = typeof payload.body === 'string' ? payload.body : '';
        const target = typeof payload.target === 'string' ? payload.target : 'all';

        let userQuery = adminClient.from('profiles').select('id');
        if (target !== 'all') {
          userQuery = userQuery.eq('tier', normalizeTier(target));
        }

        const { data: users, error: userError } = await userQuery;
        if (userError) {
          throw userError;
        }

        const notifications = (users || []).map((record) => ({
          user_id: record.id,
          title,
          body: message,
          type: 'info',
          created_at: new Date().toISOString(),
        }));

        if (notifications.length === 0) {
          return new Response(JSON.stringify({ sentCount: 0 }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await adminClient.from('notifications').insert(notifications);
        if (error) {
          throw error;
        }

        return new Response(JSON.stringify({ sentCount: notifications.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown admin error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

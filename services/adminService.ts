import { supabase } from '../src/lib/supabase';

export const adminService = {
  // Check if current user is admin
  isAdmin: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check against env var or database role
    const adminIds = import.meta.env.VITE_ADMIN_USER_IDS?.split(',') || [];
    if (adminIds.includes(user.id)) return true;

    // Fallback to checking user metadata or role table if implemented
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    return data?.role === 'ADMIN';
  },

  // Get Dashboard Statistics
  getDashboardStats: async () => {
    // In a real app, these would be optimized queries or RPC calls
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: proCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('tier', 'PRO');
    const { count: ticketCount } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open');
    
    // Mock revenue for now as payments table might be empty
    const revenue = 12500; 

    return {
      totalUsers: userCount || 0,
      proUsers: proCount || 0,
      monthlyRevenue: revenue,
      pendingTickets: ticketCount || 0
    };
  },

  // Get Users with Pagination & Filtering
  getUsers: async (page = 1, limit = 10, search = '', tier = 'ALL') => {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

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

    if (error) throw error;

    return { users: data, total: count };
  },

  // Get Analytics Data
  getAnalytics: async (period = '7d') => {
    // Mock data for charts - in production use 'user_events' aggregation
    return {
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
      ]
    };
  },

  // Support Ticket Management
  getSupportTickets: async (status = 'all') => {
    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        user:profiles(email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  updateTicketStatus: async (ticketId: string, status: string) => {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status, updated_at: new Date() })
      .eq('id', ticketId);
    
    if (error) throw error;
  },

  // Send Notification
  sendBulkNotification: async (title: string, body: string, target: 'all' | 'pro' | 'free') => {
    // In a real app, this would trigger an Edge Function to send push notifications
    // For now, we log it to the notifications table
    
    // 1. Get target users
    let userQuery = supabase.from('profiles').select('id');
    if (target !== 'all') {
      userQuery = userQuery.eq('tier', target.toUpperCase());
    }
    
    const { data: users } = await userQuery;
    if (!users) return;

    // 2. Insert notifications
    const notifications = users.map(u => ({
      user_id: u.id,
      title,
      body,
      type: 'info',
      created_at: new Date()
    }));

    const { error } = await supabase.from('notifications').insert(notifications);
    if (error) throw error;
    
    return { sentCount: users.length };
  }
};

import { invokeFunctionJson } from '@/lib/supabaseFunctions';
import { isAdminRole, normalizeRole } from '@/lib/authz';

interface DashboardStats {
  totalUsers: number;
  proUsers: number;
  monthlyRevenue: number;
  pendingTickets: number;
}

interface AdminUsersResponse<TUser> {
  users: TUser[];
  total: number;
}

interface AdminServiceUserUpdates {
  full_name?: string;
  email?: string;
  role?: string;
  tier?: string;
}

export const adminService = {
  async isAdmin() {
    const data = await invokeFunctionJson<{ isAdmin: boolean }>('admin-ops', {
      action: 'check_access',
    });

    return data.isAdmin;
  },

  async getDashboardStats() {
    return invokeFunctionJson<DashboardStats>('admin-ops', {
      action: 'dashboard_stats',
    });
  },

  async getUsers<TUser = unknown>(page = 1, limit = 10, search = '', tier = 'ALL') {
    return invokeFunctionJson<AdminUsersResponse<TUser>>('admin-ops', {
      action: 'get_users',
      page,
      limit,
      search,
      tier,
    });
  },

  async updateUser(userId: string, updates: AdminServiceUserUpdates) {
    const normalizedUpdates = {
      ...updates,
      ...(updates.role ? { role: normalizeRole(updates.role) } : {}),
    };

    await invokeFunctionJson<{ success: boolean }>('admin-ops', {
      action: 'update_user',
      userId,
      updates: normalizedUpdates,
    });
  },

  async banUser(userId: string, reason: string) {
    await invokeFunctionJson<{ success: boolean }>('admin-ops', {
      action: 'ban_user',
      userId,
      reason,
    });
  },

  async updateUserTier(userId: string, tier: 'FREE' | 'PRO' | 'FAMILY') {
    await invokeFunctionJson<{ success: boolean }>('admin-ops', {
      action: 'update_user_tier',
      userId,
      tier,
    });
  },

  async getAnalytics(_period = '7d') {
    return invokeFunctionJson('admin-ops', {
      action: 'analytics',
    });
  },

  async getSupportTickets(status = 'all') {
    return invokeFunctionJson('admin-ops', {
      action: 'get_support_tickets',
      status,
    });
  },

  async updateTicketStatus(ticketId: string, status: string) {
    await invokeFunctionJson<{ success: boolean }>('admin-ops', {
      action: 'update_ticket_status',
      userId: ticketId,
      reason: status,
    });
  },

  async sendBulkNotification(title: string, body: string, target: 'all' | 'pro' | 'free') {
    return invokeFunctionJson<{ sentCount: number }>('admin-ops', {
      action: 'send_bulk_notification',
      updates: { title, body, target },
    });
  },

  isAdminRole,
};

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// HARDCODED SUPERADMINS (Safety Net)
const SUPER_ADMINS = [
  'dev@qp.com',
  'megat@quranpulse.my', 
  'admin@quranpulse.my'
];

interface AdminRouteProps {
  children?: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const verifyAccess = async () => {
      if (!user) {
        if (mounted) setIsAuthorized(false);
        return;
      }

      // 1. Level 1 Check: Email Whitelist (Fastest & Safest)
      if (user.email && SUPER_ADMINS.includes(user.email)) {
        if (mounted) setIsAuthorized(true);
        return;
      }

      // 2. Level 2 Check: Database Role (Requires DB trip)
      try {
        // We re-fetch user to ensure token isn't stale
        const { data: { user: freshUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !freshUser) {
           throw new Error('Auth session invalid');
        }

        const { data: profile, error: dbError } = await supabase
          .from('profiles')
          .select('role') // We use 'role' column specifically for RBAC
          .eq('id', freshUser.id)
          .single();

        if (dbError) {
            console.warn('AdminRoute: DB check failed', dbError);
            if (mounted) setIsAuthorized(false);
            return;
        }

        if (profile?.role === 'ADMIN' || profile?.role === 'SUPERADMIN') {
          if (mounted) setIsAuthorized(true);
        } else {
          if (mounted) setIsAuthorized(false);
        }

      } catch (err) {
        console.error('Admin verification failed:', err);
        if (mounted) setIsAuthorized(false);
      }
    };

    if (!isLoading) {
      verifyAccess();
    }

    return () => { mounted = false; };
  }, [user, isLoading]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-raudhah-teal font-mono gap-4">
        <div className="w-12 h-12 border-4 border-raudhah-teal/20 border-t-teal-500 rounded-full animate-spin"></div>
        <p className="animate-pulse tracking-widest text-xs">VERIFYING CLEARANCE LEVEL 5...</p>
      </div>
    );
  }

  return isAuthorized ? <>{children ? children : <Outlet />}</> : <Navigate to="/" replace />;
};

export default AdminRoute;
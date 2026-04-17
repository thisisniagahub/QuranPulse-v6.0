import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { adminService } from '@/services/adminService';

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

      try {
        const hasAccess = await adminService.isAdmin();
        if (mounted) setIsAuthorized(hasAccess);
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

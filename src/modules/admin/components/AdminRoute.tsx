import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const AdminRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      // Check 'profiles' table for role
      // Note: We need to ensure 'role' column exists or use metadata
      const { data, error } = await supabase
        .from('profiles')
        .select('tier') // Assuming 'TUTOR' or 'FAMILY_OWNER' allows partial access, but for SuperAdmin we might need a specific flag
        .eq('id', user.id)
        .single();

      // For production, we strictly check 'ADMIN' tier or specific dev email
      if (user.email === 'dev@qp.com' || data?.tier === 'ADMIN') { 
          setIsAdmin(true);
      } else {
          setIsAdmin(false); 
      }
    };

    if (!isLoading) checkAdmin();
  }, [user, isLoading]);

  if (isLoading || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-cyan-500">Checking clearance...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;

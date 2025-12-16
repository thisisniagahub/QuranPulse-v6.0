import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  uploadAvatar: (file: File) => Promise<{ error: any, url?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Supabase Auth Listener
  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
          // Map basic info needed
          setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              // Default values for new/unfetched profiles
              level: 1,
              xp_total: 0,
              streak: 0,
              badges: [],
              barakah_points: 0,
              last_read_surah: 1,
              last_read_ayah: 1,
              avatar_url: session.user.user_metadata?.avatar_url
          });
      }
      setIsLoading(false);
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
          // Map basic info needed
          setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              level: 1, xp_total: 0, streak: 0, badges: [],
              barakah_points: 0,
              last_read_surah: 1,
              last_read_ayah: 1,
              avatar_url: session.user.user_metadata?.avatar_url
          });
      } else {
          setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }: LoginCredentials) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const register = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name, // Save name in metadata
        },
      },
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
      if (!user) return { error: "No user logged in" };

      // 1. Update Supabase Auth Metadata
      const data: any = {};
      if (updates.name) data.name = updates.name;
      if (updates.avatar_url) data.avatar_url = updates.avatar_url;

      if (Object.keys(data).length > 0) {
          const { error } = await supabase.auth.updateUser({ data });
          if (error) return { error };
      }

      // 2. Update Local State
      setUser(prev => prev ? { ...prev, ...updates } : null);
      
      return { error: null };
  };

  const updatePassword = async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: "No user logged in" };

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return { error: null, url: data.publicUrl };
    } catch (error) {
        return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, logout, register, updateProfile, updatePassword, uploadAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
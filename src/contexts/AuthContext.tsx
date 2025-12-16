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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
          // Fetch full profile from DB
          const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

          if (profile) {
             setUser(profile);
          } else {
             // Fallback to metadata if profile doesn't exist yet (should be created on trigger)
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
          }
      }
      setIsLoading(false);
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
          const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
          if (profile) {
              setUser(profile);
          } else {
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
          }
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

      try {
          // 1. Update Supabase Auth Metadata
          const authData: any = {};
          if (updates.name) authData.name = updates.name;
          if (updates.avatar_url) authData.avatar_url = updates.avatar_url;

          if (Object.keys(authData).length > 0) {
              const { error } = await supabase.auth.updateUser({ data: authData });
              if (error) return { error };
          }

          // 2. Update profiles table in database
          const { error: dbError } = await supabase
              .from('profiles')
              .update({
                  ...updates,
                  updated_at: new Date().toISOString()
              })
              .eq('id', user.id);

          if (dbError) {
              console.warn('Profile DB update failed:', dbError);
              // Don't fail completely if DB update fails - auth metadata was updated
          }

          // 3. Update Local State
          setUser(prev => prev ? { ...prev, ...updates } : null);
          
          return { error: null };
      } catch (err) {
          console.error('Profile update error:', err);
          return { error: err };
      }
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
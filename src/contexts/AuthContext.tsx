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
    let mounted = true;

    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("⚠️ AuthContext: Auth check timed out - forcing app load");
        setIsLoading(false);
      }
    }, 5000); // Increased to 5 seconds for robustness

    // 1. Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("🔑 AuthContext: Initial session check result:", { hasSession: !!session, userId: session?.user?.id });

      if (!mounted) return;

      // --- DEV BYPASS FALLBACK ---
      const devUser = localStorage.getItem('auth_user');
      if (!session && devUser) {
        console.log("🚧 AuthContext: Detected Dev Bypass User in localStorage");
        try {
          const parsed = JSON.parse(devUser);
          setUser(parsed);
          setIsLoading(false);
          clearTimeout(safetyTimeout);
          return;
        } catch (e) {
          console.error("Failed to parse dev user:", e);
        }
      }

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
      clearTimeout(safetyTimeout);
      setIsLoading(false);
    }).catch(err => {
      console.error("Auth session check failed:", err);
      if (mounted) setIsLoading(false);
    });

    // 2. Listen for changes
    let lastEventProcessed = 0;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const timestamp = Date.now();
      lastEventProcessed = timestamp;

      console.log("🔄 AuthContext: onAuthStateChange event:", event, { userId: session?.user?.id, timestamp });

      if (!mounted) {
        console.log("🔄 AuthContext: Component unmounted, skipping logic");
        return;
      }

      try {
        setSession(session);

        if (session?.user) {
          console.log("🔄 AuthContext: Processing user profile for:", session.user.id);

          // Use a timeout for the profile fetch to prevent hanging
          const profilePromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Profile fetch timeout")), 10000)
          );

          try {
            const { data: profile, error: profileError } = await Promise.race([
              profilePromise,
              timeoutPromise
            ]) as any;

            // Only update if this is still the latest event
            if (lastEventProcessed !== timestamp) {
              console.log("🔄 AuthContext: Stale event detected, skipping state update");
              return;
            }

            if (profileError) {
              console.warn("🔄 AuthContext: Profile fetch issue:", profileError.message);
            }

            if (profile) {
              console.log("🔄 AuthContext: Profile found, setting state");
              // Ensure name exists
              if (!profile.name) {
                profile.name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
              }
              setUser(profile);
            } else {
              console.log("🔄 AuthContext: Falling back to user metadata");
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
          } catch (fetchErr) {
            console.error("🔄 AuthContext: Profile fetch failed or timed out:", fetchErr);

            // FALLBACK LOGIC: If DB fails, constructing a temporary profile from Session
            if (lastEventProcessed === timestamp) {
              console.warn("⚠️ AuthContext: Using SESSION FALLBACK for user profile due to timeout/error.");
              setUser({
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                level: 1,
                xp_total: 0,
                streak: 0,
                badges: [],
                barakah_points: 0,
                last_read_surah: 1,
                last_read_ayah: 1,
                role: 'USER',
                status: 'ACTIVE',
                avatar_url: session.user.user_metadata?.avatar_url
              });
            }
          }
        } else {
          console.log("🔄 AuthContext: Clearing user session");
          setUser(null);
        }
      } catch (globalErr) {
        console.error("🔄 AuthContext: Error in onAuthStateChange callback:", globalErr);
      } finally {
        if (lastEventProcessed === timestamp) {
          console.log("🔄 AuthContext: Finalizing state (isLoading = false)");
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async ({ email, password }: LoginCredentials) => {
    console.log("📥 AuthContext: login function called for:", email);
    try {
      console.log("📥 AuthContext: Invoking supabase.auth.signInWithPassword...");
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("📥 AuthContext: supabase.auth.signInWithPassword returned:", { hasError: !!result.error, userId: result.data?.user?.id });

      if (result.error) {
        console.error("❌ AuthContext: Login error:", result.error.message, result.error);
      } else {
        console.log("✅ AuthContext: Login success confirmed");
      }

      return { error: result.error };
    } catch (e) {
      console.error("🔥 AuthContext: CRITICAL CRASH in login function:", e);
      return { error: e };
    }
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
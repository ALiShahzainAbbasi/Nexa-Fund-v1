
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/services/userService";
import type { Database } from "@/types/supabase";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        getCurrentUser().then(userProfile => {
          setProfile(userProfile);
        });
      }
      
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userProfile = await getCurrentUser();
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);
      
    if (error) throw error;
    
    // Update local state
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as AppUser, Provider, UserRole } from './types';

type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  patientId?: string; // Add patientId for patient users
  provider?: Provider;
  picture?: string | null;
};

interface AuthContextProps {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  // Add compatibility with new auth context type
  login: (email: string, password: string) => Promise<AppUser | null>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, role?: string) => Promise<AppUser | null>;
  loginWithSocialProvider: (provider: string) => Promise<void>;
  handleOAuthCallback: (provider: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  updateProfile: async () => {},
  // Add compatibility with new auth context type
  login: async () => null,
  logout: async () => {},
  signup: async () => null,
  loginWithSocialProvider: async () => {},
  handleOAuthCallback: async () => {},
  forgotPassword: async () => {}
});

// Create the AuthProvider component but export it separately
export const AuthProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(true);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Error loading your profile');
        setIsLoading(false);
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name || '',
          role: data.role || 'patient',
          avatar_url: data.avatar_url,
          patientId: data.patientId,
          provider: 'email',
          picture: data.avatar_url || null
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, name: string, role = 'patient') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      if (data.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email,
              name,
              role,
              createdAt: new Date().toISOString()
            }
          ]);
          
        if (profileError) {
          toast.error('Error creating user profile');
          console.error('Profile creation error:', profileError);
        } else {
          toast.success('Account created! Please check your email for verification.');
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to sign up');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully');
        setUser(null);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        toast.error('Error updating profile');
        console.error('Profile update error:', error);
        return;
      }
      
      setUser({
        ...user,
        ...updates
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };
  
  // Add compatibility methods that map to the existing methods
  const login = async (email: string, password: string): Promise<AppUser | null> => {
    await signIn(email, password);
    if (!user) return null;
    
    // Convert UserProfile to AppUser
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      provider: user.provider as Provider || 'email',
      picture: user.avatar_url || null,
      patientId: user.patientId
    };
  };
  
  const logout = async (): Promise<void> => {
    await signOut();
  };
  
  const signup = async (email: string, password: string, name: string, role = 'patient'): Promise<AppUser | null> => {
    await signUp(email, password, name, role);
    if (!user) return null;
    
    // Convert UserProfile to AppUser
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      provider: 'email',
      picture: user.avatar_url || null,
      patientId: user.patientId
    };
  };
  
  const loginWithSocialProvider = async (provider: string): Promise<void> => {
    // Basic implementation for compatibility
    toast.info(`Social login with ${provider} is not fully implemented`);
  };
  
  const handleOAuthCallback = async (provider: string, code: string): Promise<void> => {
    // Basic implementation for compatibility
    console.log(`Handling OAuth callback for ${provider} with code length ${code?.length || 0}`);
  };
  
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email', {
        duration: 5000
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link', {
        duration: 5000
      });
    }
  };

  // This is the correct way to define a React component in a .ts file
  return React.createElement(AuthContext.Provider, {
    value: {
      user,
      session,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signOut,
      signUp,
      updateProfile,
      // Add compatibility methods
      login,
      logout,
      signup,
      loginWithSocialProvider,
      handleOAuthCallback,
      forgotPassword
    }
  }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@supabase/supabase-js';
import { AuthContext } from './AuthContext';
import { formatUser } from './utils';
import { User, UserRole } from './types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const formattedUser = await formatUser(session.user);
          setUser(formattedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          const formattedUser = await formatUser(session?.user || null);
          setUser(formattedUser);
        }
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const formattedUser = await formatUser(data.user);
      if (!formattedUser) throw new Error('User profile not found');
      
      toast.success('Login successful');
      
      if (formattedUser.role === 'doctor') {
        navigate('/dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) throw error;

      toast.success('Account created successfully. Please check your email for verification.');
      
      if (data.user && !data.user.email_confirmed_at) {
        navigate('/login');
      } else {
        const formattedUser = await formatUser(data.user);
        if (formattedUser) {
          navigate(role === 'doctor' ? '/dashboard' : '/patient-dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocialProvider = async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/oauth-callback?provider=${provider}`
        }
      });

      if (error) throw error;
      
      // The redirect happens automatically by Supabase
    } catch (error: any) {
      console.error(`Error redirecting to ${provider}:`, error);
      toast.error(`Failed to connect with ${provider}`);
    }
  };

  const handleOAuthCallback = async (provider: string, code: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('Authentication failed');
      }
      
      navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
    } catch (error: any) {
      console.error(`${provider} OAuth handling failed:`, error);
      toast.error(`${provider} login failed`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('You have been logged out');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithSocialProvider,
        handleOAuthCallback,
        signup,
        logout,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

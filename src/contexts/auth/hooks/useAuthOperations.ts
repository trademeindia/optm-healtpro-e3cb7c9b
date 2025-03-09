
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from '../utils';
import { User, UserRole } from '../types';

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<User | null> => {
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
      
      return formattedUser;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<User | null> => {
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
        return null;
      } else {
        const formattedUser = await formatUser(data.user);
        if (formattedUser) {
          navigate(role === 'doctor' ? '/dashboard' : '/patient-dashboard');
        }
        return formattedUser;
      }
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocialProvider = async (provider: Provider): Promise<void> => {
    try {
      // First, check if the provider is supported and enabled in the current environment
      // This is a client-side validation before making the API call
      toast.info(`Attempting to sign in with ${provider}...`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/oauth-callback?provider=${provider}`
        }
      });

      if (error) {
        // Handle the specific provider not enabled error
        if (error.message.includes('provider is not enabled')) {
          toast.error(`${provider} login is not enabled. Please configure it in Supabase first.`);
          console.error(`Error: ${provider} provider is not enabled in Supabase. Enable it in Authentication > Providers.`);
        } else {
          toast.error(`Failed to connect with ${provider}: ${error.message}`);
        }
        throw error;
      }
      
      // The redirect happens automatically by Supabase
    } catch (error: any) {
      console.error(`Error redirecting to ${provider}:`, error);
      // Error is already handled above, no need for another toast
    }
  };

  const handleOAuthCallback = async (provider: string, code: string, user: User | null): Promise<void> => {
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

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      toast.info('You have been logged out');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
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

  return {
    isLoading,
    login,
    signup,
    loginWithSocialProvider,
    handleOAuthCallback,
    logout,
    forgotPassword
  };
};

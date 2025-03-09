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
      // First check Supabase connection
      const { error: connectionError } = await supabase.auth.getSession();
      
      if (connectionError) {
        console.error('Supabase connection error:', connectionError);
        toast.error('Unable to connect to authentication service. Please try again later.');
        return;
      }
      
      // Set up the redirect URL carefully - Use current origin for local development
      // and production environments will correctly set their own URLs
      const redirectTo = `${window.location.origin}/oauth-callback`;
      console.log(`OAuth redirect URL: ${redirectTo}`);
      
      toast.info(`Signing in with ${provider}...`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          // Include the provider in the URL to help with debugging
          queryParams: {
            provider: provider
          }
        }
      });

      if (error) {
        // Enhanced error diagnostics
        if (error.message.includes('provider is not enabled')) {
          toast.error(`${provider} login is not available. Please contact support.`);
          console.error(`Error: ${provider} provider is not enabled in Supabase Authentication > Providers.`);
        } else if (error.message.includes('missing OAuth secret')) {
          toast.error(`${provider} login configuration is incomplete.`);
          console.error(`Error: ${provider} provider is missing OAuth Client ID or Client Secret in Supabase Authentication > Providers.`);
        } else if (error.message.includes('requested url is invalid')) {
          toast.error(`Authentication configuration error. Invalid redirect URL.`);
          console.error(`Error: Your Supabase project needs Site URL and Redirect URLs configured in Authentication > URL Configuration. Check that ${redirectTo} is added as a valid redirect URL.`);
        } else {
          toast.error(`${provider} authentication failed: ${error.message}`);
          console.error(`OAuth error with ${provider}:`, error);
        }
        throw error;
      }
    } catch (error: any) {
      console.error(`Error initiating ${provider} authentication:`, error);
      // No need for another toast as one was already shown above
    }
  };

  const handleOAuthCallback = async (provider: string, code: string, user: User | null): Promise<void> => {
    setIsLoading(true);
    try {
      if (!user) {
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }
      
      toast.success(`Successfully signed in with ${provider}!`);
      navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
    } catch (error: any) {
      console.error(`${provider} OAuth callback error:`, error);
      toast.error('Authentication failed. Please try again.');
      navigate('/login');
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

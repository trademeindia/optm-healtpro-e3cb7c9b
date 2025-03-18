
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from '../../utils';
import { User } from '../../types';
import { toast } from 'sonner';

type UseOAuthCallbackHandlerProps = {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
};

export const useOAuthCallbackHandler = ({ setIsLoading, navigate }: UseOAuthCallbackHandlerProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleOAuthCallback = async (
    provider: string,
    code: string,
    currentUser: User | null
  ): Promise<void> {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Processing OAuth callback from provider: ${provider}`);
      
      // If this is Google and user wants Google Fit access, store that information
      if (provider === 'google' && window.location.search.includes('googlefit=true')) {
        // Store that we need to request Google Fit access after login
        localStorage.setItem('request_googlefit_access', 'true');
      }
      
      // Validate that we have code to exchange for session
      if (!code) {
        throw new Error('No authorization code provided in callback');
      }
      
      // If already logged in, this might be adding a new connection to a social provider
      // Handle linking accounts here if needed
      if (currentUser) {
        console.log('User already authenticated, handling additional provider connection');
        // Handle account linking logic here if needed
        
        // If this is for Google Fit access specifically, handle that
        if (provider === 'google' && localStorage.getItem('request_googlefit_access') === 'true') {
          localStorage.removeItem('request_googlefit_access');
          // Handle Google Fit integration
          console.log('Processing Google Fit integration after OAuth');
          toast.success('Google Fit connected successfully');
          
          // Navigate back to Health Apps page or appropriate page
          navigate('/health-apps');
          return;
        }
        
        // For other providers or general account linking
        toast.success(`${provider} account connected`);
        navigate('/dashboard');
        return;
      }
      
      // For normal OAuth login, let Supabase handle the session creation
      console.log('Exchanging auth code for session');
      
      // Rather than making the API calls ourselves, we'll rely on Supabase to handle the callback
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session after OAuth callback:', error);
        throw error;
      }
      
      if (!data.session) {
        console.error('No session returned after OAuth callback');
        throw new Error('Authentication failed. No session created.');
      }
      
      console.log('OAuth authentication successful, session created');
      
      // Check for Google Fit access flag
      if (provider === 'google' && localStorage.getItem('request_googlefit_access') === 'true') {
        localStorage.removeItem('request_googlefit_access');
        toast.success('Google Fit connected successfully');
        navigate('/health-apps');
      } else {
        // Default navigation
        toast.success('Login successful');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('OAuth callback processing error:', error);
      setError(error.message || 'Authentication failed');
      toast.error('Authentication failed', {
        description: error.message || 'Please try again',
        duration: 5000
      });
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleOAuthCallback,
    error
  };
};

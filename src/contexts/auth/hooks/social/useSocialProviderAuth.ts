
import { useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Provider } from '../../utils/types';

export const useSocialProviderAuth = (supabase: SupabaseClient) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loginWithProvider = async (provider: Provider) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the current session to check if user is already logged in
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session) {
        console.log('User already logged in, logging out first...');
        await supabase.auth.signOut();
      }

      // Store the current URL in localStorage for redirect after auth
      const redirectUrl = `${window.location.origin}/auth/callback`;
      localStorage.setItem('authRedirectUrl', window.location.href);

      // Sign in with the selected provider
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error during social login:', err);
      setError(err instanceof Error ? err : new Error('Unknown error during social login'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginWithProvider,
    isLoading,
    error,
  };
};

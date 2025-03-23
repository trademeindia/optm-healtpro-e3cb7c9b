
import { useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Provider } from '../types';

export const useAuthSocial = (supabase: SupabaseClient) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const socialAuth = async (provider: Provider) => {
    setIsLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (signInError) {
        throw signInError;
      }
    } catch (err) {
      console.error('Social auth error:', err);
      setError(err instanceof Error ? err : new Error('An error occurred during social authentication'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    socialAuth,
    isLoading,
    error,
  };
};

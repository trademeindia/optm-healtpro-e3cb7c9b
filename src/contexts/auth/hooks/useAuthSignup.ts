
import { useState } from 'react';
import { SupabaseClient, AuthResponse } from '@supabase/supabase-js';
import { AuthSignupCredentials } from '../utils/types';

export const useAuthSignup = (supabase: SupabaseClient) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signUp = async (credentials: AuthSignupCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Sign up the user
      const response = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials.metadata || {},
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      return response;
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred during signup'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading,
    error,
    setError,
  };
};

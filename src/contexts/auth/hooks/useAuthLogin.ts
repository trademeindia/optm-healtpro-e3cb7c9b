
import { useState } from 'react';
import { SupabaseClient, AuthResponse } from '@supabase/supabase-js';
import { AuthLoginCredentials } from '../utils/types';

export const useAuthLogin = (supabase: SupabaseClient) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async (credentials: AuthLoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      if (!isValidEmail(credentials.email)) {
        throw new Error('Invalid email format');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Perform login
      const response = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (response.error) {
        throw response.error;
      }

      return response;
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred during login'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return {
    login,
    isLoading,
    error,
    setError,
  };
};

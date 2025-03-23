
import { useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

export const useAuthManagement = (supabase: SupabaseClient) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        throw signOutError;
      }

      // Optional: Clear any local auth state or cached user data
      localStorage.removeItem('supabase.auth.token');
      
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err : new Error('An error occurred during logout'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ data: {}; error: Error | null }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      return { data, error: null };
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err instanceof Error ? err : new Error('An error occurred during password reset'));
      return { data: {}, error: err instanceof Error ? err : new Error('Unknown error') };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    resetPassword,
    isLoading,
    error,
    setError,
  };
};

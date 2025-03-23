
import { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthSession, UseAuthSessionOptions } from '../utils/types';

export const useAuthSession = (
  supabase: SupabaseClient,
  options?: UseAuthSessionOptions
) => {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    session: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: () => void = () => {};

    const initializeSession = async () => {
      try {
        setIsLoading(true);

        // First set up the auth state listener before checking the current session
        // This prevents race conditions where auth state changes during initialization
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, authSession) => {
          console.log('Auth state changed:', event);

          if (!isMounted) return;

          const newSession = {
            user: authSession?.user || null,
            session: authSession,
          };

          setSession(newSession);
          options?.onSessionUpdate?.(newSession);
        });

        unsubscribe = subscription.unsubscribe;

        // Then check the current session state
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (isMounted) {
          const currentSession = {
            user: data.session?.user || null,
            session: data.session,
          };
          
          setSession(currentSession);
          options?.onSessionUpdate?.(currentSession);
        }
      } catch (err) {
        console.error('Error initializing auth session:', err);
        
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize session'));
          options?.onError?.(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [supabase]);

  return {
    session,
    user: session.user,
    isLoading,
    error,
  };
};

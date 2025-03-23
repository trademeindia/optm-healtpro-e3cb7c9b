
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface OAuthCallbackState {
  isProcessing: boolean;
  isError: boolean;
  error: string | null;
  isSuccess: boolean;
  user: User | null;
}

export interface OAuthCallbackOptions {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

export function useOAuthCallback(options?: OAuthCallbackOptions) {
  const router = useRouter();
  const [state, setState] = useState<OAuthCallbackState>({
    isProcessing: true,
    isError: false,
    error: null,
    isSuccess: false,
    user: null,
  });

  useEffect(() => {
    const handleCallback = async () => {
      // Initialize state
      setState({
        isProcessing: true,
        isError: false,
        error: null,
        isSuccess: false,
        user: null,
      });

      try {
        // Check if there's an access token in the URL
        const { code, error, error_description, provider } = router.query;

        // If there's an error in the URL, handle it
        if (error) {
          setState({
            isProcessing: false,
            isError: true,
            error: error_description ? String(error_description) : String(error),
            isSuccess: false,
            user: null,
          });
          if (options?.onError) {
            options.onError(String(error_description || error));
          }
          return;
        }

        // Get the current session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        // If the user is authenticated, we can proceed
        if (data?.session?.user) {
          // Success - user is already authenticated
          setState({
            isProcessing: false,
            isError: false,
            error: null,
            isSuccess: true,
            user: data.session.user,
          });

          if (options?.onSuccess) {
            options.onSuccess(data.session.user);
          }

          // Redirect if specified
          if (options?.redirectTo) {
            router.push(options.redirectTo);
          }
          return;
        }

        // If there's an authorization code but no session, try to exchange it
        if (code && !data?.session) {
          // Handle the OAuth code exchange through a backend function
          // This is just a placeholder - you would need a server endpoint to handle this securely
          const exchangeCodeResult = await fetch('/api/auth/exchange-code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              provider,
            }),
          });

          const exchangeData = await exchangeCodeResult.json();

          if (!exchangeCodeResult.ok) {
            throw new Error(exchangeData.error || 'Failed to exchange authorization code');
          }

          // Check if the exchange was successful
          const { data: refreshedSession } = await supabase.auth.getSession();
          
          if (refreshedSession?.session?.user) {
            setState({
              isProcessing: false,
              isError: false,
              error: null,
              isSuccess: true,
              user: refreshedSession.session.user,
            });

            if (options?.onSuccess) {
              options.onSuccess(refreshedSession.session.user);
            }

            // Redirect if specified
            if (options?.redirectTo) {
              router.push(options.redirectTo);
            }
            return;
          }
        }

        // If we reached here, something unexpected happened
        setState({
          isProcessing: false,
          isError: true,
          error: 'Authentication failed. Please try again.',
          isSuccess: false,
          user: null,
        });

        if (options?.onError) {
          options.onError('Authentication failed. Please try again.');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        
        setState({
          isProcessing: false,
          isError: true,
          error: errorMessage,
          isSuccess: false,
          user: null,
        });

        if (options?.onError) {
          options.onError(errorMessage);
        }
      }
    };

    // Only run the callback handler if we're on the callback page
    if (
      router.isReady && 
      (router.pathname.includes('/auth/callback') || router.query.code || router.query.error)
    ) {
      handleCallback();
    } else if (router.isReady) {
      // If we're not on a callback page, we're not processing
      setState(prev => ({
        ...prev,
        isProcessing: false,
      }));
    }
  }, [router.isReady, router.pathname, router.query]);

  return state;
}

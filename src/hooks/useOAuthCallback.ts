
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useOAuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const { user, isLoading, handleOAuthCallback } = useAuth();
  const [searchParams] = useSearchParams();
  
  const provider = searchParams.get('provider') || 'unknown';
  const errorCode = searchParams.get('error') || null;
  const errorDescription = searchParams.get('error_description') || null;
  const code = searchParams.get('code') || '';
  const state = searchParams.get('state') || '';

  const handleRetry = () => {
    setError(null);
    setErrorDetails(null);
    setRetryCount(0);
    setIsVerifying(true);
    // Force refresh the authorization
    window.location.href = '/login';
  };

  const checkAuthState = async () => {
    setIsVerifying(true);
      
    try {
      const callbackURL = window.location.href;
      const originURL = window.location.origin;
      
      // Collect debug info
      setDebugInfo({
        callbackURL,
        originURL,
        hasCode: !!code,
        hasState: !!state,
        provider,
        retryCount,
        hasUser: !!user,
        userRole: user?.role || 'none',
        isLoadingState: isLoading
      });
      
      console.log(`OAuth callback processing: provider=${provider}, code exists=${!!code}, state exists=${!!state}`);
      
      // Call the handler with the code from search params
      if (code) {
        console.log(`Found code parameter, calling handleOAuthCallback with provider: ${provider}`);
        try {
          await handleOAuthCallback(provider, code);
          
          // Wait a short time for the auth state to update
          await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (callbackError) {
          console.error('Error in handleOAuthCallback:', callbackError);
          // Continue with checks below even if callback fails
        }
      }
      
      // Verify Supabase connection and session
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Supabase session error:', sessionError);
        setError('Unable to verify authentication');
        setErrorDetails('There was a problem connecting to the authentication service. Please try again.');
        toast.error('Authentication verification failed');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      console.log('Session check result:', { 
        session: data.session ? 'exists' : 'null',
        user: user ? 'exists' : 'null',
        isLoading
      });
      
      // If we have a user or a session, authentication succeeded
      if (user && !isLoading) {
        console.log('User authenticated successfully:', user);
        toast.success('Successfully signed in!');
        // Use navigate instead of direct window.location to prevent blank screen
        navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
        return;
      } 
      // If we have a session but no user yet, try to extract the user
      else if (data.session && !isLoading) {
        console.log('Session exists but no user object yet - trying to get user data from session');
        const { user: supabaseUser } = data.session;
        
        if (supabaseUser) {
          console.log('Session user exists:', supabaseUser.id);
          // Use navigate instead of direct location change
          toast.success('Successfully authenticated!');
          navigate('/dashboard');
          return;
        }
      }
      // If we're done loading and still don't have a user, there was an error
      else if (!isLoading && !user && retryCount >= 2) {
        console.error('Authentication failed - no user found after OAuth flow and retries');
        setError('Authentication failed');
        setErrorDetails('The sign-in attempt was not successful. Please try again or use a different method.');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
      // Try again if we're still loading or no user yet
      else if ((!user || isLoading) && retryCount < 3) {
        console.log(`Still waiting for authentication, retry ${retryCount + 1}/3...`);
        setRetryCount(prev => prev + 1);
        // Try again after a delay with increasing timeouts
        setTimeout(() => checkAuthState(), 1500 + (retryCount * 500));
      }
    } catch (err: any) {
      console.error('OAuth callback processing error:', err);
      setError('Authentication process failed');
      setErrorDetails(err.message || 'An unexpected error occurred during authentication');
      toast.error('Authentication failed');
      setTimeout(() => navigate('/login'), 3000);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    // Log the component initialization for debugging
    console.log('OAuthCallback component initialized');
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Auth state:', { user, isLoading });

    // Handle direct error parameters from OAuth provider
    if (errorCode) {
      console.error('OAuth provider error:', errorCode, errorDescription);
      setError(`Authentication error from ${provider}`);
      setErrorDetails(errorDescription || 'Please try again or use another sign-in method');
      toast.error(`${provider} authentication failed`);
      setIsVerifying(false);
      return;
    }

    // Only run the auth check if we don't already have an error
    if (!error) {
      // Add a small delay to ensure any auth state changes have propagated
      setTimeout(() => {
        checkAuthState();
      }, 500);
    }
  }, [navigate, user, isLoading, searchParams, provider, errorCode, errorDescription, error, handleOAuthCallback, code, state, retryCount]);

  return {
    error,
    errorDetails,
    isVerifying,
    debugInfo,
    retryCount,
    handleRetry,
    navigate
  };
};

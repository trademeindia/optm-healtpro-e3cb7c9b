
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
        provider,
        retryCount,
        hasUser: !!user,
        userRole: user?.role || 'none',
        isLoadingState: isLoading,
        searchParams: Object.fromEntries(searchParams.entries()),
        timestamp: new Date().toISOString()
      });
      
      console.log(`OAuth callback processing: provider=${provider}, code exists=${!!code}, timestamp=${new Date().toISOString()}`);
      
      // First check if we already have a session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        console.log('Active session found, redirecting to dashboard');
        navigate('/patient-dashboard');
        return;
      }
      
      // Call the handler with the code from search params
      if (code) {
        console.log(`Found code parameter, calling handleOAuthCallback with provider: ${provider}`);
        try {
          await handleOAuthCallback(provider, code);
          
          // Give some time for session to be established
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check again if we have a session after the callback
          const { data: updatedSession } = await supabase.auth.getSession();
          
          if (updatedSession.session) {
            console.log('Session established after OAuth callback, redirecting');
            toast.success('Successfully signed in!');
            navigate('/patient-dashboard');
            return;
          }
        } catch (callbackError) {
          console.error('Error in handleOAuthCallback:', callbackError);
        }
      } else {
        console.error('No authorization code found in URL');
        setError('Authentication failed');
        setErrorDetails('No authorization code received from the provider');
        return;
      }
      
      // If we're done loading and still don't have a user, there was an error
      if (!isLoading && !user && retryCount >= 2) {
        console.error('Authentication failed - no user found after OAuth flow and retries');
        setError('Authentication failed');
        setErrorDetails('The sign-in attempt was not successful. Please try again.');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
      // Try again if we're still loading or no user yet
      else if ((!user || isLoading) && retryCount < 3) {
        console.log(`Still waiting for authentication, retry ${retryCount + 1}/3...`);
        setRetryCount(prev => prev + 1);
        // Try again after a delay with increasing timeouts
        setTimeout(() => checkAuthState(), 2000 + (retryCount * 1000));
      }
    } catch (err: any) {
      console.error('OAuth callback processing error:', err);
      setError('Authentication process failed');
      setErrorDetails(err.message || 'An unexpected error occurred');
      toast.error('Authentication failed');
      setTimeout(() => navigate('/login'), 3000);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
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
      // Start auth check process
      checkAuthState();
    }
  }, []);

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

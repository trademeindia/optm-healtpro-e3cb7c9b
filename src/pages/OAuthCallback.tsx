
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2, AlertTriangle, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const OAuthCallback: React.FC = () => {
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

    // Check if we have a valid Supabase session
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
          retryCount
        });
        
        console.log(`OAuth callback processing: provider=${provider}, code exists=${!!code}, state exists=${!!state}`);
        
        // Call the handler with the code from search params
        if (code) {
          console.log(`Found code parameter, calling handleOAuthCallback with provider: ${provider}`);
          await handleOAuthCallback(provider, code);
          
          // Wait a short time for the auth state to update
          await new Promise(resolve => setTimeout(resolve, 1000));
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
          navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
        } 
        // If we have a session but no user yet, try to extract the user
        else if (data.session && !isLoading && !user) {
          console.log('Session exists but no user object yet - trying to get user data from session');
          const { user: supabaseUser } = data.session;
          
          if (supabaseUser) {
            console.log('Session user exists:', supabaseUser.id);
            // We'll redirect to dashboard and let the AuthProvider handle the role routing
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
        else if ((!user || isLoading) && retryCount < 2) {
          console.log(`Still waiting for authentication, retry ${retryCount + 1}/3...`);
          setRetryCount(prev => prev + 1);
          // Try again after a delay
          setTimeout(() => checkAuthState(), 2000);
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
    
    // Only run the auth check if we don't already have an error
    if (!error) {
      checkAuthState();
    }
  }, [navigate, user, isLoading, searchParams, provider, errorCode, errorDescription, error, handleOAuthCallback, code, state, retryCount]);

  const handleRetry = () => {
    setError(null);
    setErrorDetails(null);
    setRetryCount(0);
    setIsVerifying(true);
    // Force refresh the authorization
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-2">{error}</p>
          {errorDetails && (
            <p className="text-gray-500 mb-4 text-sm">{errorDetails}</p>
          )}
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4 mb-6 text-left">
            <h3 className="font-semibold text-amber-800 mb-2">Troubleshooting steps:</h3>
            <ul className="text-sm text-amber-700 list-disc pl-5 space-y-1">
              <li>Ensure the Google provider is enabled in your Supabase Authentication settings</li>
              <li>Verify that both Client ID and Client Secret are properly configured</li>
              <li>Check that your Supabase project has the correct Site URL configured</li>
              <li>Verify that <code>{window.location.origin}/oauth-callback</code> is added as a valid Redirect URL in Supabase</li>
              <li>For Google OAuth, ensure you've configured the consent screen with authorized domains</li>
              <li>Check that your Google Cloud project has proper OAuth credentials set up</li>
              <li>Verify that <code>{window.location.origin}</code> is added as an Authorized JavaScript Origin in Google Cloud Console</li>
              <li>Make sure <code>{window.location.origin}/oauth-callback</code> is added as an Authorized Redirect URI in Google Cloud Console</li>
              <li>If you're getting 403 errors, check if your Google API credentials are restricted by domain</li>
            </ul>
          </div>
          
          {debugInfo && Object.keys(debugInfo).length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Debug Information:</h3>
              <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
            >
              Return to Login
            </Button>
            <Button 
              variant="default" 
              onClick={handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry Authentication
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Processing Your Login</h2>
          <p className="text-gray-500">Please wait while we authenticate your account...</p>
          {isVerifying && (
            <p className="text-gray-400 mt-2 text-sm">Verifying your credentials...</p>
          )}
          {retryCount > 0 && (
            <p className="text-amber-500 mt-2 text-sm">Retry attempt {retryCount}/2</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OAuthCallback;

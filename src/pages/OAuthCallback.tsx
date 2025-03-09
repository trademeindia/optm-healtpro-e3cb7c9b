
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const OAuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get('provider') || 'unknown';
  const errorCode = searchParams.get('error') || null;
  const errorDescription = searchParams.get('error_description') || null;

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
        
        // If we have a user, authentication succeeded
        if (user && !isLoading) {
          console.log('User authenticated successfully:', user);
          toast.success('Successfully signed in!');
          navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
        } 
        // If we're done loading and still don't have a user, there was an error
        else if (!isLoading && !user) {
          console.error('Authentication failed - no user found after OAuth flow');
          setError('Authentication failed');
          setErrorDetails('The sign-in attempt was not successful. Please try again or use a different method.');
          toast.error('Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        }
        // Still loading - wait for auth state to update
        else {
          console.log('Still waiting for authentication state...');
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
  }, [navigate, user, isLoading, searchParams, provider, errorCode, errorDescription, error]);

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
            </ul>
          </div>
          <Button 
            variant="default" 
            onClick={() => navigate('/login')}
            className="mt-2"
          >
            Return to Login
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Processing Your Login</h2>
          <p className="text-gray-500">Please wait while we authenticate your account...</p>
          {isVerifying && (
            <p className="text-gray-400 mt-2 text-sm">Verifying your credentials...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OAuthCallback;

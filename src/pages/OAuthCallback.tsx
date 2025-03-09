
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
    // First check if we're getting error parameters from the OAuth provider
    if (errorCode) {
      console.error('OAuth provider error:', errorCode, errorDescription);
      setError(`Authentication error from ${provider}`);
      setErrorDetails(errorDescription || 'Please check your configuration');
      toast.error(`${provider} authentication failed`);
      setIsVerifying(false);
      return;
    }

    // Check if we can connect to Supabase at all
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Supabase connection error:', error);
          setError('Unable to connect to authentication service');
          setErrorDetails('Check your network connection or try again later');
          toast.error('Authentication service connection failed');
          return false;
        }
        return true;
      } catch (err) {
        console.error('Supabase connection critical error:', err);
        setError('Critical authentication error');
        setErrorDetails('There was a problem connecting to the authentication service');
        toast.error('Critical authentication error');
        return false;
      }
    };

    // With Supabase auth, the callback is handled automatically
    // We just need to wait for the auth state to be updated
    const checkAuthState = async () => {
      setIsVerifying(true);
      
      // First verify Supabase connection
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
      
      try {
        // If we have a user, redirect to the appropriate dashboard
        if (user && !isLoading) {
          console.log('User authenticated successfully:', user);
          toast.success('Successfully signed in!');
          navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
        } 
        // If we've finished loading and still don't have a user, there was an error
        else if (!isLoading && !user) {
          console.error('Authentication failed - no user found after OAuth flow');
          setError('Authentication failed. Please try again.');
          setErrorDetails('The login attempt was not successful. This could be due to configuration issues.');
          toast.error('Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err: any) {
        console.error('OAuth callback processing error:', err);
        setError('Failed to process authentication');
        setErrorDetails(err.message || 'An unexpected error occurred during authentication');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setIsVerifying(false);
      }
    };
    
    checkAuthState();
  }, [navigate, user, isLoading, provider, errorCode, errorDescription]);

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
              <li>Make sure the {provider} provider is enabled in Supabase Authentication settings</li>
              <li>Verify that both Client ID and Client Secret are properly configured</li>
              <li>Check that your Supabase project has the correct Site URL and Redirect URL configured</li>
              <li>For Google OAuth, ensure you've configured consent screen and authorized domains</li>
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

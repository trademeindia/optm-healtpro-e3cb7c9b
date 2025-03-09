
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const OAuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // First check if we can connect to Supabase at all
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Supabase connection error:', error);
          setError('Unable to connect to authentication service');
          toast.error('Authentication service connection failed');
          setTimeout(() => navigate('/login'), 2000);
          return false;
        }
        return true;
      } catch (err) {
        console.error('Supabase connection critical error:', err);
        setError('Critical authentication error');
        toast.error('Critical authentication error');
        setTimeout(() => navigate('/login'), 2000);
        return false;
      }
    };

    // With Supabase auth, the callback is handled automatically
    // We just need to wait for the auth state to be updated
    const checkAuthState = async () => {
      setIsVerifying(true);
      
      // First verify Supabase connection
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) return;
      
      try {
        // If we have a user, redirect to the appropriate dashboard
        if (user && !isLoading) {
          toast.success('Successfully signed in!');
          navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
        } 
        // If we've finished loading and still don't have a user, there was an error
        else if (!isLoading && !user) {
          setError('Authentication failed. Please try again.');
          toast.error('Authentication failed');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        setError('Failed to process authentication');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setIsVerifying(false);
      }
    };
    
    checkAuthState();
  }, [navigate, user, isLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500">Redirecting you back to login...</p>
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

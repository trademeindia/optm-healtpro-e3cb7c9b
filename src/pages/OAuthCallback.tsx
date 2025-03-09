
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const OAuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // With Supabase auth, the callback is handled automatically
    // We just need to wait for the auth state to be updated
    const checkAuthState = async () => {
      try {
        // If we have a user, redirect to the appropriate dashboard
        if (user && !isLoading) {
          toast.success('Successfully signed in!');
          navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
        } 
        // If we've finished loading and still don't have a user, there was an error
        else if (!isLoading && !user) {
          setError('Authentication failed');
          toast.error('Authentication failed');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        setError('Failed to process authentication');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 2000);
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
        </div>
      )}
    </div>
  );
};

export default OAuthCallback;

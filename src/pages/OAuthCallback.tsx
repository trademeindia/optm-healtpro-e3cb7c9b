
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { verifyOAuthState, getOAuthProvider, clearOAuthState } from '@/utils/oauth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const OAuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const processOAuthCallback = async () => {
      // Get query parameters from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const provider = params.get('provider');
      
      // Validate state and code
      if (!code || !state || !provider) {
        setError('Invalid OAuth callback parameters');
        toast.error('Authentication failed: Missing parameters');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      // Verify the state matches what we stored (prevents CSRF)
      if (!verifyOAuthState(state)) {
        setError('Invalid OAuth state parameter');
        toast.error('Authentication failed: Security error');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      try {
        // Process the OAuth callback
        await handleOAuthCallback(provider, code);
        
        // Clear OAuth state from storage
        clearOAuthState();
        
        // Navigate to appropriate dashboard
        toast.success('Successfully signed in!');
      } catch (err) {
        setError('Failed to process authentication');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    
    processOAuthCallback();
  }, [navigate, handleOAuthCallback]);

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

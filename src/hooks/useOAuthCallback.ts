
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/useAuth';
import { toast } from 'sonner';

export const useOAuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const processOAuthCallback = async () => {
      // Only process if we have handleOAuthCallback and we're not already processing
      if (!handleOAuthCallback || isProcessing) {
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const provider = searchParams.get('provider');
      const error = searchParams.get('error');
      
      // If there's an error parameter in the URL, handle it
      if (error) {
        console.error('OAuth error from provider:', error);
        toast.error(`Authentication failed: ${error}`);
        setError(error);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
      
      // We need both code and provider to proceed
      if (!code || !provider) {
        console.log('Missing OAuth callback parameters', { code, provider });
        return;
      }
      
      setIsProcessing(true);
      
      try {
        console.log(`Processing OAuth callback for ${provider}`);
        await handleOAuthCallback(provider, code);
        
        // Note: Navigation should happen inside handleOAuthCallback
        // But just in case it doesn't, navigate to dashboard as fallback
        setTimeout(() => {
          if (location.pathname.includes('oauth-callback')) {
            navigate('/dashboard');
          }
        }, 3000);
      } catch (error: any) {
        console.error('Error processing OAuth callback:', error);
        setError(error.message || 'Authentication failed');
        toast.error(error.message || 'Authentication failed');
        
        // Navigate back to login on error
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setIsProcessing(false);
      }
    };
    
    processOAuthCallback();
  }, [location, handleOAuthCallback, navigate, isProcessing]);
  
  return {
    isProcessing,
    error
  };
};

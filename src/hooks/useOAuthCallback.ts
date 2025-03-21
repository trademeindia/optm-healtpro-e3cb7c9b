
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { logFitnessSync } from '@/utils/debugUtils';

interface UseOAuthCallbackResult {
  isLoading: boolean;
  error: string | null;
  code: string | null;
  state: string | null;
  provider: string | null;
  userId: string | null;
}

export const useOAuthCallback = (): UseOAuthCallbackResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        
        // Extract all relevant parameters
        const code = queryParams.get('code');
        const state = queryParams.get('state');
        const error = queryParams.get('error');
        const errorDescription = queryParams.get('error_description');
        
        // Log the callback for debugging
        console.log('OAuth callback received:', { code, state, error, errorDescription });
        
        // Handle errors from OAuth provider
        if (error) {
          const errorMessage = errorDescription || error;
          console.error('OAuth error:', errorMessage);
          setError(errorMessage);
          toast.error(`Authentication failed: ${errorMessage}`);
          setTimeout(() => navigate('/health-apps'), 3000);
          return;
        }
        
        // Handle missing code
        if (!code) {
          setError('No authorization code received');
          toast.error('Authentication failed: No authorization code received');
          setTimeout(() => navigate('/health-apps'), 3000);
          return;
        }
        
        setCode(code);
        
        // Process the state parameter to extract provider and user ID
        if (state) {
          setState(state);
          
          // Expected format: google_fit_userId or other_provider_userId
          const stateParts = state.split('_');
          
          if (stateParts.length >= 3) {
            // For state in format: "google_fit_user123"
            // provider would be "google_fit"
            const extractedProvider = `${stateParts[0]}_${stateParts[1]}`;
            // userId would be "user123"
            const extractedUserId = stateParts.slice(2).join('_');
            
            setProvider(extractedProvider);
            setUserId(extractedUserId);
            
            logFitnessSync(extractedProvider, 'started', { code, userId: extractedUserId });
            
            // Handle Google Fit
            if (extractedProvider === 'google_fit') {
              // Exchange the code for tokens on the server
              await exchangeCodeForTokens(code, extractedUserId);
            }
          } else {
            setError('Invalid state parameter format');
          }
        } else {
          setError('No state parameter received');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error during OAuth processing';
        console.error('Error processing OAuth callback:', err);
        setError(errorMessage);
        toast.error(`Authentication error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    processOAuthCallback();
  }, [location.search, navigate]);
  
  // Helper function to exchange authorization code for tokens
  const exchangeCodeForTokens = async (code: string, userId: string) => {
    try {
      toast.info('Processing your Google Fit connection...');
      
      const response = await fetch('/api/google-fit-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, userId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to Google Fit');
      }
      
      logFitnessSync('google_fit', 'completed', { userId });
      toast.success('Successfully connected to Google Fit!');
      
      // Redirect to health apps page after successful connection
      setTimeout(() => navigate('/health-apps'), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error exchanging code for tokens';
      logFitnessSync('google_fit', 'failed', { error: errorMessage, userId });
      setError(errorMessage);
      toast.error(`Failed to connect to Google Fit: ${errorMessage}`);
      setTimeout(() => navigate('/health-apps'), 3000);
    }
  };
  
  return { isLoading, error, code, state, provider, userId };
};

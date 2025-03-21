
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { logFitnessSync } from '@/utils/debugUtils';
import { useAuth } from '@/contexts/auth';

interface UseOAuthCallbackResult {
  isLoading: boolean;
  isVerifying: boolean;
  error: string | null;
  errorDetails: string | null;
  code: string | null;
  state: string | null;
  provider: string | null;
  userId: string | null;
  debugInfo: Record<string, any>;
  retryCount: number;
  handleRetry: () => void;
  navigate: (path: string) => void;
}

export const useOAuthCallback = (): UseOAuthCallbackResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthCallback: authHandleOAuthCallback } = useAuth();
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsVerifying(true);
    setError(null);
    setErrorDetails(null);
    processOAuthCallback();
  };
  
  const processOAuthCallback = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      
      // Extract all relevant parameters
      const code = queryParams.get('code');
      const state = queryParams.get('state');
      const error = queryParams.get('error');
      const errorDescription = queryParams.get('error_description');
      
      // Update debug info
      setDebugInfo({
        code: code ? 'present' : 'missing',
        state,
        error,
        errorDescription,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        attempt: retryCount + 1
      });
      
      // Log the callback for debugging
      console.log('OAuth callback received:', { code, state, error, errorDescription });
      
      // Handle errors from OAuth provider
      if (error) {
        const errorMessage = errorDescription || error;
        console.error('OAuth error:', errorMessage);
        setError(errorMessage);
        setErrorDetails(`Provider returned: ${errorDescription || 'No additional details'}`);
        setIsVerifying(false);
        toast.error(`Authentication failed: ${errorMessage}`);
        return;
      }
      
      // Handle missing code
      if (!code) {
        setError('No authorization code received');
        setErrorDetails('The OAuth provider did not return an authorization code');
        setIsVerifying(false);
        toast.error('Authentication failed: No authorization code received');
        return;
      }
      
      setCode(code);
      
      // Try to determine provider from URL or state parameter
      let extractedProvider = 'google'; // Default to google if we can't determine
      
      // Process the state parameter to extract provider and user ID
      if (state) {
        setState(state);
        
        // Expected format: provider_userId or provider_type_userId
        const stateParts = state.split('_');
        
        if (stateParts.length >= 2) {
          // If we have at least 2 parts, assume first part is provider
          if (stateParts[0] === 'google') {
            extractedProvider = 'google';
            
            // If we have 3+ parts (e.g. "google_fit_user123"),
            // provider would be "google" for auth purposes
            const extractedUserId = stateParts.length >= 3 
              ? stateParts.slice(2).join('_') 
              : stateParts[1];
              
            setUserId(extractedUserId);
            
            // For Google Fit, handle differently
            if (stateParts.length >= 2 && stateParts[1] === 'fit') {
              setProvider('google_fit');
              logFitnessSync('google_fit', 'started', { code, userId: extractedUserId });
              
              // Exchange the code for tokens on the server for Google Fit
              await exchangeCodeForTokens(code, extractedUserId);
              return;
            }
          }
        }
      }
      
      setProvider(extractedProvider);
      
      // Handle regular OAuth (not Google Fit)
      console.log(`Handling OAuth callback for provider: ${extractedProvider}`);
      try {
        // Pass to auth context for processing
        await authHandleOAuthCallback(extractedProvider, code);
        setIsVerifying(false);
        
        // Success is handled by auth context which should redirect
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error during OAuth processing';
        console.error('Error in auth callback handler:', err);
        setError(errorMessage);
        setErrorDetails('Error while processing authentication. Please try again.');
        setIsVerifying(false);
        toast.error(`Authentication error: ${errorMessage}`);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during OAuth processing';
      const errorDetails = err instanceof Error && err.stack ? err.stack : 'No stack trace available';
      
      console.error('Error processing OAuth callback:', err);
      setError(errorMessage);
      setErrorDetails(errorDetails);
      setIsVerifying(false);
      
      toast.error(`Authentication error: ${errorMessage}`);
      setTimeout(() => navigate('/login'), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    processOAuthCallback();
  }, [location.search]);
  
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
      setIsVerifying(false);
      
      // Redirect to health apps page after successful connection
      setTimeout(() => navigate('/health-apps'), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error exchanging code for tokens';
      
      logFitnessSync('google_fit', 'failed', { error: errorMessage, userId });
      setError(errorMessage);
      setErrorDetails(err instanceof Error && err.stack ? err.stack : 'No stack trace available');
      setIsVerifying(false);
      
      toast.error(`Failed to connect to Google Fit: ${errorMessage}`);
      setTimeout(() => navigate('/health-apps'), 3000);
    }
  };
  
  return { 
    isLoading, 
    isVerifying,
    error, 
    errorDetails,
    code, 
    state, 
    provider, 
    userId,
    debugInfo,
    retryCount,
    handleRetry,
    navigate
  };
};

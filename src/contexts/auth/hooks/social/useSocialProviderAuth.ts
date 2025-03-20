
import { toast } from 'sonner';
import { Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UseSocialProviderAuthProps = {
  setIsLoading: (isLoading: boolean) => void;
};

export const useSocialProviderAuth = ({ setIsLoading }: UseSocialProviderAuthProps) => {
  const loginWithSocialProvider = async (provider: Provider): Promise<void> => {
    setIsLoading(true);
    try {
      console.log(`Starting OAuth flow with provider: ${provider}`);
      
      // First check Supabase connection
      const { error: connectionError } = await supabase.auth.getSession();
      
      if (connectionError) {
        console.error('Supabase connection error:', connectionError);
        toast.error('Unable to connect to authentication service. Please try again later.', {
          duration: 5000
        });
        setIsLoading(false);
        return;
      }
      
      // Build the redirect URL - crucial for debugging OAuth redirects
      const redirectTo = `${window.location.origin}/oauth-callback`;
      console.log(`OAuth redirect URL: ${redirectTo}`);
      
      toast.info(`Signing in with ${provider}...`, {
        duration: 3000
      });
      
      // Create the OAuth options
      const options = {
        redirectTo,
        queryParams: {}
      };
      
      // Add provider-specific options
      if (provider === 'google') {
        options.queryParams = {
          access_type: 'offline',
          prompt: 'select_account'
        };
      }
      
      // Use the correct structure for OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          ...options,
          scopes: 'email profile',
        }
      });

      console.log("OAuth initiation response:", 
        data ? `Data received, URL: ${data.url ? 'exists' : 'missing'}` : "No data", 
        error ? `Error: ${error.message}` : "No error"
      );

      if (error) {
        // Enhanced error diagnostics with more specific messages
        let errorMessage = `${provider} authentication failed: ${error.message}`;
        
        if (error.message.includes('provider is not enabled')) {
          errorMessage = `${provider} login is not available. Please check Supabase Authentication settings.`;
          console.error(`Error: ${provider} provider is not enabled in Supabase Authentication > Providers.`);
        } else if (error.message.includes('missing OAuth secret')) {
          errorMessage = `${provider} login configuration is incomplete.`;
          console.error(`Error: ${provider} provider is missing OAuth Client ID or Client Secret in Supabase Authentication > Providers.`);
        } else if (error.message.includes('requested url is invalid')) {
          errorMessage = `Authentication configuration error. Invalid redirect URL.`;
          console.error(`Error: Your Supabase project needs Site URL and Redirect URLs configured in Authentication > URL Configuration. Check that ${redirectTo} is added as a valid redirect URL.`);
        } else {
          console.error(`OAuth error with ${provider}:`, error);
        }
        
        toast.error(errorMessage, {
          duration: 5000
        });
        throw error;
      }
      
      // If we have a URL to redirect to, use it
      if (data?.url) {
        console.log(`Redirecting to OAuth provider URL: ${data.url}`);
        
        // Use window.location.href for a full page reload to the provider's login page
        window.location.href = data.url;
      } else {
        console.error("OAuth initiation failed: No redirect URL returned");
        toast.error(`Login with ${provider} failed. No redirect URL received.`, {
          duration: 5000
        });
      }
    } catch (error: any) {
      console.error(`Error initiating ${provider} authentication:`, error);
      toast.error(`Login with ${provider} failed. Please try again.`, {
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithSocialProvider };
};

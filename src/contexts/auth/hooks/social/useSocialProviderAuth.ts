
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
        toast.error('Unable to connect to authentication service. Please try again later.');
        return;
      }
      
      // Build and log the redirect URL - crucial for debugging OAuth redirects
      const redirectTo = `${window.location.origin}/oauth-callback`;
      console.log(`OAuth redirect URL: ${redirectTo}`);
      
      toast.info(`Signing in with ${provider}...`);
      
      // Create the OAuth options
      const options = {
        redirectTo,
      };
      
      // Use the correct structure for Google OAuth with scopes
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: provider === 'google' ? 
          { ...options, scopes: 'openid email profile' } : 
          options
      });

      console.log("OAuth initiation response:", data ? "Data received" : "No data", error ? `Error: ${error.message}` : "No error");

      if (error) {
        // Enhanced error diagnostics with more specific messages
        if (error.message.includes('provider is not enabled')) {
          toast.error(`${provider} login is not available. Please check Supabase Authentication settings.`);
          console.error(`Error: ${provider} provider is not enabled in Supabase Authentication > Providers.`);
        } else if (error.message.includes('missing OAuth secret')) {
          toast.error(`${provider} login configuration is incomplete.`);
          console.error(`Error: ${provider} provider is missing OAuth Client ID or Client Secret in Supabase Authentication > Providers.`);
        } else if (error.message.includes('requested url is invalid')) {
          toast.error(`Authentication configuration error. Invalid redirect URL.`);
          console.error(`Error: Your Supabase project needs Site URL and Redirect URLs configured in Authentication > URL Configuration. Check that ${redirectTo} is added as a valid redirect URL.`);
        } else if (error.status === 403 || error.message.includes('403')) {
          toast.error('Access denied by the authentication provider. Please check your provider configuration.');
          console.error(`OAuth 403 error with ${provider}:`, error);
          console.log('This could be due to incorrect configuration in the OAuth provider or restrictions on your app.');
        } else {
          toast.error(`${provider} authentication failed: ${error.message}`);
          console.error(`OAuth error with ${provider}:`, error);
        }
        throw error;
      }
      
      // If we get this far with no error, the user will be redirected to the provider's login page
      console.log(`Successfully initiated ${provider} auth flow, user should be redirected.`);
    } catch (error: any) {
      console.error(`Error initiating ${provider} authentication:`, error);
      toast.error(`Login with ${provider} failed. Please check the debugging section for more information.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithSocialProvider };
};

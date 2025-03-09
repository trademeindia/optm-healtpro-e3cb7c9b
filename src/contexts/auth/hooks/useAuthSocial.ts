
import { toast } from 'sonner';
import { Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from '../utils';
import { User } from '../types';

type UseAuthSocialProps = {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
};

export const useAuthSocial = ({ setIsLoading, navigate }: UseAuthSocialProps) => {
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
      const redirectTo = `${window.location.origin}/oauth-callback?provider=${provider}`;
      console.log(`OAuth redirect URL: ${redirectTo}`);
      
      toast.info(`Signing in with ${provider}...`);
      
      // Enhanced configuration for Google specifically
      const options = {
        redirectTo,
        queryParams: {},
      };
      
      // Special handling for Google to ensure proper scopes
      if (provider === 'google') {
        options.queryParams = {
          // These scopes ensure we get enough profile information
          access_type: 'offline',
          prompt: 'consent',
          scope: 'openid email profile',
        };
      }
      
      // Log the full OAuth configuration for debugging
      console.log(`OAuth config for ${provider}:`, options);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options
      });

      console.log("OAuth initiation response:", data ? "Data received" : "No data", error ? `Error: ${error.message}` : "No error");

      if (error) {
        // Enhanced error diagnostics with more specific messages
        if (error.message.includes('provider is not enabled')) {
          toast.error(`${provider} login is not available. Please contact support or verify provider settings.`);
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
      // No need for another toast as one was already shown above
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthCallback = async (provider: string, code: string, user: User | null): Promise<void> => {
    setIsLoading(true);
    try {
      console.log(`Processing OAuth callback for ${provider}`, user ? "User found" : "No user");
      
      if (!user) {
        // Try to get the session directly
        const { data, error } = await supabase.auth.getSession();
        console.log("Session check:", data?.session ? "Session exists" : "No session", error ? `Error: ${error.message}` : "No error");
        
        if (error) {
          toast.error(`Authentication verification failed: ${error.message}`);
          navigate('/login');
          return;
        }
        
        if (data.session) {
          // We have a session but no formatted user yet
          const formattedUser = await formatUser(data.session.user);
          if (formattedUser) {
            toast.success(`Successfully signed in with ${provider}!`);
            navigate(formattedUser.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
            return;
          }
        }
        
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }
      
      toast.success(`Successfully signed in with ${provider}!`);
      navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
    } catch (error: any) {
      console.error(`${provider} OAuth callback error:`, error);
      toast.error('Authentication failed. Please try again.');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithSocialProvider, handleOAuthCallback };
};

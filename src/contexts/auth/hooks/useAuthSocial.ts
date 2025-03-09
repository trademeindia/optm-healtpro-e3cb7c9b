
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

  const handleOAuthCallback = async (provider: string, code: string, user: User | null): Promise<void> => {
    setIsLoading(true);
    try {
      console.log(`Processing OAuth callback for ${provider}`, user ? "User found" : "No user", "code length:", code.length);
      
      // Ensure we have a code to exchange
      if (!code) {
        console.error("No authorization code provided in callback");
        toast.error("Authentication failed: Missing authorization code");
        navigate('/login');
        return;
      }
      
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
          try {
            const formattedUser = await formatUser(data.session.user);
            if (formattedUser) {
              console.log("Successfully retrieved user after OAuth flow:", formattedUser);
              toast.success(`Successfully signed in with ${provider}!`);
              // Use window.location.href for a full page reload to ensure state is fresh
              window.location.href = formattedUser.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
              return;
            } else {
              console.error("Failed to format user from session");
              // Instead of failing, let's try to create a profile with default values
              const defaultRole = 'patient';
              
              // Insert a new profile for the OAuth user if formatUser failed but we have a session
              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: data.session.user.id,
                  email: data.session.user.email,
                  name: data.session.user.user_metadata?.full_name || 
                        data.session.user.user_metadata?.name || 
                        data.session.user.email?.split('@')[0] || 'User',
                  role: defaultRole,
                  provider: provider as any,
                  picture: data.session.user.user_metadata?.avatar_url || ''
                })
                .select()
                .single();
                
              if (insertError) {
                console.error('Error creating user profile:', insertError);
                toast.error('Failed to create user profile');
                navigate('/login');
                return;
              }
              
              console.log("Created new profile for OAuth user:", newProfile);
              toast.success(`Successfully signed in with ${provider}!`);
              // Use window.location.href for a full page reload
              window.location.href = '/patient-dashboard';
              return;
            }
          } catch (formatError) {
            console.error("Error formatting user from session:", formatError);
          }
        }
        
        // Add additional debug information to help diagnose the issue
        console.error("OAuth callback failed to find a user despite having a code");
        console.log("Examining URL parameters:", window.location.search);
        
        toast.error('Authentication failed. Please try again and check the debug section.');
        navigate('/login');
        return;
      }
      
      toast.success(`Successfully signed in with ${provider}!`);
      // Use window.location.href for a full page reload
      window.location.href = user.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
    } catch (error: any) {
      console.error(`${provider} OAuth callback error:`, error);
      toast.error('Authentication failed. Please try again and check the debug section.');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithSocialProvider, handleOAuthCallback };
};

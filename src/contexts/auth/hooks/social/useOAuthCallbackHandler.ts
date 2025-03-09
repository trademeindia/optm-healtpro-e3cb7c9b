
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from '../../utils';
import { User } from '../../types';

type UseOAuthCallbackHandlerProps = {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
};

export const useOAuthCallbackHandler = ({ setIsLoading, navigate }: UseOAuthCallbackHandlerProps) => {
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
              // Use navigate instead of direct window.location.href to prevent blank screen
              navigate(formattedUser.role === 'doctor' ? '/dashboard' : '/patient-dashboard', { replace: true });
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
              // Use navigate instead of window.location.href for a smoother transition
              navigate('/patient-dashboard', { replace: true });
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
      // Use navigate instead of window.location.href for smoother transition
      navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard', { replace: true });
    } catch (error: any) {
      console.error(`${provider} OAuth callback error:`, error);
      toast.error('Authentication failed. Please try again and check the debug section.');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleOAuthCallback };
};

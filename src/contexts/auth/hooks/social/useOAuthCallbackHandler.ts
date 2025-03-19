
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from '../../utils';
import { User } from '../../types';

type UseOAuthCallbackHandlerProps = {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
};

export const useOAuthCallbackHandler = ({ setIsLoading, navigate }: UseOAuthCallbackHandlerProps) => {
  const handleOAuthCallback = async (provider: string, code: string, user: User | null = null): Promise<void> => {
    setIsLoading(true);
    try {
      console.log(`Processing OAuth callback for ${provider}`, user ? "User found" : "No user", "code length:", code.length);
      
      // Ensure we have a code to exchange
      if (!code) {
        console.error("No authorization code provided in callback");
        toast.error("Authentication failed: Missing authorization code", {
          duration: 5000
        });
        navigate('/login');
        return;
      }
      
      // Check for existing session since OAuth might have already completed
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session check error:", sessionError);
        toast.error("Authentication error: Unable to verify session", {
          duration: 5000
        });
        navigate('/login');
        return;
      }
      
      console.log("Session check on callback:", sessionData?.session ? "Session exists" : "No session");
      
      if (sessionData?.session) {
        // We have a session, try to get the user profile
        try {
          const formattedUser = await formatUser(sessionData.session.user);
          
          if (formattedUser) {
            console.log("Successfully retrieved user after OAuth flow:", formattedUser);
            toast.success(`Successfully signed in with ${provider}!`, {
              duration: 3000
            });
            
            // Navigate based on user role
            navigate(formattedUser.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
            return;
          } else {
            console.error("Failed to format user from session, creating default profile");
            
            // Create default profile if formatUser fails but session exists
            const defaultRole = 'patient';
            
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: sessionData.session.user.id,
                email: sessionData.session.user.email,
                name: sessionData.session.user.user_metadata?.full_name || 
                      sessionData.session.user.user_metadata?.name || 
                      sessionData.session.user.email?.split('@')[0] || 'User',
                role: defaultRole,
                provider: provider as any,
                picture: sessionData.session.user.user_metadata?.avatar_url || ''
              })
              .select()
              .single();
              
            if (insertError) {
              console.error('Error creating user profile:', insertError);
              toast.error('Failed to create user profile', {
                duration: 5000
              });
              navigate('/login');
              return;
            }
            
            console.log("Created new profile for OAuth user:", newProfile);
            toast.success(`Successfully signed in with ${provider}!`, {
              duration: 3000
            });
            
            navigate('/patient-dashboard');
            return;
          }
        } catch (formatError) {
          console.error("Error formatting user from session:", formatError);
        }
      }
      
      // If we have a user object passed in, use that
      if (user) {
        toast.success(`Successfully signed in with ${provider}!`, {
          duration: 3000
        });
        navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
        return;
      }
      
      // If we reach here, we don't have a session yet, so we need to process the code
      // This should already be handled by Supabase's internal handling through URL params
      console.log("No session found with provided code, returning to login");
      toast.info('Please try signing in again', {
        duration: 5000
      });
      navigate('/login');
    } catch (error: any) {
      console.error(`${provider} OAuth callback error:`, error);
      toast.error('Authentication failed. Please try again.', {
        duration: 5000
      });
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleOAuthCallback };
};

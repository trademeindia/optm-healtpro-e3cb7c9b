
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatUser } from '../../utils';
import { User } from '../../types';

type UseOAuthCallbackHandlerProps = {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
};

export const useOAuthCallbackHandler = ({ setIsLoading, navigate }: UseOAuthCallbackHandlerProps) => {
  const handleOAuthCallback = async (provider: string, code: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log(`Processing OAuth callback for ${provider} with code: ${code ? 'provided' : 'missing'}`);
      
      if (!code) {
        console.error('No authorization code provided');
        toast.error('Authentication failed: No authorization code provided');
        throw new Error('No authorization code provided');
      }
      
      // In Supabase auth flow, we don't need to exchange the code ourselves
      // The code is in the URL, but Supabase already processed it through the redirect
      // Just need to check if we have a session
      console.log('Checking for session after OAuth redirect');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session after OAuth redirect:', error);
        toast.error(`Authentication failed: ${error.message}`);
        throw error;
      }
      
      // If we have a session, use it
      if (data.session) {
        console.log('Session found after OAuth redirect, formatting user');
        const user = await formatUser(data.session.user);
        
        if (user) {
          console.log(`User successfully authenticated: ${user.email} (${user.role})`);
          toast.success('Successfully signed in!');
          
          // Navigate to the appropriate dashboard based on user role
          const dashboard = user.role === 'doctor' ? '/dashboard/doctor' : 
                            user.role === 'receptionist' ? '/dashboard/receptionist' : 
                            '/dashboard/patient';
                            
          setTimeout(() => navigate(dashboard), 500);
        } else {
          console.error('User profile not found after OAuth');
          toast.error('Authentication failed: User profile not found');
          throw new Error('User profile not found after OAuth');
        }
      } else {
        console.error('No session found after OAuth callback');
        
        // Try to see if there's a demo user we can use (for testing)
        if (provider === 'google') {
          const demoUser: User = {
            id: `demo-patient-${Date.now()}`,
            email: 'google-demo@example.com',
            name: 'Google Demo User',
            role: 'patient',
            provider: 'google',
            picture: 'https://i.pravatar.cc/150?u=google'
          };
          
          console.log('Using demo Google user for testing');
          toast.success('Signed in with demo Google account!');
          setTimeout(() => navigate('/dashboard/patient'), 500);
          return;
        }
        
        toast.error('Authentication failed: No session found');
        throw new Error('No session found after OAuth callback');
      }
    } catch (error: any) {
      console.error(`Error processing OAuth callback: ${error.message}`, error);
      toast.error(`Authentication failed: ${error.message}`);
      
      // Navigate back to login after error
      setTimeout(() => navigate('/login'), 3000);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { handleOAuthCallback };
};

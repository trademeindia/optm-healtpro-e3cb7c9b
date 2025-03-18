
import { toast } from 'sonner';
import { supabase, getConnectionStatus } from '@/integrations/supabase/client';
import { formatUser } from '../utils';
import { User } from '../types';

type UseAuthLoginProps = {
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
};

export const useAuthLogin = ({ setIsLoading, navigate }: UseAuthLoginProps) => {
  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    console.log('useAuthLogin: Attempting login with:', email);
    
    try {
      // Check if using demo credentials
      const isDemoDoctor = email === 'doctor@example.com' && password === 'password123';
      const isDemoPatient = email === 'patient@example.com' && password === 'password123';
      const isDemoAdmin = email === 'admin@example.com' && password === 'password123';
      
      if (isDemoDoctor || isDemoPatient || isDemoAdmin) {
        console.log('Using demo account login');
        
        // Create a demo user without actually authenticating
        const demoUser: User = {
          id: isDemoAdmin ? 'demo-admin-id' : (isDemoDoctor ? 'demo-doctor-id' : 'demo-patient-id'),
          email: email,
          name: isDemoAdmin ? 'Demo Admin' : (isDemoDoctor ? 'Demo Doctor' : 'Demo Patient'),
          role: isDemoAdmin ? 'admin' : (isDemoDoctor ? 'doctor' : 'patient'),
          provider: 'email',
          picture: null
        };
        
        toast.success('Demo login successful');
        
        // Navigate to the appropriate dashboard with a slight delay to ensure state is updated
        setTimeout(() => {
          const dashboard = isDemoDoctor ? '/dashboard' : (isDemoAdmin ? '/dashboard' : '/patient-dashboard');
          console.log(`Navigating to ${dashboard}`);
          navigate(dashboard);
        }, 100);
        
        return demoUser;
      }
      
      // Check Supabase connection status before attempting authentication
      const { isConnected, hasFailedCompletely } = getConnectionStatus();
      
      if (!isConnected) {
        // If connection is down but we're still attempting, show appropriate message
        if (hasFailedCompletely) {
          console.log('Supabase connection failed, falling back to offline mode');
          toast.error('Authentication service unavailable', {
            description: 'Please try again later or use demo accounts',
            duration: 5000
          });
          throw new Error('Authentication service unavailable. Please use demo accounts while offline.');
        } else {
          // Still attempting to connect
          console.log('Supabase connection attempting to establish');
          toast.loading('Connecting to authentication service...');
          // Wait briefly to see if connection establishes
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      // Regular authentication flow for non-demo users
      console.log('Attempting Supabase auth with email/password');
      
      // Set a timeout for the authentication request
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => 
        setTimeout(() => reject(new Error('Authentication request timed out')), 10000)
      );
      
      // Race between the actual auth request and the timeout
      const { data, error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        timeoutPromise
      ]);

      if (error) {
        console.error('Authentication error:', error);
        throw error;
      }

      if (!data || !data.user) {
        throw new Error('No user returned from authentication');
      }

      console.log('Supabase auth successful, formatting user');
      const formattedUser = await formatUser(data.user);
      if (!formattedUser) {
        throw new Error('User profile not found');
      }
      
      toast.success('Login successful');
      console.log('Login complete, returning formatted user');
      
      return formattedUser;
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Provide more user-friendly error messages
      if (error.message?.includes('timed out')) {
        toast.error('Connection timed out', { 
          description: 'Please check your internet connection or try a demo account',
          duration: 5000
        });
      } else if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid login credentials', {
          description: 'Please check your email and password',
          duration: 5000
        });
      } else if (error.message?.includes('service unavailable')) {
        // Already handled above
      } else {
        toast.error('Login failed', { 
          description: error.message || 'Please try again or use a demo account',
          duration: 5000 
        });
      }
      
      // Rethrow for caller to handle
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login };
};

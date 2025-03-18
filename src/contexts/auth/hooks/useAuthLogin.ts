
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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
      
      // Regular authentication flow for non-demo users
      console.log('Attempting Supabase auth with email/password');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Authentication error:', error);
        throw error;
      }

      if (!data.user) {
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
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login };
};

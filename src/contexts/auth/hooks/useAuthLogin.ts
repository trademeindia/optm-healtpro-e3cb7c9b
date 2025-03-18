
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
    try {
      console.log(`Attempting to log in with email: ${email}`);
      
      // Check if using demo credentials
      const isDemoDoctor = email === 'doctor@example.com' && password === 'password123';
      const isDemoPatient = email === 'patient@example.com' && password === 'password123';
      
      if (isDemoDoctor || isDemoPatient) {
        console.log('Using demo account login');
        
        // Create a demo user without actually authenticating
        const demoUser: User = {
          id: isDemoDoctor ? 'demo-doctor-id' : 'demo-patient-id',
          email: email,
          name: isDemoDoctor ? 'Demo Doctor' : 'Demo Patient',
          role: isDemoDoctor ? 'doctor' : 'patient',
          provider: 'email',
          picture: null
        };
        
        toast.success('Demo login successful');
        
        // Navigate to the appropriate dashboard with a slight delay to ensure state is updated
        setTimeout(() => {
          const dashboard = isDemoDoctor ? '/dashboard' : '/patient-dashboard';
          console.log(`Navigating to ${dashboard}`);
          navigate(dashboard);
        }, 100);
        
        return demoUser;
      }
      
      // Regular authentication flow for non-demo users
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

      const formattedUser = await formatUser(data.user);
      if (!formattedUser) {
        throw new Error('User profile not found');
      }
      
      toast.success('Login successful');
      
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

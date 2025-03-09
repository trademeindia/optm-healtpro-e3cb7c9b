
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
          picture: ''
        };
        
        // Save demo user to localStorage for persistence across refreshes
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        
        toast.success('Demo login successful');
        
        // Return the user first, navigation will be handled in AuthProvider
        return demoUser;
      }
      
      // Regular authentication flow for non-demo users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const formattedUser = await formatUser(data.user);
      if (!formattedUser) throw new Error('User profile not found');
      
      toast.success('Login successful');
      
      // Regular users will be redirected in AuthProvider
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

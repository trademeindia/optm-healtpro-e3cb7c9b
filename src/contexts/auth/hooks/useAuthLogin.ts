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
      // Special cases for demo accounts
      if (email === 'admin@example.com' && password === 'password123') {
        // Handle demo admin login
        const demoUser: User = {
          id: `demo-admin-${Date.now()}`,
          email: email,
          name: 'Admin Demo Account',
          role: 'admin' as any,
          provider: 'email',
          picture: null
        };
        
        toast.success('Admin demo login successful');
        navigate('/dashboard');
        return demoUser;
      }
      else if (email === 'doctor@example.com' && password === 'password123') {
        // Handle demo doctor login
        const demoUser: User = {
          id: `demo-doctor-${Date.now()}`,
          email: email,
          name: 'Dr. Demo Account',
          role: 'doctor' as any,
          provider: 'email',
          picture: null
        };
        
        toast.success('Doctor demo login successful');
        navigate('/dashboard');
        return demoUser;
      }
      else if (email === 'patient@example.com' && password === 'password123') {
        // Handle demo patient login
        const demoUser: User = {
          id: `demo-patient-${Date.now()}`,
          email: email,
          name: 'Patient Demo',
          role: 'patient' as any,
          provider: 'email',
          picture: null
        };
        
        toast.success('Patient demo login successful');
        navigate('/patient-dashboard');
        return demoUser;
      }
      else if (email === 'receptionist@example.com' && password === 'password123') {
        // Handle demo receptionist login
        const demoUser: User = {
          id: `demo-receptionist-${Date.now()}`,
          email: email,
          name: 'Receptionist Demo',
          role: 'receptionist' as any,
          provider: 'email',
          picture: null
        };
        
        toast.success('Receptionist demo login successful');
        navigate('/dashboard');
        return demoUser;
      }
      
      // Handle real login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      const formattedUser = await formatUser(data.user);
      
      if (formattedUser) {
        toast.success('Login successful');
        navigate(formattedUser.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
      }
      
      return formattedUser;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed', {
        duration: 5000
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login };
};

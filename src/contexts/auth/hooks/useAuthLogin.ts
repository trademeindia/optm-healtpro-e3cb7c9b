
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const formattedUser = await formatUser(data.user);
      if (!formattedUser) throw new Error('User profile not found');
      
      toast.success('Login successful');
      
      if (formattedUser.role === 'doctor') {
        navigate('/dashboard');
      } else {
        navigate('/patient-dashboard');
      }
      
      return formattedUser;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login };
};


import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type UseAuthManagementProps = {
  navigate: (path: string) => void;
};

export const useAuthManagement = ({ navigate }: UseAuthManagementProps) => {
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      toast.info('You have been logged out');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
      throw error;
    }
  };

  return { logout, forgotPassword };
};


import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type UseAuthManagementProps = {
  navigate: (path: string) => void;
};

export const useAuthManagement = ({ navigate }: UseAuthManagementProps) => {
  const logout = async (): Promise<void> => {
    try {
      // Check current session to see if it's a demo account
      const { data: { session } } = await supabase.auth.getSession();
      
      // If there's no session, this could be a demo user
      if (!session) {
        toast.info('You have been logged out');
        navigate('/login');
        return;
      }
      
      // Regular logout for authenticated users
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
      // Special case for demo accounts
      if (email === 'doctor@example.com' || email === 'patient@example.com') {
        toast.success('Demo account password is "password123"');
        return;
      }
      
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

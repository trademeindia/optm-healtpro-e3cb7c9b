
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type UseAuthManagementProps = {
  navigate: (path: string) => void;
};

export const useAuthManagement = ({ navigate }: UseAuthManagementProps) => {
  const logout = async (): Promise<void> => {
    try {
      // Flag to track if we need to navigate after cleanup
      let shouldNavigate = true;
      
      // Check if we have a demo user in localStorage
      const demoUserData = localStorage.getItem('demoUser');
      
      if (demoUserData) {
        // Clear demo user from localStorage
        localStorage.removeItem('demoUser');
        console.log('Demo user data cleared from localStorage');
      }
      
      // Always attempt to sign out from Supabase as well
      // This ensures we clear any potential session even for demo users
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Supabase signOut error:', error);
          // Continue with local cleanup even if Supabase fails
        } else {
          console.log('Supabase signOut successful');
        }
      } catch (supabaseError) {
        console.error('Unexpected error during Supabase signOut:', supabaseError);
        // Continue with local cleanup even if Supabase fails
      }
      
      // Show success message
      toast.success('You have been logged out', {
        duration: 3000
      });
      
      // Navigate to login page
      if (shouldNavigate) {
        console.log('Navigating to login page after logout');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out', {
        duration: 4000
      });
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      // Special case for demo accounts
      if (email === 'doctor@example.com' || email === 'patient@example.com') {
        toast.success('Demo account password is "password123"', {
          duration: 5000
        });
        return;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email', {
        duration: 5000
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link', {
        duration: 5000
      });
      throw error;
    }
  };

  return { logout, forgotPassword };
};

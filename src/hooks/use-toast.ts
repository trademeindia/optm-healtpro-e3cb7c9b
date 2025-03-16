
import { toast as sonnerToast } from 'sonner';

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
  duration?: number;
}

// Export the toast function directly so it can be imported elsewhere
export const toast = sonnerToast;

export const useToast = () => {
  return {
    toast: ({ title, description, action, variant, duration = 3000 }: ToastProps) => {
      if (variant === 'destructive') {
        return sonnerToast.error(title, {
          description,
          duration,
          action
        });
      }
      
      return sonnerToast(title, {
        description,
        duration,
        action
      });
    }
  };
};

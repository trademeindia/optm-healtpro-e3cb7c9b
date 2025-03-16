
import { toast } from 'sonner';

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export const useToast = () => {
  return {
    toast: ({ title, description, action, variant, duration = 3000 }: ToastProps) => {
      if (variant === 'destructive') {
        return toast.error(title, {
          description,
          duration,
          action
        });
      }
      
      return toast(title, {
        description,
        duration,
        action
      });
    }
  };
};

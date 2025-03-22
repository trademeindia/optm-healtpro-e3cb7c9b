
import { toast } from 'sonner';

export const useToast = () => {
  return {
    toast: {
      success: (message: string) => toast.success(message),
      error: (message: string) => toast.error(message),
      info: (message: string) => toast(message),
      warning: (message: string) => toast(message, {
        style: { backgroundColor: 'var(--warning)' }
      })
    }
  };
};

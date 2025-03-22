
import { toast } from 'sonner';
import { useToast as useInternalToast } from '@/hooks/use-toast';

export const useToast = () => {
  const internalToast = useInternalToast();
  
  return {
    toast: {
      success: (message: string) => toast.success(message),
      error: (message: string) => toast.error(message),
      info: (message: string) => toast(message),
      warning: (message: string) => toast(message, {
        style: { backgroundColor: 'var(--warning)' }
      })
    },
    // Also expose the internal toast API for components that need it
    internalToast
  };
};

// Re-export the toast function from the internal implementation
export { toast } from '@/hooks/use-toast';

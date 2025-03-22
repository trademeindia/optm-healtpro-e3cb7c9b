
import * as React from "react";
import { toast as sonnerToast } from 'sonner';

// Re-export the internal toast implementation for components that need it
export { useToast, toast } from '@/hooks/use-toast';

// Simple wrapper around sonner toast for backward compatibility
export const useInternalToast = () => {
  return {
    toast: {
      success: (message: string) => sonnerToast.success(message),
      error: (message: string) => sonnerToast.error(message),
      info: (message: string) => sonnerToast(message),
      warning: (message: string) => sonnerToast(message, {
        style: { backgroundColor: 'var(--warning)' }
      })
    }
  };
};

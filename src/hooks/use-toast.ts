
import { toast as sonnerToast } from 'sonner';

// Define the toast action type
type ToastAction = {
  altText: string;
  onClick: () => void;
  label: string;
};

// Define the props for toast
type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastAction;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
};

// Custom toast function that wraps sonner's toast
const toast = ({
  title,
  description,
  action,
  variant = 'default',
  duration = 5000,
}: ToastProps) => {
  // Map variants to sonner types
  const type = variant === 'destructive' ? 'error' : variant === 'success' ? 'success' : 'default';
  
  // Create the toast content
  if (type === 'error') {
    return sonnerToast.error(title, {
      description,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      duration,
    });
  } else if (type === 'success') {
    return sonnerToast.success(title, {
      description,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      duration,
    });
  } else {
    return sonnerToast(title, {
      description,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      duration,
    });
  }
};

// Create a fake useToast hook that returns the toast function
// This is for compatibility with components that expect useToast from shadcn
export const useToast = () => {
  return { toast };
};

// Export the toast function for direct use
export { toast };

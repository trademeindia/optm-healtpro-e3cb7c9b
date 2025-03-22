
import * as React from "react";
import { toast as sonnerToast } from 'sonner';

// Define types for toast props
type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

// Main toast function
export const toast = (props: ToastProps) => {
  if (props.variant === "destructive") {
    return sonnerToast.error(props.title || "", {
      description: props.description,
      duration: props.duration || 5000,
    });
  }

  return sonnerToast(props.title || "", {
    description: props.description,
    duration: props.duration || 3000,
  });
};

// Creating a custom hook that manages toast state and provides the toast function
export const useToast = () => {
  // Create a mutable ref to store the toast state
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  return {
    toast,
    toasts,
    dismiss: sonnerToast.dismiss
  };
};

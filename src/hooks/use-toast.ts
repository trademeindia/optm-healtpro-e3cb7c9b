
import * as React from "react";
import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

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

// Create a hook version of the toast function for components that need it
export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss
  };
};

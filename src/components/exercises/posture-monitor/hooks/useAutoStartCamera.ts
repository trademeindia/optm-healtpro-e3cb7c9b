
import { useEffect } from 'react';
import { FeedbackType } from '../types';
import type { CustomFeedback } from './types';

interface UseAutoStartCameraProps {
  cameraActive: boolean;
  permission: PermissionState | null;
  toggleCamera: () => Promise<void> | void;
  setCustomFeedback: (feedback: CustomFeedback | null) => void;
}

export const useAutoStartCamera = ({
  cameraActive,
  permission,
  toggleCamera,
  setCustomFeedback
}: UseAutoStartCameraProps) => {
  // Auto-start camera if permission is already granted
  useEffect(() => {
    // Only auto-start if we have explicit permission
    if (permission === 'granted' && !cameraActive) {
      setCustomFeedback({
        message: "Starting camera automatically...",
        type: FeedbackType.INFO
      });
      
      // Small delay to avoid race conditions
      const timer = setTimeout(() => {
        const result = toggleCamera();
        
        // Handle both Promise and void returns
        if (result instanceof Promise) {
          result.catch(error => {
            console.error("Error auto-starting camera:", error);
            setCustomFeedback({
              message: "Failed to start camera automatically. Please try manually.",
              type: FeedbackType.ERROR // This was causing an error; FeedbackType.ERROR was undefined
            });
          });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [permission, cameraActive, toggleCamera, setCustomFeedback]);
};

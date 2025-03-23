
import { useEffect } from 'react';
import { FeedbackType } from '../types';
import type { CustomFeedback } from './types';

interface UseAutoStartCameraProps {
  cameraActive: boolean;
  permission: PermissionState | null;
  toggleCamera: () => void;
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
    // Only auto-start if we have explicit permission and camera is not active
    if (permission === 'granted' && !cameraActive) {
      setCustomFeedback({
        message: "Starting camera automatically...",
        type: FeedbackType.INFO
      });
      
      // Small delay to avoid race conditions and prevent multiple calls
      const timer = setTimeout(() => {
        toggleCamera();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [permission, cameraActive, toggleCamera, setCustomFeedback]);
};


import { useEffect } from 'react';
import { FeedbackType } from '@/lib/human/types';
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
  // Auto-start camera if permission is granted
  useEffect(() => {
    if (!cameraActive && permission === 'granted') {
      // Show feedback
      setCustomFeedback({
        message: "Starting camera automatically...",
        type: FeedbackType.INFO
      });
      
      // Slight delay to allow feedback to be displayed
      const timer = setTimeout(() => {
        toggleCamera();
      }, 500);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [cameraActive, permission, toggleCamera, setCustomFeedback]);
};

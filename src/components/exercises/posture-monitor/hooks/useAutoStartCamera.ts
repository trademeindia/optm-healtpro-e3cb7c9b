
import { useEffect } from 'react';
import { FeedbackType } from '../types';
import { CustomFeedback } from './types';

interface UseAutoStartCameraProps {
  cameraActive: boolean;
  permission: 'granted' | 'denied' | 'prompt';
  toggleCamera: () => Promise<void>;
  setCustomFeedback: (feedback: CustomFeedback | null) => void;
}

export const useAutoStartCamera = ({
  cameraActive,
  permission,
  toggleCamera,
  setCustomFeedback
}: UseAutoStartCameraProps) => {
  // Auto-start camera when component mounts if permission is granted
  useEffect(() => {
    let mounted = true;
    
    const startCameraIfPermitted = async () => {
      if (!cameraActive && permission === 'granted' && mounted) {
        try {
          await toggleCamera();
        } catch (error) {
          console.error('Failed to auto-start camera:', error);
          if (mounted) {
            setCustomFeedback({
              message: "Could not start camera automatically. Please try the camera button.",
              type: FeedbackType.WARNING
            });
          }
        }
      }
    };
    
    startCameraIfPermitted();
    
    return () => {
      mounted = false;
    };
  }, [permission]); // Only depend on permission, not cameraActive which changes during the effect
};

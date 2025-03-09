
import { useEffect } from 'react';
import { FeedbackType } from '../types';

interface UseAutoStartCameraProps {
  cameraActive: boolean;
  permission: 'granted' | 'denied' | 'prompt';
  toggleCamera: () => Promise<void>;
  setCustomFeedback: (feedback: { message: string | null, type: FeedbackType } | null) => void;
}

export const useAutoStartCamera = ({
  cameraActive,
  permission,
  toggleCamera,
  setCustomFeedback
}: UseAutoStartCameraProps) => {
  // Auto-start camera when component mounts
  useEffect(() => {
    // Give browser a moment to initialize
    const timer = setTimeout(() => {
      if (!cameraActive && permission !== 'denied') {
        toggleCamera().catch(err => {
          console.error("Failed to auto-start camera:", err);
          setCustomFeedback({
            message: "Failed to start camera automatically. Please try the Enable Camera button.",
            type: FeedbackType.WARNING
          });
        });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [cameraActive, permission, toggleCamera, setCustomFeedback]);
};

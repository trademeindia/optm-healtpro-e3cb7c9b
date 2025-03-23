
import { useEffect } from 'react';
import { FeedbackType } from '../types';
import type { CustomFeedback } from './types';
import type { VideoStatus } from './detection/types';

interface UseVideoStatusMonitorProps {
  cameraActive: boolean;
  videoStatus: VideoStatus;
  setCustomFeedback: (feedback: CustomFeedback | null) => void;
}

export const useVideoStatusMonitor = ({
  cameraActive,
  videoStatus,
  setCustomFeedback
}: UseVideoStatusMonitorProps) => {
  // Monitor video status changes
  useEffect(() => {
    if (!cameraActive) return;
    
    if (videoStatus.errorCount > 5) {
      setCustomFeedback({
        message: "Camera feed has issues. Please try again or use a different camera.",
        type: FeedbackType.WARNING
      });
    } else if (!videoStatus.isReady && videoStatus.hasStream) {
      setCustomFeedback({
        message: "Initializing camera feed...",
        type: FeedbackType.INFO
      });
    } else if (videoStatus.isReady) {
      // Clear any video-related feedback when ready
      setCustomFeedback(null);
    }
  }, [cameraActive, videoStatus, setCustomFeedback]);
};

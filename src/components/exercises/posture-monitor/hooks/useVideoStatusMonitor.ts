
import { useEffect } from 'react';
import { FeedbackType } from '../types';
import type { CustomFeedback } from './types';

interface VideoStatus {
  isReady: boolean;
  hasStarted: boolean;
  error: string | null;
}

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
    
    if (videoStatus.error) {
      setCustomFeedback({
        message: `Camera issue: ${videoStatus.error}`,
        type: FeedbackType.WARNING
      });
    } else if (videoStatus.hasStarted && !videoStatus.isReady) {
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

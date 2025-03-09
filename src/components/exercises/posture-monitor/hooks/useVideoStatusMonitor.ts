
import { useEffect } from 'react';
import { FeedbackType } from '../types';

interface UseVideoStatusMonitorProps {
  cameraActive: boolean;
  videoStatus: {
    isReady: boolean;
    errorCount: number;
  };
  setCustomFeedback: (feedback: { message: string | null, type: FeedbackType } | null) => void;
}

export const useVideoStatusMonitor = ({
  cameraActive,
  videoStatus,
  setCustomFeedback
}: UseVideoStatusMonitorProps) => {
  // Monitor video status and provide feedback
  useEffect(() => {
    if (cameraActive && !videoStatus.isReady && videoStatus.errorCount > 3) {
      setCustomFeedback({
        message: "Camera feed issues detected. The video may not be properly initialized.",
        type: FeedbackType.WARNING
      });
    }
  }, [cameraActive, videoStatus, setCustomFeedback]);
};

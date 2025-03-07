
import { useEffect } from 'react';
import { FeedbackType } from '../types';

interface UsePermissionMonitorProps {
  permission: 'granted' | 'denied' | 'prompt';
  setCustomFeedback: (feedback: { message: string | null, type: FeedbackType } | null) => void;
}

export const usePermissionMonitor = ({
  permission,
  setCustomFeedback
}: UsePermissionMonitorProps) => {
  // Update permission-related feedback
  useEffect(() => {
    if (permission === 'denied') {
      setCustomFeedback({
        message: "Camera access denied. Please check your browser permissions.",
        type: FeedbackType.WARNING
      });
    }
  }, [permission, setCustomFeedback]);
};

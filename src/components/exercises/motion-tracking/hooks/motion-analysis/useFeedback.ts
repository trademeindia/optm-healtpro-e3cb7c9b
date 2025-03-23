
import { useState, useCallback } from 'react';
import { FeedbackMessage, FeedbackType } from '@/components/exercises/posture-monitor/types';
import { UseFeedbackReturn } from './types';

export const useFeedback = (): UseFeedbackReturn => {
  const [feedback, setFeedback] = useState<FeedbackMessage>({
    message: null,
    type: FeedbackType.INFO
  });

  const updateFeedback = useCallback((message: string | null, type: FeedbackType) => {
    setFeedback({
      message,
      type
    });
  }, []);

  const resetFeedback = useCallback(() => {
    setFeedback({
      message: "Ready to start. Position yourself in the camera view.",
      type: FeedbackType.INFO
    });
  }, []);

  return {
    feedback,
    updateFeedback,
    resetFeedback
  };
};

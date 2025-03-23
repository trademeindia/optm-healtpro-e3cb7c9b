
import { useState, useCallback } from 'react';
import { FeedbackMessage, FeedbackType } from '@/components/exercises/posture-monitor/types';
import { UseFeedbackReturn } from './types';

export const useFeedback = (): UseFeedbackReturn => {
  const [feedback, setFeedback] = useState<FeedbackMessage>({
    message: null,
    type: FeedbackType.INFO
  });
  
  const updateFeedback = useCallback((message: string | null, type: string) => {
    setFeedback({
      message,
      type: type as FeedbackType
    });
  }, []);
  
  return {
    feedback,
    updateFeedback
  };
};

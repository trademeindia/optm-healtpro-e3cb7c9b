
import { useState, useEffect } from 'react';
import { FeedbackType } from '../types';

export interface FeedbackState {
  message: string | null;
  type: FeedbackType;
}

export const useFeedbackState = (isModelLoading: boolean, modelError: string | null) => {
  const [feedback, setFeedback] = useState<FeedbackState>({
    message: isModelLoading ? "Loading pose detection model..." : null,
    type: FeedbackType.INFO
  });
  
  // Update feedback when model loading state changes
  useEffect(() => {
    if (isModelLoading) {
      setFeedback({
        message: "Loading pose detection model...",
        type: FeedbackType.INFO
      });
    } else if (modelError) {
      setFeedback({
        message: modelError,
        type: FeedbackType.WARNING
      });
    }
  }, [isModelLoading, modelError]);
  
  const updateFeedback = (message: string | null, type: FeedbackType = FeedbackType.INFO) => {
    setFeedback({ message, type });
  };
  
  return {
    feedback,
    updateFeedback
  };
};

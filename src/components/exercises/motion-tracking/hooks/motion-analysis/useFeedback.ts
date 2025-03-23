
import { useState } from 'react';
import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';

export interface UseFeedbackReturn {
  feedback: FeedbackMessage;
  updateFeedback: (newFeedback: FeedbackMessage) => void;
  resetFeedback: () => void;
  generateFeedback: (motionState: MotionState, angles: BodyAngles) => FeedbackMessage;
}

export function useFeedback(): UseFeedbackReturn {
  const [feedback, setFeedback] = useState<FeedbackMessage>({
    message: null,
    type: FeedbackType.INFO
  });

  const updateFeedback = (newFeedback: FeedbackMessage) => {
    setFeedback(newFeedback);
  };

  const resetFeedback = () => {
    setFeedback({
      message: null,
      type: FeedbackType.INFO
    });
  };

  const generateFeedback = (motionState: MotionState, angles: BodyAngles): FeedbackMessage => {
    switch (motionState) {
      case MotionState.STANDING:
        return {
          message: "Ready for exercise. Maintain good posture.",
          type: FeedbackType.INFO
        };
      case MotionState.MID_MOTION:
        return {
          message: "Good form, continue the movement.",
          type: FeedbackType.INFO
        };
      case MotionState.FULL_MOTION:
        return {
          message: "Great depth! Now return to starting position.",
          type: FeedbackType.SUCCESS
        };
      default:
        return {
          message: null,
          type: FeedbackType.INFO
        };
    }
  };

  return {
    feedback,
    updateFeedback,
    resetFeedback,
    generateFeedback
  };
}


import { useCallback } from 'react';
import { SquatState, FeedbackType } from '../types';
import { PoseFeedback } from '../poseDetectionTypes';

interface UseSessionResetProps {
  resetMetrics: () => void;
  setCurrentSquatState: (state: SquatState) => void;
  setPrevSquatState: (state: SquatState) => void;
  setFeedbackMessage: (message: string | null, type: FeedbackType) => void;
  feedbackType: FeedbackType;
}

export const useSessionReset = ({
  resetMetrics,
  setCurrentSquatState,
  setPrevSquatState,
  setFeedbackMessage,
  feedbackType
}: UseSessionResetProps) => {
  // Reset session function to clear stats and state
  const resetSession = useCallback(() => {
    resetMetrics();
    setCurrentSquatState(SquatState.STANDING);
    setPrevSquatState(SquatState.STANDING);
    setFeedbackMessage("Session reset. Ready to start squatting!", feedbackType);
  }, [resetMetrics, setCurrentSquatState, setPrevSquatState, setFeedbackMessage, feedbackType]);

  return { resetSession };
};

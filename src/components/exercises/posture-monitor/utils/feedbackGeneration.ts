
import { SquatState, FeedbackType } from '../types';
import { FeedbackResult } from '../poseDetectionTypes';

// Generate feedback based on squat state and angles
export const generateFeedback = (
  currentSquatState: SquatState,
  kneeAngle: number | null,
  hipAngle: number | null
): FeedbackResult => {
  if (currentSquatState === SquatState.STANDING) {
    return {
      feedback: "Start your squat by bending your knees.",
      feedbackType: FeedbackType.INFO
    };
  } else if (currentSquatState === SquatState.MID_SQUAT) {
    if (hipAngle && hipAngle < 70) {
      return {
        feedback: "You're leaning too far forward.",
        feedbackType: FeedbackType.WARNING
      };
    } else if (hipAngle && hipAngle > 150) {
      return {
        feedback: "Bend forward slightly at the hips.",
        feedbackType: FeedbackType.WARNING
      };
    } else {
      return {
        feedback: "Good! Continue lowering into your squat.",
        feedbackType: FeedbackType.SUCCESS
      };
    }
  } else if (currentSquatState === SquatState.BOTTOM_SQUAT) {
    if (kneeAngle && kneeAngle < 70) {
      return {
        feedback: "Squat is too deep. Rise up slightly.",
        feedbackType: FeedbackType.WARNING
      };
    } else {
      return {
        feedback: "Great depth! Now push through your heels to rise up.",
        feedbackType: FeedbackType.SUCCESS
      };
    }
  }
  
  // Default feedback
  return {
    feedback: "Maintain good posture during your exercise.",
    feedbackType: FeedbackType.INFO
  };
};


import { FeedbackType, SquatState } from '../types';

interface FeedbackResult {
  feedback: string;
  feedbackType: FeedbackType;
}

export const generateFeedback = (
  squatState: SquatState,
  kneeAngle: number | null,
  hipAngle: number | null
): FeedbackResult => {
  // Default feedback if we can't determine from angles
  if (kneeAngle === null || hipAngle === null) {
    return {
      feedback: "Stand in position so your full body is visible",
      feedbackType: FeedbackType.INFO
    };
  }

  // Generate state-specific feedback
  switch (squatState) {
    case SquatState.STANDING:
      return {
        feedback: "Good starting position. Begin squatting down slowly.",
        feedbackType: FeedbackType.INFO
      };
      
    case SquatState.MID_SQUAT:
      // Check for common form issues during descent
      if (kneeAngle < 70 && hipAngle > 120) {
        return {
          feedback: "Keep your back straighter and bend at the hips more.",
          feedbackType: FeedbackType.WARNING
        };
      }
      
      if (kneeAngle < 120 && hipAngle < 90) {
        return {
          feedback: "Keep your chest up as you descend.",
          feedbackType: FeedbackType.WARNING
        };
      }
      
      return {
        feedback: "Continue lowering into your squat with control.",
        feedbackType: FeedbackType.INFO
      };
      
    case SquatState.BOTTOM_SQUAT:
      // Check bottom position form
      if (kneeAngle < 70) {
        return {
          feedback: "Great depth! Pause briefly, then push back up.",
          feedbackType: FeedbackType.SUCCESS
        };
      }
      
      if (kneeAngle >= 70 && kneeAngle < 90) {
        return {
          feedback: "Try to go a bit deeper if comfortable for your body.",
          feedbackType: FeedbackType.INFO
        };
      }
      
      if (hipAngle < 70) {
        return {
          feedback: "Watch your back angle. Keep your chest upright.",
          feedbackType: FeedbackType.WARNING
        };
      }
      
      return {
        feedback: "Hold this position briefly, then rise back up.",
        feedbackType: FeedbackType.INFO
      };
      
    default:
      return {
        feedback: "Position yourself so your full body is visible.",
        feedbackType: FeedbackType.INFO
      };
  }
};


import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/lib/human/types';

/**
 * Generate user feedback based on motion state
 */
export const generateFeedback = (motionState: MotionState, angles: BodyAngles): FeedbackMessage => {
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

/**
 * Evaluate the quality of a completed rep
 */
export const evaluateRepQuality = (angles: BodyAngles) => {
  // Simple evaluation logic
  const kneeAngle = angles.kneeAngle || 180;
  const hipAngle = angles.hipAngle || 180;
  
  const isGoodForm = kneeAngle < 120 && hipAngle < 140;
  
  return {
    isGoodForm,
    feedback: isGoodForm 
      ? "Great form on that rep!" 
      : "Try to keep your back straight and go deeper",
    feedbackType: isGoodForm ? FeedbackType.SUCCESS : FeedbackType.WARNING
  };
};

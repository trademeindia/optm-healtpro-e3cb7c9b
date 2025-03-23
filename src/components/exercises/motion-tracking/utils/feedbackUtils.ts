
import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';

/**
 * Generate real-time feedback messages based on motion state and body angles
 */
export const generateFeedback = (
  motionState: MotionState | null,
  angles: BodyAngles
): FeedbackMessage => {
  // Default feedback
  if (!motionState) {
    return {
      message: "Position yourself in front of the camera",
      type: FeedbackType.INFO
    };
  }
  
  // Feedback based on motion state
  switch (motionState) {
    case MotionState.STANDING:
      return {
        message: "Good starting position. Begin your exercise slowly.",
        type: FeedbackType.SUCCESS
      };
    
    case MotionState.MID_MOTION:
      // Check knee angle for form
      if (angles.kneeAngle !== null) {
        if (angles.kneeAngle < 80) {
          return {
            message: "Watch your knees - don't bend them too much",
            type: FeedbackType.WARNING
          };
        }
      }
      
      // Check hip angle for form
      if (angles.hipAngle !== null) {
        if (angles.hipAngle < 70) {
          return {
            message: "Keep your back straight and hips aligned",
            type: FeedbackType.WARNING
          };
        }
      }
      
      return {
        message: "Good form, continue the movement",
        type: FeedbackType.SUCCESS
      };
    
    case MotionState.FULL_MOTION:
      // Check for proper depth
      if (angles.kneeAngle !== null && angles.kneeAngle < 90) {
        return {
          message: "Great depth! Hold briefly, then return to starting position",
          type: FeedbackType.SUCCESS
        };
      }
      
      return {
        message: "Hold this position briefly, then slowly return up",
        type: FeedbackType.INFO
      };
    
    default:
      return {
        message: "Continue with controlled movements",
        type: FeedbackType.INFO
      };
  }
};

/**
 * Evaluate the quality of a completed rep
 */
export const evaluateRepQuality = (angles: BodyAngles): {
  isGoodForm: boolean;
  feedback: string;
  feedbackType: FeedbackType;
} | null => {
  // If we don't have angle data, can't evaluate
  if (!angles.kneeAngle && !angles.hipAngle) {
    return null;
  }
  
  let isGoodForm = true;
  let feedbackMessages = [];
  
  // Check knee angle - was the squat deep enough?
  if (angles.kneeAngle !== null) {
    if (angles.kneeAngle > 120) {
      feedbackMessages.push("Try to squat deeper next time");
      isGoodForm = false;
    }
  }
  
  // Check hip angle - was the back straight?
  if (angles.hipAngle !== null) {
    if (angles.hipAngle < 70) {
      feedbackMessages.push("Keep your back straighter");
      isGoodForm = false;
    }
  }
  
  // Determine feedback based on form quality
  if (isGoodForm) {
    return {
      isGoodForm: true,
      feedback: "Great form! Rep completed perfectly.",
      feedbackType: FeedbackType.SUCCESS
    };
  } else {
    return {
      isGoodForm: false,
      feedback: feedbackMessages.join(". ") || "Form needs improvement",
      feedbackType: FeedbackType.WARNING
    };
  }
};

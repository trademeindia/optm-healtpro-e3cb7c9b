
import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';

/**
 * Generates real-time feedback based on current motion state and joint angles
 */
export const generateFeedback = (
  motionState: MotionState | null, 
  angles: BodyAngles
): FeedbackMessage => {
  if (!motionState) {
    return {
      message: "Position yourself in the camera view",
      type: FeedbackType.INFO
    };
  }
  
  switch (motionState) {
    case MotionState.STANDING:
      return {
        message: "Good posture. Begin the exercise when ready.",
        type: FeedbackType.INFO
      };
      
    case MotionState.MID_MOTION:
      // Check form during motion
      if (angles.kneeAngle && angles.kneeAngle < 60) {
        return {
          message: "Watch your knees! Don't go too low.",
          type: FeedbackType.WARNING
        };
      }
      return {
        message: "Good form, continue the movement.",
        type: FeedbackType.INFO
      };
      
    case MotionState.FULL_MOTION:
      // Check if they've reached good depth
      if (angles.kneeAngle && angles.kneeAngle < 100 && angles.kneeAngle > 80) {
        return {
          message: "Great depth! Now return to starting position.",
          type: FeedbackType.SUCCESS
        };
      } else if (angles.kneeAngle && angles.kneeAngle < 80) {
        return {
          message: "You're going too low! Come up a bit.",
          type: FeedbackType.WARNING
        };
      }
      return {
        message: "Continue to lower until your knees reach 90°",
        type: FeedbackType.INFO
      };
      
    default:
      return {
        message: null,
        type: FeedbackType.INFO
      };
  }
};

/**
 * Evaluates the quality of a completed repetition
 */
export const evaluateRepQuality = (angles: BodyAngles) => {
  // Check if knee and hip angles indicate good form
  const kneeAngle = angles.kneeAngle || 180;
  const hipAngle = angles.hipAngle || 180;
  
  const idealKneeAngle = 90; // Ideal knee angle for a squat
  const kneeAngleTolerance = 20; // Acceptable deviation from ideal
  const minHipAngle = 90; // Minimum hip angle for good form
  
  const kneeInRange = Math.abs(kneeAngle - idealKneeAngle) <= kneeAngleTolerance;
  const hipInRange = hipAngle >= minHipAngle;
  
  const isGoodForm = kneeInRange && hipInRange;
  
  let feedback;
  let feedbackType;
  
  if (isGoodForm) {
    feedback = "Great form on that rep!";
    feedbackType = FeedbackType.SUCCESS;
  } else if (!kneeInRange) {
    feedback = "Try to bend your knees to about 90 degrees";
    feedbackType = FeedbackType.WARNING;
  } else {
    feedback = "Keep your back straighter during the movement";
    feedbackType = FeedbackType.WARNING;
  }
  
  return {
    isGoodForm,
    feedback,
    feedbackType
  };
};

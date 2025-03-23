
import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';

/**
 * Generate feedback based on motion state and body angles
 */
export const generateFeedback = (currentMotionState: MotionState, angles: BodyAngles): FeedbackMessage => {
  if (!angles.kneeAngle || !angles.hipAngle) {
    return {
      message: "Position yourself in the camera view",
      type: FeedbackType.INFO
    };
  }
  
  if (currentMotionState === MotionState.STANDING) {
    return {
      message: "Start your exercise by bending your knees",
      type: FeedbackType.INFO
    };
  } else if (currentMotionState === MotionState.MID_MOTION) {
    if (angles.hipAngle < 70) {
      return {
        message: "You're leaning too far forward",
        type: FeedbackType.WARNING
      };
    } else {
      return {
        message: "Good! Continue your movement",
        type: FeedbackType.SUCCESS
      };
    }
  } else if (currentMotionState === MotionState.FULL_MOTION) {
    return {
      message: "Great depth! Now return to starting position",
      type: FeedbackType.SUCCESS
    };
  }
  
  return {
    message: "Maintain good form during your exercise",
    type: FeedbackType.INFO
  };
};

/**
 * Evaluate the quality of a completed rep
 */
export const evaluateRepQuality = (angles: BodyAngles) => {
  if (!angles.kneeAngle || !angles.hipAngle) return null;
  
  let isGoodForm = true;
  let feedback = '';
  
  // Check knee angle
  if (angles.kneeAngle < 70) {
    isGoodForm = false;
    feedback = "Movement is too deep. Try not to overextend.";
  } else if (angles.kneeAngle > 130) {
    isGoodForm = false;
    feedback = "You're not going deep enough. Try to lower more.";
  }
  
  // Check hip angle
  if (angles.hipAngle < 70) {
    isGoodForm = false;
    feedback = "You're leaning too far forward. Keep your back straighter.";
  }
  
  if (isGoodForm) {
    feedback = "Excellent form! Keep it up!";
  }
  
  return {
    isGoodForm,
    feedback,
    feedbackType: isGoodForm ? FeedbackType.SUCCESS : FeedbackType.WARNING
  };
};


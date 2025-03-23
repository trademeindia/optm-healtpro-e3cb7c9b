
import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';

/**
 * Generate appropriate feedback based on current motion state and body angles
 */
export const generateFeedback = (
  motionState: MotionState,
  angles: BodyAngles
): FeedbackMessage => {
  // Default feedback message
  let message = "Position yourself in the camera view";
  let type = FeedbackType.INFO;
  
  // Motion state specific feedback
  switch (motionState) {
    case MotionState.STANDING:
      message = "Maintain good posture. Begin exercise when ready.";
      type = FeedbackType.INFO;
      
      // Check for alignment issues in standing position
      if (angles.shoulderAngle !== null && angles.shoulderAngle < 160) {
        message = "Stand tall with shoulders back before starting.";
        type = FeedbackType.WARNING;
      }
      
      if (angles.kneeAngle !== null && angles.kneeAngle < 170) {
        message = "Fully extend your legs in the starting position.";
        type = FeedbackType.WARNING;
      }
      break;
      
    case MotionState.MID_MOTION:
      message = "Good! Continue the movement with controlled form.";
      type = FeedbackType.INFO;
      
      // Check for form issues during the movement
      if (angles.hipAngle !== null && angles.kneeAngle !== null) {
        const hipKneeDifference = Math.abs(angles.hipAngle - angles.kneeAngle);
        
        if (hipKneeDifference > 30) {
          message = "Keep your back straighter during the movement.";
          type = FeedbackType.WARNING;
        }
      }
      break;
      
    case MotionState.FULL_MOTION:
      message = "Great depth! Now return to starting position with control.";
      type = FeedbackType.SUCCESS;
      
      // Check for knee alignment in bottom position
      if (angles.kneeAngle !== null && angles.kneeAngle < 60) {
        message = "You're going very deep - be careful of your knees.";
        type = FeedbackType.WARNING;
      }
      break;
      
    default:
      message = "Ready to begin tracking your movement.";
      type = FeedbackType.INFO;
  }
  
  return {
    message,
    type
  };
};

/**
 * Evaluate the quality of a completed repetition
 */
export const evaluateRepQuality = (angles: BodyAngles) => {
  // Tracking for form issues
  const formIssues = [];
  let isGoodForm = true;
  
  // Check knee angle (ideally should go to ~90 degrees for a squat)
  if (angles.kneeAngle !== null) {
    if (angles.kneeAngle < 60) {
      formIssues.push("going too deep with your knees");
      isGoodForm = false;
    } else if (angles.kneeAngle > 120) {
      formIssues.push("not going deep enough");
      isGoodForm = false;
    }
  }
  
  // Check hip angle (should be relatively close to knee angle)
  if (angles.hipAngle !== null && angles.kneeAngle !== null) {
    const hipKneeDifference = Math.abs(angles.hipAngle - angles.kneeAngle);
    if (hipKneeDifference > 30) {
      formIssues.push("back alignment needs improvement");
      isGoodForm = false;
    }
  }
  
  // Check shoulder angle (should stay relatively upright)
  if (angles.shoulderAngle !== null && angles.shoulderAngle < 140) {
    formIssues.push("shoulders leaning too far forward");
    isGoodForm = false;
  }
  
  // Generate feedback message
  let feedback;
  let feedbackType;
  
  if (isGoodForm) {
    feedback = "Excellent form on that rep!";
    feedbackType = FeedbackType.SUCCESS;
  } else {
    feedback = `Good effort, but try to improve your ${formIssues.join(" and ")}`;
    feedbackType = FeedbackType.WARNING;
  }
  
  return {
    isGoodForm,
    feedback,
    feedbackType
  };
};

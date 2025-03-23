
import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/lib/human/types';
import { isDeepEnough, hasProperForm } from './motionStateUtils';

// Generate feedback based on current motion state and angles
export const generateFeedback = (
  motionState: MotionState,
  angles: BodyAngles
): FeedbackMessage => {
  const { kneeAngle, hipAngle, shoulderAngle } = angles;
  
  // If missing key angles, provide guidance
  if (!kneeAngle || !hipAngle) {
    return {
      message: "Position yourself so your full body is visible in the camera",
      type: FeedbackType.INFO
    };
  }
  
  switch (motionState) {
    case MotionState.STANDING:
      return {
        message: "Good starting position. Begin your squat when ready.",
        type: FeedbackType.INFO
      };
      
    case MotionState.MID_MOTION:
      // Check form issues during descent/ascent
      if (kneeAngle < 150 && hipAngle < 90) {
        return {
          message: "Keep your chest up as you squat down",
          type: FeedbackType.WARNING
        };
      }
      
      if (kneeAngle < 150 && shoulderAngle && shoulderAngle < 160) {
        return {
          message: "Watch your shoulder alignment, keep your back straight",
          type: FeedbackType.WARNING 
        };
      }
      
      return {
        message: "Good movement, continue with control",
        type: FeedbackType.INFO
      };
      
    case MotionState.FULL_MOTION:
      if (!isDeepEnough(kneeAngle)) {
        return {
          message: "Try to squat deeper for full range of motion",
          type: FeedbackType.WARNING
        };
      }
      
      if (hasProperForm(kneeAngle, hipAngle, shoulderAngle)) {
        return {
          message: "Excellent depth! Maintain this position briefly, then return up with control",
          type: FeedbackType.SUCCESS
        };
      } else {
        // Identify specific form issues
        if (hipAngle < 70) {
          return {
            message: "Keep your back straighter and chest up at the bottom of your squat",
            type: FeedbackType.WARNING
          };
        }
        
        return {
          message: "Good depth, focus on maintaining proper form at the bottom",
          type: FeedbackType.INFO
        };
      }
      
    default:
      return {
        message: null,
        type: FeedbackType.INFO
      };
  }
};

// Evaluate the quality of a completed rep
export const evaluateRepQuality = (angles: BodyAngles) => {
  const { kneeAngle, hipAngle, shoulderAngle } = angles;
  
  // If missing key angles, can't evaluate
  if (!kneeAngle || !hipAngle) {
    return null;
  }
  
  // Check depth
  const goodDepth = isDeepEnough(kneeAngle);
  
  // Check overall form
  const goodForm = hasProperForm(kneeAngle, hipAngle, shoulderAngle);
  
  // Combine checks
  const isGoodForm = goodDepth && goodForm;
  
  // Generate feedback
  let feedback;
  let feedbackType;
  
  if (isGoodForm) {
    feedback = "Great form on that rep! Keep it up!";
    feedbackType = FeedbackType.SUCCESS;
  } else if (!goodDepth) {
    feedback = "Try to squat deeper for a full range of motion";
    feedbackType = FeedbackType.WARNING;
  } else {
    feedback = "Pay attention to your form. Keep your back straight and chest up";
    feedbackType = FeedbackType.WARNING;
  }
  
  return {
    isGoodForm,
    feedback,
    feedbackType
  };
};

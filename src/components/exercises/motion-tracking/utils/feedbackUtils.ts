
import { BodyAngles, FeedbackMessage, FeedbackType, MotionState } from '@/components/exercises/posture-monitor/types';

/**
 * Generate user feedback based on current motion state and body angles
 */
export const generateFeedback = (
  motionState: MotionState | null,
  angles: BodyAngles
): FeedbackMessage => {
  // If no detection or motion state, give generic setup instructions
  if (!motionState) {
    return {
      message: "Position yourself in the camera view",
      type: FeedbackType.INFO
    };
  }
  
  // Generate feedback based on motion state
  switch (motionState) {
    case MotionState.STANDING:
      return {
        message: "Good standing position. Prepare to begin exercise.",
        type: FeedbackType.SUCCESS
      };
      
    case MotionState.MID_MOTION:
      // Check form during mid-motion
      const midMotionFeedback = checkFormDuringMotion(angles);
      if (midMotionFeedback) {
        return midMotionFeedback;
      }
      
      return {
        message: "Keep going, maintain control",
        type: FeedbackType.INFO
      };
      
    case MotionState.FULL_MOTION:
      // Check form at bottom position
      const bottomPositionFeedback = checkFormAtBottomPosition(angles);
      if (bottomPositionFeedback) {
        return bottomPositionFeedback;
      }
      
      return {
        message: "Good depth, now return to standing",
        type: FeedbackType.SUCCESS
      };
      
    default:
      return {
        message: "Continue exercise with controlled movement",
        type: FeedbackType.INFO
      };
  }
};

/**
 * Check form during the motion/descent
 */
function checkFormDuringMotion(angles: BodyAngles): FeedbackMessage | null {
  // Check knee alignment
  if (angles.kneeAngle !== null && angles.kneeAngle < 70) {
    return {
      message: "Watch your knees, don't bend too far forward",
      type: FeedbackType.WARNING
    };
  }
  
  // Check hip position
  if (angles.hipAngle !== null && angles.hipAngle < 60) {
    return {
      message: "Keep your back straight, hinge at the hips",
      type: FeedbackType.WARNING
    };
  }
  
  // Check shoulder position
  if (angles.shoulderAngle !== null && angles.shoulderAngle < 150) {
    return {
      message: "Keep your chest up and shoulders back",
      type: FeedbackType.WARNING
    };
  }
  
  return null;
}

/**
 * Check form at the bottom position
 */
function checkFormAtBottomPosition(angles: BodyAngles): FeedbackMessage | null {
  // Check for proper squat depth
  if (angles.kneeAngle !== null && angles.kneeAngle > 120) {
    return {
      message: "Try to squat deeper for full range of motion",
      type: FeedbackType.INFO
    };
  }
  
  // Check for potential knee valgus (would need more sophisticated detection)
  if (angles.kneeAngle !== null && angles.kneeAngle < 80) {
    return {
      message: "Be careful with knee position, don't go too low",
      type: FeedbackType.WARNING
    };
  }
  
  return null;
}

/**
 * Evaluate the quality of a completed repetition
 */
export const evaluateRepQuality = (angles: BodyAngles) => {
  // Count how many positive form aspects were detected
  let positiveAspects = 0;
  let totalAspects = 0;
  let feedback = "";
  let feedbackType = FeedbackType.INFO;
  
  // Check knee angle range
  if (angles.kneeAngle !== null) {
    totalAspects++;
    if (angles.kneeAngle >= 80 && angles.kneeAngle <= 110) {
      positiveAspects++;
      feedback += "Good knee bend. ";
    } else if (angles.kneeAngle < 80) {
      feedback += "Knees bent too much. ";
      feedbackType = FeedbackType.WARNING;
    } else {
      feedback += "Could use deeper knee bend. ";
    }
  }
  
  // Check hip angle range
  if (angles.hipAngle !== null) {
    totalAspects++;
    if (angles.hipAngle >= 80 && angles.hipAngle <= 110) {
      positiveAspects++;
      feedback += "Good hip hinge. ";
    } else if (angles.hipAngle < 80) {
      feedback += "Too much hip flexion. ";
      feedbackType = FeedbackType.WARNING;
    } else {
      feedback += "More hip hinge needed. ";
    }
  }
  
  // Check shoulder angle (back position)
  if (angles.shoulderAngle !== null) {
    totalAspects++;
    if (angles.shoulderAngle >= 160) {
      positiveAspects++;
      feedback += "Good back position. ";
    } else {
      feedback += "Keep chest up more. ";
      feedbackType = FeedbackType.WARNING;
    }
  }
  
  // If we don't have enough data, give generic feedback
  if (totalAspects === 0) {
    return {
      isGoodForm: true,
      feedback: "Rep completed. Position yourself better for more detailed feedback.",
      feedbackType: FeedbackType.INFO
    };
  }
  
  // Determine overall quality
  const formQuality = positiveAspects / totalAspects;
  const isGoodForm = formQuality >= 0.7; // 70% or more positive aspects
  
  // Final determination
  if (isGoodForm) {
    if (formQuality === 1) {
      return {
        isGoodForm: true,
        feedback: "Perfect rep! " + feedback,
        feedbackType: FeedbackType.SUCCESS
      };
    } else {
      return {
        isGoodForm: true,
        feedback: "Good rep. " + feedback,
        feedbackType: FeedbackType.SUCCESS
      };
    }
  } else {
    return {
      isGoodForm: false,
      feedback: "Form needs improvement. " + feedback,
      feedbackType: FeedbackType.WARNING
    };
  }
};

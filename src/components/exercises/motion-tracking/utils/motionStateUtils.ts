import { MotionState, BodyAngles } from '../../posture-monitor/types';

export const determineMotionState = (angles: BodyAngles, prevState: MotionState): MotionState => {
  // If no knee angle is detected, keep the previous state
  if (angles.kneeAngle === undefined) return prevState;
  
  const kneeAngle = angles.kneeAngle;
  
  // Define thresholds for different motion states based on knee angle
  // For squats: Standing (>160°), Mid motion (130-160°), Full motion (<130°)
  if (kneeAngle < 120) {
    return MotionState.FULL_MOTION;
  } else if (kneeAngle < 150) {
    return MotionState.MID_MOTION;
  } else {
    return MotionState.STANDING;
  }
};

/**
 * Determines if a repetition is completed based on state transitions
 * A repetition is completed when going from FULL_MOTION to STANDING through MID_MOTION
 */
export const isRepCompleted = (
  currentState: MotionState, 
  prevState: MotionState, 
  beforePrevState: MotionState
): boolean => {
  // A squat rep is completed when transitioning from:
  // FULL_MOTION (bottom of squat) -> MID_MOTION (coming up) -> STANDING (standing back up)
  // This ensures we only count completed repetitions, not partial ones
  return (
    beforePrevState === MotionState.FULL_MOTION && 
    prevState === MotionState.MID_MOTION &&
    currentState === MotionState.STANDING
  );
};

/**
 * Determines if the rep had good form
 */
export const hasGoodForm = (angles: BodyAngles): boolean => {
  // Check if all required angles were detected
  if (angles.kneeAngle === undefined) return false;
  
  // For squats, good form typically means:
  // - Knee angle between 90° and 130° at the bottom of the squat
  // - Hip angle approximately matching or slightly less than the knee angle
  // - Back stays straight (shoulder angle remains close to vertical)
  
  const kneeInRange = angles.kneeAngle >= 90 && angles.kneeAngle <= 130;
  
  // If we have hip angle data, check it too
  if (angles.hipAngle !== undefined) {
    const hipInRange = angles.hipAngle >= 70 && angles.hipAngle <= 120;
    if (!hipInRange) return false;
  }
  
  // If we have shoulder angle data, check it too
  if (angles.shoulderAngle !== undefined) {
    const shoulderInRange = angles.shoulderAngle >= 160; // Back staying straight
    if (!shoulderInRange) return false;
  }
  
  return kneeInRange;
};

/**
 * Generates feedback based on the current angles and motion state
 */
export const generateMotionFeedback = (
  angles: BodyAngles,
  motionState: MotionState
): string => {
  if (!angles.kneeAngle) {
    return "Position yourself so your full body is visible";
  }
  
  switch (motionState) {
    case MotionState.STANDING:
      return "Good starting position. Begin your squat by bending knees and hips.";
    
    case MotionState.MID_MOTION:
      if (angles.shoulderAngle && angles.shoulderAngle < 160) {
        return "Keep your back straight as you move";
      }
      return "Continue the movement with controlled speed";
    
    case MotionState.FULL_MOTION:
      if (angles.kneeAngle < 90) {
        return "Squat depth is good, make sure heels stay on ground";
      } else if (angles.kneeAngle > 120) {
        return "Try to squat a bit deeper for better muscle engagement";
      } else {
        return "Excellent squat depth, maintain this position briefly";
      }
    
    default:
      return "Focus on controlled movement throughout the exercise";
  }
};

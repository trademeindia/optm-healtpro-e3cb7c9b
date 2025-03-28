
export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

interface FeedbackResult {
  message: string;
  type: FeedbackType;
}

// Generate specific feedback based on exercise biomarkers
export const generateFeedback = (
  postureScore: number,
  movementQuality: number,
  rangeOfMotion: number,
  stabilityScore: number
): FeedbackResult => {
  // Default feedback for when no issues detected
  let message = "Looking good! Keep going.";
  let type = FeedbackType.INFO;
  
  // Check posture issues first (highest priority)
  if (postureScore < 60) {
    message = "Try to keep your back straight and avoid leaning forward.";
    type = FeedbackType.WARNING;
  } 
  // Check range of motion
  else if (rangeOfMotion < 50) {
    message = "Try to go deeper in your squat for full range of motion.";
    type = FeedbackType.WARNING;
  }
  // Check stability
  else if (stabilityScore < 60) {
    message = "Focus on maintaining stability throughout the movement.";
    type = FeedbackType.WARNING;
  }
  // Positive feedback for good movement quality
  else if (movementQuality > 80) {
    message = "Excellent form! You're doing great.";
    type = FeedbackType.SUCCESS;
  }
  // General encouragement for decent form
  else if (movementQuality > 65) {
    message = "Good job! Keep up the consistent form.";
    type = FeedbackType.SUCCESS;
  }
  
  return { message, type };
};

// Generate feedback for squat depth
export const getSquatDepthFeedback = (kneeAngle: number | null): FeedbackResult => {
  if (kneeAngle === null) {
    return {
      message: "Position yourself so your full body is visible.",
      type: FeedbackType.INFO
    };
  }
  
  if (kneeAngle < 90) {
    return {
      message: "Great depth on your squat!",
      type: FeedbackType.SUCCESS
    };
  } else if (kneeAngle < 110) {
    return {
      message: "Good squat depth, try to go a bit lower if you can.",
      type: FeedbackType.INFO
    };
  } else {
    return {
      message: "Try to squat deeper for better results.",
      type: FeedbackType.WARNING
    };
  }
};

// Generate feedback for posture
export const getPostureFeedback = (hipAngle: number | null, shoulderAngle: number | null): FeedbackResult => {
  if (hipAngle === null || shoulderAngle === null) {
    return {
      message: "Make sure your full body is visible to check posture.",
      type: FeedbackType.INFO
    };
  }
  
  if (hipAngle < 130) {
    return {
      message: "Watch your hip position - try to keep your back straight.",
      type: FeedbackType.WARNING
    };
  }
  
  if (shoulderAngle < 150) {
    return {
      message: "Keep your shoulders back and chest up during the squat.",
      type: FeedbackType.WARNING
    };
  }
  
  return {
    message: "Excellent posture! Keep your form consistent.",
    type: FeedbackType.SUCCESS
  };
};

// Generate form correction feedback based on detected issues
export const getFormCorrectionFeedback = (
  kneeAngle: number | null,
  hipAngle: number | null,
  shoulderAngle: number | null
): FeedbackResult => {
  // If we don't have enough data, return a generic message
  if (kneeAngle === null && hipAngle === null && shoulderAngle === null) {
    return {
      message: "Please position yourself so your full body is visible.",
      type: FeedbackType.INFO
    };
  }
  
  // Check for common form issues in order of priority
  
  // 1. Knees caving in (approximation since we don't have knee width)
  if (kneeAngle !== null && kneeAngle < 80) {
    return {
      message: "Be careful not to let your knees cave inward. Push them out slightly.",
      type: FeedbackType.WARNING
    };
  }
  
  // 2. Leaning too far forward
  if (hipAngle !== null && hipAngle < 120) {
    return {
      message: "You're leaning too far forward. Keep your chest up and back straight.",
      type: FeedbackType.WARNING
    };
  }
  
  // 3. Shoulders rounding forward
  if (shoulderAngle !== null && shoulderAngle < 140) {
    return {
      message: "Keep your shoulders back and chest proud throughout the movement.",
      type: FeedbackType.WARNING
    };
  }
  
  // If no major issues detected
  return {
    message: "Your form looks good! Focus on smooth, controlled movements.",
    type: FeedbackType.SUCCESS
  };
};

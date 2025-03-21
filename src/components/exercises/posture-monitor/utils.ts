import * as posenet from '@tensorflow-models/posenet';
import { SquatState, FeedbackType } from './types';

// Calculate angle between three points
export const calculateAngle = (a: posenet.Keypoint, b: posenet.Keypoint, c: posenet.Keypoint): number => {
  const radians = Math.atan2(c.position.y - b.position.y, c.position.x - b.position.x) -
                 Math.atan2(a.position.y - b.position.y, a.position.x - b.position.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  
  return angle;
};

// Determine squat state based on knee angle
export const determineSquatState = (kneeAngle: number): SquatState => {
  if (kneeAngle > 160) {
    // Standing position (legs almost straight)
    return SquatState.STANDING;
  } else if (kneeAngle < 100) {
    // Bottom squat position (knees bent significantly)
    return SquatState.BOTTOM_SQUAT;
  } else {
    // Mid-squat position
    return SquatState.MID_SQUAT;
  }
};

// Generate feedback based on squat state and angles
export const generateFeedback = (
  currentSquatState: SquatState,
  kneeAngle: number | null,
  hipAngle: number | null
): { feedback: string; feedbackType: FeedbackType } => {
  if (currentSquatState === SquatState.STANDING) {
    return {
      feedback: "Start your squat by bending your knees.",
      feedbackType: FeedbackType.INFO
    };
  } else if (currentSquatState === SquatState.MID_SQUAT) {
    if (hipAngle && hipAngle < 70) {
      return {
        feedback: "You're leaning too far forward.",
        feedbackType: FeedbackType.WARNING
      };
    } else if (hipAngle && hipAngle > 150) {
      return {
        feedback: "Bend forward slightly at the hips.",
        feedbackType: FeedbackType.WARNING
      };
    } else {
      return {
        feedback: "Good! Continue lowering into your squat.",
        feedbackType: FeedbackType.SUCCESS
      };
    }
  } else if (currentSquatState === SquatState.BOTTOM_SQUAT) {
    if (kneeAngle && kneeAngle < 70) {
      return {
        feedback: "Squat is too deep. Rise up slightly.",
        feedbackType: FeedbackType.WARNING
      };
    } else {
      return {
        feedback: "Great depth! Now push through your heels to rise up.",
        feedbackType: FeedbackType.SUCCESS
      };
    }
  }
  
  // Default feedback
  return {
    feedback: "Maintain good posture during your exercise.",
    feedbackType: FeedbackType.INFO
  };
};

// Evaluate rep quality based on form
export const evaluateRepQuality = (
  kneeAngle: number,
  hipAngle: number
): { isGoodForm: boolean; feedback: string; feedbackType: FeedbackType } => {
  if (kneeAngle < 110 && hipAngle > 80 && hipAngle < 140) {
    // Good form - knees bent properly and hip angle in good range
    return {
      isGoodForm: true,
      feedback: "Great form! Keep going!",
      feedbackType: FeedbackType.SUCCESS
    };
  } else {
    // Bad form - determine specific feedback
    if (kneeAngle > 120) {
      return {
        isGoodForm: false,
        feedback: "Squat deeper! Bend your knees more.",
        feedbackType: FeedbackType.WARNING
      };
    } else if (hipAngle < 70) {
      return {
        isGoodForm: false,
        feedback: "Leaning too far forward. Keep your back straighter.",
        feedbackType: FeedbackType.WARNING
      };
    } else if (hipAngle > 150) {
      return {
        isGoodForm: false,
        feedback: "Bend forward a bit more at the hips.",
        feedbackType: FeedbackType.WARNING
      };
    } else {
      return {
        isGoodForm: false,
        feedback: "Check your form. Focus on knee and hip positioning.",
        feedbackType: FeedbackType.WARNING
      };
    }
  }
};

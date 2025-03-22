
import { FeedbackType } from '../types';
import { SquatEvaluation } from '../poseDetectionTypes';

// Evaluate rep quality based on form
export const evaluateRepQuality = (
  kneeAngle: number,
  hipAngle: number
): SquatEvaluation => {
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


import { FeedbackType } from '../types';
import { SquatEvaluation } from '../poseDetectionTypes';

/**
 * Evaluate quality of a squat repetition
 */
export const evaluateRepQuality = (kneeAngle: number, hipAngle: number): SquatEvaluation => {
  let isGoodForm = true;
  let feedback = "Great squat form!";
  let feedbackType = FeedbackType.SUCCESS;
  
  // Check knee angle at bottom of squat
  if (kneeAngle < 70) {
    isGoodForm = false;
    feedback = "Your squat is too deep. Try not to let knees bend more than 90 degrees.";
    feedbackType = FeedbackType.WARNING;
  } else if (kneeAngle > 130) {
    isGoodForm = false;
    feedback = "You're not squatting deep enough. Try to lower more.";
    feedbackType = FeedbackType.WARNING;
  }
  
  // Check hip angle (forward lean)
  if (hipAngle < 70) {
    isGoodForm = false;
    feedback = "You're leaning too far forward. Keep your back straighter.";
    feedbackType = FeedbackType.WARNING;
  }
  
  // If all checks passed
  if (isGoodForm) {
    feedback = "Excellent squat form! Keep it up!";
    feedbackType = FeedbackType.SUCCESS;
  }
  
  return {
    isGoodForm,
    feedback,
    feedbackType
  };
};


import { FeedbackType, RepEvaluation } from '../types';

export const evaluateRepQuality = (kneeAngle: number, hipAngle: number): RepEvaluation => {
  // Default evaluation
  let isGoodForm = true;
  let feedback = "Great rep! Excellent form.";
  let feedbackType = FeedbackType.SUCCESS;
  let score = 100;
  
  // Check for common form issues during squats
  
  // 1. Check if squat depth was sufficient (knee angle should be less than 90° at bottom)
  if (kneeAngle > 110) {
    isGoodForm = false;
    feedback = "Try squatting deeper for better muscle engagement.";
    feedbackType = FeedbackType.WARNING;
    score -= 30;
  }
  
  // 2. Check if back was too horizontal (hip angle should ideally be above 70°)
  if (hipAngle < 70) {
    isGoodForm = false;
    feedback = "Keep your chest up more during the squat.";
    feedbackType = FeedbackType.WARNING;
    score -= 25;
  }
  
  // 3. Check if knees stayed aligned (more complex in real implementation)
  // This is a simplified placeholder logic
  if (Math.random() < 0.2 && !isGoodForm) {  // 20% chance to add this feedback if already bad form
    feedback += " Also watch your knee alignment.";
    score -= 10;
  }
  
  // Cap score at minimum of 50
  score = Math.max(50, score);
  
  return {
    isGoodForm,
    feedback,
    score,
    feedbackType
  };
};

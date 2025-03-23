
import { BodyAngles, FeedbackType } from '@/components/exercises/posture-monitor/types';

export const evaluateRepQuality = (angles: BodyAngles) => {
  // Simple evaluation logic
  const kneeAngle = angles.kneeAngle || 180;
  const hipAngle = angles.hipAngle || 180;
  
  const isGoodForm = kneeAngle < 120 && hipAngle < 140;
  
  return {
    isGoodForm,
    feedback: isGoodForm 
      ? "Great form on that rep!" 
      : "Try to keep your back straight and go deeper",
    feedbackType: isGoodForm ? FeedbackType.SUCCESS : FeedbackType.WARNING
  };
};

export const countReps = (
  currentKneeAngle: number | null,
  previousKneeAngle: number | null,
  repThreshold: number = 130
): boolean => {
  if (currentKneeAngle === null || previousKneeAngle === null) {
    return false;
  }
  
  // Detect when knee angle changes from bent to more straight
  // This indicates the completion of a rep (e.g., standing up from a squat)
  const wasLowerThanThreshold = previousKneeAngle < repThreshold;
  const isHigherThanThreshold = currentKneeAngle >= repThreshold;
  
  return wasLowerThanThreshold && isHigherThanThreshold;
};

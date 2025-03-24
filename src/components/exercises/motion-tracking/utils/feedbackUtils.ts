
// Define feedback types for UI display
export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * Generate real-time feedback based on posture quality metrics
 */
export const generateFeedback = (
  postureScore: number, 
  movementQuality: number,
  rangeOfMotion: number,
  stabilityScore: number
) => {
  let message = '';
  let type: FeedbackType = FeedbackType.INFO;

  // Posture feedback
  if (postureScore < 50) {
    message = 'Keep your back straight and head aligned';
    type = FeedbackType.WARNING;
  } else if (movementQuality < 60) {
    message = 'Slow down and focus on form quality';
    type = FeedbackType.WARNING;
  } else if (rangeOfMotion < 65) {
    message = 'Try to increase your range of motion';
    type = FeedbackType.INFO;
  } else if (stabilityScore < 70) {
    message = 'Focus on stability during the exercise';
    type = FeedbackType.INFO;
  } else if (postureScore > 85 && movementQuality > 80) {
    message = 'Excellent form! Keep it up';
    type = FeedbackType.SUCCESS;
  } else {
    message = 'Maintain good form and control';
    type = FeedbackType.INFO;
  }

  return {
    message,
    type
  };
};

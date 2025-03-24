
// Define feedback type enum
export enum FeedbackType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

// Feedback interface
export interface FeedbackData {
  type: FeedbackType;
  message: string;
  biomarkers?: {
    postureScore?: number;
    movementQuality?: number;
    rangeOfMotion?: number;
    stabilityScore?: number;
  };
}

// Feedback generation utility
export const generateFeedback = (
  posture: number, 
  quality: number,
  rom: number,
  stability: number
): FeedbackData => {
  // Combine all metrics for an overall score
  const overallScore = (posture + quality + rom + stability) / 4;
  
  if (overallScore >= 85) {
    return {
      type: FeedbackType.SUCCESS,
      message: 'Excellent form! Keep up the great work.',
      biomarkers: {
        postureScore: posture,
        movementQuality: quality,
        rangeOfMotion: rom,
        stabilityScore: stability
      }
    };
  } else if (overallScore >= 70) {
    return {
      type: FeedbackType.SUCCESS,
      message: 'Good form. Minor adjustments could improve performance.',
      biomarkers: {
        postureScore: posture,
        movementQuality: quality,
        rangeOfMotion: rom,
        stabilityScore: stability
      }
    };
  } else if (overallScore >= 50) {
    return {
      type: FeedbackType.WARNING,
      message: 'Moderate form. Focus on maintaining proper alignment.',
      biomarkers: {
        postureScore: posture,
        movementQuality: quality,
        rangeOfMotion: rom,
        stabilityScore: stability
      }
    };
  } else {
    return {
      type: FeedbackType.ERROR,
      message: 'Form needs improvement. Consider reducing intensity or range.',
      biomarkers: {
        postureScore: posture,
        movementQuality: quality,
        rangeOfMotion: rom,
        stabilityScore: stability
      }
    };
  }
};

// Initial feedback state
export const initialFeedback: FeedbackData = {
  type: FeedbackType.INFO,
  message: 'Start the camera to begin analysis',
  biomarkers: {
    postureScore: 0,
    movementQuality: 0,
    rangeOfMotion: 0,
    stabilityScore: 0
  }
};

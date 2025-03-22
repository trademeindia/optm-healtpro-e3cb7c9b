
import { FeedbackType, SquatState } from './types';

export interface PoseDetectionConfig {
  minPoseConfidence: number;
  minPartConfidence: number;
  inputResolution: {
    width: number;
    height: number;
  };
  scoreThreshold: number;
  // Add missing properties for PoseNet configuration
  architecture?: 'MobileNetV1' | 'ResNet50';
  outputStride?: 8 | 16 | 32;
  // Fix the multiplier values to match the allowed MobileNetMultiplier type
  multiplier?: 0.5 | 0.75 | 1.0;
  quantBytes?: 1 | 2 | 4;
}

export interface SquatEvaluation {
  isGoodForm: boolean;
  feedback: string;
  feedbackType: FeedbackType;
}

export interface FeedbackResult {
  feedback: string;
  feedbackType: FeedbackType;
}

export interface PostureAnalysis {
  feedback: {
    message: string;
    type: FeedbackType;
  };
  kneeAngle: number | null;
  hipAngle: number | null;
  newSquatState: SquatState;
  repComplete: boolean;
  evaluation: SquatEvaluation | null;
}

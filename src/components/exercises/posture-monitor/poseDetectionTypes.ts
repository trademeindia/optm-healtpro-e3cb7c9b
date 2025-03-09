
import * as posenet from '@tensorflow-models/posenet';
import { SquatState, FeedbackType } from './types';

export interface PoseDetectionConfig {
  minPoseConfidence: number;
  minPartConfidence: number;
  inputResolution: {
    width: number;
    height: number;
  };
  scoreThreshold: number;
}

export interface PoseAnalysis {
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
}

export interface PoseStats {
  accuracy: number;
  reps: number;
  incorrectReps: number;
}

export interface PoseFeedback {
  message: string | null;
  type: FeedbackType;
}

export interface UsePoseDetectionProps {
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoReady?: boolean;
}

export interface UsePoseDetectionResult {
  model: posenet.PoseNet | null;
  isModelLoading: boolean;
  pose: posenet.Pose | null;
  analysis: PoseAnalysis;
  stats: PoseStats;
  feedback: PoseFeedback;
  resetSession: () => void;
  config: PoseDetectionConfig;
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

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
}

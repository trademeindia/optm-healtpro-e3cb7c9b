
import * as posenet from '@tensorflow-models/posenet';

export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export enum SquatState {
  STANDING = 'standing',
  MID_SQUAT = 'mid_squat',
  BOTTOM_SQUAT = 'bottom_squat'
}

export interface HumanDetectionStatus {
  isActive: boolean;
  fps: number | null;
  confidence: number | null;
}

export interface DetectionState {
  framesProcessed: number;
  lastDetectionTime: number;
  detectionTimes: number[];
  failureCount: number;
}

export interface VideoStatus {
  isReady: boolean;
  hasStream: boolean;
  resolution: { width: number; height: number } | null;
  lastCheckTime: number;
  errorCount: number;
}

export interface CustomFeedback {
  message: string;
  type: FeedbackType;
}

export interface SquatAnalysis {
  kneeAngle: number | null;
  hipAngle: number | null;
  feedback: {
    message: string;
    type: FeedbackType;
  };
  newSquatState: SquatState;
  repComplete: boolean;
  evaluation: RepEvaluation | null;
}

export interface RepEvaluation {
  isGoodForm: boolean;
  feedback: string;
  score: number;
  feedbackType: FeedbackType;
}

export interface TrackingStats {
  reps: number;
  incorrectReps: number;
  accuracy: number;
}

export interface RendererProps {
  pose: posenet.Pose;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
  config: any;
}

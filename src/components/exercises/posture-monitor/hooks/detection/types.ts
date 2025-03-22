
import { FeedbackType } from '../../types';

// Video status information
export interface VideoStatus {
  isReady: boolean;
  hasStream: boolean;
  resolution: { width: number; height: number } | null;
  lastCheckTime: number;
  errorCount: number;
}

// Detection status information
export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints: number;
  lastDetectionTime: number;
}

// Internal state for detection process
export interface DetectionState {
  failureCounter: number;
  lastFrameTime: number;
  frameTimes: number[];
  lastDetectionTime: number;
}

// Feedback message with type
export interface CustomFeedback {
  message: string | null;
  type: FeedbackType;
}

// Result of pose detection hook
export interface UsePoseDetectionResult {
  isDetectionRunning: boolean;
  detectionStatus: DetectionStatus;
}

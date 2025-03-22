
import * as posenet from '@tensorflow-models/posenet';
import { FeedbackType } from '../../types';

export interface VideoStatus {
  isReady: boolean;
  hasStream: boolean;
  resolution: { width: number; height: number } | null;
  lastCheckTime: number;
  errorCount: number;
}

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints: number;
  lastDetectionTime: number;
}

export interface DetectionState {
  framesProcessed: number;
  lastDetectionTime: number;
  detectionTimes: number[];
  failureCount: number;
}

export interface UsePoseDetectionLoopProps {
  model: posenet.PoseNet | null;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  config: any;
  onPoseDetected: (pose: posenet.Pose) => void;
  setFeedback: (message: string, type: FeedbackType) => void;
  videoReady: boolean;
}

export interface CustomFeedback {
  message: string;
  type: FeedbackType;
}

export interface UsePoseDetectionResult {
  detectionStatus: DetectionStatus;
  isDetectionRunning: boolean;
}

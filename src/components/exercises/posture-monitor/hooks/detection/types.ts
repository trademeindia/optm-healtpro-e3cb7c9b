
import * as posenet from '@tensorflow-models/posenet';
import { PoseDetectionConfig } from '../../poseDetectionTypes';
import { FeedbackType } from '../../types';

export interface DetectionState {
  lastDetectionTime: number;
  detectionFailures: number;
}

export interface UsePoseDetectionLoopProps {
  model: posenet.PoseNet | null;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  config: PoseDetectionConfig;
  onPoseDetected: (pose: posenet.Pose) => void;
  setFeedback: (message: string | null, type: FeedbackType) => void;
  videoReady?: boolean;
}

export interface DetectionFailureHandlerProps {
  model: posenet.PoseNet | null;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  setFeedback: (message: string | null, type: FeedbackType) => void;
  lastPoseTime: React.MutableRefObject<number | null>;
  failureCount: React.MutableRefObject<number>;
}

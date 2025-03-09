
import * as posenet from '@tensorflow-models/posenet';
import { FeedbackType } from '../../types';

export interface UsePoseDetectionLoopProps {
  model: posenet.PoseNet | null;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  config: {
    minPoseConfidence: number;
    inputResolution: {
      width: number;
      height: number;
    };
    minPartConfidence: number;
  };
  onPoseDetected: (pose: posenet.Pose) => void;
  setFeedback: (message: string | null, type: FeedbackType) => void;
  videoReady: boolean;
}

export interface DetectionState {
  lastDetectionTime: number;
  detectionFailures: number;
  frameTimes: number[];
  cumulativeProcessingTime: number;
  framesProcessed: number;
}

export interface VideoStatus {
  isReady: boolean;
  hasStream: boolean;
  resolution: {
    width: number;
    height: number;
  } | null;
  lastCheckTime: number;
  errorCount: number;
}

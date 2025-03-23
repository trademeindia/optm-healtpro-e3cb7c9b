
import { PoseDetectionConfig } from '../poseDetectionTypes';

export const DEFAULT_POSE_CONFIG: PoseDetectionConfig = {
  minPoseConfidence: 0.3,
  minPartConfidence: 0.1,
  inputResolution: {
    width: 640,
    height: 480,
  },
  scoreThreshold: 0.5,
  architecture: 'MobileNetV1',
  outputStride: 16,
  multiplier: 0.75,
  quantBytes: 2
};


import { PoseDetectionConfig } from '../poseDetectionTypes';

// Default configuration for pose detection
export const DEFAULT_POSE_CONFIG: PoseDetectionConfig = {
  minPoseConfidence: 0.2, // Lower threshold to detect poses more easily
  minPartConfidence: 0.5, // Confidence threshold for individual body parts
  inputResolution: {
    width: 640,
    height: 480
  },
  scoreThreshold: 0.6 // Threshold for considering a keypoint as valid
};

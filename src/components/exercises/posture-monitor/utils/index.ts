
// Configuration for PoseNet model
export const DEFAULT_POSE_CONFIG = {
  flipHorizontal: true,
  maxPoseDetections: 1,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  minPoseConfidence: 0.3,
  minPartConfidence: 0.5,
  inputResolution: { width: 640, height: 480 }
};

export * from './feedbackGeneration';
export * from './repQualityEvaluation';
export * from './squatStateDetection';

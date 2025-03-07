
import { PoseDetectionConfig } from '../poseDetectionTypes';

// Default configuration for pose detection
export const DEFAULT_POSE_CONFIG: PoseDetectionConfig = {
  minPoseConfidence: 0.2, // Lower threshold to detect poses more easily
  minPartConfidence: 0.5, // Confidence threshold for individual body parts
  inputResolution: {
    width: 640,
    height: 480
  },
  scoreThreshold: 0.6, // Threshold for considering a keypoint as valid
  maxPoseDetections: 1, // Only detect one pose for better performance
  frameskip: 0, // Number of frames to skip for lower-end devices (0 = process every frame)
  optimizationLevel: 'balanced' // Options: 'performance', 'balanced', 'accuracy'
};

// Performance configurations based on device capability
export const PERFORMANCE_CONFIGS = {
  low: {
    inputResolution: { width: 480, height: 360 },
    frameskip: 2, // Process every 3rd frame
    optimizationLevel: 'performance'
  },
  medium: {
    inputResolution: { width: 640, height: 480 },
    frameskip: 1, // Process every 2nd frame
    optimizationLevel: 'balanced'
  },
  high: {
    inputResolution: { width: 640, height: 480 },
    frameskip: 0, // Process every frame
    optimizationLevel: 'accuracy'
  }
};

// Detect performance capability
export const detectDevicePerformance = (): 'low' | 'medium' | 'high' => {
  // Simple detection based on navigator.hardwareConcurrency
  const cpuCores = navigator.hardwareConcurrency || 0;
  
  if (cpuCores <= 2) {
    return 'low';
  } else if (cpuCores <= 4) {
    return 'medium';
  } else {
    return 'high';
  }
};

// Get optimized config based on device capability
export const getOptimizedConfig = (): PoseDetectionConfig => {
  const performance = detectDevicePerformance();
  const performanceConfig = PERFORMANCE_CONFIGS[performance];
  
  return {
    ...DEFAULT_POSE_CONFIG,
    ...performanceConfig
  };
};

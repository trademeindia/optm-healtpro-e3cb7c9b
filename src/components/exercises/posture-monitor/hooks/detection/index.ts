
// Export components from detection-related hooks
export { usePoseDetectionLoop } from './usePoseDetectionLoop';
export { useDetectionStatus } from './useDetectionStatus';
export { useDetectionFailureHandler } from './useDetectionFailureHandler';
export type { 
  DetectionStatus,
  DetectionState,
  CustomFeedback,
  UsePoseDetectionResult,
  VideoStatus
} from './types';

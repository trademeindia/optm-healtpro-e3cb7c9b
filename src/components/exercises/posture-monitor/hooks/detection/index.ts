
// Export specific items from usePoseDetectionLoop to avoid duplicate type exports
import { usePoseDetectionLoop } from './usePoseDetectionLoop';
export { usePoseDetectionLoop };

// Export types except for UsePoseDetectionLoopProps which is already in usePoseDetectionLoop
export type {
  VideoStatus,
  DetectionStatus,
  DetectionState,
  CustomFeedback,
  UsePoseDetectionResult
} from './types';

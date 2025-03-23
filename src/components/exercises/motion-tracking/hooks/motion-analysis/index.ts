
// Export all hooks and utilities
export * from './useMotionAnalysis';
export * from './useMotionState';
export * from './useFeedback';
export * from './useDetectionResults';
export * from './repDetection';

// We need to explicitly re-export the types to avoid ambiguity
import { 
  MotionAnalysisState,
  UseMotionAnalysisReturn,
  // Don't re-export these as they're already exported from their respective files
  // UseMotionStateReturn,
  // UseFeedbackReturn
} from './types';

export { 
  MotionAnalysisState,
  UseMotionAnalysisReturn
};


export * from './useHumanDetection';
export * from './useDetectionService';
export * from './useModelLoader';
export * from './useDetectionLoop';
export * from './useDetectionError';
export * from './detectionServiceUtils';
export * from './useSessionManagement';

// Re-export from motion-analysis with alias to avoid name conflicts
export { useMotionAnalysis } from './motion-analysis/useMotionAnalysis';
export { type MotionAnalysisState as MotionAnalysisStateType } from './types';
export { type SessionState as SessionStateType } from './types';

// Export nested directories
export * from './motion-analysis';
export * from './session-management';

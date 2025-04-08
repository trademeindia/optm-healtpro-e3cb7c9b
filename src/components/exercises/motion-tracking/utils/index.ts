
export * from './feedbackUtils';
export * from './sessionUtils';
export * from './statsUtils';

// Explicitly export from motionStateUtils with renamed function to avoid conflict
import { determineMotionState as getMotionState } from './motionStateUtils';
export { getMotionState };

// Explicitly export from detectionUtils
import { performDetection, getPostureFeedback, estimateCaloriesBurned, detectRepetition } from './detectionUtils';
export { performDetection, getPostureFeedback, estimateCaloriesBurned, detectRepetition };


import { toast } from 'sonner';
import { human, resetModel } from '@/lib/human';
import { DetectionErrorType } from '@/lib/human/types';

/**
 * Checks if TensorFlow has too many tensors and cleans them up if needed
 */
export const cleanupTensors = () => {
  try {
    if (human.tf && human.tf.engine) {
      const tensors = human.tf.engine().state.numTensors;
      if (tensors > 100) {
        console.warn(`High tensor count (${tensors}), cleaning up`);
        human.tf.engine().disposeVariables();
        return true;
      }
    }
  } catch (e) {
    console.error('Error cleaning up tensors:', e);
  }
  return false;
};

/**
 * Safely resets the model with error handling
 */
export const safeResetModel = async (): Promise<boolean> => {
  try {
    await resetModel();
    return true;
  } catch (error) {
    console.error('Error resetting model:', error);
    toast.error('Failed to reset detection model');
    return false;
  }
};

/**
 * Maps raw errors to consistent detection error types
 */
export const mapToDetectionError = (error: any) => {
  const errorType = error.type || DetectionErrorType.UNKNOWN;
  const errorMessage = error.message || 'An unexpected error occurred';
  
  return {
    type: errorType,
    message: errorMessage,
    retryable: error.retryable !== false
  };
};

/**
 * Checks if the video element is ready for detection
 */
export const isVideoReadyForDetection = (video: HTMLVideoElement | null): boolean => {
  return Boolean(
    video && 
    video.readyState >= 2 && 
    video.videoWidth > 0 && 
    video.videoHeight > 0
  );
};

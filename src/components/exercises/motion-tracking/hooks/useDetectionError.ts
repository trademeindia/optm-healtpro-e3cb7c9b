
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { DetectionError, DetectionErrorType } from '@/lib/human/types';

export const useDetectionError = () => {
  const [detectionError, setDetectionError] = useState<DetectionError | null>(null);

  const handleDetectionError = useCallback((error: any) => {
    console.error('Detection error:', error);
    
    // Map the error to a consistent format
    let errorObj: DetectionError;
    
    if (error.type && error.message) {
      errorObj = {
        type: error.type,
        message: error.message,
        retryable: error.retryable !== false
      };
    } else {
      errorObj = {
        type: DetectionErrorType.UNKNOWN,
        message: error.message || 'An unexpected error occurred during detection',
        retryable: true
      };
    }
    
    setDetectionError(errorObj);
    
    // Show toast for user feedback
    toast.error('Detection Error', {
      description: errorObj.message,
      duration: 3000
    });
  }, []);

  const clearDetectionError = useCallback(() => {
    setDetectionError(null);
  }, []);

  return {
    detectionError,
    handleDetectionError,
    clearDetectionError
  };
};

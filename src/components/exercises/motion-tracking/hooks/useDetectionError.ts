
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { DetectionError } from '@/lib/human/types';

export const useDetectionError = () => {
  const [detectionError, setDetectionError] = useState<DetectionError | null>(null);

  const handleDetectionError = useCallback((error: any) => {
    console.error('Detection error handled:', error);
    
    // Convert to proper error type if needed
    const detectionError: DetectionError = {
      type: error.type || 'UNKNOWN',
      message: error.message || 'Unknown detection error',
      retryable: error.retryable !== false
    };
    
    setDetectionError(detectionError);
    
    // Show toast error
    toast.error('Detection error', {
      description: detectionError.message,
      duration: 3000
    });
    
    return detectionError;
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

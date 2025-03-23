
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { warmupModel, resetModel } from '@/lib/human';
import { DetectionErrorType } from '@/lib/human/types';

export const useModelLoader = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  
  // Load the model
  const loadModel = useCallback(async (): Promise<boolean> => {
    if (isModelLoaded) {
      return true;
    }
    
    try {
      setIsModelLoading(true);
      setDetectionError(null);
      
      const success = await warmupModel();
      
      if (success) {
        setIsModelLoaded(true);
        setIsModelLoading(false);
        return true;
      } else {
        throw new Error('Model failed to load');
      }
    } catch (error) {
      console.error('Error loading Human.js model:', error);
      setDetectionError('Failed to load Human.js model');
      setIsModelLoading(false);
      
      toast.error('Failed to load motion detection model', {
        description: 'Please refresh and try again.',
        duration: 5000
      });
      
      return false;
    }
  }, [isModelLoaded]);
  
  // Cleanup function
  const cleanupModelLoader = useCallback(() => {
    // If we need to reset the model or clean up resources
    resetModel().catch(err => {
      console.error('Error cleaning up model:', err);
    });
  }, []);
  
  // Auto-load model on mount
  useEffect(() => {
    if (!isModelLoaded && !isModelLoading) {
      loadModel();
    }
    
    return () => {
      // Cleanup on component unmount
      cleanupModelLoader();
    };
  }, [isModelLoaded, isModelLoading, loadModel, cleanupModelLoader]);
  
  return {
    modelState: {
      isModelLoaded,
      isModelLoading,
      detectionError: detectionError ? {
        type: DetectionErrorType.MODEL_LOADING,
        message: detectionError,
        retryable: true
      } : null
    },
    loadModel,
    cleanupModelLoader
  };
};

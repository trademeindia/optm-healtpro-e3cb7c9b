
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { warmupModel, resetModel } from '@/lib/human';
import { DetectionErrorType, DetectionError } from '@/lib/human/types';

export interface ModelState {
  isModelLoaded: boolean;
  isModelLoading: boolean;
  detectionError: DetectionError | null;
}

export const useModelLoader = () => {
  // Model loading state
  const [modelState, setModelState] = useState<ModelState>({
    isModelLoaded: false,
    isModelLoading: false,
    detectionError: null
  });
  
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef<number>(0);
  const maxRetries = 3;

  // Ensure model is loaded with better error handling and retry logic
  const loadModel = useCallback(async () => {
    if (modelState.isModelLoaded) {
      return true;
    }
    
    // Cancel any existing loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    try {
      setModelState(prev => ({ 
        ...prev, 
        detectionError: null,
        isModelLoading: true
      }));
      
      // Set a timeout to prevent UI from hanging
      const loadingPromise = warmupModel();
      
      loadingTimeoutRef.current = setTimeout(() => {
        if (!modelState.isModelLoaded) {
          console.warn('Model loading is taking longer than expected');
          toast.warning('Model loading is taking longer than expected. Please wait...');
        }
      }, 5000);
      
      await loadingPromise;
      
      // Clear the timeout since loading succeeded
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      setModelState(prev => ({ 
        ...prev, 
        isModelLoaded: true,
        isModelLoading: false,
        detectionError: null
      }));
      
      toast.success('Motion detection model loaded successfully');
      retryCount.current = 0;
      return true;
    } catch (error) {
      console.error('Error loading Human.js model:', error);
      
      // Clear the timeout since loading failed
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      // Implement retry logic
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        toast.error(`Failed to load model. Retrying (${retryCount.current}/${maxRetries})...`);
        
        // Reset the model before retrying
        await resetModel();
        
        setModelState(prev => ({ 
          ...prev, 
          isModelLoading: false,
          detectionError: {
            type: DetectionErrorType.MODEL_LOADING,
            message: `Loading, retry ${retryCount.current}/${maxRetries}`,
            retryable: true
          }
        }));
        
        // Retry after a short delay
        setTimeout(() => loadModel(), 1500);
        return false;
      }
      
      setModelState(prev => ({ 
        ...prev, 
        isModelLoading: false,
        detectionError: {
          type: DetectionErrorType.MODEL_LOADING,
          message: 'Failed to load motion detection model',
          retryable: true
        }
      }));
      
      toast.error('Failed to load motion detection model. Please try refreshing the page.');
      return false;
    }
  }, [modelState.isModelLoaded]);

  // Cleanup function
  const cleanupModelLoader = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  return {
    modelState,
    loadModel,
    cleanupModelLoader
  };
};

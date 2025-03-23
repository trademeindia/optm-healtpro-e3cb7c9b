
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { warmupModel, getModelLoadProgress, resetModel } from '@/lib/human';

/**
 * Hook for loading the Human.js model with progress tracking and error handling
 */
export const useModelLoader = () => {
  // Model loading state
  const [modelState, setModelState] = useState({
    isModelLoaded: false,
    isModelLoading: false,
    modelError: null as string | null,
    loadProgress: 0
  });
  
  // Track loading timeouts and retries
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef<number>(0);
  const maxRetries = 3;
  
  // Cleanup function for intervals and timeouts
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);
  
  // Setup progress tracking
  const setupProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    progressInterval.current = setInterval(() => {
      const progress = getModelLoadProgress();
      setModelState(prev => ({ 
        ...prev, 
        loadProgress: progress 
      }));
      
      // If model is fully loaded, stop the interval
      if (progress >= 100 || modelState.isModelLoaded) {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
      }
    }, 300);
  }, [modelState.isModelLoaded]);

  // Load model with error handling and retry logic
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
        modelError: null,
        isModelLoading: true,
        loadProgress: 0
      }));
      
      // Start progress tracking
      setupProgressTracking();
      
      // Set a timeout to prevent UI from hanging
      const loadingPromise = warmupModel();
      
      loadingTimeoutRef.current = setTimeout(() => {
        if (!modelState.isModelLoaded) {
          console.warn('Model loading is taking longer than expected');
          toast.warning('Model loading is taking longer than expected. Please wait...');
        }
      }, 10000);
      
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
        modelError: null,
        loadProgress: 100
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
          modelError: `Loading, retry ${retryCount.current}/${maxRetries}` 
        }));
        
        // Retry after a short delay
        setTimeout(() => loadModel(), 1500);
        return false;
      }
      
      setModelState(prev => ({ 
        ...prev, 
        isModelLoading: false,
        modelError: 'Failed to load motion detection model. Please try refreshing the page or check if your browser supports WebGL.',
        loadProgress: 0
      }));
      
      toast.error('Failed to load motion detection model. Please try refreshing the page.');
      return false;
    }
  }, [modelState.isModelLoaded, setupProgressTracking]);

  return {
    modelState,
    loadModel
  };
};

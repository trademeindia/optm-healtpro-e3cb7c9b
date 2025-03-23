
import { useCallback, useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as Human from '@vladmandic/human';
import { human, warmupModel, resetModel } from '@/lib/human';
import { DetectionResult, DetectionState } from './types';
import { performDetection } from '../utils/detectionUtils';
import { DetectionErrorType, DetectionError } from '@/lib/human/types';

export const useDetectionService = (videoRef: React.RefObject<HTMLVideoElement>) => {
  // Detection state
  const [detectionState, setDetectionState] = useState<DetectionState>({
    isDetecting: false,
    detectionFps: null,
    isModelLoaded: false,
    detectionError: null,
  });

  // Detection loop references
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdateTime = useRef<number>(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef<number>(0);
  const detectionInProgress = useRef<boolean>(false);
  const maxRetries = 3;
  const firstDetectionRef = useRef<boolean>(true);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Ensure model is loaded with better error handling and retry logic
  const loadModel = useCallback(async () => {
    if (detectionState.isModelLoaded) {
      return true;
    }
    
    // Cancel any existing loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    try {
      setDetectionState(prev => ({ 
        ...prev, 
        detectionError: null,
        isModelLoading: true
      }));
      
      // Set a timeout to prevent UI from hanging
      const loadingPromise = warmupModel();
      
      loadingTimeoutRef.current = setTimeout(() => {
        if (!detectionState.isModelLoaded) {
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
      
      setDetectionState(prev => ({ 
        ...prev, 
        isModelLoaded: true,
        isModelLoading: false,
        detectionError: null
      }));
      
      toast.success('Motion detection model loaded successfully');
      retryCount.current = 0;
      firstDetectionRef.current = true;
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
        
        setDetectionState(prev => ({ 
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
      
      setDetectionState(prev => ({ 
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
  }, [detectionState.isModelLoaded]);

  // Perform detection on a single frame with improved error handling
  const detectFrame = useCallback(async (
    time: number,
    onDetectionResult: (result: DetectionResult) => void
  ) => {
    if (!videoRef.current || !detectionState.isModelLoaded) {
      requestRef.current = requestAnimationFrame(
        (newTime) => detectFrame(newTime, onDetectionResult)
      );
      return;
    }
    
    // Calculate FPS
    const elapsed = time - lastFrameTime.current;
    
    // Limit detection rate for performance (aim for ~20-30 FPS)
    if (elapsed < 50) { // ~20 FPS max to avoid overwhelming the queue
      requestRef.current = requestAnimationFrame(
        (newTime) => detectFrame(newTime, onDetectionResult)
      );
      return;
    }
    
    // Only start a new detection if there's not one already in progress
    if (detectionInProgress.current) {
      requestRef.current = requestAnimationFrame(
        (newTime) => detectFrame(newTime, onDetectionResult)
      );
      return;
    }
    
    lastFrameTime.current = time;
    frameCount.current++;
    
    // Update FPS counter every second
    if (time - lastFpsUpdateTime.current >= 1000) {
      setDetectionState(prev => ({
        ...prev,
        detectionFps: frameCount.current
      }));
      frameCount.current = 0;
      lastFpsUpdateTime.current = time;
    }
    
    try {
      detectionInProgress.current = true;
      setDetectionState(prev => ({ ...prev, isDetecting: true }));
      
      // Perform detection
      const detectionResult = await performDetection(videoRef.current);
      
      // First detection succeeded, set flag to false
      if (firstDetectionRef.current) {
        firstDetectionRef.current = false;
      }
      
      // Pass detection result to callback
      onDetectionResult(detectionResult);
      
      setDetectionState(prev => ({ ...prev, isDetecting: false }));
      detectionInProgress.current = false;
    } catch (error) {
      console.error('Error in detection:', error);
      
      // Convert to proper error type
      const errorType = error.type || DetectionErrorType.UNKNOWN;
      const errorMessage = error.message || 'Unknown detection error';
      
      setDetectionState(prev => ({ 
        ...prev, 
        isDetecting: false,
        detectionError: {
          type: errorType,
          message: errorMessage,
          retryable: true
        }
      }));
      
      // Only show toast error occasionally to avoid spam
      if (frameCount.current % 10 === 0) {
        toast.error('Detection error', {
          description: errorMessage,
          duration: 3000
        });
      }
      
      detectionInProgress.current = false;
    }
    
    // Continue detection loop
    requestRef.current = requestAnimationFrame(
      (newTime) => detectFrame(newTime, onDetectionResult)
    );
  }, [videoRef, detectionState.isModelLoaded]);

  // Start detection
  const startDetection = useCallback((
    onDetectionResult: (result: DetectionResult) => void
  ) => {
    if (!detectionState.isDetecting && detectionState.isModelLoaded) {
      // Reset first detection flag
      firstDetectionRef.current = true;
      detectionInProgress.current = false;
      
      requestRef.current = requestAnimationFrame(
        (time) => detectFrame(time, onDetectionResult)
      );
      setDetectionState(prev => ({ ...prev, isDetecting: true }));
      console.log('Starting detection loop');
    } else if (!detectionState.isModelLoaded) {
      // Try to load the model and then start detection
      loadModel().then(success => {
        if (success) {
          detectionInProgress.current = false;
          requestRef.current = requestAnimationFrame(
            (time) => detectFrame(time, onDetectionResult)
          );
          setDetectionState(prev => ({ ...prev, isDetecting: true }));
          console.log('Starting detection loop after model load');
        }
      });
    }
  }, [detectFrame, detectionState.isDetecting, detectionState.isModelLoaded, loadModel]);

  // Stop detection
  const stopDetection = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      setDetectionState(prev => ({ ...prev, isDetecting: false }));
      console.log('Stopping detection loop');
    }
    
    // Clear any detection in progress flag
    detectionInProgress.current = false;
  }, []);
  
  return {
    detectionState,
    loadModel,
    startDetection,
    stopDetection,
    requestRef
  };
};

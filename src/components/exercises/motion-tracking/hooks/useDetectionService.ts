
import { useCallback, useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as Human from '@vladmandic/human';
import { human, warmupModel, resetModel, getModelLoadProgress } from '@/lib/human';
import { DetectionResult, DetectionState } from './types';
import { performDetection } from '../utils/detectionUtils';

export const useDetectionService = (videoRef: React.RefObject<HTMLVideoElement>) => {
  // Detection state
  const [detectionState, setDetectionState] = useState<DetectionState>({
    isDetecting: false,
    detectionFps: null,
    isModelLoaded: false,
    isModelLoading: false,
    detectionError: null,
    loadProgress: 0
  });

  // Detection loop references
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdateTime = useRef<number>(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef<number>(0);
  const maxRetries = 3;
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
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
      setDetectionState(prev => ({ 
        ...prev, 
        loadProgress: progress 
      }));
      
      // If model is fully loaded, stop the interval
      if (progress >= 100 || detectionState.isModelLoaded) {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
      }
    }, 300);
  }, [detectionState.isModelLoaded]);

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
        isModelLoading: true,
        loadProgress: 0
      }));
      
      // Start progress tracking
      setupProgressTracking();
      
      // Set a timeout to prevent UI from hanging
      const loadingPromise = warmupModel();
      
      loadingTimeoutRef.current = setTimeout(() => {
        if (!detectionState.isModelLoaded) {
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
      
      setDetectionState(prev => ({ 
        ...prev, 
        isModelLoaded: true,
        isModelLoading: false,
        detectionError: null,
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
        
        setDetectionState(prev => ({ 
          ...prev, 
          isModelLoading: false,
          detectionError: `Loading, retry ${retryCount.current}/${maxRetries}` 
        }));
        
        // Retry after a short delay
        setTimeout(() => loadModel(), 1500);
        return false;
      }
      
      setDetectionState(prev => ({ 
        ...prev, 
        isModelLoading: false,
        detectionError: 'Failed to load motion detection model. Please try refreshing the page or check if your browser supports WebGL.',
        loadProgress: 0
      }));
      
      toast.error('Failed to load motion detection model. Please try refreshing the page.');
      return false;
    }
  }, [detectionState.isModelLoaded, setupProgressTracking]);

  // Perform detection on a single frame with improved error handling and frame limiting
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
    
    // Calculate elapsed time since last frame
    const elapsed = time - lastFrameTime.current;
    
    // Limit detection rate for performance (aim for ~15 FPS which is plenty for motion tracking)
    if (elapsed < 66) { // ~15 FPS (1000ms / 15 = 66.67ms per frame)
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
      setDetectionState(prev => ({ ...prev, isDetecting: true }));
      
      // Perform detection
      const detectionResult = await performDetection(videoRef.current);
      
      // Pass detection result to callback
      onDetectionResult(detectionResult);
      
      setDetectionState(prev => ({ ...prev, isDetecting: false }));
    } catch (error) {
      console.error('Error in detection:', error);
      setDetectionState(prev => ({ 
        ...prev, 
        isDetecting: false,
        detectionError: 'Detection failed. The system will try to recover automatically.'
      }));
      
      // Try to recover by cleaning up tensors
      if (human.tf && human.tf.engine) {
        console.log('Cleaning up tensors after error');
        human.tf.engine().disposeVariables();
      }
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
      requestRef.current = requestAnimationFrame(
        (time) => detectFrame(time, onDetectionResult)
      );
      setDetectionState(prev => ({ ...prev, isDetecting: true }));
      console.log('Starting detection loop');
    } else if (!detectionState.isModelLoaded) {
      // Try to load the model and then start detection
      loadModel().then(success => {
        if (success) {
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
  }, []);
  
  return {
    detectionState,
    loadModel,
    startDetection,
    stopDetection,
    requestRef
  };
};

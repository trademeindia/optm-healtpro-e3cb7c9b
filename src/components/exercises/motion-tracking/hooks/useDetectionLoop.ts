
import { useCallback, useRef, useState } from 'react';
import { DetectionResult } from './types';
import { DetectionErrorType } from '@/lib/human/types';
import { performDetection } from '../utils/detectionUtils';

export interface DetectionLoopState {
  isDetecting: boolean;
  detectionFps: number | null;
}

export const useDetectionLoop = (
  videoRef: React.RefObject<HTMLVideoElement>, 
  isModelLoaded: boolean
) => {
  // Detection state
  const [detectionLoopState, setDetectionLoopState] = useState<DetectionLoopState>({
    isDetecting: false,
    detectionFps: null
  });

  // Detection loop references
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdateTime = useRef<number>(0);
  const detectionInProgress = useRef<boolean>(false);
  const firstDetectionRef = useRef<boolean>(true);

  // Perform detection on a single frame with improved error handling
  const detectFrame = useCallback(async (
    time: number,
    onDetectionResult: (result: DetectionResult) => void
  ) => {
    if (!videoRef.current || !isModelLoaded) {
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
      setDetectionLoopState(prev => ({
        ...prev,
        detectionFps: frameCount.current
      }));
      frameCount.current = 0;
      lastFpsUpdateTime.current = time;
    }
    
    try {
      detectionInProgress.current = true;
      setDetectionLoopState(prev => ({ ...prev, isDetecting: true }));
      
      // Perform detection
      const detectionResult = await performDetection(videoRef.current);
      
      // First detection succeeded, set flag to false
      if (firstDetectionRef.current) {
        firstDetectionRef.current = false;
      }
      
      // Pass detection result to callback
      onDetectionResult(detectionResult);
      
      setDetectionLoopState(prev => ({ ...prev, isDetecting: false }));
      detectionInProgress.current = false;
    } catch (error) {
      console.error('Error in detection:', error);
      
      setDetectionLoopState(prev => ({ ...prev, isDetecting: false }));
      detectionInProgress.current = false;
      
      // Rethrow with proper error type for handling in parent component
      throw {
        type: error.type || DetectionErrorType.UNKNOWN,
        message: error.message || 'Unknown detection error',
        retryable: true
      };
    }
    
    // Continue detection loop
    requestRef.current = requestAnimationFrame(
      (newTime) => detectFrame(newTime, onDetectionResult)
    );
  }, [videoRef, isModelLoaded]);

  // Start detection
  const startDetection = useCallback((
    onDetectionResult: (result: DetectionResult) => void
  ) => {
    // Reset first detection flag
    firstDetectionRef.current = true;
    detectionInProgress.current = false;
    
    requestRef.current = requestAnimationFrame(
      (time) => detectFrame(time, onDetectionResult)
    );
    setDetectionLoopState(prev => ({ ...prev, isDetecting: true }));
    console.log('Starting detection loop');
  }, [detectFrame]);

  // Stop detection
  const stopDetection = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      setDetectionLoopState(prev => ({ ...prev, isDetecting: false }));
      console.log('Stopping detection loop');
    }
    
    // Clear any detection in progress flag
    detectionInProgress.current = false;
  }, []);
  
  return {
    detectionLoopState,
    startDetection,
    stopDetection,
    requestRef
  };
};

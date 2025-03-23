
import { useCallback, useRef, useState } from 'react';
import { DetectionResult } from './types';
import { performDetection } from '../utils/detectionUtils';

/**
 * Hook for managing the detection animation loop with adaptive frame rate
 */
export const useDetectionLoop = (videoRef: React.RefObject<HTMLVideoElement>) => {
  // Detection state
  const [detectionState, setDetectionState] = useState({
    isDetecting: false,
    detectionFps: null as number | null,
    detectionError: null as string | null
  });
  
  // Detection loop references
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdateTime = useRef<number>(0);
  const successfulDetectionCount = useRef<number>(0);
  const framesToSkip = useRef<number>(1); // Adaptive frame skipping
  const framesSinceLastDetection = useRef<number>(0);
  
  // Perform detection on a single frame with improved error handling and adaptive frame limiting
  const detectFrame = useCallback(async (
    time: number,
    onDetectionResult: (result: DetectionResult) => void,
    isModelLoaded: boolean
  ) => {
    if (!videoRef.current || !isModelLoaded) {
      requestRef.current = requestAnimationFrame(
        (newTime) => detectFrame(newTime, onDetectionResult, isModelLoaded)
      );
      return;
    }
    
    // Calculate elapsed time since last frame
    const elapsed = time - lastFrameTime.current;
    
    // Track frame rate
    if (time - lastFpsUpdateTime.current >= 1000) {
      setDetectionState(prev => ({
        ...prev,
        detectionFps: frameCount.current
      }));
      
      // Adjust frame skipping based on detection success rate
      if (successfulDetectionCount.current < 5 && framesToSkip.current < 4) {
        // If we're getting few successful detections, skip more frames
        framesToSkip.current += 1;
        console.log(`Performance optimization: Increasing frame skip to ${framesToSkip.current}`);
      } else if (successfulDetectionCount.current > 10 && framesToSkip.current > 1) {
        // If we're getting many successful detections, reduce frame skipping
        framesToSkip.current -= 1;
        console.log(`Performance optimization: Decreasing frame skip to ${framesToSkip.current}`);
      }
      
      frameCount.current = 0;
      successfulDetectionCount.current = 0;
      lastFpsUpdateTime.current = time;
    }
    
    // Minimum time between frames (~15 FPS cap)
    if (elapsed < 66) {
      requestRef.current = requestAnimationFrame(
        (newTime) => detectFrame(newTime, onDetectionResult, isModelLoaded)
      );
      return;
    }
    
    // Adaptive frame skipping
    framesSinceLastDetection.current += 1;
    if (framesSinceLastDetection.current < framesToSkip.current) {
      lastFrameTime.current = time;
      frameCount.current++;
      requestRef.current = requestAnimationFrame(
        (newTime) => detectFrame(newTime, onDetectionResult, isModelLoaded)
      );
      return;
    }
    
    framesSinceLastDetection.current = 0;
    lastFrameTime.current = time;
    frameCount.current++;
    
    try {
      setDetectionState(prev => ({ ...prev, isDetecting: true }));
      
      // Perform detection
      const detectionResult = await performDetection(videoRef.current);
      
      // Track successful detections with actual body poses
      if (detectionResult.result && detectionResult.result.body && detectionResult.result.body.length > 0) {
        successfulDetectionCount.current++;
      }
      
      // Pass detection result to callback
      onDetectionResult(detectionResult);
      
      setDetectionState(prev => ({ ...prev, isDetecting: false, detectionError: null }));
    } catch (error) {
      console.error('Error in detection:', error);
      setDetectionState(prev => ({ 
        ...prev, 
        isDetecting: false,
        detectionError: 'Detection failed. The system will try to recover automatically.'
      }));
    }
    
    // Continue detection loop
    requestRef.current = requestAnimationFrame(
      (newTime) => detectFrame(newTime, onDetectionResult, isModelLoaded)
    );
  }, [videoRef]);

  // Start detection
  const startDetection = useCallback((
    onDetectionResult: (result: DetectionResult) => void,
    isModelLoaded: boolean
  ) => {
    if (!detectionState.isDetecting && isModelLoaded) {
      // Reset adaptation parameters
      framesToSkip.current = 2;
      framesSinceLastDetection.current = 0;
      successfulDetectionCount.current = 0;
      
      requestRef.current = requestAnimationFrame(
        (time) => detectFrame(time, onDetectionResult, isModelLoaded)
      );
      setDetectionState(prev => ({ ...prev, isDetecting: true }));
      console.log('Starting detection loop with adaptive frame skipping');
    }
  }, [detectFrame, detectionState.isDetecting]);

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
    startDetection,
    stopDetection,
    requestRef
  };
};

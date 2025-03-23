
import { useCallback, useRef, useState } from 'react';
import { DetectionResult } from './types';
import { performDetection } from '../utils/detectionUtils';

/**
 * Hook for managing the detection animation loop
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
  
  // Perform detection on a single frame with improved error handling and frame limiting
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
    
    // Limit detection rate for performance (aim for ~15 FPS which is plenty for motion tracking)
    if (elapsed < 66) { // ~15 FPS (1000ms / 15 = 66.67ms per frame)
      requestRef.current = requestAnimationFrame(
        (newTime) => detectFrame(newTime, onDetectionResult, isModelLoaded)
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
      
      // Try to recover by cleaning up tensors - handled within performDetection
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
      requestRef.current = requestAnimationFrame(
        (time) => detectFrame(time, onDetectionResult, isModelLoaded)
      );
      setDetectionState(prev => ({ ...prev, isDetecting: true }));
      console.log('Starting detection loop');
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

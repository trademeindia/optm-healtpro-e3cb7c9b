
import { useState, useRef, useCallback } from 'react';
import { performDetection } from '../utils/detectionUtils';
import { DetectionResult } from './types';

export const useDetectionLoop = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isModelLoaded: boolean
) => {
  // Detection state
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionFps, setDetectionFps] = useState<number | null>(null);
  
  // References for animation frame and timing
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdateTime = useRef<number>(0);
  
  // Detection callback ref to avoid re-creating detection loop
  const detectionCallbackRef = useRef<((result: DetectionResult) => void) | null>(null);
  
  // Detection loop function
  const detectFrame = useCallback(async (time: number) => {
    if (!videoRef.current || !isModelLoaded || !detectionCallbackRef.current) {
      requestRef.current = requestAnimationFrame(detectFrame);
      return;
    }
    
    // Calculate FPS
    const elapsed = time - lastFrameTime.current;
    
    // Limit detection rate for performance (aim for ~20-30 FPS)
    if (elapsed < 33) { // ~30 FPS
      requestRef.current = requestAnimationFrame(detectFrame);
      return;
    }
    
    lastFrameTime.current = time;
    frameCount.current++;
    
    // Update FPS counter every second
    if (time - lastFpsUpdateTime.current >= 1000) {
      setDetectionFps(frameCount.current);
      frameCount.current = 0;
      lastFpsUpdateTime.current = time;
    }
    
    try {
      // Perform detection
      const detectionResult = await performDetection(videoRef.current);
      
      // Call the callback with the results
      detectionCallbackRef.current(detectionResult);
    } catch (error) {
      console.error('Error in detection loop:', error);
      
      // If there's a callback, pass the error to it
      if (detectionCallbackRef.current) {
        throw error;
      }
    } finally {
      // Continue detection loop
      requestRef.current = requestAnimationFrame(detectFrame);
    }
  }, [videoRef, isModelLoaded]);
  
  // Start detection
  const startDetection = useCallback((onDetectionResult: (result: DetectionResult) => void) => {
    // Store the callback
    detectionCallbackRef.current = onDetectionResult;
    
    // Start the detection loop if not already running
    if (!isDetecting) {
      setIsDetecting(true);
      lastFrameTime.current = 0;
      frameCount.current = 0;
      lastFpsUpdateTime.current = 0;
      requestRef.current = requestAnimationFrame(detectFrame);
      console.log('Starting detection loop');
    }
  }, [detectFrame, isDetecting]);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      setIsDetecting(false);
      detectionCallbackRef.current = null;
      console.log('Stopping detection loop');
    }
  }, []);
  
  return {
    detectionLoopState: {
      isDetecting,
      detectionFps
    },
    startDetection,
    stopDetection,
    requestRef
  };
};

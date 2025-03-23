
import { useState, useRef, useCallback, useEffect } from 'react';
import { DetectionResult } from './types';
import { performDetection, getDetectionStats, resetDetectionStats } from '../utils/detectionUtils';
import { toast } from 'sonner';

interface DetectionState {
  isDetecting: boolean;
  detectionFps: number;
  detectionError: string | null;
  lastDetection: number;
  successRate: number;
}

export const useDetectionLoop = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [detectionState, setDetectionState] = useState<DetectionState>({
    isDetecting: false,
    detectionFps: 0,
    detectionError: null,
    lastDetection: 0,
    successRate: 0
  });
  
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);
  const resultsCountRef = useRef<number>(0);
  const lastInfoToastRef = useRef<number>(0);
  const onDetectionResultRef = useRef<((result: DetectionResult) => void) | null>(null);
  
  // Track when detection is active
  const isDetectingRef = useRef<boolean>(false);
  
  // FPS calculation
  const calculateFps = useCallback((time: number) => {
    // Update FPS every second
    if (time - lastFpsUpdateRef.current >= 1000) {
      const fps = Math.round(frameCountRef.current * 1000 / (time - lastFpsUpdateRef.current));
      frameCountRef.current = 0;
      lastFpsUpdateRef.current = time;
      
      // Update detection state with current fps and success rate
      const stats = getDetectionStats();
      setDetectionState(prev => ({
        ...prev,
        detectionFps: fps,
        successRate: stats.successRate
      }));
      
      // Show periodic info toast (but not too frequently)
      if (time - lastInfoToastRef.current > 10000 && isDetectingRef.current) {
        lastInfoToastRef.current = time;
        console.log(`Motion tracking stats - FPS: ${fps}, Success rate: ${stats.successRate.toFixed(1)}%`);
      }
    } else {
      frameCountRef.current++;
    }
  }, []);
  
  // Run a single detection
  const runDetection = useCallback(async () => {
    if (!videoRef.current || !isDetectingRef.current || !onDetectionResultRef.current) {
      return;
    }
    
    try {
      const result = await performDetection(videoRef.current);
      
      // Track successful results
      if (result.result) {
        resultsCountRef.current++;
      }
      
      // Call the callback with the result
      if (onDetectionResultRef.current) {
        onDetectionResultRef.current(result);
      }
      
      // Reset error state if successful
      if (detectionState.detectionError) {
        setDetectionState(prev => ({ ...prev, detectionError: null }));
      }
    } catch (error) {
      console.error('Error in runDetection:', error);
      
      setDetectionState(prev => ({
        ...prev,
        detectionError: error instanceof Error ? error.message : 'Unknown detection error'
      }));
      
      // Show error toast, but not too frequently
      if (Date.now() - lastInfoToastRef.current > 10000) {
        lastInfoToastRef.current = Date.now();
        toast.error('Detection error. Trying to recover...');
      }
    }
  }, [videoRef, detectionState.detectionError]);
  
  // Animation loop
  const detectionLoop = useCallback(async (time: number) => {
    // Skip first frame
    if (previousTimeRef.current === 0) {
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(detectionLoop);
      return;
    }
    
    // Calculate FPS
    calculateFps(time);
    
    // Run detection less frequently than animation frame for better performance
    // Adaptive rate: slower when detection has been failing
    const minDetectionInterval = detectionState.successRate < 90 ? 200 : 100;
    const elapsed = time - detectionState.lastDetection;
    
    if (elapsed > minDetectionInterval) {
      setDetectionState(prev => ({ ...prev, lastDetection: time }));
      await runDetection();
    }
    
    // Continue the loop
    if (isDetectingRef.current) {
      requestRef.current = requestAnimationFrame(detectionLoop);
    }
  }, [calculateFps, runDetection, detectionState.lastDetection, detectionState.successRate]);
  
  // Start detection
  const startDetection = useCallback((
    onDetectionResult: (result: DetectionResult) => void,
    isModelLoaded: boolean
  ) => {
    // Don't restart if already detecting
    if (isDetectingRef.current) {
      return;
    }
    
    // Don't start if model not loaded
    if (!isModelLoaded) {
      setDetectionState(prev => ({
        ...prev,
        detectionError: 'Model not loaded. Please load the model first.'
      }));
      return;
    }
    
    // Reset tracking values
    resetDetectionStats();
    frameCountRef.current = 0;
    lastFpsUpdateRef.current = 0;
    previousTimeRef.current = 0;
    resultsCountRef.current = 0;
    
    // Store callback
    onDetectionResultRef.current = onDetectionResult;
    
    // Update state
    isDetectingRef.current = true;
    setDetectionState(prev => ({
      ...prev,
      isDetecting: true,
      detectionError: null,
      lastDetection: performance.now()
    }));
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(detectionLoop);
    
    console.log('Motion detection started');
  }, [detectionLoop]);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    // Cancel animation frame
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    
    // Clear detection callback
    onDetectionResultRef.current = null;
    
    // Update state
    isDetectingRef.current = false;
    setDetectionState(prev => ({
      ...prev,
      isDetecting: false
    }));
    
    console.log('Motion detection stopped');
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
  return {
    detectionState,
    startDetection,
    stopDetection,
    requestRef
  };
};

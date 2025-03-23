
import { useState, useRef, useCallback, useEffect } from 'react';
import { DetectionResult } from '../types';
import { getDetectionStats, resetDetectionStats } from '../../utils/detectionUtils';
import { useFpsCalculator } from './useFpsCalculator';
import { useDetectionOperations } from './useDetectionOperations';
import { DetectionState, UseDetectionLoopReturn } from './types';

export const useDetectionLoop = (
  videoRef: React.RefObject<HTMLVideoElement>
): UseDetectionLoopReturn => {
  const [detectionState, setDetectionState] = useState<DetectionState>({
    isDetecting: false,
    detectionFps: 0,
    detectionError: null,
    lastDetection: 0,
    successRate: 0
  });
  
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(0);
  const onDetectionResultRef = useRef<((result: DetectionResult) => void) | null>(null);
  
  // Track when detection is active
  const isDetectingRef = useRef<boolean>(false);
  
  // Update FPS and success rate
  const handleFpsUpdate = useCallback((fps: number) => {
    const stats = getDetectionStats();
    setDetectionState(prev => ({
      ...prev,
      detectionFps: fps,
      successRate: stats.successRate
    }));
  }, []);
  
  // Setup FPS calculator
  const { calculateFps, resetFpsCounter } = useFpsCalculator(handleFpsUpdate);
  
  // Setup detection operations
  const handleDetectionErrorChange = useCallback((error: string | null) => {
    setDetectionState(prev => ({ ...prev, detectionError: error }));
  }, []);
  
  const { 
    runDetection, 
    logDetectionStats,
    resetDetectionOperations 
  } = useDetectionOperations(videoRef, handleDetectionErrorChange);
  
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
    
    // Log stats periodically
    logDetectionStats(isDetectingRef.current);
    
    // Run detection less frequently than animation frame for better performance
    // Adaptive rate: slower when detection has been failing
    const minDetectionInterval = detectionState.successRate < 90 ? 200 : 100;
    const elapsed = time - detectionState.lastDetection;
    
    if (elapsed > minDetectionInterval) {
      setDetectionState(prev => ({ ...prev, lastDetection: time }));
      await runDetection(
        isDetectingRef.current, 
        onDetectionResultRef.current, 
        detectionState.detectionError
      );
    }
    
    // Continue the loop
    if (isDetectingRef.current) {
      requestRef.current = requestAnimationFrame(detectionLoop);
    }
  }, [
    calculateFps, 
    runDetection, 
    logDetectionStats, 
    detectionState.lastDetection, 
    detectionState.successRate, 
    detectionState.detectionError
  ]);
  
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
    resetFpsCounter();
    resetDetectionOperations();
    previousTimeRef.current = 0;
    
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
  }, [detectionLoop, resetFpsCounter, resetDetectionOperations]);
  
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


import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import * as Human from '@vladmandic/human';
import { human } from '@/lib/human';
import { DetectionResult, DetectionState } from './types';
import { performDetection } from '../utils/detectionUtils';

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

  // Ensure model is loaded
  const loadModel = useCallback(async () => {
    try {
      if (!detectionState.isModelLoaded) {
        setDetectionState(prev => ({ ...prev, detectionError: null }));
        await human.load();
        setDetectionState(prev => ({ ...prev, isModelLoaded: true }));
      }
    } catch (error) {
      console.error('Error loading Human.js model:', error);
      setDetectionState(prev => ({ 
        ...prev, 
        detectionError: 'Failed to load Human.js model' 
      }));
      toast.error('Failed to load motion detection model. Please refresh and try again.');
    }
  }, [detectionState.isModelLoaded]);

  // Perform detection on a single frame
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
    if (elapsed < 33) { // ~30 FPS
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
        detectionError: 'Detection failed'
      }));
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
    }
  }, [detectFrame, detectionState.isDetecting, detectionState.isModelLoaded]);

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

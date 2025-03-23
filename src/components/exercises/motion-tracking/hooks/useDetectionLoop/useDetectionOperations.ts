
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { DetectionResult } from '../types';
import { performDetection, getDetectionStats } from '../../utils/detectionUtils';

export const useDetectionOperations = (
  videoRef: React.RefObject<HTMLVideoElement>,
  onDetectionErrorChange: (error: string | null) => void
) => {
  const resultsCountRef = useRef<number>(0);
  const lastInfoToastRef = useRef<number>(0);
  
  const runDetection = useCallback(async (
    isDetecting: boolean,
    onDetectionResult: ((result: DetectionResult) => void) | null,
    currentError: string | null
  ) => {
    if (!videoRef.current || !isDetecting || !onDetectionResult) {
      return;
    }
    
    try {
      const result = await performDetection(videoRef.current);
      
      // Track successful results
      if (result.result) {
        resultsCountRef.current++;
      }
      
      // Call the callback with the result
      onDetectionResult(result);
      
      // Reset error state if successful
      if (currentError) {
        onDetectionErrorChange(null);
      }
    } catch (error) {
      console.error('Error in runDetection:', error);
      
      onDetectionErrorChange(error instanceof Error ? error.message : 'Unknown detection error');
      
      // Show error toast, but not too frequently
      if (Date.now() - lastInfoToastRef.current > 10000) {
        lastInfoToastRef.current = Date.now();
        toast.error('Detection error. Trying to recover...');
      }
    }
  }, [videoRef, onDetectionErrorChange]);
  
  const logDetectionStats = useCallback((isDetecting: boolean) => {
    if (!isDetecting) return;
    
    const time = Date.now();
    
    // Show periodic info toast (but not too frequently)
    if (time - lastInfoToastRef.current > 10000) {
      lastInfoToastRef.current = time;
      const stats = getDetectionStats();
      console.log(`Motion tracking stats - FPS: ${stats.fps}, Success rate: ${stats.successRate.toFixed(1)}%`);
    }
  }, []);
  
  const resetDetectionOperations = useCallback(() => {
    resultsCountRef.current = 0;
    lastInfoToastRef.current = 0;
  }, []);
  
  return {
    runDetection,
    logDetectionStats,
    resetDetectionOperations
  };
};

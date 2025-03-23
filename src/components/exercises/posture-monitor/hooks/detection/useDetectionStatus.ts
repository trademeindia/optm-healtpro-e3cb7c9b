
import { useState, useCallback, useRef } from 'react';
import { DetectionStatus, DetectionStateRef } from './types';

export const useDetectionStatus = () => {
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    confidence: null,
    detectedKeypoints: 0,
    lastDetectionTime: 0
  });
  
  const lastFpsUpdateTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  
  // Update detection status
  const updateDetectionStatus = useCallback((updates: Partial<DetectionStatus>) => {
    setDetectionStatus(prev => ({
      ...prev,
      ...updates
    }));
  }, []);
  
  // Update FPS calculations
  const updateFpsStats = useCallback((currentTime: number, stateRef: React.MutableRefObject<DetectionStateRef>) => {
    frameCount.current++;
    
    // Calculate FPS every second
    if (currentTime - lastFpsUpdateTime.current >= 1000) {
      updateDetectionStatus({
        fps: frameCount.current
      });
      
      frameCount.current = 0;
      lastFpsUpdateTime.current = currentTime;
    }
  }, [updateDetectionStatus]);
  
  return {
    detectionStatus,
    setDetectionStatus,
    updateFpsStats,
    updateDetectionStatus
  };
};

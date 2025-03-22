import { useState, useCallback } from 'react';
import { DetectionStatus, DetectionState } from './types';

export const useDetectionStatus = () => {
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    confidence: null,
    detectedKeypoints: 0,
    lastDetectionTime: 0
  });
  
  // Update the FPS calculation based on recent detection times
  const updateFpsStats = useCallback((detectionTime: number, stateRef: React.MutableRefObject<DetectionState>) => {
    const state = stateRef.current;
    
    // Add current detection time to the array (keep only last 30 frames for FPS calculation)
    state.detectionTimes.push(detectionTime);
    if (state.detectionTimes.length > 30) {
      state.detectionTimes.shift();
    }
    
    // Calculate average detection time
    const avgDetectionTime = state.detectionTimes.reduce((acc, time) => acc + time, 0) / state.detectionTimes.length;
    
    // Calculate FPS based on average detection time
    const fps = Math.round(1000 / avgDetectionTime);
    
    // Update detection status with new FPS
    setDetectionStatus(prevStatus => ({
      ...prevStatus,
      fps
    }));
  }, []);
  
  return {
    detectionStatus,
    setDetectionStatus,
    updateFpsStats
  };
};

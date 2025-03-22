
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
    
    // Add current detection time to the array
    state.frameTimes.push(detectionTime);
    if (state.frameTimes.length > 30) {
      state.frameTimes.shift();
    }
    
    // Calculate average detection time
    const avgDetectionTime = state.frameTimes.reduce((acc, time) => acc + time, 0) / state.frameTimes.length;
    
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

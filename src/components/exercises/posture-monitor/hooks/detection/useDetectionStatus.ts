
import { useRef, useState, useCallback } from 'react';
import { DetectionState } from './types';

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  lastDetectionTime: number;
  confidence: number | null;
  detectedKeypoints: number;
}

export const useDetectionStatus = () => {
  const lastFpsUpdateTime = useRef<number>(0);
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    lastDetectionTime: 0,
    confidence: null,
    detectedKeypoints: 0
  });
  
  const updateFpsStats = useCallback((detectionTime: number, detectionStateRef: React.RefObject<DetectionState>) => {
    const now = performance.now();
    
    if (!detectionStateRef.current) return;
    
    if (!detectionStateRef.current.frameTimes.length || 
        now - detectionStateRef.current.frameTimes[0] > 1000) {
      detectionStateRef.current.frameTimes = [now];
      detectionStateRef.current.cumulativeProcessingTime = detectionTime;
      detectionStateRef.current.framesProcessed = 1;
    } else {
      detectionStateRef.current.frameTimes.push(now);
      detectionStateRef.current.cumulativeProcessingTime += detectionTime;
      detectionStateRef.current.framesProcessed++;
      
      while (detectionStateRef.current.frameTimes.length > 0 && 
             now - detectionStateRef.current.frameTimes[0] > 1000) {
        detectionStateRef.current.frameTimes.shift();
      }
    }
    
    if (now - lastFpsUpdateTime.current > 500) {
      const frameCount = detectionStateRef.current.frameTimes.length;
      const timeWindow = frameCount > 1 
        ? (detectionStateRef.current.frameTimes[frameCount - 1] - detectionStateRef.current.frameTimes[0]) / 1000
        : 1;
      
      const fps = frameCount / timeWindow;
      const avgProcessingTime = detectionStateRef.current.cumulativeProcessingTime / detectionStateRef.current.framesProcessed;
      
      setDetectionStatus(prevStatus => ({
        ...prevStatus,
        fps,
        isDetecting: true,
        lastDetectionTime: now
      }));
      
      lastFpsUpdateTime.current = now;
      
      if (now % 3000 < 100) {
        console.log(`Detection stats: ${fps.toFixed(1)} FPS, avg processing: ${avgProcessingTime.toFixed(1)}ms`);
      }
    }
  }, []);
  
  return {
    detectionStatus,
    setDetectionStatus,
    updateFpsStats
  };
};

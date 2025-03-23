
import { useState, useCallback } from 'react';
import type { DetectionStatus } from './types';

export const useDetectionStatusHandler = () => {
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    confidence: null,
    detectedKeypoints: 0,
    lastDetectionTime: 0
  });
  
  // Update detection status with new values
  const updateDetectionStatus = useCallback((updates: Partial<DetectionStatus>) => {
    setDetectionStatus(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Reset detection status
  const resetDetectionStatus = useCallback(() => {
    setDetectionStatus({
      isDetecting: false,
      fps: null,
      confidence: null,
      detectedKeypoints: 0,
      lastDetectionTime: 0
    });
  }, []);
  
  return {
    detectionStatus,
    setDetectionStatus,
    updateDetectionStatus,
    resetDetectionStatus
  };
};

export type { DetectionStatus };

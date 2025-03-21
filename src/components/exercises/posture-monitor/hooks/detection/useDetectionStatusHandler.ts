
import { useState } from 'react';

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints: number;
  lastDetectionTime: number;
}

export const useDetectionStatusHandler = () => {
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    confidence: null,
    detectedKeypoints: 0,
    lastDetectionTime: 0
  });
  
  return {
    detectionStatus,
    setDetectionStatus
  };
};

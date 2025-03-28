
export interface VideoStatus {
  isReady: boolean;
  hasStream: boolean;
  resolution: { width: number; height: number } | null;
  lastCheckTime: number;
  errorCount: number;
}

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints?: number;
  lastDetectionTime?: number;
}

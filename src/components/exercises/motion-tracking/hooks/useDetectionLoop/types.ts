
import { DetectionResult } from '../types';

export interface DetectionState {
  isDetecting: boolean;
  detectionFps: number;
  detectionError: string | null;
  lastDetection: number;
  successRate: number;
}

export interface DetectionLoopConfig {
  minDetectionInterval?: number;
  fpsUpdateInterval?: number;
  infoToastInterval?: number;
}

export interface UseDetectionLoopReturn {
  detectionState: DetectionState;
  startDetection: (onDetectionResult: (result: DetectionResult) => void, isModelLoaded: boolean) => void;
  stopDetection: () => void;
  requestRef: React.MutableRefObject<number | null>;
}

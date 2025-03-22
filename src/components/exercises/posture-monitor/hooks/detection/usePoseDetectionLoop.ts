
import { useState, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { useDetectionLoop } from './useDetectionLoop';
import { FeedbackType } from '../../types';

export interface UsePoseDetectionLoopProps {
  model: posenet.PoseNet | null;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  config: any;
  onPoseDetected: (pose: posenet.Pose) => void;
  setFeedback: (message: string, type: FeedbackType) => void;
  videoReady: boolean;
}

export const usePoseDetectionLoop = ({
  model,
  cameraActive,
  videoRef,
  config,
  onPoseDetected,
  setFeedback,
  videoReady
}: UsePoseDetectionLoopProps) => {
  const { isDetectionRunning, detectionStatus } = useDetectionLoop({
    model,
    cameraActive,
    videoRef,
    config,
    onPoseDetected,
    setFeedback,
    videoReady
  });

  useEffect(() => {
    if (cameraActive && model && !isDetectionRunning) {
      setFeedback("Starting pose detection...", FeedbackType.INFO);
    } else if (!cameraActive && isDetectionRunning) {
      setFeedback("Pose detection stopped.", FeedbackType.INFO);
    }
  }, [cameraActive, model, isDetectionRunning, setFeedback]);

  return {
    isDetectionRunning,
    detectionStatus
  };
};

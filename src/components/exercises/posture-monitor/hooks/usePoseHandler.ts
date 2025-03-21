
import { useState, useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { FeedbackType } from '../types';

interface UsePoseHandlerProps {
  analyzePose: (detectedPose: posenet.Pose) => void;
}

export const usePoseHandler = ({ analyzePose }: UsePoseHandlerProps) => {
  const [pose, setPose] = useState<posenet.Pose | null>(null);
  
  // Handle pose detection
  const handlePoseDetected = useCallback((detectedPose: posenet.Pose) => {
    setPose(detectedPose);
    analyzePose(detectedPose);
  }, [analyzePose]);
  
  return {
    pose,
    handlePoseDetected
  };
};


import { useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { FeedbackType } from '../../types';

interface UsePoseEstimationProps {
  model: posenet.PoseNet | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  config: {
    minPoseConfidence: number;
    minPartConfidence: number;
  };
  onDetectionSuccess: (pose: posenet.Pose, detectionTime: number) => void;
  onDetectionFailure: (error: any) => void;
  setFeedback: (message: string | null, type: FeedbackType) => void;
}

export const usePoseEstimation = ({
  model,
  videoRef,
  config,
  onDetectionSuccess,
  onDetectionFailure,
  setFeedback
}: UsePoseEstimationProps) => {
  const estimatePose = useCallback(async () => {
    if (!model || !videoRef.current) {
      return null;
    }
    
    try {
      const startTime = performance.now();
      
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true
      });
      
      const detectionTime = performance.now() - startTime;
      
      if (performance.now() % 5000 < 100) {
        console.log(`Pose detected, score: ${detectedPose.score}`);
        console.log(`Pose detection completed in ${detectionTime.toFixed(2)}ms (${(1000/detectionTime).toFixed(1)} FPS)`);
      }
      
      onDetectionSuccess(detectedPose, detectionTime);
      
      if (detectedPose.score < 0.1) {
        setFeedback(
          "Can't detect your pose clearly. Ensure good lighting and that your full body is visible.",
          FeedbackType.WARNING
        );
      }
      
      return detectedPose;
    } catch (error) {
      onDetectionFailure(error);
      return null;
    }
  }, [model, videoRef, config, onDetectionSuccess, onDetectionFailure, setFeedback]);

  return { estimatePose };
};

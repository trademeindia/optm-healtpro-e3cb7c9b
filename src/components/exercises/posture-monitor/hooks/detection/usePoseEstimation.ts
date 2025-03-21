
import { useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { FeedbackType } from '../../types';

interface UsePoseEstimationProps {
  model: posenet.PoseNet | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  config: any;
  onDetectionSuccess: (pose: posenet.Pose, detectionTime: number) => void;
  onDetectionFailure: (error: any) => void;
  setFeedback: (message: string, type: FeedbackType) => void;
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
      throw new Error('Model or video element not available');
    }
    
    const video = videoRef.current;
    
    try {
      // Record start time for performance measurement
      const startTime = performance.now();
      
      // Estimate pose
      const pose = await model.estimateSinglePose(video, {
        flipHorizontal: true,
        ...config
      });
      
      // Calculate time taken
      const detectionTime = performance.now() - startTime;
      
      // Check if we have enough keypoints with sufficient confidence
      const minConfidentKeypoints = pose.keypoints.filter(kp => kp.score > config.minPartConfidence);
      
      if (minConfidentKeypoints.length < 5) {
        throw new Error('Not enough keypoints detected with sufficient confidence');
      }
      
      // Call success handler with pose and timing data
      onDetectionSuccess(pose, detectionTime);
      
      return pose;
    } catch (error) {
      onDetectionFailure(error);
      throw error;
    }
  }, [model, videoRef, config, onDetectionSuccess, onDetectionFailure, setFeedback]);
  
  return { estimatePose };
};


import { useRef, useCallback, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { UsePoseDetectionLoopProps } from './types';
import { useDetectionFailureHandler } from './useDetectionFailureHandler';
import { useAdaptiveFrameRate } from './useAdaptiveFrameRate';
import { FeedbackType } from '../../types';

export const usePoseDetectionLoop = ({
  model,
  cameraActive,
  videoRef,
  config,
  onPoseDetected,
  setFeedback
}: UsePoseDetectionLoopProps) => {
  const requestAnimationRef = useRef<number | null>(null);
  
  // Helpers for detection failures and timing
  const {
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  } = useDetectionFailureHandler(setFeedback);
  
  // Helper for frame rate adaptation
  const { calculateFrameDelay } = useAdaptiveFrameRate();
  
  // Detect pose in video stream
  const detectPose = useCallback(async () => {
    if (!model || !videoRef.current || !cameraActive) {
      if (!model) console.log("Cannot detect pose: missing model");
      if (!videoRef.current) console.log("Cannot detect pose: missing video element");
      if (!cameraActive) console.log("Cannot detect pose: camera inactive");
      return;
    }
    
    try {
      if (videoRef.current.readyState < 2) {
        // Video not ready yet
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        console.log("Video not ready for pose detection, waiting... ReadyState:", videoRef.current.readyState);
        return;
      }
      
      // Ensure video is not paused
      if (videoRef.current.paused || videoRef.current.ended) {
        try {
          console.log("Video is paused/ended during detection, attempting to play...");
          await videoRef.current.play();
        } catch (error) {
          console.error("Failed to play video during pose detection:", error);
          handleDetectionFailure(error);
          
          requestAnimationRef.current = requestAnimationFrame(detectPose);
          return;
        }
      }
      
      // Calculate time since last successful detection for performance monitoring
      const now = performance.now();
      const timeSinceLastDetection = now - detectionStateRef.current.lastDetectionTime;
      
      console.log("Estimating pose...");
      // Estimate pose
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true  // Mirror the camera view
      });
      
      console.log("Pose detected, score:", detectedPose.score);
      updateDetectionTime();
      
      // Reset failure counter on successful detection
      resetFailureCounter();
      
      // Calculate FPS for monitoring
      const detectionTime = performance.now() - now;
      console.log(`Pose detection completed in ${detectionTime.toFixed(2)}ms (${(1000/detectionTime).toFixed(1)} FPS)`);
      
      // Only proceed if we have a pose with sufficient confidence
      if (detectedPose.score > config.minPoseConfidence) {
        onPoseDetected(detectedPose);
      } else {
        // Pose confidence is too low
        console.warn("Low confidence in pose detection:", detectedPose.score);
        setFeedback(
          "Can't detect your pose clearly. Ensure good lighting and that your full body is visible.",
          FeedbackType.WARNING
        );
      }
    } catch (error) {
      handleDetectionFailure(error);
    }
    
    // Continue the detection loop with adaptive frame rate
    // If detection is taking too long, we'll slow down the frame rate
    const frameDelay = calculateFrameDelay(detectionStateRef.current.lastDetectionTime);
    requestAnimationRef.current = setTimeout(() => {
      requestAnimationRef.current = requestAnimationFrame(detectPose);
    }, frameDelay) as unknown as number;
  }, [
    model, 
    cameraActive, 
    videoRef, 
    config, 
    onPoseDetected, 
    setFeedback, 
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime,
    calculateFrameDelay
  ]);
  
  // Start pose detection when camera is active
  useEffect(() => {
    if (cameraActive && model && videoRef.current) {
      console.log("Starting pose detection loop...");
      // Start detection
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      
      return () => {
        // Cleanup animation frame on unmount or dependency change
        if (requestAnimationRef.current) {
          if (typeof requestAnimationRef.current === 'number') {
            cancelAnimationFrame(requestAnimationRef.current);
          } else {
            clearTimeout(requestAnimationRef.current);
          }
          requestAnimationRef.current = null;
        }
      };
    }
  }, [cameraActive, model, detectPose, videoRef]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestAnimationRef.current) {
        if (typeof requestAnimationRef.current === 'number') {
          cancelAnimationFrame(requestAnimationRef.current);
        } else {
          clearTimeout(requestAnimationRef.current);
        }
        requestAnimationRef.current = null;
      }
    };
  }, []);
  
  return {
    isDetectionRunning: !!requestAnimationRef.current
  };
};

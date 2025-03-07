
import { useRef, useCallback, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { FeedbackType } from '../types';

interface UsePoseDetectionLoopProps {
  model: posenet.PoseNet | null;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  config: any;
  onPoseDetected: (pose: posenet.Pose) => void;
  setFeedback: (message: string | null, type: FeedbackType) => void;
}

export const usePoseDetectionLoop = ({
  model,
  cameraActive,
  videoRef,
  config,
  onPoseDetected,
  setFeedback
}: UsePoseDetectionLoopProps) => {
  const requestAnimationRef = useRef<number | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);
  const detectionFailuresRef = useRef<number>(0);
  
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
          detectionFailuresRef.current++;
          
          if (detectionFailuresRef.current > 5) {
            setFeedback(
              "Video stream issues detected. Please try restarting the camera.",
              FeedbackType.WARNING
            );
            
            // Reset failure counter to avoid repeated warnings
            detectionFailuresRef.current = 0;
          }
          
          requestAnimationRef.current = requestAnimationFrame(detectPose);
          return;
        }
      }
      
      // Calculate time since last successful detection for performance monitoring
      const now = performance.now();
      const timeSinceLastDetection = now - lastDetectionTimeRef.current;
      
      console.log("Estimating pose...");
      // Estimate pose
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true  // Mirror the camera view
      });
      
      console.log("Pose detected, score:", detectedPose.score);
      lastDetectionTimeRef.current = performance.now();
      
      // Reset failure counter on successful detection
      detectionFailuresRef.current = 0;
      
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
      console.error('Error estimating pose:', error);
      detectionFailuresRef.current++;
      
      if (detectionFailuresRef.current > 5) {
        setFeedback(
          "Error detecting your pose. Please ensure good lighting and that your camera is working properly.",
          FeedbackType.WARNING
        );
        
        // Reset failure counter to avoid repeated warnings
        detectionFailuresRef.current = 0;
      }
    }
    
    // Continue the detection loop with adaptive frame rate
    // If detection is taking too long, we'll slow down the frame rate
    const frameDelay = Math.max(0, 33 - (performance.now() - lastDetectionTimeRef.current));
    requestAnimationRef.current = setTimeout(() => {
      requestAnimationRef.current = requestAnimationFrame(detectPose);
    }, frameDelay) as unknown as number;
  }, [model, cameraActive, videoRef, config, onPoseDetected, setFeedback]);
  
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

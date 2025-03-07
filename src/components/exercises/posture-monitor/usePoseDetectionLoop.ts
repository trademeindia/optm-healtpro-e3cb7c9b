
import { useRef, useCallback, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { PoseDetectionConfig } from './poseDetectionTypes';

interface UsePoseDetectionLoopProps {
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  model: posenet.PoseNet | null;
  config: PoseDetectionConfig;
  onPoseDetected: (pose: posenet.Pose) => void;
  onPoseError: (error: string) => void;
}

interface UsePoseDetectionLoopResult {
  isDetecting: boolean;
}

export const usePoseDetectionLoop = ({
  cameraActive,
  videoRef,
  model,
  config,
  onPoseDetected,
  onPoseError
}: UsePoseDetectionLoopProps): UsePoseDetectionLoopResult => {
  // Detection performance monitoring
  const lastDetectionTimeRef = useRef<number>(0);
  const detectionFailuresRef = useRef<number>(0);
  const isDetectingRef = useRef<boolean>(false);
  const frameCountRef = useRef<number>(0);
  
  // Animation frame reference
  const requestAnimationRef = useRef<number | null>(null);

  // Detect pose in video stream
  const detectPose = useCallback(async () => {
    if (!model || !videoRef.current || !cameraActive) {
      console.log("Cannot detect pose: missing model, video, or camera inactive");
      return;
    }
    
    try {
      if (videoRef.current.readyState < 2) {
        // Video not ready yet
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        console.log("Video not ready for pose detection, waiting...");
        return;
      }
      
      // Ensure video is not paused
      if (videoRef.current.paused || videoRef.current.ended) {
        try {
          console.log("Video is paused/ended, attempting to play...");
          await videoRef.current.play();
        } catch (error) {
          console.error("Failed to play video during pose detection:", error);
          detectionFailuresRef.current++;
          
          if (detectionFailuresRef.current > 5) {
            onPoseError("Video stream issues detected. Please try restarting the camera.");
            
            // Reset failure counter to avoid repeated warnings
            detectionFailuresRef.current = 0;
          }
          
          requestAnimationRef.current = requestAnimationFrame(detectPose);
          return;
        }
      }
      
      // Performance optimization: implement frame skipping
      frameCountRef.current = (frameCountRef.current + 1) % (config.frameskip + 1);
      if (frameCountRef.current !== 0) {
        // Skip this frame based on frameskip setting
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        return;
      }
      
      // Calculate time since last successful detection for performance monitoring
      const now = performance.now();
      const timeSinceLastDetection = now - lastDetectionTimeRef.current;
      
      console.log("Estimating pose...");
      // Estimate pose
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true  // Mirror the camera view
      });
      
      console.log("Pose detected:", detectedPose.score);
      lastDetectionTimeRef.current = performance.now();
      
      // Reset failure counter on successful detection
      detectionFailuresRef.current = 0;
      
      // Calculate FPS for monitoring
      const detectionTime = performance.now() - now;
      console.log(`Pose detection completed in ${detectionTime.toFixed(2)}ms (${(1000/detectionTime).toFixed(1)} FPS)`);
      
      // Check if detection is taking too long
      if (detectionTime > 100) {
        console.warn("Pose detection is slow, may impact performance");
      }
      
      // Only proceed if we have a pose with sufficient confidence
      if (detectedPose.score > config.minPoseConfidence) {
        onPoseDetected(detectedPose);
      } else {
        // Pose confidence is too low
        console.warn("Low confidence in pose detection:", detectedPose.score);
        onPoseError("Can't detect your pose clearly. Ensure good lighting and that your full body is visible.");
      }
    } catch (error) {
      console.error('Error estimating pose:', error);
      detectionFailuresRef.current++;
      
      if (detectionFailuresRef.current > 5) {
        onPoseError("Error detecting your pose. Please ensure good lighting and that your camera is working properly.");
        
        // Reset failure counter to avoid repeated warnings
        detectionFailuresRef.current = 0;
      }
    }
    
    // Continue the detection loop with adaptive frame rate based on device performance
    const frameDelay = config.optimizationLevel === 'performance' 
      ? Math.max(0, 50 - (performance.now() - lastDetectionTimeRef.current)) // Lower frame rate for performance mode
      : Math.max(0, 33 - (performance.now() - lastDetectionTimeRef.current)); // Higher frame rate otherwise
      
    requestAnimationRef.current = setTimeout(() => {
      requestAnimationRef.current = requestAnimationFrame(detectPose);
    }, frameDelay) as unknown as number;
  }, [model, cameraActive, videoRef, config, onPoseDetected, onPoseError]);
  
  // Start pose detection when camera is active
  useEffect(() => {
    if (cameraActive && model && videoRef.current) {
      console.log("Starting pose detection...");
      // Start detection
      isDetectingRef.current = true;
      frameCountRef.current = 0; // Reset frame counter
      requestAnimationRef.current = requestAnimationFrame(detectPose);
    } else if (!cameraActive) {
      // Stop detection if camera is inactive
      isDetectingRef.current = false;
      if (requestAnimationRef.current) {
        if (typeof requestAnimationRef.current === 'number') {
          cancelAnimationFrame(requestAnimationRef.current);
        } else {
          clearTimeout(requestAnimationRef.current);
        }
        requestAnimationRef.current = null;
      }
    }
    
    return () => {
      // Cleanup animation frame on unmount or dependency change
      isDetectingRef.current = false;
      if (requestAnimationRef.current) {
        if (typeof requestAnimationRef.current === 'number') {
          cancelAnimationFrame(requestAnimationRef.current);
        } else {
          clearTimeout(requestAnimationRef.current);
        }
        requestAnimationRef.current = null;
      }
    };
  }, [cameraActive, model, detectPose, videoRef]);

  return {
    isDetecting: isDetectingRef.current
  };
};

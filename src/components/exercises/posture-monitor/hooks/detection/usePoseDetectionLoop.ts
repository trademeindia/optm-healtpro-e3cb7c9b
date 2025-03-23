
import { useCallback, useEffect, useRef, useState } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import type { DetectionStatus, UsePoseDetectionLoopProps } from './types';
import { useAdaptiveFrameRate } from './useAdaptiveFrameRate';
import { useDetectionFailureHandler } from './useDetectionFailureHandler';
import { useVideoReadyCheck } from './useVideoReadyCheck';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type { DetectionStatus };

export const usePoseDetectionLoop = ({
  model,
  cameraActive,
  videoRef,
  config,
  onPoseDetected,
  setFeedback,
  videoReady
}: UsePoseDetectionLoopProps) => {
  const [status, setStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    confidence: null,
    detectedKeypoints: 0,
    lastDetectionTime: 0
  });

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const framesRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);
  const stateRef = useRef({
    lastDetectionTime: Date.now(),
    detectionFailureCount: 0,
    consecutiveFailures: 0
  });

  // Use our utility hooks
  const { frameInterval, updateFrameRate } = useAdaptiveFrameRate(status, config);
  const { handleDetectionFailure } = useDetectionFailureHandler(stateRef, setFeedback);
  const { isVideoElementReady } = useVideoReadyCheck(videoRef);

  // Function to store session data in Supabase
  const storeSessionData = useCallback(async (pose: posenet.Pose) => {
    if (!pose || !pose.keypoints || pose.keypoints.length === 0) return;
    
    try {
      // Get the authenticated user, or use a demo ID format for testing
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || `demo-exercise-${Date.now()}`;
      
      // Calculate some meaningful angles from the keypoints
      // (simplified for this example)
      const angles = {
        leftShoulder: Math.random() * 180, // Replace with actual angle calculation
        rightShoulder: Math.random() * 180,
        leftElbow: Math.random() * 180,
        rightElbow: Math.random() * 180,
        leftKnee: Math.random() * 180,
        rightKnee: Math.random() * 180
      };
      
      // Store in Supabase
      const { error } = await supabase.from('exercise_sessions').insert({
        patient_id: userId,
        exercise_type: 'posture_check',
        angles,
        notes: `Confidence: ${pose.score?.toFixed(2) || 'unknown'}`
      });
      
      if (error) {
        console.error('Error storing session data:', error.message);
        // Only show toast for non-demo users to avoid spamming
        if (userId.includes('demo')) return;
        
        // Check if it's a UUID format error (common with demo IDs)
        if (error.message.includes('uuid')) {
          console.log('UUID format error with demo ID - expected in development');
        } else {
          toast.error('Failed to store exercise data');
        }
      }
    } catch (error) {
      console.error('Error in storeSessionData:', error);
    }
  }, []);

  // The detection loop
  const detectPose = useCallback(async (time: number) => {
    if (!cameraActive || !model || !videoRef.current || !isVideoElementReady(videoRef.current) || !videoReady) {
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }

    // Update frames counter
    framesRef.current += 1;

    // Calculate FPS every second
    if (time - lastFpsUpdateRef.current >= 1000) {
      setStatus(prev => ({
        ...prev,
        fps: framesRef.current,
      }));
      framesRef.current = 0;
      lastFpsUpdateRef.current = time;
    }

    // Only run detection based on frame interval for performance
    if (previousTimeRef.current && time - previousTimeRef.current < frameInterval) {
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }

    previousTimeRef.current = time;
    setStatus(prev => ({ ...prev, isDetecting: true }));

    try {
      // Detect pose
      const pose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true,
        ...config
      });

      // Update state references
      stateRef.current.lastDetectionTime = Date.now();
      stateRef.current.detectionFailureCount = 0;
      stateRef.current.consecutiveFailures = 0;

      // Count detected keypoints (those with reasonable confidence)
      const detectedKeypoints = pose.keypoints.filter(kp => kp.score > config.minPartConfidence).length;

      // Update status
      setStatus(prev => ({
        ...prev,
        isDetecting: false,
        confidence: pose.score,
        detectedKeypoints,
        lastDetectionTime: Date.now()
      }));

      // Call the onPoseDetected callback and store session data if needed
      if (pose.score > config.minPoseConfidence) {
        onPoseDetected(pose);
        
        // Store data periodically (e.g., every 30 seconds) to avoid too many DB writes
        const shouldStore = Date.now() - stateRef.current.lastDetectionTime > 30000;
        if (shouldStore) {
          storeSessionData(pose);
        }
      }

      // Update frame rate based on detection performance
      updateFrameRate(pose.score, config);
      
    } catch (error) {
      console.error('Error detecting pose:', error);
      handleDetectionFailure();
      setStatus(prev => ({ ...prev, isDetecting: false }));
    }

    // Continue the animation loop
    requestRef.current = requestAnimationFrame(detectPose);
  }, [
    cameraActive,
    model,
    videoRef,
    videoReady,
    frameInterval,
    config,
    onPoseDetected, 
    isVideoElementReady,
    updateFrameRate,
    handleDetectionFailure,
    storeSessionData
  ]);

  // Set up and clean up the animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(detectPose);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [detectPose]);

  return status;
};

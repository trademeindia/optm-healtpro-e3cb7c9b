import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import CameraView from './CameraView';
import PoseRenderer from './PoseRenderer';
import FeedbackDisplay from './FeedbackDisplay';
import { usePoseModel } from './usePoseModel';
import { useCamera } from './camera';
import { useSquatCounter } from './hooks/useSquatCounter';
import { useFeedbackState } from './hooks/useFeedbackState';
import { useSessionReset } from './hooks/useSessionReset';
import { usePermissionMonitor } from './hooks/usePermissionMonitor';
import { useAutoStartCamera } from './hooks/useAutoStartCamera';
import { useVideoStatusMonitor } from './hooks/useVideoStatusMonitor';
import { useDetectionStatusHandler } from './hooks/useDetectionStatusHandler';
import { DEFAULT_POSE_CONFIG } from './utils/poseDetectionConfig';
import { SquatState } from './types';

const PostureMonitor: React.FC = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Camera
  const { 
    cameraActive, 
    toggleCamera, 
    permission,
    cameraError,
    retryCamera,
    videoStatus,
    stopCamera
  } = useCamera();
  
  // Pose model
  const { model, isLoading: isModelLoading, error: modelError } = usePoseModel();
  
  // Detection status
  const { detectionStatus, setDetectionStatus } = useDetectionStatusHandler();
  
  // Squat State
  const [currentSquatState, setCurrentSquatState] = useState<SquatState>(SquatState.STANDING);
  const [prevSquatState, setPrevSquatState] = useState<SquatState>(SquatState.STANDING);
  
  // Squat Counter
  const { 
    stats,
    repComplete,
    evaluateSquat,
    resetMetrics
  } = useSquatCounter({
    currentSquatState,
    prevSquatState
  });
  
  // Feedback State
  const { 
    feedback, 
    setFeedback, 
    setFeedbackType 
  } = useFeedbackState(isModelLoading, modelError);
  
  // Custom Feedback
  const [customFeedback, setCustomFeedback] = useState<{
    message: string | null;
    type: string;
  }>({
    message: null,
    type: 'info'
  });
  
  // Reset Session
  const { resetSession } = useSessionReset({
    resetMetrics,
    setCurrentSquatState,
    setPrevSquatState,
    setFeedback: (message, type) => setFeedback(message, type)
  });
  
  // Permission Monitor
  usePermissionMonitor({
    permission,
    setCustomFeedback
  });
  
  // Auto Start Camera
  useAutoStartCamera({
    cameraActive,
    permission,
    toggleCamera,
    setCustomFeedback
  });
  
  // Video Status Monitor
  useVideoStatusMonitor({
    cameraActive,
    videoStatus,
    setCustomFeedback
  });
  
  // Pose detection
  const detectPose = useCallback(async (net: posenet.PoseNet) => {
    if (
      videoRef.current &&
      cameraActive &&
      videoStatus.isReady &&
      !isModelLoading &&
      !modelError
    ) {
      try {
        setDetectionStatus({
          ...detectionStatus,
          isDetecting: true,
          lastDetectionTime: Date.now()
        });
        
        // Perform pose estimation
        const pose = await net.estimateSinglePose(videoRef.current, {
          flipHorizontal: false,
          decodingMethod: 'single-person'
        });
        
        // Evaluate squat and update state
        if (pose) {
          const {
            newSquatState,
            evaluation
          } = evaluateSquat(pose, prevSquatState);
          
          // Update squat state
          setPrevSquatState(currentSquatState);
          setCurrentSquatState(newSquatState);
          
          // Set feedback based on evaluation
          if (evaluation) {
            setFeedback(evaluation.feedback, evaluation.feedbackType);
          }
          
          setDetectionStatus({
            isDetecting: false,
            fps: detectionStatus.fps,
            confidence: pose.score,
            detectedKeypoints: pose.keypoints.length,
            lastDetectionTime: Date.now()
          });
        }
      } catch (error) {
        console.error("Pose estimation error:", error);
        setFeedback("Pose estimation failed. Please ensure you are well-lit and fully visible.", 'error');
        
        setDetectionStatus({
          ...detectionStatus,
          isDetecting: false
        });
      }
    } else {
      setDetectionStatus({
        ...detectionStatus,
        isDetecting: false
      });
    }
  }, [cameraActive, videoStatus, isModelLoading, modelError, evaluateSquat, prevSquatState, detectionStatus, setDetectionStatus, setFeedback]);
  
  // Detection loop
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (model && cameraActive && videoStatus.isReady) {
      intervalId = setInterval(() => {
        detectPose(model);
      }, 100);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [model, cameraActive, detectPose, videoStatus]);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
        <div className="relative aspect-video">
          <CameraView
            cameraActive={cameraActive}
            isModelLoading={isModelLoading}
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraError={cameraError}
            customFeedback={customFeedback}
            onRetryCamera={retryCamera}
            detectionStatus={detectionStatus}
          />
          
          <PoseRenderer
            pose={null}
            canvasRef={canvasRef}
            kneeAngle={null}
            hipAngle={null}
            currentSquatState={currentSquatState}
            config={DEFAULT_POSE_CONFIG}
          />
        </div>
        
        {/* Exercise Feedback and Stats */}
        <div className="p-4 bg-card">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-lg font-medium">
              Squat Tracker
              {detectionStatus.fps && <span className="text-xs text-muted-foreground ml-2">{detectionStatus.fps} FPS</span>}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                onClick={() => toggleCamera()}
                disabled={isModelLoading}
              >
                {cameraActive ? 'Stop Camera' : 'Start Camera'}
              </button>
              
              {cameraActive && (
                <button 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
                  onClick={retryCamera}
                >
                  Reset Camera
                </button>
              )}
              
              {cameraActive && (
                <button 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-4 py-2"
                  onClick={resetSession}
                >
                  Reset Session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <FeedbackDisplay 
        feedback={feedback} 
        stats={{
          totalReps: stats.reps,
          goodReps: stats.squats,
          badReps: 0,
          accuracy: 75
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
          <div className="p-4">
            <h3 className="text-lg font-medium">Session Stats</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <div className="text-sm text-muted-foreground">Reps</div>
                <div className="font-semibold">{stats.reps}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Good Squats</div>
                <div className="font-semibold text-green-500">{stats.squats}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Depth Accuracy</div>
                <div className="font-semibold">{stats.depthAccuracy}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Consistency</div>
                <div className="font-semibold">{stats.consistency}%</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
          <div className="p-4">
            <h3 className="text-lg font-medium">Real-time Feedback</h3>
            <div className="mt-2">
              <div className="text-sm text-muted-foreground">Current State</div>
              <div className="font-semibold">{currentSquatState}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureMonitor;

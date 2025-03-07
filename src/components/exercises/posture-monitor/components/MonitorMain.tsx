
import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { FeedbackType } from '../types';
import { useCamera } from '../useCamera';
import { usePoseDetection } from '../usePoseDetection';
import FeedbackDisplay from '../FeedbackDisplay';
import StatsDisplay from '../StatsDisplay';
import CameraView from '../CameraView';
import ControlButtons from '../ControlButtons';
import PoseRenderer from '../PoseRenderer';
import { PoseDetectionConfig } from '../poseDetectionTypes';
import { getOptimizedConfig } from '../utils/configUtils';

interface MonitorMainProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
  onShowTutorial: () => void;
  customConfig: PoseDetectionConfig | null;
}

const MonitorMain: React.FC<MonitorMainProps> = ({
  exerciseId,
  exerciseName,
  onFinish,
  onShowTutorial,
  customConfig,
}) => {
  // Use provided config or default
  const [config, setConfig] = useState<PoseDetectionConfig>(
    customConfig || getOptimizedConfig()
  );
  
  // Update config when props change
  useEffect(() => {
    if (customConfig) {
      setConfig(customConfig);
    }
  }, [customConfig]);
  
  // Initialize camera
  const { 
    cameraActive, 
    permission, 
    videoRef, 
    canvasRef, 
    streamRef, 
    toggleCamera, 
    stopCamera,
    cameraError
  } = useCamera({
    onCameraStart: () => {
      // Set initial feedback when camera starts
      setCustomFeedback({
        message: "Starting pose analysis... Stand in a clear space where your full body is visible.",
        type: FeedbackType.INFO
      });
    }
  });
  
  // Initialize pose detection with optimized config
  const {
    model,
    isModelLoading,
    pose,
    analysis,
    stats,
    feedback,
    resetSession,
    config: poseConfig
  } = usePoseDetection({
    cameraActive,
    videoRef,
    initialConfig: config
  });
  
  // Override feedback (e.g., for camera permission issues)
  const [customFeedback, setCustomFeedback] = useState<{ message: string | null, type: FeedbackType } | null>(null);
  
  // Update permission-related feedback
  useEffect(() => {
    if (permission === 'denied') {
      setCustomFeedback({
        message: "Camera access denied. Please check your browser permissions.",
        type: FeedbackType.WARNING
      });
    }
  }, [permission]);
  
  // Auto-start camera when component mounts with a slight delay
  useEffect(() => {
    // Give browser a moment to initialize
    const timer = setTimeout(() => {
      if (!cameraActive && permission !== 'denied') {
        toggleCamera().catch(err => {
          console.error("Failed to auto-start camera:", err);
          setCustomFeedback({
            message: "Failed to start camera automatically. Please try the Enable Camera button.",
            type: FeedbackType.WARNING
          });
        });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [cameraActive, permission, toggleCamera]);
  
  // Handle finishing the exercise
  const handleFinish = () => {
    stopCamera();
    onFinish();
  };
  
  // Determine which feedback to show (custom overrides from pose detection)
  const displayFeedback = customFeedback || feedback;
  
  return (
    <>
      {/* Camera display and pose overlay */}
      <CameraView 
        cameraActive={cameraActive}
        isModelLoading={isModelLoading}
        videoRef={videoRef}
        canvasRef={canvasRef}
        cameraError={cameraError}
      />
      
      {/* Render the pose skeleton on the canvas when pose is detected */}
      {pose && (
        <PoseRenderer
          pose={pose}
          canvasRef={canvasRef}
          kneeAngle={analysis.kneeAngle}
          hipAngle={analysis.hipAngle}
          currentSquatState={analysis.currentSquatState}
          config={poseConfig}
        />
      )}
      
      {/* Feedback display */}
      {displayFeedback?.message && (
        <FeedbackDisplay 
          feedback={displayFeedback.message}
          feedbackType={displayFeedback.type}
        />
      )}
      
      {/* Stats display */}
      <StatsDisplay 
        accuracy={stats.accuracy}
        reps={stats.reps}
        incorrectReps={stats.incorrectReps}
      />
      
      {/* Controls */}
      <ControlButtons 
        cameraActive={cameraActive}
        isModelLoading={isModelLoading}
        onToggleCamera={toggleCamera}
        onReset={resetSession}
        onShowTutorial={onShowTutorial}
        onFinish={handleFinish}
      />
      
      <div className="text-xs text-muted-foreground mt-2">
        <p className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>Your camera feed is processed locally and not stored or sent to any server.</span>
        </p>
      </div>
    </>
  );
};

export default MonitorMain;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { FeedbackType } from './types';
import { useCamera } from './camera';
import { usePoseDetection } from './usePoseDetection';
import FeedbackDisplay from './FeedbackDisplay';
import StatsDisplay from './StatsDisplay';
import TutorialDialog from './TutorialDialog';
import PoseRenderer from './PoseRenderer';
import CameraView from './CameraView';
import ControlButtons from './ControlButtons';

interface PostureMonitorProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

const PostureMonitor: React.FC<PostureMonitorProps> = ({
  exerciseId,
  exerciseName,
  onFinish,
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  
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
  
  // Initialize pose detection
  const {
    model,
    isModelLoading,
    pose,
    analysis,
    stats,
    feedback,
    resetSession,
    config
  } = usePoseDetection({
    cameraActive,
    videoRef
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
  
  // Auto-start camera when component mounts
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
  
  if (!exerciseId || !exerciseName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posture Monitor</CardTitle>
          <CardDescription>
            Select an exercise to start posture analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="text-center text-muted-foreground">
            <Info className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
            <p>Please select an exercise from the library to begin</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI Squat Analyzer: {exerciseName}</CardTitle>
          <CardDescription>
            AI-powered squat analysis with real-time feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              config={config}
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
            onShowTutorial={() => setShowTutorial(true)}
            onFinish={handleFinish}
          />
          
          <div className="text-xs text-muted-foreground mt-2">
            <p className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>Your camera feed is processed locally and not stored or sent to any server.</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Tutorial dialog */}
      <TutorialDialog 
        open={showTutorial} 
        onOpenChange={setShowTutorial} 
      />
    </>
  );
};

export default PostureMonitor;

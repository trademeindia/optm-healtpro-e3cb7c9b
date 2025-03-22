
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Play, Pause, RotateCcw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MotionTrackerProps, FeedbackType, ExerciseType } from './types';
import FeedbackDisplay from './FeedbackDisplay';
import StatsDisplay from './StatsDisplay';
import TutorialDialog from './TutorialDialog';
import CameraView from './CameraView';
import { useHumanDetection } from './hooks/useHumanDetection';
import { useCamera } from './hooks/useCamera';
import { useMotionAnalysis } from './hooks/useMotionAnalysis';

const MotionTracker: React.FC<MotionTrackerProps> = ({
  exerciseId,
  exerciseName,
  onFinish,
}) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // State
  const [showTutorial, setShowTutorial] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string | null, type: FeedbackType }>({
    message: "Start the camera to begin motion tracking.",
    type: FeedbackType.INFO
  });

  // Determine exercise type from exerciseName
  const getExerciseType = (): ExerciseType => {
    if (!exerciseName) return 'squat';
    
    const name = exerciseName.toLowerCase();
    if (name.includes('lunge')) return 'lunge';
    return 'squat'; // Default exercise type
  };

  // Custom hooks
  const handleFeedbackChange = (message: string | null, type: FeedbackType) => {
    setFeedback({ message, type });
  };

  const { stats, resetStats, analyzeMovement } = useMotionAnalysis({
    onFeedbackChange: handleFeedbackChange,
    exerciseType: getExerciseType()
  });

  const { cameraActive, toggleCamera, stopCamera } = useCamera({
    videoRef,
    onFeedbackChange: handleFeedbackChange,
    onCameraStart: () => console.log("Camera started"),
    onCameraStop: () => console.log("Camera stopped")
  });
  
  const { 
    isModelLoading, 
    humanRef, 
    lastDetection, 
    detectionStatus, 
    startDetection, 
    stopDetection 
  } = useHumanDetection({
    cameraActive: cameraActive,
    videoRef,
    canvasRef,
    onFeedbackChange: handleFeedbackChange
  });

  // Handle camera state changes
  useEffect(() => {
    if (cameraActive) {
      startDetection();
    } else {
      stopDetection();
    }
  }, [cameraActive]);

  // Analyze movement when we have new detection data
  useEffect(() => {
    if (lastDetection && cameraActive) {
      analyzeMovement(lastDetection);
    }
  }, [lastDetection, cameraActive, analyzeMovement]);

  // Reset session
  const resetSession = () => {
    resetStats();
    toast.info("Session has been reset");
  };

  // Handle finish button click
  const handleFinish = () => {
    stopCamera();
    onFinish();
  };

  // Log status for debugging
  useEffect(() => {
    console.log("Motion tracker state:", {
      cameraActive,
      detectionStatus,
      modelLoaded: !!humanRef.current,
      hasVideo: !!videoRef.current,
      hasCanvas: !!canvasRef.current
    });
  }, [cameraActive, detectionStatus]);

  // Display exercise selection if no exercise selected
  if (!exerciseId || !exerciseName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise Selection</CardTitle>
          <CardDescription>
            Please select an exercise from the list to start motion tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No exercise selected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Motion Tracker: {exerciseName}</CardTitle>
          <CardDescription>
            AI-powered motion tracking with real-time feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera display */}
          <CameraView 
            cameraActive={cameraActive}
            isModelLoading={isModelLoading}
            videoRef={videoRef}
            canvasRef={canvasRef}
            detectionStatus={detectionStatus}
          />
          
          {/* Feedback display */}
          {feedback.message && (
            <FeedbackDisplay 
              feedback={feedback.message}
              feedbackType={feedback.type}
            />
          )}
          
          {/* Stats display */}
          <StatsDisplay 
            accuracy={stats.accuracy}
            reps={stats.repetitions}
          />
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={cameraActive ? "destructive" : "default"}
              onClick={toggleCamera}
              disabled={isModelLoading}
              className="flex items-center gap-2"
            >
              {cameraActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetSession}
              disabled={isModelLoading || !cameraActive}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Session
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowTutorial(true)}
              className="flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              How to Use
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleFinish}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Finish
            </Button>
          </div>
          
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

export default MotionTracker;

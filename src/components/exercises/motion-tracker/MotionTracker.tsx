
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { toast } from 'sonner';
import { ExerciseType } from './types';

import { useCamera } from './hooks/useCamera';
import { useMoveNetModel } from './hooks/useMoveNetModel';
import { useExerciseAnalysis } from './hooks/useExerciseAnalysis';

import CameraView from './camera/CameraView';
import PoseRenderer from './PoseRenderer';
import FeedbackDisplay from './FeedbackDisplay';
import PerformanceMetrics from './PerformanceMetrics';
import SessionControls from './SessionControls';
import ExerciseSelector from './ExerciseSelector';
import TutorialDialog from './TutorialDialog';

interface MotionTrackerProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({
  exerciseId,
  exerciseName,
  onFinish
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>(ExerciseType.SQUAT);
  
  // Camera initialization
  const {
    videoRef,
    canvasRef,
    cameraActive,
    toggleCamera,
    cameraError,
    retryCamera
  } = useCamera({
    onCameraReady: () => {
      toast.success('Camera ready');
    }
  });
  
  // MoveNet AI model for pose estimation
  const {
    isModelLoading,
    modelError,
    modelLoadProgress,
    pose,
    startDetection,
    stopDetection
  } = useMoveNetModel();
  
  // Exercise analysis
  const {
    metrics,
    feedback,
    resetSession
  } = useExerciseAnalysis({
    pose,
    exerciseType: selectedExercise,
    isActive: sessionActive
  });
  
  // Start pose detection when camera is active
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      startDetection(videoRef.current);
    } else {
      stopDetection();
    }
    
    return () => {
      stopDetection();
    };
  }, [cameraActive, videoRef, startDetection, stopDetection]);
  
  // Handle session toggle
  const handleToggleSession = () => {
    setSessionActive(prev => !prev);
    
    if (!sessionActive) {
      toast.success(`Starting ${selectedExercise} exercise`);
      resetSession();
    }
  };
  
  // Handle exercise type change
  const handleExerciseChange = (type: ExerciseType) => {
    setSelectedExercise(type);
    resetSession();
    toast.info(`Switched to ${type} exercise`);
  };
  
  // Handle finish
  const handleFinish = () => {
    stopDetection();
    onFinish();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI Motion Tracker: {exerciseName || 'Exercise Session'}</CardTitle>
          <CardDescription>
            AI-powered movement analysis with real-time feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera view and pose overlay */}
          <CameraView 
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraActive={cameraActive}
            toggleCamera={toggleCamera}
            retryCamera={retryCamera}
            isModelLoading={isModelLoading}
            cameraError={cameraError || modelError}
            modelLoadProgress={modelLoadProgress}
          />
          
          {/* Render pose skeleton if a pose is detected */}
          {pose && (
            <PoseRenderer
              pose={pose}
              canvasRef={canvasRef}
              showSkeleton={true}
              showKeypoints={true}
            />
          )}
          
          {/* Exercise selector */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Select Exercise:</h3>
            <ExerciseSelector 
              selectedType={selectedExercise}
              onSelectType={handleExerciseChange}
            />
          </div>
          
          {/* Feedback display */}
          <FeedbackDisplay feedback={feedback} />
          
          {/* Performance metrics panel */}
          <PerformanceMetrics metrics={metrics} />
          
          {/* Session controls */}
          <SessionControls 
            cameraActive={cameraActive}
            sessionActive={sessionActive}
            isModelLoading={isModelLoading}
            onToggleCamera={toggleCamera}
            onToggleSession={handleToggleSession}
            onResetSession={resetSession}
            onHelp={() => setShowTutorial(true)}
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
        exerciseType={selectedExercise}
      />
    </>
  );
};

export default MotionTracker;

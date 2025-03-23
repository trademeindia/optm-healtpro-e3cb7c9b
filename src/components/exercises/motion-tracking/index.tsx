
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useHumanDetection } from './hooks/useHumanDetection';
import { useCamera } from './hooks/useCamera';
import { useTracking } from './hooks/useTracking';
import FeedbackDisplay from './FeedbackDisplay';
import BiomarkersDisplay from './BiomarkersDisplay';
import { FeedbackType } from '../posture-monitor/types';
import CameraView from './components/CameraView';
import ControlPanel from './components/ControlPanel';
import ExerciseInstructions from './components/ExerciseInstructions';
import ModelLoadingScreen from './components/ModelLoadingScreen';

interface MotionTrackerProps {
  exerciseId: string;
  exerciseName: string;
  onFinish?: () => void;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({ 
  exerciseId, 
  exerciseName,
  onFinish 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Human pose detection hook
  const { 
    startDetection, 
    stopDetection, 
    detectionResult,
    angles,
    motionState,
    feedback,
    stats,
    resetSession,
    biomarkers,
    isModelLoaded,
    isModelLoading,
    loadProgress,
    detectionError
  } = useHumanDetection(useRef<HTMLVideoElement>(null), canvasRef);

  // Camera hook
  const { 
    videoRef, 
    cameraActive, 
    startCamera, 
    stopCamera 
  } = useCamera(() => {
    stopDetection();
  });

  // Tracking hook
  const {
    isTracking,
    setIsTracking,
    toggleTracking,
    handleReset,
    cleanup,
  } = useTracking({
    startDetection,
    stopDetection,
    resetSession
  });

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      cleanup();
      stopCamera();
    };
  }, [cleanup, stopCamera]);

  // Handle model loading retry
  const handleRetryLoading = () => {
    window.location.reload();
  };

  // Handle session completion
  const handleFinish = () => {
    stopCamera();
    stopDetection();
    setIsTracking(false);
    
    toast.success(`Exercise session completed`, {
      description: `Great job! You completed ${stats.totalReps} reps with ${stats.accuracy}% accuracy.`
    });
    
    if (onFinish) onFinish();
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="bg-muted/30 p-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <span>{exerciseName} - Motion Analysis</span>
          </CardTitle>
        </CardHeader>
        
        {/* Conditional rendering based on model loading state */}
        {(isModelLoading || (!isModelLoaded && !detectionError)) ? (
          <CardContent className="p-6">
            <ModelLoadingScreen 
              isLoading={isModelLoading} 
              error={detectionError}
              onRetry={handleRetryLoading}
              loadProgress={loadProgress}
            />
          </CardContent>
        ) : detectionError && !isModelLoaded ? (
          <CardContent className="p-6">
            <ModelLoadingScreen 
              isLoading={false} 
              error={detectionError}
              onRetry={handleRetryLoading}
            />
          </CardContent>
        ) : (
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            isModelLoading={isModelLoading}
            cameraActive={cameraActive}
            isTracking={isTracking}
            detectionResult={detectionResult}
            angles={angles}
            onStartCamera={startCamera}
            onToggleTracking={toggleTracking}
            onReset={handleReset}
            onFinish={handleFinish}
          />
        )}
        
        <CardFooter className="p-0">
          <ControlPanel
            cameraActive={cameraActive}
            isTracking={isTracking}
            isModelLoaded={isModelLoaded}
            onToggleTracking={toggleTracking}
            onReset={handleReset}
            onFinish={handleFinish}
          />
        </CardFooter>
      </Card>
      
      {/* Feedback and stats display */}
      {cameraActive && (
        <FeedbackDisplay 
          feedback={feedback || { message: "Prepare to start exercise", type: FeedbackType.INFO }} 
          stats={stats} 
        />
      )}
      
      {/* Biomarkers display */}
      {cameraActive && (
        <BiomarkersDisplay 
          biomarkers={biomarkers} 
          angles={angles} 
        />
      )}
      
      {/* Instructions card */}
      <ExerciseInstructions />
    </div>
  );
};

export default MotionTracker;

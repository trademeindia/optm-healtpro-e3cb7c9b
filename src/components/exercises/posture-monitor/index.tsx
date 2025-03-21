
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { FeedbackType } from './types';
import { useCamera } from './camera';
import { usePoseDetection } from './usePoseDetection';
import { usePermissionMonitor } from './hooks/usePermissionMonitor';
import { useVideoStatusMonitor } from './hooks/useVideoStatusMonitor';
import { useAutoStartCamera } from './hooks/useAutoStartCamera';
import { useOpenSimAnalysis } from './hooks/useOpenSimAnalysis'; // Add OpenSim hook
import FeedbackDisplay from './FeedbackDisplay';
import StatsDisplay from './StatsDisplay';
import TutorialDialog from './TutorialDialog';
import PoseRenderer from './PoseRenderer';
import CameraView from './CameraView';
import ControlButtons from './ControlButtons';
import ExerciseSelectionView from './ExerciseSelectionView';
import BiomechanicalAnalysis from './BiomechanicalAnalysis'; // Import the new component
import type { CustomFeedback } from './hooks/types';

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
  const [showBiomechanics, setShowBiomechanics] = useState(false); // Toggle for biomechanical analysis
  
  // Initialize camera with enhanced detection
  const { 
    cameraActive, 
    permission, 
    videoRef, 
    canvasRef, 
    streamRef, 
    toggleCamera, 
    stopCamera,
    cameraError,
    retryCamera,
    videoStatus
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
    config,
    detectionStatus
  } = usePoseDetection({
    cameraActive,
    videoRef,
    videoReady: videoStatus.isReady
  });
  
  // Initialize OpenSim analysis
  const {
    analysisResult,
    isAnalyzing,
    analysisError
  } = useOpenSimAnalysis({
    pose,
    currentSquatState: analysis.currentSquatState,
    setFeedback: (message, type) => {
      // Only set feedback when biomechanics view is active
      if (showBiomechanics) {
        setCustomFeedback({
          message,
          type
        });
      }
    },
    modelParams: {
      height: 175, // Example values - in a real app, these would come from user profile
      weight: 70,
      age: 30,
      gender: 'male'
    }
  });
  
  // Override feedback (e.g., for camera permission issues)
  const [customFeedback, setCustomFeedback] = useState<CustomFeedback | null>(null);
  
  // Hook for permission monitoring
  usePermissionMonitor({
    permission,
    setCustomFeedback
  });
  
  // Hook for video status monitoring
  useVideoStatusMonitor({
    cameraActive,
    videoStatus,
    setCustomFeedback
  });
  
  // Hook for auto-starting camera
  useAutoStartCamera({
    cameraActive,
    permission,
    toggleCamera,
    setCustomFeedback
  });
  
  // Handle finishing the exercise
  const handleFinish = () => {
    stopCamera();
    onFinish();
  };
  
  // Toggle biomechanical analysis view
  const toggleBiomechanics = () => {
    setShowBiomechanics(prev => !prev);
  };
  
  // Determine which feedback to show (custom overrides from pose detection)
  const displayFeedback = customFeedback || feedback;
  
  if (!exerciseId || !exerciseName) {
    return <ExerciseSelectionView />;
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
            onRetryCamera={retryCamera}
            detectionStatus={{
              isDetecting: detectionStatus?.isDetecting || false,
              fps: detectionStatus?.fps || null,
              confidence: pose?.score || null
            }}
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
          
          {/* Togglable biomechanical analysis panel */}
          {showBiomechanics && (
            <BiomechanicalAnalysis 
              analysisResult={analysisResult}
              isAnalyzing={isAnalyzing}
              error={analysisError}
            />
          )}
          
          {/* Stats display */}
          <StatsDisplay 
            accuracy={stats.accuracy}
            reps={stats.reps}
            incorrectReps={stats.incorrectReps}
          />
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <ControlButtons 
              cameraActive={cameraActive}
              isModelLoading={isModelLoading}
              onToggleCamera={toggleCamera}
              onReset={resetSession}
              onShowTutorial={() => setShowTutorial(true)}
              onFinish={handleFinish}
            />
            
            {/* Add biomechanics toggle button */}
            <button
              onClick={toggleBiomechanics}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                showBiomechanics 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              disabled={isModelLoading || !cameraActive}
            >
              {showBiomechanics ? 'Hide Biomechanics' : 'Show Biomechanics'}
            </button>
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

export default PostureMonitor;

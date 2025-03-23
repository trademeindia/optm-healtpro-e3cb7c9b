import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { FeedbackType } from './types';
import { useCamera } from './camera';
import { usePoseDetection } from './usePoseDetection';
import { usePermissionMonitor } from './hooks/usePermissionMonitor';
import { useVideoStatusMonitor } from './hooks/useVideoStatusMonitor';
import { useAutoStartCamera } from './hooks/useAutoStartCamera';
import FeedbackDisplay from './FeedbackDisplay';
import StatsDisplay from './StatsDisplay';
import TutorialDialog from './TutorialDialog';
import PoseRenderer from './PoseRenderer';
import CameraView from './CameraView';
import ControlButtons from './ControlButtons';
import ExerciseSelectionView from './ExerciseSelectionView';
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
      setCustomFeedback({
        message: "Starting pose analysis... Stand in a clear space where your full body is visible.",
        type: FeedbackType.INFO
      });
    }
  });
  
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
  
  const [customFeedback, setCustomFeedback] = useState<CustomFeedback | null>(null);
  
  usePermissionMonitor({
    permission,
    setCustomFeedback
  });
  
  useVideoStatusMonitor({
    cameraActive,
    videoStatus,
    setCustomFeedback
  });
  
  useAutoStartCamera({
    cameraActive,
    permission,
    toggleCamera,
    setCustomFeedback
  });
  
  const handleFinish = () => {
    stopCamera();
    onFinish();
  };
  
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
          
          {displayFeedback?.message && (
            <FeedbackDisplay 
              feedback={displayFeedback.message}
              feedbackType={displayFeedback.type}
            />
          )}
          
          <StatsDisplay 
            accuracy={stats.accuracy}
            reps={stats.reps}
            incorrectReps={stats.incorrectReps}
          />
          
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
      
      <TutorialDialog 
        open={showTutorial} 
        onOpenChange={setShowTutorial} 
      />
    </>
  );
};

export default PostureMonitor;

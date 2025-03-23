
import React, { useEffect, useRef, useState } from 'react';
import { useCamera } from './camera';
import { usePoseDetection } from './usePoseDetection';
import { usePoseModel } from './usePoseModel';
import { DEFAULT_POSE_CONFIG } from './utils';
import { diagnoseDetectionIssues } from './utils/debug';
import CameraView from './CameraView';
import PoseRenderer from './PoseRenderer';
import FeedbackDisplay from './FeedbackDisplay';
import PoseDetectionStats from './PoseDetectionStats';
import PoseDetectionController from './PoseDetectionController';
import { Button } from '@/components/ui/button';
import { Play, Camera, RefreshCw } from 'lucide-react';

interface PostureMonitorProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish?: () => void;
}

const PostureMonitor: React.FC<PostureMonitorProps> = ({ 
  exerciseId, 
  exerciseName, 
  onFinish 
}) => {
  const [videoReady, setVideoReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Setup camera
  const { 
    cameraActive, 
    videoRef, 
    streamRef,
    toggleCamera, 
    stopCamera,
    cameraError,
    retryCamera,
    videoStatus 
  } = useCamera({ 
    onCameraStart: () => setVideoReady(true) 
  });
  
  // Setup pose detection
  const {
    model,
    isModelLoading,
    config,
    pose,
    analysis,
    stats,
    feedback,
    resetSession,
    detectionStatus
  } = usePoseDetection({
    cameraActive,
    videoRef,
    videoReady: videoReady && videoStatus.isReady
  });
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
  // Log diagnostics for debugging
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      const diagnosisInterval = setInterval(() => {
        const issues = diagnoseDetectionIssues(videoRef.current);
        if (issues) {
          console.warn('Detection issues:', issues);
        }
      }, 5000);
      
      return () => clearInterval(diagnosisInterval);
    }
  }, [cameraActive, videoRef]);
  
  // Handle exercise completion
  const handleFinishExercise = () => {
    stopCamera();
    resetSession();
    if (onFinish) onFinish();
  };
  
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
            onRetryCamera={retryCamera}
            detectionStatus={detectionStatus}
          />
          
          <PoseRenderer
            pose={pose}
            canvasRef={canvasRef}
            kneeAngle={analysis.kneeAngle}
            hipAngle={analysis.hipAngle}
            currentSquatState={analysis.currentSquatState}
            config={config}
          />
        </div>
        
        <div className="p-4 bg-card">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-lg font-medium">
              {exerciseName || 'Posture Monitor'}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant={cameraActive ? "outline" : "default"}
                onClick={() => toggleCamera()}
                className="gap-2"
              >
                <Camera className="h-4 w-4" />
                {cameraActive ? 'Stop Camera' : 'Start Camera'}
              </Button>
              
              {cameraActive && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={retryCamera}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              )}
              
              {cameraActive && onFinish && (
                <Button 
                  size="sm" 
                  variant="default" 
                  onClick={handleFinishExercise}
                  className="gap-2"
                >
                  <Play className="h-4 w-4" />
                  Finish Exercise
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <PoseDetectionController
        isModelLoading={isModelLoading}
        modelError={cameraError || null}
        cameraActive={cameraActive}
        feedback={feedback}
        detectionStatus={detectionStatus}
      />
      
      <FeedbackDisplay 
        feedback={feedback} 
        stats={stats}
      />
      
      {cameraActive && detectionStatus && (
        <PoseDetectionStats 
          stats={stats}
          detectionStatus={detectionStatus}
        />
      )}
    </div>
  );
};

export default PostureMonitor;

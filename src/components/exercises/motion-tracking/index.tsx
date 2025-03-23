
import React, { useEffect, useRef, useState } from 'react';
import { useCamera } from '../posture-monitor/camera';
import { useHumanDetection } from './useHumanDetection';
import CameraView from '../posture-monitor/CameraView';
import MotionRenderer from './MotionRenderer';
import FeedbackDisplay from './FeedbackDisplay';
import BiomarkersDisplay from './BiomarkersDisplay';
import { Button } from '@/components/ui/button';
import { Play, Camera, RefreshCw } from 'lucide-react';
import { human, warmupModel } from '@/lib/human';

interface MotionTrackerProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish?: () => void;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({ 
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
  
  // Setup Human.js detection
  const {
    isModelLoaded,
    detectionFps,
    result,
    angles,
    biomarkers,
    currentMotionState,
    feedback,
    stats,
    resetSession,
    detectionError
  } = useHumanDetection({
    videoRef,
    exerciseType: exerciseName || 'exercise',
    videoReady: videoReady && videoStatus.isReady
  });
  
  // Warm up the model
  useEffect(() => {
    warmupModel();
  }, []);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
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
            isModelLoading={!isModelLoaded}
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraError={cameraError || detectionError}
            onRetryCamera={retryCamera}
            detectionStatus={{
              isDetecting: cameraActive && isModelLoaded,
              fps: detectionFps || 0,
              confidence: result?.body?.[0]?.score || null,
              lastDetectionTime: Date.now()
            }}
          />
          
          <MotionRenderer
            result={result}
            canvasRef={canvasRef}
            angles={angles}
          />
        </div>
        
        <div className="p-4 bg-card">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-lg font-medium">
              {exerciseName || 'Motion Tracker'}
              {detectionFps && <span className="text-xs text-muted-foreground ml-2">{detectionFps} FPS</span>}
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
      
      <FeedbackDisplay 
        feedback={feedback} 
        stats={stats}
      />
      
      {cameraActive && isModelLoaded && (
        <BiomarkersDisplay 
          biomarkers={biomarkers}
          angles={angles}
        />
      )}
    </div>
  );
};

export default MotionTracker;

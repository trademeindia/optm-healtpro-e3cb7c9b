import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { ExerciseInstructions } from './components/ExerciseInstructions';
import { CameraView } from './components/CameraView';
import { MotionRenderer } from './components/MotionRenderer';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { ControlPanel } from './components/ControlPanel';
import { BiomarkersDisplay } from './components/BiomarkersDisplay';
import { ModelLoadingState } from './components/ModelLoadingState';
import { ModelErrorState } from './components/ModelErrorState';
import { useHumanDetection } from './hooks/useHumanDetection';
import { useCameraManager } from './hooks/useCameraManager';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DetectionError, DetectionErrorType } from '@/lib/human/types';
import { BodyAngles, MotionState, MotionStats } from '@/components/exercises/posture-monitor/types';
import * as Human from '@vladmandic/human';

interface ModelLoadingStateProps {
  loadingProgress?: number;
}

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onToggleFullscreen?: () => void;
}

interface MotionRendererProps {
  result: Human.Result | null;
  angles: BodyAngles;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

interface FeedbackDisplayProps {
  feedback: any;
  stats: MotionStats;
}

interface ControlPanelProps {
  cameraActive: boolean;
  detectionFps: number | null;
  isModelLoaded: boolean;
  isDetecting: boolean;
  motionState: MotionState;
  stats: MotionStats;
  onCameraToggle: () => void;
  onReset: () => void;
}

interface BiomarkersDisplayProps {
  biomarkers: Record<string, any>;
  angles: BodyAngles;
}

const MotionTracking: React.FC = () => {
  const { cameraActive, videoRef, startCamera, stopCamera } = useCameraManager();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  const {
    isDetecting,
    detectionFps,
    isModelLoaded,
    detectionError,
    result,
    angles,
    biomarkers,
    motionState,
    feedback,
    stats,
    startDetection,
    stopDetection,
    resetSession
  } = useHumanDetection(videoRef, canvasRef);

  const handleCameraToggle = async () => {
    if (cameraActive) {
      stopCamera();
      stopDetection();
    } else {
      const success = await startCamera();
      if (success) {
        startDetection();
      }
    }
  };

  const handleReset = () => {
    resetSession();
  };

  const handleRetry = () => {
    if (detectionError) {
      toast.info("Retrying detection...");
      startDetection();
    }
  };

  useEffect(() => {
    return () => {
      stopDetection();
      stopCamera();
    };
  }, [stopDetection, stopCamera]);

  if (!isModelLoaded) {
    return <ModelLoadingState loadingProgress={0} />;
  }

  if (detectionError && detectionError.type === 'MODEL_LOADING' && !isModelLoaded) {
    return <ModelErrorState loadingError={detectionError} />;
  }

  return (
    <MotionDetectionErrorBoundary onRetry={handleRetry}>
      <div className="relative w-full max-w-screen-xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className={`relative ${showFullscreen ? 'fixed inset-0 z-50 p-4 bg-background' : 'w-full lg:w-2/3'}`}>
            <div className="relative rounded-lg overflow-hidden aspect-video bg-muted border">
              <CameraView
                videoRef={videoRef}
                canvasRef={canvasRef}
                onToggleFullscreen={() => setShowFullscreen(!showFullscreen)}
              />
              
              {cameraActive && result && (
                <MotionRenderer
                  result={result}
                  angles={angles}
                  canvasRef={canvasRef}
                  motionState={motionState}
                />
              )}
              
              {detectionError && detectionError.type !== 'MODEL_LOADING' && (
                <DetectionErrorDisplay
                  error={detectionError}
                  onRetry={handleRetry}
                />
              )}
              
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                  <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Camera is off</h3>
                  <p className="mb-4 text-muted-foreground text-center max-w-md">
                    Turn on the camera to start motion detection and exercise tracking
                  </p>
                  <button
                    onClick={handleCameraToggle}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                  >
                    Turn On Camera
                  </button>
                </div>
              )}
            </div>
            
            {cameraActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <FeedbackDisplay feedback={feedback} stats={stats} />
              </motion.div>
            )}
          </div>
          
          {!showFullscreen && (
            <div className="w-full lg:w-1/3 space-y-4">
              <ControlPanel
                isDetecting={isDetecting}
                isModelLoaded={isModelLoaded}
                cameraActive={cameraActive}
                detectionFps={detectionFps}
                motionState={motionState}
                stats={stats}
                onCameraToggle={handleCameraToggle}
                onReset={handleReset}
              />
              
              {cameraActive && Object.keys(biomarkers).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BiomarkersDisplay biomarkers={biomarkers} angles={angles} />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </MotionDetectionErrorBoundary>
  );
};

export default MotionTracking;

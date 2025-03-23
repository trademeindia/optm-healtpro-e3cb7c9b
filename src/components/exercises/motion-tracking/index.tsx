
import React, { useEffect, useState } from 'react';
import { AlertCircle, Camera, Headphones, RefreshCw } from 'lucide-react';
import CameraView from './components/CameraView';
import ModelLoadingState from './components/ModelLoadingState';
import ModelErrorState from './components/ModelErrorState';
import ControlPanel from './components/ControlPanel';
import FeedbackDisplay from './FeedbackDisplay';
import MotionRenderer from './MotionRenderer';
import BiomarkersDisplay from './BiomarkersDisplay';
import DetectionErrorDisplay from './components/DetectionErrorDisplay';
import MotionDetectionErrorBoundary from './components/MotionDetectionErrorBoundary';
import { useHumanDetection } from './hooks/useHumanDetection';
import { useCameraManager } from './hooks/useCameraManager';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DetectionError } from '@/lib/human/types';

const MotionTracking: React.FC = () => {
  const { cameraActive, videoRef, startCamera, stopCamera } = useCameraManager();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  // Initialize human detection
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

  // Handle camera start/stop
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

  // Handle session reset
  const handleReset = () => {
    resetSession();
  };

  // Handle retry after error
  const handleRetry = () => {
    if (detectionError) {
      toast.info("Retrying detection...");
      startDetection();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
      stopCamera();
    };
  }, [stopDetection, stopCamera]);

  // Render loading state
  if (!isModelLoaded) {
    return <ModelLoadingState />;
  }

  // Render error state for model loading errors
  if (detectionError && detectionError.type === 'MODEL_LOADING' && !isModelLoaded) {
    return <ModelErrorState loadingError={detectionError} />;
  }

  return (
    <MotionDetectionErrorBoundary onRetry={handleRetry}>
      <div className="relative w-full max-w-screen-xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Camera view */}
          <div className={`relative ${showFullscreen ? 'fixed inset-0 z-50 p-4 bg-background' : 'w-full lg:w-2/3'}`}>
            <div className="relative rounded-lg overflow-hidden aspect-video bg-muted border">
              <CameraView
                videoRef={videoRef}
                canvasRef={canvasRef}
                showFullscreen={showFullscreen}
                onToggleFullscreen={() => setShowFullscreen(!showFullscreen)}
              />
              
              {/* Detection overlay */}
              {cameraActive && result && (
                <MotionRenderer
                  detectionResult={result}
                  angles={angles}
                  canvasRef={canvasRef}
                  motionState={motionState}
                />
              )}
              
              {/* Error display */}
              {detectionError && detectionError.type !== 'MODEL_LOADING' && (
                <DetectionErrorDisplay
                  error={detectionError}
                  onRetry={handleRetry}
                />
              )}
              
              {/* Camera inactive state */}
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
            
            {/* Feedback display */}
            {cameraActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <FeedbackDisplay feedback={feedback} />
              </motion.div>
            )}
          </div>
          
          {/* Controls and stats */}
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
              
              {/* Biomarkers display */}
              {cameraActive && Object.keys(biomarkers).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BiomarkersDisplay biomarkers={biomarkers} />
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

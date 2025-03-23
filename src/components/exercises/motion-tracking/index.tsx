
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useHumanDetection } from './hooks/useHumanDetection';
import FeedbackDisplay from './FeedbackDisplay';
import BiomarkersDisplay from './BiomarkersDisplay';
import { FeedbackType } from '../posture-monitor/types';
import { warmupModel } from '@/lib/human/core';
import CameraView from './components/CameraView';
import ControlPanel from './components/ControlPanel';
import ExerciseInstructions from './components/ExerciseInstructions';
import MotionDetectionErrorBoundary from './components/MotionDetectionErrorBoundary';
import ErrorBoundary from '@/components/ErrorBoundary';
import ModelLoadingState from './components/ModelLoadingState';
import ModelErrorState from './components/ModelErrorState';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    isModelLoaded
  } = useHumanDetection(videoRef, canvasRef);

  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true);
      setLoadingError(null);
      
      // Show progress simulation
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress > 95) {
          clearInterval(progressInterval);
        } else {
          setLoadingProgress(progress);
        }
      }, 500);
      
      // Set a timeout to show warning if loading takes too long
      loadingTimeoutRef.current = setTimeout(() => {
        toast.warning("Model loading is taking longer than expected. Please wait...");
      }, 8000);
      
      try {
        await warmupModel();
        setIsModelLoading(false);
        setLoadingProgress(100);
        clearInterval(progressInterval);
        toast.success("Motion analysis model loaded");
        
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      } catch (error) {
        console.error("Failed to load motion analysis model:", error);
        setLoadingError("Failed to load motion analysis model. Please refresh and try again.");
        setIsModelLoading(false);
        clearInterval(progressInterval);
        
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        toast.error("Failed to load motion analysis model", {
          description: "Please try refreshing the page or check your connection",
          action: {
            label: "Retry",
            onClick: () => loadModel()
          }
        });
      }
    };

    loadModel();

    // Cleanup when component unmounts
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      stopCamera();
      stopDetection();
    };
  }, [stopDetection]);

  // Handle camera activation
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      if (isModelLoading) {
        toast.warning("Please wait for the model to finish loading");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play()
            .then(() => {
              setCameraActive(true);
              toast.success("Camera activated");
            })
            .catch(err => {
              console.error("Error playing video:", err);
              toast.error("Could not start video stream");
            });
        }
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera", {
        description: "Please ensure camera permissions are granted to this site",
        duration: 5000
      });
    }
  };

  // Handle camera deactivation
  const stopCamera = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCameraActive(false);
    stopDetection();
    setIsTracking(false);
  };

  // Toggle motion tracking
  const toggleTracking = () => {
    if (isTracking) {
      stopDetection();
      setIsTracking(false);
      toast.info("Motion tracking paused");
    } else {
      startDetection();
      setIsTracking(true);
      toast.success("Motion tracking active");
    }
  };

  // Reset session data
  const handleReset = () => {
    resetSession();
    toast.info("Session reset");
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
    <ErrorBoundary>
      <div className="space-y-4">
        <Card className="overflow-hidden shadow-md">
          <CardHeader className="bg-muted/30 p-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span>{exerciseName} - Motion Analysis</span>
            </CardTitle>
          </CardHeader>
          
          {isModelLoading ? (
            <ModelLoadingState loadingProgress={loadingProgress} />
          ) : loadingError ? (
            <ModelErrorState loadingError={loadingError} />
          ) : (
            <MotionDetectionErrorBoundary onReset={handleReset}>
              <CameraView
                videoRef={videoRef}
                canvasRef={canvasRef}
                isModelLoading={false}
                cameraActive={cameraActive}
                isTracking={isTracking}
                detectionResult={detectionResult}
                angles={angles}
                onStartCamera={startCamera}
                onToggleTracking={toggleTracking}
                onReset={handleReset}
                onFinish={handleFinish}
              />
            </MotionDetectionErrorBoundary>
          )}
          
          <CardFooter className="p-0">
            <ControlPanel
              cameraActive={cameraActive}
              isTracking={isTracking}
              onToggleTracking={toggleTracking}
              onReset={handleReset}
              onFinish={handleFinish}
            />
          </CardFooter>
        </Card>
        
        {/* Feedback and stats display */}
        <FeedbackDisplay 
          feedback={feedback || { message: "Prepare to start exercise", type: FeedbackType.INFO }} 
          stats={stats} 
        />
        
        {/* Biomarkers display */}
        <BiomarkersDisplay 
          biomarkers={biomarkers} 
          angles={angles} 
        />
        
        {/* Instructions card */}
        <ExerciseInstructions />
      </div>
    </ErrorBoundary>
  );
};

export default MotionTracker;

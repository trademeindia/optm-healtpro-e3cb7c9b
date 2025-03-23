
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasVideoError, setHasVideoError] = useState(false);

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
  } = useHumanDetection(videoRef, canvasRef);

  // Load model on component mount with improved error handling
  useEffect(() => {
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
      
      // Set up error handling
      videoRef.current.onerror = (e) => {
        console.error("Video error:", e);
        setHasVideoError(true);
        toast.error("Error with video stream");
      };
      
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play()
            .then(() => {
              setCameraActive(true);
              setHasVideoError(false);
              toast.success("Camera activated");
              
              // Set explicit dimensions to ensure rendering
              if (canvasRef.current && videoRef.current.videoWidth > 0) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
              }
            })
            .catch(err => {
              console.error("Error playing video:", err);
              setHasVideoError(true);
              toast.error("Could not start video stream");
            });
        }
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasVideoError(true);
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
  
  // Handle model loading retry
  const handleRetryLoading = () => {
    window.location.reload();
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

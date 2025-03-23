
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pause, Play, RefreshCw, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { useHumanDetection } from './hooks/useHumanDetection';
import FeedbackDisplay from './FeedbackDisplay';
import MotionRenderer from './MotionRenderer';
import BiomarkersDisplay from './BiomarkersDisplay';
import { FeedbackType } from '../posture-monitor/types';
import { warmupModel } from '@/lib/human/core';

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
    biomarkers
  } = useHumanDetection(videoRef, canvasRef);

  // Load model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        await warmupModel();
        setIsModelLoading(false);
        toast.success("Motion analysis model loaded");
      } catch (error) {
        console.error("Failed to load motion analysis model:", error);
        toast.error("Failed to load motion analysis model");
      }
    };

    loadModel();

    // Cleanup when component unmounts
    return () => {
      stopCamera();
      stopDetection();
    };
  }, [stopDetection]);

  // Handle camera activation
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      toast.success("Camera activated");
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera");
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
    <div className="space-y-4">
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="bg-muted/30 p-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <span>{exerciseName} - Motion Analysis</span>
          </CardTitle>
        </CardHeader>
        
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {/* Hidden video for capture */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover" 
            style={{ display: cameraActive ? 'block' : 'none' }}
            onLoadedData={() => {
              if (videoRef.current?.readyState === 4) {
                toast.success("Camera feed ready");
              }
            }}
          />
          
          {/* Canvas for rendering */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10"
            style={{ display: cameraActive ? 'block' : 'none' }}
          />
          
          {/* Renderer component */}
          {detectionResult && (
            <MotionRenderer 
              result={detectionResult} 
              canvasRef={canvasRef} 
              angles={angles}
            />
          )}
          
          {/* Camera inactive state */}
          {!cameraActive && (
            <div className="text-center p-8 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-muted/20">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Camera Access Required</h3>
              <p className="text-muted-foreground text-sm mb-4">
                To analyze your movement patterns, we need access to your camera. 
                Your privacy is important - video is processed locally and not stored.
              </p>
              <Button 
                onClick={startCamera} 
                className="w-full"
                disabled={isModelLoading}
              >
                {isModelLoading ? "Loading motion analysis model..." : "Start Camera"}
              </Button>
            </div>
          )}
        </div>
        
        <CardFooter className="flex justify-between p-4 bg-card border-t">
          <div className="flex gap-2">
            {cameraActive && (
              <Button
                variant={isTracking ? "outline" : "default"}
                size="sm"
                onClick={toggleTracking}
                disabled={!cameraActive}
                className="gap-2"
              >
                {isTracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isTracking ? "Pause Tracking" : "Start Tracking"}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!cameraActive}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleFinish}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            End Session
          </Button>
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
      <Card className="p-4 shadow-sm">
        <h3 className="font-medium text-lg mb-3">Exercise Instructions</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <span className="font-semibold">1</span>
            </div>
            <div>
              <h4 className="font-medium">Position Yourself</h4>
              <p className="text-sm text-muted-foreground">
                Stand 5-6 feet away from your camera so your entire body is visible.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <span className="font-semibold">2</span>
            </div>
            <div>
              <h4 className="font-medium">Perform the Exercise</h4>
              <p className="text-sm text-muted-foreground">
                Perform squats with proper form. Keep your back straight and knees aligned with toes.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <span className="font-semibold">3</span>
            </div>
            <div>
              <h4 className="font-medium">Follow Feedback</h4>
              <p className="text-sm text-muted-foreground">
                Watch the real-time feedback and adjust your form based on the recommendations.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MotionTracker;

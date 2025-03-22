
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Camera, Info, Pause, Play, RotateCcw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FeedbackType } from './posture-monitor/types';
import { useCamera } from './posture-monitor/camera';
import ErrorBoundary from '../ErrorBoundary';

interface PostureMonitorProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

const PostureMonitor: React.FC<PostureMonitorProps> = (props) => {
  const { exerciseId, exerciseName, onFinish } = props;
  const [showTutorial, setShowTutorial] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string | null; type: FeedbackType }>({
    message: "Start the camera to begin motion tracking.",
    type: FeedbackType.INFO
  });
  const [stats, setStats] = useState({ accuracy: 0, reps: 0 });

  // Initialize camera with simplified approach
  const { 
    cameraActive, 
    videoRef, 
    canvasRef, 
    toggleCamera, 
    stopCamera,
    cameraError,
    retryCamera,
    isInitializing
  } = useCamera({
    onCameraStart: () => {
      setFeedback({
        message: "Camera started. Position yourself to begin exercise tracking.",
        type: FeedbackType.SUCCESS
      });
    },
    onCameraStop: () => {
      setFeedback({
        message: "Camera stopped. Start the camera to begin tracking.",
        type: FeedbackType.INFO
      });
    },
    onCameraError: (error) => {
      setFeedback({
        message: error,
        type: FeedbackType.ERROR
      });
    },
    onFeedbackChange: (message, type) => {
      if (message) {
        setFeedback({
          message,
          type: type as FeedbackType
        });
      }
    }
  });

  // Log component mounting and props
  useEffect(() => {
    console.log("PostureMonitor mounted with props:", {
      exerciseId,
      exerciseName
    });

    // Show toast when an exercise is selected
    if (exerciseId && exerciseName) {
      toast.info(`Starting ${exerciseName}`, {
        description: "Prepare for your guided workout session"
      });
    }

    // Clean up on unmount
    return () => {
      stopCamera();
    };
  }, [exerciseId, exerciseName, stopCamera]);

  const resetSession = () => {
    setStats({ accuracy: 0, reps: 0 });
    toast.info("Session has been reset");
  };

  const handleFinish = () => {
    stopCamera();
    onFinish();
  };

  // Display exercise selection if no exercise selected
  if (!exerciseId || !exerciseName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise Selection</CardTitle>
          <CardDescription>
            Please select an exercise from the list to start motion tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No exercise selected.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please go back and select an exercise from the list.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Motion Tracker: {exerciseName}</CardTitle>
          <CardDescription>
            AI-powered motion tracking with real-time feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera display */}
          <div className="relative w-full">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {isInitializing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
                  <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  <p className="text-white text-sm mt-2">Initializing camera...</p>
                </div>
              )}
              
              {!cameraActive && !isInitializing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 z-20">
                  <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Click "Start Camera" to begin motion tracking</p>
                </div>
              )}
              
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-30">
                  <AlertCircle className="h-12 w-12 text-destructive mb-2" />
                  <p className="text-white text-sm text-center mb-4 max-w-xs">{cameraError}</p>
                  <Button variant="secondary" onClick={retryCamera}>
                    Retry Camera
                  </Button>
                </div>
              )}
              
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover"
                style={{ 
                  transform: 'scaleX(-1)', // Mirror the video
                  display: 'block'
                }} 
                playsInline 
                muted
                autoPlay
              />
              
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full object-cover z-10"
                style={{ 
                  transform: 'scaleX(-1)', // Mirror the canvas
                  display: 'block'
                }} 
              />
            </div>
          </div>
          
          {/* Feedback display */}
          {feedback.message && (
            <div className={`p-4 rounded-md border ${
              feedback.type === FeedbackType.ERROR ? 'bg-destructive/10 border-destructive text-destructive' :
              feedback.type === FeedbackType.WARNING ? 'bg-warning/10 border-warning text-warning' :
              feedback.type === FeedbackType.SUCCESS ? 'bg-success/10 border-success text-success' :
              'bg-primary/10 border-primary text-primary'
            }`}>
              <p>{feedback.message}</p>
            </div>
          )}
          
          {/* Stats display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-md p-4 text-center">
              <p className="text-2xl font-bold">{stats.reps}</p>
              <p className="text-sm text-muted-foreground">Repetitions</p>
            </div>
            <div className="bg-muted rounded-md p-4 text-center">
              <p className="text-2xl font-bold">{stats.accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={cameraActive ? "destructive" : "default"}
              onClick={toggleCamera}
              disabled={isInitializing}
              className="flex items-center gap-2"
            >
              {cameraActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetSession}
              disabled={isInitializing || !cameraActive}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Session
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleFinish}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Finish
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            <p className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>Your camera feed is processed locally and not stored or sent to any server.</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default PostureMonitor;

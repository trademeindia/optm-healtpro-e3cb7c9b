
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, CameraOff, Check, Info } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'info' | 'warning' | 'success'>('info');
  const [accuracy, setAccuracy] = useState(0);
  const [reps, setReps] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Simulated posture analysis - in real implementation, this would use a ML model
  useEffect(() => {
    if (!cameraActive || !exerciseId) return;
    
    // Mock analysis logic - would be replaced with actual ML-based posture analysis
    const analysisPeriod = 3000; // every 3 seconds
    const analysisInterval = setInterval(() => {
      // Simulating different feedback types randomly for demo purposes
      const randomValue = Math.random();
      if (randomValue > 0.7) {
        setFeedback("Great form! Keep going!");
        setFeedbackType('success');
        setAccuracy(prev => Math.min(prev + 5, 100));
      } else if (randomValue > 0.4) {
        setFeedback("Try to keep your back straight");
        setFeedbackType('warning');
        setAccuracy(prev => Math.max(prev - 2, 50));
      } else {
        setFeedback("Bend your knees more");
        setFeedbackType('warning');
        setAccuracy(prev => Math.max(prev - 2, 50));
      }
      
      // Randomly increment reps
      if (randomValue > 0.8) {
        setReps(prev => prev + 1);
      }
    }, analysisPeriod);
    
    return () => clearInterval(analysisInterval);
  }, [cameraActive, exerciseId]);
  
  const toggleCamera = async () => {
    if (cameraActive) {
      // Turn off camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      return;
    }
    
    try {
      // Request camera permission and turn on camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraActive(true);
      setPermission('granted');
      setFeedback("Starting posture analysis...");
      setFeedbackType('info');
      setAccuracy(75); // Starting value
      setReps(0);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermission('denied');
      setFeedback("Camera access denied. Please check your browser permissions.");
      setFeedbackType('warning');
    }
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const handleFinish = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    onFinish();
  };
  
  const getFeedbackColor = () => {
    switch (feedbackType) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };
  
  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case 'success': return <Check className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  if (!exerciseId || !exerciseName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posture Monitor</CardTitle>
          <CardDescription>
            Select an exercise to start posture analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="text-center text-muted-foreground">
            <Info className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
            <p>Please select an exercise from the library to begin</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posture Monitor: {exerciseName}</CardTitle>
        <CardDescription>
          AI-powered posture analysis and real-time feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center p-4">
                <Camera className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
                <p className="text-sm">Camera is currently inactive</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Enable camera access to receive posture feedback
                </p>
              </div>
            </div>
          )}
        </div>
        
        {feedback && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${getFeedbackColor()}`}>
            {getFeedbackIcon()}
            <span>{feedback}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Posture Accuracy</p>
            <Progress value={accuracy} className="h-2" />
            <p className="text-xs text-right mt-1 text-muted-foreground">{accuracy}%</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Repetitions</p>
            <div className="text-2xl font-bold">{reps}</div>
            <p className="text-xs text-muted-foreground">Completed reps</p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={toggleCamera} 
            variant={cameraActive ? "destructive" : "default"}
            className="gap-2 flex-1"
          >
            {cameraActive ? (
              <>
                <CameraOff className="h-4 w-4" />
                <span>Stop Camera</span>
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                <span>Start Camera</span>
              </>
            )}
          </Button>
          <Button onClick={handleFinish} variant="outline" className="gap-2 flex-1">
            <Check className="h-4 w-4" />
            <span>Finish Session</span>
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
  );
};

export default PostureMonitor;

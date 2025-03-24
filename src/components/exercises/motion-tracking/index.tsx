
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, BarChart, Camera, Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useHumanDetection } from './hooks/useHumanDetection';
import { extractBiomarkers } from '@/lib/human/biomarkers';
import CameraView from './components/CameraView';
import ControlPanel from './components/ControlPanel';
import ExerciseInstructions from './components/ExerciseInstructions';
import FeedbackDisplay from './FeedbackDisplay';
import MotionRenderer from './MotionRenderer';
import BiomarkersDisplay from './BiomarkersDisplay';
import { FeedbackType } from '@/lib/human/types';
import '@/styles/motion-tracker.css';

interface MotionTrackerProps {
  exerciseId: string;
  exerciseName: string;
  onFinish?: () => void;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({ exerciseId, exerciseName, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  
  const {
    isDetecting,
    detectionFps,
    isModelLoaded,
    detectionError,
    result,
    angles,
    feedback,
    stats,
    startDetection,
    stopDetection,
    resetSession
  } = useHumanDetection(videoRef, canvasRef);
  
  const biomarkers = result ? extractBiomarkers(result, angles) : {};
  
  const handleCameraStart = () => {
    setIsCameraReady(true);
    setLastSync(new Date());
    console.log('Camera is ready for tracking');
  };
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading Human.js model for tracking');
      } catch (error) {
        console.error('Failed to load model:', error);
        toast.error('Failed to load AI model. Please refresh and try again.');
      }
    };
    
    loadModel();
    
    return () => {
      stopDetection();
    };
  }, []);
  
  const handleFinish = () => {
    stopDetection();
    if (onFinish) {
      onFinish();
    }
  };

  const formatTimeSinceSync = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffMins > 0) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffSecs} sec${diffSecs !== 1 ? 's' : ''} ago`;
    }
  };
  
  const handleSync = () => {
    setLastSync(new Date());
    toast.success("Motion tracking data synced successfully");
  };
  
  return (
    <div className="motion-tracker-container rounded-xl border border-border/60 shadow-md">
      <div className="motion-tracker-header py-4 px-6 flex items-center justify-between bg-card/80 border-b border-border/60">
        <div>
          <h2 className="text-xl font-semibold text-primary">{exerciseName}</h2>
          <p className="text-sm text-muted-foreground">
            Position yourself in front of the camera for analysis
          </p>
        </div>
        
        {isModelLoaded && (
          <div className="ai-status ready px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>AI Ready</span>
            {detectionFps && <span className="ml-1.5 opacity-80">({Math.round(detectionFps)} FPS)</span>}
          </div>
        )}
        
        {!isModelLoaded && (
          <div className="ai-status loading px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Loading AI...</span>
          </div>
        )}
      </div>
      
      <div className="motion-tracker-grid p-6 gap-6">
        <div className="space-y-5">
          <Card className="overflow-hidden border border-border/60 shadow-sm">
            <CardHeader className="p-4 bg-card/60 border-b flex items-center justify-between">
              <CardTitle className="text-lg">Camera View</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="camera-container">
                <CameraView 
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  detectionStatus={{ isDetecting }}
                  onCameraStart={handleCameraStart}
                  isTracking={isDetecting}
                />
                <MotionRenderer
                  result={result}
                  canvasRef={canvasRef}
                  angles={angles}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button 
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 h-12 text-base"
              disabled={!isModelLoaded || !isCameraReady || isDetecting}
              onClick={startDetection}
            >
              <Play className="h-5 w-5" />
              Start Tracking
            </Button>
            
            <Button 
              variant={isDetecting ? "destructive" : "outline"} 
              className="w-full flex items-center justify-center gap-2 h-12 text-base"
              disabled={!isDetecting}
              onClick={isDetecting ? stopDetection : resetSession}
            >
              {isDetecting ? (
                <>
                  <Pause className="h-5 w-5" />
                  Stop Tracking
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Reset Session
                </>
              )}
            </Button>
          </div>
          
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-base">Biomechanical Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="biomarker-grid gap-4">
                <div className="biomarker-card rounded-lg">
                  <div className="biomarker-header">Knee Angle</div>
                  <div className="biomarker-value">{angles.kneeAngle !== null ? Math.round(angles.kneeAngle) : '--'}°</div>
                </div>
                
                <div className="biomarker-card rounded-lg">
                  <div className="biomarker-header">Hip Angle</div>
                  <div className="biomarker-value">{angles.hipAngle !== null ? Math.round(angles.hipAngle) : '--'}°</div>
                </div>
                
                <div className="biomarker-card rounded-lg">
                  <div className="biomarker-header">Ankle Angle</div>
                  <div className="biomarker-value">{angles.ankleAngle !== null ? Math.round(angles.ankleAngle) : '--'}°</div>
                </div>
                
                <div className="biomarker-card rounded-lg">
                  <div className="biomarker-header">Shoulder Angle</div>
                  <div className="biomarker-value">{angles.shoulderAngle !== null ? Math.round(angles.shoulderAngle) : '--'}°</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/40">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  {biomarkers.balance !== undefined && (
                    <div className="biomarker-card rounded-lg">
                      <div className="biomarker-header">Balance</div>
                      <div className="biomarker-value">{Math.round(biomarkers.balance * 100)}%</div>
                    </div>
                  )}
                  
                  {biomarkers.symmetry !== undefined && (
                    <div className="biomarker-card rounded-lg">
                      <div className="biomarker-header">Symmetry</div>
                      <div className="biomarker-value">{Math.round(biomarkers.symmetry * 100)}%</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-5">
          <Card className="border border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-4 border-b bg-card/60">
              <CardTitle className="text-lg">Exercise Feedback</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {feedback.message && (
                <div className={`p-4 rounded-lg mb-4 flex items-start gap-3 ${
                  feedback.type === FeedbackType.SUCCESS ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400" :
                  feedback.type === FeedbackType.WARNING ? "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400" :
                  feedback.type === FeedbackType.ERROR ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400" :
                  "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                }`}>
                  {feedback.type === FeedbackType.SUCCESS && <CheckCircle className="h-5 w-5 mt-0.5" />}
                  {feedback.type === FeedbackType.WARNING && <AlertCircle className="h-5 w-5 mt-0.5" />}
                  {feedback.type === FeedbackType.ERROR && <AlertCircle className="h-5 w-5 mt-0.5" />}
                  {feedback.type === FeedbackType.INFO && <Camera className="h-5 w-5 mt-0.5" />}
                  <span className="text-base">{feedback.message}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-muted/50 p-3 rounded-md flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Reps</div>
                  <div className="font-semibold text-lg">{stats.totalReps || 0}</div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Good</div>
                  <div className="font-semibold text-lg text-green-500">{stats.goodReps || 0}</div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Needs Work</div>
                  <div className="font-semibold text-lg text-orange-500">{stats.badReps || 0}</div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                  <div className="font-semibold text-lg">{stats.accuracy || 0}%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 p-3 rounded-md flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Current Streak</div>
                  <div className="font-semibold text-lg">
                    {stats.currentStreak || 0} reps
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">Best Streak</div>
                  <div className="font-semibold text-lg">
                    {stats.bestStreak || 0} reps
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-base">Exercise Instructions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">1</div>
                  <p className="text-sm">Position yourself in front of the camera so your full body is visible.</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">2</div>
                  <p className="text-sm">Stand with your feet shoulder-width apart and arms at your sides.</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">3</div>
                  <p className="text-sm">Slowly bend your knees and lower your body as if sitting in a chair.</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">4</div>
                  <p className="text-sm">Keep your back straight and chest up throughout the movement.</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">5</div>
                  <p className="text-sm">Push through your heels to return to the starting position.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MotionTracker;

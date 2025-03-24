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
    <div className="motion-tracker-container">
      <div className="motion-tracker-header">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">{exerciseName}</h2>
          <p className="text-xs text-muted-foreground">
            Last synced: {formatTimeSinceSync()}
          </p>
        </div>
        
        {isModelLoaded && (
          <div className="ai-status ready">
            <CheckCircle className="h-4 w-4" />
            <span>AI Ready</span>
            {detectionFps && <span className="ml-1.5 opacity-80">({Math.round(detectionFps)} FPS)</span>}
          </div>
        )}
        
        {!isModelLoaded && (
          <div className="ai-status loading">
            <AlertCircle className="h-4 w-4" />
            <span>Loading AI...</span>
          </div>
        )}
      </div>
      
      <div className="motion-tracker-grid">
        <div className="space-y-4">
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
          
          <div className="control-buttons">
            {!isDetecting ? (
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!isModelLoaded || !isCameraReady}
                onClick={startDetection}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Tracking
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={stopDetection}
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop Tracking
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={resetSession}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleSync}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Sync Data
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Body Measurements</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="biomarker-grid">
                {angles.kneeAngle !== null && (
                  <div className="biomarker-card">
                    <div className="biomarker-header">Knee Angle</div>
                    <div className="biomarker-value">{Math.round(angles.kneeAngle)}°</div>
                  </div>
                )}
                
                {angles.hipAngle !== null && (
                  <div className="biomarker-card">
                    <div className="biomarker-header">Hip Angle</div>
                    <div className="biomarker-value">{Math.round(angles.hipAngle)}°</div>
                  </div>
                )}
                
                {angles.shoulderAngle !== null && (
                  <div className="biomarker-card">
                    <div className="biomarker-header">Shoulder Angle</div>
                    <div className="biomarker-value">{Math.round(angles.shoulderAngle)}°</div>
                  </div>
                )}
                
                {biomarkers.postureScore !== undefined && (
                  <div className="biomarker-card">
                    <div className="biomarker-header">Posture Score</div>
                    <div className="biomarker-value">{Math.round(biomarkers.postureScore)}%</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="feedback-panel">
            <div className="feedback-header">
              <h3 className="font-medium">Real-time Feedback</h3>
            </div>
            <div className="feedback-content">
              {feedback.message && (
                <div className={`status-message ${feedback.type?.toLowerCase() || 'info'}`}>
                  {feedback.type === FeedbackType.SUCCESS && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {feedback.type === FeedbackType.WARNING && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                  {feedback.type === FeedbackType.ERROR && <AlertCircle className="h-5 w-5 text-red-500" />}
                  {feedback.type === FeedbackType.INFO && <Camera className="h-5 w-5 text-blue-500" />}
                  <span>{feedback.message}</span>
                </div>
              )}
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalReps || 0}</div>
                  <div className="stat-label">Total Reps</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value text-green-500">{stats.goodReps || 0}</div>
                  <div className="stat-label">Good Form</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value text-amber-500">{stats.badReps || 0}</div>
                  <div className="stat-label">Needs Work</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{stats.accuracy || 0}%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="stat-card">
                  <div className="stat-value">{stats.currentStreak || 0}</div>
                  <div className="stat-label">Current Streak</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{stats.bestStreak || 0}</div>
                  <div className="stat-label">Best Streak</div>
                </div>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Exercise Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">1</div>
                  <p>Position yourself in front of the camera so your full body is visible.</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">2</div>
                  <p>Maintain proper form throughout the exercise.</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">3</div>
                  <p>Follow the real-time feedback to adjust your form.</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">4</div>
                  <p>Complete the recommended repetitions with good form.</p>
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

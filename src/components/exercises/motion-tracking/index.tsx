
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Activity, PlayCircle, StopCircle, RefreshCw } from 'lucide-react';
import CameraView from './components/CameraView';
import ControlPanel from './components/ControlPanel';
import FeedbackDisplay from './components/FeedbackDisplay';
import BiomarkersDisplay from './components/BiomarkersDisplay';
import { useHumanDetection, FeedbackType } from './hooks/useHumanDetection';

interface MotionTrackerProps {
  exerciseId?: string;
  exerciseName?: string;
  onFinish?: () => void;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({ exerciseId, exerciseName, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isAIReady, setIsAIReady] = useState(false);
  const [feedback, setFeedback] = useState({ type: FeedbackType.INFO as FeedbackType, message: 'Start the camera to begin tracking' });
  const [biomarkers, setBiomarkers] = useState({
    postureScore: 0,
    movementQuality: 0,
    rangeOfMotion: 0,
    stabilityScore: 0
  });
  const [stats, setStats] = useState({
    fps: 0,
    detections: 0,
    accuracy: 0
  });

  // Initialize human detection service
  const { 
    isModelLoaded,
    isDetecting,
    detectionStatus,
    startDetection, 
    stopDetection, 
    resetSession,
    feedback: detectionFeedback,
    biomarkers: detectionBiomarkers,
    detectionStats 
  } = useHumanDetection(videoRef, canvasRef);

  // Set AI ready state based on model loading
  useEffect(() => {
    setIsAIReady(isModelLoaded);
  }, [isModelLoaded]);

  // Set tracking state based on detection status
  useEffect(() => {
    setIsTracking(isDetecting);
  }, [isDetecting]);

  // Update feedback from detection
  useEffect(() => {
    if (detectionFeedback && detectionFeedback.message) {
      setFeedback(detectionFeedback);
    }
  }, [detectionFeedback]);

  // Update biomarkers from detection
  useEffect(() => {
    if (detectionBiomarkers) {
      setBiomarkers(prev => ({
        ...prev,
        postureScore: detectionBiomarkers.postureScore || prev.postureScore,
        movementQuality: detectionBiomarkers.movementQuality || prev.movementQuality,
        rangeOfMotion: detectionBiomarkers.rangeOfMotion || prev.rangeOfMotion,
        stabilityScore: detectionBiomarkers.stabilityScore || prev.stabilityScore
      }));
    }
  }, [detectionBiomarkers]);

  // Update stats from detection
  useEffect(() => {
    if (detectionStats) {
      setStats({
        fps: Math.round(detectionStats.fps || 0),
        detections: detectionStats.detections || 0,
        accuracy: Math.round(detectionStats.accuracy || 0)
      });
    }
  }, [detectionStats]);

  // Start camera handler
  const handleCameraStart = useCallback(() => {
    console.log('Camera started, initializing detection...');
    startDetection();
  }, [startDetection]);

  // Reset tracking handler
  const handleReset = useCallback(() => {
    resetSession();
    setBiomarkers({
      postureScore: 0,
      movementQuality: 0,
      rangeOfMotion: 0,
      stabilityScore: 0
    });
    setFeedback({ type: FeedbackType.INFO, message: 'Tracking reset' });
  }, [resetSession]);

  // Stop tracking handler
  const handleStopTracking = useCallback(() => {
    stopDetection();
    setFeedback({ type: FeedbackType.INFO, message: 'Tracking stopped' });
  }, [stopDetection]);

  // Get feedback style based on type
  const getFeedbackStyle = (type: FeedbackType) => {
    switch (type) {
      case FeedbackType.SUCCESS:
        return 'bg-green-50 border-green-200 text-green-800';
      case FeedbackType.WARNING:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case FeedbackType.ERROR:
        return 'bg-red-50 border-red-200 text-red-800';
      case FeedbackType.INFO:
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="motion-tracker-container rounded-lg border shadow-sm bg-card">
      <header className="motion-tracker-header px-6 py-4 border-b">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">Motion Tracking</h2>
          <p className="text-sm text-muted-foreground">
            {exerciseName ? `Tracking: ${exerciseName}` : 'Real-time posture and movement analysis'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`ai-status ${isAIReady ? 'ready' : 'loading'} px-3 py-1`}>
            <span className={`h-2 w-2 rounded-full ${isAIReady ? 'bg-green-500' : 'bg-yellow-500'} mr-2 inline-block`}></span>
            {isAIReady ? 'AI Ready' : 'Loading AI...'}
          </div>
          
          {isTracking && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleStopTracking}
              className="flex items-center gap-1.5"
            >
              <StopCircle className="h-4 w-4" />
              Stop
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </header>
      
      <div className="motion-tracker-grid px-6 py-6">
        <div>
          <CameraView 
            videoRef={videoRef}
            canvasRef={canvasRef}
            detectionStatus={detectionStatus}
            onCameraStart={handleCameraStart}
            isTracking={isTracking}
          />
          
          <div className="mt-4">
            <FeedbackDisplay 
              message={feedback.message}
              type={feedback.type}
              className={`p-3 border rounded-md ${getFeedbackStyle(feedback.type)}`}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Tracking Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">FPS</p>
                  <p className="text-2xl font-bold">{stats.fps}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold">{stats.accuracy}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Detections</p>
                  <p className="text-2xl font-bold">{stats.detections}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <BiomarkersDisplay biomarkers={biomarkers} />
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Exercise Instructions</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <ol className="space-y-3 pl-5 list-decimal">
                <li className="text-sm">Stand 6-8 feet back from your camera so your full body is visible</li>
                <li className="text-sm">Maintain good lighting so the camera can clearly see you</li>
                <li className="text-sm">Perform movements slowly and with control for best tracking</li>
                <li className="text-sm">Wear form-fitting clothing to improve tracking accuracy</li>
              </ol>
            </CardContent>
          </Card>
          
          <ControlPanel 
            isTracking={isTracking}
            isModelLoaded={isAIReady}
            onStartTracking={handleCameraStart}
            onStopTracking={handleStopTracking}
            onResetSession={handleReset}
          />
          
          {onFinish && (
            <Button 
              onClick={onFinish} 
              className="w-full mt-4"
              variant="secondary"
            >
              Finish Session
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotionTracker;


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Activity, PlayCircle, StopCircle, RefreshCw, Check, Info } from 'lucide-react';
import CameraView from './components/CameraView';
import ControlPanel from './components/ControlPanel';
import FeedbackDisplay from './components/FeedbackDisplay';
import BiomarkersDisplay from './components/BiomarkersDisplay';
import { useHumanDetection } from './hooks/useHumanDetection';
import { FeedbackType as UtilsFeedbackType } from './utils/feedbackUtils';

// Map the human FeedbackType to feedbackUtils FeedbackType for compatibility
const mapFeedbackTypeToUtils = (type: string): UtilsFeedbackType => {
  switch(type) {
    case 'success':
      return UtilsFeedbackType.SUCCESS;
    case 'warning':
      return UtilsFeedbackType.WARNING;
    case 'error':
      return UtilsFeedbackType.ERROR;
    case 'info':
    default:
      return UtilsFeedbackType.INFO;
  }
};

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
  const [feedback, setFeedback] = useState({ 
    type: UtilsFeedbackType.INFO, 
    message: 'Start the camera to begin tracking' 
  });
  const [biomarkers, setBiomarkers] = useState({
    postureScore: 0,
    movementQuality: 0,
    rangeOfMotion: 0,
    stabilityScore: 0
  });
  const [stats, setStats] = useState({
    fps: 0,
    detections: 0,
    accuracy: 0,
    reps: 0,
    goodReps: 0,
    needsWork: 0,
    currentStreak: 0,
    bestStreak: 0
  });

  // Initialize human detection service
  const { 
    isModelLoaded,
    isDetecting,
    detectionFps,
    startDetection, 
    stopDetection, 
    resetSession,
    feedback: detectionFeedback,
    biomarkers: detectionBiomarkers,
    stats: detectionStats 
  } = useHumanDetection(videoRef, canvasRef);

  // Create detectionStatus object from available props
  const detectionStatus = {
    isDetecting,
    fps: detectionFps || 0,
    confidence: 0, // Default value
    detectedKeypoints: 0 // Default value
  };

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
      setFeedback({
        message: detectionFeedback.message,
        // Map the feedback type to make it compatible
        type: mapFeedbackTypeToUtils(detectionFeedback.type)
      });
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
      setStats(prev => ({
        ...prev,
        fps: Math.round(detectionFps || 0),
        accuracy: Math.round((detectionStats.accuracy || 0) * 100),
        reps: detectionStats.totalReps || 0,
        goodReps: detectionStats.goodReps || 0,
        needsWork: detectionStats.badReps || 0,
        currentStreak: detectionStats.currentStreak || 0,
        bestStreak: detectionStats.bestStreak || 0
      }));
    }
  }, [detectionFps, detectionStats]);

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
    setStats(prev => ({
      ...prev,
      reps: 0,
      goodReps: 0,
      needsWork: 0,
      currentStreak: 0
    }));
    setFeedback({ type: UtilsFeedbackType.INFO, message: 'Tracking reset' });
  }, [resetSession]);

  // Stop tracking handler
  const handleStopTracking = useCallback(() => {
    stopDetection();
    setFeedback({ type: UtilsFeedbackType.INFO, message: 'Tracking stopped' });
  }, [stopDetection]);

  // Get feedback style based on type
  const getFeedbackStyle = (type: UtilsFeedbackType) => {
    switch (type) {
      case UtilsFeedbackType.SUCCESS:
        return 'bg-green-50 border-green-200 text-green-800';
      case UtilsFeedbackType.WARNING:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case UtilsFeedbackType.ERROR:
        return 'bg-red-50 border-red-200 text-red-800';
      case UtilsFeedbackType.INFO:
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="motion-tracker-container rounded-lg border shadow-sm bg-card">
      <header className="motion-tracker-header px-6 py-4 border-b flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">Motion Tracking</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {exerciseName ? `Tracking: ${exerciseName}` : 'Position yourself in front of the camera for analysis'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`ai-status flex items-center ${isAIReady ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} px-3 py-1 rounded-full text-sm font-medium`}>
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
      
      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="text-lg font-medium">
                {exerciseName || "Basic Squat Technique"} Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CameraView 
                videoRef={videoRef}
                canvasRef={canvasRef}
                detectionStatus={detectionStatus}
                onCameraStart={handleCameraStart}
                isTracking={isTracking}
              />
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <FeedbackDisplay 
              message={feedback.message}
              type={feedback.type}
              className={`p-4 border rounded-md ${getFeedbackStyle(feedback.type)}`}
            />
          </div>
          
          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center text-lg font-medium">
                <Activity className="h-5 w-5 text-primary mr-2" />
                Biomechanical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Knee Angle</div>
                  <div className="text-xl font-semibold">{biomarkers.postureScore ? Math.round(biomarkers.postureScore) + '°' : '--'}</div>
                </div>
                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Hip Angle</div>
                  <div className="text-xl font-semibold">{biomarkers.movementQuality ? Math.round(biomarkers.movementQuality) + '°' : '--'}</div>
                </div>
                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Ankle Angle</div>
                  <div className="text-xl font-semibold">{biomarkers.rangeOfMotion ? Math.round(biomarkers.rangeOfMotion) + '°' : '--'}</div>
                </div>
                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Shoulder Angle</div>
                  <div className="text-xl font-semibold">{biomarkers.stabilityScore ? Math.round(biomarkers.stabilityScore) + '°' : '--'}</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Performance Metrics
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="text-lg font-medium">Exercise Feedback</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center mb-4 bg-blue-50 p-3 rounded-md">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <span className="text-blue-700">Ready for exercise. Maintain good posture.</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Reps</div>
                  <div className="text-2xl font-bold">{stats.reps}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Good</div>
                  <div className="text-2xl font-bold text-green-600">{stats.goodReps}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Needs Work</div>
                  <div className="text-2xl font-bold text-amber-600">{stats.needsWork}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-sm text-muted-foreground mb-1">Current Streak</div>
                  <div className="text-xl font-semibold">{stats.currentStreak} reps</div>
                </div>
                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-sm text-muted-foreground mb-1">Best Streak</div>
                  <div className="text-xl font-semibold">{stats.bestStreak} reps</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-sm font-medium text-muted-foreground mb-1">Accuracy</div>
                <div className="text-2xl font-bold">{stats.accuracy}%</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="text-lg font-medium">Exercise Instructions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Basic Squat Technique</h3>
              <ol className="space-y-3 pl-8 list-decimal">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Stand with feet shoulder-width apart</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Keep your back straight and chest up</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Lower your body by bending knees and hips</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Keep knees aligned with toes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Return to starting position by extending knees and hips</span>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleCameraStart} 
              disabled={!isModelLoaded || isTracking}
              className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <PlayCircle className="h-5 w-5" />
              Start Tracking
            </Button>
            
            <Button 
              onClick={handleReset} 
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-2"
              size="lg"
            >
              <RefreshCw className="h-5 w-5" />
              Reset Session
            </Button>
          </div>
          
          {onFinish && (
            <Button 
              onClick={onFinish} 
              className="w-full h-12 mt-4"
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

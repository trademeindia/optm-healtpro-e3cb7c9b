
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useHumanDetection } from './hooks/useHumanDetection';
import ControlPanel from './components/ControlPanel';
import FeedbackDisplay from './components/FeedbackDisplay';
import MotionRenderer from './MotionRenderer';
import '../../styles/motion-tracker.css';

interface MotionTrackerProps {
  exerciseName?: string;
  exerciseId?: string;
  onFinish?: () => void;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({ exerciseName, exerciseId, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState('workout');
  
  // Use our human detection hook
  const {
    isDetecting,
    isModelLoaded,
    detectionFps,
    startDetection,
    stopDetection,
    resetSession,
    angles,
    feedback,
    stats,
    result,
    detectionStatus
  } = useHumanDetection(videoRef, canvasRef);
  
  // Stop detection when component unmounts
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);
  
  return (
    <div className="motion-tracker-container">
      <div className="motion-tracker-header">
        <div>
          <h2 className="text-xl font-semibold mb-1">Exercise Motion Tracking</h2>
          <p className="text-sm text-muted-foreground">Track your exercise form with AI-powered motion analysis</p>
        </div>
        
        <div className="ai-status flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${isModelLoaded ? 'bg-green-500' : 'bg-amber-500 loading-pulse'}`}></div>
          <span className="text-sm">
            {isModelLoaded 
              ? isDetecting 
                ? 'Tracking Active' 
                : 'Ready' 
              : 'Loading AI Model...'}
          </span>
          {detectionFps && isDetecting && (
            <span className="text-xs text-muted-foreground ml-2">({detectionFps} FPS)</span>
          )}
        </div>
      </div>
      
      <div className="camera-container bg-gray-900">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="camera-view"
        />
        <canvas 
          ref={canvasRef}
          className="tracking-canvas"
        />
        {result && (
          <MotionRenderer 
            result={result} 
            canvasRef={canvasRef} 
            angles={angles}
          />
        )}
      </div>
      
      <div className="motion-tracker-grid">
        <div className="motion-tracker-main">
          <Tabs defaultValue="workout" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workout" className="space-y-4">
              <Card>
                <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
                  <CardTitle className="text-lg font-medium">Session Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="stats-card">
                    <div className="stat-item">
                      <span className="stat-value">{stats.totalReps || 0}</span>
                      <span className="stat-label">Total Reps</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{stats.goodReps || 0}</span>
                      <span className="stat-label">Good Form</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{stats.badReps || 0}</span>
                      <span className="stat-label">Need Improvement</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{stats.caloriesBurned?.toFixed(0) || 0}</span>
                      <span className="stat-label">Calories</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {feedback && feedback.message && (
                <FeedbackDisplay 
                  message={feedback.message}
                  type={feedback.type}
                />
              )}
            </TabsContent>
            
            <TabsContent value="instructions">
              <Card>
                <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
                  <CardTitle className="text-lg font-medium">Exercise Instructions</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm mb-3">
                    For the best tracking results, please follow these guidelines:
                  </p>
                  <ol className="instruction-list">
                    <li>Position yourself so your full body is visible to the camera</li>
                    <li>Ensure you have good lighting and a clear background</li>
                    <li>Perform the exercise at a moderate pace</li>
                    <li>For squats, ensure proper form with back straight</li>
                    <li>Keep your knees aligned with your toes</li>
                    <li>Breathe steadily throughout the exercise</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="motion-tracker-sidebar">
          <ControlPanel
            isTracking={isDetecting}
            isModelLoaded={isModelLoaded}
            onStartTracking={startDetection}
            onStopTracking={stopDetection}
            onResetSession={resetSession}
          />
        </div>
      </div>
    </div>
  );
};

export default MotionTracker;

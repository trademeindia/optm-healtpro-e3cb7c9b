import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Camera, CameraOff, Play, Square, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { FeedbackType } from '@/lib/human/types';
import useSquatCounter from './hooks/useSquatCounter';
import useCamera from './hooks/useCamera';
import usePoseDetection from './hooks/usePoseDetection';
import PoseRenderer from './renderer/PoseRenderer';
import SquatGuide from './components/SquatGuide';
import FeedbackDisplay from './components/FeedbackDisplay';
import PoseDetectionController from './PoseDetectionController';
import { useAutoStartCamera } from './hooks/useAutoStartCamera';
import { usePermissionMonitor } from './hooks/usePermissionMonitor';
import { useVideoStatusMonitor } from './hooks/useVideoStatusMonitor';
import { useFeedbackState } from './hooks/useFeedbackState';
import type { CustomFeedback } from './hooks/types';

const PostureMonitor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for camera and detection
  const [activeTab, setActiveTab] = useState('workout');
  const [customFeedback, setCustomFeedback] = useState<CustomFeedback | null>(null);
  
  // Use our custom hooks
  const {
    cameraActive,
    toggleCamera,
    videoStatus,
    permission,
    retryCamera
  } = useCamera(videoRef);
  
  const {
    isModelLoading,
    modelError,
    pose,
    kneeAngle,
    hipAngle,
    shoulderAngle,
    currentSquatState,
    detectionStatus,
    startDetection,
    stopDetection,
    resetDetection
  } = usePoseDetection(videoRef, canvasRef, cameraActive);
  
  const {
    squatCount,
    goodSquats,
    badSquats,
    incrementSquatCount,
    resetCounter
  } = useSquatCounter();
  
  // Feedback state management
  const { feedback } = useFeedbackState(isModelLoading, modelError);
  
  // Monitor permission changes
  usePermissionMonitor({
    permission,
    setCustomFeedback
  });
  
  // Auto-start camera if permission is granted
  useAutoStartCamera({
    cameraActive,
    permission,
    toggleCamera,
    setCustomFeedback
  });
  
  // Monitor video status
  useVideoStatusMonitor({
    cameraActive,
    videoStatus,
    setCustomFeedback
  });
  
  // Reset everything
  const handleReset = useCallback(() => {
    resetCounter();
    resetDetection();
    toast.info("Session reset", {
      description: "Your workout session has been reset"
    });
  }, [resetCounter, resetDetection]);
  
  // Display the active feedback message
  const activeFeedback = customFeedback || feedback;
  
  return (
    <div className="posture-monitor">
      <div className="camera-container bg-gray-900 w-full h-96 md:h-[500px] relative overflow-hidden rounded-md">
        {!cameraActive ? (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <p className="mb-4 text-center max-w-md px-4">
              Position yourself so your full body is visible to the camera for posture analysis.
            </p>
            <Button 
              onClick={toggleCamera} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={permission === 'denied'}
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
            
            {permission === 'denied' && (
              <p className="mt-4 text-red-400 text-sm text-center max-w-md px-4">
                Camera access denied. Please enable camera permissions in your browser settings.
              </p>
            )}
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-contain z-10"
              playsInline 
              muted
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full z-20"
            />
            
            {!detectionStatus.isDetecting && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
                <Button 
                  onClick={startDetection} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isModelLoading || !videoStatus.isReady}
                >
                  {isModelLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Model...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Tracking
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="controls-container flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-b-md">
        <div className="flex items-center">
          {cameraActive ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleCamera}
              className="mr-2"
            >
              <CameraOff className="h-4 w-4 mr-1" />
              Stop Camera
            </Button>
          ) : null}
          
          {detectionStatus.isDetecting ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={stopDetection}
            >
              <Square className="h-4 w-4 mr-1" />
              Stop Tracking
            </Button>
          ) : null}
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>
      
      <PoseDetectionController
        isModelLoading={isModelLoading}
        modelError={modelError}
        cameraActive={cameraActive}
        feedback={activeFeedback}
        detectionStatus={detectionStatus}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2">
          <Tabs defaultValue="workout" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="guide">Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workout" className="space-y-4">
              <Card>
                <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
                  <CardTitle className="text-lg font-medium">Squat Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="stats-card grid grid-cols-3 gap-3 text-center">
                    <div className="stat-item bg-muted/50 p-3 rounded-md">
                      <span className="stat-value block font-semibold text-lg">{squatCount}</span>
                      <span className="stat-label block text-xs text-muted-foreground">Total Squats</span>
                    </div>
                    <div className="stat-item bg-muted/50 p-3 rounded-md">
                      <span className="stat-value block font-semibold text-lg text-green-500">{goodSquats}</span>
                      <span className="stat-label block text-xs text-muted-foreground">Good Form</span>
                    </div>
                    <div className="stat-item bg-muted/50 p-3 rounded-md">
                      <span className="stat-value block font-semibold text-lg text-amber-500">{badSquats}</span>
                      <span className="stat-label block text-xs text-muted-foreground">Needs Work</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <FeedbackDisplay 
                kneeAngle={kneeAngle}
                hipAngle={hipAngle}
                shoulderAngle={shoulderAngle}
                squatState={currentSquatState}
                customFeedback={activeFeedback}
              />
            </TabsContent>
            
            <TabsContent value="guide">
              <SquatGuide />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="text-lg font-medium">Angles</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Knee Angle:</span>
                  <span className="font-medium">{kneeAngle !== null ? `${Math.round(kneeAngle)}°` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hip Angle:</span>
                  <span className="font-medium">{hipAngle !== null ? `${Math.round(hipAngle)}°` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Shoulder Angle:</span>
                  <span className="font-medium">{shoulderAngle !== null ? `${Math.round(shoulderAngle)}°` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current State:</span>
                  <span className="font-medium capitalize">{currentSquatState}</span>
                </div>
                {detectionStatus.confidence !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Detection Confidence:</span>
                    <span className="font-medium">{Math.round(detectionStatus.confidence * 100)}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {!cameraActive && permission === 'denied' && (
            <Card className="mt-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <CardContent className="p-4">
                <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">Camera Access Required</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-3">
                  This feature requires camera access to analyze your posture during exercises.
                </p>
                <Button 
                  onClick={retryCamera} 
                  className="retry-button bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
                >
                  Retry Camera
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostureMonitor;


import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Play, Settings, Zap, StopCircle, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CameraView from './components/CameraView';
import ControlPanel from './components/ControlPanel';
import ExerciseInstructions from './components/ExerciseInstructions';
import FeedbackDisplay from './FeedbackDisplay';
import MotionRenderer from './MotionRenderer';
import { useHumanDetection } from './hooks/useHumanDetection';

interface MotionTrackerProps {
  exerciseId: string;
  exerciseName: string;
  onFinish?: () => void;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({ exerciseId, exerciseName, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
  
  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full motion-tracker-grid">
      <Card className="overflow-hidden h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Exercise Tracking</span>
            {isModelLoaded && (
              <div className="flex items-center text-sm font-normal">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span>Model Ready</span>
                {detectionFps && <span className="ml-2 text-muted-foreground">({Math.round(detectionFps)} FPS)</span>}
              </div>
            )}
            {!isModelLoaded && (
              <div className="flex items-center text-sm font-normal">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                <span>Loading Model...</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative exercise-camera-container">
          <div className="full-body-view">
            <CameraView 
              videoRef={videoRef} 
              canvasRef={canvasRef}
              detectionStatus={{ isDetecting }}
              errorMessage={detectionError}
            />
            
            <MotionRenderer 
              result={result} 
              canvasRef={canvasRef} 
              angles={angles}
            />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex justify-center space-x-2 control-buttons">
              {!isDetecting && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={startDetection} 
                        variant="default" 
                        className="bg-green-600 hover:bg-green-700 text-white control-button"
                        disabled={!isModelLoaded}
                      >
                        <Play className="h-4 w-4 mr-1 control-icon" />
                        Start Tracking
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start motion tracking</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {isDetecting && (
                <Button onClick={stopDetection} variant="destructive" className="control-button">
                  <StopCircle className="h-4 w-4 mr-1 control-icon" />
                  Stop Tracking
                </Button>
              )}
              
              <Button onClick={resetSession} variant="outline" className="control-button">
                <RefreshCw className="h-4 w-4 mr-1 control-icon" />
                Reset Session
              </Button>
              
              {onFinish && (
                <Button onClick={handleFinish} variant="secondary" className="control-button">
                  Finish Exercise
                </Button>
              )}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="control-button">
                      <Settings className="h-4 w-4 control-icon" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4 h-full flex flex-col">
        <FeedbackDisplay 
          feedback={feedback} 
          stats={stats}
        />
        
        <Card className="flex-grow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Exercise: {exerciseName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseInstructions exerciseName={exerciseId} />
          </CardContent>
        </Card>
        
        <ControlPanel 
          controls={{
            isDetecting,
            isModelLoaded,
            onStartDetection: startDetection,
            onStopDetection: stopDetection,
            onReset: resetSession
          }}
        />
      </div>
    </div>
  );
};

export default MotionTracker;

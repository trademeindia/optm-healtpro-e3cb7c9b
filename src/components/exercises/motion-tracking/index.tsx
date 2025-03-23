
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Play, Settings, Zap } from 'lucide-react';
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="overflow-hidden">
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
        <CardContent className="p-0 relative">
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
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex justify-center space-x-2">
              {!isDetecting && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={startDetection} 
                        variant="default" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!isModelLoaded}
                      >
                        <Play className="h-4 w-4 mr-1" />
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
                <Button onClick={stopDetection} variant="destructive">
                  Stop Tracking
                </Button>
              )}
              
              <Button onClick={resetSession} variant="outline">
                Reset Session
              </Button>
              
              {onFinish && (
                <Button onClick={handleFinish} variant="secondary">
                  Finish Exercise
                </Button>
              )}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
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
      
      <div className="space-y-4">
        <FeedbackDisplay 
          feedback={feedback} 
          stats={stats}
        />
        
        <Card>
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

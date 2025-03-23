
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, BarChart } from 'lucide-react';
import CameraView from './components/CameraView';
import ControlPanel from './components/ControlPanel';
import ExerciseInstructions from './components/ExerciseInstructions';
import FeedbackDisplay from './FeedbackDisplay';
import MotionRenderer from './MotionRenderer';
import BiomarkersDisplay from './BiomarkersDisplay';
import { useHumanDetection } from './hooks/useHumanDetection';
import { toast } from 'sonner';
import { extractBiomarkers } from '@/lib/human/biomarkers';

interface MotionTrackerProps {
  exerciseId: string;
  exerciseName: string;
  onFinish?: () => void;
}

const MotionTracker: React.FC<MotionTrackerProps> = ({ exerciseId, exerciseName, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
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
  
  // Calculate biomarkers from detection result
  const biomarkers = result ? extractBiomarkers(result, angles) : {};
  
  // Handle camera ready
  const handleCameraStart = () => {
    setIsCameraReady(true);
    console.log('Camera is ready for tracking');
  };
  
  // Auto-start model loading when component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        // The model loading is handled in useHumanDetection
        console.log('Loading Human.js model for tracking');
      } catch (error) {
        console.error('Failed to load model:', error);
        toast.error('Failed to load AI model. Please refresh and try again.');
      }
    };
    
    loadModel();
    
    // Cleanup function
    return () => {
      stopDetection();
    };
  }, []);
  
  // Handle finish exercise
  const handleFinish = () => {
    stopDetection();
    if (onFinish) {
      onFinish();
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full motion-tracker-grid">
      {/* Left column - Camera view and controls */}
      <div className="lg:col-span-7 space-y-5">
        <Card className="overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between border-b bg-card/60">
            <CardTitle className="text-lg font-semibold text-primary">{exerciseName} Tracking</CardTitle>
            {isModelLoaded && (
              <div className="flex items-center text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4 mr-1.5" />
                <span>AI Ready</span>
                {detectionFps && <span className="ml-1.5 opacity-70">({Math.round(detectionFps)} FPS)</span>}
              </div>
            )}
            {!isModelLoaded && (
              <div className="flex items-center text-sm font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full">
                <AlertCircle className="h-4 w-4 mr-1.5" />
                <span>Loading AI...</span>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-0 relative">
            <div className="aspect-video bg-muted/30">
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
        
        <ControlPanel
          isTracking={isDetecting}
          isModelLoaded={isModelLoaded && isCameraReady}
          onStartTracking={startDetection}
          onStopTracking={stopDetection}
          onResetSession={resetSession}
        />
        
        <BiomarkersDisplay 
          biomarkers={biomarkers} 
          angles={angles}
        />
      </div>
      
      {/* Right column - Feedback and instructions */}
      <div className="lg:col-span-5 space-y-5">
        <FeedbackDisplay 
          feedback={feedback} 
          stats={stats}
        />
        
        <ExerciseInstructions 
          exerciseName={exerciseName}
        />
      </div>
    </div>
  );
};

export default MotionTracker;

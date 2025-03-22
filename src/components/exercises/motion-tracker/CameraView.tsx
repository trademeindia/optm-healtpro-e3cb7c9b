
import React from 'react';
import { AlertCircle, Loader2, Play } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { HumanDetectionStatus } from './types';

interface CameraViewProps {
  cameraActive: boolean;
  isModelLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraError?: string | null;
  onRetryCamera?: () => void;
  detectionStatus: HumanDetectionStatus;
}

const CameraView: React.FC<CameraViewProps> = ({
  cameraActive,
  isModelLoading,
  videoRef,
  canvasRef,
  cameraError,
  onRetryCamera,
  detectionStatus
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-muted">
      {/* Camera not active placeholder */}
      {!cameraActive && !cameraError && (
        <div className="flex flex-col items-center justify-center h-[320px] text-muted-foreground">
          <Play className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-sm">Start the camera to begin motion tracking</p>
          {isModelLoading && (
            <div className="mt-4 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading AI model...</span>
            </div>
          )}
        </div>
      )}
      
      {/* Camera error message */}
      {cameraError && (
        <div className="flex flex-col items-center justify-center h-[320px] px-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
          
          {onRetryCamera && (
            <Button onClick={onRetryCamera}>
              Retry Camera
            </Button>
          )}
        </div>
      )}
      
      {/* Video feed */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : ''}`}
        playsInline
        muted
        autoPlay
      />
      
      {/* Canvas overlay for drawing pose detection */}
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full ${!cameraActive ? 'hidden' : ''}`}
        width={640}
        height={480}
      />
      
      {/* Detection stats */}
      {cameraActive && detectionStatus.isActive && (
        <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          {detectionStatus.fps && (
            <span className="mr-2">FPS: {detectionStatus.fps}</span>
          )}
          {detectionStatus.confidence && (
            <span>Confidence: {Math.round(detectionStatus.confidence * 100)}%</span>
          )}
        </div>
      )}
      
      {/* Loading overlay */}
      {cameraActive && isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-background p-4 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Loading AI model...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;

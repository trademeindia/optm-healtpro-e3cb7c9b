
import React from 'react';
import { Loader, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  cameraActive: boolean;
  isModelLoading?: boolean;
  isInitializing?: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraError?: string | null;
  onRetryCamera?: () => void;
  detectionStatus?: {
    isDetecting?: boolean;
    fps?: number | null;
    confidence?: number | null;
  };
}

const CameraView: React.FC<CameraViewProps> = ({
  cameraActive,
  isModelLoading = false,
  isInitializing = false,
  videoRef,
  canvasRef,
  cameraError,
  onRetryCamera,
  detectionStatus = {}
}) => {
  const { isDetecting, fps, confidence } = detectionStatus;
  const isLoading = isModelLoading || isInitializing;

  return (
    <div className="relative w-full">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
            <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            <p className="text-white text-sm mt-2">
              {isModelLoading ? "Loading motion detection model..." : "Initializing camera..."}
            </p>
          </div>
        )}
        
        {!cameraActive && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 z-20">
            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Click "Start Camera" to begin motion tracking</p>
          </div>
        )}
        
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-30">
            <AlertCircle className="h-12 w-12 text-destructive mb-2" />
            <p className="text-white text-sm text-center mb-4 max-w-xs">{cameraError}</p>
            {onRetryCamera && (
              <Button variant="secondary" onClick={onRetryCamera}>
                Retry Camera
              </Button>
            )}
          </div>
        )}
        
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            transform: 'scaleX(-1)', // Mirror the video for more intuitive feedback
            display: 'block' // Always display the video element
          }} 
          playsInline 
          muted
          autoPlay
        />
        
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-10"
          style={{ 
            transform: 'scaleX(-1)', // Mirror the canvas to match the video
            display: 'block' // Always display the canvas element
          }} 
        />
      </div>
      
      {cameraActive && isDetecting && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-2 rounded z-20 space-y-1">
          {fps !== null && fps !== undefined && (
            <div>FPS: {Math.round(fps)}</div>
          )}
          {confidence !== null && confidence !== undefined && (
            <div>Confidence: {Math.round((confidence * 100))}%</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraView;

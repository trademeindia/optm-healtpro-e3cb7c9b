
import React from 'react';
import { Loader, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HumanDetectionStatus } from './types';

interface CameraViewProps {
  cameraActive: boolean;
  isModelLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraError?: string | null;
  onRetryCamera?: () => void;
  detectionStatus: {
    isDetecting: boolean;
    fps: number | null;
    confidence: number | null;
  };
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
    <div className="relative w-full">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {isModelLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
            <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-white text-sm">Loading motion detection model...</p>
          </div>
        )}
        
        {!cameraActive && !isModelLoading && (
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
            display: cameraActive ? 'block' : 'none' // Hide when not active
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
            display: cameraActive ? 'block' : 'none' // Hide when not active
          }} 
        />
      </div>
      
      {cameraActive && detectionStatus.isDetecting && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-2 rounded z-20 space-y-1">
          {detectionStatus.fps !== null && (
            <div>FPS: {Math.round(detectionStatus.fps || 0)}</div>
          )}
          {detectionStatus.confidence !== null && (
            <div>Confidence: {Math.round((detectionStatus.confidence || 0) * 100)}%</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraView;

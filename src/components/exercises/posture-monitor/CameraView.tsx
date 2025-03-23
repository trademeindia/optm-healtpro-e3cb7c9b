
import React from 'react';
import { AlertCircle, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetectionStatus } from '@/lib/human/types';

interface CameraViewProps {
  cameraActive: boolean;
  isModelLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraError: string | null;
  onRetryCamera: () => void;
  detectionStatus: DetectionStatus;
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
    <div className="relative w-full h-full bg-black">
      {/* Video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-contain ${
          cameraActive ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        playsInline
      />
      
      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Camera error state */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/90 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
          <p className="mb-4 text-muted-foreground">{cameraError}</p>
          <Button onClick={onRetryCamera} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Camera
          </Button>
        </div>
      )}
      
      {/* Inactive camera state */}
      {!cameraActive && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/90 text-center">
          <Camera className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Camera Not Active</h3>
          <p className="mb-4 text-muted-foreground">Click the button below to start your camera and begin tracking your exercise form.</p>
        </div>
      )}
      
      {/* Loading state */}
      {isModelLoading && (
        <div className="absolute bottom-4 left-4 bg-background/80 rounded-md px-3 py-2 flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
          <span className="text-sm font-medium">Loading AI model...</span>
        </div>
      )}
      
      {/* Detection status indicators */}
      {cameraActive && detectionStatus.isDetecting && (
        <div className="absolute top-4 right-4 bg-background/80 rounded-md px-3 py-2 flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">FPS:</span>
            <span className="text-xs font-medium">{detectionStatus.fps?.toFixed(1)}</span>
          </div>
          {detectionStatus.confidence !== null && (
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Confidence:</span>
              <span className="text-xs font-medium">{Math.round(detectionStatus.confidence * 100)}%</span>
            </div>
          )}
          {detectionStatus.detectedKeypoints !== undefined && (
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Keypoints:</span>
              <span className="text-xs font-medium">{detectionStatus.detectedKeypoints}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraView;

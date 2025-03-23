
import React from 'react';
import { AlertCircle, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
  detectedKeypoints?: number;
  lastDetectionTime?: number;
}

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
    <div className="relative w-full h-full bg-black overflow-hidden rounded-lg border border-border/50 shadow-sm">
      {/* Video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-contain ${
          cameraActive ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        playsInline
        muted
      />
      
      {/* Canvas overlay for drawing pose and angles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain"
      />
      
      {/* Camera error state - improved visibility */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/95 text-center z-10">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
          <p className="mb-4 text-muted-foreground">{cameraError}</p>
          <Button onClick={onRetryCamera} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Camera
          </Button>
        </div>
      )}
      
      {/* Inactive camera state - improved visibility */}
      {!cameraActive && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/95 text-center z-10">
          <div className="rounded-full bg-primary/10 p-6 mb-4">
            <Camera className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Camera Not Active</h3>
          <p className="mb-4 text-muted-foreground max-w-md">
            Click the button below to start your camera and begin tracking your exercise form.
          </p>
        </div>
      )}
      
      {/* Loading state - improved visibility */}
      {isModelLoading && (
        <div className="absolute bottom-4 left-4 bg-background/90 rounded-md px-3 py-2 flex items-center gap-2 z-20 shadow-md">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
          <span className="text-sm font-medium">Loading AI model...</span>
        </div>
      )}
      
      {/* Detection status indicators - improved visibility */}
      {cameraActive && detectionStatus.isDetecting && (
        <div className="absolute top-4 right-4 bg-background/90 rounded-md px-3 py-2 flex flex-col gap-1 z-20 shadow-md">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">FPS:</span>
            <span className="text-xs font-medium">{detectionStatus.fps?.toFixed(1) || "0"}</span>
          </div>
          {detectionStatus.confidence !== null && (
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Confidence:</span>
              <span className="text-xs font-medium">{Math.round((detectionStatus.confidence || 0) * 100)}%</span>
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

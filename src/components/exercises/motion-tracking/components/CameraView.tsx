
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Pause, Play, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import MotionRenderer from '../MotionRenderer';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isModelLoading: boolean;
  cameraActive: boolean;
  isTracking: boolean;
  detectionResult: any;
  angles: any;
  onStartCamera: () => void;
  onToggleTracking: () => void;
  onReset: () => void;
  onFinish: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  canvasRef,
  isModelLoading,
  cameraActive,
  isTracking,
  detectionResult,
  angles,
  onStartCamera,
  onToggleTracking,
  onReset,
  onFinish
}) => {
  return (
    <div className="relative aspect-video bg-black flex items-center justify-center">
      {/* Hidden video for capture */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover" 
        style={{ display: cameraActive ? 'block' : 'none' }}
        onLoadedData={() => {
          if (videoRef.current?.readyState === 4) {
            toast.success("Camera feed ready");
          }
        }}
      />
      
      {/* Canvas for rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
        style={{ display: cameraActive ? 'block' : 'none' }}
      />
      
      {/* Renderer component */}
      {detectionResult && (
        <MotionRenderer 
          result={detectionResult} 
          canvasRef={canvasRef} 
          angles={angles}
        />
      )}
      
      {/* Camera inactive state */}
      {!cameraActive && (
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-muted/20">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Camera Access Required</h3>
          <p className="text-muted-foreground text-sm mb-4">
            To analyze your movement patterns, we need access to your camera. 
            Your privacy is important - video is processed locally and not stored.
          </p>
          <Button 
            onClick={onStartCamera} 
            className="w-full"
            disabled={isModelLoading}
          >
            {isModelLoading ? "Loading motion analysis model..." : "Start Camera"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraView;

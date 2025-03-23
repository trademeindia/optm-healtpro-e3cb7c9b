
import React from 'react';
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
      
      {/* Motion renderer component for processing detection results */}
      {cameraActive && detectionResult && (
        <MotionRenderer 
          result={detectionResult}
          canvasRef={canvasRef}
          angles={angles}
        />
      )}
      
      {/* Camera inactive state */}
      {!cameraActive && (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Camera is offline</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-md">
            Enable camera access to begin motion tracking analysis
          </p>
          <Button 
            onClick={onStartCamera} 
            className="flex items-center gap-2"
            disabled={isModelLoading}
          >
            <Camera className="h-4 w-4" />
            Enable Camera
          </Button>
        </div>
      )}
      
      {/* Overlay controls when camera is active */}
      {cameraActive && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-background/80 backdrop-blur-sm"
            onClick={onToggleTracking}
          >
            {isTracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-background/80 backdrop-blur-sm"
            onClick={onReset}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-destructive/20 backdrop-blur-sm hover:bg-destructive/30"
            onClick={onFinish}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraView;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Pause, Play, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import MotionRenderer from '../MotionRenderer';
import { Spinner } from '@/components/ui/spinner';

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
  // Set canvas dimensions to match video dimensions when video loads
  const handleVideoLoad = () => {
    if (videoRef.current && canvasRef.current) {
      if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        console.log("Canvas dimensions set to:", canvasRef.current.width, "x", canvasRef.current.height);
        toast.success("Camera feed ready");
      }
    }
  };

  return (
    <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
      {/* Hidden video for capture */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover" 
        style={{ display: cameraActive ? 'block' : 'none' }}
        onLoadedData={handleVideoLoad}
      />
      
      {/* Canvas for rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
        style={{ display: cameraActive ? 'block' : 'none' }}
      />
      
      {/* Tracking status indicator */}
      {cameraActive && isTracking && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-20 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          <span>Tracking</span>
        </div>
      )}
      
      {/* Renderer component */}
      {detectionResult && (
        <MotionRenderer 
          result={detectionResult} 
          canvasRef={canvasRef} 
          angles={angles}
        />
      )}
      
      {/* Loading indicator */}
      {isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-center p-4 bg-card rounded-lg shadow-lg">
            <Spinner size="lg" className="mb-2" />
            <p className="text-white">Loading model...</p>
          </div>
        </div>
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
      
      {/* Camera control overlay when active but not tracking */}
      {cameraActive && !isTracking && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
          <Button 
            onClick={onToggleTracking} 
            size="lg"
            className="gap-2"
          >
            <Play className="h-5 w-5" />
            <span>Start Tracking</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraView;

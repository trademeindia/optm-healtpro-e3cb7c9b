
import React, { useEffect, useState } from 'react';
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
  // Track if video element has loaded
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showCameraRetry, setShowCameraRetry] = useState(false);
  
  // Ensure video dimensions match container
  useEffect(() => {
    const updateDimensions = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
        const containerWidth = videoRef.current.parentElement?.offsetWidth || 640;
        const containerHeight = videoRef.current.parentElement?.offsetHeight || 480;
        
        // Update canvas dimensions to match container
        canvasRef.current.width = containerWidth;
        canvasRef.current.height = containerHeight;
        
        setVideoLoaded(true);
      }
    };
    
    // Update dimensions initially and on resize
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Set a timer to suggest retry if camera doesn't activate
    const retryTimer = setTimeout(() => {
      if (!videoLoaded && cameraActive) {
        setShowCameraRetry(true);
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(retryTimer);
    };
  }, [videoRef, canvasRef, cameraActive, videoLoaded]);
  
  // Handle camera retry
  const handleRetryCamera = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setVideoLoaded(false);
    setShowCameraRetry(false);
    setTimeout(onStartCamera, 500);
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
        style={{ 
          display: cameraActive ? 'block' : 'none',
          transform: 'scaleX(-1)' // Mirror the video for more intuitive interaction
        }}
        onLoadedData={() => {
          if (videoRef.current?.readyState >= 2) {
            setVideoLoaded(true);
            toast.success("Camera feed ready");
          }
        }}
      />
      
      {/* Canvas for rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
        style={{ 
          display: cameraActive ? 'block' : 'none',
          transform: 'scaleX(-1)' // Mirror the canvas to match video
        }}
      />
      
      {/* Motion renderer component for processing detection results */}
      {cameraActive && videoLoaded && detectionResult && (
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
      
      {/* Camera active but not loaded properly */}
      {cameraActive && !videoLoaded && showCameraRetry && (
        <div className="absolute inset-0 z-20 bg-black/70 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-white">Camera not responding</h3>
          <p className="text-gray-300 text-sm mb-4 max-w-md">
            Your camera seems to be enabled but not sending video data.
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={handleRetryCamera} 
              className="flex items-center gap-2"
              variant="secondary"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Camera
            </Button>
          </div>
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

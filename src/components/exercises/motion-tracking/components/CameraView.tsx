
import React, { useEffect, useState } from 'react';
import { RefreshCw, Camera, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  detectionStatus: { isDetecting: boolean };
  onCameraStart?: () => void;
  isTracking?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  videoRef, 
  canvasRef,
  detectionStatus,
  onCameraStart,
  isTracking 
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Start camera stream
  const startCamera = async () => {
    if (cameraActive || isInitializing) return;
    
    setIsInitializing(true);
    setCameraError(null);
    
    try {
      // Request camera with specific constraints for better full-body view
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user',
          aspectRatio: { ideal: 1.777 } // 16:9 aspect ratio
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Once video is loaded, set camera as active
        videoRef.current.onloadedmetadata = () => {
          console.log('Camera stream loaded, dimensions:', {
            width: videoRef.current?.videoWidth,
            height: videoRef.current?.videoHeight
          });
          
          setCameraActive(true);
          setIsInitializing(false);
          
          // Set canvas dimensions to match video
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
          
          // Notify parent component
          if (onCameraStart) {
            onCameraStart();
          }
          
          toast.success('Camera started successfully');
        };
        
        // Handle errors during video playback
        videoRef.current.onerror = () => {
          setCameraError('Error playing video stream');
          setIsInitializing(false);
          stopCamera();
        };
        
        // Start playing the video
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          setCameraError('Could not play video stream');
          setIsInitializing(false);
          stopCamera();
        });
      } else {
        setCameraError('Video element not available');
        setIsInitializing(false);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError(
        err.name === 'NotAllowedError' 
          ? 'Camera access denied. Please allow camera access and try again.'
          : `Camera error: ${err.message || 'Could not access camera'}`
      );
      setIsInitializing(false);
    }
  };
  
  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
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
        muted
      />
      
      {/* Canvas overlay for drawing pose */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain"
      />
      
      {/* Camera inactive state */}
      {!cameraActive && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/90 text-center">
          <Camera className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Camera Not Active</h3>
          <p className="mb-4 text-muted-foreground">Click the button below to start your camera and begin tracking your exercise form.</p>
          <Button 
            onClick={startCamera} 
            disabled={isInitializing}
            className="flex items-center gap-2"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Starting Camera...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Start Camera
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Camera error state */}
      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/90 text-center">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => {
              setCameraError(null);
              startCamera();
            }} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Camera
          </Button>
        </div>
      )}
      
      {/* Active tracking indicator */}
      {isTracking && cameraActive && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/80 text-white rounded-md flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-white animate-ping" />
          <span className="text-sm font-medium">Tracking Active</span>
        </div>
      )}
    </div>
  );
};

export default CameraView;

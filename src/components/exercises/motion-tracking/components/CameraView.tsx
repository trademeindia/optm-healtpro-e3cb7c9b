
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, AlertCircle } from 'lucide-react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  detectionStatus: { isDetecting: boolean };
  onCameraStart?: () => void;
  isTracking?: boolean;
  error?: string | null;
}

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  canvasRef,
  detectionStatus,
  onCameraStart,
  isTracking = false,
  error = null
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Start camera stream
  const startCamera = async () => {
    try {
      setIsInitializing(true);
      setCameraError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        try {
          await videoRef.current.play();
          setCameraActive(true);
          
          // Set canvas dimensions to match video
          if (canvasRef.current && videoRef.current.videoWidth) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
          
          if (onCameraStart) {
            onCameraStart();
          }
        } catch (playError) {
          console.error('Error playing video:', playError);
          setCameraError('Unable to start video. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found. Please connect a camera and try again.');
      } else {
        setCameraError(`Error accessing camera: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsInitializing(false);
    }
  };
  
  // Clean up camera on component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoRef]);
  
  return (
    <div className="camera-view w-full h-full relative">
      {!cameraActive ? (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="text-center max-w-md px-4 mb-6">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-70" />
            <h3 className="text-lg font-medium mb-2">Camera Required</h3>
            <p className="text-sm opacity-90 mb-4">
              Position yourself so your full body is visible to get accurate motion tracking.
            </p>
            {cameraError && (
              <div className="bg-red-900/60 border border-red-700 rounded-md p-3 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-200">{cameraError}</p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={startCamera} 
            disabled={isInitializing}
            className="bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isInitializing ? 'Starting Camera...' : 'Start Camera'}
          </Button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            className="absolute inset-0 w-full h-full object-contain z-10" 
            playsInline 
            muted
          />
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full z-20"
          />
          
          {isTracking && (
            <div className="absolute top-3 right-3 z-30 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
              Tracking Active
            </div>
          )}
          
          {error && (
            <div className="absolute bottom-3 left-3 right-3 z-30 bg-red-900/80 text-white text-sm px-3 py-2 rounded-md">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CameraView;

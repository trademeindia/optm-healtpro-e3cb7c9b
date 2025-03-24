
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Video, AlertCircle } from 'lucide-react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  detectionStatus: { isDetecting: boolean };
  onCameraStart: () => void;
  isTracking: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  canvasRef,
  detectionStatus,
  onCameraStart,
  isTracking
}) => {
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  useEffect(() => {
    if (cameraStarted) {
      return () => {
        // Stop camera on unmount
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      };
    }
  }, [cameraStarted, videoRef]);
  
  const startCamera = async () => {
    try {
      setCameraError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setCameraStarted(true);
            onCameraStart();
          }
        };
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      setCameraError(error instanceof Error ? error.message : 'Failed to access camera');
    }
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-900 camera-container">
      {!cameraStarted ? (
        <div className="flex flex-col items-center text-center p-6 max-w-md mx-auto">
          <Video className="h-12 w-12 mb-4 text-blue-400" />
          <h3 className="text-lg text-white font-semibold mb-2">Camera Access Required</h3>
          <p className="text-gray-300 text-sm mb-5">
            Position yourself so your full body is visible to track your 
            exercise form.
          </p>
          
          {cameraError && (
            <div className="bg-red-900/40 text-red-300 p-3 rounded-lg mb-4 flex items-start gap-2 text-sm w-full">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}
          
          <Button 
            onClick={startCamera} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Camera className="h-5 w-5" />
            Start Camera
          </Button>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <video 
            ref={videoRef} 
            className="w-full h-full object-contain"
            playsInline
            muted
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full object-contain z-10"
          />
          {isTracking && (
            <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full z-20 flex items-center gap-1.5 tracking-active-indicator">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse indicator-dot"></div>
              Tracking Active
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraView;

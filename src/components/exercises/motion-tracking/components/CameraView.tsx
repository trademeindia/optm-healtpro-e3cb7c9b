
import React, { useEffect } from 'react';
import { AlertCircle, Play } from 'lucide-react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  detectionStatus?: {
    isDetecting?: boolean;
  };
  errorMessage?: string | null;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  videoRef, 
  canvasRef,
  detectionStatus = { isDetecting: false },
  errorMessage
}) => {
  // Initialize camera when component mounts
  useEffect(() => {
    const initCamera = async () => {
      if (!videoRef.current) return;
      
      try {
        const constraints = {
          audio: false,
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };
    
    initCamera();
    
    // Cleanup function to stop camera on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [videoRef]);
  
  return (
    <div className="relative w-full aspect-video bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${detectionStatus.isDetecting ? 'opacity-100' : 'opacity-80'}`}
        style={{ transform: 'scaleX(-1)' }} // Mirror the camera feed
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ transform: 'scaleX(-1)' }} // Mirror the canvas to match the video
      />
      
      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="bg-card p-4 rounded-lg max-w-md text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Camera Error</h3>
            <p className="text-muted-foreground">{errorMessage}</p>
          </div>
        </div>
      )}
      
      {!detectionStatus.isDetecting && !errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-center text-white">
            <Play className="h-8 w-8 mx-auto mb-2 text-white" />
            <p className="text-xl">Camera Ready</p>
            <p className="text-sm text-gray-300 mt-2">Click "Start Tracking" to begin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;


import React, { useEffect } from 'react';
import { Camera } from 'lucide-react';

interface CameraViewProps {
  cameraActive: boolean;
  isModelLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CameraView: React.FC<CameraViewProps> = ({
  cameraActive,
  isModelLoading,
  videoRef,
  canvasRef
}) => {
  // Force video element update if camera is active
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      const videoElement = videoRef.current;
      
      // This helps with some browser rendering issues
      const checkVideoPlaying = () => {
        console.log("Checking video playback...");
        console.log("Video paused:", videoElement.paused);
        console.log("Video ended:", videoElement.ended);
        console.log("Video readyState:", videoElement.readyState);
        
        if (videoElement.paused || videoElement.ended) {
          console.log("Video not playing, attempting to play...");
          videoElement.play().catch(e => console.error("Failed to play video:", e));
        }
      };
      
      // Initial check
      checkVideoPlaying();
      
      // Check again after a short delay
      const timer = setTimeout(checkVideoPlaying, 500);
      return () => clearTimeout(timer);
    }
  }, [cameraActive, videoRef]);

  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
      {cameraActive ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover absolute inset-0"
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas 
            ref={canvasRef}
            className="w-full h-full absolute inset-0 z-10"
            style={{ transform: 'scaleX(-1)' }}
          />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Camera active
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center p-4">
            <Camera className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
            <p className="text-sm">Camera is currently inactive</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Enable camera access to receive real-time squat analysis
            </p>
            {isModelLoading && (
              <p className="mt-2 text-sm text-primary">Loading AI model, please wait...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;


import React, { useEffect, useRef } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

interface CameraViewProps {
  cameraActive: boolean;
  isModelLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraError?: string | null;
}

const CameraView: React.FC<CameraViewProps> = ({
  cameraActive,
  isModelLoading,
  videoRef,
  canvasRef,
  cameraError
}) => {
  const videoInitializedRef = useRef(false);
  
  // Force video element update if camera is active
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      const videoElement = videoRef.current;
      videoInitializedRef.current = true;
      
      // This helps with some browser rendering issues
      const checkVideoPlaying = () => {
        console.log("Checking video playback...");
        
        if (videoElement.paused && videoElement.readyState >= 2) {
          console.log("Video not playing but ready, attempting to play...");
          videoElement.play().catch(e => console.error("Failed to play video:", e));
        }
      };
      
      // Initial check with delay to ensure DOM is ready
      const initialCheckTimer = setTimeout(checkVideoPlaying, 200);
      
      // Set up video event listeners
      const onError = (e: Event) => console.error("Video error event triggered", e);
      const onStalled = () => console.warn("Video stalled event triggered");
      const onSuspend = () => console.warn("Video suspend event triggered");
      const onWaiting = () => console.warn("Video waiting for data");
      const onPlaying = () => console.log("Video playing event triggered");
      const onLoadedMetadata = () => {
        console.log("Video metadata loaded");
        checkVideoPlaying();
      };
      
      videoElement.addEventListener('error', onError);
      videoElement.addEventListener('stalled', onStalled);
      videoElement.addEventListener('suspend', onSuspend);
      videoElement.addEventListener('waiting', onWaiting);
      videoElement.addEventListener('playing', onPlaying);
      videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
      
      return () => {
        clearTimeout(initialCheckTimer);
        videoElement.removeEventListener('error', onError);
        videoElement.removeEventListener('stalled', onStalled);
        videoElement.removeEventListener('suspend', onSuspend);
        videoElement.removeEventListener('waiting', onWaiting);
        videoElement.removeEventListener('playing', onPlaying);
        videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      };
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
          
          {cameraError && (
            <div className="absolute top-2 left-2 right-2 bg-red-500/80 text-white text-sm px-3 py-2 rounded flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{cameraError}</span>
            </div>
          )}
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
            {cameraError && (
              <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;

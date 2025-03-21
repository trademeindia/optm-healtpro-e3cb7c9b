
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Camera, RefreshCw } from 'lucide-react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraActive: boolean;
  toggleCamera: () => Promise<void>;
  retryCamera: () => Promise<void>;
  isModelLoading: boolean;
  cameraError: string | null;
  modelLoadProgress?: number;
}

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  canvasRef,
  cameraActive,
  toggleCamera,
  retryCamera,
  isModelLoading,
  cameraError,
  modelLoadProgress = 0
}) => {
  // This effect ensures the canvas size always matches the video size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (videoRef.current && canvasRef.current) {
        const { videoWidth, videoHeight } = videoRef.current;
        if (videoWidth && videoHeight) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
        }
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', updateCanvasSize);
      video.addEventListener('resize', updateCanvasSize);
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', updateCanvasSize);
        video.removeEventListener('resize', updateCanvasSize);
      }
    };
  }, [videoRef, canvasRef]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      {/* Camera display */}
      <div className="relative aspect-video w-full max-h-[60vh] flex items-center justify-center">
        <video
          ref={videoRef}
          className={`absolute w-full h-full object-contain ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          playsInline
          muted
        />
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Loading state */}
        {isModelLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
            <div className="loading-spinner mb-4" />
            <div className="text-lg font-medium">Loading AI model...</div>
            {modelLoadProgress > 0 && (
              <div className="w-48 h-2 bg-gray-700 rounded-full mt-2">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${modelLoadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Camera inactive/error state */}
        {!cameraActive && !isModelLoading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-4">
            {cameraError ? (
              <>
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <div className="text-lg font-medium text-red-400">Camera Error</div>
                <p className="text-center text-gray-300 mb-4">{cameraError}</p>
                <Button 
                  onClick={retryCamera}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </Button>
              </>
            ) : (
              <>
                <Camera className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-center text-gray-300 mb-4">
                  Enable your camera to begin your guided exercise session.
                </p>
                <Button 
                  onClick={toggleCamera}
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Start Camera</span>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Simple debug info */}
      {cameraActive && (
        <div className="absolute bottom-2 right-2 text-xs text-white/70 bg-black/50 px-2 py-1 rounded">
          Camera active
        </div>
      )}
    </div>
  );
};

export default CameraView;

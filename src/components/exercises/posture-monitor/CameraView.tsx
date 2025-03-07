
import React from 'react';
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


import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  cameraActive: boolean;
  isTracking: boolean;
  detectionFps: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onToggleCamera: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({
  cameraActive,
  isTracking,
  detectionFps,
  canvasRef,
  onToggleCamera
}) => {
  const webcamRef = useRef<Webcam>(null);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        if (video) {
          canvasRef.current.width = video.clientWidth;
          canvasRef.current.height = video.clientHeight;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef]);

  return (
    <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
      {cameraActive ? (
        <>
          <Webcam
            ref={webcamRef}
            mirrored={true}
            className="w-full h-full object-cover"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user"
            }}
          />
          <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width={640}
            height={480}
          />
          
          {/* FPS counter */}
          {isTracking && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {detectionFps} FPS
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Camera is inactive</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={onToggleCamera}
            >
              Enable Camera
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;

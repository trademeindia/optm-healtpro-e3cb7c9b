
import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onToggleFullscreen: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  videoRef, 
  canvasRef,
  onToggleFullscreen
}) => {
  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <button
        onClick={onToggleFullscreen}
        className="absolute top-2 right-2 p-2 bg-background/70 rounded-full"
        aria-label="Toggle fullscreen"
      >
        <Maximize2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CameraView;

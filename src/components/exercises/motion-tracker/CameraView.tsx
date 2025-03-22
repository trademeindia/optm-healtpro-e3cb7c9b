
import React, { useEffect } from 'react';
import { Loader, Camera } from 'lucide-react';
import { HumanDetectionStatus } from './types';

interface CameraViewProps {
  cameraActive: boolean;
  isModelLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  detectionStatus: HumanDetectionStatus;
}

const CameraView: React.FC<CameraViewProps> = ({
  cameraActive,
  isModelLoading,
  videoRef,
  canvasRef,
  detectionStatus
}) => {
  // Log when component mounts and updates
  useEffect(() => {
    console.log("CameraView rendered:", {
      cameraActive,
      isModelLoading,
      hasVideoRef: !!videoRef.current,
      hasCanvasRef: !!canvasRef.current,
      detectionActive: detectionStatus.isActive
    });
  }, [cameraActive, isModelLoading, videoRef, canvasRef, detectionStatus]);

  return (
    <div className="relative w-full">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {isModelLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
            <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-white text-sm">Loading motion detection model...</p>
          </div>
        )}
        
        {!cameraActive && !isModelLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 z-20">
            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Click "Start Camera" to begin motion tracking</p>
          </div>
        )}
        
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            transform: 'scaleX(-1)', // Mirror the video for more intuitive feedback
            display: cameraActive ? 'block' : 'none' 
          }} 
          playsInline 
          muted
          autoPlay
        />
        
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-10"
          style={{ 
            transform: 'scaleX(-1)', // Mirror the canvas to match the video
            display: cameraActive ? 'block' : 'none' 
          }} 
        />
      </div>
      
      {cameraActive && detectionStatus.isActive && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-1 rounded z-20">
          {detectionStatus.fps !== null && (
            <span className="mr-2">FPS: {detectionStatus.fps}</span>
          )}
          {detectionStatus.confidence !== null && (
            <span>Confidence: {Math.round(detectionStatus.confidence * 100)}%</span>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraView;

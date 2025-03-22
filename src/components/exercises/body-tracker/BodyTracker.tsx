
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { JointAngle } from './types';
import AngleDisplay from './AngleDisplay';
import CameraView from './components/CameraView';
import ControlPanel from './components/ControlPanel';
import { useHumanDetection } from './hooks/useHumanDetection';
import { BodyTrackerProps } from './types';

const BodyTracker: React.FC<BodyTrackerProps> = ({ 
  onAnglesDetected,
  onSaveData,
  isActive = false
}) => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  // Use our Human detection hook
  const { 
    angles, 
    detectionFps,
    startTracking
  } = useHumanDetection(
    webcamRef, 
    canvasRef, 
    isTracking, 
    onAnglesDetected
  );

  // Effect to handle camera activation based on isActive prop
  useEffect(() => {
    if (isActive && !cameraActive) {
      setCameraActive(true);
    }
  }, [isActive, cameraActive]);

  const handleStartTracking = () => {
    setIsTracking(true);
    startTracking();
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  const handleToggleCamera = () => {
    if (cameraActive) {
      setCameraActive(false);
      setIsTracking(false);
    } else {
      setCameraActive(true);
    }
  };

  const handleSaveData = () => {
    if (!angles.length) return;
    
    // Prepare data for saving
    const sessionData = {
      timestamp: new Date().toISOString(),
      angles: angles,
    };
    
    if (onSaveData) {
      onSaveData(sessionData);
    }
  };

  const handleResetAngles = () => {
    if (onAnglesDetected) {
      onAnglesDetected([]);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <CameraView
          cameraActive={cameraActive}
          isTracking={isTracking}
          detectionFps={detectionFps}
          canvasRef={canvasRef}
          onToggleCamera={handleToggleCamera}
        />
        
        <ControlPanel
          cameraActive={cameraActive}
          isTracking={isTracking}
          hasAngles={angles.length > 0}
          onToggleCamera={handleToggleCamera}
          onStartTracking={handleStartTracking}
          onStopTracking={handleStopTracking}
          onSaveData={handleSaveData}
          onResetAngles={handleResetAngles}
        />
        
        {cameraActive && (
          <div className="mt-4">
            <AngleDisplay angles={angles} />
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          <p className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Your camera feed is processed locally and not stored or sent to any server.</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BodyTracker;

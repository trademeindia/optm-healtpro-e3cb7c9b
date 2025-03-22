
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { JointAngle } from './types';
import AngleDisplay from './AngleDisplay';
import CameraView from './components/CameraView';
import ControlPanel from './components/ControlPanel';
import { useHumanDetection } from './hooks/useHumanDetection';
import { BodyTrackerProps } from './types';
import DetectionQualityIndicator from './components/DetectionQualityIndicator';
import PerformanceModeSelector from './components/PerformanceModeSelector';

const BodyTracker: React.FC<BodyTrackerProps> = ({ 
  onAnglesDetected,
  onSaveData,
  isActive = false
}) => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [performanceMode, setPerformanceMode] = useState<'high' | 'balanced' | 'low'>('balanced');

  // Use our Human detection hook with performance options
  const { 
    angles, 
    detectionFps,
    detectionQuality,
    startTracking,
    resetDetection
  } = useHumanDetection(
    webcamRef, 
    canvasRef, 
    isTracking, 
    onAnglesDetected,
    {
      performanceMode,
      skipFrames: performanceMode === 'low' ? 2 : performanceMode === 'balanced' ? 1 : 0
    }
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
    resetDetection();
  };

  const handlePerformanceModeChange = (mode: 'high' | 'balanced' | 'low') => {
    setPerformanceMode(mode);
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
        
        {/* Performance mode selector */}
        {cameraActive && (
          <div className="mt-2">
            <PerformanceModeSelector 
              currentMode={performanceMode}
              onChange={handlePerformanceModeChange}
              disabled={isTracking}
            />
          </div>
        )}
        
        {/* Detection quality indicator */}
        {isTracking && (
          <DetectionQualityIndicator quality={detectionQuality} />
        )}
        
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

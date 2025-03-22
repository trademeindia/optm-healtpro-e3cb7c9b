
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, PlayCircle, StopCircle, Save, RefreshCw } from 'lucide-react';

interface ControlPanelProps {
  cameraActive: boolean;
  isTracking: boolean;
  hasAngles: boolean;
  onToggleCamera: () => void;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onSaveData: () => void;
  onResetAngles: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  cameraActive,
  isTracking,
  hasAngles,
  onToggleCamera,
  onStartTracking,
  onStopTracking,
  onSaveData,
  onResetAngles
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant={cameraActive ? "destructive" : "default"}
        size="sm"
        onClick={onToggleCamera}
        className="flex items-center gap-1"
      >
        {cameraActive ? (
          <>
            <CameraOff className="h-4 w-4" />
            <span>Disable Camera</span>
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            <span>Enable Camera</span>
          </>
        )}
      </Button>
      
      {cameraActive && (
        <>
          <Button
            variant={isTracking ? "default" : "outline"}
            size="sm"
            onClick={isTracking ? onStopTracking : onStartTracking}
            className="flex items-center gap-1"
          >
            {isTracking ? (
              <>
                <StopCircle className="h-4 w-4" />
                <span>Stop Tracking</span>
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                <span>Start Tracking</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveData}
            disabled={!hasAngles}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>Save Data</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onResetAngles}
            disabled={!hasAngles}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </>
      )}
    </div>
  );
};

export default ControlPanel;

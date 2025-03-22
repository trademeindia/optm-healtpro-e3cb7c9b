
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Save, RefreshCw, Camera } from 'lucide-react';

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
    <div className="mt-4 flex flex-wrap gap-2">
      <Button 
        onClick={onToggleCamera}
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
      >
        <Camera className="h-4 w-4" />
        <span>{cameraActive ? 'Disable Camera' : 'Enable Camera'}</span>
      </Button>
      
      {cameraActive && (
        <>
          {!isTracking ? (
            <Button 
              onClick={onStartTracking}
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              disabled={!cameraActive}
            >
              <Play className="h-4 w-4" />
              <span>Start Tracking</span>
            </Button>
          ) : (
            <Button 
              onClick={onStopTracking}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <Pause className="h-4 w-4" />
              <span>Pause Tracking</span>
            </Button>
          )}
          
          <Button 
            onClick={onSaveData}
            variant="default"
            size="sm"
            className="flex items-center gap-1"
            disabled={!hasAngles}
          >
            <Save className="h-4 w-4" />
            <span>Save Data</span>
          </Button>
          
          <Button 
            onClick={onResetAngles}
            variant="outline"
            size="sm"
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

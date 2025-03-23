
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw, X } from 'lucide-react';

interface ControlPanelProps {
  cameraActive: boolean;
  isTracking: boolean;
  onToggleTracking: () => void;
  onReset: () => void;
  onFinish: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  cameraActive,
  isTracking,
  onToggleTracking,
  onReset,
  onFinish
}) => {
  return (
    <div className="w-full p-3 bg-card border-t grid grid-cols-3 gap-2">
      <Button
        variant={isTracking ? "destructive" : "default"}
        className="flex items-center gap-1"
        onClick={onToggleTracking}
        disabled={!cameraActive}
      >
        {isTracking ? (
          <>
            <Pause className="h-4 w-4" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span>Start Tracking</span>
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-1"
        onClick={onReset}
      >
        <RefreshCw className="h-4 w-4" />
        <span>Reset</span>
      </Button>
      
      <Button
        variant="secondary"
        className="flex items-center gap-1"
        onClick={onFinish}
      >
        <X className="h-4 w-4" />
        <span>Finish</span>
      </Button>
    </div>
  );
};

export default ControlPanel;

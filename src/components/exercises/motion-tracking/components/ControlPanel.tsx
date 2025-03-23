
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw, CheckCircle, Camera } from 'lucide-react';

interface ControlPanelProps {
  cameraActive: boolean;
  isTracking: boolean;
  isModelLoaded?: boolean;
  onToggleTracking: () => void;
  onReset: () => void;
  onFinish: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  cameraActive,
  isTracking,
  isModelLoaded = true,
  onToggleTracking,
  onReset,
  onFinish
}) => {
  return (
    <div className="flex justify-between w-full p-4 bg-muted/30 border-t">
      <div className="flex gap-2">
        <Button
          variant={isTracking ? "destructive" : "default"}
          size="sm"
          onClick={onToggleTracking}
          disabled={!cameraActive || !isModelLoaded}
          className="flex items-center gap-1"
        >
          {isTracking ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause Tracking</span>
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
          size="sm"
          onClick={onReset}
          disabled={!cameraActive || !isModelLoaded}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset</span>
        </Button>
      </div>
      
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onFinish}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Finish Session</span>
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;

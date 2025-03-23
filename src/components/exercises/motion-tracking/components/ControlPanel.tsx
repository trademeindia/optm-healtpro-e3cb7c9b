
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';

interface ControlPanelProps {
  cameraActive: boolean;
  isTracking: boolean;
  onStartCamera?: () => void;
  onToggleTracking: () => void;
  onReset: () => void;
  onFinish: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  cameraActive,
  isTracking,
  onStartCamera,
  onToggleTracking,
  onReset,
  onFinish
}) => {
  return (
    <div className="w-full p-4 flex flex-wrap gap-2 justify-center">
      {onStartCamera && !cameraActive && (
        <Button 
          variant="default" 
          onClick={onStartCamera}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Start Camera
        </Button>
      )}
      
      {cameraActive && (
        <>
          <Button
            variant={isTracking ? "secondary" : "default"}
            onClick={onToggleTracking}
            className="flex items-center gap-2"
          >
            {isTracking ? (
              <>
                <Pause className="h-4 w-4" />
                Pause Tracking
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Tracking
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            variant="outline"
            onClick={onFinish}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Finish
          </Button>
        </>
      )}
    </div>
  );
};

export default ControlPanel;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, RefreshCw, X } from 'lucide-react';

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
    <div className="flex justify-between p-4 bg-card border-t">
      <div className="flex gap-2">
        {cameraActive && (
          <Button
            variant={isTracking ? "outline" : "default"}
            size="sm"
            onClick={onToggleTracking}
            disabled={!cameraActive}
            className="gap-2"
          >
            {isTracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isTracking ? "Pause Tracking" : "Start Tracking"}
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!cameraActive}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
      
      <Button 
        variant="secondary" 
        size="sm"
        onClick={onFinish}
        className="gap-2"
      >
        <X className="h-4 w-4" />
        End Session
      </Button>
    </div>
  );
};

export default ControlPanel;

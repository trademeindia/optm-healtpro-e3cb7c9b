
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

interface ControlPanelProps {
  isTracking: boolean;
  isModelLoaded: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onResetSession: () => void;
  onFinish: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isTracking,
  isModelLoaded,
  onStartTracking,
  onStopTracking,
  onResetSession,
  onFinish
}) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium text-base">Control Panel</h3>
        
        <div className="grid grid-cols-2 gap-2">
          {isTracking ? (
            <Button 
              onClick={onStopTracking}
              className="w-full flex items-center justify-center"
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button 
              onClick={onStartTracking}
              className="w-full flex items-center justify-center bg-primary"
              disabled={!isModelLoaded}
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          
          <Button 
            onClick={onResetSession}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <Button 
          onClick={onFinish}
          className="w-full flex items-center justify-center"
          variant="secondary"
        >
          <Flag className="h-4 w-4 mr-2" />
          Finish Exercise
        </Button>
        
        <div className="text-xs text-muted-foreground">
          <p>Tracking Status: {isModelLoaded ? 
            (isTracking ? "Active" : "Ready") : 
            "Loading Model..."}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;

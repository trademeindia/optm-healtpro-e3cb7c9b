
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, StopCircle, RefreshCw } from 'lucide-react';

interface ControlPanelProps {
  isTracking: boolean;
  isModelLoaded: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onResetSession: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isTracking,
  isModelLoaded,
  onStartTracking,
  onStopTracking,
  onResetSession
}) => {
  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Controls</CardTitle>
      </CardHeader>
      <CardContent className="py-2 space-y-3">
        {!isTracking ? (
          <Button 
            onClick={onStartTracking} 
            disabled={!isModelLoaded || isTracking}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <PlayCircle className="h-5 w-5" />
            Start Tracking
          </Button>
        ) : (
          <Button 
            onClick={onStopTracking} 
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <StopCircle className="h-5 w-5" />
            Stop Tracking
          </Button>
        )}
        
        <Button 
          onClick={onResetSession} 
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          size="lg"
        >
          <RefreshCw className="h-5 w-5" />
          Reset Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;

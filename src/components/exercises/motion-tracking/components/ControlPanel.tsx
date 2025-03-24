
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
    <Card className="h-full shadow">
      <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
        <CardTitle className="text-lg font-medium">Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {!isTracking ? (
            <Button 
              onClick={onStartTracking} 
              disabled={!isModelLoaded || isTracking}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;

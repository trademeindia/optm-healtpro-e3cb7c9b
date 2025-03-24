
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';

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
    <Card className="border shadow w-full">
      <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
        <CardTitle className="text-lg font-medium">Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col gap-3">
          {isTracking ? (
            <Button 
              onClick={onStopTracking} 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2" 
              disabled={!isModelLoaded}
            >
              <Pause className="h-4 w-4" />
              Pause Tracking
            </Button>
          ) : (
            <Button 
              onClick={onStartTracking} 
              className="w-full flex items-center justify-center gap-2" 
              disabled={!isModelLoaded}
            >
              <Play className="h-4 w-4" />
              Start Tracking
            </Button>
          )}
          
          <Button 
            onClick={onResetSession} 
            variant="outline"
            className="w-full flex items-center justify-center gap-2" 
          >
            <RefreshCw className="h-4 w-4" />
            Reset Session
          </Button>
        </div>
        
        <div className="mt-6 text-xs text-muted-foreground">
          <p className="mb-2 font-medium">Instructions:</p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Position your camera to view your full body</li>
            <li>Start tracking when you're ready to begin</li>
            <li>Use good lighting for better tracking</li>
            <li>Reset session to start a new workout</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, StopCircle } from 'lucide-react';

interface ControlPanelProps {
  isTracking: boolean;
  isModelLoaded: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onResetSession: () => void;
  onFinish?: () => void;
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
      <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50">
        <CardTitle className="text-lg font-medium">Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {!isTracking ? (
            <Button 
              onClick={onStartTracking} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={!isModelLoaded}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Tracking
            </Button>
          ) : (
            <Button 
              onClick={onStopTracking} 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause Tracking
            </Button>
          )}
          
          <Button 
            onClick={onResetSession} 
            variant="outline" 
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Session
          </Button>
          
          {onFinish && (
            <Button 
              onClick={onFinish} 
              variant="destructive" 
              className="w-full mt-2"
            >
              <StopCircle className="mr-2 h-4 w-4" />
              End Exercise
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;

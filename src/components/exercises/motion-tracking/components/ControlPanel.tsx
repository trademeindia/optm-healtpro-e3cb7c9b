
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw, Camera } from 'lucide-react';

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
    <Card className="border border-border/60 shadow-sm">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-3 justify-between items-center control-buttons">
        {!isTracking ? (
          <Button
            onClick={onStartTracking}
            disabled={!isModelLoaded}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white control-button"
            size="lg"
          >
            <Play className="h-5 w-5" />
            <span>Start Tracking</span>
          </Button>
        ) : (
          <Button
            onClick={onStopTracking}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white control-button"
            size="lg"
          >
            <Square className="h-5 w-5" />
            <span>Stop Tracking</span>
          </Button>
        )}
        
        <Button
          onClick={onResetSession}
          variant="outline"
          className="w-full sm:w-auto flex items-center justify-center gap-2 border-primary/30 control-button"
          size="lg"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Reset Session</span>
        </Button>
        
        {!isModelLoaded && (
          <div className="text-sm text-amber-600 dark:text-amber-400 animate-pulse flex items-center w-full sm:w-auto text-center sm:text-left justify-center sm:justify-start">
            <div className="mr-2 h-2 w-2 rounded-full bg-amber-500"></div>
            Preparing AI model...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ControlPanel;

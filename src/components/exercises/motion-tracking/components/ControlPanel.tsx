
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, StopCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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
  
  const handleStartTracking = () => {
    if (!isModelLoaded) {
      toast.error('AI model is still loading. Please wait.');
      return;
    }
    
    onStartTracking();
    toast.success('Tracking started', {
      description: 'Position yourself in the camera view to begin exercise analysis.',
      duration: 3000
    });
  };
  
  const handleStopTracking = () => {
    onStopTracking();
    toast.info('Tracking paused', { 
      description: 'Your session is paused. Resume whenever you\'re ready.',
      duration: 3000
    });
  };
  
  const handleResetSession = () => {
    onResetSession();
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-center gap-3">
          {!isTracking ? (
            <Button 
              onClick={handleStartTracking} 
              disabled={!isModelLoaded}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="h-4 w-4" />
              Start Tracking
            </Button>
          ) : (
            <Button 
              onClick={handleStopTracking}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
            >
              <StopCircle className="h-4 w-4" />
              Stop Tracking
            </Button>
          )}
          
          <Button 
            onClick={handleResetSession}
            variant="outline" 
            className="flex-1 flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;

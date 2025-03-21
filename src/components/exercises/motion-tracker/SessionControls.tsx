
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  CameraOff, 
  Play, 
  Pause, 
  RefreshCw, 
  HelpCircle, 
  Check 
} from 'lucide-react';

interface SessionControlsProps {
  cameraActive: boolean;
  sessionActive: boolean;
  isModelLoading: boolean;
  onToggleCamera: () => Promise<void>;
  onToggleSession: () => void;
  onResetSession: () => void;
  onHelp: () => void;
  onFinish: () => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  cameraActive,
  sessionActive,
  isModelLoading,
  onToggleCamera,
  onToggleSession,
  onResetSession,
  onHelp,
  onFinish
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Camera toggle button */}
      <Button
        variant={cameraActive ? "destructive" : "default"}
        onClick={onToggleCamera}
        disabled={isModelLoading}
        className="flex items-center gap-2"
      >
        {cameraActive ? (
          <>
            <CameraOff className="h-4 w-4" />
            <span>Stop Camera</span>
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            <span>Start Camera</span>
          </>
        )}
      </Button>

      {/* Session control button */}
      <Button
        variant={sessionActive ? "outline" : "default"}
        onClick={onToggleSession}
        disabled={!cameraActive || isModelLoading}
        className="flex items-center gap-2"
      >
        {sessionActive ? (
          <>
            <Pause className="h-4 w-4" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span>Start Exercise</span>
          </>
        )}
      </Button>

      {/* Reset button */}
      <Button
        variant="outline"
        onClick={onResetSession}
        disabled={!cameraActive || isModelLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Reset</span>
      </Button>

      {/* Help button */}
      <Button
        variant="outline"
        onClick={onHelp}
        className="flex items-center gap-2"
      >
        <HelpCircle className="h-4 w-4" />
        <span>Help</span>
      </Button>

      {/* Finish button */}
      <Button
        variant="default"
        onClick={onFinish}
        className="flex items-center gap-2 ml-auto"
      >
        <Check className="h-4 w-4" />
        <span>Finish</span>
      </Button>
    </div>
  );
};

export default SessionControls;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, RefreshCw, HelpCircle, Check } from 'lucide-react';

interface ControlButtonsProps {
  cameraActive: boolean;
  isModelLoading: boolean;
  onToggleCamera: () => void;
  onReset: () => void;
  onShowTutorial: () => void;
  onFinish: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  cameraActive,
  isModelLoading,
  onToggleCamera,
  onReset,
  onShowTutorial,
  onFinish
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
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

      <Button
        variant="outline"
        onClick={onReset}
        disabled={isModelLoading || !cameraActive}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Reset</span>
      </Button>

      <Button
        variant="outline"
        onClick={onShowTutorial}
        className="flex items-center gap-2"
      >
        <HelpCircle className="h-4 w-4" />
        <span>Help</span>
      </Button>

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

export default ControlButtons;

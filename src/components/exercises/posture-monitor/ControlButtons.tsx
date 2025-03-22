
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Info, XCircle } from 'lucide-react';

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
    <>
      <Button
        variant={cameraActive ? "destructive" : "default"}
        onClick={onToggleCamera}
        disabled={isModelLoading}
        className="flex items-center gap-2"
      >
        {cameraActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {cameraActive ? "Stop Camera" : "Start Camera"}
      </Button>
      
      <Button
        variant="outline"
        onClick={onReset}
        disabled={isModelLoading || !cameraActive}
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Session
      </Button>
      
      <Button
        variant="outline"
        onClick={onShowTutorial}
        className="flex items-center gap-2"
      >
        <Info className="h-4 w-4" />
        How to Use
      </Button>
      
      <Button
        variant="secondary"
        onClick={onFinish}
        className="flex items-center gap-2"
      >
        <XCircle className="h-4 w-4" />
        Finish
      </Button>
    </>
  );
};

export default ControlButtons;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Check, Info, RotateCcw } from 'lucide-react';

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
    <div className="flex flex-wrap gap-2 pt-2">
      <Button 
        onClick={onToggleCamera} 
        variant={cameraActive ? "destructive" : "default"}
        className="gap-2 flex-1"
        disabled={isModelLoading}
      >
        {cameraActive ? (
          <>
            <CameraOff className="h-4 w-4" />
            <span>Stop Camera</span>
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            <span>{isModelLoading ? "Loading AI..." : "Start Camera"}</span>
          </>
        )}
      </Button>
      
      <Button 
        onClick={onReset} 
        variant="outline" 
        className="gap-2"
        disabled={!cameraActive}
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reset</span>
      </Button>
      
      <Button onClick={onShowTutorial} variant="outline" className="gap-2">
        <Info className="h-4 w-4" />
        <span>How To</span>
      </Button>
      
      <Button onClick={onFinish} variant="outline" className="gap-2 flex-1">
        <Check className="h-4 w-4" />
        <span>Finish Session</span>
      </Button>
    </div>
  );
};

export default ControlButtons;

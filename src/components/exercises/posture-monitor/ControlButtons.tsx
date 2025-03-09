
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
        size="auto"
        fullWidth={true}
        className="sm:flex-1"
        disabled={isModelLoading}
        aria-label={cameraActive ? "Stop Camera" : "Start Camera"}
      >
        {cameraActive ? (
          <>
            <CameraOff className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Stop Camera</span>
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{isModelLoading ? "Loading AI..." : "Start Camera"}</span>
          </>
        )}
      </Button>
      
      <Button 
        onClick={onReset} 
        variant="outline" 
        size="auto"
        className="flex-1 sm:flex-none"
        disabled={!cameraActive}
        aria-label="Reset"
      >
        <RotateCcw className="h-4 w-4 shrink-0" />
        <span className="sm:inline">Reset</span>
      </Button>
      
      <Button 
        onClick={onShowTutorial} 
        variant="outline" 
        size="auto"
        className="flex-1 sm:flex-none"
        aria-label="How To"
      >
        <Info className="h-4 w-4 shrink-0" />
        <span className="sm:inline">How To</span>
      </Button>
      
      <Button 
        onClick={onFinish} 
        variant="outline" 
        size="auto"
        fullWidth={true}
        className="sm:flex-1"
        aria-label="Finish Session"
      >
        <Check className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Finish Session</span>
      </Button>
    </div>
  );
};

export default ControlButtons;

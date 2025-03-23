
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetectionErrorType } from '@/lib/human/types';

interface DetectionErrorDisplayProps {
  errorType: DetectionErrorType;
  errorMessage: string;
  onRetry: () => void;
}

const DetectionErrorDisplay: React.FC<DetectionErrorDisplayProps> = ({
  errorType,
  errorMessage,
  onRetry
}) => {
  // Get appropriate error title based on error type
  const getErrorTitle = () => {
    switch (errorType) {
      case DetectionErrorType.MODEL_LOADING:
        return 'Model Loading Error';
      case DetectionErrorType.CAMERA_ACCESS:
        return 'Camera Access Error';
      case DetectionErrorType.DETECTION_TIMEOUT:
        return 'Detection Timeout';
      case DetectionErrorType.INSUFFICIENT_MEMORY:
        return 'Memory Error';
      default:
        return 'Detection Error';
    }
  };

  // Get appropriate fix suggestion based on error type
  const getFixSuggestion = () => {
    switch (errorType) {
      case DetectionErrorType.MODEL_LOADING:
        return 'Try refreshing the page or check your internet connection.';
      case DetectionErrorType.CAMERA_ACCESS:
        return 'Make sure camera permissions are granted and no other application is using your camera.';
      case DetectionErrorType.DETECTION_TIMEOUT:
        return 'The detection process is taking too long. Try reducing browser tabs or restarting your browser.';
      case DetectionErrorType.INSUFFICIENT_MEMORY:
        return 'Your device may be low on memory. Try closing other applications or tabs.';
      default:
        return 'Please try again or refresh the page.';
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/90 text-center z-10">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">{getErrorTitle()}</h3>
      <p className="mb-2 text-muted-foreground">{errorMessage}</p>
      <p className="mb-4 text-sm text-muted-foreground">{getFixSuggestion()}</p>
      <Button onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
};

export default DetectionErrorDisplay;

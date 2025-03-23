
import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { getModelLoadProgress } from '@/lib/human';

interface ModelLoadingScreenProps {
  isModelLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
  loadProgress?: number;
}

const ModelLoadingScreen: React.FC<ModelLoadingScreenProps> = ({
  isModelLoading,
  loadError,
  onRetry,
  loadProgress: externalProgress
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing AI models...');

  // Update progress periodically
  useEffect(() => {
    if (!isModelLoading) return;

    // Use external progress if provided, otherwise poll for it
    if (typeof externalProgress === 'number') {
      setProgress(externalProgress);
    } else {
      const messages = [
        'Initializing AI models...',
        'Loading pose detection model...',
        'Preparing motion tracking engine...',
        'Configuring tracking parameters...',
        'Almost ready...'
      ];

      // Update progress every 300ms
      const interval = setInterval(() => {
        const currentProgress = getModelLoadProgress();
        setProgress(currentProgress);
        
        // Update message based on progress
        const messageIndex = Math.min(
          Math.floor(currentProgress / 20),
          messages.length - 1
        );
        setLoadingMessage(messages[messageIndex]);
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isModelLoading, externalProgress]);

  // If there's an error, show error screen
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-destructive/10 rounded-md">
        <div className="p-3 bg-destructive/20 rounded-full">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold">Loading Failed</h3>
        <p className="text-sm text-center text-muted-foreground max-w-md">
          {loadError}
        </p>
        <p className="text-sm text-center text-muted-foreground max-w-md">
          This could be due to a slow connection, incompatible browser, or limited device capabilities.
        </p>
        <Button variant="outline" onClick={onRetry} className="mt-4 flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  // Show loading screen with progress
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animated percentage */}
          <span className="text-lg font-medium">{progress}%</span>
        </div>
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-30" />
      </div>
      
      <div className="text-center space-y-2 max-w-md">
        <h3 className="text-lg font-semibold">Loading Motion Analysis</h3>
        <p className="text-sm text-muted-foreground">{loadingMessage}</p>
      </div>
      
      <div className="w-full max-w-md">
        <Progress value={progress} className="h-2" />
      </div>
      
      {progress < 20 && (
        <p className="text-xs text-muted-foreground">
          The first load may take 20-30 seconds. It'll be faster next time!
        </p>
      )}
    </div>
  );
};

export default ModelLoadingScreen;

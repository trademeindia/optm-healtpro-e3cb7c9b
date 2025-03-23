
import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, RefreshCw, Info } from 'lucide-react';
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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'good' | 'slow' | 'offline'>('checking');

  // Update progress periodically
  useEffect(() => {
    if (!isModelLoading) return;

    // Track elapsed time for better user feedback
    const timeTracker = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      
      // Check network status after a few seconds
      if (prev === 3) {
        checkNetworkStatus();
      }
    }, 1000);

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

      return () => {
        clearInterval(interval);
        clearInterval(timeTracker);
      };
    }

    return () => clearInterval(timeTracker);
  }, [isModelLoading, externalProgress]);

  // Check network status
  const checkNetworkStatus = async () => {
    try {
      const start = Date.now();
      const response = await fetch('https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/models/blazepose.json', { 
        method: 'HEAD',
        cache: 'no-store'
      });
      const duration = Date.now() - start;
      
      if (!response.ok) {
        console.error('Model file not accessible:', response.status);
        setNetworkStatus('offline');
        return;
      }
      
      // Check response time
      if (duration > 1000) {
        setNetworkStatus('slow');
      } else {
        setNetworkStatus('good');
      }
      
      console.log(`Network check: ${duration}ms, status: ${response.status}`);
    } catch (error) {
      console.error('Network check failed:', error);
      setNetworkStatus('offline');
    }
  };

  // Add a "taking longer than expected" message after 15 seconds
  const showExtendedMessage = elapsedTime > 15;

  // Show network status message
  const getNetworkMessage = () => {
    switch (networkStatus) {
      case 'good':
        return "Network connection is good";
      case 'slow':
        return "Network connection is slow, loading may take longer";
      case 'offline':
        return "Network connection issue detected. Check your internet connection";
      default:
        return "Checking network status...";
    }
  };

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
        <div className="bg-background/80 p-4 rounded-md mt-2 text-sm max-w-md">
          <p className="font-medium mb-2">Troubleshooting tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check your internet connection</li>
            <li>Try using Chrome or Edge for best compatibility</li>
            <li>Disable any browser extensions that might be blocking resources</li>
            <li>If on mobile, try a desktop browser instead</li>
          </ul>
        </div>
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
        
        {showExtendedMessage && (
          <p className="text-xs text-amber-500 mt-2">
            Loading is taking longer than expected. Please be patient...
          </p>
        )}
        
        {elapsedTime > 3 && (
          <div className="mt-2 text-xs flex items-center gap-1.5 justify-center">
            <Info className="h-3 w-3" />
            <span className={networkStatus === 'offline' ? 'text-destructive' : 
                           networkStatus === 'slow' ? 'text-amber-500' : 'text-muted-foreground'}>
              {getNetworkMessage()}
            </span>
          </div>
        )}
      </div>
      
      <div className="w-full max-w-md">
        <Progress value={progress} className="h-2" />
      </div>
      
      {progress < 20 && (
        <p className="text-xs text-muted-foreground">
          The first load may take 20-30 seconds. It'll be faster next time!
        </p>
      )}
      
      {elapsedTime > 30 && (
        <Button variant="outline" onClick={onRetry} className="mt-2 flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Restart Loading
        </Button>
      )}
    </div>
  );
};

export default ModelLoadingScreen;

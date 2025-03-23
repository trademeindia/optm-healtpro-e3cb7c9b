
import React, { useState, useEffect } from 'react';
import { getModelLoadProgress } from '@/lib/human';
import { Spinner } from '@/components/ui/spinner';

interface ModelLoadingScreenProps {
  isLoading: boolean;
  onRetry: () => void;
  error: string | null;
}

const ModelLoadingScreen: React.FC<ModelLoadingScreenProps> = ({
  isLoading,
  onRetry,
  error
}) => {
  const [progress, setProgress] = useState(0);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentProgress = getModelLoadProgress();
      setProgress(currentProgress);
    }, 300);

    // Check and monitor network status
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };
    
    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-background rounded-lg border border-gray-200 shadow-sm">
        <div className="text-red-500 mb-4 text-4xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Model Loading Failed</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error}
        </p>
        <div className="flex flex-col gap-3">
          <div className={`text-sm px-3 py-1 rounded-full ${networkStatus === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Network: {networkStatus === 'online' ? 'Connected' : 'Disconnected'}
          </div>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-background rounded-lg border border-gray-200 shadow-sm">
      <Spinner className="h-12 w-12 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Loading Movement Analysis</h2>
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${Math.max(5, Math.min(progress, 100))}%` }}
        ></div>
      </div>
      <p className="text-muted-foreground">
        {progress < 30 && "Initializing model..."}
        {progress >= 30 && progress < 70 && "Loading movement analysis capabilities..."}
        {progress >= 70 && progress < 100 && "Almost ready..."}
        {progress >= 100 && "Starting movement tracking..."}
      </p>
      <div className="mt-4 text-sm text-gray-500">
        {networkStatus === 'offline' && (
          <div className="text-red-500 mt-2">
            You appear to be offline. Please check your internet connection.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelLoadingScreen;

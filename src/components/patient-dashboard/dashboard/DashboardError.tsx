
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface DashboardErrorProps {
  onRetry: () => void;
  error?: Error | null;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ onRetry, error }) => {
  // Extract helpful error message
  let errorMessage = "We encountered a problem loading your dashboard";
  if (error) {
    if (error.message.includes('Failed to fetch dynamically imported module') || 
        error.message.includes('ChunkLoadError') || 
        error.message.includes('Loading chunk')) {
      errorMessage = "Failed to load required dashboard components. This might be due to network issues or a cached version of the application.";
    } else if (error.message) {
      errorMessage = error.message;
    }
  }

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleClearCache = () => {
    // Clear application cache and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear local storage items related to app state
    localStorage.removeItem('lastRoute');
    
    // Perform a hard reload
    window.location.reload(true);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={onRetry} className="mb-2 sm:mb-0">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={handleGoHome}>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          <Button variant="secondary" onClick={handleClearCache} className="mt-2 sm:mt-0">
            Clear Cache & Reload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardError;


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
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      errorMessage = "Failed to load required dashboard components. This might be due to network issues or a temporary problem.";
    } else if (error.message) {
      errorMessage = error.message;
    }
  }

  const handleGoHome = () => {
    window.location.href = '/';
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
        </div>
      </div>
    </div>
  );
};

export default DashboardError;

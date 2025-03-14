
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading patient data..." 
}) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Spinner size="lg" className="mb-4" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
  description?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  onRetry,
  message = "Could not load patients",
  description = "There was a problem loading the patient data"
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="h-10 w-10 text-destructive mb-4" />
    <h3 className="text-lg font-medium mb-2">{message}</h3>
    <p className="text-muted-foreground mb-4">{description}</p>
    <Button onClick={onRetry}>
      Try Again
    </Button>
  </div>
);

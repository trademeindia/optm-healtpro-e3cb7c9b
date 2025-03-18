
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ConnectionStatusProps } from './types';

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  isLoading, 
  handleConnect 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <Link2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Connect to Google Fit</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Sync your health and fitness data from Google Fit to track your progress and gain insights about your health.
        </p>
        <Button onClick={handleConnect} className="gap-2">
          <Link2 className="h-4 w-4" />
          <span>Connect Google Fit</span>
        </Button>
      </div>
    );
  }

  return null;
};

export default ConnectionStatus;

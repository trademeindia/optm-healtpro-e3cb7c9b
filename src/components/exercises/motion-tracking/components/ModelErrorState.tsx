
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetectionError } from '@/lib/human/types';

interface ModelErrorStateProps {
  loadingError: DetectionError;
}

const ModelErrorState: React.FC<ModelErrorStateProps> = ({ loadingError }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 h-96 bg-muted/30 rounded-lg border">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-semibold mb-2">Failed to Load Motion Detection</h3>
      <p className="text-muted-foreground text-center max-w-md mb-2">
        {loadingError.message || "There was an error loading the motion detection model."}
      </p>
      <p className="text-muted-foreground text-center max-w-md text-sm mb-6">
        Try refreshing the page or checking your internet connection.
      </p>
      <Button onClick={handleRefresh} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh Page
      </Button>
    </div>
  );
};

export default ModelErrorState;

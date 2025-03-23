
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ModelLoadingStateProps {
  loadingProgress: number;
}

const ModelLoadingState: React.FC<ModelLoadingStateProps> = ({ loadingProgress }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 h-96 bg-muted/30 rounded-lg border">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <h3 className="text-xl font-semibold mb-2">Loading Motion Detection</h3>
      <p className="text-muted-foreground text-center max-w-md mb-4">
        Please wait while we load the motion detection model. This may take a moment...
      </p>
      {loadingProgress > 0 && (
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300" 
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ModelLoadingState;

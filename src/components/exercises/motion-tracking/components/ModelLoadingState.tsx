
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

interface ModelLoadingStateProps {
  loadingProgress: number;
}

const ModelLoadingState: React.FC<ModelLoadingStateProps> = ({ loadingProgress }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-muted/10">
      <Spinner size="lg" />
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Loading Motion Analysis Model</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This may take a moment depending on your connection
        </p>
        {loadingProgress > 0 && (
          <div className="w-full max-w-xs bg-secondary rounded-full h-2.5 mb-4">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelLoadingState;

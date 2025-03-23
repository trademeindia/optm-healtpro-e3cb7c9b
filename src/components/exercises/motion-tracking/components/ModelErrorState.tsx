
import React from 'react';
import { Camera } from 'lucide-react';

interface ModelErrorStateProps {
  loadingError: string | null;
}

const ModelErrorState: React.FC<ModelErrorStateProps> = ({ loadingError }) => {
  return (
    <div className="text-center p-8 bg-destructive/10 border border-destructive/30 rounded-md">
      <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-destructive/20">
        <Camera className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-medium mb-2">Model Loading Failed</h3>
      <p className="text-muted-foreground text-sm mb-4">
        {loadingError || "There was a problem loading the motion analysis model."}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Refresh Page
      </button>
    </div>
  );
};

export default ModelErrorState;

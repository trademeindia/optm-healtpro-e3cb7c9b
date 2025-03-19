
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, History, RefreshCw } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleHistory: () => void;
  onRefresh: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  onZoomIn, 
  onZoomOut, 
  onToggleHistory, 
  onRefresh 
}) => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={onZoomOut} title="Zoom out">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onZoomIn} title="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onToggleHistory} title="View symptom history">
        <History className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onRefresh} title="Sync data">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MapControls;

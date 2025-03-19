
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ zoom, onZoomIn, onZoomOut }) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full h-8 w-8 p-0" 
        onClick={onZoomOut}
        disabled={zoom <= 0.6}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Zoom out</span>
      </Button>
      <span className="text-xs font-medium">{Math.round(zoom * 100)}%</span>
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full h-8 w-8 p-0" 
        onClick={onZoomIn}
        disabled={zoom >= 2}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Zoom in</span>
      </Button>
    </div>
  );
};

export default MapControls;

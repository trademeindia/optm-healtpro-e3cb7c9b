
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { MapControlsProps } from './types';

const MapControls: React.FC<MapControlsProps> = ({ 
  zoom, 
  onZoomIn, 
  onZoomOut,
  className = "" 
}) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomOut}
              disabled={zoom <= 0.6}
              className="h-8 w-8"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="text-xs py-1 px-2">
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomIn}
              disabled={zoom >= 2}
              className="h-8 w-8"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="text-xs py-1 px-2">
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MapControls;

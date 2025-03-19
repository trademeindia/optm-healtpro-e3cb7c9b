
import React from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HotspotMarkerProps } from './types';

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, isActive, onClick }) => {
  // Determine tooltip positioning based on hotspot coordinates
  const getTooltipSide = (): "top" | "right" | "bottom" | "left" => {
    if (hotspot.x < 25) return "right";
    if (hotspot.x > 75) return "left";
    if (hotspot.y < 30) return "bottom";
    return "top";
  };

  // Get the severity class for styling
  const getSeverityClass = () => {
    if (!hotspot.severity) return 'hotspot-severity-medium';
    if (hotspot.severity <= 3) return 'hotspot-severity-low';
    if (hotspot.severity <= 6) return 'hotspot-severity-medium';
    return 'hotspot-severity-high';
  };
  
  // Get size class based on severity and active state
  const getSizeClass = () => {
    if (isActive) return 'hotspot-size-lg';
    return hotspot.severity && hotspot.severity > 5 ? 'hotspot-size-md' : 'hotspot-size-sm';
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`hotspot-marker ${getSizeClass()} ${getSeverityClass()} rounded-full ${isActive ? 'hotspot-active hotspot-pulse' : ''}`}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => onClick(hotspot)}
          >
            {isActive && (
              <span className="text-white text-xs font-bold">{hotspot.id}</span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side={getTooltipSide()} 
          className="hotspot-tooltip z-50"
          sideOffset={10}
        >
          <div className="p-2 space-y-1">
            <p className="font-medium text-sm">{hotspot.label}</p>
            {hotspot.description && (
              <p className="text-xs text-muted-foreground">{hotspot.description}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HotspotMarker;


import React from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HotspotMarkerProps } from './types';
import { CircleDot, CircleEllipsis, Activity } from 'lucide-react';

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, isActive, onClick }) => {
  // Determine tooltip positioning based on hotspot location
  const getTooltipPosition = () => {
    // If hotspot is on the right side of the image, position tooltip to the left
    const isRightSide = hotspot.x > 50;
    return isRightSide ? 'left' : 'right';
  };
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1.2 : 1, 
        opacity: 1,
        backgroundColor: hotspot.color
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        position: 'absolute',
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.size}px`,
        height: `${hotspot.size}px`,
        backgroundColor: hotspot.color,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        border: isActive ? '2px solid white' : '1px solid rgba(255,255,255,0.7)',
        boxShadow: isActive 
          ? '0 0 0 2px rgba(255,255,255,0.5), 0 0 10px rgba(0,0,0,0.3)' 
          : '0 0 5px rgba(0,0,0,0.2)'
      }}
      onClick={() => onClick(hotspot)}
      className="hotspot-marker"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      role="button"
      aria-label={`View details for ${hotspot.label}`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="sr-only">{hotspot.label}</span>
          </TooltipTrigger>
          <TooltipContent side={getTooltipPosition()} className="text-xs font-medium">
            {hotspot.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

export default HotspotMarker;

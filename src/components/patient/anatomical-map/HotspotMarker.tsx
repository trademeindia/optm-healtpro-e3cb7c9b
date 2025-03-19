
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

  // Get appropriate size based on severity
  const getMarkerSize = () => {
    if (isActive) return 'w-7 h-7';
    return `w-${Math.min(6, Math.max(4, Math.floor(hotspot.size / 7)))} h-${Math.min(6, Math.max(4, Math.floor(hotspot.size / 7)))}`;
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`absolute cursor-pointer rounded-full flex items-center justify-center region-marker-transition ${isActive ? 'hotspot-pulse' : ''}`}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              backgroundColor: isActive ? hotspot.color : 'rgba(255, 255, 255, 0.7)',
              border: `2px solid ${hotspot.color}`,
              boxShadow: isActive ? '0 0 15px rgba(0, 0, 0, 0.4)' : '0 0 10px rgba(0, 0, 0, 0.3)',
              transform: 'translate(-50%, -50%)', 
              zIndex: isActive ? 30 : 20
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.2, boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
            onClick={() => onClick(hotspot)}
          >
            {isActive ? (
              <span className="text-white text-xs font-bold">{hotspot.id}</span>
            ) : (
              <span className="text-xs font-bold" style={{ color: hotspot.color }}>{hotspot.id}</span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side={getTooltipSide()} 
          className="region-tooltip z-50"
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
